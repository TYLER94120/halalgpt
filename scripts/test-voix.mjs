// Ce que la voix de synthèse a le droit de dire, et ce qu'elle n'a pas le
// droit de dire.
//
// Le test le plus important de ce fichier n'est pas technique : AUCUNE VOIX DE
// SYNTHÈSE NE RÉCITE LE CORAN. Une machine qui psalmodie un verset avec un
// accent approximatif, dans une voiture, est exactement ce qu'on refuse de
// fabriquer. Ce test est là pour que personne ne puisse le casser par
// inadvertance en « améliorant » le nettoyage du texte.
//
//   node scripts/test-voix.mjs

// Le site et ce test importent EXACTEMENT le même fichier. C'est tout
// l'intérêt de l'avoir écrit en JS : ce qui est testé est ce qui tourne, sans
// compilateur entre les deux.
import {
  contientArabe,
  retirerArabe,
  nettoyerPourLaVoix,
  morceaux,
  aDireMaintenant,
  meilleureVoix,
} from '../lib/voix.js';

let passes = 0;
const echecs = [];

function verifier(nom, condition, detail = '') {
  if (condition) {
    passes += 1;
  } else {
    echecs.push(`${nom}${detail ? ` — ${detail}` : ''}`);
  }
}

// ─── LA RÈGLE QUI NE SE DISCUTE PAS ──────────────────────────────────────────

const VERSET = 'Allah dit : « بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ » — au nom de Dieu.';
const apres = retirerArabe(VERSET);

verifier('un verset est détecté', contientArabe(VERSET));
verifier(
  "l'arabe ne part JAMAIS à la voix",
  !contientArabe(apres.texte),
  `il reste : ${JSON.stringify(apres.texte)}`,
);
verifier('on signale qu\'on a retiré quelque chose', apres.retire === true);
verifier(
  'le français autour est conservé',
  apres.texte.includes('Allah dit') && apres.texte.includes('au nom de Dieu'),
  JSON.stringify(apres.texte),
);

// Un texte entièrement arabe ne doit rien laisser de prononçable.
const TOUT_ARABE = 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ';
verifier(
  'un passage entièrement arabe ne laisse rien à dire',
  morceaux(retirerArabe(TOUT_ARABE).texte).length === 0,
);

// Le flux complet : ce qui sort de aDireMaintenant ne doit jamais contenir
// d'arabe, quel que soit le découpage.
const flux = aDireMaintenant(VERSET, 0, true);
verifier(
  "aucun morceau prononcé ne contient d'arabe",
  flux.morceaux.every((m) => !contientArabe(m)),
  JSON.stringify(flux.morceaux),
);
verifier('le flux prévient qu\'il y avait de l\'arabe', flux.arabeRetire === true);

// ─── Mise en forme écrite qui n'a pas de sens à l'oral ───────────────────────

verifier(
  'le gras ne se dit pas « astérisque »',
  nettoyerPourLaVoix('**Majorité** : non') === 'Majorité : non',
  JSON.stringify(nettoyerPourLaVoix('**Majorité** : non')),
);
verifier(
  'les emojis ne sont pas prononcés',
  !/[\u{1F300}-\u{1FAFF}]/u.test(nettoyerPourLaVoix('⚠️ Attention 🕌 à la prière')),
);
verifier(
  "le libellé d'un lien est gardé, pas l'adresse",
  nettoyerPourLaVoix('Voir [la fiche E120](https://halalgpt.fr/q/e120-halal)') ===
    'Voir la fiche E120',
  JSON.stringify(nettoyerPourLaVoix('Voir [la fiche E120](https://halalgpt.fr/q/e120-halal)')),
);
verifier(
  'une adresse nue ne se dit pas',
  !nettoyerPourLaVoix('Va sur https://halalgpt.fr/q/e120 maintenant').includes('http'),
);
verifier(
  'les puces disparaissent',
  nettoyerPourLaVoix('- premier\n- second') === 'premier\nsecond',
  JSON.stringify(nettoyerPourLaVoix('- premier\n- second')),
);

// ─── Le flux : on parle avant la fin, mais jamais au milieu d'un mot ─────────

