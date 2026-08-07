'use client';

import { useState } from 'react';

// Barre de partage d'une fiche : natif (mobile), WhatsApp, copier le lien.
// Le partage est LE moteur de croissance : une réponse claire circule dans
// les groupes familiaux WhatsApp — chaque partage ramène des visiteurs.
export default function ShareBar({
  question,
  verdict,
  url,
}: {
  question: string;
  verdict: string;
  url: string;
}) {
  const [copied, setCopied] = useState(false);

  const text = `${question}\n${verdict}\n\n${url}\n\n🌙 HalalGPT — l’IA musulmane`;

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'HalalGPT', text: `${question}\n${verdict}`, url });
        return;
      } catch {
        /* partage annulé : rien à faire */
      }
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard indisponible : silencieux */
    }
  };

  return (
    <div className="share-bar" aria-label="Partager cette réponse">
      <button type="button" className="share-btn" onClick={nativeShare}>
        📤 Partager
      </button>
      <a
        className="share-btn"
        href={`https://wa.me/?text=${encodeURIComponent(text)}`}
        target="_blank"
        rel="noopener"
      >
        💬 WhatsApp
      </a>
      <button type="button" className="share-btn" onClick={copy}>
        {copied ? '✓ Copié !' : '🔗 Copier le lien'}
      </button>
    </div>
  );
}
