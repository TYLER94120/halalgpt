import Link from 'next/link';

import Chat from '@/components/Chat';
import Surprise from '@/components/Surprise';
import { QUESTIONS, getQuestion } from '@/lib/questions';
import { surpriseDuJour } from '@/lib/surprises';

// La decouverte change de quantieme en quantieme. La page reste servie en
// statique — donc instantanee — et se refabrique toutes les heures : sans
// cela, elle serait figee sur le jour de la mise en ligne.
export const revalidate = 3600;

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

  const jour = surpriseDuJour();
  const decouverte = getQuestion(jour.slug);

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

      {/* Le mode conduite est propose ICI, juste sous le chat, et pas dans un
          menu : personne ne va chercher dans un menu une fonction dont il
          ignore l'existence. Il est volontairement discret — c'est un usage
          minoritaire, il ne doit pas encombrer l'accueil de tous les autres. */}
      <Link href="/conduite" className="lien-conduite">
        🚗 <strong>En voiture ?</strong> Pose ta question à la voix et écoute la
        réponse, sans toucher l’écran.
      </Link>

      {/* La decouverte du jour. Elle est posee APRES le chat, jamais avant :
          la page d'accueil doit rester vide au premier regard, c'est la regle
          de Mohamed et elle ne bouge pas. Ce qui ramene quelqu'un sur une IA
          de reponse, ce n'est pas une serie de jours — personne n'a une
          question halal quotidienne — c'est d'avoir appris ici quelque chose
          qu'il ignorait, et d'avoir eu envie de le raconter. */}
      {decouverte && (
        <section className="section decouverte">
          <p className="decouverte-sur">La découverte du jour</p>
          <p className="decouverte-fait">{jour.fait}</p>
          <div className="decouverte-bas">
            <Link href={`/q/${decouverte.slug}`} className="decouverte-lien">
              {decouverte.verdict} — voir pourquoi →
            </Link>
            <Surprise exclure={decouverte.slug} />
          </div>
        </section>
      )}

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
