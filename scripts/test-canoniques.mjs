// La balise canonique de chaque page indexable.
//
// Mesure du 13 aout : sur neuf pages, six declaraient leur canonique, deux
// etaient volontairement en `noindex` (labo-son, studio)... et la neuvieme
// etait l'ACCUEIL, la seule page vers laquelle pointent des liens exterieurs.
//
// La passerelle depuis voyageshalal.fr vise l'accueil depuis trois endroits,
// chacun avec ses parametres de campagne. Google voyait donc quatre adresses
// pour une seule page, et la confiance apportee par ces liens se repartissait
// entre elles au lieu de s'additionner. C'est le contraire de ce que la
// passerelle est censee faire.
//
// La regle verifiee ici : une page est soit indexable ET porteuse d'une
// canonique, soit explicitement `index: false`. Jamais entre les deux.
//
//   node scripts/test-canoniques.mjs
//
// Aucun reseau : on lit les fichiers de routes.

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

let echecs = 0;
const dire = (ok, quoi, detail = '') => {
  console.log(`${ok ? '✓' : '✗'} ${quoi}${detail ? ` — ${detail}` : ''}`);
  if (!ok) echecs += 1;
};

// Toutes les routes du dossier app/.
const routes = [];
const parcourir = (dossier) => {
  for (const entree of readdirSync(dossier)) {
    const chemin = join(dossier, entree);
    if (statSync(chemin).isDirectory()) parcourir(chemin);
    else if (entree === 'page.tsx') routes.push(chemin);
  }
};
parcourir('app');

const pages = routes.map((chemin) => {
  const source = readFileSync(chemin, 'utf8');
  return {
    chemin,
    canonique: /alternates:\s*\{[^}]*canonical/s.test(source),
    // `index: false` peut s'ecrire dans un objet robots sur une ou plusieurs lignes.
    nonIndexee: /robots:\s*\{[^}]*index:\s*false/s.test(source),
  };
});

dire(pages.length > 0, `${pages.length} routes lues dans app/`);

// ── 1. Toute page indexable declare sa canonique ─────────────────────────
const orphelines = pages.filter((p) => !p.nonIndexee && !p.canonique);
dire(
  orphelines.length === 0,
  'toute page indexable declare sa canonique',
  orphelines.map((p) => p.chemin).join(', '),
);

// ── 2. L'accueil en particulier ──────────────────────────────────────────
// Il est traite a part parce que c'est la seule page qui recoit des liens
// exterieurs : s'il en manque une, c'est celle-la qui coute le plus cher.
const accueil = pages.find((p) => p.chemin === 'app/page.tsx');
dire(Boolean(accueil?.canonique), 'l’accueil declare sa canonique');

