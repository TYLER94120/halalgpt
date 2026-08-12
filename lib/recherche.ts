// La recherche interne du site — celle du champ « Cherche une question… ».
//
// POURQUOI CE FICHIER EXISTE
//
// Le 12 aout 2026, la recherche de /questions ne regardait QUE le titre de la
// fiche, son verdict et sa categorie. Jamais la reponse. Sur quarante et une
// saisies qu'une vraie personne taperait, dix-sept ne ramenaient rien — et
// pour treize d'entre elles, le site avait pourtant la reponse :
//
//   « cochenille »   → 0 resultat,  6 fiches en parlent
//   « emulsifiant »  → 0 resultat, 10 fiches en parlent
//   « hotel »        → 0 resultat,  5 fiches en parlent
//   « anesthesie »   → 0 resultat,  2 fiches en parlent
//   « regles »       → 0 resultat,  6 fiches en parlent
//
// Le visiteur, lui, ne voyait qu'une chose : « Aucune fiche ne correspond. »
// Il repartait en croyant le site vide sur son sujet. C'est le pire mensonge
// qu'un site puisse dire — il en sait plus qu'il n'en montre.
//
// CE QUE CE MODULE CHANGE
//
// On cherche desormais aussi dans le corps de la reponse. Mais chercher plus
// large sans classer donnerait l'echec inverse : « ramadan » ramenerait cent
// fiches en vrac, ce qui ne vaut pas mieux que zero. D'ou un classement — le
// titre pese six fois le corps — et la promesse tenue au visiteur devient
// « les plus proches d'abord », pas « voila tout ce qui contient ce mot ».
//
// CE QU'ON NE FAIT PAS, ET POURQUOI
//
// Pas de tolerance aux fautes de frappe (« gelatinne », « ramadhan »). Une
// distance d'edition sur deux cents fiches a chaque lettre tapee se sent sur
// un telephone modeste, et surtout elle rapproche des mots qui n'ont rien a
// voir. On prefere ne rien trouver que trouver a cote.

import type { QA } from './questions';

/**
 * « prière » → « priere ». Sans cela personne ne trouve rien : on tape sans
 * accents sur un telephone, et la moitie des fiches en portent.
 *
 * Les apostrophes deviennent des espaces : « l'alcool » doit se trouver en
 * tapant « alcool ».
 */
