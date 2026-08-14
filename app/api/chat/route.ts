import crypto from 'node:crypto';

import Anthropic from '@anthropic-ai/sdk';

import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

import { MOTS_VIDES } from '@/lib/mots-vides.js';
import { QUESTIONS } from '@/lib/questions';
import { SITE_URL } from '@/lib/config';
import { avecDelai, sansAttendre, DELAI_REDIS } from '@/lib/delai';

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
//
// ─── La réponse part en flux ──────────────────────────────────────────────────
//
// Avant, on attendait la réponse ENTIÈRE avant d'afficher quoi que ce soit :
// plusieurs secondes d'écran figé, le pire moment du produit. Désormais les
// mots arrivent au fur et à mesure — la première ligne s'affiche presque tout
// de suite, et l'attente ne se sent plus.
//
// Les trois étages renvoient tous un flux de texte brut, même la fiche locale
// et le cache qui sont pourtant instantanés : le client n'a ainsi qu'UN SEUL
// chemin de lecture, sans branchement selon la provenance.

const EN_TETES_FLUX = {
  'Content-Type': 'text/plain; charset=utf-8',
  'Cache-Control': 'no-store',
  // Sans cela, un proxy peut retenir les morceaux et tout livrer d'un coup :
  // le flux serait techniquement correct et parfaitement inutile.
  'X-Accel-Buffering': 'no',
};

/** Renvoie un texte déjà connu sous forme de flux, en un seul morceau. */
function fluxImmediat(texte: string): Response {
  return new Response(
    new ReadableStream({
      start(controleur) {
        controleur.enqueue(new TextEncoder().encode(texte));
        controleur.close();
      },
    }),
    { headers: EN_TETES_FLUX }
  );
}

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

// La liste vit dans lib/mots-vides.js, importee AUSSI par scripts/test-repli.mjs.
// Elle etait en double : le test mesurait sa propre copie, donc il pouvait
// passer pendant que le site echouait. C'est arrive.
const GENERIC_WORDS = MOTS_VIDES;

function normalize(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function significantWords(question: string): string[] {
  return normalize(question)
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 3 && !GENERIC_WORDS.has(w));
}

// ─── Comparer des MOTS, pas des bouts de mots ────────────────────────────────
//
// Avec `includes`, « sept » trouvait « septembre » et « assis » trouvait
// « assistance » : une question d'arithmetique tombait sur une fiche de zakat.
// On compare donc des jetons. Un prefixe reste admis a partir de cinq lettres,
// pour que « priere » retrouve « prieres » sans que « sept » ne retrouve rien.

function jetons(texte: string): Set<string> {
  return new Set(normalize(texte).split(/[^a-z0-9]+/).filter(Boolean));
}

function contient(ensemble: Set<string>, mot: string): boolean {
  if (ensemble.has(mot)) return true;
  if (mot.length < 5) return false;
  for (const j of ensemble) if (j.startsWith(mot)) return true;
  return false;
}

/** Index des fiches, calcule une seule fois au demarrage du module. */
const INDEX = QUESTIONS.map((qa) => ({
  qa,
  fort: jetons(`${qa.question} ${qa.slug}`),
  faible: jetons(qa.short),
}));

// Un mot present dans presque toutes les fiches ne designe rien ; un mot rare
// designe presque a lui seul. « voyage » est dans une vingtaine de fiches,
// « nutella » dans deux — les compter pareil etait toute l'erreur du repli.
const RARETE = new Map<string, number>();
function rarete(mot: string): number {
  let r = RARETE.get(mot);
  if (r === undefined) {
    const n = INDEX.reduce((k, c) => (contient(c.fort, mot) || contient(c.faible, mot) ? k + 1 : k), 0);
    r = Math.log(QUESTIONS.length / (1 + n)) + 0.2;
    RARETE.set(mot, r);
  }
  return r;
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

  // Cet étage servait la fiche dès que TROIS mots de la question se trouvaient
  // dans une fiche. Mesuré le 11 août sur les vraies requêtes de la Search
  // Console : 4 sur 17 en profitaient. « le tatouage est il permis », « les
  // bonbons haribo sont ils halal », « la musique est elle haram » attendaient
  // l'IA — alors qu'une fiche écrite à la main répond exactement à la question.
  //
  // Une question courte et précise n'a qu'UN mot qui compte, et c'est le plus
  // rare. Compter les mots ne pouvait donc pas marcher : c'est la même erreur
  // que le repli faisait avant d'être corrigé le 10 août.
  //
  // On réutilise donc la règle du repli — poids par rareté, et une SÉPARATION
  // exigée plutôt qu'un seuil absolu — mais avec une barre plus haute, parce
  // que cet étage-ci saute l'IA ET ne s'annonce pas. Le repli, lui, prévient
  // qu'il est un repli ; se tromper ici coûte donc plus cher.
  const { best, motsForts, meilleur, second } = meilleureFiche(question);

  const evident =
    best !== null &&
    motsForts >= 1 &&
    meilleur >= 2 &&
    // Deux mots forts : il suffit de devancer nettement la suivante.
    // Un seul : il doit devancer DEUX FOIS la suivante. Le repli, qui prévient
    // qu'il est un repli, se contente de 1,5 ; ici on ne prévient pas, donc on
    // demande plus.
    //
    // 2,5 au premier essai : « le tatouage est il permis » était refusé, alors
    // que la fiche « tatouage » est la bonne à l'évidence. Le mot « permis »,
    // banal, remonte la fiche suivante et écrase la séparation. 2 laisse passer
    // ce cas et refuse toujours « voyage halal paris » — le défaut historique.
    (motsForts >= 2 ? meilleur >= second * 1.5 : meilleur >= second * 2);

  return evident && best ? formatFiche(best) : null;
}

