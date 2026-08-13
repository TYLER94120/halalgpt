import type { Metadata } from 'next';
import Link from 'next/link';
import { permanentRedirect, notFound } from 'next/navigation';

import { chercherParCode, enClair, estUnCodePlausible, fichesVoisines } from '@/lib/ecodes';
import { QUESTIONS } from '@/lib/questions';

// Pont de l'ecosysteme : halalgpt.fr/e/E471 → la fiche correspondante.
// HalalCheck (le scanner) n'a ainsi AUCUNE table de correspondance a maintenir :
// il connait le code additif, il construit l'adresse, on s'occupe du reste.
//
// Pourquoi ce fichier a cesse d'etre une simple redirection, le 13 aout 2026 :
// l'audit du matin a mesure que sur les 56 liens publies par la page
// halalcheck.fr/additifs.html, 36 tombaient sur /categorie/additifs. Or ces 36
// sont exactement les codes que le scanner classe « douteux ». Quelqu'un lisait
// « E472e » sur un paquet, voyait « douteux », appuyait pour comprendre — et
// recevait une liste de catégorie qui ne parlait pas de son code.
//
// Rediriger vers la catégorie n'etait pas une réponse, c'etait une facon de ne
// pas répondre. Une page qui dit « nous n'avons pas encore écrit cette fiche »
// vaut mieux : elle est honnête, et elle donne au lecteur de quoi avancer.

interface Props {
  params: { code: string };
}

export function generateMetadata({ params }: Props): Metadata {
  const code = enClair(params.code ?? '');
  return {
    title: { absolute: `${code} : fiche non encore publiée — HalalGPT` },
    description: `Nous n’avons pas encore publié notre analyse de l’additif ${code}. Voici les fiches d’additifs voisines et comment poser la question.`,
    // Volontairement hors de Google. Ces pages n'apportent pas de reponse :
    // les indexer reviendrait a fabriquer des centaines de pages minces,
    // exactement ce que l'audit du 13 aout reproche au reste du site.
    robots: { index: false, follow: true },
  };
}

export default function PasserelleCode({ params }: Props) {
  const brut = params.code ?? '';

  // Un code trouve part vers sa fiche, comme avant. 308 : c'est une adresse de
  // service, pas une page — Google doit suivre la fiche, pas celle-ci.
  const fiche = chercherParCode(QUESTIONS, brut);
  if (fiche) permanentRedirect(`/q/${fiche.slug}`);

  // Ce qui n'a pas la forme d'un code additif n'est pas une passerelle : c'est
  // une adresse inventee, et une 404 est la reponse juste.
  if (!estUnCodePlausible(brut)) notFound();

  const code = enClair(brut);
  const voisines = fichesVoisines(QUESTIONS, brut);

  return (
    <div className="article">
      <nav className="breadcrumb" aria-label="Fil d’Ariane">
        <Link href="/">Accueil</Link> ›{' '}
        <Link href="/categorie/additifs">Additifs</Link> › {code}
      </nav>

      <h1>
        {code} — <span style={{ color: 'var(--or)' }}>pas encore de fiche</span>
      </h1>

      <p className="article-lead">
        Nous n’avons pas encore publié notre analyse de cet additif. Plutôt que
        de vous donner un avis que nous n’avons pas écrit, nous préférons vous
        le dire clairement.
      </p>

      <div className="cta-box">
        <p>
          <strong>Ce que cette page ne dit pas :</strong> si {code} est halal ou
          non. Nous ne l’avons pas encore étudié, et deviner à partir d’un
          additif voisin serait malhonnête — deux numéros qui se suivent peuvent
          avoir des statuts opposés.
        </p>
      </div>

      {voisines.length > 0 && (
        <section>
          <h2>Les fiches d’additifs les plus proches par leur numéro</h2>
          <p className="article-note">
            Rapprochement par <strong>numéro</strong>, pas par verdict. Elles
            expliquent souvent la même question de fond — l’origine animale ou
            végétale — sans rien affirmer sur {code}.
          </p>
          <div className="cards">
            {voisines.map((q) => (
              <Link key={q.slug} href={`/q/${q.slug}`} className="card">
                <span className="card-verdict">{q.verdict}</span>
                <span className="card-question">{q.question}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="cta-box" style={{ marginTop: 40 }}>
        <p>Besoin d’une réponse sur {code} maintenant ?</p>
        <Link href="/" className="cta-button">
          💬 Poser la question à HalalGPT
        </Link>
        <p className="article-note" style={{ marginTop: 16 }}>
          Et si votre produit porte un code-barres,{' '}
          <a
            href="https://halalcheck.fr/scan.html?utm_source=halalgpt&utm_medium=passerelle&utm_campaign=code-sans-fiche"
            className="cta-secondary"
          >
            HalalCheck lit l’étiquette entière
          </a>{' '}
          — il analyse tous les ingrédients, pas seulement celui-ci.
        </p>
      </div>
    </div>
  );
}
