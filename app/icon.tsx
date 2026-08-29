import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// Dynamic Favicon Generation using original vertical trident SVG path
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#000000',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          border: '1.5px solid rgba(255,255,255,0.2)',
          color: '#ffffff',
        }}
      >
        <svg
          viewBox="0 0 100 120"
          style={{ 
            width: '58%', 
            height: '58%',
            display: 'block'
          }}
        >
          <path
            d="M 50 110 L 50 10 M 25 45 C 25 80 75 80 75 45 M 25 45 L 25 15 M 75 45 L 75 15"
            stroke="#ffffff"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
