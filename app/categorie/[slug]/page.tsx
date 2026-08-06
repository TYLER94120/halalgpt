import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import {
  CATEGORIES,
  CATEGORY_DESCRIPTIONS,
  CATEGORY_SLUGS,
  QUESTIONS,
  getCategoryBySlug,
} from '@/lib/questions';
import { SITE_URL } from '@/lib/config';

// Une page hub par catégorie : /categorie/additifs, /categorie/ramadan…
// Chaque hub cible les recherches génériques (« additifs halal », « ramadan questions »)
// et renforce le maillage interne vers les fiches.
export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: CATEGORY_SLUGS[c] }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const category = getCategoryBySlug(params.slug);
  if (!category) return {};
  const count = QUESTIONS.filter((q) => q.category === category).length;
  return {
    title: `${category} : ${count} questions halal`,
    description: CATEGORY_DESCRIPTIONS[category],
    alternates: { canonical: `${SITE_URL}/categorie/${params.slug}` },
  };
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = getCategoryBySlug(params.slug);
  if (!category) notFound();

  const items = QUESTIONS.filter((q) => q.category === category);

  return (
    <div className="article">
      <nav className="breadcrumb" aria-label="Fil d’Ariane">
        <Link href="/">Accueil</Link> › <Link href="/questions">Questions</Link> › {category}
      </nav>

      <h1>
        {category} <span style={{ color: 'var(--or)' }}>halal</span>
      </h1>
      <p className="article-lead">{CATEGORY_DESCRIPTIONS[category]}</p>

      <div className="cards">
        {items.map((q) => (
          <Link key={q.slug} href={`/q/${q.slug}`} className="card">
            <span className="card-verdict">{q.verdict}</span>
            <span className="card-question">{q.question}</span>
          </Link>
        ))}
      </div>

      <section className="hub-category">
        <h2>Les autres catégories</h2>
        <p className="article-note">
          {CATEGORIES.filter((c) => c !== category).map((c, i) => (
            <span key={c}>
              {i > 0 && ' · '}
              <Link href={`/categorie/${CATEGORY_SLUGS[c]}`}>{c}</Link>
            </span>
          ))}
        </p>
      </section>

      <div className="cta-box" style={{ marginTop: 40 }}>
        <p>Ta question n’est pas dans la liste ?</p>
        <Link href="/" className="cta-button">
          💬 Demander à HalalGPT
        </Link>
      </div>
    </div>
  );
}
