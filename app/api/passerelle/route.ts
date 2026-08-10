import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

// ─── Le compteur de passerelles ───────────────────────────────────────────────
//
// Vercel Analytics mesure deja les arrivees, mais seul Mohamed peut ouvrir ce
// tableau de bord : aucun agent ne peut lire la reponse a « est-ce que la
// passerelle de HalalCheck amene quelqu'un ? ». Une mesure que l'equipe ne peut
// pas consulter ne sert pas l'equipe.
//
// D'ou ce compteur : quand un visiteur arrive avec un `utm_source`, on
// l'enregistre dans Redis, et /api/mine l'affiche. N'importe quel agent peut
// alors trancher, seul, sans attendre personne.
//
// Rien n'est enregistre sur les visiteurs eux-memes : ni adresse IP, ni
// identifiant, ni horodatage individuel. Uniquement des compteurs — combien de
// fois telle passerelle a amene quelqu'un, quel jour. C'est tout ce dont la
// question a besoin.

const SOURCES_CONNUES = new Set([
  'halalcheck',
  'voyageshalal',
  'gohalaltravel',
  'islampasapas',
  'apprentissage',
  'youtube',
  'whatsapp',
]);

function getRedis(): Redis | null {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? new Redis({ url, token }) : null;
}

/** « E471 » ou « fiche-produit » → garde une etiquette courte et propre. */
function propre(valeur: unknown, max = 40): string {
  if (typeof valeur !== 'string') return '';
  return valeur
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '')
    .slice(0, max);
}

export async function POST(request: Request) {
  let corps: { source?: unknown; campagne?: unknown; page?: unknown };
  try {
    corps = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const source = propre(corps.source, 24);
  // Une source inconnue n'est pas comptee : sans cela, n'importe qui pourrait
  // gonfler le compteur en forgeant une adresse, et la mesure ne vaudrait plus
  // rien. C'est la mesure qu'on protege, pas le serveur.
  if (!source || !SOURCES_CONNUES.has(source)) {
    return NextResponse.json({ ok: true, compte: false });
  }

  const campagne = propre(corps.campagne, 40) || 'sans-campagne';
  const page = propre(typeof corps.page === 'string' ? corps.page.replace(/\//g, '_') : '', 60);
  const jour = new Date().toISOString().slice(0, 10);

  const redis = getRedis();
  if (!redis) return NextResponse.json({ ok: true, compte: false });

  try {
    await Promise.all([
      redis.zincrby('halalgpt:passerelles', 1, source),
      redis.zincrby('halalgpt:passerelles:detail', 1, `${source} · ${campagne} · ${page || '_'}`),
      redis.zincrby(`halalgpt:passerelles:jour:${jour}`, 1, source),
      // Les journaux quotidiens s'effacent seuls au bout de 90 jours : on garde
      // la tendance, pas un historique qui grossit indefiniment.
      redis.expire(`halalgpt:passerelles:jour:${jour}`, 60 * 60 * 24 * 90),
    ]);
  } catch {
    /* Redis indisponible : on ne casse jamais la visite pour un compteur. */
  }

  return NextResponse.json({ ok: true, compte: true });
}
