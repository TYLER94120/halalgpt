// Quelles questions recoivent tout de suite une FICHE VERIFIEE, sans attendre l'IA.
//
// Mesure du 11 aout, sur les vraies requetes que Google envoie (relevés Search
// Console) : 4 sur 17. « le tatouage est il permis », « les bonbons haribo sont
// ils halal », « la musique est elle haram » attendaient l'IA alors qu'une fiche
// ecrite a la main, verifiee, repond exactement a la question.
//
// La cause : l'etage 1 exigeait TROIS mots communs avec une fiche. Une question
// courte et precise n'en a qu'un — le plus rare, celui qui suffit.
//
// Le danger est l'inverse et il est pire : l'etage 1 saute l'IA et ne s'annonce
// pas. Une mauvaise correspondance donne une reponse fausse avec assurance.
// C'est le defaut « voyage halal paris repond Istanbul » du 10 aout. La moitie
// des cas ci-dessous sert donc a verifier qu'on NE repond PAS.
//
//   BASE=http://127.0.0.1:3321 node scripts/test-etage1.mjs
//
// Aucune cle d'API n'est necessaire — c'est meme le contraire : sans cle, tout
// ce qui n'est pas servi par l'etage 1 tombe sur le repli, qui s'annonce. Le
// preambule du repli est donc le signe qui distingue les deux chemins.

const BASE = process.env.BASE ?? 'http://127.0.0.1:3321';
const SIGNE_DU_REPLI = 'n’arrive pas à joindre mon IA';

let echecs = 0;
const dire = (ok, quoi, detail = '') => {
  console.log(`${ok ? '✓' : '✗'} ${quoi}${detail ? ` — ${detail}` : ''}`);
  if (!ok) echecs += 1;
};

async function repondA(question) {
  const r = await fetch(`${BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: [{ role: 'user', content: question }] }),
  });
  return r.text();
}

// ── Ce qui DOIT etre servi tout de suite ──────────────────────────────────
// Chaque ligne : la question, et le slug de la fiche qui doit repondre. On ne
// verifie pas seulement « une fiche est arrivee » mais LAQUELLE : servir la
// mauvaise fiche instantanement serait pire que d'attendre l'IA.
const EVIDENTES = [
  ['Le E120 est-il halal ?', 'e120-halal'],
  ['e627 halal', 'e631-e627-halal'],
  ['le tatouage est il permis', 'tatouage-halal'],
  ['les bonbons haribo sont ils halal', 'haribo-halal'],
  ['la musique est elle haram', 'musique-halal'],
  ['avaler sa salive casse le jeune', 'avaler-salive-ramadan'],
  ['rattraper les prieres ratees', 'rattraper-prieres-ratees'],
];

console.log('CE QUI DOIT ARRIVER TOUT DE SUITE\n');
for (const [question, slug] of EVIDENTES) {
  const t0 = Date.now();
  const texte = await repondA(question);
  const ms = Date.now() - t0;
  const instantane = !texte.includes(SIGNE_DU_REPLI);
  const bonneFiche = texte.includes(`/q/${slug}`);
  dire(
    instantane && bonneFiche,
    `« ${question} »`,
    instantane
      ? bonneFiche
        ? `${slug} en ${ms} ms`
        : `MAUVAISE fiche servie (attendu ${slug})`
      : 'a attendu l’IA',
  );
}

// ── Ce qui ne DOIT PAS etre servi par l'etage 1 ───────────────────────────
// Ces questions n'ont pas de fiche qui y reponde vraiment. Y repondre quand
// meme, sans le dire, c'est le defaut du 10 aout.
const PIEGES = [
  ['voyage halal paris', 'une dizaine de fiches de voyage a egalite derriere'],
  // « certification halal » etait ici au premier essai. Le test l'a signale
  // comme regression — a tort : le site a bien une fiche sur les organismes
  // (AVS, ARGML, Achahada) et elle repond exactement a la question. C'est mon
  // piege qui etait faux, pas le moteur. Remplace par des questions auxquelles
  // le site n'a vraiment rien a repondre.
  ['quelle heure il est a tokyo', 'le site ne repond pas a ca'],
  ['je cherche un plombier', 'aucun rapport avec le halal'],
  ['moslem meal', 'question en anglais, aucune fiche dediee'],
  ['bonjour', 'ce n’est pas une question'],
  ['est ce que c’est bon', 'aucun mot precis'],
];

console.log('\nCE QUI NE DOIT PAS ETRE SERVI SANS LE DIRE\n');
for (const [question, pourquoi] of PIEGES) {
  const texte = await repondA(question);
  const sAnnonce = texte.includes(SIGNE_DU_REPLI);
  dire(sAnnonce, `« ${question} » n’est pas servie comme une certitude`, pourquoi);
}

console.log(
  echecs === 0
    ? '\n✓ Les questions evidentes ont leur fiche tout de suite, et les autres ne recoivent rien d’invente.'
    : `\n✗ ${echecs} echec(s)`,
);
process.exit(echecs === 0 ? 0 : 1);
