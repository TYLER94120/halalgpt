// ─── Les attentes bornées ────────────────────────────────────────────────────
//
// POURQUOI CE FICHIER EXISTE. Le 14 août 2026, l'inventaire des attentes du
// site a rendu un résultat net : **zéro délai maximum**, ni dans les six appels
// du navigateur, ni dans les cinq routes qui appellent Redis ou le modèle.
//
// Le plus grave n'était pas l'absence : c'était le commentaire qui la couvrait.
// Dans `/api/etiquette`, le contrôle de quota se terminait par :
//
//     } catch {
//       return false; // Redis indisponible : on ne bloque pas le service
//     }
//
// L'intention est juste et le code ne la tient pas. **Un `catch` couvre la
// panne, pas la lenteur.** Un Redis qui répond en vingt secondes ne lève
// aucune erreur : il fait attendre. Et il faisait attendre AVANT même que la
// photo d'étiquette parte à l'analyse — donc quelqu'un debout dans un rayon
// attendait vingt secondes pour un compteur d'abus qui n'est même pas
// indispensable.
//
// La règle qu'on en tire, et qui vaut au-delà de Redis : **le repli doit être
// proportionné à ce qu'on perd en abandonnant.** Un quota manqué ne coûte
// rien ; une analyse d'étiquette manquée coûte la réponse entière. D'où deux
// délais très différents plus bas, et non un réglage unique.

/** Redis n'est jamais indispensable ici : quota, cache, compteurs. */
export const DELAI_REDIS = 1_500;

/**
 * Le modèle, lui, EST la réponse : rien à servir à sa place. On attend donc
 * longtemps — mais sous `maxDuration = 60`, pour que ce soit NOUS qui
 * répondions et non la plateforme qui tue la fonction. La différence est
 * entière pour l'appelant : un JSON qu'il sait lire, ou une page d'erreur
 * qu'il ne sait pas lire.
 */
export const DELAI_MODELE = 45_000;

/**
 * Rend `repli` si la promesse dépasse `ms`.
 *
 * La promesse n'est PAS annulée : elle continue et son résultat est ignoré.
 * C'est voulu — une écriture Redis déjà partie doit aboutir, et l'annuler à
 * mi-chemin laisserait une clé dans un état incertain. On abandonne l'attente,
 * pas le travail.
 */
export async function avecDelai<T>(promesse: Promise<T>, ms: number, repli: T): Promise<T> {
  let minuteur: ReturnType<typeof setTimeout> | undefined;
  // Sans ce `catch`, une promesse qui échoue APRÈS qu'on a rendu le repli
  // devient un rejet non traité et fait tomber le processus Node.
  const suivie = promesse.catch(() => repli);
  try {
    return await Promise.race([
      suivie,
      new Promise<T>((resoudre) => {
        minuteur = setTimeout(() => resoudre(repli), ms);
      }),
    ]);
  } finally {
    // Sans ce nettoyage, chaque appel rapide laisse un minuteur actif jusqu'à
    // son terme. Sur une route appelée en rafale, ils s'empilent.
    if (minuteur) clearTimeout(minuteur);
  }
}

/**
 * Une écriture dont personne n'attend le résultat. On ne l'attend pas du tout
 * plutôt que de l'attendre brièvement : il n'y a rien à en faire.
 */
export function sansAttendre(promesse: Promise<unknown>): void {
  void promesse.catch(() => {});
}
