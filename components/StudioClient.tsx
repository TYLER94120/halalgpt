'use client';

import { Fragment, useEffect, useMemo, useState } from 'react';

// ─── Studio vidéo HalalGPT ────────────────────────────────────────────────────
// Une fiche → une séquence verticale animée, prête à être capturée avec
// l'enregistreur d'écran du téléphone (ou filmée automatiquement côté serveur).
//
// Déroulé : accroche · suspense · verdict · explication · signature.
// Les durées sont réglables par l'adresse (?t=3000,3000,4000,3500,1500) afin de
// coller exactement à une narration enregistrée. Le sujet aussi (?slug=...).

interface Fiche {
  slug: string;
  question: string;
  verdict: string;
  short: string;
  category: string;
}

const NOMS = ['accroche', 'question', 'verdict', 'detail', 'detail2', 'signature'] as const;
// Minutage cale sur une pulsation de 550 ms (le duff) : 5-4-6-5-5-3 temps.
const TEMPS = 550;
const DUREES_PAR_DEFAUT = [5, 5, 6, 5, 5, 3].map((t) => t * TEMPS);

/** Coupe le resume en deux ecrans courts : un ecran fixe trop longtemps perd le regard. */
function deuxTemps(texte: string): [string, string] {
  const phrases = texte.split(/(?<=[.!?])\s+/);
  if (phrases.length >= 2) {
    const moitie = Math.ceil(phrases.length / 2);
    return [phrases.slice(0, moitie).join(' '), phrases.slice(moitie).join(' ')];
  }
  const mots = texte.split(' ');
  const coupe = Math.ceil(mots.length / 2);
  return [mots.slice(0, coupe).join(' '), mots.slice(coupe).join(' ')];
}

/** Découpe un titre en mots animés un par un : le regard suit, l'attention tient. */
function Mots({ texte, depart = 0 }: { texte: string; depart?: number }) {
  return (
    <>
      {texte.split(' ').map((mot, i) => (
        <Fragment key={`${mot}-${i}`}>
          {/* L'espace se place ENTRE les blocs : c'est lui qui autorise le
              retour à la ligne. Sans lui, une suite d'inline-block ne peut pas
              se couper et le texte déborde de l'écran. */}
          {i > 0 && ' '}
          <span className="studio-mot" style={{ animationDelay: `${depart + i * 55}ms` }}>
            {mot}
          </span>
        </Fragment>
      ))}
    </>
  );
}

/** « Le E120 (carmin) est-il halal ? » → « Le E120 (carmin) » */
function sujet(question: string): string {
  return question
    .replace(/\s*(est-il|est-elle|sont-ils|sont-elles|sont|est)\s+.*$/i, '')
    .replace(/\s*\?\s*$/, '')
    .trim();
}

