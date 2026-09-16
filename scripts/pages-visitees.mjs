// Les pages que Google visite deja — la liste, en un seul exemplaire.
//
// POURQUOI CE FICHIER EXISTE
//
// Search Console, 14 aout : sur 199 pages connues, 135 sont « detectee,
// actuellement non indexee » — Google ne les a JAMAIS lues. Onze pages
// echappent a ce sort et recoivent des impressions. Ce sont nos portes
// d'entree : l'exploration se propage par elles, et un lien depuis l'une
// d'elles vaut beaucoup plus qu'un lien depuis une page que le robot ignore.
//
// Cette liste vivait en double, recopiee a l'identique dans
// `densifier-maillage.mjs` et dans `que-ecrire.mjs`. Le 16 septembre, en
// mesurant la distance en sauts entre ces portes et les fiches recentes, j'ai
// trouve que l'une des onze n'existait pas : `e621-halal`. La fiche du
// glutamate est reelle, mais son slug est `e621-glutamate-halal`.
//
// Consequence, discrete et jamais signalee : `densifier-maillage.mjs` donne
// dix points de priorite a une source visitee, et l'une de nos meilleures
// sources ne les recevait jamais. Aucun message d'erreur — une chaine de
// caracteres qui ne correspond a rien ne se plaint pas.
//
// D'ou ce fichier : UNE liste, et une verification qui echoue bruyamment si un
// slug n'existe plus. Une donnee recopiee finit toujours par diverger ; une
// donnee verifiee au chargement ne le peut pas.

import { QUESTIONS } from '../lib/questions.ts';

/** Les onze pages dont Search Console montre qu'elles recoivent des impressions. */
export const VISITEES = new Set([
  'levure-biere-halal', 'mentos-halal', 'priere-voiture', 'medicaments-gelules-halal',
  'vernis-ongles-priere', 'glace-halal', 'e466-halal', 'e621-glutamate-halal',
  'certifications-halal-france', 'mcdo-halal', 'isla-delice-halal',
]);

// La verification, faite au chargement et non a la demande : un outil qui
// importe cette liste ne peut pas travailler sur une version perimee sans le
// savoir. Un slug renomme dans `questions.ts` fait echouer ici, tout de suite,
// avec le nom du coupable.
const inconnus = [...VISITEES].filter(
  (slug) => !QUESTIONS.some((q) => q.slug === slug),
);

if (inconnus.length > 0) {
  console.error(
    `\n✗ scripts/pages-visitees.mjs : ${inconnus.length} slug(s) sans fiche — ${inconnus.join(', ')}` +
    '\n  Une fiche a ete renommee ou supprimee. Corriger la liste :' +
    '\n  tant qu\'elle contient un slug mort, cette porte d\'entree est' +
    '\n  silencieusement ignoree par densifier-maillage.mjs.\n',
  );
  process.exit(1);
}