/** Repli (pas de clé API / erreur) : matching souple, ou réponse honnête. */
/**
 * Cherche la fiche qui repond le mieux, et rend de quoi juger si on peut s'y
 * fier : le nombre de mots tombes dans le titre, le score du premier, celui du
 * second.
 *
 * Une seule mesure pour deux etages. L'etage 1 et le repli posaient la meme
 * question a des calculs differents — l'un comptait les mots, l'autre les
 * pesait — et l'un des deux se trompait forcement. C'etait l'etage 1.
 * Le JUGEMENT, lui, reste propre a chaque etage : le repli s'annonce, l'etage 1
 * non, donc l'etage 1 exige davantage.
 */
function meilleureFiche(question: string) {
  const mots = significantWords(question);
  let best: (typeof QUESTIONS)[number] | null = null;
  let motsForts = 0;
  let meilleur = 0;
  let second = 0;

  for (const c of INDEX) {
    let nFort = 0;
    let score = 0;
    for (const w of mots) {
      const poids = rarete(w);
      if (contient(c.fort, w)) {
        nFort++;
        score += poids;
      } else if (contient(c.faible, w)) {
        // Un mot croise seulement dans un resume est souvent un hasard.
        score += poids * 0.3;
      }
    }
    if (score > meilleur) {
      second = meilleur;
      meilleur = score;
      motsForts = nFort;
      best = c.qa;
    } else if (score > second) {
      second = score;
    }
  }

  return { best, motsForts, meilleur, second };
}

function localFallback(question: string): string {
  const { best, motsForts, meilleur, second } = meilleureFiche(question);

  // Un mot au moins doit tomber dans le titre ou le slug. Ensuite, plutot qu'un
  // seuil absolu — toujours trop haut pour un mot et trop bas pour un autre —
  // on exige une SEPARATION : soit deux mots designent la meme fiche, soit elle
  // devance nettement la suivante. « voyage halal paris » echoue aux deux, une
  // dizaine de fiches de voyage etant a egalite derriere : on prefere l'avouer
  // plutot que de repondre Istanbul a quelqu'un qui parle de Paris.
  const solide =
    best !== null && motsForts >= 1 && meilleur >= 1.5 && (motsForts >= 2 || meilleur >= second * 1.5);

  // Et surtout : ce repli ne se fait jamais passer pour une vraie reponse.
  // Il ne sert que lorsque l'IA est injoignable, et le dire honnetement vaut
  // mieux que de laisser croire a une reponse complete.
  const PREAMBULE =
    '⚠️ Je n’arrive pas à joindre mon IA en ce moment. Voici ce que je peux te donner depuis mes fiches, en attendant que tu réessaies :\n\n';

  if (solide && best) return PREAMBULE + formatFiche(best);

  return (
    PREAMBULE +
    "Et sur ce sujet précis, je n’ai pas de fiche : je préfère te le dire plutôt que de répondre à côté 🌙\n\nVoici ce que je connais bien :\n🔍 Les additifs — E120, E471, gélatine, présure…\n🍬 Les produits — Haribo, Kinder, Coca, Red Bull…\n🍽 Où manger halal — Paris, Lyon, Marseille\n✈️ Le voyage — avion, destinations, Ramadan, prière\n\nRéessaie dans un instant : mon IA complète répond à tout."
  );
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
    // Compteur de la mine : personne n'attend son resultat.
    sansAttendre(redis.zincrby('halalgpt:questions', 1, normalize(question).trim().slice(0, 140)));
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
      // Jeux de hasard nommés autrement : sans eux, la question passait au
      // travers du verrou et partait à l'IA. Jamais « pari » ni « paris »
      // seuls ici non plus — ce serait la ville.
      'tombola', 'grattage', 'jeux de hasard', 'jeu de hasard', 'machine a sous', 'machines a sous',
    ].join('|') +
    ')\\b'
);