// ── 3. Indexable d'un cote, dans le plan du site de l'autre ──────────────
//
// POURQUOI CETTE REGLE, et pourquoi elle a le droit d'exister ici.
//
// Le diagnostic qui gouverne le site est un budget d'exploration : Google ne
// vient pas lire 135 pages sur 199. Le plan du site est le SEUL artefact qui
// lui dise quoi venir chercher, et son renvoi dans Search Console est l'action
// en attente depuis le plus longtemps. Une page indexable absente du plan est
// donc une page qu'on a ecrite et qu'on ne demande pas a faire lire.
//
// MESURE DU 27 OCTOBRE 2026, avant d'ecrire cette assertion — parce que
// l'avertissement d'en dessous dit qu'un test qui invente sa regle fabrique du
// travail. Sur les dix routes de `app/` :
//
//     indexables, dans le plan          5   (/, /questions, /conduite,
//                                            /categorie/[slug], /q/[slug])
//     en noindex, hors du plan          5   (/e/[code], /studio, /labo-son,
//                                            /mentions-legales, /confidentialite)
//     indexables hors du plan           0
//     dans le plan mais non indexables  0
//
// La correspondance est donc EXACTE aujourd'hui, dans les deux sens. La regle
// n'est pas un vœu : elle decrit l'etat du site. Ce qu'on protege, c'est qu'une
// page ajoutee demain ne s'ecarte pas d'un cote sans l'autre — le genre d'oubli
// qui ne se voit jamais, puisqu'une page absente du plan s'affiche parfaitement.
//
// Et le piege que j'ai failli retomber dedans ce soir : j'ai d'abord compte
// `mentions-legales` et `confidentialite` comme des oublis du plan. Elles
// portent `index: false, follow: true` — exactement ce que le commentaire
// ci-dessous raconte pour le 13 aout. Deux fois la meme fausse alerte sur les
// deux memes pages, a deux mois d'intervalle.
{
  const planSource = readFileSync('app/sitemap.ts', 'utf8');

  /** Le chemin d'URL d'une route : app/questions/page.tsx -> /questions */
  const cheminDe = (f) =>
    `/${f.replace(/^app\//, '').replace(/\/?page\.tsx$/, '')}`.replace(/\/$/, '') || '/';

  /**
   * Le plan annonce-t-il ce chemin ? On exige le DELIMITEUR, pas seulement le
   * chemin : le gabarit fermant pour une route statique, le debut d'une
   * interpolation pour une route dynamique.
   *
   * DEUX FAUTES DE MA MAIN DANS CETTE SEULE FONCTION, toutes deux trouvees en
   * ecrivant le test d'echec et non en relisant :
   *
   *   1. Premiere version : elle cherchait le chemin litteral, donc annoncait
   *      `/q/[slug]` absent du plan. Les 250 fiches y sont — le plan les
   *      deroule avec un `.map()`, et c'est le PREFIXE qu'il faut chercher.
   *   2. Deuxieme version : `includes('${SITE_URL}/conduite')` repondait OUI
   *      alors que le plan disait `/conduite-xx`. Une sous-chaine n'est pas une
   *      egalite, et le garde ne detectait donc PAS une page retiree du plan —
   *      exactement le sens qu'il existe pour couvrir.
   */
  const dansLePlan = (chemin) => {
    if (chemin === '/') return /\{\s*url:\s*SITE_URL\s*,/.test(planSource);
    if (/\/\[\w+\]$/.test(chemin)) {
      // `${SITE_URL}/q/${q.slug}` : le prefixe est suivi d'une interpolation.
      const prefixe = chemin.replace(/\[\w+\]$/, '');
      return planSource.includes(`\${SITE_URL}${prefixe}\${`);
    }
    // `${SITE_URL}/conduite` : le chemin est suivi du backquote fermant.
    return planSource.includes(`\${SITE_URL}${chemin}\``);
  };

  const ecarts = [];
  for (const p of pages) {
    const chemin = cheminDe(p.chemin);
    const annonce = dansLePlan(chemin);
    if (!p.nonIndexee && !annonce) ecarts.push(`${chemin} est indexable mais absent du plan`);
    if (p.nonIndexee && annonce) ecarts.push(`${chemin} est en noindex mais annonce dans le plan`);
  }

  dire(
    ecarts.length === 0,
    `les ${pages.length} routes sont du meme cote du plan que de l'index`,
    ecarts.length ? ecarts.join(' · ') : 'indexable et annonce vont ensemble, dans les deux sens',
  );
}

// Ce que ce test NE verifie PAS, et pourquoi c'est volontaire.
//
// Premiere version, ecrite le 13 aout : elle interdisait de cumuler « noindex »
// et canonique, et elle a immediatement accuse mentions-legales et
// confidentialite. Verification faite, ces deux pages declarent
// `index: false, follow: true` avec une canonique — et c'est un choix sain :
// on ne veut pas de la page dans Google, on veut que ses liens soient suivis.
// La regle n'existait nulle part ailleurs que dans ma tete.
//
// Un test qui invente sa regle fabrique du travail au lieu d'en eviter. Celui-ci
// ne defend donc qu'une chose, mesuree : une page indexable sans canonique.

console.log(
  `\n   ${pages.filter((p) => p.canonique).length} pages canoniques, ` +
    `${pages.filter((p) => p.nonIndexee).length} volontairement hors de Google.`,
);

if (echecs > 0) {
  console.log(`\n✗ ${echecs} echec(s)`);
  process.exit(1);
}
console.log('\n✓ Chaque page dit a Google quelle adresse fait foi.');
