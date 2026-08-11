import Link from 'next/link';

import Chat from '@/components/Chat';
import Surprise from '@/components/Surprise';
import { QUESTIONS, getQuestion } from '@/lib/questions';
import { surpriseDuJour } from '@/lib/surprises';

// La decouverte change de quantieme en quantieme. La page reste servie en
// statique — donc instantanee — et se refabrique toutes les heures : sans
// cela, elle serait figee sur le jour de la mise en ligne.
export const revalidate = 3600;

// L'accueil doit refleter ce que le site EST, pas ce par quoi il a commence.
//
// Mohamed, 11 aout : « le site est encore trop oriente nourriture ». Il avait
// raison, et ca se voyait ici plus qu'ailleurs : les huit questions mises en
// avant etaient 3 additifs/produits, 1 restaurant, 3 voyages, 1 avion —
// AUCUNE priere, AUCUNE vie quotidienne. Quelqu'un qui arrivait sans nous
// connaitre repartait en pensant qu'on repond sur les etiquettes.
//
// Deux par famille desormais : nourriture, priere et pratique, vie
// quotidienne, voyage. Le catalogue reste a 55 % nourriture — c'est un fait —
// mais la vitrine annonce l'IA musulmane generaliste qu'on construit.
const POPULAR_SLUGS = [
  'e120-halal',
  'haribo-halal',
  'rattraper-prieres-ratees',
  'se-convertir-islam',
  'musique-halal',
  'tatouage-halal',
  'restaurant-halal-paris',
  'voyage-halal-istanbul',
];

export default function HomePage() {
  const popular = POPULAR_SLUGS
    .map((slug) => QUESTIONS.find((q) => q.slug === slug))
    .filter((q): q is NonNullable<typeof q> => Boolean(q));

  const jour = surpriseDuJour();
  const decouverte = getQuestion(jour.slug);

  return (
    <>
      {/* L'accueil occupe le premier ecran, et RIEN d'autre n'y apparait.
          Capture de Mohamed a 14h52 : entre le lien « En voiture ? » et le
          trait il restait un grand vide, puis la decouverte du jour etait
          coupee en deux par le bas de l'ecran. La page ne s'arretait toujours
          pas — elle debordait, et un bloc a moitie visible est precisement ce
          qui donne l'impression que deux pages s'entremelent.
          Cette zone se centre sur la hauteur disponible : le trait tombe donc
          au bas de l'ecran, jamais au milieu. */}
      <div className="accueil-zone">
      {/* Un titre, une ligne, le champ. Rien de plus.
          Avant : un titre sur trois lignes, puis un sous-titre sur deux, avant
          meme d'atteindre le champ de saisie. L'accueil parlait beaucoup avant
          de laisser parler — et la deuxieme phrase du titre (« des reponses qui
          respectent ta religion ») disait deja ce que le sous-titre repetait.
          Le mot-cle « IA musulmane » reste dans le h1, donc rien n'est perdu
          pour Google. */}
      <section className="hero">
        <h1>
          Ton IA <span className="accent">musulmane</span>.
        </h1>
        <p className="hero-sub">Pose ta question. La réponse tient compte de l’islam.</p>
      </section>

      <Chat />

      {/* Le mode conduite est propose ICI, juste sous le chat, et pas dans un
          menu : personne ne va chercher dans un menu une fonction dont il
          ignore l'existence. Il est volontairement discret — c'est un usage
          minoritaire, il ne doit pas encombrer l'accueil de tous les autres. */}
      <Link href="/conduite" className="lien-conduite">
        🚗 En voiture ? Pose ta question à la voix
      </Link>
      </div>

      {/* ── Ici finit la page d'accueil ──
          Mohamed : « la page d'accueil et la page suivante s'entremelent, il
          faut que la page d'accueil soit clean ».
          Il avait raison et la cause etait visible sur la capture : le chat,
          la decouverte du jour et les huit questions etaient TOUS rendus avec
          la meme carte verte bordee. Trois choses de nature differente, un
          seul habillage — l'oeil ne voyait qu'une pile d'objets identiques et
          ne pouvait pas savoir ou l'accueil s'arretait.
          Ce qui suit est donc une ZONE, separee par un trait et de l'espace.
          Au-dessus : poser sa question. En dessous : explorer. */}
      <div className="apres">
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

      {/* Le bloc « Comment ca marche » a ete retire de l'accueil le 10 aout.
          Il expliquait en trois etapes illustrees comment poser une question,
          alors que le champ de saisie est en haut de la page et se passe de
          mode d'emploi : environ 600 px pour n'apprendre rien a personne.

          J'avais d'abord garde ses deux liens vers la famille dans une bande
          ici. La capture de la page entiere a montre l'erreur : le pied de
          page portait DEJA ces deux liens, trois centimetres plus bas. Je
          desencombrais d'un cote en dupliquant de l'autre. La bande est
          supprimee, et les liens du pied — qui n'etaient pas balises, donc
          dont on n'aurait jamais rien su — le sont maintenant. */}
      </div>
    </>
  );
}
