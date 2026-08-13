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
