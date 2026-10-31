// La recherche interne de /questions trouve-t-elle ce qu'on lui demande ?
//
// Mesure du 12 aout 2026, avant reparation : sur 41 saisies qu'une vraie
// personne taperait, 17 ne ramenaient RIEN, et pour 13 d'entre elles le site
// avait la reponse — elle etait juste dans le corps de la fiche, que la
// recherche ne lisait pas.
//
// Ce test tient les deux bouts, et le second compte autant que le premier :
//
//   1. elle TROUVE     — les mots enfouis dans les reponses remontent
//   2. elle NE TROUVE PAS — un mot absent du site ne ramene toujours rien,
//                           et le classement met le sujet avant la mention
//
// Sans le point 2, une recherche qui renvoie tout le catalogue passerait le
// test 1 haut la main. C'est exactement le genre d'instrument qui rassure.
//
//   node scripts/test-recherche.mjs

import { QUESTIONS } from '../lib/questions.ts';
import { chercher, construireIndex, corpsDeFiche } from '../lib/recherche.ts';

let echecs = 0;
const dire = (ok, quoi, detail = '') => {
  console.log(`${ok ? '✓' : '✗'} ${quoi}${detail ? ` — ${detail}` : ''}`);
  if (!ok) echecs += 1;
};

const corps = {};
for (const q of QUESTIONS) corps[q.slug] = corpsDeFiche(q);

const fiches = QUESTIONS.map((q) => ({
  slug: q.slug,
  question: q.question,
  verdict: q.verdict,
  category: q.category,
}));

// Deux index : avec le corps (ce que voit un visiteur qui a le reseau) et sans
// (les premieres millisecondes, ou un telechargement qui a echoue).
const INDEX = construireIndex(fiches, corps);
const INDEX_TITRES = construireIndex(fiches);

const slugs = (saisie, index = INDEX) => (chercher(index, saisie) ?? []).map((r) => r.fiche.slug);

// ── 1. Ce qui marchait doit continuer de marcher, et EN TETE ─────────────
console.log('\n── Ce qui marchait avant marche toujours ─────────────────────');
for (const [saisie, attendu] of [
  ['e120', 'e120-halal'],
  ['haribo', 'haribo-halal'],
  ['mcdo', 'mcdo-halal'],
  ['tatouage', 'tatouage-halal'],
  ['gelatine', 'gelatine-halal'],
  ['musique', 'musique-halal'],
]) {
  const r = slugs(saisie);
  dire(r[0] === attendu, `« ${saisie} » donne ${attendu} en premier`, r[0] ?? 'rien');
}

// ── 2. Les mots enfouis dans les reponses remontent enfin ────────────────
console.log('\n── Les mots qui ne sont que dans la reponse ──────────────────');
for (const [saisie, doitContenir] of [
  ['cochenille', 'e120-halal'],
  ['insecte', 'e120-halal'],
  ['emulsifiant', 'e471-halal'],
  ['betterave', 'e120-halal'],
  ['anesthesie', 'piqure-ramadan'],
  ['dentiste', 'brosser-dents-ramadan'],
  ['piscine', 'se-doucher-ramadan'],
]) {
  const r = slugs(saisie);
  dire(
    r.includes(doitContenir),
    `« ${saisie} » ramene ${doitContenir}`,
    r.length ? `${r.length} fiche(s) : ${r.slice(0, 3).join(', ')}` : 'RIEN',
  );
}

// Et ces saisies-la ne ramenaient rien avant : on verifie que c'est bien le
// corps qui les sauve, pas un hasard de titre.
console.log('\n── C\'est bien le corps qui les sauve ─────────────────────────');
for (const saisie of ['cochenille', 'hotel', 'anesthesie']) {
  const avant = slugs(saisie, INDEX_TITRES).length;
  const apres = slugs(saisie).length;
  dire(avant === 0 && apres > 0, `« ${saisie} » : ${avant} sans le corps → ${apres} avec`);
}

