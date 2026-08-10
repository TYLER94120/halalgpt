'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';

import { aDireMaintenant, NOTE_ARABE } from '@/lib/voix.js';

// Le mode conduite : poser une question à la voix, entendre la réponse.
//
// Pourquoi un écran séparé et pas un bouton dans le chat : au volant, on ne
// lit pas, on ne vise pas, on ne fait pas défiler. Toute l'interface tient
// dans UN bouton qui occupe la moitié de l'écran, et rien d'autre n'est
// cliquable. Un mode conduite qui demande de viser un bouton de 40 pixels
// n'est pas un mode conduite.
//
// Ce que ce composant ne fera jamais : prononcer un verset avec une voix de
// synthèse. Le tri se fait dans lib/voix.js, et il est verrouillé par
// scripts/test-voix.mjs.

type Etat = 'pret' | 'ecoute' | 'reflechit' | 'parle';

interface ReconnaissanceLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: { error?: string }) => void) | null;
}

const LIBELLE: Record<Etat, string> = {
  pret: 'Appuie et parle',
  ecoute: 'Je t’écoute…',
  reflechit: 'Je cherche…',
  parle: 'Appuie pour m’arrêter',
};

export default function ModeConduite() {
  const [etat, setEtat] = useState<Etat>('pret');
  const [question, setQuestion] = useState('');
  const [reponse, setReponse] = useState('');
  const [souci, setSouci] = useState('');
  const [micOK, setMicOK] = useState<boolean | null>(null);
  const [voixOK, setVoixOK] = useState<boolean | null>(null);
  // Clavier de secours : la voix qui PARLE marche presque partout, la dictée
  // non. Sans ce repli, un téléphone qui ne sait pas écouter rendait tout
  // l'écran inutile, alors que la moitié utile fonctionnait.
  const [clavier, setClavier] = useState(false);
  const [saisie, setSaisie] = useState('');
  // Mains libres : quand il a fini de répondre, il réécoute tout seul. C'est
  // le modèle demandé par Mohamed — « comme Claude ou ChatGPT : lorsqu'on
  // parle, il répond directement ». Sans ça, c'est un talkie-walkie.
  const [mainsLibres, setMainsLibres] = useState(true);

  const recRef = useRef<ReconnaissanceLike | null>(null);
  const voixRef = useRef<SpeechSynthesisVoice | null>(null);
  const veilleRef = useRef<{ release: () => Promise<void> } | null>(null);
  const etatRef = useRef<Etat>('pret');
  const appuiRef = useRef<() => void>(() => {});
  const mainsLibresRef = useRef(true);
  const souciRef = useRef('');

  const majEtat = (e: Etat) => {
    etatRef.current = e;
    setEtat(e);
  };

  useEffect(() => {
    mainsLibresRef.current = mainsLibres;
  }, [mainsLibres]);

  // ── Ce que ce téléphone sait faire, mesuré et pas supposé ──────────────────
  useEffect(() => {
    const w = window as unknown as Record<string, unknown>;
    const sait = Boolean(w.SpeechRecognition || w.webkitSpeechRecognition);
    setMicOK(sait);
    // On n'attend pas que Mohamed appuie pour découvrir que ça ne marche pas :
    // si le navigateur ne sait pas écouter, le clavier est là tout de suite.
    if (!sait) setClavier(true);
    setVoixOK(typeof window.speechSynthesis !== 'undefined');

    const choisir = () => {
      const dispo = window.speechSynthesis?.getVoices?.() ?? [];
      voixRef.current =
        dispo.find((v) => v.lang?.toLowerCase().startsWith('fr')) ?? dispo[0] ?? null;
    };
    choisir();
    // La liste des voix arrive souvent APRÈS le premier appel : sans cet
    // écouteur, on parlerait avec une voix anglaise sur la première question.
    window.speechSynthesis?.addEventListener?.('voiceschanged', choisir);
    return () => window.speechSynthesis?.removeEventListener?.('voiceschanged', choisir);
  }, []);

  // ── Garder l'écran allumé ─────────────────────────────────────────────────
  // Sans ça, le téléphone s'éteint au bout de 30 secondes et la voix s'arrête
  // au milieu d'une phrase. Le verrou se perd quand on change d'application :
  // on le reprend au retour.
  useEffect(() => {
    const nav = navigator as unknown as {
      wakeLock?: { request: (t: string) => Promise<{ release: () => Promise<void> }> };
    };
    if (!nav.wakeLock) return;
    let vivant = true;
    const prendre = async () => {
      try {
        if (document.visibilityState === 'visible' && vivant) {
          veilleRef.current = await nav.wakeLock!.request('screen');
        }
      } catch {
        /* refusé (batterie faible, onglet caché) : l'écran s'éteindra, tant pis */
      }
    };
    void prendre();
    document.addEventListener('visibilitychange', prendre);
    return () => {
      vivant = false;
      document.removeEventListener('visibilitychange', prendre);
      void veilleRef.current?.release().catch(() => {});
    };
  }, []);

  const taire = useCallback(() => {
    try {
      window.speechSynthesis?.cancel();
    } catch {
      /* rien à annuler */
    }
  }, []);

  const dire = useCallback((texte: string) => {
    if (!texte.trim() || typeof window.speechSynthesis === 'undefined') return;
    const u = new SpeechSynthesisUtterance(texte);
    u.lang = 'fr-FR';
    if (voixRef.current) u.voice = voixRef.current;
    // Un peu plus lent que la normale : dans une voiture il y a du bruit, et
    // on n'a pas le texte sous les yeux pour rattraper un mot manqué.
    u.rate = 0.95;
    window.speechSynthesis.speak(u);
  }, []);

  const demander = useCallback(
    async (texte: string) => {
      majEtat('reflechit');
      setReponse('');
      let lu = 0;
      let prevenuArabe = false;

      const parlerCeQuiEstPret = (recu: string, fini: boolean) => {
        const { morceaux, lu: nouveau, arabeRetire } = aDireMaintenant(recu, lu, fini);
        lu = nouveau;
        if (arabeRetire && !prevenuArabe) {
          prevenuArabe = true;
          dire(NOTE_ARABE);
        }
        for (const m of morceaux) {
          if (etatRef.current !== 'parle') majEtat('parle');
          dire(m);
        }
      };

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: [{ role: 'user', content: texte }] }),
        });

        if (!res.body) {
          const t = await res.text();
          setReponse(t);
          parlerCeQuiEstPret(t, true);
          return;
        }

        const lecteur = res.body.getReader();
        const decodeur = new TextDecoder();
        let recu = '';
        for (;;) {
          const { done, value } = await lecteur.read();
          if (done) break;
          recu += decodeur.decode(value, { stream: true });
          setReponse(recu);
          // On parle dès qu'une phrase est terminée, sans attendre la fin :
          // au volant, plusieurs secondes de silence se lisent comme une panne
          // et on rappuie sur le bouton.
          parlerCeQuiEstPret(recu, false);
        }
        recu += decodeur.decode();
        setReponse(recu);
        parlerCeQuiEstPret(recu, true);
      } catch {
        const secours = 'Je n’arrive pas à me connecter. Réessaie dans un instant.';
        setReponse(secours);
        dire(secours);
      } finally {
        // La voix continue après la fin du flux : on ne repasse en « prêt »
        // que lorsqu'elle s'est vraiment tue, sinon le bouton dirait « appuie
        // et parle » pendant que la réponse est encore en train d'être lue.
        const attendreLaFin = () => {
          if (window.speechSynthesis?.speaking || window.speechSynthesis?.pending) {
            window.setTimeout(attendreLaFin, 400);
            return;
          }
          majEtat('pret');
          // Mains libres : il réécoute de lui-même. La pause d'une seconde
          // n'est pas cosmétique — sans elle, le micro s'ouvre pendant que le
          // haut-parleur finit de vibrer et la reconnaissance s'annule aussi
          // sec. C'est exactement le bug qu'on vient de corriger.
          if (mainsLibresRef.current && !souciRef.current) {
            window.setTimeout(() => {
              if (etatRef.current === 'pret') appuiRef.current();
            }, 1000);
          }
        };
        attendreLaFin();
      }
    },
    [dire],
  );

  const dire_souci = (m: string) => {
    souciRef.current = m;
    setSouci(m);
  };

  const appui = useCallback(() => {
    dire_souci('');

    if (etatRef.current === 'parle' || etatRef.current === 'reflechit') {
      taire();
      majEtat('pret');
      return;
    }
    if (etatRef.current === 'ecoute') {
      recRef.current?.stop();
      return;
    }

    // ── Déverrouillage de la voix, SANS empêcher le micro de démarrer ──
    //
    // Bug signalé par Mohamed : « le dictaphone ne fonctionne pas ». La cause
    // était ici, dans mon propre code. iOS n'autorise la synthèse vocale que
    // si elle a été réveillée pendant un geste de l'utilisateur, alors je la
    // réveillais avec un souffle — puis je démarrais le micro dans la foulée.
    // Le téléphone se retrouvait à PARLER ET ÉCOUTER en même temps, et la
    // reconnaissance s'annulait aussitôt, sans erreur visible.
    //
    // La correction : le souffle est muet (volume zéro) ET on le coupe net
    // avant d'ouvrir le micro. Le déverrouillage iOS reste acquis — il suffit
    // que speak() ait été appelé pendant le geste — mais plus rien ne sort du
    // haut-parleur quand la reconnaissance démarre.
    try {
      const souffle = new SpeechSynthesisUtterance(' ');
      souffle.volume = 0;
      window.speechSynthesis?.speak(souffle);
      window.speechSynthesis?.cancel();
    } catch {
      /* pas de synthèse : on le dira plus bas */
    }

    const w = window as unknown as {
      SpeechRecognition?: new () => ReconnaissanceLike;
      webkitSpeechRecognition?: new () => ReconnaissanceLike;
    };
    const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!Ctor) {
      dire_souci(
        'Ce navigateur ne sait pas écouter. Essaie avec Chrome — ou écris ta question, je la lirai à voix haute.',
      );
      setClavier(true);
      return;
    }

    const rec = new Ctor();
    rec.lang = 'fr-FR';
    rec.interimResults = true;
    rec.continuous = false;
    let dernier = '';
    rec.onresult = (e) => {
      let t = '';
      for (let i = 0; i < e.results.length; i += 1) t += e.results[i][0].transcript;
      dernier = t;
      setQuestion(t);
    };
    rec.onerror = (e) => {
      const code = e?.error ?? 'inconnu';
      majEtat('pret');
      // On DIT lequel : « ça ne marche pas » ne se répare pas, « not-allowed »
      // se répare. Mohamed n'a pas de console pour me le lire.
      if (code === 'not-allowed' || code === 'service-not-allowed') {
        dire_souci('Le micro est bloqué. Autorise-le dans les réglages du navigateur, puis réessaie.');
        setClavier(true);
      } else if (code === 'no-speech') {
        dire_souci('Je n’ai rien entendu. Réappuie et parle un peu plus fort.');
      } else if (code === 'network') {
        dire_souci('La dictée a besoin d’Internet et la connexion a lâché.');
      } else {
        dire_souci(`La dictée s’est arrêtée (${code}). Tu peux écrire ta question à la place.`);
        setClavier(true);
      }
    };
    rec.onend = () => {
      if (dernier.trim()) void demander(dernier.trim());
      else majEtat('pret');
    };
    recRef.current = rec;
    setQuestion('');
    setReponse('');
    majEtat('ecoute');
    try {
      rec.start();
    } catch {
      majEtat('pret');
      dire_souci('Le micro n’a pas démarré. Réessaie, ou écris ta question.');
      setClavier(true);
    }
  }, [demander, taire]);

  useEffect(() => {
    appuiRef.current = appui;
  }, [appui]);

  useEffect(() => () => {
    recRef.current?.abort?.();
    try {
      window.speechSynthesis?.cancel();
    } catch {
      /* rien à annuler */
    }
  }, []);

  const incapable = micOK === false || voixOK === false;

  return (
    <main className="conduite">
      <header className="conduite-tete">
        <Link href="/" className="conduite-retour">← Quitter</Link>
        <span className="conduite-titre">Mode conduite</span>
      </header>

      <button
        type="button"
        className={`conduite-bouton conduite-${etat}`}
        onClick={appui}
        aria-live="polite"
      >
        <span className="conduite-pictogramme" aria-hidden="true">
          {etat === 'ecoute' ? '🎙️' : etat === 'reflechit' ? '…' : etat === 'parle' ? '⏸' : '🎤'}
        </span>
        <span className="conduite-libelle">{LIBELLE[etat]}</span>
      </button>

      <label className="conduite-bascule">
        <input
          type="checkbox"
          checked={mainsLibres}
          onChange={(e) => setMainsLibres(e.target.checked)}
        />
        <span>Mains libres — il réécoute tout seul après avoir répondu</span>
      </label>

      {souci ? <p className="conduite-souci">{souci}</p> : null}

      {clavier ? (
        <form
          className="conduite-clavier"
          onSubmit={(e) => {
            e.preventDefault();
            const t = saisie.trim();
            if (!t) return;
            setSaisie('');
            setQuestion(t);
            void demander(t);
          }}
        >
          <input
            type="text"
            value={saisie}
            onChange={(e) => setSaisie(e.target.value)}
            placeholder="Écris ta question, je la lirai à voix haute"
            aria-label="Écris ta question"
          />
          <button type="submit">Envoyer</button>
        </form>
      ) : null}

      <div className="conduite-echange">
        {question ? <p className="conduite-question">« {question} »</p> : null}
        {reponse ? <p className="conduite-reponse">{reponse}</p> : null}
      </div>

      {incapable ? (
        <p className="conduite-souci">
          {micOK === false
            ? 'Ce navigateur ne sait pas écouter. Sur iPhone, ouvre halalgpt.fr dans Chrome ; sur Android, Chrome fonctionne. En attendant, écris ta question ci-dessus : la réponse sera lue à voix haute.'
            : 'Ce navigateur ne sait pas parler à voix haute.'}
        </p>
      ) : null}

      <p className="conduite-prudence">
        <strong>Règle de sécurité :</strong> lance le mode AVANT de démarrer, et pose
        le téléphone. Si tu dois regarder l’écran, arrête-toi. Une réponse peut
        attendre, pas la route.
      </p>
    </main>
  );
}
