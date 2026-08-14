// @ts-check
// Préparer un texte pour être DIT à voix haute, pas lu à l'écran.
//
// Pourquoi ce fichier est en JavaScript et pas en TypeScript : le test qui le
// vérifie doit tourner INSTANTANÉMENT, à chaque modification, sans compilateur
// ni dépendance. En JS, le site et le test importent exactement le même
// fichier — donc ce qui est testé est ce qui tourne. La première version
// extrayait les types à coups d'expressions régulières pour pouvoir tester le
// .ts : c'était fragile, et ça a cassé au premier essai. Les types sont en
// JSDoc, TypeScript les lit tout aussi bien.
//
// Ce fichier existe parce que lire un texte de HalalGPT tel quel dans une voix
// de synthèse donne un résultat inutilisable : « astérisque astérisque
// Majorité deux-points ». Un texte écrit et un texte parlé ne sont pas le même
// texte.
//
// ─── LA RÈGLE QUI NE SE DISCUTE PAS ───────────────────────────────────────────
//
// Aucune voix de synthèse ne récite le Coran. C'est une règle posée par
// Mohamed, et elle vaut ici plus qu'ailleurs : une machine qui psalmodie un
// verset avec un accent approximatif, dans une voiture, est exactement ce
// qu'on refuse de fabriquer. Les passages en arabe sont donc RETIRÉS de ce qui
// est prononcé — jamais approximés, jamais translittérés — et l'auditeur est
// prévenu une fois qu'un passage existe et qu'il est à l'écran.
//
// Le texte affiché, lui, garde tout. On enlève à l'oreille, pas à l'œil.

// Arabe, arabe étendu, formes de présentation. Un seul caractère suffit à
// marquer le passage : on ne cherche pas à comprendre, on cherche à s'abstenir.
const ARABE = /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]/u;
const ARABE_SUITE = /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿ً-ٟ\s،؛؟«»"'()\[\]-]+/gu;

/** @type {string} */
export const NOTE_ARABE =
  "Il y a un passage en arabe. Je ne le récite pas avec une voix de synthèse : il est affiché à l’écran.";

/** @param {string} texte @returns {boolean} */
export function contientArabe(texte) {
  return ARABE.test(texte);
}

/**
 * Retire l'arabe. Rend le texte restant et si quelque chose a été retiré.
 * @param {string} texte
 * @returns {{ texte: string, retire: boolean }}
 */
export function retirerArabe(texte) {
  if (!ARABE.test(texte)) return { texte, retire: false };
  // On enlève la suite complète (mots arabes, voyelles, ponctuation arabe et
  // les guillemets qui l'entouraient), sinon il resterait « “ ” : » à dire.
  const nettoye = texte.replace(ARABE_SUITE, ' ').replace(/\s{2,}/g, ' ').trim();
  return { texte: nettoye, retire: true };
}

// Emojis et symboles décoratifs : à l'écran ils aident, à l'oreille ils
// produisent au mieux un silence, au pire un nom de symbole lu en anglais.
const DECOR =
  /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE00}-\u{FE0F}\u{1F1E6}-\u{1F1FF}‍]/gu;

/**
 * Enlève la mise en forme écrite qui n'a aucun sens à l'oral.
 * @param {string} texte @returns {string}
 */
export function nettoyerPourLaVoix(texte) {
  return texte
    .replace(/```[\s\S]*?```/g, ' ')          // blocs de code
    .replace(/`([^`]*)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')    // images
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')  // liens : on garde le libellé
    .replace(/^#{1,6}\s*/gm, '')              // titres
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/^\s*[-–—•]\s+/gm, '')           // puces
    .replace(/^\s*\d+[.)]\s+/gm, '')          // listes numérotées
    .replace(/https?:\/\/\S+/g, ' ')          // une adresse ne se dit pas
    .replace(DECOR, ' ')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{2,}/g, '\n')
    .trim();
}

/**
 * Découpe en morceaux prononçables. Chaque morceau part séparément à la voix :
 * c'est ce qui permet de l'interrompre net, et de commencer à parler avant que
 * la réponse entière soit arrivée.
 */
/** @param {string} texte @returns {string[]} */
export function morceaux(texte) {
  const propre = nettoyerPourLaVoix(texte);
  if (!propre) return [];
  return propre
    .split(/(?<=[.!?…])\s+|\n+/)
    .map((m) => m.trim())
    .filter((m) => /[\p{L}\p{N}]/u.test(m));
}

/**
 * Pendant que la réponse arrive en flux : rend ce qu'on peut DIRE MAINTENANT,
 * c'est-à-dire les phrases terminées, et jusqu'où on a consommé.
 *
 * Pourquoi ne pas tout dire d'un coup à la fin : l'attente. La réponse met
 * plusieurs secondes à s'écrire ; au volant, plusieurs secondes de silence
 * donnent l'impression que ça n'a pas marché, et on rappuie sur le bouton.
 *
 * @param {string} recu
 * @param {number} dejaLu
 * @param {boolean} [fini]
 * @returns {{ morceaux: string[], lu: number, arabeRetire: boolean }}
 */
