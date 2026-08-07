import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';

// Icône PWA 512×512 (any + maskable) : croissant or sur nuit, marges sûres.
export function GET() {
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
        <svg width="264" height="264" viewBox="0 0 100 100">
          <path d="M 66 8 A 44 44 0 1 0 66 92 A 36 36 0 1 1 66 8 Z" fill="#c9a84c" />
        </svg>
        <div style={{ fontSize: 64, color: '#fdfaf3', fontWeight: 700, marginTop: 14 }}>HalalGPT</div>
      </div>
    ),
    { width: 512, height: 512 }
  );
}
