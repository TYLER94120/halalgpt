// La réponse en cours vit ICI, en dehors du composant.
//
// Le bug qu'on répare, signalé par Mohamed : « j'ai posé une question, j'ai
// changé de page, je suis revenu — la question est restée mais la réponse
// n'avait pas continué à tourner ».
//
// La cause : la requête était lancée depuis le composant Chat. Ouvrir une
// fiche démonte ce composant, et le navigateur abandonne la lecture du flux
// en cours. Au retour, on recharge le fil sauvegardé — c'est-à-dire la
// question, sans la réponse, puisqu'elle n'avait jamais fini d'arriver.
//
// La correction : le flux est demandé depuis ce module, qui n'est jamais
// démonté. Le composant n'est plus le propriétaire de la réponse, il n'en est
// que le spectateur — il s'abonne quand il apparaît, se désabonne quand il
// part, et la réponse continue d'arriver entre les deux.
//
// Ce que ça ne répare PAS, et il faut le dire : recharger la page ou fermer
// l'onglet coupe tout. Rien ne survit à ça côté navigateur. Seul un relais
// côté serveur le permettrait, et ce n'est pas ce qui a été demandé.

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  image?: string; // dataURL JPEG (photo de l'utilisateur)
}

export interface EtatFlux {
  /** Le fil complet, réponse partielle comprise. */
  messages: Message[];
  /** La demande est partie, rien n'est encore arrivé. */
  attente: boolean;
  /** La réponse est en train de s'écrire. */
  ecrit: boolean;
}

type Ecouteur = (e: EtatFlux) => void;

const ecouteurs = new Set<Ecouteur>();

let etat: EtatFlux = { messages: [], attente: false, ecrit: false };

function diffuser(): void {
  for (const e of ecouteurs) e(etat);
}

function poser(partiel: Partial<EtatFlux>): void {
  etat = { ...etat, ...partiel };
  diffuser();
}

export function etatCourant(): EtatFlux {
  return etat;
}

export function enTrain(): boolean {
  return etat.attente || etat.ecrit;
}

export function ecouter(e: Ecouteur): () => void {
  ecouteurs.add(e);
  return () => {
    ecouteurs.delete(e);
  };
}

/** Remplace le fil sans rien demander (reprise d'une conversation sauvegardée). */
export function poserLeFil(messages: Message[]): void {
  poser({ messages, attente: false, ecrit: false });
}

export const MSG_RESEAU = 'Oups, petit souci de connexion 📡 Réessaie dans un instant.';
export const MSG_VIDE = "Désolé, je n'ai pas pu répondre. Réessaie dans un instant 🙏";

/**
 * Envoie la question et lit la réponse en flux. Rend le texte complet reçu,
 * pour ceux qui en ont besoin tout de suite (le mode conduite, qui doit le
 * prononcer au fur et à mesure).
 *
 * `surMorceau` est appelé à chaque arrivée : c'est ce qui permet de parler
 * avant la fin sans dupliquer la logique de lecture du flux.
 */
export async function demander(
  fil: Message[],
  surMorceau?: (recu: string, fini: boolean) => void,
): Promise<string> {
  poser({ messages: fil, attente: true, ecrit: false });

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Économie : seule la photo du DERNIER message part vers l'IA. Les
      // photos des anciens messages restent affichées mais ne repartent pas.
      body: JSON.stringify({
        messages: fil.map((m, i) => ({
          role: m.role,
          content: m.content,
          ...(m.image && i === fil.length - 1 ? { image: m.image } : {}),
        })),
      }),
    });

    if (!res.body) {
      const texte = (await res.text()) || MSG_VIDE;
      poser({ messages: [...fil, { role: 'assistant', content: texte }], attente: false, ecrit: false });
      surMorceau?.(texte, true);
      return texte;
    }

    const lecteur = res.body.getReader();
    const decodeur = new TextDecoder();
    let recu = '';
    let ouverte = false;

    for (;;) {
      const { done, value } = await lecteur.read();
      if (done) break;
      recu += decodeur.decode(value, { stream: true });
      if (!ouverte) {
        // Premier morceau : l'attente s'arrête, la bulle s'ouvre. Les deux ne
        // doivent jamais coexister à l'écran.
        ouverte = true;
        poser({
          messages: [...fil, { role: 'assistant', content: recu }],
          attente: false,
          ecrit: true,
        });
      } else {
        poser({ messages: [...fil, { role: 'assistant', content: recu }] });
      }
      surMorceau?.(recu, false);
    }
    recu += decodeur.decode();

    const final = recu || MSG_VIDE;
    poser({ messages: [...fil, { role: 'assistant', content: final }], attente: false, ecrit: false });
    surMorceau?.(final, true);
    return final;
  } catch {
    poser({
      messages: [...fil, { role: 'assistant', content: MSG_RESEAU }],
      attente: false,
      ecrit: false,
    });
    surMorceau?.(MSG_RESEAU, true);
    return MSG_RESEAU;
  }
}