export default function StudioClient({ fiches }: { fiches: Fiche[] }) {
  const [slug, setSlug] = useState(fiches[0]?.slug ?? '');
  const [durees, setDurees] = useState<number[]>(DUREES_PAR_DEFAUT);
  const [accroche, setAccroche] = useState('Tu en consommes peut-être chaque semaine…');
  const [enLecture, setEnLecture] = useState(false);
  const [temps, setTemps] = useState(0);

  // Réglages transmis par l'adresse (utilisés par la production automatisée).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const demande = params.get('slug');
    if (demande && fiches.some((f) => f.slug === demande)) setSlug(demande);
    const h = params.get('h');
    if (h) setAccroche(h);
    const t = params.get('t');
    if (t) {
      const valeurs = t.split(',').map(Number).filter((n) => Number.isFinite(n) && n > 0);
      if (valeurs.length === NOMS.length) setDurees(valeurs);
    }
  }, [fiches]);

  const etapes = useMemo(() => {
    let curseur = 0;
    return NOMS.map((nom, i) => {
      const debut = curseur;
      curseur += durees[i];
      return { nom, debut, fin: curseur };
    });
  }, [durees]);

  const total = etapes[etapes.length - 1]?.fin ?? 15000;
  const fiche = useMemo(() => fiches.find((f) => f.slug === slug) ?? fiches[0], [fiches, slug]);

  useEffect(() => {
    if (!enLecture) return;
    const depart = Date.now();
    const timer = setInterval(() => {
      const ecoule = Date.now() - depart;
      if (ecoule >= total) {
        setTemps(total);
        setEnLecture(false);
        clearInterval(timer);
      } else {
        setTemps(ecoule);
      }
    }, 40);
    return () => clearInterval(timer);
  }, [enLecture, total]);

  const lancer = () => {
    setTemps(0);
    setEnLecture(true);
  };

  const etape = etapes.find((e) => temps >= e.debut && temps < e.fin)?.nom ?? 'accroche';
  const progression = Math.min(100, (temps / total) * 100);

  if (!fiche) return null;

  return (
    <div className="studio">
      <div className="studio-reglages">
        <h1>🎬 Studio vidéo</h1>
        <p className="studio-aide">
          Choisis une fiche, lance la séquence, et enregistre ton écran.
          Sur iPhone : Centre de contrôle → Enregistrement. Sur Android : Enregistreur d’écran.
        </p>
        <label className="studio-label" htmlFor="fiche">
          Sujet de la vidéo
        </label>
        <select
          id="fiche"
          className="studio-select"
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            setTemps(0);
            setEnLecture(false);
          }}
        >
          {fiches.map((f) => (
            <option key={f.slug} value={f.slug}>
              {f.category} — {f.question}
            </option>
          ))}
        </select>
        <button type="button" className="studio-lancer" onClick={lancer} disabled={enLecture}>
          {enLecture ? '● Séquence en cours…' : '▶ Lancer la séquence'}
        </button>
      </div>

      <div className={`studio-scene ${enLecture ? 'studio-zoom studio-pulse' : ''}`}>
        <div className="studio-motif" aria-hidden />
        <div className="studio-halo" aria-hidden />
        <div className="studio-progression" style={{ width: `${progression}%` }} />

        {etape === 'accroche' && (
          <div key="a" className="studio-bloc studio-ouverture">
            {/* Les 2 premières secondes décident de tout : l'accroche est déjà
                là à la première image, elle frappe, et un éclat doré balaie
                l'écran. Aucun fondu, aucune attente. */}
            <div className="studio-eclair" aria-hidden />
            <h2 className="studio-hook">{accroche}</h2>
            <p className="studio-sujet">{sujet(fiche.question)}</p>
          </div>
        )}

        {etape === 'question' && (
          <div key="s" className="studio-bloc studio-apparait">
            <h2 className="studio-titre">
              <Mots texte={fiche.question} />
            </h2>
            <div className="studio-points">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}

        {etape === 'verdict' && (
          <div key="v" className="studio-bloc studio-apparait">
            <p className="studio-sur">La réponse</p>
            <div className="studio-verdict studio-tampon">{fiche.verdict}</div>
          </div>
        )}

        {etape === 'detail' && (
          <div key="e1" className="studio-bloc studio-apparait">
            <p className="studio-explication">
              <Mots texte={deuxTemps(fiche.short)[0]} />
            </p>
          </div>
        )}

        {etape === 'detail2' && (
          <div key="e2" className="studio-bloc studio-apparait">
            <p className="studio-explication">
              <Mots texte={deuxTemps(fiche.short)[1]} />
            </p>
          </div>
        )}

        {etape === 'signature' && (
          <div key="g" className="studio-bloc studio-apparait studio-signature">
            <div className="studio-logo">
              🌙 Halal<span>GPT</span>
            </div>
            <p className="studio-sous-logo">L’IA musulmane</p>
            <p className="studio-url">halalgpt.fr</p>
          </div>
        )}

        <div className="studio-filigrane">halalgpt.fr</div>
      </div>
    </div>
  );
}
