import Anthropic from '@anthropic-ai/sdk';
import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

import { avecDelai, sansAttendre, DELAI_MODELE, DELAI_REDIS } from '@/lib/delai';
import { QUESTIONS } from '@/lib/questions';
import { SITE_URL } from '@/lib/config';

// ─── Lecteur d'étiquettes de l'écosystème ────────────────────────────────────
//
// Quand HalalCheck tombe sur un produit absent des bases mondiales, il envoie
// ici la photo de la liste d'ingrédients : on la lit et on renvoie une analyse
// structurée. L'échec du scan devient ainsi une réponse utile.
//
// Ouvert en CORS pour les sites de la famille. Comme chaque appel coûte de
// l'API, un garde-fou limite les abus (quota par IP quand Redis est branché).

export const runtime = 'nodejs';
export const maxDuration = 60;

const IMAGE_PATTERN = /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/;
const IMAGE_MAX_CHARS = 2_800_000;
const QUOTA_PAR_HEURE = 40;

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const SYSTEM = `Tu lis des photos d'étiquettes alimentaires et tu évalues la licéité halal des ingrédients visibles.

Tu réponds UNIQUEMENT par un objet JSON valide, sans texte autour, de cette forme exacte :
{"verdict":"halal|douteux|haram|illisible","resume":"une phrase courte","ingredients_a_risque":[{"nom":"E471","raison":"..."}],"explication":"2 à 4 phrases","conseil":"une phrase"}

Règles :
- "illisible" si la liste d'ingrédients n'est pas lisible ou absente de la photo : dis-le franchement, ne devine JAMAIS un ingrédient que tu ne vois pas.
- "haram" seulement si un ingrédient interdit est explicitement lisible (porc, lard, gélatine de porc, alcool, vin...).
- "douteux" pour les ingrédients d'origine incertaine (gélatine sans source, E471, E472, E570, présure, arômes, mono- et diglycérides...).
- "halal" si tous les ingrédients lisibles sont clairement licites.
- Tu analyses ce que tu VOIS : tu ne certifies rien. Ne parle jamais de certification que tu n'aurais pas lue sur l'emballage.
- Champ "nom" des ingrédients à risque : le code E (ex. "E471") quand il existe, sinon le nom de l'ingrédient.
- Écris en français simple, avec le tutoiement dans "conseil".`;

let redisClient: Redis | null | undefined;

function getRedis(): Redis | null {
  if (redisClient !== undefined) return redisClient;
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  redisClient = url && token ? new Redis({ url, token }) : null;
  return redisClient;
}

/** Quota horaire par IP — protège la facture API en cas d'abus. */
async function quotaDepasse(request: Request): Promise<boolean> {
  const redis = getRedis();
  if (!redis) return false;
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'inconnue';
  const heure = Math.floor(Date.now() / 3_600_000);
  try {
    const cle = `halalgpt:etiquette:${ip}:${heure}`;
    // `catch` couvrait la panne, pas la LENTEUR : un Redis qui repond en
    // vingt secondes ne leve rien, il fait attendre — et il faisait attendre
    // AVANT que la photo parte a l'analyse. Un quota manque ne coute rien,
    // une analyse manquee coute la reponse entiere : on abandonne le quota.
    const appels = await avecDelai(redis.incr(cle), DELAI_REDIS, -1);
    if (appels === -1) return false;
    if (appels === 1) sansAttendre(redis.expire(cle, 3600));
    return appels > QUOTA_PAR_HEURE;
  } catch {
    return false; // Redis indisponible : on ne bloque pas le service
  }
}

/** Relie un ingrédient repéré à sa fiche détaillée quand elle existe. */
function ficheDeLIngredient(nom: string): string | undefined {
  const code = nom.toLowerCase().match(/\be?\s?(\d{3}[a-z]?)\b/);
  if (!code) return undefined;
  const hit = QUESTIONS.find((q) => q.slug.split('-').includes(`e${code[1]}`));
  return hit ? `${SITE_URL}/q/${hit.slug}` : undefined;
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function POST(request: Request) {
  let image: unknown;
  try {
    ({ image } = (await request.json()) as { image?: unknown });
  } catch {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400, headers: CORS });
  }

  if (typeof image !== 'string' || image.length > IMAGE_MAX_CHARS || !IMAGE_PATTERN.test(image)) {
    return NextResponse.json(
      { error: 'Photo attendue : dataURL JPEG, PNG ou WebP, 2 Mo maximum.' },
      { status: 400, headers: CORS }
    );
  }

  if (await quotaDepasse(request)) {
    return NextResponse.json(
      { error: 'Trop de demandes pour le moment, réessaie dans une heure.' },
      { status: 429, headers: CORS }
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'Service indisponible' }, { status: 503, headers: CORS });
  }

  try {
    // Sous maxDuration = 60 : c'est NOUS qui repondons quand le modele
    // traine, pas la plateforme qui tue la fonction. HalalCheck recoit alors
    // un JSON qu'il sait lire au lieu d'une page d'erreur qu'il ne sait pas.
    const anthropic = new Anthropic({ timeout: DELAI_MODELE, maxRetries: 1 });
    const mediaType = image.slice(5, image.indexOf(';')) as 'image/jpeg' | 'image/png' | 'image/webp';
    const response = await anthropic.beta.messages.create({
      model: 'claude-opus-5',
      max_tokens: 1500,
      output_config: { effort: 'low' },
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      system: SYSTEM,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mediaType, data: image.slice(image.indexOf(',') + 1) },
            },
            { type: 'text', text: 'Analyse cette étiquette et réponds en JSON.' },
          ],
        },
      ],
    });

    if (response.stop_reason === 'refusal') {
      return NextResponse.json(
        { verdict: 'illisible', resume: 'Analyse impossible pour cette image.' },
        { headers: CORS }
      );
    }

    const brut = response.content
      .map((block) => (block.type === 'text' ? block.text : ''))
      .join('')
      .trim();

    // Le modèle répond en JSON ; on reste tolérant s'il l'entoure de texte.
    const debut = brut.indexOf('{');
    const fin = brut.lastIndexOf('}');
    if (debut === -1 || fin === -1) {
      return NextResponse.json(
        { verdict: 'illisible', resume: 'Analyse impossible, réessaie avec une photo plus nette.' },
        { headers: CORS }
      );
    }

    const analyse = JSON.parse(brut.slice(debut, fin + 1)) as {
      ingredients_a_risque?: { nom?: string; raison?: string }[];
    };

    // On enrichit chaque ingrédient repéré du lien vers sa fiche détaillée.
    const enrichis = (analyse.ingredients_a_risque ?? []).map((ing) => ({
      ...ing,
      fiche: ing.nom ? ficheDeLIngredient(ing.nom) : undefined,
    }));

    return NextResponse.json(
      {
        ...analyse,
        ingredients_a_risque: enrichis,
        source: 'HalalGPT — lecture de la liste d’ingrédients photographiée, pas une certification',
      },
      { headers: CORS }
    );
  } catch (error) {
    console.error('HalalGPT /api/etiquette:', error);
    return NextResponse.json(
      { verdict: 'illisible', resume: 'Analyse indisponible pour le moment, réessaie.' },
      { headers: CORS }
    );
  }
}
