// La decision de Mohamed du 12 aout : plus AUCUNE nouvelle fiche nourriture.
//
//   « Oui pour diminuer pourcentage nourriture »
//
// Le catalogue etait a 107 fiches nourriture sur 193, soit 55,4 %. Chaque fiche
// alimentaire de plus rendait le site PLUS alimentaire, meme quand on
// reequilibrait la vitrine de l'accueil — et Google comme les visiteurs
// finissaient par croire qu'on ne repond que sur les etiquettes.
//
// Pourquoi ce test plutot qu'une note dans un document : une consigne ecrite
// quelque part se perd en trois nuits. La vague automatique ajoute deux a cinq
// fiches chaque nuit, sans personne pour relire. Ici, une fiche nourriture de
// trop fait echouer les controles, et il faut une decision consciente pour
// passer outre.
//
// Un COMPTE et non un pourcentage : un plafond en pourcentage se contournerait
// en ajoutant beaucoup de fiches ailleurs. Le compte dit exactement ce que
// Mohamed a decide — zero nouvelle.
//
// SI LA DECISION CHANGE : Mohamed le dit, on monte le plafond, et on ecrit
// pourquoi ici. Ce n'est pas un test qu'on desactive en silence.
//
//   node scripts/test-nourriture.mjs

import { QUESTIONS } from '../lib/questions.ts';

/** Les trois categories qui parlent de nourriture. */
const NOURRITURE = new Set(['Produits', 'Additifs', 'Alimentation']);

/** Etat au 12 aout 2026, jour de la decision. On ne monte plus. */
const PLAFOND = 107;

/** Ou l'on veut arriver : 48 %, l'objectif annonce a Mohamed. */
const PART_VISEE = 0.48;

let echecs = 0;
const dire = (ok, quoi, detail = '') => {
  console.log(`${ok ? '✓' : '✗'} ${quoi}${detail ? ` — ${detail}` : ''}`);
  if (!ok) echecs += 1;
};

const nourriture = QUESTIONS.filter((q) => NOURRITURE.has(q.category));
const part = nourriture.length / QUESTIONS.length;

// ── 1. Le plafond ────────────────────────────────────────────────────────
dire(
  nourriture.length <= PLAFOND,
  `pas plus de ${PLAFOND} fiches nourriture`,
  nourriture.length > PLAFOND
    ? `${nourriture.length} au lieu de ${PLAFOND} — ${nourriture.length - PLAFOND} de trop. ` +
      'Mohamed a decide le 12 aout : aucune nouvelle fiche nourriture.'
    : `${nourriture.length}`,
);

// ── 2. La part ne remonte pas ────────────────────────────────────────────
// Elle peut descendre toute seule : chaque fiche ecrite ailleurs la fait
// baisser sans qu'on touche a l'existant. C'est tout le principe.
dire(
  part <= 107 / 193 + 0.0001,
  'la part de nourriture ne remonte pas',
  `${(part * 100).toFixed(1)} % (etait 55,4 % le 12 aout)`,
);

// ── 3. Ou l'on en est ────────────────────────────────────────────────────
// Pas une regle : le chemin qui reste, pour que ce soit concret plutot
// qu'un principe.
const totalVise = Math.ceil(nourriture.length / PART_VISEE);
const aEcrire = Math.max(0, totalVise - QUESTIONS.length);
const autres = QUESTIONS.length - nourriture.length;

console.log(
  `\n   ${nourriture.length} fiches nourriture · ${autres} fiches de vie generale` +
  `\n   part actuelle : ${(part * 100).toFixed(1)} %   objectif : 48 %` +
  (aEcrire > 0
    ? `\n   il reste ${aEcrire} fiches NON alimentaires a ecrire pour y arriver` +
      `\n   (a trois par nuit : environ ${Math.ceil(aEcrire / 3)} nuits)`
    : '\n   objectif atteint.'),
);

console.log(
  echecs === 0
    ? '\n✓ Le site devient moins alimentaire a chaque fiche ecrite ailleurs.'
    : `\n✗ ${echecs} echec(s)`,
);
process.exit(echecs === 0 ? 0 : 1);
