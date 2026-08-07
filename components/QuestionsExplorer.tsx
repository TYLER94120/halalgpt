'use client';

import Link from 'next/link';
import { useState } from 'react';

// Explorateur des fiches : une barre de thèmes collante (pastilles) filtre la
// liste instantanément — un tap, zéro rechargement, zéro long défilement.
// Le premier rendu (« Toutes ») garde la structure complète groupée par
// catégorie : Google voit toujours les 173 liens.

export interface ExplorerCategory {
  name: string;
  slug: string;
  emoji: string;
  count: number;
}

export interface ExplorerItem {
  slug: string;
  question: string;
  verdict: string;
  category: string;
}

interface Props {
  categories: ExplorerCategory[];
  items: ExplorerItem[];
}

export default function QuestionsExplorer({ categories, items }: Props) {
  const [active, setActive] = useState('Toutes');

  const cards = (list: ExplorerItem[]) => (
    <div className="cards">
      {list.map((q) => (
        <Link key={q.slug} href={`/q/${q.slug}`} className="card">
          <span className="card-verdict">{q.verdict}</span>
          <span className="card-question">{q.question}</span>
        </Link>
      ))}
    </div>
  );

  return (
    <>
      <nav className="filter-bar" aria-label="Filtrer par thème">
        <button
          type="button"
          className={`filter-chip ${active === 'Toutes' ? 'active' : ''}`}
          onClick={() => setActive('Toutes')}
        >
          ✨ Toutes <span className="filter-count">{items.length}</span>
        </button>
        {categories.map((c) => (
          <button
            key={c.name}
            type="button"
            className={`filter-chip ${active === c.name ? 'active' : ''}`}
            onClick={() => setActive(c.name)}
          >
            {c.emoji} {c.name} <span className="filter-count">{c.count}</span>
          </button>
        ))}
      </nav>

      {active === 'Toutes' ? (
        categories.map((c) => (
          <section key={c.name} className="hub-category">
            <h2>
              <Link href={`/categorie/${c.slug}`}>
                {c.emoji} {c.name}
              </Link>
            </h2>
            {cards(items.filter((q) => q.category === c.name))}
          </section>
        ))
      ) : (
        <section className="hub-category">
          {categories
            .filter((c) => c.name === active)
            .map((c) => (
              <h2 key={c.name}>
                <Link href={`/categorie/${c.slug}`}>
                  {c.emoji} {c.name}
                </Link>
              </h2>
            ))}
          {cards(items.filter((q) => q.category === active))}
        </section>
      )}
    </>
  );
}
