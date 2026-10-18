// A combien de sauts chaque fiche est-elle des portes que Google visite deja ?
// Et la question qui compte davantage : CE SCRIPT connait-il le vrai graphe ?
//
//     node scripts/distance-exploration.mjs
//
// POURQUOI CE FICHIER EXISTE
//
// Le diagnostic qui gouverne tout (Search Console, 14 aout) : sur 199 pages
// connues, 135 sont « detectee, actuellement non indexee » — Google n'est
// JAMAIS venu les lire. Six refus seulement apres lecture. Ce n'est donc pas
// un probleme de qualite, c'est un budget d'exploration. Ce qui compte alors
// n'est pas combien de liens entrants a une fiche, mais a quelle DISTANCE elle
// est des onze pages ou le robot passe reellement.
//
// TROIS FOIS la meme erreur, et c'est elle qui justifie ce fichier.
//
//   16 septembre — mesure improvisee : certaines fiches a 6 sauts. J'allais
//                  ajouter des liens artificiels.
//    8 octobre   — meme mesure improvisee, meme panique, meme conclusion.
//   18 octobre   — « 7 fiches a 7 sauts, 6 a 6 sauts ». Troisieme fois.
//
// Les trois fois, le chiffre etait FAUX, et toujours pour la meme raison : une
// requete ecrite a la hate ne suit que le champ `related`, alors que chaque
// page de fiche porte un fil d'Ariane vers son hub de categorie, et que chaque
// hub liste TOUTES ses fiches et pointe vers TOUS les autres hubs. Le vrai
// graphe est beaucoup plus court que celui des `related`.
//
// La lecon etait deja ecrite — en commentaire, dans l'en-tete de
// `que-ecrire.mjs`, avec les deux premieres dates. Je l'ai lue le 18 octobre,
// puis j'ai ecrit la mauvaise requete quand meme. **Un commentaire n'est pas un
// garde-fou.** Ce qui manquait n'etait pas l'avertissement de ne pas se tromper,
// c'etait un outil juste a portee de main. Le voici.
//
// CE SCRIPT VERIFIE SON PROPRE MODELE AVANT DE MESURER. Un outil de graphe qui
// suppose la structure des pages se perime le jour ou un gabarit change, et il
// se perime en silence — exactement comme une liste de slugs recopiee
// (cf. `pages-visitees.mjs`). Donc : on lit les gabarits, on exige d'y
// retrouver chaque arete qu'on s'autorise a tracer, et on echoue bruyamment
// sinon.

import { readFileSync } from 'node:fs';
import { QUESTIONS, CATEGORY_SLUGS } from '../lib/questions.ts';
import { VISITEES } from './pages-visitees.mjs';

const FICHE = 'app/q/[slug]/page.tsx';
const HUB = 'app/categorie/[slug]/page.tsx';

const lire = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');

// ── 1. Le modele, confronte aux gabarits ────────────────────────────────
//
// Chaque exigence porte l'arete qu'elle autorise. Si l'une tombe, le graphe
// calcule plus bas ne decrit plus le site, et un chiffre qui ne decrit plus le
// site est pire que pas de chiffre.
const EXIGENCES = [
  {
    fichier: FICHE,
    cherche: '/categorie/${CATEGORY_SLUGS[qa.category]}',
    arete: 'fiche → son hub de categorie (fil d\'Ariane)',
  },
  {
    fichier: HUB,
    cherche: 'QUESTIONS.filter((q) => q.category === category)',
    arete: 'hub → les fiches de sa categorie',
  },
  {
    fichier: HUB,
    cherche: 'items.map((q) => (',
    arete: 'hub → les fiches de sa categorie (rendu de la liste)',
  },
  {
    fichier: HUB,
    cherche: 'CATEGORIES.filter((c) => c !== category)',
    arete: 'hub → tous les autres hubs',
  },
];

let echecs = 0;
console.log('MODELE DU GRAPHE — confronte aux gabarits\n');

for (const { fichier, cherche, arete } of EXIGENCES) {
  const ok = lire(fichier).includes(cherche);
  console.log(`${ok ? '✓' : '✗'} ${arete}`);
  if (!ok) {
    console.error(`    introuvable dans ${fichier} : ${cherche}`);
    echecs += 1;
  }
}

