// ─── L'assistant de la famille : la partie pure ──────────────────────────────
//
// Ordre de Mohamed, 14 août : « générer de l'IA partout » — tous les sites de
// la famille branchés sur l'API Claude qu'on a mise en place sur halalgpt.fr.
//
// L'architecture tient en une phrase : UNE clé, UNE porte, CHAQUE site
// apporte ses propres données. La clé Anthropic vit sur halalgpt.fr et nulle
// part ailleurs — une clé recopiée dans quatre dépôts finit volée ou
// désynchronisée. Les autres sites appellent `/api/assistant` avec leur nom,
// la question du visiteur, et LEURS données vérifiées (les spots de
// VoyagesHalal, les fiches produit de HalalCheck…). L'IA rédige ; les faits
// viennent d'eux.
//
// Ce fichier est la partie SANS réseau : la liste des sites, qui a le droit
// d'appeler, et ce que l'assistant a le droit de dire. Testable avec Node
// seul (`scripts/test-assistant.mjs`) — la leçon des sept séries qui ne
// tournaient jamais faute de serveur.

export const SITES_FAMILLE = ['voyageshalal', 'gohalaltravel', 'halalcheck', 'islampasapas'] as const;
export type SiteFamille = (typeof SITES_FAMILLE)[number];

// Les origines qui ont le droit d'appeler la porte depuis un navigateur.
// Liste FERMÉE : « * » comme sur /api/etiquette laisserait n'importe quel site
// du monde dépenser la clé de Mohamed.
export const ORIGINES_AUTORISEES = new Set([
  'https://voyageshalal.fr',
  'https://www.voyageshalal.fr',
  'https://gohalaltravel.com',
  'https://www.gohalaltravel.com',
  'https://halalcheck.fr',
  'https://www.halalcheck.fr',
  'https://islampasapas.fr',
  'https://www.islampasapas.fr',
  'https://halalgpt.fr',
]);

/**
 * L'en-tête Origin d'une requête de navigateur, jugé.
 * Pas d'Origin du tout = appel de serveur à serveur ou même site : autorisé —
 * le quota par adresse fait le reste.
 */
export function origineAutorisee(origine: string | null): boolean {
  if (!origine) return true;
  return ORIGINES_AUTORISEES.has(origine);
}

export function estUnSiteConnu(site: unknown): site is SiteFamille {
  return typeof site === 'string' && (SITES_FAMILLE as readonly string[]).includes(site);
}

// Chaque caractère de contexte part dans la requête et coûte. Au-delà, c'est
// que le site appelant a envoyé sa base entière au lieu des 3 à 6 résultats
// pertinents — on refuse plutôt que de payer l'erreur.
export const CONTEXTE_MAX = 5_000;
export const QUESTION_MAX = 600;

// ─── Ce que l'assistant a le droit de dire ───────────────────────────────────
//
// Le SOCLE est la charte de l'empire, et elle pèse DOUBLE sur une IA : une
// voix qui répond avec assurance est crue. Jamais un établissement inventé,
// jamais une certification affirmée sans source, jamais de fatwa. Pour tout
// fait LOCAL (adresses, horaires, équipements), la seule source autorisée est
// le contexte fourni par le site appelant — s'il ne suffit pas, on le DIT.

const SOCLE = `Tu es l'assistant des sites de la famille VoyagesHalal, propulsé par HalalGPT.
Tu réponds en français, chaleureusement, en 2 à 5 phrases — c'est un widget, pas un article.

Règles absolues, sans exception :
- Tu n'inventes JAMAIS un restaurant, un hôtel, une salle de prière, une adresse, un horaire ou un équipement. Pour tout fait de ce genre, ta SEULE source est le bloc CONTEXTE ci-dessous, fourni par le site. S'il est vide ou insuffisant, dis-le honnêtement et oriente vers la page du site qui peut aider.
- Tu n'affirmes JAMAIS qu'un lieu ou un produit est certifié halal si le contexte ne le dit pas explicitement. Tu distingues « vérifié », « partagé par la communauté, à confirmer sur place » et « inconnu ».
- Tu ne délivres JAMAIS de fatwa personnelle : tu présentes les avis répandus et tu orientes vers un savant pour le cas particulier.
- Jamais de conseil financier. Jamais de récitation du Coran.
- Si la question sort du sujet du site, ramène gentiment vers ce que le site sait faire.`;

const PAR_SITE: Record<SiteFamille, string> = {
  voyageshalal: `Le visiteur est sur voyageshalal.fr, le guide du voyage halal (restaurants, salles de prière, hôtels, guides de villes). Le contexte contient des adresses issues de la base du site — communautaires ou vérifiées, leur statut est indiqué. Termine quand c'est utile par la page du site à ouvrir.`,
  gohalaltravel: `The visitor is on gohalaltravel.com, the halal travel guide. ANSWER IN ENGLISH. The context contains places from the site's own database — community-shared or verified, status included. Point to the site page to open when useful.`,
  halalcheck: `Le visiteur est sur halalcheck.fr, le scanner de produits halal. Le contexte contient des données de fiches produit (ingrédients, verdicts du moteur). Tu expliques un verdict ou un ingrédient ; pour scanner, renvoie vers le scanner.`,
  islampasapas: `Le visiteur est sur islampasapas.fr, la plateforme d'apprentissage de l'islam pour débutants. Tu es un tuteur patient : explique simplement, propose la leçon du site qui correspond (dans le contexte), et rappelle qu'un savant reste la référence pour les cas personnels.`,
};

/** Le prompt système complet pour un site de la famille. */
export function construireSysteme(site: SiteFamille): string {
  return `${SOCLE}\n\n${PAR_SITE[site]}`;
}

/**
 * Le bloc CONTEXTE tel qu'il part au modèle. Un tableau d'éléments courts
 * fournis par le site appelant — jamais retouchés, jamais complétés.
 */
export function blocContexte(contexte: unknown): string {
  if (!Array.isArray(contexte) || contexte.length === 0) {
    return 'CONTEXTE : (vide — aucun fait local ne peut être affirmé)';
  }
  const lignes = contexte
    .filter((c): c is string => typeof c === 'string' && c.trim().length > 0)
    .slice(0, 12)
    .map((c) => `- ${c.trim()}`);
  if (!lignes.length) return 'CONTEXTE : (vide — aucun fait local ne peut être affirmé)';
  return `CONTEXTE (fourni par le site, seule source autorisée pour les faits locaux) :\n${lignes.join('\n')}`;
}
