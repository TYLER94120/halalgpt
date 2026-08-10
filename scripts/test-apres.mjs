// Les questions proposées sous une réponse doivent être DANS le sujet.
//
// Le piège de cette fonctionnalité : proposer trois questions au hasard sous
// une réponse. Ça a l'air de marcher — il y a bien trois boutons — et c'est
// pourtant pire que rien : le lecteur clique une fois, tombe à côté, et ne
// clique plus jamais.
//
// Ces cas sont écrits AVANT de brancher quoi que ce soit à l'écran.
//
//   node scripts/test-apres.mjs

import { readFileSync } from 'node:fs';

import { questionsApres, jetons } from '../lib/apres.js';

// On lit les fiches depuis la source plutôt que d'importer le module
// TypeScript : le test doit rester instantané.
const src = readFileSync(new URL('../lib/questions.ts', import.meta.url), 'utf8');
const fiches = [];
const re =
  /slug:\s*'([^']+)',\s*\n\s*question:\s*'((?:[^'\\]|\\.)*)',[\s\S]*?category:\s*'([^']+)',\s*\n\s*related:\s*\[([^\]]*)\]/g;
let m;
while ((m = re.exec(src))) {
  fiches.push({
    slug: m[1],
    question: m[2].replace(/\\'/g, "'"),
    category: m[3],
    related: [...m[4].matchAll(/'([^']+)'/g)].map((x) => x[1]),
  });
}

let passes = 0;
const echecs = [];
const verifier = (nom, ok, detail = '') => {
  if (ok) passes += 1;
  else echecs.push(`${nom}${detail ? ` — ${detail}` : ''}`);
};

if (fiches.length < 150) {
  console.error(`✗ Lecture suspecte : ${fiches.length} fiches. Soupçonne le comptage.`);
  process.exit(1);
}
console.log(`${fiches.length} fiches lues.`);

// ─── Le cas que Mohamed a donné en exemple ───────────────────────────────────

const prieres = questionsApres('comment rattraper mes prières', fiches);
verifier('« rattraper mes prières » propose des questions', prieres.length > 0);
verifier(
  '… et elles parlent bien de prière',
  prieres.some((q) => /pri[eè]re|salat|fajr|wudu|ablution|mosqu/i.test(q.question)),
  JSON.stringify(prieres.map((q) => q.question)),
);
console.log('\n« rattraper mes prières » →');
for (const q of prieres) console.log(`   ${q.question}`);

// ─── Le sujet doit vraiment changer avec la question ─────────────────────────

const e120 = questionsApres('le E120 est-il halal', fiches);
console.log('\n« le E120 est-il halal » →');
for (const q of e120) console.log(`   ${q.question}`);
verifier('« E120 » propose des questions', e120.length > 0);
verifier(
  '… différentes de celles des prières',
  e120.every((q) => !prieres.some((p) => p.slug === q.slug)),
  'les deux sujets rendent les mêmes suggestions',
);

const ramadan = questionsApres('est-ce que je peux me doucher pendant le ramadan', fiches);
console.log('\n« se doucher pendant le ramadan » →');
for (const q of ramadan) console.log(`   ${q.question}`);
verifier(
  '« ramadan » reste dans le Ramadan',
  ramadan.length > 0 &&
    ramadan.some((q) => /ramadan|je[uû]ne|fajr|iftar|sahur/i.test(q.question)),
  JSON.stringify(ramadan.map((q) => q.question)),
);

// ─── Ce qu'il ne faut JAMAIS faire ───────────────────────────────────────────

verifier(
  'une question hors sujet ne propose RIEN plutôt que du hasard',
  questionsApres('quelle est la capitale de la Mongolie', fiches).length === 0,
  JSON.stringify(questionsApres('quelle est la capitale de la Mongolie', fiches)),
);
verifier('une question vide ne propose rien', questionsApres('', fiches).length === 0);
verifier(
  'les mots trop courants ne suffisent pas à déclencher',
  questionsApres('est-ce que c’est halal', fiches).length === 0,
  '« halal » seul ne désigne aucune fiche en particulier',
);

// La fiche qui répond ne doit jamais être proposée sous sa propre réponse.
const surSaPropreFiche = questionsApres('le E120 est-il halal', fiches);
verifier(
  'la fiche qui répond ne se propose pas elle-même',
  !surSaPropreFiche.some((q) => q.slug === 'e120-halal'),
);

// Ce qui a déjà été vu dans le fil ne revient pas.
const sansDeja = questionsApres('le E120 est-il halal', fiches, e120.map((q) => q.slug));
verifier(
  'les questions déjà proposées ne reviennent pas',
  sansDeja.every((q) => !e120.some((d) => d.slug === q.slug)),
  JSON.stringify(sansDeja.map((q) => q.slug)),
);

// ─── Robustesse sur les 189 fiches ───────────────────────────────────────────

let sansPropositions = 0;
let horsCatalogue = 0;
const connus = new Set(fiches.map((f) => f.slug));
for (const f of fiches) {
  const r = questionsApres(f.question, fiches);
  if (r.length === 0) sansPropositions += 1;
  if (r.some((q) => !connus.has(q.slug))) horsCatalogue += 1;
  if (r.some((q) => q.slug === f.slug)) horsCatalogue += 1;
}
console.log(`\nSur les ${fiches.length} fiches : ${sansPropositions} sans proposition.`);
verifier(
  'presque toutes les fiches savent quoi proposer',
  sansPropositions <= 5,
  `${sansPropositions} fiches sans suggestion`,
);
verifier(
  'aucune proposition ne pointe hors du catalogue ni sur elle-même',
  horsCatalogue === 0,
  `${horsCatalogue} cas`,
);
verifier('la tokenisation ignore les mots vides', !jetons('est-ce que le halal').has('halal'));

// ─── Résultat ────────────────────────────────────────────────────────────────

console.log(`\n${passes} sur ${passes + echecs.length} — ${echecs.length} raté(s)`);
if (echecs.length) {
  console.error('\n✗ Échecs :');
  for (const e of echecs) console.error(`  - ${e}`);
  process.exit(1);
}
console.log('\n✓ Les questions proposées restent dans le sujet, ou il n’y en a pas.');
