// Que faut-il ecrire cette nuit ? La reponse par la mesure, pas par la consigne.
//
// POURQUOI CE FICHIER EXISTE
//
// Le 5 septembre j'ai ecrit une fiche alimentaire — `vegan-halal` — alors que
// Mohamed avait decide le 12 aout qu'il n'y en aurait plus aucune. La decision
// etait pourtant encodee, dans `scripts/test-nourriture.mjs`, et c'est lui qui
// m'a rattrape. Je ne l'avais pas lu avant d'ecrire.
//
// La cause n'est pas l'etourderie. La consigne de la ronde de nuit, celle qui
// me reveille chaque jour, dit texto :
//
//     « Gisements ouverts : MARQUES, CHAINES (Popeyes, Pizza Hut),
//       MENTIONS D'ETIQUETTE. Format prouve : "[produit] halal ou pas". »
//
// Marques, chaines, etiquettes, produits : **tout cela est alimentaire.** La
// consigne qui me pilote pointe exactement vers ce que Mohamed a ferme. Elle a
// ete ecrite avant sa decision et n'a jamais ete corrigee. Tant qu'elle ne
// l'est pas, chaque nuit recommence avec la meme mauvaise carte.
//
// L'en-tete de `test-nourriture.mjs` avait deja nomme ce mecanisme, et c'est la
// meilleure description du probleme que j'ai lue :
//
//     « Pourquoi ce test plutot qu'une note dans un document : une consigne
//       ecrite quelque part se perd en trois nuits. La vague automatique ajoute
//       deux a cinq fiches chaque nuit, sans personne pour relire. »
//
// La vague automatique, c'est moi. Ce fichier est donc la reponse dans le meme
// esprit : au lieu d'esperer qu'une prose soit relue, on fait dire au depot
// lui-meme ce qu'il manque — mesure au moment ou l'on va ecrire.
//
//     node scripts/que-ecrire.mjs
//
// Il ne redige rien et ne decide rien. Il repond a une seule question : sur
// quel terrain une fiche de plus est-elle legitime cette nuit ? Le jugement
// editorial — « y a-t-il quelque chose a COMPRENDRE ici ? » — reste entier, et
// aucun compte ne le remplace.

import { QUESTIONS } from '../lib/questions.ts';

// Les pages dont Search Console montre qu'elles recoivent des impressions au
// 14 aout : Google y va DEJA. Une fiche liee a l'une d'elles a une chance
// d'etre exploree ; une fiche isolee attend son tour avec les 135 autres.
// La liste est partagee avec densifier-maillage.mjs et verifiee au chargement.
import { VISITEES } from './pages-visitees.mjs';

// Les memes valeurs que `test-nourriture.mjs`, et pour la meme raison. Elles y
// sont la regle qui fait echouer les controles ; elles sont ici l'explication.
// Si Mohamed change la decision, les deux fichiers changent ensemble.
const NOURRITURE = new Set(['Produits', 'Additifs', 'Alimentation']);
const PLAFOND = 107;      // etat au 12 aout, jour de la decision
const PART_VISEE = 0.48;

// Les domaines de la vie ou un musulman de France se pose des questions. Ce
// n'est pas une liste de sujets a traiter : c'est une grille pour VOIR ce que
// le catalogue ne couvre pas. Un domaine a zero fiche n'est pas forcement un
// sujet a prendre — il peut etre vide pour de bonnes raisons.
const DOMAINES = {
  'finance / argent':     /riba|interet|banque|credit|pret|assurance|hypoth|epargne|bourse|action|crypto|zakat|impot|dette|salaire/i,
  'mort / heritage':      /mort|deces|funerail|enterr|incin|testament|heritage|succession|linceul|janaza|cimetiere|deuil/i,
  'famille / mariage':    /mariage|nikah|dot|mahr|divorce|talaq|fiancail|epouse|adoption|parents|enfant|allaitement/i,
  'sante / corps':        /vaccin|fiv|pma|contracep|avortement|don-organe|transfusion|greffe|psy|depression|dentiste|anesthes/i,
  'travail / droit':      /travail|employeur|conge|patron|contrat|entreprise|associe|caissier|restaurant-alcool/i,
  'priere / purete':      /priere|wudu|ablution|ghusl|tayammum|qibla|rakat|vernis|henne|lentilles|platre|regles/i,
  'ramadan / jeune':      /ramadan|jeune|iftar|suhur|dattes|salive/i,
  'vie sociale / loisirs':/musique|jeux|echecs|sport|tatouage|piercing|photo|reseaux|anniversaire|noel|chien|chat|cigarette|chicha|puff/i,
};

const nourriture = QUESTIONS.filter((q) => NOURRITURE.has(q.category));
const part = nourriture.length / QUESTIONS.length;
const totalVise = Math.ceil(nourriture.length / PART_VISEE);
const aEcrire = Math.max(0, totalVise - QUESTIONS.length);

console.log('\nQUE FAUT-IL ECRIRE CETTE NUIT ?\n');

