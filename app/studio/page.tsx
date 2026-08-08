import type { Metadata } from 'next';

import StudioClient from '@/components/StudioClient';
import { QUESTIONS } from '@/lib/questions';

// Studio vidéo — page privée (non indexée) : choisir une fiche, lancer la
// séquence verticale 9:16, et enregistrer son écran. 178 vidéos possibles,
// zéro montage.
export const metadata: Metadata = {
  title: 'Studio vidéo',
  robots: { index: false, follow: false },
};

export default function StudioPage() {
  const fiches = QUESTIONS.map((q) => ({
    slug: q.slug,
    question: q.question,
    verdict: q.verdict,
    short: q.short,
    category: q.category,
  }));

  return <StudioClient fiches={fiches} />;
}
