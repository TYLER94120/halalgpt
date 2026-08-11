// Aucune fiche ne doit etre une impasse : chacune doit etre atteignable depuis
// une autre.
//
// Mesure du 11 aout : 4 fiches sur 193 n'avaient AUCUN lien entrant — et
// c'etaient les quatre ecrites la nuit meme. Ce n'est pas un hasard : quand on
// ajoute une fiche, on lui donne des `related`, on ne pense jamais a l'inverse.
// La vague de nuit en cree deux a cinq par nuit, donc le probleme se refabrique
// tout seul. D'ou ce test.
//
// Pourquoi ca compte, maintenant que Mohamed a demande de mettre le paquet sur
// le referencement naturel : une page vers laquelle rien ne pointe est une page
// que Google visite a peine et classe encore moins. Les liens internes sont le
// seul levier de referencement entierement sous notre controle — ils ne
// demandent la permission de personne.
//
//   node scripts/test-liens-internes.mjs
//
// Aucun reseau, aucune construction : on lit le catalogue.

import { QUESTIONS } from '../lib/questions.ts';

let echecs = 0;
const dire = (ok, quoi, detail = '') => {
  console.log(`${ok ? '✓' : '✗'} ${quoi}${detail ? ` — ${detail}` : ''}`);
  if (!ok) echecs += 1;
};

const slugs = new Set(QUESTIONS.map((q) => q.slug));
const entrants = new Map(QUESTIONS.map((q) => [q.slug, 0]));
for (const q of QUESTIONS) {
  for (const r of q.related ?? []) {
    if (entrants.has(r)) entrants.set(r, entrants.get(r) + 1);
  }
}

// ── 1. Personne n'est une impasse ─────────────────────────────────────────
const orphelines = [...entrants].filter(([, n]) => n === 0).map(([s]) => s);
dire(
  orphelines.length === 0,
  `les ${QUESTIONS.length} fiches ont au moins un lien entrant`,
  orphelines.length ? `SANS LIEN : ${orphelines.join(', ')}` : '',
);

// ── 2. Aucun lien ne pointe dans le vide ─────────────────────────────────
const morts = [];
for (const q of QUESTIONS) {
  for (const r of q.related ?? []) if (!slugs.has(r)) morts.push(`${q.slug} → ${r}`);
}
dire(morts.length === 0, 'aucun lien « related » ne pointe vers une fiche inexistante',
  morts.join(' · '));

// ── 3. Aucune fiche ne se cite elle-meme ─────────────────────────────────
const soi = QUESTIONS.filter((q) => (q.related ?? []).includes(q.slug)).map((q) => q.slug);
dire(soi.length === 0, 'aucune fiche ne se renvoie a elle-meme', soi.join(', '));

// ── 4. Chaque fiche propose au moins deux sorties ────────────────────────
// Une fiche sans sortie renvoie le visiteur a Google, et c'est perdu.
const sansSortie = QUESTIONS.filter((q) => (q.related ?? []).length < 2).map((q) => q.slug);
dire(sansSortie.length === 0, 'chaque fiche propose au moins deux autres fiches',
  sansSortie.join(', '));

// ── 5. L'etat des lieux, pour voir venir ─────────────────────────────────
// Pas une regle : une mesure. Une fiche a un seul lien entrant n'est pas
// fautive, mais si ce nombre grimpe, le maillage se degrade sans rien casser.
const seules = [...entrants].filter(([, n]) => n === 1);
const total = [...entrants].reduce((s, [, n]) => s + n, 0);
console.log(
  `\n   ${total} liens internes, soit ${(total / QUESTIONS.length).toFixed(1)} par fiche.` +
  `\n   ${seules.length} fiches n'ont qu'un seul lien entrant (a surveiller, pas un defaut).`,
);

console.log(
  echecs === 0
    ? '\n✓ Aucune fiche n’est une impasse : Google peut toutes les atteindre.'
    : `\n✗ ${echecs} echec(s)`,
);
process.exit(echecs === 0 ? 0 : 1);
