import type { Metadata } from 'next';

import LaboClient from './LaboClient';

// Page de travail : elle ne doit jamais apparaitre dans Google, ni dans le
// sitemap. Elle sert a trancher deux decisions produit, puis elle disparaitra.
export const metadata: Metadata = {
  title: 'Labo son',
  robots: { index: false, follow: false, nocache: true },
};

export default function Page() {
  return <LaboClient />;
}