const DEBUT = 'Le E120 vient de la cochenille. C’est un insec';
const r1 = aDireMaintenant(DEBUT, 0);
verifier(
  'une phrase terminée part tout de suite',
  r1.morceaux.length === 1 && r1.morceaux[0].startsWith('Le E120'),
  JSON.stringify(r1.morceaux),
);
verifier('le mot coupé attend la suite', !JSON.stringify(r1.morceaux).includes('insec'));

const SUITE = 'Le E120 vient de la cochenille. C’est un insecte, donc la majorité l’évite.';
const r2 = aDireMaintenant(SUITE, r1.lu, true);
verifier(
  'la suite est dite une seule fois, sans répéter le début',
  r2.morceaux.length === 1 && r2.morceaux[0].includes('insecte') && !r2.morceaux[0].includes('cochenille'),
  JSON.stringify(r2.morceaux),
);

const r3 = aDireMaintenant(SUITE, r2.lu, true);
verifier('rien à redire quand tout a été dit', r3.morceaux.length === 0);

verifier('un texte vide ne fait rien dire', aDireMaintenant('', 0, true).morceaux.length === 0);
verifier(
  'du texte sans ponctuation attend, sauf à la fin',
  aDireMaintenant('bonjour comment vas tu', 0).morceaux.length === 0 &&
    aDireMaintenant('bonjour comment vas tu', 0, true).morceaux.length === 1,
);


// ─── Le choix de la voix ─────────────────────────────────────────────────────
//
// Jusqu'au 14 août, on prenait la PREMIÈRE voix française de la liste — sur
// beaucoup d'appareils, la plus robotique. Ces cas reproduisent de vraies
// listes de plateformes ; si quelqu'un « simplifie » le classement, ils
// casseront avant le téléphone de Mohamed.

const android = [
  { name: 'English United States', lang: 'en-US', localService: true, voiceURI: 'en' },
  { name: 'French France eSpeak', lang: 'fr-FR', localService: true, voiceURI: 'espeak-fr' },
  { name: 'Google français', lang: 'fr-FR', localService: false, voiceURI: 'google-fr' },
];
verifier(
  'Android : « Google français » bat la voix eSpeak, même placée après',
  meilleureVoix(android)?.voiceURI === 'google-fr',
);

const iphone = [
  { name: 'Thomas', lang: 'fr-FR', localService: true, voiceURI: 'thomas' },
  { name: 'Audrey (Enhanced)', lang: 'fr-FR', localService: true, voiceURI: 'audrey-e' },
  { name: 'Amélie', lang: 'fr-CA', localService: true, voiceURI: 'amelie' },
];
verifier(
  'iPhone : la voix « Enhanced » bat la voix standard',
  meilleureVoix(iphone)?.voiceURI === 'audrey-e',
);

verifier(
  'le choix mémorisé de la personne gagne sur la note',
  meilleureVoix(iphone, 'thomas')?.voiceURI === 'thomas',
);
verifier(
  'un choix mémorisé qui n’existe plus (voix désinstallée) rend la meilleure',
  meilleureVoix(iphone, 'voix-disparue')?.voiceURI === 'audrey-e',
);
verifier(
  'fr_CA avec tiret bas est bien reconnu comme du français',
  meilleureVoix([{ name: 'X', lang: 'fr_CA', voiceURI: 'x' }])?.voiceURI === 'x',
);
verifier(
  'aucune voix française : on rend la première plutôt que le silence',
  meilleureVoix([{ name: 'English', lang: 'en-US', voiceURI: 'en' }])?.voiceURI === 'en',
);
verifier('aucune voix du tout : null, sans exploser', meilleureVoix([]) === null);

// ─── Résultat ────────────────────────────────────────────────────────────────

console.log(`${passes} sur ${passes + echecs.length} — ${echecs.length} raté(s)`);
if (echecs.length) {
  console.error('\n✗ Échecs :');
  for (const e of echecs) console.error(`  - ${e}`);
  process.exit(1);
}
console.log('\n✓ Aucune voix de synthèse ne récitera le Coran.');
