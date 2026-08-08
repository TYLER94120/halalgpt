import { NextResponse } from 'next/server';

import { QUESTIONS } from '@/lib/questions';
import { SITE_URL } from '@/lib/config';

// Annuaire public des additifs traités par HalalGPT, pour les sites de la
// famille (HalalCheck l'utilise pour enrichir ses verdicts de scan).
// Ouvert en CORS : c'est de la donnée éditoriale publique, déjà visible sur les
// pages /q/*. Aucune donnée personnelle n'y transite.
export const runtime = 'edge';

export function GET() {
  const additifs = QUESTIONS.map((q) => ({
    q,
    codes: q.slug
      .split('-')
      .filter((part) => /^e\d{3}[a-z]?$/.test(part))
      .map((part) => part.toUpperCase()),
  }))
    // Uniquement les fiches réellement identifiées par un code E.
    .filter(({ codes }) => codes.length > 0)
    .map(({ q, codes }) => ({
      codes,
      slug: q.slug,
      question: q.question,
      verdict: q.verdict,
      resume: q.short,
      url: `${SITE_URL}/q/${q.slug}`,
      lien_court: `${SITE_URL}/e/${codes[0]}`,
    }));

  return NextResponse.json(
    { source: 'HalalGPT', total: additifs.length, additifs },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      },
    }
  );
}
