// Ce que Google affiche des pages qui ne sont PAS des fiches.
//
//     node scripts/test-affichage.mjs              (serveur attendu sur :3340)
//     BASE=http://127.0.0.1:3100 node scripts/test-affichage.mjs
//
// POURQUOI CE FICHIER EXISTE
//
// Mesure du 3 novembre au soir. Deux gardes verifient depuis des mois que les
// 253 fiches tiennent dans ce que Google affiche — `test-titres` pour les
// titres, `test-descriptions` pour les descriptions. **Aucun ne regardait les
// douze autres pages indexables**, dont l'accueil.
//
// Resultat : la description de l'ACCUEIL faisait 179 caracteres. Google coupe a
// 160. Elle s'affichait donc « …Ramadan, priere, voyag » — tranchee en plein
// mot, sur la seule page vers laquelle pointent des liens exterieurs. Le defaut
// vivait la depuis des mois parce que le perimetre du garde s'arretait aux
// fiches, et que personne ne verifie le perimetre d'un garde qui passe au vert.
//
// POURQUOI SUR LA PAGE SERVIE, et c'est la lecon du meme soir.
//
// J'ai d'abord mesure depuis `lib/questions.ts`, en lisant `CATEGORY_TITLES`.
// Faux : le gabarit de hub a un DEFAUT, `${categorie} : {n} questions halal`,
// applique quand la categorie n'a pas de titre sur mesure. Ma sonde annoncait
// « Additifs — HalalGPT » (19 caracteres) la ou le site sert « Additifs : 41
// questions halal — HalalGPT » (40). J'allais « corriger » sept titres qui
// n'avaient rien. Une sonde qui SUPPOSE le gabarit se trompe
// (cf. `distance-exploration.mjs`) : ici on lit ce que le serveur rend.
//
// ET ON COMPTE EN POINTS DE CODE, ENTITES DECODEES. Deuxieme piege du meme
// soir : `${#var}` en bash compte des OCTETS. L'accueil sort ses apostrophes en
// `&#x27;` — six caracteres pour un seul — et `’` pese trois octets. Mon compte
// annoncait 198 au lieu de 179, et surtout il accusait a tort
// `/categorie/pratique` (161 au lieu de 149). Un compteur qui se trompe d'unite
// fabrique des defauts.
//
// LES FICHES SONT HORS PERIMETRE, volontairement : elles ont deja leurs deux
// gardes, et les melanger ici noierait les douze pages qui n'en avaient aucun.
//
// Serveur absent = code 2, mesure impossible. Jamais code 1 (cf. test-dns.mjs,
// `navigateur.mjs`) : un serveur qu'on n'a pas lance n'est pas un site casse.

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { CATEGORIES, CATEGORY_SLUGS } from '../lib/questions.ts';

const BASE = process.env.BASE ?? 'http://127.0.0.1:3340';

// Ce que Google affiche. Memes bornes que pour les fiches, par construction :
// c'est le meme bandeau de resultats.
const TITRE_MAX = 60;
const DESCRIPTION_MAX = 160;

let echecs = 0;
const dire = (ok, quoi, detail = '') => {
  console.log(`${ok ? '✓' : '✗'} ${quoi}${detail ? ` — ${detail}` : ''}`);
  if (!ok) echecs += 1;
};

// ── Les routes, lues dans app/ et non recopiees ─────────────────────────
//
// Une liste ecrite a la main se perime le jour ou une page est ajoutee, et en
// silence (cf. `pages-visitees.mjs`). On lit donc le dossier, on garde les
// pages indexables, et on ecarte les deux routes dynamiques qui ont leurs
// propres gardes.
const fichiers = [];
const parcourir = (dossier) => {
  for (const entree of readdirSync(dossier)) {
    const chemin = join(dossier, entree);
    if (statSync(chemin).isDirectory()) parcourir(chemin);
    else if (entree === 'page.tsx') fichiers.push(chemin);
  }
};
parcourir('app');

