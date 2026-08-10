'use client';

import { useEffect } from 'react';

// Signale au serveur qu'un visiteur est arrive par une passerelle de l'empire.
//
// Pourquoi cote navigateur plutot qu'en middleware : les fiches sont servies en
// statique, et un middleware s'executerait sur chaque requete, y compris les
// images. Ici, rien ne part tant qu'il n'y a pas d'`utm_source` — c'est-a-dire
// presque jamais, et exactement quand il faut.
//
// `sendBeacon` est fait pour ca : il remet le message au navigateur, qui
// l'envoie meme si la page se ferme dans la seconde. Un `fetch` classique
// serait annule par une navigation rapide, et on perdrait justement les
// visiteurs les plus presses.

export default function CompteurPasserelle() {
  useEffect(() => {
    let params: URLSearchParams;
    try {
      params = new URLSearchParams(window.location.search);
    } catch {
      return;
    }
    const source = params.get('utm_source');
    if (!source) return;

    // Une arrivee ne se compte qu'une fois : sans cela, un rechargement ou un
    // retour arriere gonflerait le compteur et la mesure mentirait.
    const cle = `halalgpt:passerelle:${source}:${window.location.pathname}`;
    try {
      if (sessionStorage.getItem(cle)) return;
      sessionStorage.setItem(cle, '1');
    } catch {
      /* navigation privee : on compte quand meme, une fois de trop vaut mieux
         que zero */
    }

    const charge = JSON.stringify({
      source,
      campagne: params.get('utm_campaign') ?? '',
      page: window.location.pathname,
    });

    try {
      const envoye =
        typeof navigator.sendBeacon === 'function' &&
        navigator.sendBeacon('/api/passerelle', new Blob([charge], { type: 'application/json' }));
      if (!envoye) {
        void fetch('/api/passerelle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: charge,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      /* un compteur ne casse jamais une visite */
    }
  }, []);

  return null;
}
