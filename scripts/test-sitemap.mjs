// Le plan du site doit dire a Google QUAND chaque page a change.
//
// Mesure du 11 aout : le sitemap listait les 193 fiches sans aucune date de
// modification. Or c'est cette date que Google regarde pour decider quand il
// repasse. Ce jour-la, 18 fiches avaient ete enrichies ou creees — et aucune
// ne pouvait le faire savoir.
//
// Le piege, et c'est pour ca que ce test existe : `lib/dates-fiches.json` est
// un fichier FIGE, regenere a la main par `scripts/dates-fiches.mjs`. Si on
// enrichit une fiche sans le relancer, le sitemap annoncera une date ancienne
// pour une page qui vient de changer. C'est pire que pas de date du tout : on
// dit a Google « rien de neuf ici » alors qu'il y a du neuf.
//
//   BASE=http://127.0.0.1:3330 node scripts/test-sitemap.mjs
//
// On lit le sitemap.xml REELLEMENT SERVI, pas la fonction qui le fabrique :
// c'est le seul niveau qui verifie ce que Google recevra, y compris la facon
// dont Next ecrit les dates.

import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const BASE = process.env.BASE ?? 'http://127.0.0.1:3330';

let echecs = 0;
const dire = (ok, quoi, detail = '') => {
  console.log(`${ok ? '✓' : '✗'} ${quoi}${detail ? ` — ${detail}` : ''}`);
  if (!ok) echecs += 1;
};

const dates = JSON.parse(readFileSync(new URL('../lib/dates-fiches.json', import.meta.url), 'utf8'));
const fiches = Object.keys(dates);

// ── 0. AUCUNE DATE INVENTEE — hors reseau, exact, sans faux positif ─────
//
// POURQUOI CETTE SECTION (21 novembre).
//
// L'en-tete de `dates-fiches.mjs` porte la regle depuis le premier jour :
// « ces dates ne sont jamais inventees ; une date de mise a jour fausse est une
// promesse fausse, faite au lecteur autant qu'a Google ». **Rien ne
// l'appliquait.** Le 20 novembre, la methode la violait sans bruit — le bloc
// suivi par `git log -L` incluait deux lignes identiques dans les 258 entrees,
// d'ou six fausses dates de mise a jour annoncees a Google.
//
// Ce controle n'attrape PAS cette erreur-la : savoir si une date est la BONNE
// demande de refaire le calcul. Il attrape l'autre moitie, et exactement :
// toute date du fichier doit etre l'horodatage d'un commit ayant touche
// `lib/questions.ts`. Une date qui n'en vient pas a ete ecrite a la main,
// corrompue, ou fabriquee. Zero faux positif possible.
//
// ET CE QU'ON A ESSAYE AVANT, pour ne pas le refaire. Un controle croise par
// `git log -S` sur des fragments du texte de chaque fiche : il a signale 35
// fiches sur 40. La raison est ecrite dans l'en-tete du script qu'il pretendait
// valider — `-S` ne voit que les changements de NOMBRE d'occurrences, il
// « manque completement » les enrichissements, c'est-a-dire precisement ce que
// la date de modification mesure. **Un validateur bati sur la technique que la
// documentation declare aveugle a la chose mesuree ne valide rien.**
const commitsConnus = new Set(
  execFileSync('git', ['log', '--format=%cI', '--', 'lib/questions.ts'], { encoding: 'utf8' })
    .trim().split('\n').filter(Boolean),
);
const orphelines = [];
for (const [slug, d] of Object.entries(dates)) {
  for (const champ of ['publie', 'modifie']) {
    if (!commitsConnus.has(d[champ])) orphelines.push(`${slug}.${champ} = ${d[champ]}`);
  }
}
dire(
  orphelines.length === 0,
  `les ${fiches.length * 2} dates viennent toutes d'un commit reel (${commitsConnus.size} commits)`,
  orphelines.slice(0, 5).join(', '),
);

