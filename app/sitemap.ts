import type { MetadataRoute } from 'next';

import { CATEGORIES, CATEGORY_SLUGS, QUESTIONS } from '@/lib/questions';
import { SITE_URL } from '@/lib/config';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/questions`, changeFrequency: 'daily', priority: 0.9 },
    ...CATEGORIES.map((c) => ({
      url: `${SITE_URL}/categorie/${CATEGORY_SLUGS[c]}`,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    })),
    ...QUESTIONS.map((q) => ({
      url: `${SITE_URL}/q/${q.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];
}
