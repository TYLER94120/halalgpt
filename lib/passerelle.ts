// Le compteur de passerelles — la logique, separee de la route.
//
// POURQUOI SEPAREE
//
// C'est la seule mesure de l'empire qu'un agent peut lire seul, et c'est elle
// qu'on relira le 25 aout pour trancher « est-ce que les passerelles amenent
// quelqu'un ». Tant qu'elle vivait dans la route, on ne pouvait la tester
// qu'en lui envoyant de vraies arrivees — c'est-a-dire en faussant la mesure
// qu'on voulait verifier. Ici, on lui passe une fausse base et on regarde ce
// qu'elle repond, sans rien ecrire nulle part.
//
// Meme geste que pour `faut_il_rattraper` dans le robot de ronde le meme
// matin : une decision cachee au fond d'une fonction ne se teste pas, et une
// decision qu'on ne teste pas finit par mentir sans que personne ne le voie.

/** Les seules sources comptees. Une source forgee ne doit pas gonfler la mesure. */
export const SOURCES_CONNUES = new Set([
  'halalcheck',
  'voyageshalal',
  'gohalaltravel',
  'islampasapas',
  'apprentissage',
  'youtube',
  'whatsapp',
]);

/** Ce que le compteur a besoin de savoir faire. Redis le fait ; un faux aussi. */
export interface BaseCompteur {
  zincrby(cle: string, n: number, membre: string): Promise<unknown>;
  expire(cle: string, secondes: number): Promise<unknown>;
  zcard(cle: string): Promise<number>;
}

/**
 * Ce qui s'est reellement passe. QUATRE etats, et c'est le coeur de la
 * correction du 12 aout : avant, `compte: true` sortait aussi quand
 * l'ecriture avait echoue, et `compte: false` melait « source inconnue » et
 * « aucune base ». De l'exterieur, on ne pouvait pas distinguer un compteur
 * qui marche d'un compteur en panne.
 */
export type EtatEcriture = 'compte' | 'echec-base' | 'sans-base' | 'source-inconnue';

export interface Reponse {
  ok: true;
  compte: boolean;
  etat: EtatEcriture;
}

/** « E471 » ou « fiche-produit » → garde une etiquette courte et propre. */
export function propre(valeur: unknown, max = 40): string {
  if (typeof valeur !== 'string') return '';
  return valeur
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '')
    .slice(0, max);
}

export interface Arrivee {
  source?: unknown;
  campagne?: unknown;
  page?: unknown;
}

/**
 * Enregistre une arrivee. `base` a null veut dire « aucune base configuree ».
 *
 * Ne leve jamais : une visite ne doit pas casser pour un compteur. Mais elle
 * ne ment jamais non plus — un echec d'ecriture rend `compte: false`.
 */
export async function enregistrer(
  base: BaseCompteur | null,
  corps: Arrivee,
  jour: string,
): Promise<Reponse> {
  const source = propre(corps.source, 24);
  if (!source || !SOURCES_CONNUES.has(source)) {
    return { ok: true, compte: false, etat: 'source-inconnue' };
  }
  if (!base) return { ok: true, compte: false, etat: 'sans-base' };

  const campagne = propre(corps.campagne, 40) || 'sans-campagne';
  const page = propre(typeof corps.page === 'string' ? corps.page.replace(/\//g, '_') : '', 60);

  try {
    await Promise.all([
      base.zincrby('halalgpt:passerelles', 1, source),
      base.zincrby('halalgpt:passerelles:detail', 1, `${source} · ${campagne} · ${page || '_'}`),
      base.zincrby(`halalgpt:passerelles:jour:${jour}`, 1, source),
      // Les journaux quotidiens s'effacent seuls au bout de 90 jours : on garde
      // la tendance, pas un historique qui grossit indefiniment.
      base.expire(`halalgpt:passerelles:jour:${jour}`, 60 * 60 * 24 * 90),
    ]);
  } catch {
    // On ne casse toujours PAS la visite — c'est la bonne decision et elle ne
    // change pas. Ce qui change : on ne pretend plus avoir compte. Un compteur
    // a le droit de tomber en panne ; il n'a pas le droit de dire qu'il a
    // compte quand il n'a rien ecrit.
    return { ok: true, compte: false, etat: 'echec-base' };
  }
  return { ok: true, compte: true, etat: 'compte' };
}

export interface Sante {
  vivant: boolean;
  pourquoi?: string;
  sources_acceptees: string[];
  sources_deja_vues?: number;
  lecture?: string;
}

/**
 * « Es-tu vivant ? » — lecture seule, aucune ecriture.
 *
 * Jusqu'ici, le seul moyen de tester le compteur etait de lui envoyer une
 * fausse arrivee : on ne pouvait pas le verifier sans le fausser. Et
 * /api/mine, qui affiche les totaux, est protege par mot de passe — donc
 * aucun agent ne pouvait repondre a « est-ce que la mesure marche ? ».
 *
 * Ne rend aucune donnee de visiteur : l'etat de l'instrument, rien d'autre.
 */
export async function sante(base: BaseCompteur | null): Promise<Sante> {
  const sources = [...SOURCES_CONNUES].sort();
  if (!base) {
    return {
      vivant: false,
      pourquoi: 'aucune base configuree (KV_REST_API_URL / KV_REST_API_TOKEN manquants)',
      sources_acceptees: sources,
    };
  }
  try {
    const distinctes = await base.zcard('halalgpt:passerelles');
    return {
      vivant: true,
      sources_acceptees: sources,
      sources_deja_vues: distinctes,
      // On dit a voix haute ce qu'un zero veut dire, pour qu'on ne lise pas
      // « personne ne vient » la ou il faut lire « rien n'est encore passe ».
      lecture:
        distinctes === 0
          ? 'le compteur marche, et aucune passerelle n’a encore amene personne'
          : `${distinctes} source(s) ont deja amene au moins un visiteur`,
    };
  } catch {
    return {
      vivant: false,
      pourquoi: 'base configuree mais injoignable',
      sources_acceptees: sources,
    };
  }
}
