// Qui parle de cette fiche ? L'outil qui termine une correction.
//
//     node scripts/renvois.mjs kfc-halal
//
// POURQUOI CE FICHIER EXISTE, ET POURQUOI CE N'EST PAS UN TEST
//
// Le 29 octobre, mesure faite apres avoir corrige cinq fiches de chaine en
// octobre : `mcdo-halal` portait encore une seule phrase donnant l'etat de CINQ
// reseaux d'un coup — « KFC, Burger King, Quick, Subway et Domino's ne servent
// pas non plus de viande halal en France » — fausse sur trois d'entre eux, dont
// DEUX que j'avais moi-meme corriges deux semaines plus tot. Et `mcdo-halal` est
// l'une des onze pages que Google visite : la plus vue du lot portait l'erreur.
//
// J'avais applique la regle aux fiches reecrites, pas aux fiches QUI PARLENT
// D'ELLES. Une correction n'est donc pas finie quand la fiche est juste : elle
// est finie quand ce que les autres en disent est juste aussi.
//
// CE QUE CE FICHIER N'EST PAS, et le raisonnement compte autant que l'outil.
// La tentation etait d'en faire un garde-fou de plus. Trois raisons de ne pas :
//
//   1. Juger si une mention est PERIMEE n'est pas derivable : il faut lire. Un
//      test ne pourrait signaler que des candidats, et un garde noye dans son
//      bruit cesse de mesurer (lecon du 20 octobre).
//   2. Le declencheur n'est pas un etat du depot mais un GESTE : « je viens de
//      corriger une fiche de marque ». Aucun test lance a chaque commit ne peut
//      le savoir.
//   3. Mesure du 30 octobre : apres les corrections de la veille, la forme
//      fautive n'existe plus nulle part. Il n'y a donc rien a garder — il y a un
//      geste a outiller.
//
// D'OU LES NOMS TIRES DU SLUG, et c'est la deuxieme version de ce fichier.
// La premiere lisait les majuscules du TITRE pour deviner les noms propres.
// Resultat au premier essai : « Par » et « Des » donnes comme noms de
// `lardons-halal` (29 renvois !), « Que » pour `halal-definition`, « Je » pour
// `retard-fajr-reveil` — des mots de debut de phrase — et « Dubai » tronque en
// « Duba », « Thailande » en « Tha », parce que les lettres accentuees ne sont
// pas dans `\\w`. Il aurait fallu allonger une liste d'exclusions, c'est-a-dire
// fabriquer exactement la peremption qu'on fuit depuis le 19 septembre.
//
// Le slug, lui, est ECRIT A LA MAIN, en minuscules, sans accent, et il nomme
// deja le sujet : `kfc-halal` -> « kfc », `burger-king-halal` -> « burger
// king ». Aucune heuristique, aucune liste a tenir.

import { QUESTIONS } from '../lib/questions.ts';

/** Les suffixes de classement d'un slug : ils ne nomment pas le sujet. */
const SUFFIXES = /-(halal|islam|france|ramadan|priere)$/;

/** « burger-king-halal » -> ['burger king', 'burger-king'] */
function termesDe(slug) {
  const nu = slug.replace(SUFFIXES, '').replace(SUFFIXES, '');
  return [...new Set([nu.replace(/-/g, ' '), nu])].filter((t) => t.length >= 3);
}

/** Sans accents ni casse : « Häagen-Dazs » et « haagen dazs » doivent se croiser. */
const aplati = (t) =>
  t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const cible = process.argv[2];

if (!cible) {
  console.error('\nUsage : node scripts/renvois.mjs <slug>');
  console.error('\nA lancer apres avoir corrige une fiche, pour voir ce que les');
  console.error('autres fiches en disent encore. Une correction n\'est pas finie');
  console.error('tant que ces phrases-la n\'ont pas ete relues.\n');
  process.exit(1);
}

const fiche = QUESTIONS.find((q) => q.slug === cible);
if (!fiche) {
  console.error(`\n✗ Pas de fiche « ${cible} ».\n`);
  process.exit(1);
}

const termes = termesDe(cible).map(aplati);
console.log(`\nRENVOIS VERS ${cible}`);
console.log(`« ${fiche.question} »`);
console.log(`Termes cherches : ${termes.map((t) => `« ${t} »`).join(', ')}\n`);

let phrases = 0;
let fiches = 0;
for (const autre of QUESTIONS) {
  if (autre.slug === cible) continue;
  const trouvees = `${autre.short} ${autre.answer.join(' ')}`
    .split(/(?<=[.!?])\s+/)
    .filter((p) => termes.some((t) => aplati(p).includes(t)));
  if (trouvees.length === 0) continue;
  fiches += 1;
  console.log(`━━━ ${autre.slug}  [${autre.category}]`);
  for (const p of trouvees) {
    console.log(`    ${p.trim()}`);
    phrases += 1;
  }
  console.log();
}

if (phrases === 0) {
  console.log('Aucune autre fiche n\'en parle : la correction est complete.\n');
} else {
  console.log(`${phrases} phrase(s) dans ${fiches} fiche(s).`);
  console.log('Cet outil ne juge pas, il montre : c\'est a la lecture de dire ce');
  console.log('qui est perime.\n');
}
