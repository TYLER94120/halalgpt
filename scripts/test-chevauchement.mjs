// Deux textes ne doivent jamais se chevaucher.
//
// Mohamed, 16h35, capture à l'appui : sur la fiche « Les escargots sont-ils
// halal ? », la pastille de verdict recouvrait la ligne « Mis à jour le 6 août
// 2026 ».
//
// POURQUOI CE TEST EXISTE, ET PAS SEULEMENT LA CORRECTION
//
// La ronde des sites ne pouvait PAS trouver ça. Elle lit le texte servi —
// titres, descriptions, H1, données structurées — et tout était parfaitement
// correct sur cette page. Le défaut n'était pas dans le contenu, il était dans
// la POSITION des éléments à l'écran. Un robot qui lit du HTML ne voit pas
// deux blocs qui se marchent dessus ; il faut un vrai navigateur qui calcule
// la mise en page.
//
// Et le défaut ne concernait pas une fiche : mesuré sur cinq, il était sur les
// cinq. Donc sur les 189. Mohamed en avait vu une.
//
//   node scripts/test-chevauchement.mjs            (serveur attendu sur :3288)
//   BASE=http://localhost:3000 node scripts/test-chevauchement.mjs
//
// playwright n'est pas une dépendance du projet (il déclencherait le
// téléchargement des navigateurs à chaque construction Vercel) :
//   npm i -D playwright   puis on le retire.

import { chromium } from 'playwright';

const BASE = process.env.BASE ?? 'http://127.0.0.1:3288';

// Des fiches aux verdicts de longueurs différentes : c'est la longueur du
// verdict qui décide si la pastille tient sur une ligne ou deux, et donc où
// tombe ce qui suit. Une seule fiche ne prouverait rien.
const FICHES = [
  'escargots-halal',
  'e120-halal',
  'haribo-halal',
  'gelatine-halal',
  'mcdo-halal',
  'ramadan-voyage-jeune',
  'serrer-la-main-islam',
];

// Les blocs de tête, dans l'ordre où ils apparaissent. Chacun doit finir avant
// que le suivant commence.
const SUITE = ['.breadcrumb', 'h1', '.verdict-badge', '.article-date', '.article-lead'];

const navigateur = await chromium.launch({
  executablePath: process.env.CHROMIUM ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
});
const page = await navigateur.newPage({ viewport: { width: 390, height: 780 } });

let echecs = 0;

try {
  for (const slug of FICHES) {
    await page.goto(`${BASE}/q/${slug}`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(200);

    const boites = await page.evaluate((selecteurs) => {
      const out = [];
      for (const s of selecteurs) {
        const el = document.querySelector(s);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.height === 0) continue;
        out.push({ s, haut: Math.round(r.top), bas: Math.round(r.bottom) });
      }
      return out;
    }, SUITE);

    const soucis = [];
    for (let i = 0; i < boites.length - 1; i += 1) {
      const ecart = boites[i + 1].haut - boites[i].bas;
      if (ecart < 0) {
        soucis.push(`${boites[i].s} recouvre ${boites[i + 1].s} de ${-ecart}px`);
      }
    }

    if (soucis.length) {
      echecs += 1;
      console.error(`✗ ${slug}`);
      for (const s of soucis) console.error(`    ${s}`);
    } else {
      console.log(`✓ ${slug} — ${boites.length} blocs, aucun ne se marche dessus`);
    }
  }
} finally {
  await navigateur.close();
}

console.log(
  echecs === 0
    ? '\n✓ Aucun chevauchement sur les fiches testées.'
    : `\n✗ ${echecs} fiche(s) avec des blocs qui se chevauchent`,
);
process.exit(echecs === 0 ? 0 : 1);
