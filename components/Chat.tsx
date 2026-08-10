'use client';

import { useEffect, useRef, useState } from 'react';

import {
  demander,
  ecouter,
  etatCourant,
  poserLeFil,
  type Message,
} from '@/lib/conversation';

// Trois, pas quatre, et courtes. Sur un téléphone, chaque suggestion longue
// prend une ligne entière : quatre d'entre elles remplissaient l'écran sous le
// champ de saisie et donnaient l'impression d'un formulaire. Mohamed :
// « on a perdu le côté épuré, on a tout entassé ». Elles sont là pour montrer
// ce qu'on PEUT demander, pas pour proposer un menu.
const SUGGESTIONS = ['E120', 'Haribo', 'Rattraper mes prières'];

interface Suggestion {
  slug: string;
  question: string;
  verdict: string;
}

// ─── Mémoire de la conversation ───────────────────────────────────────────────
// Le chat gardait tout en mémoire vive : fermer l'onglet effaçait l'échange.
// On garde désormais le fil 7 jours dans le navigateur (rien n'est envoyé à un
// serveur). Les photos ne sont PAS conservées : trop lourdes pour le stockage
// local, et l'échange reste lisible sans elles.
const THREAD_KEY = 'halalgpt:thread';
const THREAD_MAX_AGE = 7 * 24 * 60 * 60 * 1000;
const THREAD_MAX_MESSAGES = 20;

function loadThread(): Message[] {
  try {
    const raw = localStorage.getItem(THREAD_KEY);
    if (!raw) return [];
    const saved = JSON.parse(raw) as { at?: number; messages?: Message[] };
    if (!saved.at || Date.now() - saved.at > THREAD_MAX_AGE) {
      localStorage.removeItem(THREAD_KEY);
      return [];
    }
    return Array.isArray(saved.messages) ? saved.messages : [];
  } catch {
    return [];
  }
}

function saveThread(messages: Message[]): void {
  try {
    if (messages.length === 0) {
      localStorage.removeItem(THREAD_KEY);
      return;
    }
    const light = messages
      .slice(-THREAD_MAX_MESSAGES)
      .map(({ role, content }) => ({ role, content }));
    localStorage.setItem(THREAD_KEY, JSON.stringify({ at: Date.now(), messages: light }));
  } catch {
    /* stockage plein ou navigation privée : la conversation reste en mémoire vive */
  }
}

