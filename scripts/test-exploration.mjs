// Ce que le robot peut explorer, et ce qu'il peut comprendre.
//
//     node scripts/test-exploration.mjs            (serveur attendu sur :3350)
//     BASE=http://127.0.0.1:3100 node scripts/test-exploration.mjs
//
// POURQUOI CE FICHIER EXISTE
//
// Balayage du 4 au 5 novembre, dans la foulee de la decouverte de la veille :
// le perimetre d'un garde ne se verifie pas quand il passe au vert. Quatre
// choses que le site sert n'etaient couvertes par AUCUN garde — `robots.txt`,
// le traitement des adresses inconnues, la passerelle `/e/<code>` et le
// JSON-LD. Mesurees une par une : **les quatre etaient saines.** Ce fichier ne
// repare donc rien. Il garde trois d'entre elles, parce que toutes les trois
// echouent EN SILENCE.
//
//   · un `Disallow: /` de trop, et le site entier sort de Google sans un bruit.
//     Le carnet porte deja cinq jours d'invisibilite que personne n'a vus (§5).
//   · une adresse inconnue qui repond 200 est un « soft 404 » : le robot la
//     lit, n'y trouve rien, et c'est du budget d'exploration en moins — or le
//     budget d'exploration EST le diagnostic qui gouverne ce site.
//   · un JSON-LD casse est ignore par Google sans message. Et le defaut est
//     documente : `lib/emphase.ts` existe parce que des marqueurs de gras
//     partaient tels quels dans les donnees structurees.
//
// CE QUE JE N'AI PAS FAIT, et le refus vaut la mesure. Les hubs et l'accueil
// ne portent aucun JSON-LD. La tentation etait d'en ajouter (WebSite,
// SearchAction, ItemList). Refuse : le diagnostic de ce site est un budget
// d'exploration, pas un manque de resultats enrichis. Du balisage n'amene pas
// le robot a venir plus souvent. Inventer un levier n'en est pas un.
//
// ON LIT CE QUE LE SERVEUR REND. Trois nuits de suite, mon instrument s'est
// trompe avant de trouver quoi que ce soit : une sonde qui supposait le
// gabarit des hubs, un compteur bash en octets, et un `curl` qui lisait le
// CORPS d'une redirection 308 sans la suivre — ce dernier m'a fait croire que
// `/e/E120` annoncait « fiche non encore publiee » alors qu'il redirige
// correctement. D'ou la regle ici : on mesure le statut ET la cible, jamais le
// corps d'une reponse qu'on n'a pas suivie.
//
// Serveur absent = code 2, mesure impossible. Jamais code 1.

import { QUESTIONS } from '../lib/questions.ts';
import { SITE_URL } from '../lib/config.ts';

const BASE = process.env.BASE ?? 'http://127.0.0.1:3350';

let echecs = 0;
const dire = (ok, quoi, detail = '') => {
  console.log(`${ok ? '✓' : '✗'} ${quoi}${detail ? ` — ${detail}` : ''}`);
  if (!ok) echecs += 1;
};

try {
  await fetch(BASE);
} catch (e) {
  console.error(`\n⚠ MESURE IMPOSSIBLE — ${BASE} ne repond pas.`);
  console.error(`  ${e.message}`);
  console.error('  Lancer : npm run build && npx next start -p 3350');
  console.error('  Rien n\'a ete mesure : ce n\'est PAS un defaut du site.\n');
  process.exit(2);
}

const statut = async (chemin) => (await fetch(`${BASE}${chemin}`, { redirect: 'manual' })).status;

// ── 1. robots.txt — la porte d'entree ───────────────────────────────────
console.log('1. ROBOTS.TXT\n');

const rRobots = await fetch(`${BASE}/robots.txt`);
dire(rRobots.ok, 'robots.txt est servi', rRobots.ok ? '' : `HTTP ${rRobots.status}`);
const robots = rRobots.ok ? await rRobots.text() : '';

const interdits = [...robots.matchAll(/^\s*Disallow:\s*(\S*)\s*$/gim)].map((m) => m[1]);

// Le seul qui compte vraiment : `Disallow: /` ferme tout le site.
dire(!interdits.includes('/'), 'aucun « Disallow: / » — le site entier resterait explorable',
  interdits.includes('/') ? 'TOUT LE SITE EST FERME A GOOGLE' : '');

// Les deux prefixes qui portent la totalite du contenu indexable.
for (const prefixe of ['/q/', '/categorie/']) {
  const bloque = interdits.some((i) => i !== '' && prefixe.startsWith(i));
  dire(!bloque, `${prefixe} n'est pas interdit au robot`,
    bloque ? `interdit par « Disallow: ${interdits.find((i) => i !== '' && prefixe.startsWith(i))} »` : '');
}

