// La passerelle des codes additifs — le fil entre HalalCheck et halalgpt.fr.
//
// Pourquoi ce test existe : le 13 aout 2026, l'audit a mesure que sur les
// 56 liens `/e/<CODE>` publies par halalcheck.fr/additifs.html, 36 tombaient
// sur /categorie/additifs. Le moteur du scanner etait teste, mes fiches
// etaient testees — le fil entre les deux ne l'etait par personne. Les deux
// moities etaient vertes et le pont etait rompu.
//
// Il tourne sans serveur et sans navigateur, volontairement : les sept series
// qui en demandaient un ne tournaient jamais dans le controle automatique.

import assert from 'node:assert/strict';

import { QUESTIONS } from '../lib/questions.ts';
import {
  chercherParCode as chercher,
  codesCouverts as couverts,
  enClair,
  estUnCodePlausible,
  fichesVoisines as voisinesDe,
  normaliser,
} from '../lib/ecodes.ts';

// Le catalogue arrive en argument : on referme dessus une fois pour toutes
// plutot que de le repeter a chaque appel.
const chercherParCode = (code) => chercher(QUESTIONS, code);
const fichesVoisines = (code, n) => voisinesDe(QUESTIONS, code, n);
const codesCouverts = () => couverts(QUESTIONS);

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

console.log('\nLA PASSERELLE DES CODES ADDITIFS\n');

verifie('« E471 », « e471 » et « 471 » designent la meme fiche', () => {
  const a = chercherParCode('E471');
  assert.ok(a, 'E471 devrait avoir une fiche');
  assert.equal(chercherParCode('e471')?.slug, a.slug);
  assert.equal(chercherParCode('471')?.slug, a.slug);
});

verifie('les variantes a lettre retombent sur leur code de base', () => {
  const base = chercherParCode('E472');
  assert.ok(base, 'E472 devrait avoir une fiche');
  for (const v of ['E472a', 'E472b', 'E472c', 'E472d', 'E472e', 'E472f']) {
    assert.equal(chercherParCode(v)?.slug, base.slug, `${v} devrait retomber sur ${base.slug}`);
  }
});

verifie('un slug a plusieurs codes repond aux deux', () => {
  assert.ok(chercherParCode('E627'), 'E627 devrait repondre');
  assert.ok(chercherParCode('E631'), 'E631 devrait repondre');
});

verifie('les codes a quatre chiffres sont acceptes', () => {
  // Le premier comptage de l'audit les avait manques : la recherche employait
  // E[0-9]{3}, qui ne voit pas E1000 ni E1105. Le trou etait dans l'instrument.
  assert.ok(estUnCodePlausible('E1000'), 'E1000 est un code plausible');
  assert.ok(estUnCodePlausible('E1105'), 'E1105 est un code plausible');
});

verifie('ce qui n’a pas la forme d’un code est refuse', () => {
  for (const faux of ['', 'bonjour', 'E12', 'E12345', '../q/e120-halal', 'E4711abc']) {
    assert.equal(estUnCodePlausible(faux), false, `« ${faux} » ne devrait pas passer`);
  }
});

verifie('l’affichage remet le E devant', () => {
  assert.equal(enClair('472e'), 'E472e');
  assert.equal(enClair('e153'), 'E153');
  assert.equal(normaliser('  E-472 e '), '472e');
});

verifie('un code sans fiche recoit quand meme des voisines', () => {
  // C'est tout l'objet du correctif : E470a n'a pas de fiche, mais la page
  // doit avoir de quoi aider plutot que de renvoyer vers une liste.
  for (const orphelin of ['E470a', 'E475', 'E491', 'E921']) {
    assert.equal(chercherParCode(orphelin), undefined, `${orphelin} ne devrait pas avoir de fiche`);
    const v = fichesVoisines(orphelin);
    assert.ok(v.length > 0, `${orphelin} devrait proposer des voisines`);
    assert.ok(v.every((q) => q.category === 'Additifs'), 'les voisines sont des additifs');
  }
});

verifie('les voisines sont vraiment les plus proches par numero', () => {
  const v = fichesVoisines('E470a', 3).map((q) => q.slug);
  assert.ok(
    v.some((s) => s.includes('e471') || s.includes('e466') || s.includes('e476')),
    `attendu un voisin de la centaine 400, recu : ${v.join(', ')}`,
  );
});

verifie('aucune voisine n’est presentee comme la reponse', () => {
  // Garde-fou de la charte : la page ne doit pas emprunter le verdict d'un
  // additif voisin. On verifie que la fonction ne rend jamais le code demande.
  const v = fichesVoisines('E470a');
  assert.ok(!v.some((q) => q.slug.split('-').includes('e470a')), 'E470a n’a pas de fiche a lui');
});

// Le compte, pour qu'il apparaisse dans le journal du controle et qu'on voie
// le trou se refermer nuit apres nuit.
const liste = codesCouverts();
console.log(`\n  ${liste.length} codes additifs couverts par une fiche.`);
console.log(`  ${liste.join(' ')}`);

if (rates > 0) {
  console.log(`\n✗ ${rates} verification(s) en echec.\n`);
  process.exit(1);
}
console.log('\n✓ La passerelle repond, et quand elle ne sait pas, elle le dit.\n');
