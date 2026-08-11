import type { MetadataRoute } from 'next';

import { CATEGORIES, CATEGORY_SLUGS, QUESTIONS } from '@/lib/questions';
import { SITE_URL } from '@/lib/config';
import dates from '@/lib/dates-fiches.json';

// Le plan de fond du site, pour Google.
//
// Il portait la liste des pages et rien d'autre. Ce qui manquait — et ce que
// Google utilise vraiment pour decider quand il repasse — c'est la DATE de
// derniere modification. Sans elle, une fiche enrichie ce matin est
// indistinguable d'une fiche figee depuis trois semaines : il repassera quand
// il repassera.
//
// Le 11 aout, 18 fiches ont ete enrichies ou creees dans la journee. Aucune ne
// pouvait le faire savoir.
//
// Les dates viennent de `lib/dates-fiches.json`, calcule depuis l'historique
// git par `scripts/dates-fiches.mjs`. Elles ne sont jamais inventees : une
// date de mise a jour fausse est une promesse fausse, faite au lecteur autant
// qu'a Google — et Google verifie.
//
// A RELANCER apres avoir touche au contenu des fiches :
//     node scripts/dates-fiches.mjs

const QUAND = dates as Record<string, { publie: string; modifie: string }>;

/** La date de modification d'une fiche, ou rien plutot qu'une date inventee. */
function modifieeLe(slug: string): Date | undefined {
  const d = QUAND[slug]?.modifie;
  return d ? new Date(d) : undefined;
}

export default function sitemap(): MetadataRoute.Sitemap {
  // Le site entier bouge quand sa fiche la plus recente bouge : c'est ce qu'on
  // annonce pour l'accueil et les pages qui listent.
  const derniere = QUESTIONS.map((q) => modifieeLe(q.slug))
    .filter((d): d is Date => Boolean(d))
    .reduce<Date | undefined>((a, b) => (!a || b > a ? b : a), undefined);

  return [
    { url: SITE_URL, lastModified: derniere, changeFrequency: 'daily', priority: 1 },
    {
      url: `${SITE_URL}/questions`,
      lastModified: derniere,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    // Le mode conduite n'y figurait pas. C'est une vraie page, avec un vrai
    // usage — poser sa question a la voix en voiture — et Google ne pouvait la
    // trouver que par le lien de l'accueil.
    {
      url: `${SITE_URL}/conduite`,
      lastModified: derniere,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    ...CATEGORIES.map((c) => ({
      url: `${SITE_URL}/categorie/${CATEGORY_SLUGS[c]}`,
      lastModified: derniere,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    })),
    ...QUESTIONS.map((q) => ({
      url: `${SITE_URL}/q/${q.slug}`,
      lastModified: modifieeLe(q.slug),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];
}
