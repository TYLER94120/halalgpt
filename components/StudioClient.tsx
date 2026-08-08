'use client';

import { useEffect, useMemo, useState } from 'react';

// ─── Studio vidéo HalalGPT ────────────────────────────────────────────────────
// Une fiche → une séquence verticale animée de 15 secondes, prête à être
// capturée avec l'enregistreur d'écran du téléphone.
// Déroulé : accroche (0-3s) · suspense (3-6s) · verdict (6-10s) ·
// explication (10-13s) · adresse du site (13-15s).

interface Fiche {
  slug: string;
  question: string;
  verdict: string;
  short: string;
  category: string;
}

const ETAPES = [
  { debut: 0, fin: 3000, nom: 'accroche' },
  { debut: 3000, fin: 6000, nom: 'suspense' },
  { debut: 6000, fin: 10000, nom: 'verdict' },
  { debut: 10000, fin: 13500, nom: 'explication' },
  { debut: 13500, fin: 15000, nom: 'signature' },
] as const;

const DUREE = 15000;

/** « Le E120 (carmin) est-il halal ? » → « Le E120 (carmin) » */
function sujet(question: string): string {
  return question
    .replace(/\s*(est-il|est-elle|sont-ils|sont-elles|sont|est)\s+.*$/i, '')
    .replace(/\s*\?\s*$/, '')
    .trim();
}

export default function StudioClient({ fiches }: { fiches: Fiche[] }) {
  const [slug, setSlug] = useState(fiches[0]?.slug ?? '');
  const [enLecture, setEnLecture] = useState(false);
  const [temps, setTemps] = useState(0);

  const fiche = useMemo(() => fiches.find((f) => f.slug === slug) ?? fiches[0], [fiches, slug]);

  useEffect(() => {
    if (!enLecture) return;
    const depart = Date.now();
    const timer = setInterval(() => {
      const ecoule = Date.now() - depart;
      if (ecoule >= DUREE) {
        setTemps(DUREE);
        setEnLecture(false);
        clearInterval(timer);
      } else {
        setTemps(ecoule);
      }
    }, 50);
    return () => clearInterval(timer);
  }, [enLecture]);

  const lancer = () => {
    setTemps(0);
    setEnLecture(true);
  };

  const etape = ETAPES.find((e) => temps >= e.debut && temps < e.fin)?.nom ?? 'accroche';
  const progression = Math.min(100, (temps / DUREE) * 100);

  if (!fiche) return null;

  return (
    <div className="studio">
      <div className="studio-reglages">
        <h1>🎬 Studio vidéo</h1>
        <p className="studio-aide">
          Choisis une fiche, lance la séquence, et enregistre ton écran (15 secondes).
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
          {enLecture ? '● Enregistrement en cours…' : '▶ Lancer la séquence (15 s)'}
        </button>
      </div>

      <div className="studio-scene">
        <div className="studio-progression" style={{ width: `${progression}%` }} />

        {etape === 'accroche' && (
          <div className="studio-bloc studio-apparait">
            <p className="studio-sur">Tu en manges peut-être toutes les semaines…</p>
            <h2 className="studio-titre">{sujet(fiche.question)}</h2>
          </div>
        )}

        {etape === 'suspense' && (
          <div className="studio-bloc studio-apparait">
            <h2 className="studio-titre">{fiche.question}</h2>
            <div className="studio-points">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}

        {etape === 'verdict' && (
          <div className="studio-bloc studio-apparait">
            <p className="studio-sur">La réponse</p>
            <div className="studio-verdict">{fiche.verdict}</div>
          </div>
        )}

        {etape === 'explication' && (
          <div className="studio-bloc studio-apparait">
            <p className="studio-explication">{fiche.short}</p>
          </div>
        )}

        {etape === 'signature' && (
          <div className="studio-bloc studio-apparait studio-signature">
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
