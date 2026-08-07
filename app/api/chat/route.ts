import crypto from 'node:crypto';

import Anthropic from '@anthropic-ai/sdk';
import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

import { QUESTIONS } from '@/lib/questions';
import { SITE_URL } from '@/lib/config';

export const runtime = 'nodejs';
export const maxDuration = 60;

// ─── Économie d'API : 3 étages ────────────────────────────────────────────────
//
// 1. Correspondance forte avec une fiche (E-code ou plusieurs mots précis)
//    → réponse instantanée depuis la base locale, ZÉRO appel API.
// 2. Cache Redis 30 jours : une question déjà posée par quelqu'un d'autre
//    → réponse servie depuis le cache, ZÉRO appel API.
// 3. Sinon seulement → appel Claude, et la réponse rejoint le cache.
//
// Bonus : chaque première question est comptée dans une « mine » Redis
// (sorted set halalgpt:questions) → les questions les plus posées deviennent
// les prochaines pages SEO à créer.
//
// Redis est optionnel : sans variables d'environnement, les étages 2-3 cache
// sont simplement sautés (l'étage 1 fonctionne toujours).

const SYSTEM_PROMPT = `Tu es HalalGPT, l'IA musulmane. Ton identité : tu réponds à TOUTE question — religion, nourriture, produits, voyage, Ramadan, vie quotidienne, santé, science, société — en tenant toujours compte de l'islam dans ta réponse. L'utilisateur te choisit précisément parce que tes réponses respectent et intègrent sa religion, contrairement aux IA généralistes.

Règles :
- Réponds en français (ou dans la langue de l'utilisateur), avec un ton chaleureux et le tutoiement.
- Sois concis et direct : l'utilisateur veut un verdict clair, puis l'explication essentielle. Pas de disclaimers à rallonge.
- Pour les sujets non religieux (science, santé, quotidien, conseils), donne d'abord une réponse utile et exacte, puis relie-la naturellement à la perspective islamique quand c'est pertinent (éthique, invocation adaptée, sagesse prophétique) — sans forcer artificiellement et sans inventer de règle religieuse qui n'existe pas.
- Si l'utilisateur envoie une PHOTO (produit, liste d'ingrédients, plat, boisson, lieu) : identifie ce qui est visible (ingrédients, codes E, mentions, logos de certification) et donne le verdict halal correspondant. Si la liste d'ingrédients est illisible ou absente, dis-le et demande une photo nette de la liste d'ingrédients. Ne devine jamais un ingrédient que tu ne vois pas.
- Sur les questions religieuses, présente l'avis majoritaire et mentionne brièvement les divergences notables entre écoles quand elles existent. Ne délivre jamais de fatwa personnelle : pour un cas particulier, oriente vers un savant ou un organisme de certification.
- N'invente jamais de nom de restaurant, de certificat ou de composition de produit. En cas d'incertitude sur un produit précis, dis-le et conseille de vérifier l'étiquette ou la certification.
- Pour les questions de lieux (restaurants, mosquées), donne des conseils de méthode et mentionne que l'app VoyagesHalal géolocalise les adresses halal vérifiées.
- Quand l'utilisateur veut vérifier un produit en magasin ou parle de courses, tu peux mentionner HalalCheck.fr, le scanner de codes-barres halal gratuit de la même famille (verdict immédiat en rayon).
- DOMAINE EXCLU — la finance : crédit, intérêts, riba, banque, placements, bourse, trading, crypto, assurances, épargne, jeux d'argent, paris. Ne donne JAMAIS d'avis religieux sur ces sujets, même reformulés ou en question de suivi. Réponds uniquement que HalalGPT ne traite pas la finance car les enjeux sont trop importants, et oriente vers un savant qualifié ou un organisme spécialisé en finance islamique.`;

interface IncomingMessage {
  role: 'user' | 'assistant';
  content: string;
  /** Photo de l'utilisateur (dataURL JPEG/PNG/WebP), analysée par l'IA. */
  image?: string;
}

// Une photo doit être un dataURL image raisonnable (≈ 2 Mo max une fois encodé).
const IMAGE_PATTERN = /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/;
const IMAGE_MAX_CHARS = 2_800_000;

function validImage(image: unknown): image is string {
  return typeof image === 'string' && image.length <= IMAGE_MAX_CHARS && IMAGE_PATTERN.test(image);
}

// ─── Redis (optionnel) ────────────────────────────────────────────────────────

let redisClient: Redis | null | undefined;

function getRedis(): Redis | null {
  if (redisClient !== undefined) return redisClient;
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  redisClient = url && token ? new Redis({ url, token }) : null;
  return redisClient;
}

// ─── Normalisation & matching ─────────────────────────────────────────────────

const GENERIC_WORDS = new Set([
  'halal', 'haram', 'manger', 'mange', 'plat', 'plats', 'question', 'peut',
  'peux', 'suis', 'veux', 'voudrais', 'aimerais', 'jaimerais', 'jaimerai',
  'aime', 'quel', 'quelle', 'quels', 'quelles', 'comment', 'pourquoi',
  'avec', 'sans', 'pour', 'dans', 'bien', 'bonne', 'salam', 'bonjour',
  'salut', 'merci', 'estce', 'cest', 'quoi', 'trouver', 'trouve', 'faire',
]);

