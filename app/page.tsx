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
          Ton IA <span className="accent">musulmane</span>.<br />
          Des réponses qui respectent ta religion.
        </h1>
        <p className="hero-sub">
          Nourriture, produits, Ramadan, voyage, vie de tous les jours… Pose n’importe quelle
          question : HalalGPT répond toujours en tenant compte de l’islam. Par la voix 🎤, par
          photo 📷 ou par écrit.
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
            <p>
              Écris, dicte 🎤 ou envoie la photo 📷 d’une étiquette. E120, Haribo, prières,
              Ramadan, quotidien… tout, vraiment tout.
            </p>
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
              Restos, mosquées et hôtels halal sur{' '}
              <a href="https://www.voyageshalal.fr" target="_blank" rel="noopener">
                VoyagesHalal.fr
              </a>{' '}
              — et en magasin, scanne le code-barres avec{' '}
              <a href="https://halalcheck.fr" target="_blank" rel="noopener">
                HalalCheck.fr
              </a>{' '}
              ✓. La même famille.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
