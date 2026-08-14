// Les attentes bornées — le contrôle des délais maximum.
//
// POURQUOI CE FICHIER EXISTE. Le 14 août 2026, l'inventaire des attentes du
// site a rendu zéro délai maximum partout. Le plus grave n'était pas
// l'absence, c'était le commentaire qui la couvrait, dans `/api/etiquette` :
//
//     } catch { return false; // Redis indisponible : on ne bloque pas le service }
//
// Un `catch` couvre la panne, pas la LENTEUR. Un Redis qui répond en vingt
// secondes ne lève rien : il fait attendre — et il faisait attendre AVANT que
// la photo d'étiquette parte à l'analyse. Quelqu'un debout dans un rayon
// attendait vingt secondes pour un compteur d'abus facultatif.
//
// Ce fichier tient DEUX choses, et la seconde vaut plus que la première :
//   1. que `avecDelai` rende vraiment la main à l'heure — mesuré, pas supposé ;
//   2. qu'aucun `await redis.` ne puisse échapper au garde-fou demain.
//
// La leçon de la compétence : « un seul appel oublié annule toute la
// protection ». Avoir écrit la fonction ne prouve rien ; ce qui compte est
// qu'aucun appel bloquant ne lui échappe.

import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

import { avecDelai, sansAttendre, DELAI_REDIS, DELAI_MODELE } from '../lib/delai.ts';

let rates = 0;
function verifie(nom, fn) {
  try {
    const r = fn();
    return r instanceof Promise
      ? r.then(() => console.log(`  ✓ ${nom}`), (e) => { rates++; console.log(`  ✗ ${nom}\n      ${e.message}`); })
      : console.log(`  ✓ ${nom}`);
  } catch (e) {
    rates++;
    console.log(`  ✗ ${nom}\n      ${e.message}`);
  }
}

const jamais = () => new Promise(() => {});
const chrono = async (fn) => { const t = Date.now(); const v = await fn(); return [Date.now() - t, v]; };

console.log('\nLES ATTENTES BORNEES\n');

// ── 1. La durée EST le résultat, pas la présence ────────────────────────────
await verifie('une promesse qui ne revient jamais rend la main a l’heure', async () => {
  const [ms, valeur] = await chrono(() => avecDelai(jamais(), 120, 'repli'));
  assert.equal(valeur, 'repli', 'le repli doit etre rendu');
  assert.ok(ms >= 110 && ms < 400, `rendu en ${ms} ms, attendu ~120`);
});

await verifie('une promesse rapide passe sans penalite ni alteration', async () => {
  const [ms, valeur] = await chrono(() => avecDelai(Promise.resolve('vrai'), 5_000, 'repli'));
  assert.equal(valeur, 'vrai');
  assert.ok(ms < 100, `${ms} ms — le delai ne doit pas etre attendu`);
});

await verifie('une promesse qui echoue rend le repli, elle ne propage pas', async () => {
  const v = await avecDelai(Promise.reject(new Error('redis mort')), 500, 'repli');
  assert.equal(v, 'repli');
});

// Le piege que le `finally` evite : sans nettoyage du minuteur, le processus
// resterait vivant jusqu'a son terme. On le verifie par le fait meme que ce
// script se termine — mais aussi explicitement ici.
await verifie('un appel rapide ne laisse pas de minuteur actif', async () => {
  const avant = process._getActiveHandles?.().length ?? 0;
  await avecDelai(Promise.resolve(1), 30_000, 0);
  const apres = process._getActiveHandles?.().length ?? 0;
  assert.ok(apres <= avant, `${avant} -> ${apres} handles : un minuteur de 30 s survit`);
});

await verifie('un rejet tardif ne devient pas un rejet non traite', async () => {
  let rejeter;
  const tardive = new Promise((_, r) => { rejeter = r; });
  const v = await avecDelai(tardive, 50, 'repli');
  assert.equal(v, 'repli');
  rejeter(new Error('trop tard')); // ferait tomber Node sans le catch interne
  await new Promise((r) => setTimeout(r, 30));
});

