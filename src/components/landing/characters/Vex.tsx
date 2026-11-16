import React from 'react';

interface CharacterProps {
  className?: string;
  size?: number;
  animate?: boolean;
}

export const Vex: React.FC<CharacterProps> = ({
  className = '',
  size = 210,
  animate = true,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 210 210"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`vex-mascot ${animate ? 'animate-float-slow' : ''} ${className}`}
      role="img"
      aria-label="Vex Character - Confident, Mysterious & Creative Creator"
    >
      <defs>
        <linearGradient id="vexJacketGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1E1B4B" />
          <stop offset="50%" stopColor="#312E81" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
        <linearGradient id="vexCoralAccent" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FB7185" />
          <stop offset="100%" stopColor="#E11D48" />
        </linearGradient>
        <filter id="vexShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="#312E81" floodOpacity="0.5" />
        </filter>
      </defs>

      {/* Floating Geometric Crystals */}
      <polygon points="35,50 48,60 40,75 27,65" fill="#FB7185" opacity="0.8" />
      <polygon points="175,70 188,75 182,90 169,85" fill="#38BDF8" opacity="0.85" />

      {/* Distinctive Geometric Mask / Head */}
      <g filter="url(#vexShadow)">
        <polygon points="105,35 135,55 135,90 105,110 75,90 75,55" fill="#18181B" stroke="#6366F1" strokeWidth="2.5" />
      </g>

      {/* Luminous Asymmetric Cyber Monocle / Eye */}
      <polygon points="85,65 110,65 105,80 80,80" fill="url(#vexCoralAccent)" />
      <circle cx="95" cy="72" r="3" fill="#FFFFFF" />

      {/* Second Subtle Cyber Sensor */}
      <circle cx="120" cy="75" r="3.5" fill="#38BDF8" />

      {/* High-Collar Cyber Hoodie / Jacket */}
      <path
        d="M60 115 L78 95 L105 118 L132 95 L150 115 L165 175 L45 175 Z"
        fill="url(#vexJacketGrad)"
        stroke="#4F46E5"
        strokeWidth="2"
      />

      {/* Coral Neon Lapel Linings */}
      <path d="M78 95 L105 145 L132 95" stroke="url(#vexCoralAccent)" strokeWidth="3.5" strokeLinecap="round" fill="none" />

      {/* Identity Core Badge */}
      <polygon points="105,152 112,160 105,168 98,160" fill="#38BDF8" />

      {/* Relaxed Hands in Pockets Silhouette */}
      <ellipse cx="50" cy="155" rx="8" ry="14" fill="#18181B" stroke="#6366F1" strokeWidth="1.5" />
      <ellipse cx="160" cy="155" rx="8" ry="14" fill="#18181B" stroke="#6366F1" strokeWidth="1.5" />
    </svg>
  );
};
