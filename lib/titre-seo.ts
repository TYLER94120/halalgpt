import { SITE_NAME } from './config';
import type { QA } from './questions';

// Le titre que Google affiche, et qui decide du clic.
//
// Le probleme, mesure le 10 aout 2026 par la ronde des sites : le gabarit du
// layout ajoute « — HalalGPT » a chaque titre. Sur 189 fiches, 22 depassaient
// alors 60 caracteres et Google les coupait en plein milieu :
//
//     « Serrer la main a une personne du sexe oppose, est-ce permis … »
//
// Un titre coupe n'est pas une faute d'orthographe : c'est la premiere chose
// qu'un lecteur voit, et une phrase tronquee donne l'impression d'un site
// baclé. Ca se paie en clics, tous les jours, sur des impressions deja
// acquises.
//
// La regle, du plus souhaitable au moins souhaitable :
//
//   1. la question ET la marque tiennent en 60 -> on garde la marque, qui
//      construit la reconnaissance au fil des resultats ;
//   2. la question seule tient en 60 -> on sacrifie la marque. Mieux vaut une
//      question entiere sans marque qu'une question coupee avec ;
//   3. la question seule depasse 60 -> aucun calcul ne peut sauver ca. Il faut
//      un titre court ECRIT A LA MAIN, dans le champ `titreSeo` de la fiche.
//      Une coupe automatique produirait justement le titre baclé qu'on essaie
//      d'eviter.

export const LIMITE = 60;
const SUFFIXE = ` — ${SITE_NAME}`;

/**
 * Rend le titre final de la page, marque comprise si elle tient.
 * `avecMarque` dit si le suffixe a pu etre garde — utile aux tests.
 */
export function titreDeFiche(qa: Pick<QA, 'question' | 'titreSeo'>): {
  titre: string;
  avecMarque: boolean;
} {
  const base = (qa.titreSeo ?? qa.question).trim();

  if (base.length + SUFFIXE.length <= LIMITE) {
    return { titre: base + SUFFIXE, avecMarque: true };
  }
  return { titre: base, avecMarque: false };
}
