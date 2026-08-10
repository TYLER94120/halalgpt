// @ts-check
// Les mots qui ne désignent aucune fiche.
//
// Ce fichier est en JavaScript, et importé À LA FOIS par `app/api/chat/route.ts`
// et par `scripts/test-repli.mjs`. Ce n'est pas un détail : la liste existait en
// DOUBLE, une copie dans le code et une copie dans le test. Le 10 août, j'ai
// corrigé la copie du code et pas celle du test — le test a continué de passer
// en mesurant une liste que plus personne n'utilisait. Un test qui ne teste pas
// ce qui tourne est pire qu'aucun test : il rassure.
//
// ─── CE QUI A LE DROIT D'ÊTRE ICI ─────────────────────────────────────────────
//
// Les mots qui ne DÉSIGNENT rien : interrogatifs, auxiliaires, politesses.
//
// ─── CE QUI N'A PAS LE DROIT D'Y ÊTRE, ET QUI Y ÉTAIT ─────────────────────────
//
// « manger », « mange », « plat », « plats ». Ils nomment quelque chose.
//
// Ils avaient été mis là parce qu'ils sont fréquents — « manger » apparaît dans
// 12 titres sur 189. Mais la fréquence n'est PAS une raison de jeter un mot :
// le calcul de rareté s'en occupe déjà, et les jeter détruit les COMBINAISONS.
//
// Le cas qui l'a montré : « où manger halal à Paris ». Seul, « paris » désigne
// autant la fiche des restaurants que celle des paris sportifs ; « manger »
// désigne douze fiches. Ensemble, ils n'en désignent qu'UNE. En ignorant
// « manger », il ne restait qu'un mot utile, l'égalité était parfaite, et on
// répondait « je ne sais pas » à quelqu'un qui venait de citer mot pour mot le
// titre d'une fiche existante.
//
// « halal » et « haram » restent, eux : ils apparaissent dans presque toutes les
// formulations de question du site, y compris quand on ne parle de rien.

export const MOTS_VIDES = new Set([
  'halal', 'haram', 'question', 'peut', 'peux', 'suis', 'veux', 'voudrais',
  'aimerais', 'jaimerais', 'jaimerai', 'aime', 'quel', 'quelle', 'quels',
  'quelles', 'comment', 'pourquoi', 'avec', 'sans', 'pour', 'dans', 'bien',
  'bonne', 'salam', 'bonjour', 'salut', 'merci', 'estce', 'cest', 'quoi',
  'trouver', 'trouve', 'faire',
  // Mots d'interrogation et de remplissage : ils ne designent aucune fiche.
  // « combien » faisait tomber « combien font douze fois sept » sur la fiche
  // du montant de la zakat.
  'combien', 'quand', 'lequel', 'laquelle', 'doit', 'faut', 'fait', 'sont',
  'etre', 'avoir', 'plus', 'moins', 'tout', 'tous', 'toute', 'toutes',
  'chose', 'choses', 'vraiment', 'possible', 'autre', 'autres',
]);
