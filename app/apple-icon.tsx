import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

// Icône iOS (« Ajouter à l'écran d'accueil » sur iPhone).
export default function AppleIcon() {
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
          background: '#0b1a0f',
        }}
      >
        <svg width="96" height="96" viewBox="0 0 100 100">
          <path d="M 66 8 A 44 44 0 1 0 66 92 A 36 36 0 1 1 66 8 Z" fill="#c9a84c" />
        </svg>
        <div style={{ fontSize: 24, color: '#fdfaf3', fontWeight: 700, marginTop: 4 }}>HalalGPT</div>
      </div>
    ),
    size
  );
}