// ── 1. Le terrain ferme, dit avant tout le reste ─────────────────────────
console.log('  ⛔ FERME — decision de Mohamed du 12 aout, aucune exception :');
console.log(`     Produits · Additifs · Alimentation    ${nourriture.length} fiches, plafond ${PLAFOND}`);
if (nourriture.length > PLAFOND) {
  console.log(`     Deja ${nourriture.length - PLAFOND} de trop. Une marque, une chaine, un additif,`);
  console.log('     une mention d\'etiquette : tout cela tombe ici. On n\'y touche pas.');
}
console.log(`     Part alimentaire : ${(part * 100).toFixed(1)} %   objectif : ${PART_VISEE * 100} %`);
if (aEcrire > 0) {
  console.log(`     ${aEcrire} fiches NON alimentaires a ecrire pour y arriver.`);
}

// ── 2. Ou il reste de la place, par categorie ────────────────────────────
const parCategorie = {};
for (const q of QUESTIONS) parCategorie[q.category] = (parCategorie[q.category] ?? 0) + 1;
const ouvertes = Object.entries(parCategorie)
  .filter(([cat]) => !NOURRITURE.has(cat))
  .sort((a, b) => a[1] - b[1]);

console.log('\n  ✅ OUVERT — categories non alimentaires, la plus mince d\'abord :');
for (const [cat, n] of ouvertes) {
  console.log(`     ${String(n).padStart(3)}  ${cat}`);
}

// ── 3. Les domaines de la vie, et ce qui n'est pas couvert ───────────────
// C'est la partie utile : une categorie dit ou ranger une fiche, un domaine
// dit s'il y a un TROU. « Vie quotidienne » peut etre grasse et ne rien dire
// de l'argent ou de la mort.
console.log('\n  🔍 COUVERTURE PAR DOMAINE DE VIE — le trou se lit ici :');
const trous = [];
for (const [nom, re] of Object.entries(DOMAINES)) {
  const fiches = QUESTIONS.filter((q) => re.test(q.slug));
  const horsNourriture = fiches.filter((q) => !NOURRITURE.has(q.category));
  const marque = horsNourriture.length === 0 ? '  ← VIDE'
    : horsNourriture.length <= 3 ? '  ← mince'
    : '';
  console.log(`     ${String(horsNourriture.length).padStart(3)}  ${nom.padEnd(24)}${marque}`);
  if (horsNourriture.length <= 3) trous.push({ nom, n: horsNourriture.length });
}

// ── 4. Par ou Google entre, et s'il y reste de la place ──────────────────
// Une fiche neuve que rien de visite ne relie attend derriere les 135 pages
// « detectee, actuellement non indexee ». Autant la rattacher.
//
// La place restante est affichee parce qu'elle a failli me faire perdre une
// nuit. Le 17 septembre, densifier-maillage.mjs annoncait « 0 lien depuis une
// page que Google visite deja » et j'ai cru a une panne. Mesure faite :
// HUIT portes sur onze sont au plafond de huit liens sortants. Les trois
// autres ont douze places libres — mais les fiches qui leur sont vraiment
// proches ont deja quatre a cinq liens entrants, et celles qui en manquent ne
// leur ressemblent en rien. Le rapprochement lexical proposait « souhaiter
// Noel » pour la levure de biere et « Istanbul » pour les certifications.
//
// Donc : ce n'est pas une panne, c'est une saturation. Ces douze places ne se
// remplissent pas honnetement, et un maillage force est traite comme du bruit
// par Google. Quand le compteur dit zero, verifier ICI avant de chercher un
// bug ailleurs.
const PLAFOND_SORTANT = 8; // meme valeur que densifier-maillage.mjs
const portes = QUESTIONS.filter((q) => VISITEES.has(q.slug));
const portesNonAlimentaires = portes.filter((q) => !NOURRITURE.has(q.category));
const placesLibres = portes.reduce(
  (n, q) => n + Math.max(0, PLAFOND_SORTANT - q.related.length), 0,
);
const saturees = portes.filter((q) => q.related.length >= PLAFOND_SORTANT).length;

console.log('\n  🚪 LES PORTES NON ALIMENTAIRES QUE GOOGLE VISITE DEJA :');
for (const q of portesNonAlimentaires) {
  const reste = PLAFOND_SORTANT - q.related.length;
  console.log(
    `     ${q.slug.padEnd(28)} [${q.category}]` +
    (reste > 0 ? `  ${reste} place(s)` : '  saturee'),
  );
}
console.log(
  `\n     Sur les ${portes.length} portes, ${saturees} sont saturees et il reste` +
  `\n     ${placesLibres} place(s) au total. Relier la fiche neuve a l'une d'elles` +
  '\n     quand c\'est honnete editorialement — jamais pour faire du volume.',
);

// ── 5. Ce que cet outil ne dit pas ───────────────────────────────────────
console.log('\n  ⚖️  CE QUI RESTE A TON JUGEMENT, et qu\'aucun compte ne remplace :');
console.log('     Un domaine vide n\'est pas une commande. Le critere est');
console.log('     « y a-t-il quelque chose a COMPRENDRE ? », jamais « il manque');
console.log('     une fiche ». Sur les sujets a consequences — heritage, divorce,');
console.log('     fiqh technique — on decrit les avis, on nomme les divergences,');
console.log('     et on renvoie a un savant. On ne tranche jamais.');

if (trous.length > 0) {
  const noms = trous.map((t) => t.nom).join(', ');
  console.log(`\n  Terrains les plus degarnis ce soir : ${noms}.`);
}
console.log();