export function aplati(texte: string): string {
  return texte
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[’']/g, ' ')
    .toLowerCase();
}

/**
 * Les mots de grammaire. On ne les met pas dans l'index du corps : ils sont
 * dans toutes les fiches, donc ils ne distinguent rien.
 *
 * Liste volontairement COURTE et purement grammaticale. Chaque mot retire est
 * un mot que le visiteur ne pourra plus chercher — c'est exactement le defaut
 * qu'on repare ici. On ne retire donc que ce qui ne veut rien dire seul.
 */
const MOTS_OUTILS = new Set(
  ('le la les un une des du de d au aux et ou a en dans sur sous pour par avec sans ' +
    'que qui quoi dont est sont etre ete il elle ils elles on nous vous je tu me te se ' +
    'ce cet cette ces son sa ses leur leurs mon ma mes ton ta tes notre votre nos vos ' +
    'ne pas plus tres mais donc car si comme tout tous toute toutes meme aussi encore ' +
    'deja peu fait faire peut peuvent doit doivent faut y s c n l j m t qu ' +
    'cela celui celle ceux entre vers chez apres avant pendant depuis lors ainsi ' +
    'cependant toutefois pourtant enfin ensuite puis quand lorsque parce afin ' +
    'autre autres chaque plusieurs certains certaines quelques aucun aucune').split(' '),
);

function motsDistinctifs(texte: string, dejaVus: Set<string>): string[] {
  const gardes: string[] = [];
  for (const mot of aplati(texte).split(/[^a-z0-9]+/)) {
    if (mot.length < 3 || MOTS_OUTILS.has(mot) || dejaVus.has(mot)) continue;
    dejaVus.add(mot);
    gardes.push(mot);
  }
  return gardes;
}

/**
 * La partie de l'index qui coute cher : les mots distinctifs de la reponse,
 * en DEUX zones.
 *
 *   [0] les mots de `short` — la reponse directe, celle qui tient en une
 *       phrase. Un mot present la est le sujet de la fiche.
 *   [1] les mots du developpement, moins ceux deja dans `short`.
 *
 * Sans cette separation, « cochenille » remontait Fanta avant E120 : les deux
 * fiches contiennent le mot, alors elles etaient a egalite, et c'est la
 * question la plus courte qui passait devant. Or E120 EST la fiche de la
 * cochenille, Fanta ne fait que la mentionner.
 *
 * Aucun mot n'est ecrit deux fois : la separation ne coute presque rien en
 * poids. On garde les mots UNIQUES d'au moins trois lettres, sans les mots de
 * grammaire — environ 600 octets par fiche contre 1 100 pour le texte entier.
 */
export function corpsDeFiche(qa: Pick<QA, 'short' | 'answer'>): [string, string] {
  const vus = new Set<string>();
  const fort = motsDistinctifs(qa.short, vus);
  const reste = motsDistinctifs(qa.answer.join(' '), vus);
  return [fort.join(' '), reste.join(' ')];
}

/** Ce que la page connait de chaque fiche, avant meme d'avoir charge le corps. */
export interface FicheCherchable {
  slug: string;
  question: string;
  verdict: string;
  category: string;
}

/** La forme prete a comparer. Le corps peut arriver plus tard, ou jamais. */
export interface EntreeIndex {
  fiche: FicheCherchable;
  titre: string;
  etiquette: string;
  /** Les mots de la reponse directe. */
  fort: string;
  /** Les mots du developpement. */
  corps: string;
}

/** Ce que sert `app/api/recherche` : un slug → [mots de `short`, mots du reste]. */
export type CorpsParSlug = Record<string, [string, string]>;

export function construireIndex(
  fiches: FicheCherchable[],
  corps: CorpsParSlug = {},
): EntreeIndex[] {
  return fiches.map((fiche) => ({
    fiche,
    titre: aplati(fiche.question),
    etiquette: aplati(`${fiche.verdict} ${fiche.category}`),
    fort: corps[fiche.slug]?.[0] ?? '',
    corps: corps[fiche.slug]?.[1] ?? '',
  }));
}

/** « E120, carmin ? » → ['e120', 'carmin']. */
export function motsDeLaSaisie(saisie: string): string[] {
  return aplati(saisie)
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

/**
 * Un mot commence-t-il par `terme` dans ce texte ?
 *
 * C'est ce qu'on veut d'une recherche pendant la frappe : dans le corps d'une
 * reponse, « coch » doit trouver « cochenille », mais « elat » ne doit pas
 * trouver « gelatine » — sinon quatre lettres ramenent les trente-cinq fiches
 * qui prononcent le mot en passant.
 *
 * Le titre, lui, garde en dernier recours la recherche au milieu des mots :
 * c'est ce qu'il faisait avant, et on ne retire rien a personne.
 *
 * Le texte est deja aplati en a-z0-9 : un simple test sur le caractere qui
 * precede suffit, sans expression reguliere a construire a chaque frappe.
 */
function debutDeMot(texte: string, terme: string): boolean {
  let i = texte.indexOf(terme);
  while (i !== -1) {
    if (i === 0 || !/[a-z0-9]/.test(texte[i - 1])) return true;
    i = texte.indexOf(terme, i + 1);
  }
  return false;
}

// Le titre pese six fois le corps. C'est ce rapport qui fait qu'une recherche
// large reste lisible : « ramadan » ramene beaucoup de fiches, mais celles qui
// portent le mot dans leur titre sont toutes en haut.
const POIDS_TITRE = 12;
const POIDS_TITRE_DEDANS = 8; // le terme est dans le titre, mais en plein mot
const POIDS_ETIQUETTE = 4;
const POIDS_FORT = 3; // dans la reponse directe : c'est le sujet de la fiche
const POIDS_CORPS = 2; // quelque part dans le developpement

export interface Resultat {
  fiche: FicheCherchable;
  score: number;
}

/**
 * Les fiches qui repondent a la saisie, les plus proches d'abord.
 *
 * TOUS les mots tapes doivent etre trouves quelque part : « priere assis » ne
 * doit pas ramener toutes les fiches Priere. C'etait deja la regle avant, et
 * c'est elle qui empeche la recherche elargie de devenir du bruit.
 *
 * Renvoie `null` pour une saisie vide — la page affiche alors ses categories,
 * ce qui n'est pas la meme chose qu'un resultat vide.
 */
export function chercher(index: EntreeIndex[], saisie: string): Resultat[] | null {
  const termes = motsDeLaSaisie(saisie);
  if (!termes.length) return null;

  const trouves: Resultat[] = [];
  for (const e of index) {
    let score = 0;
    let tousPresents = true;
    for (const terme of termes) {
      let point = 0;
      if (debutDeMot(e.titre, terme)) point = POIDS_TITRE;
      else if (e.titre.includes(terme)) point = POIDS_TITRE_DEDANS;
      else if (debutDeMot(e.etiquette, terme)) point = POIDS_ETIQUETTE;
      else if (debutDeMot(e.fort, terme)) point = POIDS_FORT;
      else if (debutDeMot(e.corps, terme)) point = POIDS_CORPS;
      if (point === 0) {
        tousPresents = false;
        break;
      }
      score += point;
    }
    if (tousPresents) trouves.push({ fiche: e.fiche, score });
  }

  // A score egal, la question la plus courte d'abord : c'est en general la
  // plus directe, et cela rend l'ordre stable d'une frappe a l'autre.
  return trouves.sort(
    (a, b) => b.score - a.score || a.fiche.question.length - b.fiche.question.length,
  );
}
