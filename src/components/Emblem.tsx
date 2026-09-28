import React from 'react';

interface EmblemProps {
  size?: number;
  className?: string;
}

export const Emblem: React.FC<EmblemProps> = ({ size = 38, className = '' }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none ${className}`}
      aria-label="ISRO Emblem"
    >
      {/* Outer Circle Ring */}
      <circle cx="50" cy="50" r="46" fill="#0B2A5B" stroke="#F26B21" strokeWidth="3" />
      
      {/* Saffron & Green Accent Arcs */}
      <path d="M10 50 A40 40 0 0 1 50 10" fill="none" stroke="#FF9933" strokeWidth="3" />
      <path d="M50 90 A40 40 0 0 1 90 50" fill="none" stroke="#138808" strokeWidth="3" />

      {/* Orbit Ellipse */}
      <ellipse 
        cx="50" 
        cy="50" 
        rx="36" 
        ry="14" 
        fill="none" 
        stroke="#FFFFFF" 
        strokeWidth="1.8" 
        transform="rotate(-25 50 50)" 
      />
      
      {/* Central Satellite & Payload Rack Pin */}
      <polygon points="50,22 62,48 50,42 38,48" fill="#F26B21" />
      <rect x="42" y="52" width="16" height="18" rx="2" fill="#EEF3FA" stroke="#123F8C" strokeWidth="1.5" />
      <circle cx="50" cy="61" r="3" fill="#F26B21" />

      {/* Orbiting Node */}
      <circle cx="76" cy="34" r="4" fill="#FF9933" />
    </svg>
  );
};
