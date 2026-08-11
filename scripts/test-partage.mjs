// Ce qui part vraiment quand quelqu'un appuie sur « Envoyer ».
//
// Le plan de la semaine appelle le partage « la seule boucle de croissance
// gratuite du site » — et il ne marchait pas comme annonce. Deux defauts,
// mesures avant d'ecrire une ligne :
//
//   1. Le message envoye ne contenait que la QUESTION : « Le E120 est-il
//      halal ? ». Celui qui la recoit sait deja s'il se la pose, et la plupart
//      ne se la posent pas. Le FAIT — « ce colorant rouge est fait avec un
//      insecte » — etait affiche sur l'accueil, et n'accompagnait jamais le
//      lien.
//   2. La decouverte du jour, seul endroit ou le fait apparait, n'avait aucun
//      bouton pour l'envoyer. Il fallait ouvrir la fiche, puis y trouver la
//      barre de partage : deux gestes pour une envie qui dure trois secondes.
//
//   BASE=http://127.0.0.1:3315 node scripts/test-partage.mjs
//
// playwright n'est pas une dependance du projet (il declencherait le
// telechargement des navigateurs a chaque construction Vercel) :
//   npm i -D playwright   puis on le retire.

import { chromium } from 'playwright';

const BASE = process.env.BASE ?? 'http://127.0.0.1:3315';

let echecs = 0;
const dire = (ok, quoi, detail = '') => {
  console.log(`${ok ? '✓' : '✗'} ${quoi}${detail ? ` — ${detail}` : ''}`);
  if (!ok) echecs += 1;
};

const navigateur = await chromium.launch({
  executablePath: process.env.CHROMIUM ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
});
const page = await navigateur.newPage({ viewport: { width: 390, height: 780 } });

try {
  // ── L'accueil : le fait doit pouvoir partir d'ici ───────────────────────
  await page.goto(BASE, { waitUntil: 'networkidle' });

  const bouton = page.locator('.partager-fait');
  dire((await bouton.count()) === 1, 'la découverte du jour porte un bouton « Envoyer »');

  const affiche = (await page.locator('.decouverte-fait').innerText()).trim();
  const envoye = (await bouton.getAttribute('data-texte')) ?? '';

  dire(
    envoye.includes(affiche),
    'le message envoyé contient le FAIT affiché à l’écran',
    affiche.slice(0, 46),
  );
  dire(
    /https?:\/\/[^\s]+\/q\/[a-z0-9-]+/.test(envoye),
    'il contient le lien vers la fiche qui explique',
    (envoye.match(/https?:\/\/\S+/) ?? [''])[0],
  );
  dire(
    !/undefined|null|\[object/.test(envoye),
    'aucun trou dans le message (undefined, null…)',
  );

  // ── L'accueil doit rester lisible : rien ne se chevauche ────────────────
  // Mohamed, capture du 10 aout : « entrevauch ». Un bouton ajoute a une
  // rangee est exactement la facon de recreer ce defaut.
  const boites = {};
  for (const sel of ['.decouverte-lien', '.partager-fait', '.surprise-bouton:not(.partager-fait)']) {
    boites[sel] = await page.locator(sel).boundingBox();
  }
  const noms = Object.keys(boites);
  let chevauche = '';
  for (let i = 0; i < noms.length; i += 1) {
    for (let j = i + 1; j < noms.length; j += 1) {
      const a = boites[noms[i]];
      const b = boites[noms[j]];
      if (!a || !b) continue;
      const seCroisent =
        a.x < b.x + b.width && b.x < a.x + a.width &&
        a.y < b.y + b.height && b.y < a.y + a.height;
      if (seCroisent) chevauche = `${noms[i]} × ${noms[j]}`;
    }
  }
  dire(!chevauche, 'sur 390 px de large, rien ne se chevauche dans la découverte', chevauche);

  // Deux boîtes qui ne se croisent pas peuvent quand même être illisibles : le
  // TEXTE, lui, déborde de la sienne. C'est ce qui est arrivé au premier essai
  // — « 🎲 Surprends-moi » sortait de sa pastille, la capture le montrait, et
  // ce test-ci disait tout va bien parce qu'il ne regardait que les boîtes.
  const deborde = await page.evaluate(() =>
    [...document.querySelectorAll('.decouverte-actions > *')]
      .filter((e) => e.scrollWidth > e.clientWidth + 1)
      .map((e) => `${e.textContent.trim()} (${e.scrollWidth} > ${e.clientWidth})`),
  );
  dire(deborde.length === 0, 'aucun texte ne déborde de son bouton', deborde.join(' · '));

  const debordement = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  dire(debordement <= 0, 'la page ne déborde pas en largeur', `${debordement} px`);

  // ── Une fiche AVEC un fait : c'est lui qui mène le message ──────────────
  await page.goto(`${BASE}/q/e120-halal`, { waitUntil: 'networkidle' });
  const versWhatsApp = decodeURIComponent(
    ((await page.locator('.share-bar a[href*="wa.me"]').getAttribute('href')) ?? '').split('text=')[1] ?? '',
  );
  dire(
    versWhatsApp.startsWith('Ce colorant rouge est fait avec un insecte.'),
    'sur une fiche qui a un fait, le message COMMENCE par le fait',
    versWhatsApp.split('\n')[0].slice(0, 46),
  );
  dire(
    versWhatsApp.includes('/q/e120-halal'),
    'et il porte le lien de cette fiche-là',
  );

  // ── Une fiche SANS fait : la question reprend sa place, sans trou ───────
  // C'est le risque de ce genre de changement : marcher pour les 30 fiches
  // qui ont un fait, et casser les 163 autres.
  await page.goto(`${BASE}/q/e422-glycerine-halal`, { waitUntil: 'networkidle' });
  const sansFait = decodeURIComponent(
    ((await page.locator('.share-bar a[href*="wa.me"]').getAttribute('href')) ?? '').split('text=')[1] ?? '',
  );
  dire(
    sansFait.startsWith('Le E422 (glycérine) est-il halal ?'),
    'sur une fiche sans fait, la question mène le message comme avant',
    sansFait.split('\n')[0].slice(0, 46),
  );
  dire(
    !/undefined|null/.test(sansFait),
    'et rien n’y est vide',
  );
} finally {
  await navigateur.close();
}

console.log(
  echecs === 0
    ? '\n✓ Le fait voyage avec le lien, et l’accueil reste lisible.'
    : `\n✗ ${echecs} échec(s)`,
);
process.exit(echecs === 0 ? 0 : 1);
