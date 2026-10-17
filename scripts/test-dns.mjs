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
//
// DEUX VOIES, et trois issues. Ce conteneur a deux sorties : son resolveur DNS,
// et le proxy par lequel passe tout le reste. Le 17 octobre 2026 — cinquieme
// nuit d'affilee ou le resolveur etait muet — ce test se contentait d'imprimer
// « verifier d'abord : curl -sS "$HTTPS_PROXY/__agentproxy/status" ». Il peut
// la poser lui-meme, cette question. Il la pose maintenant, et les trois issues
// ne se confondent plus :
//
//   code 0  — les adresses repondent, par l'une ou l'autre voie
//   code 1  — un apex est mort : ALERTE, on previent
//   code 2  — MESURE IMPOSSIBLE, avec la cause nommee quand elle est connue
//
// Le code 2 n'est pas un echec timide : c'est le refus de repondre a une
// question qu'on n'a pas pu poser.

import { lookup } from 'node:dns/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const executer = promisify(execFile);

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

// ── LA DEUXIEME VOIE, quand le resolveur local est mort ──────────────────
//
// Le resolveur de cette machine n'est pas la seule sortie : tout le reste du
// conteneur passe par un proxy, qui fait SA propre resolution. Donc quand
// `lookup` ne dit plus rien, il reste une question a poser — et c'est curl
// qui sait la poser, parce que c'est lui qui est configure pour ce proxy.
//
// Trois reponses possibles, et il faut les distinguer, parce que deux d'entre
// elles ressemblent a une panne sans en etre une :
//
//   servi    — le proxy a joint le domaine et il a repondu. Preuve PLUS FORTE
//              qu'un enregistrement A : non seulement l'adresse existe, mais
//              elle sert des pages. La mesure est donc possible par ici.
//   refuse   — « 403 to CONNECT » : la politique reseau de l'environnement
//              interdit cet hote. Rien sur l'etat du site, et aucun
//              contournement de mon cote — c'est un reglage, pas une panne.
//   injoignable — le proxy a essaye et n'a pas abouti. La seule des trois qui
//              puisse vouloir dire que le domaine est tombe, et elle ne le
//              prouve pas a elle seule.
async function parLeProxy(hote) {
  try {
    const { stdout } = await executer('curl', [
      '-sS', '-o', '/dev/null', '-m', '20', '-w', '%{http_code}',
      `https://${hote}/`,
    ]);
    const code = Number(stdout.trim());
    return code > 0
      ? { etat: 'servi', code }
      : { etat: 'injoignable', detail: `code HTTP ${stdout.trim()}` };
  } catch (e) {
    const texte = `${e.stderr ?? ''}${e.message ?? ''}`;
    // curl code 56 + « response 403 » : le refus vient de la passerelle, pas
    // du domaine. Le distinguer est tout l'objet de cette fonction.
    if (/CONNECT tunnel failed, response 403/.test(texte)) {
      return { etat: 'refuse', detail: 'politique reseau du conteneur (403 au CONNECT)' };
    }
    if (e.code === 'ENOENT') return { etat: 'injoignable', detail: 'curl absent de cette machine' };
    return { etat: 'injoignable', detail: texte.trim().split('\n')[0] || `curl code ${e.code}` };
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
// Et le filtre porte bien sur la LISTE, pas sur le resolveur : mesure du
// 17 octobre, `github.com`, `pypi.org` et `api.anthropic.com` resolvent en
// quelques millisecondes depuis cette meme machine. « Le DNS est casse » etait
// donc encore une description fausse de la bonne conclusion.
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

// `dns` par defaut ; `proxy` si le resolveur local est mort mais que la
// deuxieme voie repond.
let voie = 'dns';

if (temoinsVivants.length === 0) {
  // Le resolveur local ne sort plus. Avant de conclure quoi que ce soit, on
  // pose la question a la deuxieme voie — cinq nuits de suite ce test a
  // imprime « verifier d'abord : curl ... » au lieu de verifier lui-meme.
  // Une consigne qu'un instrument peut executer n'a pas a etre deleguee au
  // lecteur : c'est la qu'on se retrompe.
  const sonde = await parLeProxy(EMPIRE[0].nom);

  if (sonde.etat === 'servi') {
    voie = 'proxy';
    console.log(`Resolveur local muet, mais le proxy sert ${EMPIRE[0].nom} (${sonde.code}).`);
    console.log('Bascule sur la deuxieme voie : on mesure ce qui REPOND, ce qui');
    console.log('vaut mieux qu\'un enregistrement A — une adresse peut exister');
    console.log('sans rien servir.\n');
  } else {
    console.error('\n✗ MESURE IMPOSSIBLE — ce n\'est pas une panne des sites.\n');
    console.error(`  Aucun des temoins ne resout : ${TEMOINS.join(', ')}.`);
    console.error('  Ces domaines sont en ligne. Si eux ne resolvent pas, c\'est la');
    console.error('  sortie de cette machine qui est filtree, pas l\'empire qui est');
    console.error('  tombe — le resolveur repond tres bien pour les hotes de la');
    console.error('  liste blanche, et seulement pour eux.');

    if (sonde.etat === 'refuse') {
      // La cause, nommee, et non plus une commande a aller taper.
      console.error(`\n  CAUSE CONFIRMEE, deuxieme voie : ${sonde.detail}.`);
      console.error(`  Le proxy refuse d'ouvrir ${EMPIRE[0].nom} — il ne l'a meme pas`);
      console.error('  joint. Un refus de la passerelle ne dit RIEN de l\'etat du site,');
      console.error('  et il n\'a pas de contournement de mon cote : c\'est un reglage');
      console.error('  de l\'environnement, a elargir par son proprietaire.');
    } else {
      // La seule des trois qui PEUT vouloir dire que le domaine est tombe —
      // et qui ne le prouve pas, puisque les deux voies sont muettes en meme
      // temps. Le dire ainsi, sans le transformer en alerte.
      console.error(`\n  Deuxieme voie muette aussi : ${sonde.detail}.`);
      console.error('  Les deux sorties de cette machine sont inutilisables en meme');
      console.error('  temps, ce qui s\'explique par la machine bien plus volontiers');
      console.error('  que par cinq domaines tombes ensemble sur deux hebergeurs.');
      console.error('  Reste un doute, et un doute se nomme : il n\'est pas une alerte.');
    }

    console.error('\n  NE PAS prevenir Mohamed d\'une panne DNS sur cette base, et NE PAS');
    console.error('  toucher a une zone DNS. Le 10 octobre ce test a annonce cinq');
    console.error('  domaines morts sur deux hebergeurs differents : la politique');
    console.error('  reseau du conteneur avait change, les sites allaient bien.');
    console.error('\n  Pour voir la politique en vigueur :');
    console.error('  curl -sS "$HTTPS_PROXY/__agentproxy/status"');
    console.error('\n  L\'etape 0 de la ronde est donc AVEUGLE depuis cette machine :');
    console.error('  le dire dans le compte rendu, sans conclure sur l\'etat des sites.');
    process.exit(2);
  }
} else {
  console.log(`Instrument controle : ${temoinsVivants.length}/${TEMOINS.length} temoin(s) resolvent.`);
  console.log('Resolution des dix adresses de l\'empire.\n');
}

// Trois etats par adresse, et le troisieme est la raison d'etre de ce fichier.
//
// La premiere version de cette bascule n'en connaissait que deux, vivant ou
// mort — et le test d'acceptation l'a prise en faute dans la minute : la sonde
// etablit qu'UN hote est autorise, pas les cinq. Les quatre autres, refuses par
// la politique, etaient comptes morts et declenchaient « 4 APEX NE REPOND PAS.
// Le site est invisible pour Google », code 1, ALERTE.
//
// C'est-a-dire precisement la faute du 10 octobre, reintroduite par l'outil
// censé l'empecher, a trente lignes de l'avertissement qui la decrit. Un garde
// qui ne s'applique qu'a l'echantillon n'est pas un garde.
const INCONNU = 'inconnu';

// POURQUOI LA CONTRE-EPREUVE S'APPLIQUE AUSSI EN MODE DNS. Les temoins ne
// marchaient que par chance. Mesure du 17 octobre : `github.com`,
// `registry.npmjs.org`, `pypi.org` et `api.anthropic.com` resolvent tres bien
// depuis cette machine. Le resolveur n'est donc pas en panne — il est FILTRE
// sur la liste blanche de l'environnement. Si les temoins echouent, c'est
// seulement parce qu'aucun des trois n'y figure.
//
// Qu'un jour `google.com` entre dans cette liste, ce qui n'a rien
// d'extravagant, et le controle passe au vert pendant que nos cinq domaines
// restent hors liste : « 5 APEX NE RESOUT PAS », alerte, et quelqu'un part
// reparer une zone intacte. Le garde protege l'echantillon, pas la mesure.
//
// D'ou la contre-epreuve, par hote et dans les deux modes : avant de declarer
// un apex mort, demander a la passerelle. Si elle refuse de l'ouvrir, la
// non-resolution ne prouve rien — les deux voies sont filtrees sur la meme
// liste. Un hote teste vaut mieux que trois temoins bien choisis.
async function etatDe(hote) {
  if (voie === 'dns') {
    const ip = await resout(hote);
    if (ip) return { etat: 'vivant', dit: ip };
    const r = await parLeProxy(hote);
    if (r.etat === 'servi') return { etat: 'vivant', dit: `HTTP ${r.code} (par le proxy)` };
    if (r.etat === 'refuse') return { etat: INCONNU, dit: 'hors liste blanche' };
    return { etat: 'mort' };
  }
  const r = await parLeProxy(hote);
  if (r.etat === 'servi') return { etat: 'vivant', dit: `HTTP ${r.code}` };
  if (r.etat === 'refuse') return { etat: INCONNU, dit: 'refus de politique' };
  return { etat: 'mort' };
}

let inconnus = 0;

for (const { nom, ou } of EMPIRE) {
  const apex = await etatDe(nom);
  const www = await etatDe(`www.${nom}`);

  if (apex.etat === 'vivant') {
    console.log(`✓ ${nom.padEnd(20)} ${apex.dit.padEnd(18)} ${ou}`);
  } else if (apex.etat === INCONNU) {
    console.log(`? ${nom.padEnd(20)} NON MESURABLE      ← ${apex.dit}, rien sur le site`);
    inconnus += 1;
  } else {
    console.log(`✗ ${nom.padEnd(20)} NE REPOND PAS      ← le site n'existe plus`);
    echecs += 1;
  }

  if (www.etat === 'vivant') {
    console.log(`  www.${nom.padEnd(16)} ${www.dit}`);
  } else if (www.etat === INCONNU) {
    console.log(`  www.${nom.padEnd(16)} non mesurable`);
  } else {
    console.log(`  www.${nom.padEnd(16)} absent (avertissement)`);
    alertes += 1;
  }
}

console.log();
const verbe = voie === 'dns' ? 'resolvent' : 'repondent';

// Un apex non mesurable sort du compte des alertes ET du compte des succes.
// Tant qu'il en reste un, le resultat de l'etape 0 est partiel, et un resultat
// partiel se dit tel — il ne s'arrondit pas au plus alarmant.
if (inconnus > 0) {
  console.log(`? ETAPE 0 PARTIELLE : ${inconnus} apex sur ${EMPIRE.length} non mesurable(s).`);
  console.log('  La politique reseau refuse ces hotes a la passerelle. Ce n\'est');
  console.log('  ni un succes ni une panne : c\'est une question sans reponse, et');
  console.log('  elle reste sans reponse jusqu\'a ce que la politique soit elargie.');
  if (echecs > 0) {
    console.log(`\n  ${echecs} autre(s) apex ne repond(ent) pas du tout — la passerelle les`);
    console.log('  a bien essayes, eux. A confirmer depuis une machine qui resout');
    console.log('  AVANT de prevenir ou de toucher a une zone.');
  }
  if (echecs === 0) process.exit(2);
}

if (echecs === 0 && alertes === 0) {
  console.log(`✓ Les dix adresses ${verbe}.`);
} else if (echecs === 0) {
  console.log(`✓ Les cinq apex ${verbe}. ${alertes} www absent(s) — genant, pas fatal.`);
} else {
  console.log(`✗ ${echecs} APEX NE REPOND PAS. Le site est invisible pour Google.`);
  console.log('  Verifier la zone DNS du domaine : il manque probablement');
  console.log('  l\'enregistrement A du sous-domaine « @ ».');
  console.log('  Rappel : Vercel exige un CNAME pour un sous-domaine, jamais');
  console.log('  un A — et le tableau de bord donne le type ET la valeur exacts.');
  if (voie === 'proxy') {
    // Ne pas laisser croire que le DNS a ete lu : il ne l'a pas ete.
    console.log('\n  Mesure prise par le proxy, le resolveur local etant muet : un');
    console.log('  apex compte ici comme mort s\'il ne SERT rien. Avant de toucher');
    console.log('  a une zone, confirmer depuis une machine qui resout.');
  }
}

process.exit(echecs === 0 ? 0 : 1);
