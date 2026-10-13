// Les cinq domaines de l'empire resolvent-ils ? La question qui aurait fait
// gagner cinq jours.
//
// POURQUOI CE FICHIER EXISTE
//
// Du 23 au 28 aout 2026, halalgpt.fr n'avait plus d'enregistrement A. L'adresse
// canonique du site — celle que Google a indexee, celle qui figure dans chaque
// ligne du sitemap — ne resolvait plus. Google ne pouvait atteindre AUCUNE
// page. Les impressions sont tombees a zero du jour au lendemain, et personne
// ne l'a vu pendant cinq jours.
//
// Le pire n'est pas la panne, c'est ce qui l'a masquee. Le test en direct de
// Search Console, interroge sur https://halalgpt.fr/, repondait :
//
//     « Google a acces a cette URL · La page peut etre indexee »
//
// ALORS QUE LE DOMAINE NE RESOLVAIT PAS. Cette reponse a ecarte la bonne piste
// et fait enchainer trois hypotheses fausses — donnees incomplietes, site reste
// hors ligne, signal de qualite. Aucune des trois n'aurait survecu a deux
// secondes de resolution DNS.
//
// D'ou ce fichier. Search Console, les rapports d'indexation et les tableaux de
// bord decrivent ce que Google CROIT. Le DNS dit ce qui EXISTE. On commence
// toujours par lui.
//
//     node scripts/test-dns.mjs
//
// L'apex qui ne resout pas est un ECHEC : le site n'existe plus pour personne.
// Le www qui ne resout pas est un AVERTISSEMENT : genant, jamais fatal, parce
// que la forme canonique de chaque site est l'apex ou le www selon le site, et
// qu'un seul des deux suffit a servir les pages indexees.

import { lookup } from 'node:dns/promises';

// Les cinq sites, avec leur hebergeur — utile quand une IP surprend.
const EMPIRE = [
  { nom: 'halalgpt.fr', ou: 'Vercel' },
  { nom: 'voyageshalal.fr', ou: 'Vercel' },
  { nom: 'gohalaltravel.com', ou: 'Vercel (meme projet que voyageshalal)' },
  { nom: 'islampasapas.fr', ou: 'Vercel' },
  { nom: 'halalcheck.fr', ou: 'GitHub Pages' },
];

// Des domaines qui sont en ligne, toujours, et qui ne nous appartiennent pas.
// Ils ne servent pas a tester l'empire : ils servent a tester CE TEST.
const TEMOINS = ['google.com', 'cloudflare.com', 'example.com'];

let echecs = 0;
let alertes = 0;

/** L'adresse du domaine, ou null s'il ne resout pas. */
async function resout(hote) {
  try {
    const { address } = await lookup(hote, { family: 0 });
    return address;
  } catch {
    return null;
  }
}

// ── LE CONTROLE DE L'INSTRUMENT, avant toute mesure ─────────────────────
//
// POURQUOI CE BLOC EXISTE. Du 10 au 13 octobre 2026, ce test a annonce trois
// nuits de suite : « 5 APEX NE RESOUT PAS. Le site est invisible pour Google. »
// Cinq domaines, sur DEUX hebergeurs differents — Vercel et GitHub Pages —
// tombes a la meme seconde. Et la consigne de la ronde dit, pour ce test
// precisement : « si ce test echoue, tu arretes tout et tu previens Mohamed ».
//
// Ce qui aurait ete exactement la faute d'aout, dans l'autre sens : envoyer
// quelqu'un reparer une zone DNS qui n'avait rien.
//
// Parce que la panne n'existait pas. `google.com` et `cloudflare.com` ne
// resolvaient pas non plus, et le proxy de sortie du conteneur repondait
// « gateway answered 403 to CONNECT (policy denial) ». La politique reseau de
// l'environnement avait change : ce conteneur ne resout plus que les hotes de
// sa liste blanche. L'instrument etait aveugle, pas les sites morts.
//
// La lecon tient en une phrase, et elle vaut au-dela du DNS : un echec de
// TRANSPORT n'est pas une reponse du site. Pas de reponse = « je ne sais pas »,
// et « je ne sais pas » n'est pas « c'est casse ».
//
// D'ou ce controle. Si les temoins ne resolvent pas, le test s'arrete sur le
// code 2 — ni succes, ni panne : MESURE IMPOSSIBLE. Un chiffre qu'on ne peut
// pas prendre doit se taire, pas crier au loup.
const temoinsVivants = [];
for (const t of TEMOINS) {
  if (await resout(t)) temoinsVivants.push(t);
}

if (temoinsVivants.length === 0) {
  console.error('\n✗ MESURE IMPOSSIBLE — ce n\'est pas une panne des sites.\n');
  console.error(`  Aucun des temoins ne resout : ${TEMOINS.join(', ')}.`);
  console.error('  Ces domaines sont en ligne. Si eux ne resolvent pas, c\'est le');
  console.error('  resolveur de cette machine qui ne sort plus, pas l\'empire qui');
  console.error('  est tombe.');
  console.error('\n  NE PAS prevenir Mohamed d\'une panne DNS sur cette base, et NE PAS');
  console.error('  toucher a une zone DNS. Le 10 octobre ce test a annonce cinq');
  console.error('  domaines morts sur deux hebergeurs differents : la politique');
  console.error('  reseau du conteneur avait change, les sites allaient bien.');
  console.error('\n  Verifier d\'abord :  curl -sS "$HTTPS_PROXY/__agentproxy/status"');
  console.error('  Un « 403 to CONNECT » y designe un refus de politique.');
  console.error('\n  L\'etape 0 de la ronde est donc AVEUGLE depuis cette machine :');
  console.error('  le dire dans le compte rendu, sans conclure sur l\'etat des sites.');
  process.exit(2);
}

console.log(`Instrument controle : ${temoinsVivants.length}/${TEMOINS.length} temoin(s) resolvent.`);
console.log('Resolution des dix adresses de l\'empire.\n');

for (const { nom, ou } of EMPIRE) {
  const apex = await resout(nom);
  const www = await resout(`www.${nom}`);

  if (apex) {
    console.log(`✓ ${nom.padEnd(20)} ${apex.padEnd(18)} ${ou}`);
  } else {
    console.log(`✗ ${nom.padEnd(20)} NE RESOUT PAS      ← le site n'existe plus`);
    echecs += 1;
  }

  if (www) {
    console.log(`  www.${nom.padEnd(16)} ${www}`);
  } else {
    console.log(`  www.${nom.padEnd(16)} absent (avertissement)`);
    alertes += 1;
  }
}

console.log();
if (echecs === 0 && alertes === 0) {
  console.log('✓ Les dix adresses resolvent.');
} else if (echecs === 0) {
  console.log(`✓ Les cinq apex resolvent. ${alertes} www absent(s) — genant, pas fatal.`);
} else {
  console.log(`✗ ${echecs} APEX NE RESOUT PAS. Le site est invisible pour Google.`);
  console.log('  Verifier la zone DNS du domaine : il manque probablement');
  console.log('  l\'enregistrement A du sous-domaine « @ ».');
  console.log('  Rappel : Vercel exige un CNAME pour un sous-domaine, jamais');
  console.log('  un A — et le tableau de bord donne le type ET la valeur exacts.');
}

process.exit(echecs === 0 ? 0 : 1);