// « barbe » a quitte la liste ci-dessus le 31 octobre 2026, pour la meme raison
// qu'« emulsifiant » avant lui : `barbe-islam` porte desormais le mot dans son
// TITRE. Le test exigeait zero resultat sans le corps ; il echouait donc sur une
// fiche juste. C'est la deuxieme fois que cette liste se perime en encodant
// « ce mot n'est nulle part dans un titre » — une affirmation qui vieillit des
// qu'on ecrit la fiche que le mot appelait.
//
// On garde donc ce qui comptait : avec le corps, on trouve la FAMILLE, pas une
// fiche par accident de vocabulaire.
{
  const avant = slugs('barbe', INDEX_TITRES).length;
  const apres = slugs('barbe').length;
  dire(apres > avant, `« barbe » : ${avant} sans le corps → ${apres} avec`);
}

// « emulsifiant » etait dans la liste ci-dessus jusqu'au jour ou le verdict de
// magnum-halal a pris le mot — « tout se joue sur les emulsifiants ». Le titre
// en ramene donc une desormais, et exiger zero reviendrait a interdire d'ecrire
// ce mot dans un verdict. Ce qu'on garde a la place est ce qui comptait
// vraiment : sans le corps on tombe sur une fiche par accident de vocabulaire,
// avec lui on trouve la famille entiere. Un ordre de grandeur separe les deux.
{
  const avant = slugs('emulsifiant', INDEX_TITRES).length;
  const apres = slugs('emulsifiant').length;
  dire(apres >= avant * 5, `« emulsifiant » : ${avant} sans le corps → ${apres} avec`);
}

// ── 3. Le sujet passe devant la simple mention ───────────────────────────
console.log('\n── Le sujet avant la mention ─────────────────────────────────');
for (const [saisie, premier, apres] of [
  // E120 EST la fiche de la cochenille ; Fanta ne fait que la mentionner.
  ['cochenille', 'e120-halal', 'fanta-halal'],
  // Le carmin est dans le titre de deux fiches, ailleurs c'est une mention.
  ['carmin', 'e120-halal', 'maquillage-ramadan'],
  // « emulsifiant » : E471 EST l'emulsifiant.
  ['emulsifiant', 'e471-halal', 'kitkat-halal'],
]) {
  const r = slugs(saisie);
  const iA = r.indexOf(premier);
  const iB = r.indexOf(apres);
  dire(
    iA !== -1 && (iB === -1 || iA < iB),
    `« ${saisie} » : ${premier} avant ${apres}`,
    `positions ${iA} et ${iB}`,
  );
}

// Une fiche dont le TITRE porte le mot passe avant toutes celles qui ne
// l'ont que dans le corps. C'est ce rapport qui rend une recherche large
// lisible plutot que bruyante.
for (const saisie of ['ramadan', 'alcool', 'gelatine', 'priere']) {
  const r = chercher(INDEX, saisie) ?? [];
  const dernierTitre = r.reduce((n, x, i) => (x.score >= 12 ? i : n), -1);
  const premierCorps = r.findIndex((x) => x.score < 4);
  dire(
    dernierTitre === -1 || premierCorps === -1 || dernierTitre < premierCorps,
    `« ${saisie} » : les ${dernierTitre + 1} fiches au titre exact sont en tete`,
    `${r.length} resultats`,
  );
}

// ── 4. Elle refuse toujours ce qui n'existe pas ──────────────────────────
console.log('\n── Elle ne trouve pas ce qui n\'existe pas ────────────────────');
for (const saisie of ['brouette', 'trottinette', 'zzzz', 'kangourou', 'accordeon']) {
  const r = slugs(saisie);
  dire(r.length === 0, `« ${saisie} » ne ramene rien`, r.slice(0, 3).join(', '));
}

// Tous les mots doivent etre presents : « priere assis » ne doit pas ramener
// toutes les fiches Priere.
const assis = slugs('priere assis');
const priere = slugs('priere');
dire(
  assis.length > 0 && assis.length < priere.length / 2,
  '« priere assis » reste plus etroit que « priere »',
  `${assis.length} contre ${priere.length}`,
);

