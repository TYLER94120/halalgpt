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

// Le bloc d'une fiche va de sa ligne « slug: » a sa ligne « related: », qui est
// toujours la derniere de l'entree. PAS jusqu'a la fiche suivante.
//
// POURQUOI CETTE BORNE, et le defaut qu'elle corrige (20 novembre).
//
// Le bloc s'arretait a la ligne precedant le `slug:` suivant. Il incluait donc
// deux lignes de plus : le `  },` qui ferme la fiche et le `  {` qui ouvre la
// suivante — deux lignes **identiques dans les 258 entrees du fichier**. Or
// `git log -L` suit une plage a travers l'historique en s'appuyant sur le
// contenu : des lignes generiques lui permettent de s'accrocher a la frontiere
// de n'importe quelle AUTRE fiche. Resultat, il rapportait pour une fiche la
// date d'une modification faite chez sa voisine.
//
// Mesure qui l'a revele : apres les corrections du 20 novembre, trois fiches
// que je n'avais pas touchees ont vu leur date de modification RECULER —
// `mauvais-oeil-protection` du 28 octobre au 11 aout, par exemple. Une date de
// modification ne recule pas, donc l'une des deux valeurs etait fausse. Verifiee
// a la main : `git log -S` sur une phrase propre a cette fiche ne donne qu'un
// seul commit, celui du 8 aout. **Son texte n'a pas change depuis sa creation,
// et le fichier annoncait pourtant le 28 octobre.** C'etait l'ancienne valeur
// qui etait fausse, pas la nouvelle.
//
// Ce que cela signifie : le plan du site annoncait a Google des mises a jour
// qui n'avaient pas eu lieu. L'en-tete de ce fichier porte la regle depuis le
// debut — « une date de mise a jour fausse est une promesse fausse, faite au
// lecteur autant qu'a Google » — et la methode la violait. Troisieme fois cette
// semaine qu'une regle ecrite n'etait pas appliquee par ce qu'elle gouverne.
const reperes = [];
lignes.forEach((l, i) => {
  const m = /^\s*slug:\s*'([^']+)'/.exec(l);
  if (m) reperes.push({ slug: m[1], ligne: i + 1 });
});

/** La ligne `related:` de la fiche qui commence a `depuis`, ou null. */
function finDuBloc(depuis, borneDure) {
  for (let j = depuis; j <= borneDure; j += 1) {
    if (/^\s*related:/.test(lignes[j - 1])) return j;
  }
  return null;
}

const git = (args) => {
  try {
    return execFileSync('git', args, { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
  } catch {
    return [];
  }
};

const dates = {};
reperes.forEach((r, i) => {
  const borneDure = i + 1 < reperes.length ? reperes[i + 1].ligne - 1 : lignes.length;
  // Si une fiche perdait sa ligne `related:`, on ne devine pas : on retombe sur
  // l'ancienne borne et le fichier le dira par une date trop recente, plutot
  // que de sauter la fiche en silence.
  const fin = finDuBloc(r.ligne, borneDure) ?? borneDure;

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
