// La recherche de /questions, dans un vrai navigateur.
//
// `test-recherche.mjs` prouve que le moteur classe bien. Il ne prouve rien du
// tout sur la page : que l'index se telecharge au bon moment, une seule fois,
// et surtout que la recherche continue de marcher quand ce telechargement
// echoue. C'est ici que ca se verifie.
//
// Ce qui compte le plus dans ce fichier, c'est le dernier bloc : reseau coupe.
// Une recherche qui ne marche que sur un bon reseau est une recherche qui
// tombe en panne exactement le jour ou l'on en a besoin, dans le metro, au
// supermarche, une barre de reseau.
//
//   BASE=http://127.0.0.1:3111 node scripts/test-recherche-navigateur.mjs
//
// playwright n'est pas une dependance du projet (il declencherait le
// telechargement des navigateurs a chaque construction Vercel) :
//   npm i -D playwright   puis on le retire.

import { chromium } from 'playwright';

const BASE = process.env.BASE ?? 'http://127.0.0.1:3111';

let echecs = 0;
const dire = (ok, quoi, detail = '') => {
  console.log(`${ok ? '✓' : '✗'} ${quoi}${detail ? ` — ${detail}` : ''}`);
  if (!ok) echecs += 1;
};

const navigateur = await chromium.launch({
  executablePath: process.env.CHROMIUM ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
});

/**
 * Ouvre /questions, en comptant les DEMANDES d'index — pas les reponses.
 *
 * La difference n'est pas un detail : quand on coupe le reseau, aucune reponse
 * n'arrive jamais, quoi que fasse la page. Compter les reponses ferait passer
 * pour sage un composant qui reessaie a chaque lettre tapee. C'est la demande
 * qui dit la verite.
 */
async function ouvrir({ casserIndex = false } = {}) {
  const page = await navigateur.newPage({ viewport: { width: 390, height: 780 } });
  const demandes = [];
  let poidsPage = 0;
  page.on('request', (r) => {
    if (r.url().includes('/api/recherche')) demandes.push(r.url());
  });
  page.on('response', async (r) => {
    if (r.url().includes('/api/recherche')) return;
    try {
      poidsPage += (await r.body()).length;
    } catch {}
  });
  if (casserIndex) await page.route('**/api/recherche', (route) => route.abort('failed'));
  await page.goto(`${BASE}/questions`, { waitUntil: 'networkidle' });
  return { page, demandes, poids: () => poidsPage };
}

const cartes = (page) =>
  page.$$eval('.cards .card-question', (n) => n.map((x) => x.textContent.trim()));