function normalize(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function significantWords(question: string): string[] {
  return normalize(question)
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 3 && !GENERIC_WORDS.has(w));
}

function formatFiche(qa: (typeof QUESTIONS)[number]): string {
  return `${qa.verdict}\n\n${qa.short}\n\n${qa.answer[0]}\n\n👉 Réponse complète : ${SITE_URL}/q/${qa.slug}`;
}

/** Étage 1 : correspondance FORTE uniquement (E-code exact, ou ≥ 3 mots précis). */
function strongLocalMatch(question: string): string | null {
  const q = normalize(question);

  // E-code explicite (« e120 », « e 471 ») présent dans le slug d'une fiche
  const eCode = q.match(/\be\s?(\d{3}[a-z]?)\b/);
  if (eCode) {
    const hit = QUESTIONS.find((qa) => qa.slug.includes(`e${eCode[1]}`));
    if (hit) return formatFiche(hit);
  }

  const words = significantWords(question);
  let best: (typeof QUESTIONS)[number] | null = null;
  let bestScore = 0;
  for (const qa of QUESTIONS) {
    const haystack = normalize(`${qa.question} ${qa.slug} ${qa.short}`);
    const score = words.reduce((n, w) => (haystack.includes(w) ? n + 1 : n), 0);
    if (score > bestScore) {
      bestScore = score;
      best = qa;
    }
  }
  return best && bestScore >= 3 ? formatFiche(best) : null;
}

/** Repli (pas de clé API / erreur) : matching souple, ou réponse honnête. */
function localFallback(question: string): string {
  const words = significantWords(question);
  let best: (typeof QUESTIONS)[number] | null = null;
  let bestScore = 0;
  for (const qa of QUESTIONS) {
    const haystack = normalize(`${qa.question} ${qa.slug} ${qa.short}`);
    const score = words.reduce((n, w) => (haystack.includes(w) ? n + 1 : n), 0);
    if (score > bestScore) {
      bestScore = score;
      best = qa;
    }
  }
  if (best && bestScore >= 1) return formatFiche(best);
  return "Je n'ai pas encore de fiche précise sur ce sujet, je préfère te le dire plutôt que de répondre à côté 🌙\n\nVoici ce que je connais bien :\n🔍 Les additifs — E120, E471, gélatine, présure…\n🍬 Les produits — Haribo, Kinder, Coca, Red Bull…\n🍽 Où manger halal — Paris, Lyon, Marseille\n✈️ Le voyage — avion, destinations, Ramadan, prière\n\nEt très bientôt, branché à mon IA complète, je pourrai répondre à tout !";
}

// ─── Cache & mine de questions ────────────────────────────────────────────────

function cacheKey(question: string): string {
  const hash = crypto.createHash('sha1').update(normalize(question).trim()).digest('hex');
  return `halalgpt:cache:${hash}`;
}

async function logQuestion(question: string): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  try {
    // La mine d'or : classement des questions réellement posées
    await redis.zincrby('halalgpt:questions', 1, normalize(question).trim().slice(0, 140));
  } catch {
    /* la télémétrie ne doit jamais casser une réponse */
  }
}

// ─── Domaine bloqué : la finance ──────────────────────────────────────────────
//
// Décision éditoriale : HalalGPT ne répond à AUCUNE question de finance
// (crédit, riba, placements, crypto, assurances, jeux d'argent…). Enjeux trop
// lourds pour une réponse automatique. Le filtre s'applique AVANT le cache et
// AVANT l'IA — réponse fixe, déterministe, y compris sur les questions de suivi.
// (Le mot « paris » seul n'est PAS bloqué : il désigne d'abord la ville.)

const FINANCE_PATTERN = new RegExp(
  '\\b(' +
    [
      'credit', 'credits', 'riba', 'interets', 'usure',
      'banque', 'banques', 'bancaire', 'bancaires', 'neobanque',
      'emprunt', 'emprunter', 'hypotheque', 'hypothecaire', 'mourabaha', 'murabaha',
      'bourse', 'trading', 'trader', 'forex', 'cfd', 'etf', 'dividende', 'dividendes',
      'investir', 'investissement', 'investissements', 'placement', 'placements',
      'crypto', 'cryptomonnaie', 'cryptomonnaies', 'bitcoin', 'btc', 'ethereum', 'nft', 'staking', 'binance',
      'assurance', 'assurances', 'livret', 'epargne', 'epargner', 'takaful',
      'leasing', 'loa', 'lld', 'pret immobilier', 'pret bancaire', 'pret a interet',
      'pari sportif', 'paris sportifs', 'parier', 'bookmaker', 'winamax', 'betclic', 'unibet',
      'loto', 'loterie', 'casino', 'poker', 'jackpot', 'jeux d.argent', 'jeu d.argent',
    ].join('|') +
    ')\\b'
);

