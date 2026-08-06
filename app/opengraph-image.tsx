import { ImageResponse } from 'next/og';

// Image de partage (WhatsApp, réseaux sociaux) générée automatiquement.
export const runtime = 'edge';
export const alt = 'HalalGPT — L’IA qui répond à toutes vos questions halal';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0b1a0f',
          color: '#fdfaf3',
          fontFamily: 'serif',
        }}
      >
        <div style={{ fontSize: 110, marginBottom: 10 }}>🌙</div>
        <div style={{ display: 'flex', fontSize: 96, fontWeight: 800 }}>
          <span>Halal</span>
          <span style={{ color: '#c9a84c' }}>GPT</span>
        </div>
        <div style={{ fontSize: 34, color: 'rgba(253,250,243,0.75)', marginTop: 18 }}>
          Une question halal ? Une réponse claire, tout de suite.
        </div>
        <div
          style={{
            marginTop: 34,
            padding: '14px 34px',
            borderRadius: 999,
            backgroundColor: '#c9a84c',
            color: '#0b1a0f',
            fontSize: 30,
            fontWeight: 700,
          }}
        >
          halalgpt.fr
        </div>
      </div>
    ),
    { ...size, emoji: 'twemoji' }
  );
}
