import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export default function Logo({ className = "", size = 40 }: LogoProps) {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        {/* Hexagonal Glow Background */}
        <path 
          d="M50 8L88 30V70L50 92L12 70V30L50 8Z" 
          fill="url(#sakura_glow)" 
          className="opacity-20"
        />
        
        {/* stylized V (Vertex) Frame */}
        <path 
          d="M25 35L50 70L75 35" 
          stroke="url(#sakura_grad)" 
          strokeWidth="8" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="drop-shadow-sm"
        />
        
        {/* Connection Nodes */}
        <circle cx="25" cy="35" r="5" fill="#FF9EAF" />
        <circle cx="75" cy="35" r="5" fill="#FF9EAF" />
        <circle cx="50" cy="70" r="6" fill="#FFB7C5" className="animate-pulse" />
        
        {/* Floating Sakura Petal */}
        <path 
          d="M52 15C52 15 62 20 57 30C52 40 42 35 42 35C42 35 42 25 52 15Z" 
          fill="url(#petal_grad)" 
          transform="rotate(-10 50 25)"
        >
          <animateTransform 
            attributeName="transform" 
            type="rotate" 
            from="-10 50 25" 
            to="10 50 25" 
            dur="3s" 
            repeatCount="indefinite" 
            additive="replace"
          />
        </path>

        <defs>
          <radialGradient id="sakura_glow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(50 50) rotate(90) scale(42)">
            <stop stopColor="#FFB7C5" />
            <stop offset="1" stopColor="#FFB7C5" stopOpacity="0" />
          </radialGradient>
          
          <linearGradient id="sakura_grad" x1="25" y1="35" x2="75" y2="70" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFB7C5" />
            <stop offset="1" stopColor="#FF9EAF" />
          </linearGradient>
          
          <linearGradient id="petal_grad" x1="42" y1="15" x2="57" y2="30" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFDBE9" />
            <stop offset="1" stopColor="#FFB7C5" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
