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