// Un plan du site annonce mais introuvable est pire que pas de plan : le robot
// le demande a chaque passage et repart les mains vides.
const annonce = (robots.match(/^\s*Sitemap:\s*(\S+)\s*$/im) ?? [, ''])[1];
dire(annonce === `${SITE_URL}/sitemap.xml`,
  'robots.txt annonce le plan du site a l\'adresse canonique',
  annonce ? (annonce === `${SITE_URL}/sitemap.xml` ? '' : `annonce « ${annonce} »`) : 'aucune ligne Sitemap');

const rPlan = await fetch(`${BASE}/sitemap.xml`);
const plan = rPlan.ok ? await rPlan.text() : '';
dire(rPlan.ok && plan.includes('<urlset'),
  'le plan du site repond et porte un <urlset>',
  rPlan.ok ? '' : `HTTP ${rPlan.status}`);

// ── 2. Les adresses inconnues ───────────────────────────────────────────
console.log('\n2. CE QUE RENVOIE UNE ADRESSE QUI N\'EXISTE PAS\n');

for (const chemin of [
  '/q/cette-fiche-n-existe-pas',
  '/categorie/cette-categorie-n-existe-pas',
  '/chemin-invente-de-toutes-pieces',
  '/e/PATATE',                      // n'a pas la forme d'un code additif
]) {
  const s = await statut(chemin);
  dire(s === 404, `${chemin} → 404`, s === 404 ? '' : `repond ${s} — soft 404, budget d'exploration perdu`);
}

// L'EXCEPTION, et c'est elle qu'il faut garder. `/e/<code plausible mais non
// publie>` repond 200 DELIBEREMENT : une page honnete « pas encore publiee »
// vaut mieux qu'une redirection vers une categorie qui ne parle pas du code
// (audit du 13 aout). Ce choix ne tient que parce que la page est `noindex` —
// son propre commentaire le dit : « les indexer reviendrait a fabriquer des
// centaines de pages minces ». Un commentaire n'est pas un garde-fou : si le
// `noindex` disparait, c'est ici qu'on l'apprend.
const CODE_NON_PUBLIE = 'E9999';
const rPont = await fetch(`${BASE}/e/${CODE_NON_PUBLIE}`, { redirect: 'manual' });
dire(rPont.status === 200, `/e/${CODE_NON_PUBLIE} repond 200 (page « pas encore publiee », voulue)`,
  rPont.status === 200 ? '' : `repond ${rPont.status}`);
if (rPont.status === 200) {
  const html = await rPont.text();
  dire(/<meta name="robots"[^>]*noindex/i.test(html),
    `/e/${CODE_NON_PUBLIE} est en noindex`,
    'sans lui, la passerelle fabrique des centaines de pages minces indexables');
}

// ── 3. Le JSON-LD, sur les 253 fiches ───────────────────────────────────
console.log(`\n3. DONNEES STRUCTUREES — ${QUESTIONS.length} fiches\n`);

const dec = (s) => s
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
  .replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&amp;/g, '&');

const casses = [];
const sansFaq = [];
const sansFil = [];
const avecGras = [];

for (const q of QUESTIONS) {
  const html = await (await fetch(`${BASE}/q/${q.slug}`)).text();
  const blocs = [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  const types = [];
  for (const brut of blocs) {
    let o;
    try {
      o = JSON.parse(dec(brut));
    } catch {
      casses.push(q.slug);
      continue;
    }
    for (const x of Array.isArray(o) ? o : [o]) types.push(x['@type']);
    if (JSON.stringify(o).includes('**')) avecGras.push(q.slug);
  }
  if (!types.includes('FAQPage')) sansFaq.push(q.slug);
  if (!types.includes('BreadcrumbList')) sansFil.push(q.slug);
}

const extrait = (l) => l.slice(0, 6).join(', ') + (l.length > 6 ? `… (+${l.length - 6})` : '');

dire(casses.length === 0, 'tous les blocs JSON-LD sont du JSON valide',
  casses.length ? extrait(casses) : '');
dire(sansFaq.length === 0, 'chaque fiche porte un FAQPage',
  sansFaq.length ? extrait(sansFaq) : '');
dire(sansFil.length === 0, 'chaque fiche porte un BreadcrumbList',
  sansFil.length ? extrait(sansFil) : '');
// `lib/emphase.ts` existe pour cela : le gras ne doit pas partir dans ce que
// Google lit, ni dans ce que le mode conduite prononce a voix haute.
dire(avecGras.length === 0, 'aucun marqueur de gras dans les donnees structurees',
  avecGras.length ? extrait(avecGras) : '');

console.log(
  echecs === 0
    ? '\n✓ Le robot peut tout explorer, et tout ce qu\'il lit est bien forme.'
    : `\n✗ ${echecs} defaut(s).`,
);
process.exit(echecs === 0 ? 0 : 1);
