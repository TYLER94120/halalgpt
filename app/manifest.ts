import type { MetadataRoute } from 'next';

// Manifest PWA — « Ajouter à l'écran d'accueil » : HalalGPT devient une app
// avec icône, plein écran et raccourcis (appui long sur l'icône).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "HalalGPT — L'IA musulmane",
    short_name: 'HalalGPT',
    description:
      "Pose n'importe quelle question : la réponse tient toujours compte de l'islam. Additifs, produits, Ramadan, voyage, vie quotidienne.",
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#0b1a0f',
    theme_color: '#0b1a0f',
    lang: 'fr',
    categories: ['lifestyle', 'education', 'food'],
    icons: [
      { src: '/icon-192', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-512', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      { name: 'Poser une question', short_name: 'Question', url: '/', icons: [{ src: '/icon-192', sizes: '192x192' }] },
      { name: 'Toutes les questions', short_name: 'Questions', url: '/questions', icons: [{ src: '/icon-192', sizes: '192x192' }] },
      { name: 'Spécial Ramadan', short_name: 'Ramadan', url: '/categorie/ramadan', icons: [{ src: '/icon-192', sizes: '192x192' }] },
    ],
  };
}
