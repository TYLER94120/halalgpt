import { NextResponse } from 'next/server';

import { QUESTIONS } from '@/lib/questions';

// Suggestions instantanées pendant la frappe — tourne sur le réseau Edge
// (démarrage à froid quasi nul) et ne coûte AUCUN appel IA.
export const runtime = 'edge';

function normalize(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

interface Suggestion {
  slug: string;
  question: string;
  verdict: string;
}

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = normalize(searchParams.get('q') ?? '').trim();
  if (q.length < 2) {
    return NextResponse.json({ suggestions: [] as Suggestion[] });
  }

  const words = q.split(/[^a-z0-9]+/).filter((w) => w.length >= 2);
  if (words.length === 0) {
    return NextResponse.json({ suggestions: [] as Suggestion[] });
  }

  const scored: { qa: (typeof QUESTIONS)[number]; score: number }[] = [];
  for (const qa of QUESTIONS) {
    const haystack = normalize(`${qa.question} ${qa.slug}`);
    // Tous les mots tapés doivent apparaître (même partiellement : « harib » → haribo)
    let score = 0;
    let allMatch = true;
    for (const w of words) {
      if (haystack.includes(w)) {
        score += w.length;
      } else {
        allMatch = false;
        break;
      }
    }
    if (allMatch && score > 0) scored.push({ qa, score });
  }

  scored.sort((a, b) => b.score - a.score);
  const suggestions: Suggestion[] = scored.slice(0, 4).map(({ qa }) => ({
    slug: qa.slug,
    question: qa.question,
    verdict: qa.verdict,
  }));

  return NextResponse.json({ suggestions });
}
