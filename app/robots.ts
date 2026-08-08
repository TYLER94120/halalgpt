import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/lib/config';

export default function robots(): MetadataRoute.Robots {
  return {
    // /apprendre/ et /labo-son sont des pages de travail : elles servent a
    // faire juger un produit avant sa mise en ligne, pas a etre trouvees. Le
    // site d'apprentissage vivra sur son propre domaine ; deux adresses pour
    // un meme contenu se feraient concurrence dans Google.
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/apprendre/', '/labo-son'] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