// Un mot au milieu d'un autre ne compte pas dans le corps : sinon quatre
// lettres ramenent toutes les fiches qui prononcent le mot en passant.
//
// « elat » est au milieu de « gelatine ». Trente-cinq fiches ont ce mot dans
// leur corps ; seules celles qui l'ont dans leur TITRE doivent remonter — le
// titre, lui, cherche encore au milieu des mots, exactement comme avant.
const avecGelatine = QUESTIONS.filter((q) => {
  const [fort, reste] = corps[q.slug];
  return `${fort} ${reste}`.split(' ').includes('gelatine');
}).length;
const elat = chercher(INDEX, 'elat') ?? [];
dire(
  avecGelatine > 20 && elat.length > 0 && elat.every((r) => r.score >= 8),
  '« elat » ne trouve « gelatine » que par le titre',
  `${avecGelatine} fiches l'ont dans le corps, ${elat.length} remontent, toutes par le titre`,
);

// Une saisie vide n'est pas un resultat vide : la page doit montrer ses
// categories, pas « aucune fiche ne correspond ».
dire(chercher(INDEX, '') === null, 'une saisie vide ne declenche pas de recherche');
dire(chercher(INDEX, '   ') === null, 'des espaces seuls non plus');

// ── 5. Un mot de SUJET ne ramene pas tout le catalogue ───────────────────
//
// « halal » est volontairement absent de cette liste : c'est le sujet du site
// entier, il est dans presque chaque fiche, et il en ramene 148 sur 197 — mais
// il en ramenait deja autant avant, par les titres. Chercher « halal » ici
// revient a chercher « wiki » sur Wikipedia : ce n'est pas un filtre.
// Ce qu'on verifie, c'est qu'un mot de SUJET reste un filtre.
console.log('\n── Un mot de sujet reste un filtre ───────────────────────────');
const LARGES = ['ramadan', 'porc', 'alcool', 'priere', 'viande', 'produit', 'eau'];
let pire = { saisie: '', n: 0 };
for (const saisie of LARGES) {
  const n = slugs(saisie).length;
  if (n > pire.n) pire = { saisie, n };
}
dire(
  pire.n <= QUESTIONS.length * 0.5,
  'le mot de sujet le plus large reste sous la moitie du catalogue',
  `« ${pire.saisie} » : ${pire.n} sur ${QUESTIONS.length}`,
);

// ── 5 bis. Trop court pour etre une question ─────────────────────────────
//
// MESURE DU 20 OCTOBRE 2026, avant reparation :
//
//     « m »   -> 243 fiches sur 246, restaurant-halal-lyon en tete
//     « a »   -> 246 sur 246
//     « m&m » -> 243, la ponctuation en faisant deux termes « m »
//
// La cause etait une asymetrie : `motsDistinctifs` n'indexe pas les mots de
// moins de trois caracteres, la saisie les gardait. Un terme d'une lettre n'est
// jamais absent d'un titre, donc il etait toujours « present », donc il
// ramenait tout. Quelqu'un qui cherchait les M&M's recevait le catalogue
// entier PRESENTE COMME UNE REPONSE — et un resultat faux coute plus cher
// qu'une absence de resultat, parce qu'il ne se signale pas.
//
// Ce bloc est volontairement DERIVE DES DONNEES, pas ecrit a la main. Le
// 5 septembre, deux fixtures codant en dur « ce mot n'existe pas encore » sont
// devenues fausses parce que le contenu avait avance ; le 19 octobre j'ai
// renonce pour la meme raison a une liste de synonymes. Ici il n'y a rien a
// perimer : les saisies courtes sont fabriquees A PARTIR du catalogue, et la
// regle enoncee ne nomme aucun mot.
console.log('\n── Trop court pour etre une question ─────────────────────────');
{
  const courtes = new Set();
  for (const q of QUESTIONS) {
    for (const mot of `${corps[q.slug][0]} ${corps[q.slug][1]}`.split(' ')) {
      if (!mot) continue;
      courtes.add(mot.slice(0, 1));
      if (mot.length >= 2) courtes.add(mot.slice(0, 2));
    }
  }
  const fautives = [...courtes].filter((s) => chercher(INDEX, s) !== null);
  dire(
    fautives.length === 0,
    `les ${courtes.size} saisies de une ou deux lettres du catalogue ne declenchent pas de recherche`,
    fautives.length
      ? `${fautives.length} en declenchent encore : ${fautives.slice(0, 6).join(', ')}`
      : 'elles montrent les categories, ce qui n\'est pas un resultat vide',
  );
}

