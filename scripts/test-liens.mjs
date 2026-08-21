// Chaque fiche propose des fiches voisines, via son champ `related`. Ce test
// verifie que ces voisines existent vraiment.
//
// Pourquoi ce test existe. Le 21 aout, en ecrivant la fiche du E901, j'ai
// pointe un lien vers `miel-halal` — une fiche qui n'a jamais ete ecrite. Le
// site n'a pas bronche : `app/q/[slug]/page.tsx` fait un `.filter(Boolean)`
// sur les voisines introuvables. Le lien a simplement disparu de la page. Pas
// d'erreur de construction, pas d'avertissement, rien.
//
// C'est exactement le genre de panne qu'on ne voit jamais : elle ne casse
// rien, elle enleve. Un maillage interne se degrade silencieusement, une
// fiche par une fiche, et le seul symptome est ailleurs — dans le temps que
// Google met a decouvrir les pages profondes.
//
//     node scripts/test-liens.mjs
//
// Deux autres pieges couverts ici : une fiche qui se cite elle-meme (le lien
// ne mene nulle part et occupe une place), et une fiche que personne ne cite
// (orpheline : atteignable seulement par la liste et le plan du site).

import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../lib/questions.ts', import.meta.url), 'utf8');

let echecs = 0;
const dire = (ok, quoi, detail = '') => {
  console.log(`${ok ? '✓' : '✗'} ${quoi}${detail ? ` — ${detail}` : ''}`);
  if (!ok) echecs += 1;
};

// On lit le fichier source plutot que le module compile : ce test doit
// pouvoir tourner sans construire le site.
const fiches = [];
for (const bloc of source.split("slug: '").slice(1)) {
  const slug = bloc.split("'")[0];
  const m = /related: \[([^\]]*)\]/.exec(bloc);
  fiches.push({ slug, related: m ? [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1]) : [] });
}
const existe = new Set(fiches.map((f) => f.slug));

// ── 1. Aucun lien ne pointe dans le vide ─────────────────────────────────
const morts = fiches.flatMap((f) =>
  f.related.filter((r) => !existe.has(r)).map((r) => `${f.slug} → ${r}`),
);
dire(morts.length === 0, `les liens entre fiches menent tous quelque part`,
  morts.slice(0, 5).join(', '));

// ── 2. Aucune fiche ne se cite elle-meme ─────────────────────────────────
const boucles = fiches.filter((f) => f.related.includes(f.slug)).map((f) => f.slug);
dire(boucles.length === 0, 'aucune fiche ne se propose comme sa propre voisine',
  boucles.slice(0, 5).join(', '));

// ── 3. Aucun doublon de slug ─────────────────────────────────────────────
const vus = new Set();
const doublons = fiches.filter((f) => (vus.has(f.slug) ? true : (vus.add(f.slug), false)));
dire(doublons.length === 0, 'chaque slug est unique',
  doublons.map((f) => f.slug).slice(0, 5).join(', '));

// ── 4. Chaque fiche declare des voisines ─────────────────────────────────
const sansVoisines = fiches.filter((f) => f.related.length === 0).map((f) => f.slug);
dire(sansVoisines.length === 0, 'chaque fiche propose au moins une voisine',
  sansVoisines.slice(0, 5).join(', '));

// ── 5. Les orphelines ────────────────────────────────────────────────────
// Pas un echec : une fiche neuve est forcement orpheline le temps qu'on la
// cite ailleurs. Mais elle doit etre nommee, sinon elle le reste.
const cites = new Set(fiches.flatMap((f) => f.related));
const orphelines = fiches.filter((f) => !cites.has(f.slug)).map((f) => f.slug);
console.log(
  `\n   ${fiches.length} fiches, ${cites.size} citees par au moins une autre.` +
  (orphelines.length
    ? `\n   ${orphelines.length} orpheline(s), a citer depuis une fiche voisine :` +
      `\n     ${orphelines.join(', ')}`
    : '\n   Aucune orpheline.'),
);

console.log(
  echecs === 0
    ? '\n✓ Le maillage interne tient.'
    : `\n✗ ${echecs} echec(s)`,
);
process.exit(echecs === 0 ? 0 : 1);
