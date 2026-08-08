'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

import { SURPRISES } from '@/lib/surprises';

// « Surprends-moi » — le geste le plus repete des produits de decouverte.
//
// Le tirage est volontairement cote navigateur : la page reste statique, donc
// instantanee, et chaque appui donne un fait different. On evite seulement de
// retomber sur celui qu'on vient de voir — rien n'est plus decevant qu'un
// bouton « au hasard » qui rejoue la meme chose.

export default function Surprise({ exclure }: { exclure?: string }) {
  const router = useRouter();
  const [vus, setVus] = useState<string[]>(exclure ? [exclure] : []);

  const tirer = useCallback(() => {
    const restants = SURPRISES.filter((s) => !vus.includes(s.slug));
    // Tout vu : on repart du debut plutot que de bloquer le bouton.
    const pool = restants.length ? restants : SURPRISES;
    const choisi = pool[Math.floor(Math.random() * pool.length)];
    setVus(restants.length ? [...vus, choisi.slug] : [choisi.slug]);
    router.push(`/q/${choisi.slug}`);
  }, [router, vus]);

  return (
    <button type="button" className="surprise-bouton" onClick={tirer}>
      🎲 Surprends-moi
    </button>
  );
}