try {
  // ── 1. Rien ne part tant que personne ne cherche ────────────────────────
  const a = await ouvrir();
  const poidsSansRecherche = a.poids();
  dire(
    a.demandes.length === 0,
    'la page ne telecharge pas l\'index tant qu\'on ne cherche pas',
    `${a.demandes.length} demande(s), page a ${(poidsSansRecherche / 1024).toFixed(0)} ko`,
  );

  // ── 2. Un mot enfoui dans une reponse remonte la bonne fiche ────────────
  await a.page.fill('.recherche-champ', 'cochenille');
  await a.page.waitForResponse((r) => r.url().includes('/api/recherche'), { timeout: 10000 });
  await a.page.waitForTimeout(400);

  const trouvees = await cartes(a.page);
  dire(trouvees.length > 0, '« cochenille » ne renvoie plus « aucune fiche »', `${trouvees.length} fiche(s)`);
  dire(
    /E120/.test(trouvees[0] ?? ''),
    'la fiche DU sujet est la premiere, pas celle qui le mentionne',
    trouvees[0] ?? 'rien',
  );

  const compte = (await a.page.textContent('.recherche-compte')).trim();
  dire(
    compte.startsWith(`${trouvees.length} question`),
    'le compte annonce dit la verite',
    compte,
  );

  // ── 3. Un seul telechargement, meme en tapant vingt lettres ─────────────
  await a.page.fill('.recherche-champ', 'emulsifiant dans le chocolat');
  await a.page.waitForTimeout(600);
  await a.page.fill('.recherche-champ', 'gelatine');
  await a.page.waitForTimeout(600);
  dire(
    a.demandes.length === 1,
    'l\'index ne se telecharge qu\'une fois',
    `${a.demandes.length} demande(s)`,
  );
  await a.page.close();

  // ── 4. L'anneau de mise au point se voit au clavier ─────────────────────
  // Page neuve, et on tabule jusqu'au champ : `:focus-visible` ne s'allume
  // qu'apres une vraie touche. Un `champ.focus()` depuis le script ne
  // l'allumerait pas, et le test passerait ou echouerait pour une raison qui
  // n'a rien a voir avec ce qu'on mesure.
  const c = await ouvrir();
  let atteint = null;
  for (let i = 0; i < 30 && !atteint; i += 1) {
    await c.page.keyboard.press('Tab');
    atteint = await c.page.evaluate(() => {
      const el = document.activeElement;
      if (!el || !el.classList || !el.classList.contains('recherche-champ')) return null;
      const s = getComputedStyle(el);
      return { style: s.outlineStyle, largeur: parseFloat(s.outlineWidth) || 0, couleur: s.outlineColor };
    });
  }
  dire(
    Boolean(atteint) && atteint.largeur >= 2 && atteint.style !== 'none',
    'au clavier, on voit ou l\'on tape',
    atteint ? `outline ${atteint.style} ${atteint.largeur}px ${atteint.couleur}` : 'champ jamais atteint',
  );
  await c.page.close();

  // ── 5. RESEAU COUPE : la recherche vaut ce qu'elle valait avant ─────────
  // C'est le vrai test. Index inaccessible, et pourtant :
  //   · le champ repond
  //   · les fiches dont le TITRE porte le mot sortent
  //   · aucun message d'erreur, aucune page blanche
  const b = await ouvrir({ casserIndex: true });
  await b.page.fill('.recherche-champ', 'gelatine');
  await b.page.waitForTimeout(1200);

  const parTitre = await cartes(b.page);
  dire(parTitre.length > 0, 'index injoignable : la recherche par titre marche encore',
    `${parTitre.length} fiche(s)`);
  dire(
    /[Gg]élatine/.test(parTitre[0] ?? ''),
    'index injoignable : la bonne fiche est toujours en tete',
    parTitre[0] ?? 'rien',
  );

  const texte = await b.page.textContent('body');
  dire(
    !/erreur|Erreur|impossible|Impossible|indisponible/.test(texte),
    'index injoignable : on ne fait peur a personne',
  );

  // Et un mot qui n'existe que dans le corps ne trouve rien — c'est honnete :
  // la page dit « aucune fiche », elle ne ment pas en pretendant chercher
  // partout.
  await b.page.fill('.recherche-champ', 'cochenille');
  await b.page.waitForTimeout(600);
  const rien = await cartes(b.page);
  dire(rien.length === 0, 'index injoignable : elle ne promet pas ce qu\'elle ne peut pas tenir');

  // On a tape deux fois apres l'echec. UNE seule demande doit etre partie —
  // celle du debut. Sur un reseau deja en difficulte, une tentative par lettre
  // tapee serait la pire chose a faire.
  dire(
    b.demandes.length === 1,
    'un echec ne declenche pas de nouvelle tentative a chaque lettre',
    `${b.demandes.length} demande(s) partie(s)`,
  );

  await b.page.close();
} finally {
  await navigateur.close();
}

console.log(
  echecs === 0
    ? '\n✓ La recherche trouve dans les reponses, et tient sans reseau.'
    : `\n✗ ${echecs} echec(s)`,
);
process.exit(echecs === 0 ? 0 : 1);