// LA REGLE QUE J'AI D'ABORD ECRITE ETAIT FAUSSE, et c'est elle qui vaut d'etre
// racontee. J'avais exige qu'aucun debut de mot de trois lettres ne ramene plus
// de la moitie du catalogue. Le garde a immediatement signale « con » : 220
// fiches sur 246. J'ai cru a un troisieme defaut de la meme famille.
//
// Verification avant correction : pour « con », les cinq fiches dont le TITRE
// porte le mot sortent en tete — se-convertir-islam, conge-aid-travail — et la
// longue traine suit. Et « hal » ramene 174 fiches dont 173 par le titre : c'est
// le sujet du site, pas un defaut.
//
// Autrement dit, le parti pris du moteur est de CLASSER, pas d'exclure, et il
// est ecrit noir sur blanc dans `recherche.ts` : « le titre pese six fois le
// corps, c'est ce rapport qui fait qu'une recherche large reste lisible ». Mon
// assertion contredisait la conception et aurait oblige a casser la recherche
// pendant la frappe — « coch » doit trouver « cochenille ».
//
// Ce qui est vrai et qui compte, c'est donc le CLASSEMENT, et c'est ce qu'on
// verifie ici. Le point 3 l'exige deja pour quatre mots choisis a la main ;
// cette version-ci le fait pour tous les debuts de mot du site.
{
  const prefixes = new Set();
  for (const q of QUESTIONS) {
    for (const mot of `${corps[q.slug][0]} ${corps[q.slug][1]}`.split(' ')) {
      if (mot.length >= 3) prefixes.add(mot.slice(0, 3));
    }
  }
  const desordres = [];
  for (const s of prefixes) {
    const r = chercher(INDEX, s) ?? [];
    const dernierTitre = r.reduce((n, x, i) => (x.score >= 8 ? i : n), -1);
    const premierCorps = r.findIndex((x) => x.score < 4);
    if (dernierTitre !== -1 && premierCorps !== -1 && dernierTitre > premierCorps) {
      desordres.push(`${s} (titre en ${dernierTitre}, corps en ${premierCorps})`);
    }
  }
  dire(
    desordres.length === 0,
    `pour les ${prefixes.size} debuts de mot du site, le titre passe avant le corps`,
    desordres.length ? desordres.slice(0, 5).join(' · ') : 'une recherche large reste lisible',
  );
}

