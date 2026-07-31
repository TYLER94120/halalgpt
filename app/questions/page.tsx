import type { Metadata } from 'next';
import Link from 'next/link';

import { CATEGORIES, QUESTIONS } from '@/lib/questions';
import { SITE_URL } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Toutes les questions halal',
  description:
    'Additifs (E120, E471…), produits (Haribo, Kinder…), restaurants, voyage, Ramadan : toutes les réponses halal, claires et nuancées.',
  alternates: { canonical: `${SITE_URL}/questions` },
};

export default function QuestionsPage() {
  return (
    <div className="article">
      <h1>
        Toutes les questions <span className="accent" style={{ color: 'var(--or)' }}>halal</span>
      </h1>
      <p className="article-lead">
        {QUESTIONS.length} questions, des réponses claires — et l’IA pour toutes les autres.
      </p>

      {CATEGORIES.map((category) => {
        const items = QUESTIONS.filter((q) => q.category === category);
        if (items.length === 0) return null;
        return (
          <section key={category} className="hub-category">
            <h2>{category}</h2>
            <div className="cards">
              {items.map((q) => (
                <Link key={q.slug} href={`/q/${q.slug}`} className="card">
                  <span className="card-verdict">{q.verdict}</span>
                  <span className="card-question">{q.question}</span>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      <div className="cta-box" style={{ marginTop: 48 }}>
        <p>Ta question n’est pas dans la liste ?</p>
        <Link href="/" className="cta-button">
          💬 Demander à HalalGPT
        </Link>
      </div>
    </div>
  );
}
