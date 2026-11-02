// Ou est le navigateur de l'atelier ? Et que faire quand il n'y est pas.
//
//     import { ouvrirNavigateur } from './navigateur.mjs';
//     const navigateur = await ouvrirNavigateur();
//
// POURQUOI CE FICHIER EXISTE
//
// Le 2 novembre, les cinq tests navigateur ont refuse de demarrer. Deux causes
// empilees, et aucune n'etait un defaut du site :
//
//   1. `import { chromium } from 'playwright'` — introuvable. Playwright n'est
//      volontairement PAS une dependance du projet (l'installer cote Vercel
//      ferait telecharger les navigateurs a chaque construction), il vit dans
//      l'atelier a `/opt/node-tools/node_modules`. Un import ESM ne cherche que
//      dans les `node_modules` au-dessus du fichier : il ne l'y trouve jamais.
//   2. Le chemin du navigateur etait fige a
//      `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`. Le conteneur sert
//      maintenant chromium-1243, et dans `chrome-linux64` — le numero de
//      version ET le nom du dossier interne avaient bouge.
//
// Le plus instructif est ce qui etait ecrit juste au-dessus de la ligne
// fautive : « sans ce chemin explicite, le test ne demarre pas et on croirait
// a tort que le site est en cause ». L'avertissement etait juste. La ligne
// qu'il protegeait figeait un numero de version, c'est-a-dire s'ecrivait a
// elle-meme une date de peremption. **Un commentaire n'est pas un garde-fou**
// (lecon du 18 octobre, re-apprise ici).
//
// DEUX REGLES, et la seconde compte autant que la premiere.
//
//   1. On CHERCHE, on ne suppose pas. Le lien stable `/opt/pw-browsers/chromium`
//      d'abord — c'est celui que documente l'environnement —, puis n'importe
//      quelle version presente, quel que soit le nom du dossier interne.
//   2. Si rien n'est trouve, la mesure est IMPOSSIBLE : code **2**, jamais 1.
//      C'est la lecon du 17 octobre sur `test-dns.mjs` : trois etats, pas deux.
//      Un outil absent qui se declare « site casse » envoie reparer ce qui
//      n'est pas abime — et c'est exactement ce qui a failli arriver ce soir,
//      ou j'allais rapporter « test-navigation echoue ».

import { existsSync, readdirSync, statSync } from 'node:fs';

// `PW_RACINE` n'existe que pour EXERCER le chemin du code 2 : sans elle, on ne
// peut pas verifier qu'un navigateur absent sort en 2 et non en 1, et un etat
// qu'on ne teste pas est un etat qu'on croit sur parole. Meme raison que le
// stub `curl` de `test-dns.mjs`.
const RACINE = process.env.PW_RACINE ?? '/opt/pw-browsers';
const STABLE = `${RACINE}/chromium`;
const NOMS = ['chrome', 'chrome-headless-shell'];

/** Le module playwright, ou null. Il vit hors du projet : voir cause 1. */
async function chargerPlaywright() {
  for (const ou of ['playwright', '/opt/node-tools/node_modules/playwright/index.js']) {
    try {
      const m = await import(ou);
      const chromium = m.chromium ?? m.default?.chromium;
      if (chromium) return { chromium, ou };
    } catch {
      // Absent a cet endroit : on essaie le suivant.
    }
  }
  return null;
}

/**
 * Les binaires possibles, du plus sûr au plus improvise. On descend d'un seul
 * niveau dans chaque dossier de version au lieu de deviner son nom : c'est
 * precisement le renommage `chrome-linux` → `chrome-linux64` qui a casse les
 * cinq tests.
 */
function candidats() {
  const liste = [];
  if (process.env.CHROMIUM) liste.push(process.env.CHROMIUM);
  liste.push(STABLE);
  try {
    for (const version of readdirSync(RACINE)) {
      if (!version.startsWith('chromium')) continue;
      const dossier = `${RACINE}/${version}`;
      let interieur = [];
      try {
        interieur = readdirSync(dossier).filter((d) => statSync(`${dossier}/${d}`).isDirectory());
      } catch {
        continue;
      }
      for (const d of interieur) for (const nom of NOMS) liste.push(`${dossier}/${d}/${nom}`);
    }
  } catch {
    // `/opt/pw-browsers` n'existe pas : rien a ajouter, le code 2 dira pourquoi.
  }
  return [...new Set(liste)];
}

/** Sort en code 2 — mesure impossible — en expliquant ce qui manque. */
function impossible(quoi, lignes) {
  console.error(`\n⚠ MESURE IMPOSSIBLE — ${quoi}`);
  for (const l of lignes) console.error(`  ${l}`);
  console.error('  Rien n\'a ete mesure : ce n\'est PAS un defaut du site.\n');
  process.exit(2);
}

/**
 * Lance le navigateur de l'atelier, ou sort en code 2.
 * Les options sont passees telles quelles a `chromium.launch`.
 */
export async function ouvrirNavigateur(options = {}) {
  const pw = await chargerPlaywright();
  if (!pw) {
    impossible('playwright introuvable.', [
      'Il n\'est pas une dependance du projet, par choix : voir l\'en-tete.',
      'Cherche : « playwright », puis /opt/node-tools/node_modules/playwright/index.js',
    ]);
  }

  const tous = candidats();
  const binaire = tous.find((p) => existsSync(p));
  if (!binaire) {
    impossible('aucun navigateur trouve.', [
      'Cherche :', ...tous.map((p) => `  ${p}`),
      'Donner le chemin avec CHROMIUM=/chemin/vers/chrome',
    ]);
  }

  // On annonce le binaire des qu'il n'est pas le lien stable : un test qui
  // tourne sur une version trouvee au hasard doit le dire dans son journal.
  if (binaire !== STABLE) console.log(`(navigateur : ${binaire})`);

  return pw.chromium.launch({ executablePath: binaire, ...options });
}
