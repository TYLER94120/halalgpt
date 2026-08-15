// La porte IA de la famille — la partie qu'on peut tenir sans serveur.
//
// Ce test tient trois choses, et la première est celle qui protège l'argent :
//   1. qui a le droit d'appeler (la liste des origines est FERMÉE) ;
//   2. ce que l'assistant a le droit de dire (la charte, site par site) ;
//   3. le bloc contexte — la mécanique qui rend ne-jamais-inventer applicable
//      à une IA : pas de contexte, pas de fait local.

import assert from 'node:assert/strict';

import {
  blocContexte,
  construireSysteme,
  CONTEXTE_MAX,
  estUnSiteConnu,
  origineAutorisee,
  SITES_FAMILLE,
} from '../lib/assistant.ts';

let rates = 0;
function verifie(nom, fn) {
  try {
    fn();
    console.log(`  ✓ ${nom}`);
  } catch (e) {
    rates += 1;
    console.log(`  ✗ ${nom}\n      ${e.message}`);
  }
}

console.log('\nLA PORTE IA DE LA FAMILLE\n');

// ── 1. Qui peut appeler ─────────────────────────────────────────────────────
verifie('les cinq domaines de la famille passent, avec et sans www', () => {
  for (const o of [
    'https://voyageshalal.fr',
    'https://www.voyageshalal.fr',
    'https://gohalaltravel.com',
    'https://halalcheck.fr',
    'https://islampasapas.fr',
    'https://halalgpt.fr',
  ]) {
    assert.ok(origineAutorisee(o), `${o} devrait passer`);
  }
});

verifie('un site etranger est refuse — la route depense l’argent de Mohamed', () => {
  for (const o of [
    'https://evil.com',
    'https://voyageshalal.fr.evil.com',
    'http://voyageshalal.fr', // http, pas https : pas le meme monde
    'https://sous.voyageshalal.fr',
  ]) {
    assert.equal(origineAutorisee(o), false, `${o} ne devrait PAS passer`);
  }
});

verifie('pas d’en-tete Origin (serveur a serveur, meme site) : autorise', () => {
  assert.ok(origineAutorisee(null));
});

verifie('seuls les quatre sites de la famille sont des appelants connus', () => {
  for (const s of SITES_FAMILLE) assert.ok(estUnSiteConnu(s));
  assert.equal(estUnSiteConnu('halalgpt'), false); // lui a deja /api/chat
  assert.equal(estUnSiteConnu('evil'), false);
  assert.equal(estUnSiteConnu(42), false);
});