export function aDireMaintenant(recu, dejaLu, fini = false) {
  const reste = recu.slice(dejaLu);
  if (!reste.trim()) return { morceaux: [], lu: dejaLu, arabeRetire: false };

  /** @type {string} */
  let bloc;
  if (fini) {
    bloc = reste;
  } else {
    // On ne prononce qu'une phrase TERMINÉE : couper au milieu d'un mot
    // s'entend immédiatement, et deux moitiés de phrase séparées par une
    // pause de synthèse ne se recollent pas à l'oreille.
    let dernier = -1;
    for (let i = reste.length - 1; i >= 0; i -= 1) {
      if ('.!?…\n'.includes(reste[i])) {
        dernier = i;
        break;
      }
    }
    if (dernier < 0) return { morceaux: [], lu: dejaLu, arabeRetire: false };
    bloc = reste.slice(0, dernier + 1);
  }

  const { texte, retire } = retirerArabe(bloc);
  return { morceaux: morceaux(texte), lu: dejaLu + bloc.length, arabeRetire: retire };
}

// ─── Choisir la voix, et pas seulement la première ────────────────────────────
//
// Jusqu'au 14 août, le mode conduite prenait la PREMIÈRE voix française de la
// liste. Or l'ordre de cette liste n'est pas un classement de qualité : sur
// beaucoup d'appareils, la première voix française est la plus robotique, et
// les bonnes — « Google français » sur Android, les voix « (Enhanced) » sur
// iPhone, les « Natural » de Edge — sont plus loin dans la liste. Demande de
// Mohamed : une voix qu'on écoute comme une personne, pas comme un GPS.
//
// La note ci-dessous encode ce qu'on sait des plateformes réelles. Elle n'est
// pas une science : c'est pour ça que la personne peut TOUJOURS choisir
// elle-même, et que son choix (voiceURI retenu) gagne sur la note.

/**
 * @param {{ name?: string, lang?: string, localService?: boolean }} v
 * @returns {number} plus c'est haut, plus la voix promet d'être naturelle
 */
function noteVoix(v) {
  const nom = v.name ?? '';
  const langue = (v.lang ?? '').toLowerCase().replace('_', '-');
  let note = 0;
  if (langue.startsWith('fr-fr')) note += 4; // l'accent attendu en France
  if (/natural/i.test(nom)) note += 8;      // Edge « Online (Natural) » : les meilleures du navigateur
  if (/google/i.test(nom)) note += 6;       // Android : « Google français » écrase les voix locales
  if (/siri/i.test(nom)) note += 6;         // iOS récent expose parfois les voix Siri
  if (/enhanced|premium|am[ée]lior/i.test(nom)) note += 5; // iOS : « Audrey (Enhanced) »…
  if (/espeak/i.test(nom)) note -= 6;       // la voix « robot » par excellence
  if (v.localService) note += 1;            // à qualité égale, le local répond plus vite
  return note;
}

/**
 * La voix à utiliser sur CET appareil.
 *
 * Le choix explicite de la personne (`preferee`, un voiceURI mémorisé) gagne
 * toujours — s'il désigne une voix encore installée. Sinon on prend la
 * francophone la mieux notée. Et s'il n'y a AUCUNE voix française : on rend
 * null, on ne force RIEN.
 *
 * La première version rendait « la première voix quelle qu'elle soit, plutôt
 * que le silence ». C'était faux deux fois. D'abord il n'y a pas de silence :
 * une utterance sans `voice` mais avec `lang = fr-FR` laisse le moteur choisir
 * sa voix française par défaut. Ensuite forcer `voice` GAGNE sur `lang` — et
 * quand la liste des voix arrive en retard (le cas normal au premier
 * chargement), ce repli imposait une voix anglaise sur du texte français.
 * Constat de Mohamed au volant, 14 août : « le robot a un accent
 * australien ».
 *
 * Générique : on rend UN ÉLÉMENT du tableau reçu, jamais un objet fabriqué —
 * c'est ce qui permet au mode conduite de récupérer un vrai
 * `SpeechSynthesisVoice` sans conversion de type.
 *
 * @template {{ name?: string, lang?: string, localService?: boolean, voiceURI?: string }} V
 * @param {V[]} voix
 * @param {string} [preferee]
 * @returns {V | null}
 */
export function meilleureVoix(voix, preferee) {
  if (preferee) {
    const gardee = voix.find((v) => v.voiceURI === preferee);
    if (gardee) return gardee;
  }
  const francophones = voix.filter((v) =>
    (v.lang ?? '').toLowerCase().replace('_', '-').startsWith('fr'),
  );
  let choisie = null;
  let meilleure = -Infinity;
  for (const v of francophones) {
    const n = noteVoix(v);
    if (n > meilleure) {
      meilleure = n;
      choisie = v;
    }
  }
  return choisie;
}
