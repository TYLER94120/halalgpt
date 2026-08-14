import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

import {
  blocContexte,
  construireSysteme,
  CONTEXTE_MAX,
  estUnSiteConnu,
  origineAutorisee,
  QUESTION_MAX,
} from '@/lib/assistant';
import { avecDelai, sansAttendre, DELAI_REDIS } from '@/lib/delai';

// ─── La porte IA de la famille ───────────────────────────────────────────────
//
// Ordre de Mohamed, 14 août : l'IA de halalgpt.fr au service de TOUS les
// sites. Une clé, une porte, chaque site apporte ses données — l'architecture
// est expliquée dans lib/assistant.ts, la partie pure et testée.
//
// Contrat d'appel, pour les agents des autres sites :
//
//   POST https://halalgpt.fr/api/assistant
//   { "site": "voyageshalal", "question": "…", "contexte": ["…", "…"] }
//
//   → flux texte brut (la réponse s'écrit mot à mot), ou JSON d'erreur.
//
// `contexte` : les 3 à 6 résultats VÉRIFIÉS que le site a trouvés lui-même
// (ses spots, ses fiches). C'est la seule source de faits locaux que
// l'assistant a le droit d'affirmer — la règle ne-jamais-inventer, tenue ICI
// et pas seulement promise là-bas.
//
// L'argent : chaque appel dépense la clé de Mohamed. D'où le modèle rapide et
// économique par défaut (dix fois moins cher que le grand modèle du chat), un
// quota par adresse, un plafond par jour, et un compteur par site dans la
// mine — pour qu'on sache le 25 ce que chaque site a réellement consommé.

export const runtime = 'nodejs';
export const maxDuration = 60;

const QUOTA_PAR_HEURE = 30;
const PLAFOND_PAR_JOUR = Number(process.env.ASSISTANT_PLAFOND_JOUR || 1500);
const MODELE = process.env.ASSISTANT_MODELE || 'claude-haiku-4-5-20251001';

let redisClient: Redis | null | undefined;

function getRedis(): Redis | null {
  if (redisClient !== undefined) return redisClient;
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  redisClient = url && token ? new Redis({ url, token }) : null;
  return redisClient;
}

function corsPour(origine: string | null): Record<string, string> {
  // L'en-tête n'est renvoyé que pour une origine de la famille : pas de « * »
  // sur une route qui dépense de l'argent.
  const tetes: Record<string, string> = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
  if (origine && origineAutorisee(origine)) tetes['Access-Control-Allow-Origin'] = origine;
  return tetes;
}

export function OPTIONS(request: Request) {
  return new Response(null, { status: 204, headers: corsPour(request.headers.get('origin')) });
}

/** Quota horaire par adresse + plafond du jour : la route dépense de l'argent. */
async function gardeFous(request: Request, site: string): Promise<string | null> {
  const redis = getRedis();
  if (!redis) return null;
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'inconnue';
  const heure = Math.floor(Date.now() / 3_600_000);
  const jour = new Date().toISOString().slice(0, 10);
  try {
    const parIp = await avecDelai(
      redis.incr(`halalgpt:assistant:${ip}:${heure}`),
      DELAI_REDIS,
      -1,
    );
    if (parIp === 1) sansAttendre(redis.expire(`halalgpt:assistant:${ip}:${heure}`, 3600));
    if (parIp > QUOTA_PAR_HEURE) return 'Quota atteint pour cette heure. Réessaie un peu plus tard.';

    const parJour = await avecDelai(
      redis.incr(`halalgpt:assistant:jour:${jour}`),
      DELAI_REDIS,
      -1,
    );
    if (parJour === 1) sansAttendre(redis.expire(`halalgpt:assistant:jour:${jour}`, 172800));
    if (parJour > PLAFOND_PAR_JOUR)
      return "L'assistant a atteint son plafond du jour. Il rouvre demain.";

    // La mesure par site : la seule façon de savoir le 25 qui consomme quoi.
    sansAttendre(redis.zincrby('halalgpt:assistant:sites', 1, site));
  } catch {
    /* Redis en panne : on sert quand même — le plafond protège l'argent, pas le service */
  }
  return null;
}

export async function POST(request: Request) {
  const origine = request.headers.get('origin');
  const cors = corsPour(origine);

  if (!origineAutorisee(origine)) {
    return NextResponse.json({ error: 'Origine inconnue' }, { status: 403 });
  }

  let corps: { site?: unknown; question?: unknown; contexte?: unknown };
  try {
    corps = (await request.json()) as typeof corps;
  } catch {
    return NextResponse.json({ error: 'Corps illisible' }, { status: 400, headers: cors });
  }

  const { site, question, contexte } = corps;
  if (!estUnSiteConnu(site)) {
    return NextResponse.json({ error: 'Site inconnu' }, { status: 400, headers: cors });
  }
  if (typeof question !== 'string' || !question.trim()) {
    return NextResponse.json({ error: 'Question manquante' }, { status: 400, headers: cors });
  }
  if (question.length > QUESTION_MAX) {
    return NextResponse.json({ error: 'Question trop longue' }, { status: 413, headers: cors });
  }
  if (contexte !== undefined && JSON.stringify(contexte).length > CONTEXTE_MAX) {
    // Le site a envoyé sa base entière au lieu de ses 3 à 6 résultats : on
    // refuse plutôt que de payer l'erreur — et le message le dit à l'agent.
    return NextResponse.json(
      { error: 'Contexte trop grand : envoie les quelques résultats pertinents, pas la base' },
      { status: 413, headers: cors },
    );
  }

  const refus = await gardeFous(request, site);
  if (refus) {
    return NextResponse.json({ error: refus }, { status: 429, headers: cors });
  }

  try {
    // Même choix que le chat : le flux EST l'accompagnement, pas de délai
    // maximum sur la génération elle-même (voir /api/chat pour la règle).
    const anthropic = new Anthropic();
    const flux = await anthropic.messages.create({
      model: MODELE,
      max_tokens: 600,
      stream: true,
      system: construireSysteme(site),
      messages: [
        {
          role: 'user',
          content: `${blocContexte(contexte)}\n\nQUESTION DU VISITEUR : ${question.trim()}`,
        },
      ],
    });

    const encodeur = new TextEncoder();
    const corpsFlux = new ReadableStream<Uint8Array>({
      async start(controleur) {
        try {
          for await (const evenement of flux) {
            if (evenement.type === 'content_block_delta' && evenement.delta.type === 'text_delta') {
              controleur.enqueue(encodeur.encode(evenement.delta.text));
            }
          }
        } catch {
          /* flux interrompu : le widget garde ce qui est déjà arrivé */
        } finally {
          controleur.close();
        }
      },
    });

    return new Response(corpsFlux, {
      headers: { ...cors, 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
    });
  } catch {
    return NextResponse.json(
      { error: "L'assistant n'est pas joignable pour l'instant." },
      { status: 502, headers: cors },
    );
  }
}