// ── Le reseau. Son absence dit « mesure impossible », pas « site casse ». ──
let xml;
try {
  xml = await (await fetch(`${BASE}/sitemap.xml`)).text();
} catch (e) {
  console.error(`\n⚠ MESURE IMPOSSIBLE — ${BASE} ne repond pas.`);
  console.error(`  ${e.message}`);
  console.error('  Lancer : npm run build && npx next start -p 3330');
  console.error('  La section 0 a ete mesuree ; les suivantes non.\n');
  // Et si la section 0 a DEJA trouve un defaut, c'est 1 et pas 2 : « mesure
  // impossible » ne doit jamais effacer un defaut deja mesure. Trouve par
  // l'essai d'acceptation du 21 novembre — une date fabriquee etait bien
  // signalee, et le code de sortie restait 2 parce que le serveur manquait.
  process.exit(echecs === 0 ? 2 : 1);
}

// Un <url> par entree : on lit l'adresse et la date cote a cote.
const entrees = new Map();
for (const bloc of xml.split('<url>').slice(1)) {
  const loc = /<loc>([^<]+)<\/loc>/.exec(bloc)?.[1];
  const mod = /<lastmod>([^<]+)<\/lastmod>/.exec(bloc)?.[1];
  if (loc) entrees.set(loc.replace(/\/$/, ''), mod);
}

// ── 1. Toutes les fiches sont dedans ─────────────────────────────────────
const manquantes = fiches.filter((s) => !entrees.has(`https://halalgpt.fr/q/${s}`));
dire(manquantes.length === 0, `les ${fiches.length} fiches sont dans le plan du site`,
  manquantes.slice(0, 5).join(', '));

// ── 2. Chacune porte une date ────────────────────────────────────────────
const sansDate = fiches.filter((s) => !entrees.get(`https://halalgpt.fr/q/${s}`));
dire(sansDate.length === 0, 'chaque fiche annonce sa date de derniere modification',
  sansDate.slice(0, 5).join(', '));

// ── 3. Et cette date est bien la vraie ───────────────────────────────────
// On ne verifie pas « une date existe » mais « c'est CELLE-LA ». Une date
// plausible mais fausse passerait inapercue autrement.
const fausses = fiches.filter((s) => {
  const annoncee = entrees.get(`https://halalgpt.fr/q/${s}`);
  if (!annoncee) return true;
  return new Date(annoncee).getTime() !== new Date(dates[s].modifie).getTime();
});
dire(fausses.length === 0, 'la date annoncee est celle de l’historique git, pas une approximation',
  fausses.slice(0, 5).join(', '));

// ── 4. Les pages qui ne sont pas des fiches ──────────────────────────────
for (const [chemin, quoi] of [['', 'l’accueil'], ['/questions', 'la liste des questions'],
                              ['/conduite', 'le mode conduite']]) {
  dire(entrees.has(`https://halalgpt.fr${chemin}`), `${quoi} est dans le plan du site`);
}

// ── 5. Rien qui ne doive pas y etre ──────────────────────────────────────
// /labo-son et /apprendre sont interdits aux robots dans robots.ts. Les
// proposer au sitemap serait se contredire soi-meme, et Google le remarque.
const interdits = [...entrees.keys()].filter((u) => /\/labo-son|\/apprendre|\/api\//.test(u));
dire(interdits.length === 0, 'aucune page interdite aux robots n’est proposee au sitemap',
  interdits.join(', '));

// ── 6. L'etat des lieux ──────────────────────────────────────────────────
const recentes = fiches.filter(
  (s) => Date.now() - new Date(dates[s].modifie).getTime() < 7 * 24 * 3600 * 1000,
).length;
console.log(
  `\n   ${entrees.size} adresses dans le plan du site.` +
  `\n   ${recentes} fiches modifiees dans les 7 derniers jours — ce sont celles` +
  `\n   pour lesquelles Google a une raison de repasser vite.`,
);

console.log(
  echecs === 0
    ? '\n✓ Google sait quelles pages ont bouge, et quand.'
    : `\n✗ ${echecs} echec(s)`,
);
process.exit(echecs === 0 ? 0 : 1);
