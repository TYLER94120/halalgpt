import type { Metadata } from 'next';
import Link from 'next/link';

import QuestionsExplorer from '@/components/QuestionsExplorer';
import { CATEGORIES, CATEGORY_SLUGS, QUESTIONS, type Category } from '@/lib/questions';
import { SITE_URL } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Toutes les questions halal',
  description:
    'Additifs (E120, E471…), produits (Haribo, Kinder…), Ramadan, voyage, pratique : toutes les réponses halal, claires et nuancées, classées par thème.',
  alternates: { canonical: `${SITE_URL}/questions` },
};

const CATEGORY_EMOJIS: Record<Category, string> = {
  Additifs: '🧪',
  Produits: '🍬',
  Alimentation: '🍽',
  Ramadan: '🌙',
  Prière: '🤲',
  'Vie quotidienne': '☀️',
  Voyage: '✈️',
  Destinations: '🗺',
  Pratique: '📖',
};

export default function QuestionsPage() {
  const categories = CATEGORIES.map((c) => ({
    name: c,
    slug: CATEGORY_SLUGS[c],
    emoji: CATEGORY_EMOJIS[c],
    count: QUESTIONS.filter((q) => q.category === c).length,
  })).filter((c) => c.count > 0);

  const items = QUESTIONS.map((q) => ({
    slug: q.slug,
    question: q.question,
    verdict: q.verdict,
    category: q.category,
  }));

  return (
    <div className="article">
      <h1>
        Toutes les questions <span className="accent" style={{ color: 'var(--or)' }}>halal</span>
      </h1>
      <p className="article-lead">
        {QUESTIONS.length} questions, des réponses claires — touche un thème pour filtrer.
      </p>

      <QuestionsExplorer categories={categories} items={items} />

      <div className="cta-box" style={{ marginTop: 48 }}>
        <p>Ta question n’est pas dans la liste ?</p>
        <Link href="/" className="cta-button">
          💬 Demander à HalalGPT
        </Link>
      </div>
    </div>
  );
}
