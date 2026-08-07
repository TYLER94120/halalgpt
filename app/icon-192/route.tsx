import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';

// Icône PWA 192×192 (référencée par le manifest) : croissant or sur nuit.
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
        <svg width="104" height="104" viewBox="0 0 100 100">
          <path d="M 66 8 A 44 44 0 1 0 66 92 A 36 36 0 1 1 66 8 Z" fill="#c9a84c" />
        </svg>
        <div style={{ fontSize: 26, color: '#fdfaf3', fontWeight: 700, marginTop: 6 }}>HalalGPT</div>
      </div>
    ),
    { width: 192, height: 192 }
  );
}
