import React from 'react';

interface CharacterProps {
  className?: string;
  size?: number;
  animate?: boolean;
}

export const Orbi: React.FC<CharacterProps> = ({
  className = '',
  size = 170,
  animate = true,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 170 170"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`orbi-mascot ${animate ? 'animate-spin-slow-tilt' : ''} ${className}`}
      role="img"
      aria-label="Orbi Character - Intelligent Discovery AI Drone"
    >
      <defs>
        <radialGradient id="orbiCoreGrad" cx="35%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="45%" stopColor="#E0E7FF" />
          <stop offset="85%" stopColor="#818CF8" />
          <stop offset="100%" stopColor="#4338CA" />
        </radialGradient>
        <linearGradient id="orbiRingGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="50%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#F43F5E" />
        </linearGradient>
        <filter id="orbiGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor="#38BDF8" floodOpacity="0.6" />
        </filter>
      </defs>

      {/* Orbiting Particle Beacons */}
      <circle cx="25" cy="50" r="3.5" fill="#38BDF8" />
      <circle cx="145" cy="130" r="4.5" fill="#A855F7" />

      {/* Tilted Outer Orbiting Ring */}
      <ellipse
        cx="85"
        cy="85"
        rx="68"
        ry="24"
        stroke="url(#orbiRingGrad)"
        strokeWidth="3.5"
        transform="rotate(-28 85 85)"
        strokeDasharray="14 6"
        fill="none"
      />

      {/* Spherical Robot Drone Body */}
      <circle cx="85" cy="85" r="38" fill="url(#orbiCoreGrad)" />

      {/* Central Cyber Eye Aperture */}
      <circle cx="85" cy="85" r="18" fill="#090E17" stroke="#38BDF8" strokeWidth="2.5" />
      <circle cx="85" cy="85" r="9" fill="#06B6D4" filter="url(#orbiGlow)" />
      <circle cx="82" cy="82" r="3" fill="#FFFFFF" />

      {/* Subtle Scanner Wave Projection */}
      <path
        d="M60 85 C60 115 110 115 110 85"
        stroke="#38BDF8"
        strokeWidth="1.5"
        strokeDasharray="2 3"
        fill="none"
        opacity="0.7"
      />

      {/* Inner Tilted Gyro Ring */}
      <ellipse
        cx="85"
        cy="85"
        rx="46"
        ry="15"
        stroke="#C084FC"
        strokeWidth="2"
        transform="rotate(45 85 85)"
        fill="none"
        opacity="0.85"
      />
    </svg>
  );
};
