'use client';

import { useEffect, useRef, useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const WELCOME =
  "Salam ! 🌙 Je suis HalalGPT. Pose-moi n'importe quelle question halal : additifs, produits, restaurants, voyage, Ramadan…";

const SUGGESTIONS = [
  '🔍 Le E120 est-il halal ?',
  '🍬 Les Haribo sont-ils halal ?',
  '🍽 Où manger halal à Paris ?',
  '✈️ Repas halal en avion ?',
];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: WELCOME },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages, loading]);

  const send = async (rawText: string) => {
    const text = rawText.replace(/^[^\p{L}\p{N}]+\s*/u, '').trim() || rawText.trim();
    if (!text || loading) return;

    const next: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setInput('');
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

  const showSuggestions = messages.length <= 1 && !loading;

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

      {showSuggestions && (
        <div className="chat-suggestions">
          {SUGGESTIONS.map((s) => (
            <button key={s} type="button" className="chip" onClick={() => send(s)}>
              {s}
            </button>
          ))}
        </div>
      )}

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
    </div>
  );
}
