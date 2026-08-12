// Les faits qui surprennent vraiment.
//
// Une IA de reponse ne se visite pas tous les jours : personne n'a une question
// halal quotidienne. Ce qui ramene quelqu'un, c'est d'avoir appris ici quelque
// chose qu'il ignorait, et d'avoir eu envie de le raconter. Cette liste est la
// matiere de cette surprise — la meme que celle des accroches video, deja
// eprouvee.
//
// Chaque entree pointe vers une fiche reelle : le fait etonne, la fiche
// explique. Jamais de fait sans sa fiche, jamais de fait invente.

export interface Surprise {
  slug: string;
  fait: string;
}

export const SURPRISES: Surprise[] = [
  // Celle-ci est la plus inconfortable du lot, et c'est pour ca qu'elle est en
  // tete : un site qui EST une IA explique pourquoi il ne faut pas lui demander
  // de fatwa. On ne peut pas ne pas ouvrir.
  { slug: 'ia-halal', fait: 'Cette IA te déconseille de lui demander une fatwa.' },
  { slug: 'sport-combat-halal', fait: 'La lutte est encouragée par la sunna ?' },
  { slug: 'taurine-halal', fait: 'La taurine vient du taureau ?' },
  { slug: 'dragibus-halal', fait: 'Les Dragibus contiennent de la gélatine ?' },
  { slug: 'e120-halal', fait: 'Ce colorant rouge est fait avec un insecte.' },
  { slug: 'avaler-salive-ramadan', fait: 'Avaler ta salive casse ton jeûne ?' },
  { slug: 'oubli-manger-ramadan', fait: 'Tu as mangé par oubli. Ton jeûne est fichu ?' },
  { slug: 'babybel-halal', fait: 'Tu évites tous les fromages ?' },
  { slug: 'vitamine-d3-halal', fait: 'Ta vitamine D vient de la laine de mouton.' },
  { slug: 'rattraper-prieres-ratees', fait: 'Des années de prières manquées. Trop tard ?' },
  { slug: 'vernis-ongles-priere', fait: 'Le vernis à ongles empêche de prier ?' },
  { slug: 'coca-cola-halal', fait: 'Il y aurait de l’alcool dans le Coca ?' },
  { slug: 'escargots-halal', fait: 'Les escargots, halal ou pas ?' },
  { slug: 'crevette-halal', fait: 'Les crevettes font débat entre savants.' },
  { slug: 'e471-halal', fait: 'Cet additif est dans presque tout ton placard.' },
  { slug: 'piqure-ramadan', fait: 'Une piqûre pendant le Ramadan ?' },
  { slug: 'tatouage-halal', fait: 'Tu as un tatouage. Tes prières comptent ?' },
  { slug: 'chien-islam', fait: 'Un chien à la maison, vraiment interdit ?' },
  { slug: 'psy-therapie-islam', fait: 'Consulter un psy, c’est un manque de foi ?' },
  { slug: 'brosser-dents-ramadan', fait: 'Se brosser les dents en jeûnant ?' },
  { slug: 'mauvais-oeil-protection', fait: 'Le mauvais œil existe vraiment ?' },
  { slug: 'sport-ramadan', fait: 'Faire du sport en jeûnant ?' },
  { slug: 'gelatine-halal', fait: 'La gélatine se cache sous un numéro.' },
  { slug: 'kinder-halal', fait: 'Les Kinder, halal ou pas ?' },
  { slug: 'nutella-halal', fait: 'Le Nutella, halal ou pas ?' },
  { slug: 'haribo-halal', fait: 'Les Haribo, halal ou pas ?' },
  { slug: 'lapin-halal', fait: 'Le lapin est-il halal ?' },
  { slug: 'femme-enceinte-ramadan', fait: 'Enceinte pendant le Ramadan : obligée de jeûner ?' },
  { slug: 'priere-travail', fait: 'Prier au travail en France, c’est possible ?' },
  { slug: 'se-convertir-islam', fait: 'Devenir musulman prend combien de temps ?' },
  { slug: 'musique-halal', fait: 'La musique est-elle haram ?' },
  { slug: 'e441-gelatine-halal', fait: 'E441 : le vrai nom de la gélatine.' },
];

/** La decouverte du jour : la meme pour tout le monde, et differente demain.
 *  Elle depend du quantieme, pas du hasard : deux personnes qui en parlent le
 *  meme jour doivent avoir vu la meme. */
export function surpriseDuJour(date = new Date()): Surprise {
  const debut = Date.UTC(date.getUTCFullYear(), 0, 0);
  const jour = Math.floor((Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) - debut) / 86400000);
  return SURPRISES[jour % SURPRISES.length];
}

// Le fait attache a une fiche, s'il y en a un.
//
// Pourquoi cette fonction existe : le fait etait affiche sur l'accueil, et
// nulle part ailleurs. Quand quelqu'un partageait la fiche, le message qui
// partait ne contenait que la question — « Le E120 est-il halal ? ». C'est une
// question, pas une raison d'ouvrir. Le fait, lui, en est une : « Ce colorant
// rouge est fait avec un insecte. » On ne peut pas ne pas cliquer.
export function faitDe(slug: string): string | undefined {
  return SURPRISES.find((s) => s.slug === slug)?.fait;
}
