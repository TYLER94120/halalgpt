import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

import { QUESTIONS } from '@/lib/questions';
import { SITE_URL } from '@/lib/config';

export const runtime = 'nodejs';
export const maxDuration = 60;

const SYSTEM_PROMPT = `Tu es HalalGPT, l'assistant qui répond à toutes les questions halal : additifs alimentaires (E120, E471…), produits et marques, restaurants et voyage halal, Ramadan, pratique religieuse du voyageur.

Règles :
- Réponds en français (ou dans la langue de l'utilisateur), avec un ton chaleureux et le tutoiement.
- Sois concis et direct : l'utilisateur veut un verdict clair, puis l'explication essentielle. Pas de disclaimers à rallonge.
- Sur les questions religieuses, présente l'avis majoritaire et mentionne brièvement les divergences notables entre écoles quand elles existent. Ne délivre jamais de fatwa personnelle : pour un cas particulier, oriente vers un savant ou un organisme de certification.
- N'invente jamais de nom de restaurant, de certificat ou de composition de produit. En cas d'incertitude sur un produit précis, dis-le et conseille de vérifier l'étiquette ou la certification.
- Pour les questions de lieux (restaurants, mosquées), donne des conseils de méthode et mentionne que l'app VoyagesHalal géolocalise les adresses halal vérifiées.`;

interface IncomingMessage {
  role: 'user' | 'assistant';
  content: string;
}

// ─── Repli local : matching par mots-clés sur la base de questions ────────────

function normalize(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// Mots trop génériques pour identifier un sujet — ignorés par le matching,
// sinon « manger un plat sain » matche la fiche « plat cuisiné à l'alcool ».
const GENERIC_WORDS = new Set([
  'halal', 'haram', 'manger', 'mange', 'plat', 'plats', 'question', 'peut',
  'peux', 'suis', 'veux', 'voudrais', 'aimerais', 'jaimerais', 'jaimerai',
  'aime', 'quel', 'quelle', 'quels', 'quelles', 'comment', 'pourquoi',
  'avec', 'sans', 'pour', 'dans', 'bien', 'bonne', 'salam', 'bonjour',
  'salut', 'merci', 'estce', 'cest', 'quoi', 'trouver', 'trouve', 'faire',
]);

function localFallback(question: string): string {
  const words = normalize(question)
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 3 && !GENERIC_WORDS.has(w));

  let best = null as (typeof QUESTIONS)[number] | null;
  let bestScore = 0;
  for (const qa of QUESTIONS) {
    const haystack = normalize(`${qa.question} ${qa.slug} ${qa.short}`);
    const score = words.reduce((n, w) => (haystack.includes(w) ? n + 1 : n), 0);
    if (score > bestScore) {
      bestScore = score;
      best = qa;
    }
  }

  if (best && bestScore >= 1) {
    return `${best.verdict}\n\n${best.short}\n\n${best.answer[0]}\n\n👉 Réponse complète : ${SITE_URL}/q/${best.slug}`;
  }
  return "Je n'ai pas encore de fiche précise sur ce sujet, je préfère te le dire plutôt que de répondre à côté 🌙\n\nVoici ce que je connais bien :\n🔍 Les additifs — E120, E471, gélatine, présure…\n🍬 Les produits — Haribo, Kinder, Coca, Red Bull…\n🍽 Où manger halal — Paris, Lyon, Marseille\n✈️ Le voyage — avion, destinations, Ramadan, prière\n\nEt très bientôt, branché à mon IA complète, je pourrai répondre à tout !";
}

// ─── Route ────────────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  let incoming: IncomingMessage[];
  try {
    const body = (await request.json()) as { messages?: IncomingMessage[] };
    incoming = (body.messages ?? []).filter(
      (m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string'
    );
  } catch {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 });
  }

  if (incoming.length === 0) {
    return NextResponse.json({ error: 'messages[] requis' }, { status: 400 });
  }

  const lastQuestion = [...incoming].reverse().find((m) => m.role === 'user')?.content ?? '';

  // Sans clé API (ex: préproduction), le site répond depuis la base locale.
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
      messages: incoming.slice(-20).map((m) => ({ role: m.role, content: m.content })),
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

    return NextResponse.json({ reply: reply || localFallback(lastQuestion) });
  } catch (error) {
    console.error('HalalGPT /api/chat:', error);
    return NextResponse.json({ reply: localFallback(lastQuestion) });
  }
}
