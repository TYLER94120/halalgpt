// Aucune fiche ne doit sortir avec un titre coupe par Google.
//
// Ce test existe parce que le defaut s'est produit sans que personne le voie :
// le 10 aout 2026, la ronde des sites a trouve 22 fiches sur 189 dont le titre
// depassait 60 caracteres — dont trois que j'avais ecrites le matin meme. Un
// titre coupe ne se voit pas en relisant son travail ; il se voit dans les
// resultats de Google, c'est-a-dire trop tard.
//
// Le mecanisme repare l'existant. Ce test empeche la fiche numero 190 de
// reintroduire le probleme.
//
//   node scripts/test-titres.mjs

import { readFileSync } from 'node:fs';

const LIMITE = 60;
const SUFFIXE = ' — HalalGPT';

const src = readFileSync(new URL('../lib/questions.ts', import.meta.url), 'utf8');

// On lit le fichier source plutot que d'importer le module : pas de
// compilation TypeScript a faire tourner pour un test qui doit rester
// instantane, donc lancable a chaque fiche ecrite.
const fiches = [];
const re = /slug:\s*'([^']+)',\s*\n\s*question:\s*'((?:[^'\\]|\\.)*)',\s*\n(?:\s*titreSeo:\s*'((?:[^'\\]|\\.)*)',\s*\n)?/g;
let m;
while ((m = re.exec(src))) {
  fiches.push({
    slug: m[1],
    question: m[2].replace(/\\'/g, "'"),
    titreSeo: m[3] ? m[3].replace(/\\'/g, "'") : undefined,
  });
}

if (fiches.length < 150) {
  console.error(`✗ Lecture suspecte : ${fiches.length} fiches trouvees.`);
  console.error('  Quand un comptage rend un chiffre etrange, soupconne le comptage.');
  process.exit(1);
}

const coupes = [];
const sansMarque = [];

for (const f of fiches) {
  const base = (f.titreSeo ?? f.question).trim();
  const titre = base.length + SUFFIXE.length <= LIMITE ? base + SUFFIXE : base;

  if (titre.length > LIMITE) {
    coupes.push({ ...f, titre });
  } else if (!titre.endsWith(SUFFIXE)) {
    sansMarque.push({ ...f, titre });
  }

  // Un titreSeo qui ne sert a rien est du bruit : il faut qu'on comprenne au
  // premier coup d'oeil pourquoi une fiche en porte un.
  if (f.titreSeo && f.question.length + SUFFIXE.length <= LIMITE) {
    console.error(`✗ ${f.slug} : titreSeo inutile, la question tient deja.`);
    process.exit(1);
  }
}

console.log(`${fiches.length} fiches verifiees.`);

if (sansMarque.length) {
  console.log(`\n${sansMarque.length} sans la marque (titre entier prefere au suffixe) :`);
  for (const f of sansMarque) console.log(`  ${String(f.titre.length).padStart(2)}  ${f.slug}`);
}

if (coupes.length) {
  console.error(`\n✗ ${coupes.length} titre(s) coupe(s) par Google :`);
  for (const f of coupes) {
    console.error(`  ${f.titre.length} car.  ${f.slug}`);
    console.error(`         ${f.titre}`);
    console.error(`         → ajoute un champ titreSeo de 60 caracteres maximum.`);
  }
  process.exit(1);
}

console.log('\n✓ Aucun titre coupe. Les 60 caracteres sont tenus partout.');
