import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getQuestion, QUESTIONS } from '@/lib/questions';
import { SITE_URL } from '@/lib/config';

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return QUESTIONS.map((q) => ({ slug: q.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const qa = getQuestion(params.slug);
  if (!qa) return {};
  return {
    title: qa.question,
    description: qa.short,
    alternates: { canonical: `${SITE_URL}/q/${qa.slug}` },
    openGraph: {
      title: qa.question,
      description: qa.short,
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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: qa.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${qa.short} ${qa.answer.join(' ')}`,
        },
      },
    ],
  };

  return (
    <article className="article">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <p className="breadcrumb">
        <Link href="/">Accueil</Link> › <Link href="/questions">Questions</Link> › {qa.category}
      </p>

      <h1>{qa.question}</h1>
      <div className="verdict-badge">{qa.verdict}</div>

      <p className="article-lead">{qa.short}</p>

      <div className="article-body">
        {qa.answer.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      <div className="cta-box">
        <p>Une autre question halal ? L’IA te répond en quelques secondes 👇</p>
        <Link href="/" className="cta-button">
          💬 Poser ma question à HalalGPT
        </Link>
      </div>

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