// ─── Ce qui fait consensus passe, le reste est arrêté ─────────────────────────
//
// Décision de Mohamed, le 10 août : on peut traiter les sujets sur lesquels les
// savants sont UNANIMES, et eux seuls. Trois le sont — les jeux de hasard et le
// principe du riba — et ils tiennent à un verset explicite, sans divergence
// entre écoles.
//
// Tout le reste est arrêté, et pour une raison précise : un crédit immobilier,
// une assurance, un placement, ce n'est pas une règle générale, c'est UNE
// SITUATION. Les savants qualifiés eux-mêmes y divergent. Répondre à la place de
// quelqu'un sur un engagement de vingt ans, c'est exactement le risque que le
// site refuse de prendre.
//
// La règle tient en une phrase : LE PRINCIPE OUI, LE CAS PERSONNEL JAMAIS.
//
// Ces sujets ne passent pas par l'IA : ils sont servis depuis la fiche écrite,
// contrôlée mot à mot. Une IA à qui l'on ouvre la porte du principe répondra
// aussi à « et mon crédit à moi ? » — c'est justement ce qu'on ne veut pas.

const CONSENSUS: { motif: RegExp; slug: string }[] = [
  {
    // Jamais « pari » ni « paris » seuls : « restaurant halal paris » parle de
    // la ville. On exige un mot qui lève l'ambiguïté.
    motif: /\bparis? sportifs?\b|\bparier\b|\bparie\b|\bbookmaker\b|\bwinamax\b|\bbetclic\b|\bunibet\b|\bbetting\b/,
    slug: 'paris-sportifs-halal',
  },
  {
    motif: /\b(loto|loterie|tombola|gratter|grattage|casino|poker|jackpot|machine a sous|jeux d.argent|jeu d.argent|jeux de hasard|jeu de hasard)\b/,
    slug: 'loto-jeux-hasard-halal',
  },
  {
    // Le PRINCIPE seulement : « pourquoi », « c'est quoi », « est-ce interdit ».
    // « mon credit », « ma banque », « mon assurance » ne passent pas ici.
    motif: /\briba\b|\busure\b|\b(interet|interets)\b/,
    slug: 'riba-interet-islam',
  },
];

/** La question porte-t-elle sur un sujet unanime ? Renvoie la fiche, ou null. */
function ficheConsensus(question: string): string | null {
  const q = normalize(question);
  // Un cas personnel ferme la porte, même si le mot « riba » apparaît :
  // « le riba de mon prêt immobilier » reste une situation, pas un principe.
  const casPersonnel =
    /\b(credit|credits|emprunt|emprunter|pret|prets|hypotheque|hypothecaire|banque|bancaire|assurance|livret|epargne|placement|placements|investir|investissement|bourse|trading|crypto|bitcoin|leasing|loa|lld)\b/;
  if (casPersonnel.test(q)) return null;
  for (const c of CONSENSUS) {
    if (c.motif.test(q)) {
      const fiche = QUESTIONS.find((qa) => qa.slug === c.slug);
      if (fiche) return formatFiche(fiche);
    }
  }
  return null;
}

