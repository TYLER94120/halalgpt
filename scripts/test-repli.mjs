// Cas de test du mode degrade — a lancer AVANT et APRES toute modification
// du calcul de correspondance :  node scripts/test-repli.mjs
//
// Pourquoi ce fichier existe. Le 10 aout, un defaut a ete note « voyage halal
// paris repond Istanbul ». La mesure a montre autre chose : l'etage 1
// (correspondance forte, seuil 3) ne matchait pas du tout, et la reponse venait
// de `localFallback`, qui se contentait d'UN SEUL mot commun. Ce repli ne sert
// qu'en l'absence de cle API — donc jamais en production normale — mais il sert
// aussi quand l'API tombe. Ce jour-la, quelqu'un qui demande Paris recoit
// Istanbul, sans savoir que c'est un pis-aller.
//
// La regle qu'on veut : un repli a le droit d'etre approximatif, il n'a pas le
// droit d'etre confiant.

import { readFileSync } from 'node:fs';

const src = readFileSync(new URL('../lib/questions.ts', import.meta.url), 'utf8');

// La MEME liste que le site, pas une copie. Voir lib/mots-vides.js.
import { MOTS_VIDES as GENERIC } from '../lib/mots-vides.js';
const norm = (t) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const motsUtiles = (q) => norm(q).split(/[^a-z0-9]+/).filter((w) => w.length > 3 && !GENERIC.has(w));

