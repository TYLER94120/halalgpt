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
    'Posez votre question halal, obtenez une réponse claire et instantanée : additifs (E120, E471…), produits, restaurants halal, voyage, Ramadan.',
  openGraph: {
    siteName: SITE_NAME,
    type: 'website',
    locale: 'fr_FR',
  },
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
          </p>
          <p className="footer-note">
            HalalGPT présente les avis religieux répandus à titre informatif. Pour une situation
            personnelle, rapprochez-vous d’un savant ou d’un organisme de certification.
          </p>
          <p className="footer-note">Un projet de la famille VoyagesHalal 🗺</p>
        </footer>
      </body>
    </html>
  );
}
