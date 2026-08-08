'use client';

import { useEffect, useRef, useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  image?: string; // dataURL JPEG (photo de l'utilisateur)
}

const SUGGESTIONS = [
  '🔍 Le E120 est-il halal ?',
  '🕌 Comment rattraper mes prières ?',
  '🍬 Les Haribo sont-ils halal ?',
  '✈️ Repas halal en avion ?',
];

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
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [speechOK, setSpeechOK] = useState(false);
  const [savedThread, setSavedThread] = useState<Message[]>([]);
  const endRef = useRef<HTMLDivElement>(null);
  const lastAssistantRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<{ stop: () => void } | null>(null);

  const hasConversation = messages.length > 0;

  // ── Défilement intelligent ──
  // Réponse de l'IA → on montre le DÉBUT de la réponse (pas la fin !).
  // Message utilisateur / « en train d'écrire » → on suit le bas.
  useEffect(() => {
    if (!hasConversation) return;
    const last = messages[messages.length - 1];
    if (!loading && last?.role === 'assistant') {
      lastAssistantRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [messages, loading, hasConversation]);

  // Le micro n'est proposé que si le navigateur sait dicter (Chrome, Safari…).
  useEffect(() => {
    const w = window as unknown as Record<string, unknown>;
    setSpeechOK(Boolean(w.SpeechRecognition || w.webkitSpeechRecognition));
    setSavedThread(loadThread());
  }, []);

  // On enregistre le fil à chaque échange terminé. La page d'accueil reste
  // volontairement vierge au chargement (zéro friction) : la conversation
  // précédente se reprend d'un geste, elle ne s'impose jamais.
  useEffect(() => {
    if (messages.length > 0) saveThread(messages);
  }, [messages]);

  const resumeThread = () => {
    setMessages(savedThread);
    setSavedThread([]);
  };

  const newConversation = () => {
    setMessages([]);
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

    const next: Message[] = [...messages, { role: 'user', content: text, ...(image ? { image } : {}) }];
    setMessages(next);
    setInput('');
    setSuggestions([]);
    setPendingImage(null);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Économie : seule la photo du DERNIER message part vers l'IA,
        // les photos des anciens messages restent affichées mais ne repartent pas.
        body: JSON.stringify({
          messages: next.map((m, i) => ({
            role: m.role,
            content: m.content,
            ...(m.image && i === next.length - 1 ? { image: m.image } : {}),
          })),
        }),
      });
      const data = (await res.json()) as { reply?: string };
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.reply ?? "Désolé, je n'ai pas pu répondre. Réessaie dans un instant 🙏",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Oups, petit souci de connexion 📡 Réessaie dans un instant.',
        },
      ]);
    } finally {
      setLoading(false);
    }
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
