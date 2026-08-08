// Genere lib/dates-fiches.json : pour chaque fiche, la date de sa premiere
// publication et celle de sa derniere modification reelle, lues dans
// l'historique git.
//
// Deux mesures differentes, parce qu'une seule ne suffit pas :
//   · publiee  — `git log -S` sur la ligne du slug : le pioche ne repere que
//     les commits ou le NOMBRE d'occurrences change, donc exactement celui qui
//     cree la fiche. Parfait pour la date de naissance.
//   · modifiee — `git log -L` sur le bloc de la fiche : suit ces lignes-la a
//     travers l'historique, meme quand elles se deplacent. C'est la seule
//     facon de voir un enrichissement, que `-S` manque completement (le slug
//     ne change pas quand on reecrit la reponse au-dessus).
//
// Pourquoi un fichier fige plutot qu'une lecture a la construction : Vercel
// clone le depot sans son historique. Le calcul se fait ici, une fois, et le
// resultat est versionne. A relancer apres avoir enrichi des fiches :
//     node scripts/dates-fiches.mjs
//
// Ces dates ne sont jamais inventees. Une date de mise a jour fausse est une
// promesse fausse, faite au lecteur autant qu'a Google.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

const CHEMIN = 'lib/questions.ts';
const lignes = readFileSync(new URL(`../${CHEMIN}`, import.meta.url), 'utf8').split('\n');

// Le bloc d'une fiche va de sa ligne « slug: » jusqu'a celle de la suivante.
const reperes = [];
lignes.forEach((l, i) => {
  const m = /^\s*slug:\s*'([^']+)'/.exec(l);
  if (m) reperes.push({ slug: m[1], ligne: i + 1 });
});

const git = (args) => {
  try {
    return execFileSync('git', args, { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
  } catch {
    return [];
  }
};

const dates = {};
reperes.forEach((r, i) => {
  const fin = i + 1 < reperes.length ? reperes[i + 1].ligne - 1 : lignes.length;

  const naissance = git(['log', '--format=%cI', '-S', `slug: '${r.slug}'`, '--', CHEMIN]);
  const touches = git(['log', '-L', `${r.ligne},${fin}:${CHEMIN}`, '--format=%cI', '-s']);

  const publie = naissance[naissance.length - 1] || touches[touches.length - 1];
  if (!publie) return;
  // Une modification anterieure a la publication n'a pas de sens : dans ce cas
  // les lignes suivies appartenaient a une autre fiche avant le decoupage.
  const modifie = touches[0] && touches[0] > publie ? touches[0] : publie;

  dates[r.slug] = { publie, modifie };
});

writeFileSync(
  new URL('../lib/dates-fiches.json', import.meta.url),
  JSON.stringify(dates) + '\n'
);

const enrichies = Object.values(dates).filter((d) => d.modifie !== d.publie).length;
console.log(`${Object.keys(dates).length} fiches datees, dont ${enrichies} enrichies depuis leur publication`);