verifie('sansAttendre avale l’echec sans rien attendre', () => {
  sansAttendre(Promise.reject(new Error('ecriture ratee')));
});

// ── 2. LE contrôle qui compte : aucun appel bloquant n’échappe au garde-fou ──
const ROUTES = 'app/api';
const nus = [];
const proteges = [];
for (const dossier of readdirSync(ROUTES)) {
  const chemin = `${ROUTES}/${dossier}/route.ts`;
  let src;
  try { src = readFileSync(chemin, 'utf8'); } catch { continue; }
  // On raisonne par INSTRUCTION, pas par ligne — deux corrections successives
  // de ce motif, et les deux valent d'etre dites :
  //
  // 1. Chercher « await redis. » rendait zero des deux cotes apres correction,
  //    puisqu'un appel borne s'ecrit desormais `avecDelai(redis.incr(...))`.
  //    Un controle qui ne trouve rien et se declare satisfait.
  // 2. Chercher ligne par ligne accusait six appels parfaitement bornes : ils
  //    etaient enveloppes dans un `avecDelai(Promise.all([...]))` etale sur
  //    quinze lignes, donc chaque ligne paraissait nue.
  //
  // La protection s'applique a l'instruction entiere : c'est donc elle qu'il
  // faut lire.
  const sansCommentaires = src
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .split('\n')
    .map((l) => l.replace(/\/\/.*$/, ''))
    .join('\n');
  let ligne = 1;
  for (const instruction of sansCommentaires.split(';')) {
    const debut = ligne;
    ligne += (instruction.match(/\n/g) || []).length;
    if (!/\bredis\.\w+[<(]/.test(instruction)) continue;
    const borne = /\b(avecDelai|sansAttendre)\s*\(/.test(instruction);
    const extrait = instruction.replace(/\s+/g, ' ').trim().slice(0, 70);
    (borne ? proteges : nus).push(`${chemin}:${debut}  ${extrait}`);
  }
}
verifie('aucun « await redis. » ne contourne avecDelai', () => {
  assert.equal(nus.length, 0,
    'appels bloquants sans delai maximum :\n      ' + nus.join('\n      '));
});

// Un contrôle qui ne trouve rien à contrôler ne prouve rien : on exige que le
// motif ait vu quelque chose. C'est la regle « quand un comptage rend zero,
// soupconne d'abord le comptage ».
verifie('le controle a bien vu des appels Redis (sinon il ne prouve rien)', () => {
  assert.ok(proteges.length > 0, 'aucun appel Redis trouve — le motif de recherche est casse');
});

// ── 3. Les délais sont proportionnés à ce qu’on perd ────────────────────────
verifie('Redis coupe vite, le modele attend longtemps', () => {
  assert.ok(DELAI_REDIS <= 2_000, `${DELAI_REDIS} ms : Redis n’est jamais indispensable`);
  assert.ok(DELAI_MODELE >= 30_000, `${DELAI_MODELE} ms : le modele EST la reponse`);
  assert.ok(DELAI_MODELE < 60_000, `${DELAI_MODELE} ms : doit rester sous maxDuration = 60 s`);
});

verifie('le modele d’etiquette est borne, celui du chat ne l’est pas — et c’est ecrit', () => {
  const et = readFileSync('app/api/etiquette/route.ts', 'utf8');
  assert.match(et, /new Anthropic\(\{[^}]*timeout/, '/api/etiquette doit borner le modele');
  const ch = readFileSync('app/api/chat/route.ts', 'utf8');
  assert.match(ch, /VOLONTAIREMENT SANS DELAI MAXIMUM/,
    '/api/chat diffuse : l’absence de delai doit etre justifiee dans le code, pas subie');
});

if (rates) {
  console.log(`\n✗ ${rates} verification(s) en echec.\n`);
  process.exit(1);
}
console.log(`\n  ${proteges.length} appel(s) Redis borne(s), 0 nu.`);
console.log('\n✓ Aucune attente du serveur n’est sans limite, sauf celle qui est justifiee.\n');
