import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import ShareBar from '@/components/ShareBar';
import Surprise from '@/components/Surprise';
import { CATEGORY_SLUGS, getQuestion, QUESTIONS } from '@/lib/questions';
import { SITE_URL } from '@/lib/config';
import { enMorceaux, sansEmphase } from '@/lib/emphase';
import { titreDeFiche } from '@/lib/titre-seo';
import { descriptionDeFiche } from '@/lib/description-seo';
import { faitDe, surpriseDuJour } from '@/lib/surprises';
import dates from '@/lib/dates-fiches.json';

// Les fiches sont figees a la construction : sans cela, la decouverte
// resterait bloquee sur le jour de la mise en ligne. Une heure suffit.
export const revalidate = 3600;

interface Props {
  params: { slug: string };
}

// Marquage des liens vers les autres sites de la famille. Sans lui, on ne
// saurait jamais si ces passerelles servent a quelque chose : on croirait les
// sites relies alors qu'ils seraient seulement voisins.
function passerelle(url: string, campagne: string): string {
  return `${url}${url.includes('?') ? '&' : '?'}utm_source=halalgpt&utm_medium=passerelle&utm_campaign=${campagne}`;
}

const MOIS = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
];

/** « 2026-08-08T… » → « 8 août 2026 ». */
function enClair(iso: string): string {
  const d = new Date(iso);
  return `${d.getUTCDate()} ${MOIS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

const DATES: Record<string, { publie: string; modifie: string }> = dates;

export function generateStaticParams() {
  return QUESTIONS.map((q) => ({ slug: q.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const qa = getQuestion(params.slug);
  if (!qa) return {};
  // `absolute` court-circuite le gabarit « %s — HalalGPT » du layout : c'est
  // titreDeFiche qui decide si la marque tient dans les 60 caracteres que
  // Google affiche, ou s'il vaut mieux la sacrifier pour montrer la question
  // en entier. Laisser le gabarit faire coupait 22 fiches sur 189.
  const { titre } = titreDeFiche(qa);
  // Meme raison pour la description : `short` est ecrit pour etre lu SUR la
  // page et sert aussi de resume dans le chat. Sur 193 fiches, 51 depassaient
  // les 160 caracteres que Google affiche, et il les coupait au milieu d'un
  // mot. On choisit la coupe plutot que de la subir.
  const description = descriptionDeFiche(qa);
  return {
    title: { absolute: titre },
    description,
    alternates: { canonical: `${SITE_URL}/q/${qa.slug}` },
    openGraph: {
      title: qa.question,
      description,
      url: `${SITE_URL}/q/${qa.slug}`,
    },
  };
}

export default function QuestionPage({ params }: Props) {
  const qa = getQuestion(params.slug);
  if (!qa) notFound();

  const related = qa.related
    .map((slug) => getQuestion(slug))
    .filter((q): q is NonNullable<typeof q> => Boolean(q));

  const date = DATES[qa.slug];
  const jour = surpriseDuJour();
  const decouverte = getQuestion(jour.slug);

  // Deux blocs de donnees structurees, deux roles distincts :
  //   · FAQPage decrit la reponse — c'est lui qui peut valoir un resultat
  //     enrichi dans Google, et les dates lui disent que la page est vivante.
  //     Sur un sujet ou l'on engage la responsabilite de quelqu'un, une date de
  //     mise a jour honnete vaut autant pour le lecteur que pour le moteur.
  //   · BreadcrumbList decrit la place de la fiche dans le site : c'est ce qui
  //     remplace l'adresse brute par un vrai chemin sous le resultat.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    ...(date ? { datePublished: date.publie, dateModified: date.modifie } : {}),
    inLanguage: 'fr-FR',
    mainEntity: [
      {
        '@type': 'Question',
        name: qa.question,
        acceptedAnswer: {
          '@type': 'Answer',
          // Sans `sansEmphase`, les marqueurs de gras partaient tels quels
          // dans les donnees structurees — donc chez Google.
          text: sansEmphase(`${qa.short} ${qa.answer.join(' ')}`),
        },
      },
    ],
  };

  const filAriane = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Questions', item: `${SITE_URL}/questions` },
      {
        '@type': 'ListItem',
        position: 3,
        name: qa.category,
        // La table des slugs, jamais un toLowerCase() : « Vie quotidienne » et
        // « Priere » donneraient des adresses qui n'existent pas.
        item: `${SITE_URL}/categorie/${CATEGORY_SLUGS[qa.category]}`,
      },
      { '@type': 'ListItem', position: 4, name: qa.question, item: `${SITE_URL}/q/${qa.slug}` },
    ],
  };

  return (
    <article className="article">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(filAriane) }}
      />

      {/* La categorie devient un lien : chaque fiche renvoie desormais vers son
          hub, et le hub vers ses fiches. C'est le maillage interne le moins
          couteux et le plus rentable du site. */}
      <p className="breadcrumb">
        <Link href="/">Accueil</Link> › <Link href="/questions">Questions</Link> ›{' '}
        <Link href={`/categorie/${CATEGORY_SLUGS[qa.category]}`}>{qa.category}</Link>
      </p>

      <h1>{qa.question}</h1>
      <div className="verdict-badge">{qa.verdict}</div>

      {date && (
        <p className="article-date">
          <time dateTime={date.modifie}>Mis à jour le {enClair(date.modifie)}</time>
          {date.modifie !== date.publie && ` · publié le ${enClair(date.publie)}`}
        </p>
      )}

      <p className="article-lead">{qa.short}</p>

      <div className="article-body">
        {qa.answer.map((paragraph, i) => (
          <p key={i}>
            {enMorceaux(paragraph).map((m, j) =>
              m.gras ? <strong key={j}>{m.texte}</strong> : <span key={j}>{m.texte}</span>,
            )}
          </p>
        ))}
      </div>

      {/* Le fait passe devant la question dans le message envoye : « Ce
          colorant rouge est fait avec un insecte. » se raconte, « Le E120
          est-il halal ? » ne se raconte pas. */}
      <ShareBar
        question={qa.question}
        verdict={qa.verdict}
        url={`${SITE_URL}/q/${qa.slug}`}
        fait={faitDe(qa.slug)}
      />

      <div className="cta-box">
        <p>Une autre question halal ? L’IA te répond en quelques secondes 👇</p>
        <Link href="/" className="cta-button">
          💬 Poser ma question à HalalGPT
        </Link>
        {(qa.category === 'Voyage' || qa.category === 'Destinations') && (
          <p className="cta-secondary">
            🗺 Adresses halal vérifiées, mosquées et hôtels :{' '}
            <a href={passerelle('https://www.voyageshalal.fr', 'fiche-voyage')} target="_blank" rel="noopener">
              VoyagesHalal.fr
            </a>
          </p>
        )}
        {(qa.category === 'Additifs' || qa.category === 'Produits' || qa.category === 'Alimentation') && (
          <p className="cta-secondary">
            🛒 Au supermarché ? Scanne le code-barres du produit :{' '}
            <a href={passerelle('https://halalcheck.fr', 'fiche-produit')} target="_blank" rel="noopener">
              HalalCheck.fr
            </a>{' '}
            ✓ — verdict immédiat en rayon
          </p>
        )}
      </div>

      {/* La decouverte du jour, ici aussi. Elle ne vivait que sur l'accueil —
          or personne n'arrive par l'accueil : on arrive de Google, sur une
          fiche, on lit sa reponse, et on repart. C'est ici que se joue la
          seule question qui compte pour ce produit : est-ce qu'il en lit une
          deuxieme ? */}
      {decouverte && decouverte.slug !== qa.slug && (
        <section className="decouverte decouverte-fiche">
          <p className="decouverte-sur">La découverte du jour</p>
          <p className="decouverte-fait">{jour.fait}</p>
          <div className="decouverte-bas">
            <Link href={`/q/${decouverte.slug}`} className="decouverte-lien">
              {decouverte.verdict} — voir pourquoi →
            </Link>
            <Surprise exclure={qa.slug} />
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="related">
          <h2>Questions liées</h2>
          <div className="cards">
            {related.map((r) => (
              <Link key={r.slug} href={`/q/${r.slug}`} className="card">
                <span className="card-verdict">{r.verdict}</span>
                <span className="card-question">{r.question}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <p className="article-note">
        HalalGPT présente les avis religieux répandus à titre informatif, avec leurs divergences
        lorsqu’elles existent. Pour une situation personnelle, rapprochez-vous d’un savant ou d’un
        organisme de certification. Les compositions de produits peuvent évoluer : vérifiez
        toujours l’étiquette.
      </p>
    </article>
  );
}