const FINANCE_REPLY = `🔒 Je ne me prononce pas sur une situation financière personnelle — crédit, banque, assurance, placements, crypto. Les savants qualifiés eux-mêmes divergent sur ces questions, et un engagement de plusieurs années ne se décide pas d'après une réponse automatique.

👉 Pour ta situation, adresse-toi à un savant ou à un organisme spécialisé en finance islamique.

📖 En revanche, je peux t'expliquer ce qui fait l'unanimité des savants :
• Pourquoi l'intérêt (riba) est interdit → ${SITE_URL}/q/riba-interet-islam
• Les paris sportifs → ${SITE_URL}/q/paris-sportifs-halal
• Le loto et les jeux de hasard → ${SITE_URL}/q/loto-jeux-hasard-halal

Et je reste à ton service pour tout le reste : additifs, produits, restaurants, voyage, Ramadan 🌙`;

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
  // Les trois sujets unanimes sont servis depuis leur fiche écrite ; tout le
  // reste reçoit le refus, qui n'est plus un mur mais un renvoi vers elles.
  if (isFinanceQuestion(lastQuestion)) {
    if (isFirstQuestion) await logQuestion(lastQuestion);
    const unanime = ficheConsensus(lastQuestion);
    return fluxImmediat(unanime ?? FINANCE_REPLY);
  }

  if (isFirstQuestion && lastQuestion.trim()) {
    await logQuestion(lastQuestion);
  }

  // Avec une photo, la question est unique : fiches et cache ne s'appliquent pas.
  if (isFirstQuestion && !hasImage) {
    // Étage 1 — fiche locale en correspondance forte : zéro API
    const fiche = strongLocalMatch(lastQuestion);
    if (fiche) return fluxImmediat(fiche);

    // Étage 2 — cache Redis : zéro API
    const redis = getRedis();
    if (redis) {
      try {
        // Un cache lent est pire que pas de cache : on repartirait pour un
        // appel au modele APRES l'avoir attendu. Passe le delai, on considere
        // que c'est un manque et on interroge le modele tout de suite.
        const cached = await avecDelai(redis.get<string>(cacheKey(lastQuestion)), DELAI_REDIS, null);
        if (cached) return fluxImmediat(cached);
      } catch {
        /* cache indisponible → on continue vers l'IA */
      }
    }
  }

  // Étage 3 — l'IA
  if (!process.env.ANTHROPIC_API_KEY) {
    return fluxImmediat(localFallback(lastQuestion));
  }

  const REFUS =
    "Désolé, je ne peux pas répondre à cette demande. Pose-moi plutôt une question halal ! 🌙";

  try {
    // VOLONTAIREMENT SANS DELAI MAXIMUM, et ce n'est pas un oubli : ne le
    // « corrige » pas sans lire ceci.
    //
    // Les autres appels du site en ont un parce qu'ils font attendre devant un
    // ecran vide. Celui-ci DIFFUSE : la personne voit les mots arriver un par
    // un, donc elle voit que ca avance. Couper a 45 s tronquerait une reponse
    // longue en train de s'ecrire correctement — on remplacerait une attente
    // visible par une reponse mutilee, ce qui est pire.
    //
    // La regle : on coupe quand il y a un repli a servir, on accompagne quand
    // il n'y en a pas. Ici le flux EST l'accompagnement.
    const anthropic = new Anthropic();
    const flux = await anthropic.beta.messages.create({
      model: 'claude-opus-5',
      max_tokens: 4096,
      stream: true,
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

    const encodeur = new TextEncoder();
    let complet = '';
    let refus = false;

    const corps = new ReadableStream<Uint8Array>({
      async start(controleur) {
        try {
          for await (const evenement of flux) {
            if (
              evenement.type === 'content_block_delta' &&
              evenement.delta.type === 'text_delta'
            ) {
              complet += evenement.delta.text;
              controleur.enqueue(encodeur.encode(evenement.delta.text));
            } else if (
              evenement.type === 'message_delta' &&
              evenement.delta.stop_reason === 'refusal'
            ) {
              refus = true;
            }
          }
        } catch (erreur) {
          // Coupure en cours de route. Si des mots sont déjà partis, on les
          // garde plutôt que d'effacer l'écran du lecteur ; s'il n'y a rien,
          // on sert la réponse de secours.
          console.error('HalalGPT /api/chat (flux):', erreur);
        }

        if (!complet) {
          controleur.enqueue(encodeur.encode(refus ? REFUS : localFallback(lastQuestion)));
        }
        controleur.close();

        // Le cache s'écrit APRÈS la fermeture du flux : le lecteur a déjà tout
        // reçu, Redis ne doit jamais retarder l'affichage.
        if (complet && !refus && isFirstQuestion && !hasImage) {
          const redis = getRedis();
          if (redis) {
            try {
              // La reponse est deja partie au lecteur : on n'attend pas
              // l'ecriture du cache pour fermer le flux.
              sansAttendre(redis.set(cacheKey(lastQuestion), complet.trim(), { ex: 60 * 60 * 24 * 30 }));
            } catch {
              /* cache indisponible → tant pis, la réponse est déjà partie */
            }
          }
        }
      },
    });

    return new Response(corps, { headers: EN_TETES_FLUX });
  } catch (error) {
    console.error('HalalGPT /api/chat:', error);
    return fluxImmediat(localFallback(lastQuestion));
  }
}