const DEJA_GARDEES = ['app/q/[slug]/page.tsx'];

const aVerifier = [];
for (const chemin of fichiers) {
  const source = readFileSync(chemin, 'utf8');
  if (/robots:\s*\{[^}]*index:\s*false/s.test(source)) continue;   // noindex assume
  if (DEJA_GARDEES.includes(chemin)) continue;                     // test-titres + test-descriptions

  const url = chemin.replace(/^app/, '').replace(/\/page\.tsx$/, '') || '/';
  if (url.includes('[')) {
    // Une route dynamique qu'on garde ici : on l'etend par ses vraies valeurs.
    if (url === '/categorie/[slug]') {
      for (const c of CATEGORIES) aVerifier.push(`/categorie/${CATEGORY_SLUGS[c]}`);
      continue;
    }
    // Toute AUTRE route dynamique indexable est un trou : on le dit au lieu de
    // l'ignorer, sinon ce garde se perime comme celui qu'il remplace.
    dire(false, `route dynamique indexable non couverte : ${chemin}`,
      'l\'etendre ici ou la declarer dans DEJA_GARDEES');
    continue;
  }
  aVerifier.push(url);
}

// ── La mesure ───────────────────────────────────────────────────────────
const decode = (s) => s
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
  .replace(/&quot;/g, '"').replace(/&apos;/g, '\'')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&nbsp;/g, ' ')
  .replace(/&amp;/g, '&');                 // en dernier : sinon on re-decode

const longueur = (s) => [...s].length;     // points de code, pas octets

async function page(url) {
  const r = await fetch(`${BASE}${url}`);
  if (!r.ok) return { erreur: `HTTP ${r.status}` };
  const html = await r.text();
  return {
    titre: decode((html.match(/<title>([^<]*)/) ?? [, ''])[1]),
    description: decode(
      (html.match(/<meta name="description" content="([^"]*)/) ?? [, ''])[1],
    ),
  };
}

console.log(`CE QUE GOOGLE AFFICHE — ${aVerifier.length} page(s) hors fiches`);
console.log(`titre ≤ ${TITRE_MAX}   description ≤ ${DESCRIPTION_MAX}   (points de code)\n`);

try {
  await fetch(BASE);
} catch (e) {
  console.error(`\n⚠ MESURE IMPOSSIBLE — ${BASE} ne repond pas.`);
  console.error(`  ${e.message}`);
  console.error('  Lancer : npm run build && npx next start -p 3340');
  console.error('  Rien n\'a ete mesure : ce n\'est PAS un defaut du site.\n');
  process.exit(2);
}

for (const url of aVerifier) {
  const p = await page(url);
  if (p.erreur) {
    dire(false, `${url} repond`, p.erreur);
    continue;
  }

  const lt = longueur(p.titre);
  const ld = longueur(p.description);

  dire(lt > 0 && lt <= TITRE_MAX, `${url} — titre (${lt})`,
    lt === 0 ? 'aucun titre' : lt > TITRE_MAX ? `« ${p.titre} »` : '');

  // Une description vide n'est pas une faute ici — certaines pages n'en ont pas
  // besoin — mais une description TRONQUEE en est une : Google l'affiche coupee.
  if (ld === 0) {
    dire(false, `${url} — description absente`, 'Google compose alors ce qu\'il veut');
    continue;
  }
  dire(ld <= DESCRIPTION_MAX, `${url} — description (${ld})`,
    ld > DESCRIPTION_MAX
      ? `perdu apres 160 : « ${[...p.description].slice(DESCRIPTION_MAX).join('')} »`
      : '');
}

console.log(
  echecs === 0
    ? `\n✓ Les ${aVerifier.length} pages hors fiches tiennent dans ce que Google affiche.`
    : `\n✗ ${echecs} defaut(s).`,
);
process.exit(echecs === 0 ? 0 : 1);
