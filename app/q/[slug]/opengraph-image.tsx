import { ImageResponse } from 'next/og';

import { getQuestion } from '@/lib/questions';

// Image de partage personnalisée par question : quand quelqu'un partage une
// page sur WhatsApp, l'aperçu montre LA question et son verdict.
export const runtime = 'edge';
export const alt = 'HalalGPT — réponse halal';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function QuestionOGImage({ params }: { params: { slug: string } }) {
  const qa = getQuestion(params.slug);
  const question = qa?.question ?? 'Une question halal ?';
  const verdict = qa?.verdict ?? 'HalalGPT répond';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#0b1a0f',
          color: '#fdfaf3',
          padding: 70,
          fontFamily: 'serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 40, fontWeight: 800 }}>
          <span style={{ marginRight: 14 }}>🌙</span>
          <span>Halal</span>
          <span style={{ color: '#c9a84c' }}>GPT</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.15 }}>{question}</div>
          <div
            style={{
              marginTop: 34,
              alignSelf: 'flex-start',
              padding: '14px 30px',
              borderRadius: 999,
              backgroundColor: '#1b4332',
              border: '3px solid #c9a84c',
              fontSize: 34,
              fontWeight: 700,
            }}
          >
            {verdict}
          </div>
        </div>

        <div style={{ fontSize: 30, color: 'rgba(253,250,243,0.7)' }}>
          La réponse claire et nuancée → halalgpt.fr
        </div>
      </div>
    ),
    { ...size, emoji: 'twemoji' }
  );
}
