// @ts-check
// « Et après ? » — les deux ou trois questions à proposer sous une réponse.
//
// Demande de Mohamed : « comme Google fait dans sa section où il pose une
// question, et à chaque fois qu'il y répond il en propose d'autres. Ça devient
// addictif. »
//
// D'OÙ VIENNENT LES QUESTIONS, ET POURQUOI ÇA COMPTE
//
// Pas de l'IA. Elles sont prises dans le champ `related` des fiches, écrit à
// la main, fiche par fiche. Trois raisons, dans cet ordre :
//
//   1. On ne propose que des questions auxquelles on sait VRAIMENT répondre.
//      Une IA qui invente des questions finit par en proposer une dont la
//      réponse sera mauvaise — et c'est justement au moment où le lecteur nous
//      fait le plus confiance qu'on le décevrait.
//   2. C'est instantané et ça ne coûte aucun appel. Une suggestion qui arrive
//      trois secondes après la réponse arrive après que le lecteur est parti.
//   3. Chaque proposition est une vraie page du site. Le lecteur qui clique
//      atterrit sur une fiche indexée, pas dans le vide.
//
// Mesuré le 10 août : les 189 fiches ont toutes au moins 2 questions liées,
// 159 en ont 3. La matière existait déjà, elle n'était utilisée que dans le
// bas des fiches — jamais dans le chat.

const VIDES = new Set([
  'le', 'la', 'les', 'un', 'une', 'des', 'du', 'de', 'et', 'ou', 'est', 'il',
  'elle', 'on', 'ce', 'cet', 'cette', 'que', 'qui', 'quoi', 'quel', 'quelle',
  'dans', 'pour', 'par', 'avec', 'sans', 'sur', 'mon', 'ma', 'mes', 'je',
  'peut', 'peux', 'puis', 'faire', 'fait', 'ai', 'suis', 'en', 'au', 'aux',
  'pas', 'ne', 'si', 'plus', 'moins', 'tout', 'tous', 'comment', 'pourquoi',
  'quand', 'combien', 'halal', 'islam', 'musulman', 'musulmane',
]);

/** @param {string} texte @returns {Set<string>} */
export function jetons(texte) {
  return new Set(
    texte
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .split(/[^a-z0-9]+/)
      .filter((m) => m.length >= 3 && !VIDES.has(m)),
  );
}

/**
 * À quel point cette fiche répond-elle à cette question ?
 * @param {Set<string>} mots
 * @param {{question: string, slug: string, short?: string}} qa
 * @returns {number}
 */
export function score(mots, qa) {
  const fort = jetons(`${qa.question} ${qa.slug}`);
  const faible = jetons(qa.short ?? '');
  let n = 0;
  for (const m of mots) {
    // Un mot du titre vaut trois fois un mot du résumé : « lardons » dans le
    // titre désigne la fiche, « lardons » dans un résumé peut n'être qu'un
    // exemple cité en passant.
    if (fort.has(m)) n += 3;
    else if (faible.has(m)) n += 1;
    else if (m.length >= 5) {
      for (const j of fort) {
        if (j.startsWith(m) || m.startsWith(j)) {
          n += 2;
          break;
        }
      }
    }
  }
  return n;
}

/**
 * Rend jusqu'à `combien` questions à proposer après une réponse.
 *
 * @param {string} question       ce que le lecteur vient de demander
 * @param {Array<{slug: string, question: string, short?: string, category?: string, related?: string[]}>} fiches
 * @param {string[]} [dejaVues]   slugs déjà proposés ou déjà lus dans ce fil
 * @param {number} [combien]
 * @returns {Array<{slug: string, question: string}>}
 */
export function questionsApres(question, fiches, dejaVues = [], combien = 3) {
  const mots = jetons(question ?? '');
  if (mots.size === 0) return [];

  const parSlug = new Map(fiches.map((f) => [f.slug, f]));
  const exclus = new Set(dejaVues);

  let meilleure = null;
  let meilleurScore = 0;
  for (const f of fiches) {
    const s = score(mots, f);
    if (s > meilleurScore) {
      meilleurScore = s;
      meilleure = f;
    }
  }

  // Rien ne correspond : on ne propose RIEN. Trois questions au hasard sous
  // une réponse ne sont pas des « questions autour de ça », ce sont des
  // questions à côté — et ça se voit tout de suite.
  if (!meilleure || meilleurScore < 3) return [];

  exclus.add(meilleure.slug);

  /** @type {Array<{slug: string, question: string}>} */
  const sortie = [];
  /** @param {{slug: string, question: string, short?: string} | undefined} f */
  const ajouter = (f) => {
    if (!f || exclus.has(f.slug) || sortie.length >= combien) return;
    // Une proposition doit être une AUTRE question, pas une autre façon de
    // poser la même. Deux fiches peuvent répondre au même besoin — « La
    // gélatine est-elle halal ? » et « Le E441 (gélatine) est-il halal ? » —
    // et proposer la seconde sous la première, c'est renvoyer le lecteur à ce
    // qu'il vient de lire. On écarte donc toute fiche qui répond à la question
    // posée aussi bien que celle qui y a répondu.
    if (score(mots, f) >= meilleurScore) {
      exclus.add(f.slug);
      return;
    }
    exclus.add(f.slug);
    sortie.push({ slug: f.slug, question: f.question });
  };

  // 1. Les questions liées, écrites à la main : ce sont les meilleures.
  for (const slug of meilleure.related ?? []) ajouter(parSlug.get(slug));

  // 2. S'il en manque, on complète par la même catégorie, les mieux notées
  //    d'abord. C'est moins bon qu'un lien écrit à la main, mais ça reste dans
  //    le sujet.
  if (sortie.length < combien && meilleure.category) {
    const memeSujet = fiches
      .filter((f) => f.category === meilleure.category && !exclus.has(f.slug))
      .map((f) => ({ f, s: score(mots, f) }))
      .sort((a, b) => b.s - a.s);
    for (const { f } of memeSujet) ajouter(f);
  }

  return sortie;
}
