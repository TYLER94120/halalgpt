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
// que le site appelant a envoyé sa base entière au lieu de ses quelques
// résultats pertinents — on refuse plutôt que de payer l'erreur.
//
// ⚠️ 15 août, 3 h 30 — LE FIL ENTRE LES DEUX MOITIÉS. Cette limite était à
// 5 000, et elle allait casser le chantier n° 1 de l'empire, en silence.
//
// VoyagesHalal a livré le sur mesure cette nuit : son relais envoie jusqu'à
// 12 lignes de 1 400 caractères — les AVIS et les ATTRIBUTS des trois
// lieux, c'est-à-dire la matière même de ce que l'IA doit écrire (« la
// vraie valeur ajoutée », ordre de Mohamed du 15 août). Soit 16 800
// caractères au maximum, contre 5 000 acceptés ici : la porte aurait
// répondu 413, le relais aurait lu « porte muette », et le widget aurait
// affiché ses adresses SANS UNE SEULE PHRASE. Le sur mesure sans sa prose
// n'est qu'une liste plus courte.
//
// Personne ne l'aurait vu avant l'allumage de la clé Google : son côté est
// testé, le mien est testé, le FIL ENTRE LES DEUX ne l'était par personne.
// Même défaut que la passerelle des e-codes le 13 août — deux moitiés
// vertes, un pont rompu.
//
// 20 000 laisse de la marge au-dessus de 16 800 sans ouvrir la porte à une
// base entière. Le coût suit : environ 4 500 jetons d'entrée par appel sur
// le modèle rapide, tenus par le quota horaire et le plafond du jour.
export const CONTEXTE_MAX = 20_000;
// Un total généreux ne doit pas autoriser UNE ligne démesurée : même borne
// que celle du relais de VoyagesHalal, tenue des deux côtés du fil.
export const LIGNE_MAX = 1_500;
export const LIGNES_MAX = 12;
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

// ─── Le sur mesure : ce qui sépare une phrase utile d'un remplissage ─────────
//
// Ordre de Mohamed, 15 août, § 3 : « INTERDIT ABSOLU : répéter ce qui est
// déjà affiché. Si l'IA écrit "à 4 minutes, noté 4,6", elle ne sert à rien —
// c'est écrit juste au-dessus. » Le widget montre déjà la note, la distance,
// le prix et les horaires. La valeur de l'assistant est ailleurs : dans ce
// que les avis racontent et que les chiffres taisent.
//
// Cette consigne vit ICI et pas seulement dans le widget : c'est la porte
// qui rédige, donc c'est la porte qui doit connaître la règle.

const SUR_MESURE = `TA VALEUR AJOUTÉE — lis bien, c'est ce qui distingue une phrase utile d'un remplissage :
- Ne répète JAMAIS ce que la fiche affiche déjà (note, distance, prix, horaires). Le visiteur les a sous les yeux : les redire ne sert à rien.
- Apporte ce que les chiffres ne disent pas, et uniquement depuis le contexte : le plat que les avis citent, l'ambiance (calme, bruyant, petite salle), le piège qui évite un déplacement raté (« bondé le midi d'après les avis », « salle minuscule, beaucoup prennent à emporter »), le service (rapide, à emporter, familles).
- Dis ce qui DISTINGUE les lieux entre eux : « le premier si tu veux manger vite, le deuxième si tu veux t'asseoir ». Sans cela, trois fiches ne sont qu'une liste plus courte.
- Relie à SA demande : s'il a dit qu'il sortait de la salle de sport ou qu'il était en famille, ta phrase doit s'en souvenir.
- Parle en TEMPS, pas en mètres : « à six minutes à pied » parle, « 1,4 km » ne dit rien à quelqu'un qui a faim.
- Quand une information vient des avis, dis-le : « d'après les avis ». Quand elle manque, dis qu'elle manque — rassurer à tort est pire que se taire.
- Deux à quatre phrases par lieu. Concret, jamais du remplissage.
- Ne recommande JAMAIS un endroit qui sert de l'alcool, et ne minimise jamais : pas de « prends juste le plat ». Tu signales, tu n'arbitres pas.
- Sur une allergie : tu ne garantis rien, jamais. Tu invites à la signaler à l'établissement.`;

const SUR_MESURE_EN = `YOUR ADDED VALUE — this is what separates a useful sentence from filler:
- NEVER repeat what the card already shows (rating, distance, price, hours). The visitor can see them.
- Add what numbers don't say, strictly from the context: the dish reviews mention, the atmosphere, the pitfall that avoids a wasted trip, the service (quick, takeaway, families).
- Say what SETS THE PLACES APART: "the first one if you want to eat fast, the second if you want to sit down."
- Tie it to THEIR request (gym, family, budget) when they told you.
- Speak in TIME, not metres: "six minutes on foot", never "1.4 km".
- When something comes from reviews, say "according to reviews". When information is missing, say so — false reassurance is worse than silence.
- Two to four sentences per place. Concrete, never filler.
- NEVER recommend a place serving alcohol, and never downplay it. You flag, you don't rule.
- On allergies: never guarantee anything. Invite them to tell the venue.`;

const PAR_SITE: Record<SiteFamille, string> = {
  voyageshalal: `Le visiteur est sur voyageshalal.fr, le guide du voyage halal (restaurants, salles de prière, hôtels, guides de villes). Le contexte contient les lieux que le site a trouvés pour lui — vérifiés par la communauté ou signalés sur Google Maps, leur statut est indiqué, avec leurs avis et leurs attributs.

${SUR_MESURE}`,
  gohalaltravel: `The visitor is on gohalaltravel.com, the halal travel guide. ANSWER IN ENGLISH. The context contains the places the site found for them — community-verified or flagged on Google Maps, status included, with reviews and attributes.

${SUR_MESURE_EN}`,
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
    .slice(0, LIGNES_MAX)
    // Une ligne bornée ici comme chez l'appelant : le total généreux ne doit
    // pas laisser passer un pavé unique.
    .map((c) => `- ${c.trim().slice(0, LIGNE_MAX)}`);
  if (!lignes.length) return 'CONTEXTE : (vide — aucun fait local ne peut être affirmé)';
  return `CONTEXTE (fourni par le site, seule source autorisée pour les faits locaux) :\n${lignes.join('\n')}`;
}
