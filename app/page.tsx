import Link from 'next/link';

import Chat from '@/components/Chat';
import { QUESTIONS } from '@/lib/questions';

const POPULAR_SLUGS = [
  'e120-halal',
  'haribo-halal',
  'gelatine-halal',
  'restaurant-halal-paris',
  'voyage-halal-istanbul',
  'mcdo-halal',
  'voyage-halal-dubai',
  'repas-halal-avion',
];

export default function HomePage() {
  const popular = POPULAR_SLUGS
    .map((slug) => QUESTIONS.find((q) => q.slug === slug))
    .filter((q): q is NonNullable<typeof q> => Boolean(q));

  return (
    <>
      <section className="hero">
        <h1>
          Une question <span className="accent">halal</span> ?<br />
          Une réponse claire, tout de suite.
        </h1>
        <p className="hero-sub">
          Additifs, produits, restaurants, voyage, Ramadan — HalalGPT répond en quelques secondes.
        </p>
      </section>

      <Chat />

      <section className="section">
        <h2>
          Questions <span className="accent">populaires</span>
        </h2>
        <div className="cards">
          {popular.map((q) => (
            <Link key={q.slug} href={`/q/${q.slug}`} className="card">
              <span className="card-verdict">{q.verdict}</span>
              <span className="card-question">{q.question}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>
          Comment ça <span className="accent">marche</span> ?
        </h2>
        <div className="steps">
          <div className="step">
            <div className="step-emoji">💬</div>
            <h3>1. Pose ta question</h3>
            <p>E120, Haribo, resto halal à Lyon, repas en avion… tout ce qui touche au halal.</p>
          </div>
          <div className="step">
            <div className="step-emoji">⚡️</div>
            <h3>2. Réponse instantanée</h3>
            <p>Un verdict clair, l’explication essentielle, et les divergences quand il y en a.</p>
          </div>
          <div className="step">
            <div className="step-emoji">🗺</div>
            <h3>3. Passe à l’action</h3>
            <p>
              Restos, mosquées et hôtels halal vérifiés sur{' '}
              <a href="https://www.voyageshalal.fr" target="_blank" rel="noopener">
                VoyagesHalal.fr
              </a>
              , le guide voyage de la famille HalalGPT.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