const fiches = [];
const re = /slug:\s*'([^']+)',\s*\n\s*question:\s*'((?:[^'\\]|\\.)*)',\s*\n\s*verdict:\s*'((?:[^'\\]|\\.)*)',\s*\n\s*short:\s*\n?\s*'((?:[^'\\]|\\.)*)'/g;
let m;
while ((m = re.exec(src))) fiches.push({ slug: m[1], question: m[2], short: m[4] });

// Combien de fiches contiennent chaque mot : un mot present partout ne
// distingue rien, un mot rare designe presque a lui seul. « voyage » est dans
// une vingtaine de fiches, « nutella » dans deux ou trois — les compter pareil
// etait toute l'erreur.
// On compare des MOTS, pas des bouts de mots. Avec `includes`, « sept »
// trouvait « septembre » et « assis » trouvait « assistance » : une question
// d'arithmetique tombait ainsi sur une fiche de zakat. Un prefixe reste admis
// a partir de cinq lettres, pour que « priere » retrouve « prieres » sans que
// « sept » ne retrouve quoi que ce soit.
const jetons = (t) => new Set(norm(t).split(/[^a-z0-9]+/).filter(Boolean));

function contient(ensemble, mot) {
  if (ensemble.has(mot)) return true;
  if (mot.length < 5) return false;
  for (const j of ensemble) if (j.startsWith(mot)) return true;
  return false;
}

const corpus = fiches.map((qa) => ({
  qa,
  fort: jetons(`${qa.question} ${qa.slug}`),
  faible: jetons(qa.short),
}));

const frequence = new Map();
function rarete(mot) {
  if (!frequence.has(mot)) {
    const n = corpus.reduce((k, c) => (contient(c.fort, mot) || contient(c.faible, mot) ? k + 1 : k), 0);
    // Logarithme : un mot deux fois plus rare ne vaut pas deux fois plus, mais
    // l'ecart reste net entre « voyage » et « nutella ».
    frequence.set(mot, Math.log(fiches.length / (1 + n)) + 0.2);
  }
  return frequence.get(mot);
}

/** Le repli : un mot du titre ou du slug compte plein, un mot croise dans un
 *  resume compte peu, et chaque mot pese selon sa rarete. Renvoie null quand
 *  rien n'est assez solide — avouer vaut mieux que repondre a cote. */
function replus(question) {
  const mots = motsUtiles(question);
  if (!mots.length) return null;

  let best = null;
  let bestFort = 0;
  let meilleur = 0;
  let second = 0;

  for (const c of corpus) {
    let nFort = 0;
    let score = 0;
    for (const w of mots) {
      const poids = rarete(w);
      if (contient(c.fort, w)) { nFort++; score += poids; }
      else if (contient(c.faible, w)) { score += poids * 0.3; }
    }
    if (score > meilleur) { second = meilleur; meilleur = score; bestFort = nFort; best = c.qa; }
    else if (score > second) { second = score; }
  }

  // Un mot au moins doit tomber dans le titre ou le slug : un mot croise
  // seulement dans un resume est souvent un hasard.
  //
  // Ensuite, plutot qu'un seuil absolu — toujours trop haut pour un mot et trop
  // bas pour un autre — on demande une SEPARATION : soit deux mots designent la
  // meme fiche, soit elle devance nettement la suivante. « voyage halal paris »
  // echoue aux deux : un seul mot fort, et une dizaine de fiches de voyage a
  // egalite derriere. C'est exactement le cas qu'on voulait attraper.
  if (!best || bestFort < 1 || meilleur < 1.5) return null;
  if (bestFort < 2 && meilleur < second * 1.5) return null;
  return {
    slug: best.slug,
    fort: bestFort,
    total: Number(meilleur.toFixed(2)),
    second: Number(second.toFixed(2)),
  };
}

// ─── Les cas ────────────────────────────────────────────────────────────────
// `attendu` : le slug espere, ou null pour « on prefere avouer qu'on ne sait pas »
const CAS = [
  { q: 'voyage halal paris',                 attendu: null,   note: 'aucune fiche voyage sur Paris : mieux vaut le dire' },
  { q: 'ou manger halal a paris',            attendu: 'restaurant-halal-paris', note: 'manger + paris designe UNE fiche, meme si chacun des deux mots seul est ambigu' },
  { q: 'manger un plat cuisine avec du vin',  attendu: 'cuisine-alcool-halal', note: 'meme raison : plat + cuisine + vin se rejoignent sur une seule fiche' },
  { q: 'restaurant halal lyon',              attendu: 'restaurant-halal-lyon' },
  { q: 'puis je prier assis quand je suis malade', attendu: 'priere-assise-malade' },
  { q: 'la greffe de cheveux est halal',     attendu: 'greffe-cheveux-halal' },
  { q: 'les paris sportifs',                 attendu: 'paris-sportifs-halal' },
  { q: 'le nutella est il halal',            attendu: 'nutella-halal' },
  { q: 'gelatine de porc',                   attendu: null,   note: 'quatre fiches gelatine a egalite stricte, et « porc » ne tombe dans aucun titre : rien ne designe laquelle' },
  { q: 'je me reveille apres le fajr',       attendu: 'retard-fajr-reveil' },
  { q: 'voyage halal istanbul',              attendu: 'voyage-halal-istanbul' },
  { q: 'combien font douze fois sept',       attendu: null,   note: 'hors sujet complet' },
  { q: 'quelle est la capitale du perou',    attendu: null,   note: 'hors sujet complet' },
  { q: 'bonjour',                            attendu: null },
  { q: 'tatouage priere',                    attendu: 'tatouage-halal' },
];

let ok = 0;
let rates = 0;
console.log(`${fiches.length} fiches\n`);
for (const c of CAS) {
  const r = replus(c.q);
  const obtenu = r ? r.slug : null;
  const bon = Array.isArray(c.attendu) ? c.attendu.includes(obtenu) : obtenu === c.attendu;
  if (bon) ok++; else rates++;
  const detail = r ? `${r.slug} (fort ${r.fort}, total ${r.total}, second ${r.second})` : "aucune — on avoue";
  console.log(`${bon ? '  ok  ' : '  RATE'} « ${c.q} »`);
  console.log(`        attendu : ${Array.isArray(c.attendu) ? c.attendu.join(' ou ') : (c.attendu ?? 'aucune')}`);
  console.log(`        obtenu  : ${detail}${c.note ? '   [' + c.note + ']' : ''}`);
}
console.log(`\n${ok} sur ${CAS.length} — ${rates} raté${rates > 1 ? 's' : ''}`);

// ─── Diagnostic : pourquoi un cas est refuse ────────────────────────────────
if (process.env.DETAIL) {
  for (const q of ['gelatine de porc', 'tatouage priere', 'ou manger halal a paris']) {
    const mots = motsUtiles(q);
    console.log(`\n« ${q} »  mots=[${mots.join(', ')}]  raretes=[${mots.map((w) => rarete(w).toFixed(2)).join(', ')}]`);
    const scores = corpus.map((c) => {
      let nFort = 0, score = 0, dont = [];
      for (const w of mots) {
        const p = rarete(w);
        if (contient(c.fort, w)) { nFort++; score += p; dont.push(w + '(fort)'); }
        else if (contient(c.faible, w)) { score += p * 0.3; dont.push(w + '(resume)'); }
      }
      return { slug: c.qa.slug, score, nFort, dont };
    }).sort((a, b) => b.score - a.score).slice(0, 4);
    for (const s of scores) console.log(`   ${s.score.toFixed(2)}  fort=${s.nFort}  ${s.slug}  [${s.dont.join(' ')}]`);
  }
}

process.exit(rates ? 1 : 0);
