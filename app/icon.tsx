import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const alt = 'Vertex API Logo';
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 24,
          background: 'transparent',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <svg
          viewBox="0 0 100 100"
          style={{
            width: '100%',
            height: '100%',
          }}
        >
          {/* Hexagonal Frame */}
          <path
            d="M50 8L88 30V70L50 92L12 70V30L50 8Z"
            fill="#FFB7C5"
            opacity="0.2"
          />
          
          {/* V Shape */}
          <path
            d="M25 35L50 70L75 35"
            stroke="#FF9EAF"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          
          {/* Nodes */}
          <circle cx="25" cy="35" r="6" fill="#FF9EAF" />
          <circle cx="75" cy="35" r="6" fill="#FF9EAF" />
          <circle cx="50" cy="70" r="8" fill="#FFB7C5" />
          
          {/* Petal */}
          <path
            d="M52 15C52 15 62 20 57 30C52 40 42 35 42 35C42 35 42 25 52 15Z"
            fill="#FFDBE9"
          />
        </svg>
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  );
}
