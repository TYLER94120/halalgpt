// Densifier le maillage interne — l'outil qui fait venir Google.
//
// POURQUOI CE FICHIER EXISTE. Search Console, 14 août 2026 : sur 199 pages
// connues de Google, **52 sont dans l'index et 147 non**. Et le motif des 147
// tranche la question :
//
//   135  « Détectée, actuellement non indexée »  ← Google n'est JAMAIS venu
//     6  « Explorée, actuellement non indexée »  ← Google est venu et a refusé
//     4  Page en double sans canonique
//     2  Exclue par « noindex » (les nôtres, volontaires)
//
// Google ne rejette pas notre contenu : **il ne vient pas le lire.** Six refus
// sur 207 fiches, c'est un contenu jugé correct. Le problème est le budget
// d'exploration, et le seul levier qui soit entièrement dans nos mains pour
// l'augmenter, c'est le maillage interne.
//
// Mesure du même jour : **101 fiches sur 207 ont 2 liens entrants ou moins**,
// pendant qu'une poignée en concentre 18. Une page vers laquelle une seule
// autre pointe ressemble, pour un robot, à une page sans importance — il ne se
// presse pas d'aller la voir.
//
// CE QUE CET OUTIL FAIT, et surtout ce qu'il ne fait pas
// -----------------------------------------------------
// Il ajoute des liens `related` vers les fiches sous-liées, en choisissant les
// sources dans cet ordre :
//   1. les pages que Google VISITE DÉJÀ (elles ont des impressions) — c'est par
//      elles que l'exploration se propage ;
//   2. les fiches de la même catégorie ;
//   3. les fiches proches par les mots de la question.
//
// Il ne relie JAMAIS deux fiches au hasard. Un lien entre « Le E120 est-il
// halal ? » et « Peut-on prier pendant les règles ? » ferait du volume et
// desservirait le lecteur — et Google traite un maillage artificiel comme du
// bruit. Le critère éditorial passe avant le compte.

import { readFileSync, writeFileSync } from 'node:fs';

import { QUESTIONS } from '../lib/questions.ts';

// Les pages dont Search Console montre qu'elles reçoivent des impressions au
// 14 août : Google y va déjà. Ce sont nos portes d'entrée.
const VISITEES = new Set([
  'levure-biere-halal', 'mentos-halal', 'priere-voiture', 'medicaments-gelules-halal',
  'vernis-ongles-priere', 'glace-halal', 'e466-halal', 'e621-halal',
  'certifications-halal-france', 'mcdo-halal', 'isla-delice-halal',
]);

const PLANCHER = 4;   // liens entrants visés par fiche
const PLAFOND_SORTANT = 8; // au-delà, la fiche devient une liste et le lecteur décroche

const MOTS_VIDES = new Set(['le','la','les','un','une','des','du','de','et','ou','est','sont',
  'il','elle','on','ce','cette','ces','en','dans','pour','par','avec','sans','que','qui','quoi',
  'a','au','aux','son','sa','ses','leur','plus','peut','peut-on','y','t','il','halal','islam',
  'musulman','musulmane','quelle','quel','comment','pourquoi','combien','faut','doit','se','ne','pas']);

function mots(texte) {
  return new Set(
    texte.toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .split(/[^a-z0-9]+/)
      .filter((m) => m.length > 3 && !MOTS_VIDES.has(m)),
  );
}

const parSlug = new Map(QUESTIONS.map((q) => [q.slug, q]));
const motsDe = new Map(QUESTIONS.map((q) => [q.slug, mots(q.question + ' ' + q.short)]));

function entrants() {
  const n = new Map(QUESTIONS.map((q) => [q.slug, 0]));
  for (const q of QUESTIONS) for (const r of q.related) n.set(r, (n.get(r) ?? 0) + 1);
  return n;
}

