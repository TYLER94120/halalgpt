'use client';

import { useEffect, useRef, useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTIONS = [
  '🔍 Le E120 est-il halal ?',
  '🍬 Les Haribo sont-ils halal ?',
  '🍽 Où manger halal à Paris ?',
  '✈️ Repas halal en avion ?',
];

interface Suggestion {
  slug: string;
  question: string;
  verdict: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const endRef = useRef<HTMLDivElement>(null);

  const hasConversation = messages.length > 0;

  useEffect(() => {
    if (hasConversation) {
      endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [messages, loading, hasConversation]);

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

  const send = async (rawText: string) => {
    const text = rawText.replace(/^[^\p{L}\p{N}]+\s*/u, '').trim() || rawText.trim();
    if (!text || loading) return;

    const next: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setInput('');
    setSuggestions([]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
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
        className="chat-input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Pose ta question halal…"
        aria-label="Votre question"
        autoFocus={!hasConversation}
      />
      <button
        type="submit"
        className="chat-send"
        disabled={!input.trim() || loading}
        aria-label="Envoyer"
      >
        ➤
      </button>
    </form>
  );

  // ── Mode « Google » : champ visible immédiatement, zéro friction ──
  if (!hasConversation) {
    return (
      <div className="chat chat-landing">
        {composer}
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
  return (
    <div className="chat">
      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={`bubble ${m.role}`}>
            {m.content}
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
      {composer}
    </div>
  );
}
