import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

import { avecDelai, sansAttendre, DELAI_REDIS } from '@/lib/delai';
import { nettoyerPourLaVoix, retirerArabe } from '@/lib/voix.js';

// ─── La voix serveur du mode conduite ────────────────────────────────────────
//
// Verdict de Mohamed apres essai au volant, 14 aout : voix basse, accent
// faux, « qualite en bois ». Il a raison, et ce n'est pas reparable dans le
// navigateur : speechSynthesis depend des voix installees sur CHAQUE
// telephone — une loterie d'appareil. Pour une voix du niveau de ChatGPT, la
// synthese se fait sur un serveur, comme la leur.
//
// Cette route recoit une phrase, rend de l'audio. Le mode conduite l'appelle
// phrase par phrase pendant que la reponse s'ecrit — la premiere phrase parle
// pendant que la suite se fabrique.
//
// SANS CLE, ELLE REPOND 503 ET LE SITE VIT TRES BIEN : le client retombe sur
// la voix du navigateur. Ajouter de l'argent est une decision de Mohamed, pas
// la mienne — la cle OPENAI_API_KEY posee dans Vercel allume la voix serveur,
// rien d'autre a toucher. Ordre de grandeur : un a deux centimes par reponse.
//
// LA REGLE QUI NE SE NEGOCIE PAS s'applique ici comme partout : aucune voix
// de synthese ne recite le Coran. Le client envoie deja du texte nettoye,
// mais cette route re-nettoie elle-meme — une regle tenue a un seul endroit
// n'est tenue que tant que personne n'appelle l'autre endroit.

export const runtime = 'nodejs';
export const maxDuration = 30;

// Une phrase, pas un discours : le mode conduite decoupe deja. Au-dela, c'est
// un appel qui ne vient pas de lui — et chaque caractere coute de l'argent.
const TEXTE_MAX = 1000;
const QUOTA_PAR_HEURE = 300;
// La synthese d'une phrase prend ~1 s. A 12 s c'est mort — on rend la main et
// le client parle avec la voix du navigateur plutot que de laisser un silence.
const DELAI_SYNTHESE = 12_000;

let redisClient: Redis | null | undefined;

function getRedis(): Redis | null {
  if (redisClient !== undefined) return redisClient;
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  redisClient = url && token ? new Redis({ url, token }) : null;
  return redisClient;
}

/** Quota horaire par IP — cette route depense de l'argent a chaque appel. */
async function quotaDepasse(request: Request): Promise<boolean> {
  const redis = getRedis();
  if (!redis) return false;
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'inconnue';
  const heure = Math.floor(Date.now() / 3_600_000);
  try {
    const cle = `halalgpt:voix:${ip}:${heure}`;
    // Meme regle que /api/etiquette : un Redis LENT ne doit pas retarder la
    // voix — un quota manque ne coute presque rien, une phrase en retard
    // casse la conversation.
    const appels = await avecDelai(redis.incr(cle), DELAI_REDIS, -1);
    if (appels === -1) return false;
    if (appels === 1) sansAttendre(redis.expire(cle, 3600));
    return appels > QUOTA_PAR_HEURE;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const cle = process.env.OPENAI_API_KEY;
  if (!cle) {
    // Pas un echec : l'etat normal tant que Mohamed n'a pas decide d'allumer.
    return NextResponse.json({ disponible: false }, { status: 503 });
  }

  let texte: unknown;
  try {
    ({ texte } = (await request.json()) as { texte?: unknown });
  } catch {
    return NextResponse.json({ error: 'Corps illisible' }, { status: 400 });
  }
  if (typeof texte !== 'string' || !texte.trim()) {
    return NextResponse.json({ error: 'Texte manquant' }, { status: 400 });
  }
  if (texte.length > TEXTE_MAX) {
    return NextResponse.json({ error: 'Texte trop long' }, { status: 413 });
  }
  if (await quotaDepasse(request)) {
    return NextResponse.json({ error: 'Quota atteint' }, { status: 429 });
  }

  // Re-nettoyage cote serveur : l'arabe est retire de ce qui est prononce,
  // quel que soit l'appelant. On enleve a l'oreille, pas a l'oeil.
  const sansCoran = retirerArabe(texte).texte;
  const aDire = nettoyerPourLaVoix(sansCoran).trim();
  if (!aDire) {
    return NextResponse.json({ error: 'Rien a prononcer' }, { status: 422 });
  }

  try {
    const reponse = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cle}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini-tts',
        voice: process.env.TTS_VOIX || 'nova',
        input: aDire,
        instructions:
          'Parle en francais naturel et chaleureux, articulation claire, rythme posé — la personne écoute en conduisant.',
        response_format: 'mp3',
      }),
      signal: AbortSignal.timeout(DELAI_SYNTHESE),
    });

    if (!reponse.ok || !reponse.body) {
      return NextResponse.json({ error: 'Synthese indisponible' }, { status: 502 });
    }
    return new Response(reponse.body, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-store',
      },
    });
  } catch {
    // Delai depasse ou reseau : le client parlera avec la voix du navigateur.
    return NextResponse.json({ error: 'Synthese trop lente' }, { status: 504 });
  }
}
