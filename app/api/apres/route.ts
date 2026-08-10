import { NextResponse } from 'next/server';

import { QUESTIONS } from '@/lib/questions';
import { questionsApres } from '@/lib/apres.js';

// « Et après ? » — les deux ou trois questions proposées sous une réponse.
//
// Sur le réseau Edge et sans aucun appel IA : le calcul est une comparaison de
// mots sur 189 fiches, il tient en quelques millisecondes. Ça compte plus
// qu'il n'y paraît — une suggestion qui arrive trois secondes après la réponse
// arrive après que le lecteur est parti.
export const runtime = 'edge';

interface Proposition {
  slug: string;
  question: string;
}

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') ?? '').slice(0, 300);
  // Ce que le lecteur a déjà vu dans ce fil : on ne lui repropose pas.
  const vues = (searchParams.get('vues') ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 40);

  const propositions = questionsApres(q, QUESTIONS, vues, 3) as Proposition[];

  return NextResponse.json(
    { propositions },
    {
      // Deux lecteurs qui posent la même question reçoivent les mêmes
      // propositions : autant les servir depuis le cache.
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
    },
  );
}
