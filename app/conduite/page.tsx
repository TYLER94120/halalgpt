import type { Metadata } from 'next';

import ModeConduite from '@/components/ModeConduite';
import { SITE_URL } from '@/lib/config';

export const metadata: Metadata = {
  title: { absolute: 'Mode conduite : poser une question à la voix — HalalGPT' },
  description:
    'Pose ta question à voix haute et écoute la réponse, sans toucher l’écran. Pensé pour la voiture : un seul bouton, rien à lire.',
  alternates: { canonical: `${SITE_URL}/conduite` },
  openGraph: {
    title: 'Mode conduite — HalalGPT',
    description: 'Pose ta question à voix haute, écoute la réponse. Un seul bouton.',
    url: `${SITE_URL}/conduite`,
  },
};

export default function PageConduite() {
  return <ModeConduite />;
}
