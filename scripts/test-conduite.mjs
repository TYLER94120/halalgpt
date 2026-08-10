// Le mode conduite doit répondre MÊME quand la dictée ne marche pas.
//
// Ce que ce test a trouvé, et qui a changé la conception : dans un vrai
// navigateur, l'objet `webkitSpeechRecognition` EXISTE et la dictée échoue
// quand même. C'est exactement ce qui arrive à Mohamed sur iPhone — l'objet est
// présent, et la dictée rend « aborted ».
//
// La détection est donc un instrument, et cet instrument ment. On ne peut pas
// lui confier le choix d'afficher ou non la seule chose qui marche partout :
// le clavier est là dès le départ, et ce test le verrouille.
//
//   BASE=http://127.0.0.1:3312 node scripts/test-conduite.mjs
//
// playwright n'est pas une dépendance du projet (il déclencherait le
// téléchargement des navigateurs à chaque construction Vercel) :
//   npm i -D playwright   puis on le retire.

import { chromium } from 'playwright';

const BASE = process.env.BASE ?? 'http://127.0.0.1:3312';

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
  await page.goto(`${BASE}/conduite`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);

  // L'objet de dictée existe ici, et pourtant elle n'y marche pas. Il ne prouve
  // donc rien, et le clavier ne doit surtout pas en dépendre.
  const objetPresent = await page.evaluate(() =>
    Boolean(window.SpeechRecognition || window.webkitSpeechRecognition),
  );
  console.log(`   (l'objet de dictée est présent : ${objetPresent} — et il ne prouve rien)`);

  dire(
    (await page.locator('.conduite-clavier input').count()) === 1,
    'le clavier est là DÈS LE DÉPART, quoi que dise la détection',
  );
  dire(
    (await page.locator('.conduite-bouton').count()) === 1,
    'le gros bouton reste la fonction principale',
  );

  // Une question posée au clavier doit aboutir à une réponse affichée.
  await page.fill('.conduite-clavier input', 'Le E120 est-il halal ?');
  await page.click('.conduite-clavier button');
  try {
    await page.waitForFunction(
      () => (document.querySelector('.conduite-reponse')?.textContent ?? '').includes('cochenille'),
      { timeout: 15000 },
    );
    const reponse = await page.locator('.conduite-reponse').innerText();
    dire(true, 'la réponse arrive à l’écran', reponse.replace(/\s+/g, ' ').slice(0, 55));
  } catch {
    dire(false, 'la réponse arrive à l’écran', 'rien affiché');
  }

  const question = await page.locator('.conduite-question').innerText().catch(() => '');
  dire(question.includes('E120'), 'la question posée reste visible', question.slice(0, 40));
} finally {
  await navigateur.close();
}

console.log(
  echecs === 0
    ? '\n✓ Le mode conduite répond même sans dictée.'
    : `\n✗ ${echecs} échec(s)`,
);
process.exit(echecs === 0 ? 0 : 1);
