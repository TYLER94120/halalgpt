import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

import { enregistrer, sante, type BaseCompteur } from '@/lib/passerelle';

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
//
// ─── 12 aout 2026 : ce compteur mentait quand il tombait en panne ────────────
//
// Deux defauts trouves en verifiant mon propre instrument, avant qu'ils ne
// coutent la mesure du 25 aout :
//
// 1. La reponse disait `compte: true` MEME quand l'ecriture dans la base avait
//    echoue. Le `catch` avalait l'erreur — pour ne jamais casser une visite,
//    ce qui est juste — puis on repondait « compte » quand meme. Une base mal
//    configuree sur Vercel aurait donc renvoye « tout va bien » a chaque
//    visite, sans rien enregistrer. Le 25 aout, j'aurais lu zero et conclu
//    « les passerelles n'amenent personne », alors que la verite aurait ete
//    « le compteur n'a jamais marche ».
//
// 2. `compte: false` voulait dire deux choses opposees : « ta source m'est
//    inconnue » et « je n'ai aucune base ».
//
// La logique vit desormais dans lib/passerelle.ts, ou elle se teste avec une
// fausse base — sans envoyer de fausse arrivee dans la mesure qu'on verifie.
// Cette route ne fait plus que brancher Redis dessus.

function getRedis(): BaseCompteur | null {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? (new Redis({ url, token }) as unknown as BaseCompteur) : null;
}

export async function POST(request: Request) {
  let corps: { source?: unknown; campagne?: unknown; page?: unknown };
  try {
    corps = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const jour = new Date().toISOString().slice(0, 10);
  return NextResponse.json(await enregistrer(getRedis(), corps, jour));
}

/**
 * « Es-tu vivant ? » — lecture seule, aucune ecriture.
 *
 * N'importe quel agent peut ouvrir https://halalgpt.fr/api/passerelle pour
 * savoir si la mesure fonctionne, sans y ajouter une fausse arrivee.
 */
export async function GET() {
  return NextResponse.json(await sante(getRedis()));
}
