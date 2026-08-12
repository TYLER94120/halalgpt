import { NextResponse } from 'next/server';

import { QUESTIONS } from '@/lib/questions';
import { corpsDeFiche, type CorpsParSlug } from '@/lib/recherche';

// Les mots distinctifs de chaque reponse, pour le champ de recherche de
// /questions.
//
// POURQUOI UNE ADRESSE A PART, ET PAS DANS LA PAGE
//
// Cet index pese environ 120 ko. La page /questions en pese aujourd'hui 88 :
// l'y coller la ferait plus que doubler, pour tous les visiteurs — y compris
// les neuf sur dix qui ne cherchent rien et pour Google, qui la telecharge a
// chaque passage sans jamais s'en servir.
//
// Ici, il se telecharge une seule fois, au premier caractere tape, et le
// reseau de diffusion le garde. Tant qu'il n'est pas arrive, la page cherche
// dans les titres — exactement ce qu'elle faisait avant. Une recherche moins
// complete pendant trois cents millisecondes, jamais une recherche cassee.
//
// CALCULE A LA CONSTRUCTION, pas a chaque appel : `force-static` fige le
// fichier au moment du deploiement. Il ne peut donc pas se desynchroniser de
// lib/questions.ts — c'est la meme source, au meme instant. Un fichier genere
// puis commite, lui, aurait vieilli des la premiere fiche ajoutee la nuit.
export const dynamic = 'force-static';

export function GET() {
  const corps: CorpsParSlug = {};
  for (const q of QUESTIONS) corps[q.slug] = corpsDeFiche(q);

  return NextResponse.json(
    { fiches: QUESTIONS.length, corps },
    {
      headers: {
        // Une heure dans le navigateur, un jour sur le reseau de diffusion, et
        // on peut servir l'ancien pendant qu'on cherche le nouveau. Le contenu
        // ne bouge qu'au deploiement suivant, et une nuit de retard sur un
        // index de recherche ne coute rien a personne.
        'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
      },
    },
  );
}