// Le hub ne doit pas tronquer sa liste : une pagination ou un `.slice()`
// eloignerait sans bruit les fiches de la fin de liste, et c'est precisement le
// genre de changement qu'on ne remarque pas.
const hub = lire(HUB);
const tronque = /items[\s\S]{0,80}\.slice\(/.test(hub) || /\.slice\(0,\s*\d+\)[\s\S]{0,40}items/.test(hub);
console.log(`${tronque ? '✗' : '✓'} le hub ne tronque pas sa liste de fiches`);
if (tronque) {
  console.error('    un .slice() apparait autour de `items` : les fiches de fin');
  console.error('    de liste ne sont peut-etre plus liees depuis le hub.');
  echecs += 1;
}

if (echecs > 0) {
  console.error(
    `\n✗ MODELE PERIME — ${echecs} arete(s) introuvable(s) dans les gabarits.` +
    '\n  Ce script ne mesure rien tant que son modele ne correspond pas au site.' +
    '\n  Corriger le modele ci-dessus, pas le chiffre.\n',
  );
  process.exit(1);
}

// ── 2. Le graphe, tel que le robot peut le suivre ───────────────────────
//
// Volontairement absent : « la decouverte du jour » (`lib/surprises.ts`), qui
// ajoute depuis chaque fiche une arete vers une fiche qui CHANGE chaque jour.
// Elle raccourcit les distances reelles, mais on ne batit pas une garantie
// d'accessibilite sur un lien qui ne sera pas le meme demain. On mesure donc le
// pire cas stable.
const voisins = new Map();
const ajouter = (de, vers) => {
  if (!voisins.has(de)) voisins.set(de, new Set());
  voisins.get(de).add(vers);
};

const hubDe = (categorie) => `hub:${CATEGORY_SLUGS[categorie]}`;
const existe = new Set(QUESTIONS.map((q) => q.slug));

for (const q of QUESTIONS) {
  for (const r of q.related) if (existe.has(r)) ajouter(q.slug, r);
  ajouter(q.slug, hubDe(q.category));            // fil d'Ariane
  ajouter(hubDe(q.category), q.slug);            // le hub liste ses fiches
}

const hubs = [...new Set(QUESTIONS.map((q) => hubDe(q.category)))];
for (const a of hubs) for (const b of hubs) if (a !== b) ajouter(a, b);

// ── 3. La mesure : largeur d'abord depuis les onze portes ───────────────
const distance = new Map();
let front = [...VISITEES].filter((s) => existe.has(s));
front.forEach((s) => distance.set(s, 0));

for (let d = 1; front.length > 0; d += 1) {
  const suivant = [];
  for (const s of front) {
    for (const v of voisins.get(s) ?? []) {
      if (!distance.has(v)) {
        distance.set(v, d);
        suivant.push(v);
      }
    }
  }
  front = suivant;
}

const parSaut = new Map();
const injoignables = [];
for (const q of QUESTIONS) {
  if (!distance.has(q.slug)) injoignables.push(q.slug);
  else parSaut.set(distance.get(q.slug), (parSaut.get(distance.get(q.slug)) ?? 0) + 1);
}

console.log(`\nDISTANCE DEPUIS LES ${front.length === 0 ? VISITEES.size : VISITEES.size} PORTES QUE GOOGLE VISITE\n`);
for (const d of [...parSaut.keys()].sort((a, b) => a - b)) {
  console.log(`  ${String(d)} saut(s) : ${String(parSaut.get(d)).padStart(3)} fiche(s)`);
}

// Le plafond est une consequence du modele, pas un vœu : une fiche atteint son
// hub en 1 saut, un hub atteint tout autre hub en 1, un hub atteint ses fiches
// en 1. Donc 3 suffit toujours, et toute valeur au-dela signale que le modele
// ou les donnees ont change.
const PLAFOND = 3;
const pire = Math.max(...parSaut.keys());

if (injoignables.length > 0) {
  console.log(`\n✗ ${injoignables.length} fiche(s) injoignable(s) : ${injoignables.slice(0, 8).join(', ')}`);
  echecs += 1;
} else if (pire > PLAFOND) {
  console.log(`\n✗ Une fiche est a ${pire} sauts, au-dela du plafond de ${PLAFOND}.`);
  console.log('  Le modele dit que 3 suffit toujours (fiche → hub → hub → fiche).');
  console.log('  Si ce chiffre est depasse, c\'est le modele qu\'il faut relire,');
  console.log('  pas des liens qu\'il faut ajouter.');
  echecs += 1;
} else {
  console.log(`\n✓ Toutes les fiches sont a ${pire} saut(s) ou moins des portes.`);
  console.log('  Le maillage n\'est donc PAS le frein a l\'exploration. Une mesure');
  console.log('  qui ne suit que `related` dira le contraire — elle aura tort.');
}

process.exit(echecs === 0 ? 0 : 1);