// ── 2. Ce que l'assistant a le droit de dire ────────────────────────────────
verifie('chaque site recoit la charte complete dans son prompt', () => {
  for (const s of SITES_FAMILLE) {
    const sys = construireSysteme(s);
    assert.match(sys, /n'inventes JAMAIS/, `${s} : la regle ne-jamais-inventer manque`);
    assert.match(sys, /certifi/, `${s} : la regle des certifications manque`);
    assert.match(sys, /fatwa/, `${s} : la regle des fatwas manque`);
    assert.match(sys, /financier/i, `${s} : le verrou finance manque`);
    assert.match(sys, /Coran/, `${s} : le verrou de recitation manque`);
  }
});

verifie('gohalaltravel repond en anglais, les autres en francais', () => {
  assert.match(construireSysteme('gohalaltravel'), /ANSWER IN ENGLISH/);
  assert.doesNotMatch(construireSysteme('voyageshalal'), /ANSWER IN ENGLISH/);
});

verifie('islampasapas oriente vers un savant — c’est un tuteur, pas un mufti', () => {
  assert.match(construireSysteme('islampasapas'), /savant/);
});

// ── 3. Le bloc contexte : la mecanique de l'honnetete ───────────────────────
verifie('sans contexte, le bloc DIT qu’aucun fait local ne peut etre affirme', () => {
  for (const vide of [undefined, null, [], ['', '  ']]) {
    assert.match(blocContexte(vide), /aucun fait local/);
  }
});

verifie('avec contexte, chaque element devient une ligne, borne a 12', () => {
  const b = blocContexte(['Pizzeria Dar Anas — 200 m — halal partagé par la communauté']);
  assert.match(b, /Dar Anas/);
  assert.match(b, /seule source autorisée/);
  const beaucoup = blocContexte(Array.from({ length: 30 }, (_, i) => `lieu ${i}`));
  assert.equal((beaucoup.match(/^- /gm) ?? []).length, 12, 'au-dela de 12, on coupe');
});

verifie('un contexte non textuel est ignore, pas planté', () => {
  assert.match(blocContexte([42, {}, null]), /aucun fait local/);
});

// ── 4. LE FIL : ce que VoyagesHalal envoie VRAIMENT doit passer ─────────────
//
// Le 15 aout a 3 h 30, la porte acceptait 5 000 caracteres de contexte
// pendant que le relais de VoyagesHalal en envoyait jusqu'a 16 800 (12
// lignes de 1 400 : les avis et les attributs des trois lieux). Resultat
// prevu le jour de l'allumage de la cle Google : 413 ici, « porte muette »
// la-bas, et un widget qui affiche ses adresses sans une seule phrase.
//
// Personne ne l'aurait vu : son cote etait teste, le mien etait teste, le
// FIL entre les deux ne l'etait par personne. Meme faute que la passerelle
// des e-codes le 13 aout. Ce test est le pont.
verifie('le contexte reel du sur mesure passe la porte — 12 lignes de 1 400', () => {
  const fiche = 'Restaurant Le Bosphore — 480 m — 4,6 sur 812 avis — ouvert jusqu’a 23h — '
    + 'signale halal sur Google Maps, a confirmer sur place — avis : « les grillades sont '
    + 'genereuses », « salle petite, beaucoup prennent a emporter », « bonde le vendredi midi » '
    + '— attributs : sur place, a emporter, familles, terrasse, vegetarien disponible.';
  const ligne = fiche.padEnd(1400, ' .');
  const contexte = Array.from({ length: 12 }, () => ligne.slice(0, 1400));
  const taille = JSON.stringify(contexte).length;
  assert.ok(taille > 16_000, `le cas reel doit bien etre gros (mesure : ${taille})`);
  assert.ok(
    taille <= CONTEXTE_MAX,
    `la porte refuserait le sur mesure : ${taille} caracteres pour un plafond de ${CONTEXTE_MAX}`,
  );
  const bloc = blocContexte(contexte);
  assert.equal((bloc.match(/^- /gm) ?? []).length, 12, 'les 12 lignes doivent arriver entieres');
  assert.match(bloc, /Bosphore/);
});

verifie('une ligne demesuree est coupee — un total genereux n’ouvre pas la porte a un pave', () => {
  const pave = 'x'.repeat(9_000);
  const bloc = blocContexte([pave]);
  assert.ok(bloc.length < 2_000, `une seule ligne ne doit pas passer entiere (${bloc.length})`);
});

// ── 5. Ce que l'assistant doit APPORTER, et pas seulement eviter ────────────
verifie('la regle du sur mesure est dans le prompt des deux sites de voyage', () => {
  const fr = construireSysteme('voyageshalal');
  assert.match(fr, /Ne répète JAMAIS/, 'la regle anti-redite manque');
  assert.match(fr, /DISTINGUE/, 'ce qui distingue les lieux manque');
  assert.match(fr, /d’après les avis|d'après les avis/, 'la tracabilite des avis manque');
  assert.match(fr, /alcool/, 'le verrou alcool manque cote redaction');
  const en = construireSysteme('gohalaltravel');
  assert.match(en, /NEVER repeat/, 'la regle anti-redite manque en anglais');
  assert.match(en, /alcohol/, 'le verrou alcool manque en anglais');
});

if (rates) {
  console.log(`\n✗ ${rates} verification(s) en echec.\n`);
  process.exit(1);
}
console.log("\n✓ La porte est fermee aux etrangers, et l'assistant n'affirme que ce qu'on lui donne.\n");
