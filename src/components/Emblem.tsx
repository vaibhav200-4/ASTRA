import React from 'react';

interface EmblemProps {
  size?: number;
  className?: string;
}

export const Emblem: React.FC<EmblemProps> = ({ size = 36, className = '' }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none ${className}`}
    >
      {/* Outer Hexagon Aerospace Ring */}
      <polygon 
        points="50,4 90,26 90,74 50,96 10,74 10,26" 
        fill="#071B33" 
        stroke="#F58220" 
        strokeWidth="2.5" 
      />

      {/* Orbit Rings */}
      <ellipse 
        cx="50" 
        cy="50" 
        rx="38" 
        ry="18" 
        fill="none" 
        stroke="#174EA6" 
        strokeWidth="1.5" 
        transform="rotate(-25 50 50)" 
        strokeDasharray="4 2"
      />
      <ellipse 
        cx="50" 
        cy="50" 
        rx="38" 
        ry="18" 
        fill="none" 
        stroke="#2878C8" 
        strokeWidth="1.2" 
        transform="rotate(35 50 50)" 
      />

      {/* Inner Payload Rack Grid / AI Target Crosshair */}
      <rect x="32" y="32" width="36" height="36" rx="2" fill="#0B2545" stroke="#4895E4" strokeWidth="1" />
      <line x1="50" y1="20" x2="50" y2="80" stroke="#F58220" strokeWidth="1" strokeDasharray="2 2" />
      <line x1="20" y1="50" x2="80" y2="50" stroke="#F58220" strokeWidth="1" strokeDasharray="2 2" />

      {/* Central Orbital Node (Satellite / AI Engine) */}
      <circle cx="50" cy="50" r="7" fill="#F58220" />
      <circle cx="50" cy="50" r="11" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="3" fill="#FFFFFF" />

      {/* Orbiting Satellite Node */}
      <circle cx="80" cy="38" r="3.5" fill="#159447" />
      <circle cx="22" cy="64" r="3" fill="#4895E4" />

      {/* Micro Text or Mark */}
      <path d="M42,62 L50,42 L58,62" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
};