// ── 5 ter. Une marque se trouve sans sa ponctuation ──────────────────────
//
// MESURE DU 20 OCTOBRE 2026 : « M&M’s » devenait « m m s » a l'indexation —
// trois jetons de moins de trois caracteres, donc trois jetons jetes. La marque
// n'etait indexee sous AUCUNE forme, et `mms-halal` etait introuvable par son
// nom. Meme famille : « cocacola » tape sans trait d'union.
//
// Un lecteur ne reproduit pas la ponctuation officielle d'une marque, et le
// format le plus porteur du site est « [marque] halal ou pas ».
//
// Derive des donnees, comme le bloc precedent : les orthographes testees sont
// extraites des titres eux-memes. Une marque ajoutee demain est couverte sans
// qu'on touche a ce fichier.
console.log('\n── Une marque se trouve sans sa ponctuation ──────────────────');
{
  const PONCT = /[a-zA-Z0-9][&.+\-/][a-zA-Z0-9]/;
  const ENCLITIQUES = new Set(
    ('il elle ils elles on ce t je tu nous vous moi toi lui leur le la les y en').split(' '),
  );
  const aTester = [];
  for (const q of QUESTIONS) {
    for (const morceau of q.question.split(/[^a-zA-Z0-9&.+\-/’']+/)) {
      const nu = morceau.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
      if (!PONCT.test(nu.replace(/[’']/g, ''))) continue;
      // Les inversions du francais — « est-il », « peut-on » — ne sont pas des
      // noms : elles sont exclues du recollage, donc elles n'ont rien a tester.
      if (nu.split('-').slice(1).some((s) => ENCLITIQUES.has(s.replace(/[^a-z0-9]/g, '')))) continue;
      const colle = nu.replace(/[^a-z0-9]/g, '');
      if (colle.length >= 3) aTester.push({ slug: q.slug, colle, morceau: morceau.trim() });
    }
  }
  const manquants = aTester.filter(({ slug, colle }) => !slugs(colle).includes(slug));
  dire(
    manquants.length === 0,
    `les ${aTester.length} nom(s) a ponctuation interne se trouvent recolles`,
    manquants.length
      ? manquants.map((m) => `« ${m.colle} » ne ramene pas ${m.slug}`).join(' · ')
      : aTester.map((m) => `${m.morceau}→${m.colle}`).join(', '),
  );

  // LA CONTREPARTIE, et pourquoi elle se mesure dans l'INDEX et non dans les
  // resultats. Premiere version de ce bloc : « quil » ne doit rien ramener. Il
  // ramenait `maquillage-ramadan` — parce que « quil » est a l'interieur de
  // « maquillage », et que la recherche au milieu des mots du titre est voulue
  // et documentee. Mon attente etait fausse, pas le moteur.
  //
  // Ce qu'on veut vraiment dire est plus precis : une contraction a apostrophe
  // ne doit pas FABRIQUER de jeton. On regarde donc l'index lui-meme.
  const jetons = new Set();
  for (const q of QUESTIONS) for (const z of corps[q.slug]) for (const m of z.split(' ')) if (m) jetons.add(m);
  const fabriques = ['lalcool', 'dun', 'quil', 'nest', 'sil'].filter((m) => jetons.has(m));
  dire(
    fabriques.length === 0,
    'aucune contraction a apostrophe ne fabrique de jeton dans l\'index',
    fabriques.length ? fabriques.join(', ') : `${jetons.size} jetons distincts`,
  );
}

// ── 6. Le poids de l'index, qui voyage sur le reseau ─────────────────────
console.log('\n── Le poids de ce qu\'on telecharge ───────────────────────────');
const octets = JSON.stringify({ fiches: QUESTIONS.length, corps }).length;
dire(
  octets <= 220 * 1024,
  'l\'index de recherche tient sous 220 ko',
  `${(octets / 1024).toFixed(0)} ko brut pour ${QUESTIONS.length} fiches ` +
    `(${Math.round(octets / QUESTIONS.length)} octets par fiche)`,
);

// Chaque fiche a bien deux zones, et la premiere n'est jamais vide : sans
// `short` indexe, le classement du point 3 ne tiendrait plus.
const sansFort = QUESTIONS.filter((q) => !corps[q.slug][0]);
dire(sansFort.length === 0, 'chaque fiche a des mots dans sa reponse directe',
  sansFort.map((q) => q.slug).join(', '));

// Aucun mot n'est ecrit deux fois : c'est ce qui rend la separation gratuite.
const doublons = QUESTIONS.filter((q) => {
  const [fort, reste] = corps[q.slug];
  const a = new Set(fort.split(' ').filter(Boolean));
  return reste.split(' ').filter(Boolean).some((m) => a.has(m));
});
dire(doublons.length === 0, 'aucun mot n\'est stocke deux fois',
  doublons.slice(0, 3).map((q) => q.slug).join(', '));

// ── 7. Sans reseau, elle vaut exactement ce qu'elle valait avant ─────────
console.log('\n── Si le corps n\'arrive jamais, rien n\'est casse ─────────────');
for (const [saisie, attendu] of [
  ['e120', 'e120-halal'],
  ['gelatine', 'gelatine-halal'],
  ['ramadan', null],
]) {
  const r = slugs(saisie, INDEX_TITRES);
  dire(
    r.length > 0 && (!attendu || r[0] === attendu),
    `sans le corps, « ${saisie} » marche encore`,
    `${r.length} resultat(s)`,
  );
}

console.log(
  echecs === 0
    ? '\n✓ La recherche trouve ce que le site sait, et rien de plus.'
    : `\n✗ ${echecs} echec(s)`,
);
process.exit(echecs === 0 ? 0 : 1);
