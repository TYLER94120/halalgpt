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


// ─────────────────────────────────────────────────────────────────────────────
// LE PLANCHER DE LIENS ENTRANTS — ajoute le 14 aout 2026.
//
// Search Console ce jour-la : 52 pages dans l'index, 147 non. Et le motif de
// 135 d'entre elles est « Detectee, actuellement non indexee » — Google connait
// l'adresse et n'est JAMAIS venu la lire. Seulement 6 sont en « exploree, non
// indexee », c'est-a-dire reellement refusees.
//
// Google ne rejette pas notre contenu : il ne vient pas le chercher. Et le seul
// levier d'exploration entierement dans nos mains est le maillage : une page
// vers laquelle une seule autre pointe ressemble a une page sans importance.
//
// Mesure du meme jour : 101 fiches sur 207 avaient 2 liens entrants ou moins.
// Apres densification, la mediane est passee de 2 a 4.
//
// Ce controle empeche la vague de nuit de reconstituer le trou : une fiche
// ajoutee sans liens entrants ne sert a rien, elle allonge une file d'attente
// que Google ne traite deja pas.
const PLANCHER_ENTRANTS = 3;

// Trois fiches n'ont pas assez de voisines naturelles pour atteindre le
// plancher. On les nomme plutot que d'abaisser la regle pour tout le monde, et
// plutot que de leur fabriquer un lien depuis une fiche etrangere — un maillage
// artificiel dessert le lecteur et Google le traite comme du bruit.
const SANS_VOISINES = new Set(['ia-halal', 'zakat-al-fitr-montant', 'vitamine-d3-halal']);

{
  const entrants = new Map(QUESTIONS.map((q) => [q.slug, 0]));
  for (const q of QUESTIONS) for (const r of q.related) entrants.set(r, (entrants.get(r) ?? 0) + 1);

  const sousLePlancher = [...entrants.entries()]
    .filter(([slug, n]) => n < PLANCHER_ENTRANTS && !SANS_VOISINES.has(slug));

  if (sousLePlancher.length) {
    echecs += 1;
    console.log(`✗ ${sousLePlancher.length} fiche(s) sous ${PLANCHER_ENTRANTS} liens entrants — Google n'ira pas les lire`);
    for (const [slug, n] of sousLePlancher.slice(0, 12)) console.log(`      ${n} lien(s) : ${slug}`);
    console.log('      Lancer : node scripts/densifier-maillage.mjs --ecrire');
  } else {
    console.log(`✓ toutes les fiches ont au moins ${PLANCHER_ENTRANTS} liens entrants (${SANS_VOISINES.size} exceptions nommees)`);
  }

  const valeurs = [...entrants.values()].sort((a, b) => a - b);
  console.log(`\n   mediane : ${valeurs[Math.floor(valeurs.length / 2)]} liens entrants par fiche.`);
}

console.log(
  echecs === 0
    ? '\n✓ Aucune fiche n’est une impasse : Google peut toutes les atteindre.'
    : `\n✗ ${echecs} echec(s)`,
);
process.exit(echecs === 0 ? 0 : 1);