const FINANCE_REPLY = `🔒 La finance (crédit, placements, crypto, assurances, jeux d'argent…) est un domaine que HalalGPT ne traite volontairement pas : les enjeux sont trop importants pour une réponse automatique, et chaque situation est particulière.

👉 Pour ces questions, rapproche-toi d'un savant qualifié ou d'un organisme spécialisé en finance islamique.

Je reste à ton service pour tout le reste : additifs, produits, restaurants, voyage, Ramadan 🌙`;

function isFinanceQuestion(question: string): boolean {
  return FINANCE_PATTERN.test(normalize(question));
}

// ─── Route ────────────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  let incoming: IncomingMessage[];
  try {
    const body = (await request.json()) as { messages?: IncomingMessage[] };
    incoming = (body.messages ?? [])
      .filter(
        (m) =>
          (m.role === 'user' || m.role === 'assistant') &&
          typeof m.content === 'string' &&
          (m.content.trim() !== '' || validImage(m.image))
      )
      .map((m) => ({
        role: m.role,
        content: m.content,
        // Seule une image valide, portée par le DERNIER message utilisateur,
        // sera transmise à l'IA (voir plus bas) — le reste est ignoré.
        ...(m.role === 'user' && validImage(m.image) ? { image: m.image } : {}),
      }));
  } catch {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 });
  }

  if (incoming.length === 0) {
    return NextResponse.json({ error: 'messages[] requis' }, { status: 400 });
  }

  const lastUserMessage = [...incoming].reverse().find((m) => m.role === 'user');
  const lastQuestion = lastUserMessage?.content ?? '';
  const hasImage = Boolean(lastUserMessage?.image);
  // Seule la PREMIÈRE question d'une conversation est mise en cache : les
  // suivantes dépendent du contexte, on les laisse toujours à l'IA.
  const isFirstQuestion = incoming.filter((m) => m.role === 'user').length === 1;

  // Verrou finance : intercepté avant la fiche locale, le cache ET l'IA.
  if (isFinanceQuestion(lastQuestion)) {
    if (isFirstQuestion) await logQuestion(lastQuestion);
    return NextResponse.json({ reply: FINANCE_REPLY, source: 'bloque' });
  }

  if (isFirstQuestion && lastQuestion.trim()) {
    await logQuestion(lastQuestion);
  }

  // Avec une photo, la question est unique : fiches et cache ne s'appliquent pas.
  if (isFirstQuestion && !hasImage) {
    // Étage 1 — fiche locale en correspondance forte : zéro API
    const fiche = strongLocalMatch(lastQuestion);
    if (fiche) return NextResponse.json({ reply: fiche, source: 'fiche' });

    // Étage 2 — cache Redis : zéro API
    const redis = getRedis();
    if (redis) {
      try {
        const cached = await redis.get<string>(cacheKey(lastQuestion));
        if (cached) return NextResponse.json({ reply: cached, source: 'cache' });
      } catch {
        /* cache indisponible → on continue vers l'IA */
      }
    }
  }

  // Étage 3 — l'IA
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ reply: localFallback(lastQuestion) });
  }

  try {
    const anthropic = new Anthropic();
    const response = await anthropic.beta.messages.create({
      model: 'claude-opus-5',
      max_tokens: 4096,
      // Effort bas : réponses de chat courtes, latence maîtrisée sur mobile.
      output_config: { effort: 'low' },
      // Fallback serveur : si les classificateurs déclinent, l'API relance
      // automatiquement sur le modèle recommandé.
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      system: SYSTEM_PROMPT,
      messages: incoming.slice(-20).map((m, idx, arr) => {
        // La photo n'est transmise que sur le dernier message : les tours
        // suivants gardent le texte seul (économie de tokens).
        if (m.image && idx === arr.length - 1 && m.role === 'user') {
          const comma = m.image.indexOf(',');
          const mediaType = m.image.slice(5, m.image.indexOf(';')) as
            | 'image/jpeg'
            | 'image/png'
            | 'image/webp';
          return {
            role: m.role,
            content: [
              {
                type: 'image' as const,
                source: {
                  type: 'base64' as const,
                  media_type: mediaType,
                  data: m.image.slice(comma + 1),
                },
              },
              { type: 'text' as const, text: m.content || 'Analyse cette photo : est-ce halal ?' },
            ],
          };
        }
        return { role: m.role, content: m.content };
      }),
    });

    if (response.stop_reason === 'refusal') {
      return NextResponse.json({
        reply: "Désolé, je ne peux pas répondre à cette demande. Pose-moi plutôt une question halal ! 🌙",
      });
    }

    const reply = response.content
      .map((block) => (block.type === 'text' ? block.text : ''))
      .join('')
      .trim();

    if (reply && isFirstQuestion && !hasImage) {
      const redis = getRedis();
      if (redis) {
        try {
          await redis.set(cacheKey(lastQuestion), reply, { ex: 60 * 60 * 24 * 30 });
        } catch {
          /* cache indisponible → tant pis, la réponse part quand même */
        }
      }
    }

    return NextResponse.json({ reply: reply || localFallback(lastQuestion) });
  } catch (error) {
    console.error('HalalGPT /api/chat:', error);
    return NextResponse.json({ reply: localFallback(lastQuestion) });
  }
}
