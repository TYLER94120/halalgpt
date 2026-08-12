// Le compteur de passerelles dit-il la verite sur lui-meme ?
//
// C'est la seule mesure de l'empire qu'un agent peut lire seul, et c'est elle
// qu'on relira le 25 aout pour trancher « est-ce que les passerelles amenent
// quelqu'un ». Si elle ment, on tirera la mauvaise conclusion sans jamais le
// savoir.
//
// LE DEFAUT TROUVE LE 12 AOUT, dans mon propre code : la reponse disait
// `compte: true` meme quand l'ecriture dans la base avait echoue. Le `catch`
// avalait l'erreur — pour ne jamais casser une visite, ce qui est juste — puis
// on repondait « compte » quand meme. Une base mal configuree sur Vercel
// aurait donc renvoye « tout va bien » a chaque visite, sans rien enregistrer.
//
// On teste la VRAIE fonction, pas une copie de sa logique : c'est tout
// l'interet de l'avoir sortie de la route. Une copie ne prouverait que la
// copie — et le jour ou la route change, le test continuerait de passer sur du
// code qui n'existe plus.
//
// Aucune base reelle, aucun reseau, aucune ecriture : trois fausses bases.
//
//   node scripts/test-passerelle.mjs

import { enregistrer, sante, SOURCES_CONNUES } from '../lib/passerelle.ts';

let echecs = 0;
const dire = (ok, quoi, detail = '') => {
  console.log(`${ok ? '✓' : '✗'} ${quoi}${detail ? ` — ${detail}` : ''}`);
  if (!ok) echecs += 1;
};

const JOUR = '2026-08-12';

/** Une base qui marche, et qui note tout ce qu'on lui demande d'ecrire. */
function baseQuiMarche() {
  const ecrites = [];
  return {
    ecrites,
    zincrby: async (cle, n, membre) => ecrites.push([cle, n, membre]),
    expire: async () => 1,
    zcard: async () => new Set(ecrites.map((e) => e[2])).size,
  };
}

/** Une base joignable qui refuse d'ecrire — la panne qui mentait. */
const baseEnPanne = {
  zincrby: async () => { throw new Error('base injoignable'); },
  expire: async () => { throw new Error('base injoignable'); },
  zcard: async () => { throw new Error('base injoignable'); },
};

// ── 1. Le cas normal ─────────────────────────────────────────────────────
console.log('\n── Quand tout marche ─────────────────────────────────────────');
const ok = baseQuiMarche();
let r = await enregistrer(ok, { source: 'halalcheck', campagne: 'scan-e471', page: '/q/e471-halal' }, JOUR);
dire(r.compte === true && r.etat === 'compte', 'une vraie arrivee est comptee', JSON.stringify(r));
dire(ok.ecrites.length === 3, 'trois compteurs ecrits : total, detail, jour', `${ok.ecrites.length}`);
dire(
  ok.ecrites.some(([c]) => c === `halalgpt:passerelles:jour:${JOUR}`),
  'dont le compteur du jour, avec la bonne date',
);

// ── 2. LE DEFAUT DU 12 AOUT ──────────────────────────────────────────────
console.log('\n── Quand la base refuse d\'ecrire ─────────────────────────────');
r = await enregistrer(baseEnPanne, { source: 'halalcheck', campagne: 'scan-e471' }, JOUR);
dire(
  r.compte === false,
  'le compteur ne pretend PAS avoir compte',
  `${JSON.stringify(r)}   (avant le 12 aout : compte:true)`,
);
dire(r.etat === 'echec-base', 'et il dit laquelle des pannes, pour qu\'on la repare', r.etat);
dire(r.ok === true, 'mais la visite n\'est pas cassee pour autant — c\'est la regle');

// ── 3. Pas de base du tout : ce n'est pas la meme panne ──────────────────
console.log('\n── Quand il n\'y a aucune base ────────────────────────────────');
r = await enregistrer(null, { source: 'halalcheck' }, JOUR);
dire(r.etat === 'sans-base', 'une base absente et une base en panne ne se confondent plus', r.etat);
dire(r.compte === false, 'et rien n\'est compte, evidemment');

// ── 4. Une source forgee ne gonfle pas la mesure ─────────────────────────
console.log('\n── Source inconnue : un refus, pas une panne ─────────────────');
const ok2 = baseQuiMarche();
r = await enregistrer(ok2, { source: 'concurrent-qui-gonfle-le-compteur' }, JOUR);
dire(r.etat === 'source-inconnue', 'une source forgee est refusee, et nommee comme telle', r.etat);
dire(ok2.ecrites.length === 0, 'et elle n\'ecrit rien : c\'est la mesure qu\'on protege');

const vus = new Set();
for (const [source, base] of [
  ['halalcheck', baseQuiMarche()],
  ['halalcheck', baseEnPanne],
  ['halalcheck', null],
  ['inconnue', baseQuiMarche()],
]) {
  vus.add((await enregistrer(base, { source }, JOUR)).etat);
}
dire(vus.size === 4, 'les quatre situations portent quatre noms differents', [...vus].join(' · '));

// ── 5. « Es-tu vivant ? » sans rien ecrire ───────────────────────────────
console.log('\n── La question qu\'on ne pouvait pas poser ────────────────────');
const ok3 = baseQuiMarche();
await enregistrer(ok3, { source: 'voyageshalal' }, JOUR);
const avant = ok3.ecrites.length;
let e = await sante(ok3);
dire(e.vivant === true, 'un agent peut demander si le compteur marche', JSON.stringify(e.lecture));
dire(
  ok3.ecrites.length === avant,
  'et cette question n\'ajoute AUCUNE fausse arrivee',
  `${ok3.ecrites.length} ecritures, inchange`,
);

e = await sante(baseQuiMarche());
dire(
  e.vivant === true && e.sources_deja_vues === 0 && /marche/.test(e.lecture),
  'a zero, il dit « je marche et personne n\'est passe » — pas juste « 0 »',
  e.lecture,
);

e = await sante(baseEnPanne);
dire(e.vivant === false && /injoignable/.test(e.pourquoi), 'base en panne : il repond non, et dit laquelle', e.pourquoi);

e = await sante(null);
dire(e.vivant === false && /aucune base/.test(e.pourquoi), 'pas de base : il repond non, et dit laquelle', e.pourquoi);
dire(
  Array.isArray(e.sources_acceptees) && e.sources_acceptees.length === SOURCES_CONNUES.size,
  'et il annonce les sources qu\'il accepte, meme en panne',
  e.sources_acceptees.join(', '),
);

console.log(
  echecs === 0
    ? '\n✓ Le compteur dit ce qui s\'est reellement passe, panne comprise.'
    : `\n✗ ${echecs} echec(s)`,
);
process.exit(echecs === 0 ? 0 : 1);
