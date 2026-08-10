'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

// Explorateur des fiches : une recherche instantanée, puis une barre de thèmes
// collante. Un tap ou trois lettres, zéro rechargement, zéro long défilement.
// Le premier rendu (« Toutes », champ vide) garde la structure complète groupée
// par catégorie : Google voit toujours tous les liens.
//
// Pourquoi une recherche : avec près de deux cents fiches, les pastilles ne
// suffisent plus. Quelqu'un qui veut savoir s'il peut prier assis ne va pas
// parcourir la catégorie Prière — il tape « assis ». Sans champ, il repart.

/** « prière » → « priere ». Sans cela, personne ne trouve rien : on tape sans
 *  accents sur un téléphone, et la moitié des fiches en portent. */
function aplati(texte: string): string {
  return texte
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[’']/g, ' ')
    .toLowerCase();
}

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
  const [recherche, setRecherche] = useState('');

  // L'index est calculé une fois, pas à chaque frappe : sur un téléphone
  // modeste, refaire deux cents normalisations Unicode par lettre se sent.
  const index = useMemo(
    () => items.map((q) => ({ q, texte: aplati(`${q.question} ${q.verdict} ${q.category}`) })),
    [items]
  );

  const mots = aplati(recherche).split(/\s+/).filter(Boolean);
  const trouves = useMemo(() => {
    if (!mots.length) return null;
    // Tous les mots doivent être présents : « priere assis » ne doit pas
    // ramener toutes les fiches Prière.
    return index.filter(({ texte }) => mots.every((m) => texte.includes(m))).map(({ q }) => q);
  }, [index, mots.join(' ')]); // eslint-disable-line react-hooks/exhaustive-deps

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

  // Une recherche en cours prend le pas sur les pastilles : deux filtres
  // simultanés donnent des listes vides qu'on ne s'explique pas.
  if (trouves) {
    return (
      <>
        <div className="recherche">
          <input
            type="search"
            className="recherche-champ"
            placeholder="Cherche une question…"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            aria-label="Chercher parmi les questions"
            autoComplete="off"
          />
          <button type="button" className="recherche-effacer" onClick={() => setRecherche('')}>
            Effacer
          </button>
        </div>

        <p className="recherche-compte">
          {trouves.length === 0
            ? 'Aucune fiche ne correspond.'
            : `${trouves.length} question${trouves.length > 1 ? 's' : ''} trouvée${trouves.length > 1 ? 's' : ''}`}
        </p>

        {trouves.length > 0 && <section className="hub-category">{cards(trouves)}</section>}

        {/* Une recherche vide n'est pas un cul-de-sac : c'est exactement le
            moment où l'IA sert à quelque chose. */}
        <div className="cta-box">
          <p>
            {trouves.length === 0
              ? 'Aucune fiche sur ce sujet — mais l’IA, elle, peut répondre.'
              : 'Ta question n’est pas dans la liste ?'}
          </p>
          <Link href="/" className="cta-button">
            💬 Poser ma question à HalalGPT
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="recherche">
        <input
          type="search"
          className="recherche-champ"
          placeholder="Cherche une question…"
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          aria-label="Chercher parmi les questions"
          autoComplete="off"
        />
      </div>

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
