import type { QA } from './questions';

// La description que Google affiche SOUS le titre, et qui finit de decider du
// clic.
//
// Le probleme, mesure le 11 aout 2026 sur les 193 fiches : le champ `short`
// servait tel quel de description. Or il est fait pour etre LU SUR LA PAGE,
// pas pour tenir dans un resultat de recherche. Resultat :
//
//   51 fiches sur 193 depassaient 160 caracteres — jusqu'a 236.
//
// Google les coupe, et il coupe ou ca tombe :
//
//     « ...la nourriture, mais le cadre de travail. La majorite des savants
//       distingue le fait de servir de l'alcool, qui rev… »
//
// On ne peut pas raccourcir `short` pour autant : il est affiche sur la fiche
// ET sert de resume dans les reponses du chat. Il a deux metiers. On en derive
// donc une description, exactement comme `titre-seo.ts` derive un titre.
//
// Pourquoi choisir la coupe plutot que la laisser faire : Google coupe de
// toute facon, mais une phrase qui se termine proprement a plus de chances
// d'etre reprise telle quelle. Une phrase tronquee au milieu d'un mot, il la
// remplace souvent par un extrait de la page qu'il choisit lui-meme — et on
// perd le controle de ce qui s'affiche.

export const LIMITE = 160;

/**
 * Coupe a la derniere frontiere de PHRASE qui tient, sinon a la derniere
 * frontiere de MOT.
 *
 * Jamais au milieu d'un mot : « qui rev… » est precisement l'aspect baclé
 * qu'on essaie d'eviter.
 */
export function descriptionDeFiche(qa: Pick<QA, 'short'>): string {
  const texte = qa.short.trim();
  if (texte.length <= LIMITE) return texte;

  // 1. Une phrase entiere, c'est toujours mieux : pas de points de suspension,
  //    rien qui donne l'impression d'etre coupe.
  const fin = /[.!?…](?=\s|$)/g;
  let derniere = 0;
  for (let m = fin.exec(texte); m; m = fin.exec(texte)) {
    if (m.index + 1 > LIMITE) break;
    derniere = m.index + 1;
  }
  // On refuse une phrase trop courte : « Oui. » est complet et ne dit rien.
  // En dessous de 90 caracteres, mieux vaut deux lignes coupees proprement.
  if (derniere >= 90) return texte.slice(0, derniere).trim();

  // 2. Sinon, frontiere de mot, et on annonce la coupe.
  let coupe = texte.slice(0, LIMITE - 1);
  const espace = coupe.lastIndexOf(' ');
  coupe = coupe.slice(0, espace > 0 ? espace : coupe.length);

  // Une parenthese ouverte et jamais fermee : « ...avec des niveaux
  // d'exigence differents (etourdissement… ». On recule avant elle plutot que
  // de laisser une parenthese pendante.
  const ouvre = coupe.lastIndexOf('(');
  if (ouvre > 0 && coupe.indexOf(')', ouvre) === -1) coupe = coupe.slice(0, ouvre);

  // Et on ne termine pas sur une ponctuation qui attend une suite : virgule,
  // deux-points, ou tiret. « caisse sans alcool —… » se lit mal.
  return `${coupe.replace(/[\s,;:—–-]+$/, '')}…`;
}
