// Le gras dans le texte des fiches, et ce qu'il devenait sans ce fichier.
//
// Les reponses sont ecrites en clair dans `lib/questions.ts`, et cinq d'entre
// elles marquaient une phrase importante avec des doubles asterisques, comme on
// le fait par reflexe. Mais elles sont rendues par `<p>{paragraphe}</p>` : React
// echappe, et le lecteur voyait les asterisques.
//
// Le pire n'etait pas la page. Le meme texte part a trois autres endroits :
//   · les donnees structurees FAQPage, donc chez Google ;
//   · la reponse du mode conduite, lue a voix haute ;
//   · l'index de recherche interne.
// Autrement dit, un marqueur de mise en forme se retrouvait dans du texte qui
// n'a aucun moyen de l'interpreter.
//
// Deux fonctions donc, et jamais l'une sans l'autre : `enMorceaux` pour ce qui
// s'affiche, `sansEmphase` pour tout ce qui doit rester du texte pur.
//
// On ne fait volontairement que le gras. Ajouter l'italique, les liens ou les
// listes reviendrait a mettre un moteur markdown dans des fiches qui n'en
// demandent pas — et chaque syntaxe acceptee est une syntaxe qui peut fuir.

const MARQUE = /\*\*(.+?)\*\*/g;

/** Le texte sans ses marqueurs, pour tout ce qui n'affiche pas de HTML. */
export function sansEmphase(texte: string): string {
  return texte.replace(MARQUE, '$1');
}

export interface Morceau {
  texte: string;
  gras: boolean;
}

/** Le texte decoupe en morceaux gras / non gras, dans l'ordre. */
export function enMorceaux(texte: string): Morceau[] {
  const morceaux: Morceau[] = [];
  let curseur = 0;

  for (let m = MARQUE.exec(texte); m; m = MARQUE.exec(texte)) {
    if (m.index > curseur) {
      morceaux.push({ texte: texte.slice(curseur, m.index), gras: false });
    }
    morceaux.push({ texte: m[1], gras: true });
    curseur = m.index + m[0].length;
  }
  MARQUE.lastIndex = 0;

  if (curseur < texte.length) {
    morceaux.push({ texte: texte.slice(curseur), gras: false });
  }
  return morceaux;
}
