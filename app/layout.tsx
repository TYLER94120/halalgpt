import { Analytics } from '@vercel/analytics/react';

import CompteurPasserelle from '@/components/CompteurPasserelle';
import type { Metadata } from 'next';
import { DM_Sans, Playfair_Display } from 'next/font/google';
import Link from 'next/link';

import { SITE_NAME, SITE_TAGLINE, SITE_URL } from '@/lib/config';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-titre',
  weight: ['700', '800', '900'],
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-corps',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s — ${SITE_NAME}`,
  },
  description:
    "HalalGPT, l'IA musulmane : pose n'importe quelle question, la réponse tient toujours compte de l'islam. Additifs (E120, E471…), produits, Ramadan, prière, voyage, vie quotidienne.",
  openGraph: {
    siteName: SITE_NAME,
    type: 'website',
    locale: 'fr_FR',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${playfair.variable} ${dmSans.variable}`}>
      <body>
        <header className="site-header">
          <Link href="/" className="logo">
            <span className="logo-emoji">🌙</span>
            <span className="logo-text">HalalGPT</span>
          </Link>
          <nav className="site-nav">
            <Link href="/questions" className="nav-link">
              Toutes les questions
            </Link>
          </nav>
        </header>

        <main>{children}</main>

        <footer className="site-footer">
          <p className="footer-brand">🌙 {SITE_NAME} — {SITE_TAGLINE}</p>
          <p className="footer-links">
            <Link href="/questions">Toutes les questions</Link>
            <span aria-hidden> · </span>
            <Link href="/">Poser une question</Link>
            <span aria-hidden> · </span>
            <Link href="/mentions-legales">Mentions légales</Link>
            <span aria-hidden> · </span>
            <Link href="/confidentialite">Confidentialité</Link>
          </p>
          <p className="footer-note">
            HalalGPT présente les avis religieux répandus à titre informatif. Pour une situation
            personnelle, rapprochez-vous d’un savant ou d’un organisme de certification.
          </p>
          <p className="footer-note">
            La famille HalalGPT :{' '}
            <a
              href="https://www.voyageshalal.fr?utm_source=halalgpt&utm_medium=passerelle&utm_campaign=pied-famille"
              target="_blank"
              rel="noopener"
            >
              VoyagesHalal.fr 🗺
            </a>{' '}
            — le guide du voyage halal
            <span aria-hidden> · </span>
            <a
              href="https://halalcheck.fr?utm_source=halalgpt&utm_medium=passerelle&utm_campaign=pied-famille"
              target="_blank"
              rel="noopener"
            >
              HalalCheck.fr ✓
            </a>{' '}
            — scanne tes courses, verdict halal immédiat
          </p>
        </footer>
        <Analytics />
        {/* Vercel Analytics mesure deja les arrivees, mais seul Mohamed peut ouvrir
            ce tableau de bord. Ce compteur-la ecrit dans Redis, et /api/mine
            l'affiche : n'importe quel agent peut donc repondre seul a « est-ce
            que cette passerelle amene quelqu'un ? ». */}
        <CompteurPasserelle />
      </body>
    </html>
  );
}