/** Note d'affinité entre deux fiches. 0 = on ne relie pas. */
function affinite(source, cible) {
  if (source.slug === cible.slug) return 0;
  if (source.related.includes(cible.slug)) return 0;
  if (source.related.length >= PLAFOND_SORTANT) return 0;

  const communs = [...motsDe.get(source.slug)].filter((m) => motsDe.get(cible.slug).has(m)).length;
  const memeCategorie = source.category === cible.category;

  // UN MOT COMMUN EST OBLIGATOIRE, quelle que soit la catégorie.
  //
  // La première version acceptait « même catégorie » toute seule. Sur les
  // catégories larges, ça produisait des liens absurdes — l'essai à blanc a
  // sorti « Quelles certifications halal sont fiables en France ? » vers
  // « Peut-on poser une question religieuse à une intelligence artificielle ? »,
  // deux fiches « Pratique » qui n'ont rien à se dire.
  //
  // Un lien sans raison lisible dessert le lecteur, et Google traite un
  // maillage artificiel comme du bruit. Mieux vaut une fiche à 3 liens honnêtes
  // qu'à 4 dont un est faux.
  // Et le seuil dépend de la distance : dans la même catégorie, un mot commun
  // suffit à établir un rapport ; d'une catégorie à l'autre, il en faut deux.
  // Avec un seul, l'essai à blanc reliait « Peut-on prier avec du vernis à
  // ongles ? » à « Peut-on poser une question religieuse à une intelligence
  // artificielle ? » — un mot générique partagé par deux sujets étrangers.
  if (communs < (memeCategorie ? 1 : 3)) return 0;

  let note = communs * 3 + (memeCategorie ? 4 : 0);
  // Une page que Google visite deja vaut beaucoup plus comme source : c'est
  // par elle que l'exploration se propage vers la fiche qui attend.
  if (VISITEES.has(source.slug)) note += 10;
  return note;
}

const avant = entrants();
const ajouts = [];

// On traite les plus pauvres d'abord : ce sont elles que Google ignore.
const aRenforcer = QUESTIONS
  .map((q) => ({ q, n: avant.get(q.slug) }))
  .filter((x) => x.n < PLANCHER)
  .sort((a, b) => a.n - b.n);

const courant = new Map(avant);
for (const { q: cible } of aRenforcer) {
  while ((courant.get(cible.slug) ?? 0) < PLANCHER) {
    const candidats = QUESTIONS
      .map((source) => ({ source, note: affinite(source, cible) }))
      .filter((c) => c.note > 0)
      .sort((a, b) => b.note - a.note);
    if (!candidats.length) break; // aucune source honnête : on n'invente pas de lien
    const { source } = candidats[0];
    source.related.push(cible.slug);
    courant.set(cible.slug, (courant.get(cible.slug) ?? 0) + 1);
    ajouts.push({ de: source.slug, vers: cible.slug, visitee: VISITEES.has(source.slug) });
  }
}

console.log(`\nDENSIFICATION DU MAILLAGE\n`);
console.log(`  ${ajouts.length} liens ajoutes`);
console.log(`  dont ${ajouts.filter((a) => a.visitee).length} depuis une page que Google visite deja\n`);

const apres = entrants();
const compte = (m, seuil) => [...m.values()].filter((n) => n <= seuil).length;
console.log(`  fiches a 1 lien entrant  : ${compte(avant, 1)} -> ${compte(apres, 1)}`);
console.log(`  fiches a 2 ou moins      : ${compte(avant, 2)} -> ${compte(apres, 2)}`);
console.log(`  fiches sous le plancher  : ${compte(avant, PLANCHER - 1)} -> ${compte(apres, PLANCHER - 1)}`);
console.log(`  total liens internes     : ${QUESTIONS.reduce((s, q) => s + q.related.length, 0)}`);

if (process.argv.includes('--paires')) {
  console.log('  === ECHANTILLON DE PAIRES, POUR JUGER DU SENS ===\n');
  const pas = Math.max(1, Math.floor(ajouts.length / 18));
  for (let i = 0; i < ajouts.length; i += pas) {
    const a = ajouts[i];
    const de = parSlug.get(a.de), vers = parSlug.get(a.vers);
    console.log(`  ${a.visitee ? '★' : ' '} ${de.question}`);
    console.log(`      -> ${vers.question}`);
    console.log(`      (${de.category} -> ${vers.category})\n`);
  }
}

if (process.argv.includes('--ecrire')) {
  // On réécrit uniquement les tableaux `related`, ligne par ligne : le reste du
  // fichier — 3 000 lignes de texte écrit à la main — ne doit pas être touché
  // par un outil.
  let src = readFileSync('lib/questions.ts', 'utf8');
  let remplaces = 0;
  for (const q of QUESTIONS) {
    const i = src.indexOf(`slug: '${q.slug}',`);
    if (i < 0) { console.log(`  ! slug introuvable : ${q.slug}`); continue; }
    const j = src.indexOf('related: [', i);
    const k = src.indexOf(']', j);
    if (j < 0 || k < 0) continue;
    const nouveau = 'related: [' + q.related.map((r) => `'${r}'`).join(', ');
    src = src.slice(0, j) + nouveau + src.slice(k);
    remplaces += 1;
  }
  writeFileSync('lib/questions.ts', src);
  console.log(`\n  ${remplaces} tableaux « related » reecrits dans lib/questions.ts`);
} else {
  console.log(`\n  (essai a blanc — relancer avec --ecrire pour appliquer)`);
}
console.log();
