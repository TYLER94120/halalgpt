'use client';

import { useState } from 'react';

// Envoyer le fait du jour, depuis l'accueil, sans avoir a ouvrir la fiche.
//
// Le fait etait affiche ici et nulle part ailleurs, et il n'y avait aucun
// moyen de l'envoyer d'ici : il fallait ouvrir la fiche, puis y trouver la
// barre de partage — deux gestes de trop pour une envie qui dure trois
// secondes. Or c'est exactement ce moment-la qu'on essaie d'attraper :
// quelqu'un lit « ce colorant rouge est fait avec un insecte » et veut le
// dire a quelqu'un.
//
// Un seul bouton, pas une barre de trois : l'accueil doit rester epure, c'est
// la regle de Mohamed et elle passe avant cette fonction.
export default function PartagerLeFait({ fait, url }: { fait: string; url: string }) {
  const [etat, setEtat] = useState<'pret' | 'copie'>('pret');

  const texte = `${fait}\n\n👉 ${url}\n\n🌙 HalalGPT — l’IA musulmane`;

  const partager = async () => {
    // Sur telephone, le partage natif ouvre WhatsApp, Messages, Signal — ce
    // que la personne utilise vraiment. Sur ordinateur il n'existe pas : on
    // copie, et on le DIT, sinon l'appui n'a l'air de rien faire.
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: 'HalalGPT', text: fait, url });
        return;
      } catch {
        /* partage annule : on ne fait rien, surtout pas un message d'erreur */
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(texte);
      setEtat('copie');
      setTimeout(() => setEtat('pret'), 2200);
    } catch {
      window.open(
        `https://wa.me/?text=${encodeURIComponent(texte)}`,
        '_blank',
        'noopener',
      );
    }
  };

  return (
    <button
      type="button"
      className="surprise-bouton partager-fait"
      onClick={partager}
      data-texte={texte}
      aria-label="Envoyer cette découverte"
    >
      {etat === 'copie' ? '✓ Copié !' : '📤 Envoyer'}
    </button>
  );
}