// Redimensionne une photo côté téléphone (max 1024px, JPEG) : envoi léger,
// analyse IA moins chère, et on reste sous les limites de la requête.
async function compressImage(file: File): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = reject;
    el.src = dataUrl;
  });
  const max = 1024;
  const scale = Math.min(1, max / Math.max(img.width, img.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  const ctx = canvas.getContext('2d');
  if (!ctx) return dataUrl;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', 0.82);
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  // « en train de s'écrire » : distinct de « en attente ». L'un montre les
  // points de suspension, l'autre laisse le texte se dérouler.
  const [streaming, setStreaming] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [speechOK, setSpeechOK] = useState(false);
  const [savedThread, setSavedThread] = useState<Message[]>([]);
  const endRef = useRef<HTMLDivElement>(null);
  const lastAssistantRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<{ stop: () => void } | null>(null);
  // Passe à vrai dès que le lecteur fait défiler lui-même : on ne lui reprend
  // plus la vue tant qu'un nouveau message n'est pas apparu.
  const lecteurAuVolantRef = useRef(false);

  const hasConversation = messages.length > 0;

  // ── Défilement ──
  //
  // Le bug signalé par Mohamed : « pendant qu'il écrivait, ça me remontait
  // tout le temps ; j'essayais de descendre pour lire et ça remontait
  // automatiquement ».
  //
  // La cause était ici. Cet effet dépendait de `messages`, dont le CONTENU
  // change à chaque mot reçu — donc il replaçait la vue au début de la
  // réponse des dizaines de fois par seconde, en écrasant chaque geste de
  // lecture. L'intention était bonne (montrer le début de la réponse, pas la
  // fin), l'exécution la rendait insupportable.
  //
  // Deux corrections :
  //   1. on ne se replace qu'au moment où un message APPARAÎT — d'où la
  //      dépendance sur le nombre de messages et non sur leur contenu. Une
  //      fois placé au début de la réponse, le texte pousse vers le bas tout
  //      seul : il n'y a plus rien à faire ;
  //   2. dès que le lecteur fait défiler lui-même, on ne touche plus à rien.
  //      Reprendre la main sur quelqu'un qui lit est la pire chose à faire.
  const nombreDeMessages = messages.length;
  const roleDuDernier = messages[nombreDeMessages - 1]?.role;

  useEffect(() => {
    const surDefilement = () => {
      lecteurAuVolantRef.current = true;
    };
    window.addEventListener('wheel', surDefilement, { passive: true });
    window.addEventListener('touchmove', surDefilement, { passive: true });
    return () => {
      window.removeEventListener('wheel', surDefilement);
      window.removeEventListener('touchmove', surDefilement);
    };
  }, []);

  useEffect(() => {
    if (!nombreDeMessages) return;
    // Le garde-fou : si le lecteur a fait défiler lui-même depuis sa dernière
    // question, on ne lui reprend PAS la vue. Il est remis à zéro dans send(),
    // c'est-à-dire quand il agit — poser une question, c'est vouloir suivre la
    // réponse ; faire défiler pendant qu'elle s'écrit, c'est vouloir lire.
    if (lecteurAuVolantRef.current) return;
    if (roleDuDernier === 'assistant') {
      lastAssistantRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [nombreDeMessages, roleDuDernier]);

  // Le micro n'est proposé que si le navigateur sait dicter (Chrome, Safari…).
  useEffect(() => {
    const w = window as unknown as Record<string, unknown>;
    setSpeechOK(Boolean(w.SpeechRecognition || w.webkitSpeechRecognition));
    setSavedThread(loadThread());
  }, []);

  // ── On se rebranche sur une réponse déjà en route ──
  //
  // Le composant n'est plus le propriétaire de la réponse, seulement son
  // spectateur. Quand Mohamed ouvre une fiche puis revient, le Chat est
  // démonté puis remonté — mais la requête, elle, n'a jamais été interrompue :
  // elle vit dans lib/conversation.ts. On récupère donc ici où elle en est,
  // et on continue de la suivre.
  useEffect(() => {
    const courant = etatCourant();
    if (courant.messages.length) {
      setMessages(courant.messages);
      setLoading(courant.attente);
      setStreaming(courant.ecrit);
    }
    return ecouter((e) => {
      setMessages(e.messages);
      setLoading(e.attente);
      setStreaming(e.ecrit);
    });
  }, []);

  // On enregistre le fil à chaque échange TERMINÉ. La page d'accueil reste
  // volontairement vierge au chargement (zéro friction) : la conversation
  // précédente se reprend d'un geste, elle ne s'impose jamais.
  //
  // Le garde-fou `streaming` compte : pendant que la réponse s'écrit, l'état
  // change des dizaines de fois par seconde. Sans lui, on sérialiserait et on
  // réécrirait tout le fil à chaque mot — sur un téléphone modeste, ça se voit.
  useEffect(() => {
    if (messages.length > 0 && !streaming) saveThread(messages);
  }, [messages, streaming]);

  const resumeThread = () => {
    poserLeFil(savedThread);
    setSavedThread([]);
    // Le cas que le magasin ne peut PAS rattraper : Mohamed a rechargé la page
    // (ou fermé l'onglet) pendant que la réponse arrivait. Aucun code côté
    // navigateur ne survit à ça — la requête est morte avec la page.
    //
    // Ce qu'on retrouve alors, c'est un fil qui se termine par une question
    // sans réponse. On la relance, une fois, au moment où il demande à
    // reprendre : c'est exactement ce qu'il attendait quand il a écrit « la
    // réponse n'a pas continué à tourner ».
    const dernier = savedThread[savedThread.length - 1];
    if (dernier?.role === 'user') void demander(savedThread);
  };

  const newConversation = () => {
    poserLeFil([]);
    setSavedThread([]);
    setInput('');
    setPendingImage(null);
    saveThread([]);
  };

  // « La réponse avant la question » : dès 2 lettres tapées, les fiches
  // correspondantes apparaissent — instantané, zéro appel IA.
  useEffect(() => {
    if (hasConversation) return;
    const q = input.trim();
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/suggest?q=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        });
        const data = (await res.json()) as { suggestions?: Suggestion[] };
        setSuggestions(data.suggestions ?? []);
      } catch {
        /* frappe suivante ou abandon : silencieux */
      }
    }, 150);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [input, hasConversation]);

  // ── Dictaphone (Web Speech API, gratuit, dans le navigateur) ──
  const toggleMic = () => {
    if (recording) {
      recognitionRef.current?.stop();
      return;
    }
    const w = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionLike;
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    };
    const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!Ctor) return;
    const rec = new Ctor();
    rec.lang = 'fr-FR';
    rec.interimResults = true;
    rec.continuous = false;
    rec.onresult = (event) => {
      let text = '';
      for (let i = 0; i < event.results.length; i += 1) {
        text += event.results[i][0].transcript;
      }
      setInput(text);
    };
    rec.onend = () => setRecording(false);
    rec.onerror = () => setRecording(false);
    recognitionRef.current = rec;
    setRecording(true);
    rec.start();
  };

  const pickPhoto = () => fileRef.current?.click();

  // Partage d'une réponse : natif sur mobile, WhatsApp en secours.
  const shareAnswer = async (text: string) => {
    const payload = `${text}\n\n🌙 Réponse de HalalGPT, l’IA musulmane — https://halalgpt.fr`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'HalalGPT', text: payload });
      } catch {
        /* partage annulé */
      }
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(payload)}`, '_blank', 'noopener');
    }
  };

  const onPhotoSelected = async (file: File | undefined) => {
    if (!file) return;
    try {
      setPendingImage(await compressImage(file));
    } catch {
      /* photo illisible : on ignore sans casser le chat */
    }
  };

  const send = async (rawText: string) => {
    const cleaned = rawText.replace(/^[^\p{L}\p{N}]+\s*/u, '').trim() || rawText.trim();
    const image = pendingImage;
    const text = cleaned || (image ? 'Analyse cette photo : est-ce halal ?' : '');
    if ((!text && !image) || loading) return;

    if (recording) recognitionRef.current?.stop();

    // Il pose une question : il veut suivre la réponse. On reprend donc la
    // main sur le défilement, une fois, ici — et nulle part ailleurs.
    lecteurAuVolantRef.current = false;

    const next: Message[] = [
      ...messages,
      { role: 'user', content: text, ...(image ? { image } : {}) },
    ];
    setInput('');
    setSuggestions([]);
    setPendingImage(null);

    // La demande part du magasin, PAS d'ici : c'est ce qui lui permet de
    // survivre à l'ouverture d'une fiche. Le composant se contente d'écouter,
    // et l'abonnement mis en place plus haut met l'écran à jour.
    await demander(next);
  };

  const composer = (
    <form
      className="chat-composer"
      onSubmit={(e) => {
        e.preventDefault();
        send(input);
      }}
    >
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        onChange={(e) => {
          void onPhotoSelected(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
      <button
        type="button"
        className="chat-tool"
        onClick={pickPhoto}
        aria-label="Ajouter une photo (produit, étiquette…)"
        title="Photo d'un produit ou d'une étiquette"
      >
        📷
      </button>
      {speechOK && (
        <button
          type="button"
          className={`chat-tool ${recording ? 'recording' : ''}`}
          onClick={toggleMic}
          aria-label={recording ? 'Arrêter la dictée' : 'Dicter ma question'}
          title="Dicter ma question"
        >
          🎤
        </button>
      )}
      <input
        className="chat-input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={recording ? 'Je t’écoute… 🎙' : 'Ta question…'}
        aria-label="Votre question"
        autoFocus={!hasConversation}
      />
      <button
        type="submit"
        className="chat-send"
        disabled={(!input.trim() && !pendingImage) || loading}
        aria-label="Envoyer"
      >
        ➤
      </button>
    </form>
  );

  const preview = pendingImage && (
    <div className="photo-preview">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={pendingImage} alt="Photo à envoyer" />
      <span>Photo prête — ajoute une question ou envoie directement</span>
      <button type="button" onClick={() => setPendingImage(null)} aria-label="Retirer la photo">
        ✕
      </button>
    </div>
  );

  // ── Mode « Google » : champ visible immédiatement, zéro friction ──
  if (!hasConversation) {
    return (
      <div className="chat chat-landing">
        {composer}
        {preview}
        {suggestions.length > 0 ? (
          <div className="suggest-list" role="listbox" aria-label="Réponses instantanées">
            {suggestions.map((s) => (
              <button
                key={s.slug}
                type="button"
                className="suggest-item"
                onClick={() => send(s.question)}
              >
                <span className="suggest-verdict">{s.verdict}</span>
                <span className="suggest-question">{s.question}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="chat-suggestions">
            {/* « Reprendre » sort de la rangée des exemples, et c'est un vrai
                choix, pas de la cosmétique : ce ne sont pas des objets de même
                nature. Les exemples montrent ce qu'on PEUT demander ; celui-ci
                agit sur la conversation de Mohamed. Côte à côte, le plus gros
                écrasait les autres et jetait « E120 » toute seule au bout de la
                ligne — la capture du 10 août le montrait sans discussion. */}
            {savedThread.length > 0 && (
              <button type="button" className="chip chip-reprendre" onClick={resumeThread}>
                ↩︎ Reprendre ma conversation
              </button>
            )}
            {SUGGESTIONS.map((s) => (
              <button key={s} type="button" className="chip" onClick={() => send(s)}>
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── Mode conversation ──
  const lastAssistantIndex = messages.map((m) => m.role).lastIndexOf('assistant');

  return (
    <div className="chat">
      <div className="chat-topbar">
        <button type="button" className="chat-new" onClick={newConversation}>
          ✨ Nouvelle question
        </button>
      </div>
      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className="bubble-block">
            <div
              className={`bubble ${m.role}`}
              ref={i === lastAssistantIndex ? lastAssistantRef : undefined}
            >
              {m.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="bubble-photo" src={m.image} alt="Photo envoyée" />
              )}
              {m.content}
            </div>
            {m.role === 'assistant' && (
              <button
                type="button"
                className="bubble-share"
                onClick={() => shareAnswer(m.content)}
                aria-label="Partager cette réponse"
              >
                📤 Partager
              </button>
            )}
          </div>
        ))}
        {loading && (
          <div className="bubble assistant typing" aria-label="HalalGPT écrit…">
            <span />
            <span />
            <span />
          </div>
        )}
        <div ref={endRef} />
      </div>
      {preview}
      {composer}
    </div>
  );
}

// Typage minimal de l'API de dictée du navigateur (absente des types TS de base).
interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
}
