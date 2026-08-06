import type { Metadata } from 'next';
import Link from 'next/link';

import { SITE_URL } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Mentions légales',
  description: 'Mentions légales du site HalalGPT.fr : éditeur, hébergeur, propriété intellectuelle.',
  alternates: { canonical: `${SITE_URL}/mentions-legales` },
  robots: { index: false, follow: true },
};

export default function MentionsLegalesPage() {
  return (
    <div className="article">
      <h1>Mentions légales</h1>

      <div className="article-body">
        <h2>Éditeur du site</h2>
        <p>
          Le site halalgpt.fr est édité à titre personnel et non professionnel, conformément à
          l’article 6-III-2 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans
          l’économie numérique (LCEN). HalalGPT fait partie de la même famille de sites que{' '}
          <a href="https://www.voyageshalal.fr" target="_blank" rel="noopener">
            VoyagesHalal.fr
          </a>
          .
        </p>
        <p>
          Pour toute demande concernant le site, contactez-nous via la page{' '}
          <a href="https://www.voyageshalal.fr/contact" target="_blank" rel="noopener">
            contact de VoyagesHalal.fr
          </a>
          .
        </p>

        <h2>Hébergeur</h2>
        <p>
          Vercel Inc.
          <br />
          440 N Barranca Ave #4133, Covina, CA 91723, États-Unis
          <br />
          Site :{' '}
          <a href="https://vercel.com" target="_blank" rel="noopener">
            vercel.com
          </a>
        </p>

        <h2>Propriété intellectuelle</h2>
        <p>
          L’ensemble des contenus du site (textes, structure, marque HalalGPT) est protégé par le
          droit de la propriété intellectuelle. Toute reproduction substantielle sans autorisation
          est interdite. Les courtes citations avec lien vers la page d’origine sont les
          bienvenues.
        </p>

        <h2>Nature des contenus</h2>
        <p>
          HalalGPT présente les avis religieux répandus à titre purement informatif, avec leurs
          divergences lorsqu’il y en a. Le site ne délivre pas de fatwa personnelle et ne remplace
          ni un savant ni un organisme de certification. Pour une situation personnelle,
          rapprochez-vous d’une personne qualifiée.
        </p>

        <p className="article-note">
          Voir aussi : <Link href="/confidentialite">Politique de confidentialité</Link>
        </p>
      </div>
    </div>
  );
}
