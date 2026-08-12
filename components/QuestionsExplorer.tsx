'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';

import {
  chercher,
  construireIndex,
  type CorpsParSlug,
  type FicheCherchable,
} from '@/lib/recherche';

// Explorateur des fiches : une recherche instantanée, puis une barre de thèmes
// collante. Un tap ou trois lettres, zéro rechargement, zéro long défilement.
// Le premier rendu (« Toutes », champ vide) garde la structure complète groupée
// par catégorie : Google voit toujours tous les liens.
//
// Pourquoi une recherche : avec près de deux cents fiches, les pastilles ne
// suffisent plus. Quelqu'un qui veut savoir s'il peut prier assis ne va pas
// parcourir la catégorie Prière — il tape « assis ». Sans champ, il repart.
//
// ── 12 août 2026 : la recherche regarde enfin DANS les réponses ──────────
//
// Elle ne lisait que le titre, le verdict et la catégorie. Sur 41 saisies
// qu'une vraie personne taperait, 17 ne ramenaient rien, et pour 13 d'entre
// elles le site avait pourtant la réponse : « cochenille » (6 fiches en
// parlent), « émulsifiant » (10), « hôtel » (5), « règles » (6)…
//
// Le corps des réponses pèse 120 ko. On ne l'inflige pas aux neuf visiteurs
// sur dix qui ne cherchent rien : il se télécharge au premier caractère tapé.
// Tant qu'il n'est pas là, on cherche dans les titres — c'est-à-dire
// exactement le comportement d'avant. Si le téléchargement échoue, on y reste,
// sans message d'erreur : une recherche moins complète vaut mieux qu'une
// recherche cassée.

export interface ExplorerCategory {
  name: string;
  slug: string;
  emoji: string;
  count: number;
}

export type ExplorerItem = FicheCherchable;

interface Props {
  categories: ExplorerCategory[];
  items: ExplorerItem[];
}

export default function QuestionsExplorer({ categories, items }: Props) {
  const [active, setActive] = useState('Toutes');
  const [recherche, setRecherche] = useState('');
  const [corps, setCorps] = useState<CorpsParSlug | null>(null);
  const demande = useRef(false);

  // Le corps des réponses, une seule fois, dès qu'on sait que la personne
  // cherche pour de bon. `demande` empêche une deuxième requête si le premier
  // téléchargement échoue ou traîne — on ne martèle pas le réseau.
  useEffect(() => {
    if (!recherche || demande.current) return;
    demande.current = true;
    fetch('/api/recherche')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d && d.corps) setCorps(d.corps);
      })
      .catch(() => {
        // Silence volontaire : la recherche par titre continue de marcher.
      });
  }, [recherche]);

  // L'index est recalculé quand le corps arrive, pas à chaque frappe : sur un
  // téléphone modeste, refaire deux cents normalisations Unicode par lettre se
  // sent.
  const index = useMemo(() => construireIndex(items, corps ?? {}), [items, corps]);

  const trouves = useMemo(() => chercher(index, recherche), [index, recherche]);

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

  const champ = (avecEffacer: boolean) => (
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
      {avecEffacer && (
        <button type="button" className="recherche-effacer" onClick={() => setRecherche('')}>
          Effacer
        </button>
      )}
    </div>
  );

  // Une recherche en cours prend le pas sur les pastilles : deux filtres
  // simultanés donnent des listes vides qu'on ne s'explique pas.
  if (trouves) {
    return (
      <>
        {champ(true)}

        <p className="recherche-compte" aria-live="polite">
          {trouves.length === 0
            ? 'Aucune fiche ne correspond.'
            : `${trouves.length} question${trouves.length > 1 ? 's' : ''} trouvée${trouves.length > 1 ? 's' : ''}` +
              // On ne promet « les plus proches d'abord » que quand il y a
              // vraiment un classement à annoncer.
              (trouves.length > 3 ? ' — les plus proches d’abord' : '')}
        </p>

        {trouves.length > 0 && (
          <section className="hub-category">{cards(trouves.map((t) => t.fiche))}</section>
        )}

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
      {champ(false)}

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
