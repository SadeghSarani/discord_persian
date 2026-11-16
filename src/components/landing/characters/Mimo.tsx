import React from 'react';

interface CharacterProps {
  className?: string;
  size?: number;
  animate?: boolean;
}

export const Mimo: React.FC<CharacterProps> = ({
  className = '',
  size = 180,
  animate = true,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 180 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`mimo-mascot ${animate ? 'animate-pulse-gentle' : ''} ${className}`}
      role="img"
      aria-label="Mimo Character - Curious & Friendly Communicator"
    >
      <defs>
        <radialGradient id="mimoBodyGrad" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#67E8F9" />
          <stop offset="55%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#0E7490" />
        </radialGradient>
        <filter id="mimoGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#06B6D4" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Floating Sparkles & Chat Symbols */}
      <circle cx="28" cy="40" r="4" fill="#C084FC" />
      <polygon points="148,45 153,53 145,55" fill="#FBBF24" />
      <circle cx="152" cy="120" r="6" fill="#38BDF8" opacity="0.6" />

      {/* Flexible Antenna with Glowing Bulb */}
      <path
        d="M90 60 Q95 30 115 25"
        stroke="#0891B2"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="118" cy="24" r="9" fill="#FDE047" stroke="#F59E0B" strokeWidth="2" filter="url(#mimoGlow)" />
      <circle cx="116" cy="21" r="3" fill="#FFFFFF" />

      {/* Soft Geometric Drop-like Body */}
      <g filter="url(#mimoGlow)">
        <path
          d="M90 55 C125 55 142 85 140 115 C138 145 118 155 90 155 C62 155 42 145 40 115 C38 85 55 55 90 55 Z"
          fill="url(#mimoBodyGrad)"
        />
      </g>

      {/* Big Expressive Anime Eyes */}
      <ellipse cx="72" cy="102" rx="11" ry="14" fill="#090E17" />
      <ellipse cx="74" cy="98" rx="5" ry="6" fill="#FFFFFF" />
      <circle cx="70" cy="108" r="2.5" fill="#38BDF8" />

      <ellipse cx="108" cy="102" rx="11" ry="14" fill="#090E17" />
      <ellipse cx="110" cy="98" rx="5" ry="6" fill="#FFFFFF" />
      <circle cx="106" cy="108" r="2.5" fill="#38BDF8" />

      {/* Smiling Mouth */}
      <path
        d="M84 122 Q90 130 96 122"
        stroke="#083344"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      {/* Rosy Cheeks */}
      <ellipse cx="60" cy="115" rx="5" ry="3" fill="#F43F5E" opacity="0.8" />
      <ellipse cx="120" cy="115" rx="5" ry="3" fill="#F43F5E" opacity="0.8" />

      {/* Small Cute Wings/Fins */}
      <ellipse cx="38" cy="118" rx="8" ry="12" fill="#22D3EE" transform="rotate(-20 38 118)" />
      <ellipse cx="142" cy="118" rx="8" ry="12" fill="#22D3EE" transform="rotate(20 142 118)" />
    </svg>
  );
};
