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

if (rates) {
  console.log(`\n✗ ${rates} verification(s) en echec.\n`);
  process.exit(1);
}
console.log("\n✓ La porte est fermee aux etrangers, et l'assistant n'affirme que ce qu'on lui donne.\n");
