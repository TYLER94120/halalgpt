// La réponse doit survivre à un changement de page.
//
// Bug signalé par Mohamed : « j'ai posé une question, j'ai changé de page, je
// suis revenu — la question est restée, mais la réponse n'a pas continué à
// tourner. »
//
// Ce test reproduit exactement ça, dans un vrai navigateur : on ralentit la
// réponse artificiellement, on quitte la page PENDANT qu'elle arrive, on
// revient, et on vérifie que la réponse est là. Sans la correction (le flux
// déplacé hors du composant, dans lib/conversation.ts), on ne retrouve que la
// question.
//
//   node scripts/test-navigation.mjs            (serveur attendu sur :3123)
//   BASE=http://localhost:3000 node scripts/test-navigation.mjs

// playwright n'est PAS une dépendance du projet : l'installer côté Vercel
// déclencherait le téléchargement des navigateurs à chaque construction. Pour
// lancer ce test :  npm i -D playwright  (puis on le retire).
import { chromium } from 'playwright';

const BASE = process.env.BASE ?? 'http://127.0.0.1:3123';
const REPONSE = 'Le E120 vient de la cochenille, un insecte. La majorité des certificateurs le refusent.';

let echecs = 0;
const dire = (ok, quoi, detail = '') => {
  console.log(`${ok ? '✓' : '✗'} ${quoi}${detail ? ` — ${detail}` : ''}`);
  if (!ok) echecs += 1;
};

// Le navigateur pré-installé de l'atelier. La version de playwright installée
// ici en cherche un autre : sans ce chemin explicite, le test ne démarre pas
// et on croirait à tort que le site est en cause.
const navigateur = await chromium.launch({
  executablePath: process.env.CHROMIUM ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
});
const page = await navigateur.newPage({ viewport: { width: 390, height: 780 } });

// On ralentit la réponse de 2,5 s : c'est ce délai qui rend le bug
// reproductible. Avec une réponse instantanée, on ne testerait rien.
await page.route('**/api/chat', async (route) => {
  await new Promise((r) => setTimeout(r, 2500));
  await route.fulfill({
    status: 200,
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
    body: REPONSE,
  });
});

try {
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });

  await page.fill('.chat-input', 'Le E120 est-il halal ?');
  await page.press('.chat-input', 'Enter');

  // La question doit s'afficher tout de suite.
  await page.waitForSelector('.bubble.user', { timeout: 5000 });
  dire(true, 'la question apparaît immédiatement');

  // ── On quitte la page PENDANT que la réponse est en route ──
  await page.waitForTimeout(600);
  const reponseAvant = await page.locator('.bubble.assistant:not(.typing)').count();
  dire(reponseAvant === 0, 'la réponse n’est pas encore arrivée quand on quitte');

  // On CLIQUE un lien interne : c'est ce que fait Mohamed sur son téléphone,
  // et c'est une navigation côté navigateur, sans rechargement. Un
  // page.goto() rechargerait tout et testerait autre chose — c'est d'ailleurs
  // ce que faisait la première version de ce test, et elle m'a fait croire un
  // instant que la correction ne marchait pas.
  await page.locator('.card').first().click();
  await page.waitForURL('**/q/**', { timeout: 5000 });
  dire(true, 'on est parti sur une fiche (navigation interne)');

  await page.goBack();
  await page.waitForSelector('.bubble.user', { timeout: 5000 });
  dire(true, 'au retour, la question est toujours là');

  // ── LE test : la réponse est-elle arrivée malgré le détour ? ──
  let trouvee = false;
  try {
    await page.waitForSelector('.bubble.assistant:not(.typing)', { timeout: 8000 });
    const texte = (await page.locator('.bubble.assistant:not(.typing)').first().innerText()).trim();
    trouvee = texte.includes('cochenille');
    dire(trouvee, 'LA RÉPONSE EST ARRIVÉE malgré le changement de page', texte.slice(0, 60));
  } catch {
    dire(false, 'LA RÉPONSE EST ARRIVÉE malgré le changement de page', 'aucune bulle de réponse');
  }

  // ── Le défilement ne doit plus reprendre la main au lecteur ──
  //
  // La plainte exacte : « j'essayais de descendre pour lire et ça remontait
  // automatiquement ». On reproduit ce geste — descendre pendant qu'on lit —
  // et on vérifie que la page reste où le lecteur l'a mise.
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.fill('.chat-input', 'Le E120 est-il halal ?');
  await page.press('.chat-input', 'Enter');
  await page.waitForSelector('.bubble.assistant:not(.typing)', { timeout: 12000 });
  await page.waitForTimeout(1200); // le placement automatique a eu lieu

  await page.mouse.wheel(0, 400); // geste de lecture explicite
  await page.waitForTimeout(300);
  const avant = await page.evaluate(() => window.scrollY);
  await page.waitForTimeout(2000); // on laisse le temps à un éventuel rappel
  const apres = await page.evaluate(() => window.scrollY);
  dire(
    Math.abs(apres - avant) < 40,
    'la page ne remonte pas toute seule pendant qu’on lit',
    `${Math.round(avant)} → ${Math.round(apres)}`,
  );
} finally {
  await navigateur.close();
}

console.log(echecs === 0 ? '\n✓ Les deux bugs signalés sont corrigés.' : `\n✗ ${echecs} échec(s)`);
process.exit(echecs === 0 ? 0 : 1);
