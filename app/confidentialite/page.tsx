import type { Metadata } from 'next';
import Link from 'next/link';

import { SITE_URL } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Politique de confidentialité',
  description:
    'Confidentialité sur HalalGPT.fr : pas de compte, pas de cookies publicitaires, questions anonymisées.',
  alternates: { canonical: `${SITE_URL}/confidentialite` },
  robots: { index: false, follow: true },
};

export default function ConfidentialitePage() {
  return (
    <div className="article">
      <h1>Politique de confidentialité</h1>

      <div className="article-body">
        <p className="article-lead">
          HalalGPT est conçu pour fonctionner sans collecter de données personnelles : pas de
          compte, pas d’inscription, pas de cookies publicitaires.
        </p>

        <h2>Ce que nous collectons</h2>
        <p>
          <strong>Les questions posées au chat</strong> : le texte des questions est enregistré de
          façon anonyme (sans nom, sans e-mail, sans identifiant permettant de vous reconnaître)
          afin d’améliorer le service et de créer de nouvelles pages de réponses. Ne saisissez pas
          d’informations personnelles dans vos questions.
        </p>
        <p>
          <strong>Mesure d’audience</strong> : nous utilisons Vercel Analytics, un outil de mesure
          d’audience sans cookies qui produit des statistiques agrégées (nombre de visites, pages
          consultées) sans suivre les visiteurs individuellement.
        </p>

        <h2>Ce que nous ne faisons pas</h2>
        <p>
          Pas de cookies publicitaires, pas de revente de données, pas de profilage, pas de
          formulaire collectant des données personnelles. Les réponses fréquentes sont mises en
          cache de manière anonyme pour être servies plus vite.
        </p>

        <h2>Sous-traitants techniques</h2>
        <p>
          Le site est hébergé par Vercel Inc. (États-Unis). Les réponses de l’assistant sont
          générées via l’API d’Anthropic. Le cache et les statistiques de questions sont stockés
          chez Upstash. Ces prestataires traitent les données de façon anonyme, uniquement pour
          faire fonctionner le service.
        </p>

        <h2>Vos droits</h2>
        <p>
          Les données étant anonymes, nous ne pouvons pas les relier à une personne. Pour toute
          question relative à la confidentialité, contactez-nous via la page{' '}
          <a href="https://www.voyageshalal.fr/contact" target="_blank" rel="noopener">
            contact de VoyagesHalal.fr
          </a>
          .
        </p>

        <p className="article-note">
          Voir aussi : <Link href="/mentions-legales">Mentions légales</Link>
        </p>
      </div>
    </div>
  );
}
