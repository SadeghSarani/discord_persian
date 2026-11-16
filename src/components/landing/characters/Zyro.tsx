import React from 'react';

interface CharacterProps {
  className?: string;
  size?: number;
  animate?: boolean;
}

export const Zyro: React.FC<CharacterProps> = ({
  className = '',
  size = 200,
  animate = true,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`zyro-mascot ${animate ? 'animate-bounce-gentle' : ''} ${className}`}
      role="img"
      aria-label="Zyro Character - Energetic Gamer Mascot"
    >
      <defs>
        <radialGradient id="zyroBodyGrad" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="60%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#4C1D95" />
        </radialGradient>
        <linearGradient id="zyroGlow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#818CF8" />
        </linearGradient>
        <filter id="zyroShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="12" stdDeviation="10" floodColor="#7C3AED" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* Floating Aura Orbs */}
      <circle cx="35" cy="65" r="7" fill="#38BDF8" opacity="0.8" className="animate-pulse" />
      <circle cx="165" cy="55" r="9" fill="#F43F5E" opacity="0.85" />
      <polygon points="160,135 168,142 163,150 155,145" fill="#FBBF24" opacity="0.9" />

      {/* Main Rounded Futuristic Body */}
      <g filter="url(#zyroShadow)">
        <ellipse cx="100" cy="110" rx="55" ry="48" fill="url(#zyroBodyGrad)" />
      </g>

      {/* Chest Cyber Decal */}
      <path
        d="M85 130 Q100 138 115 130"
        stroke="#38BDF8"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Expressive Visor / Eyes Area */}
      <rect x="68" y="92" width="64" height="26" rx="13" fill="#0F172A" stroke="url(#zyroGlow)" strokeWidth="2.5" />

      {/* Glowing Dynamic Eyes */}
      <ellipse cx="84" cy="105" rx="6" ry="7" fill="#38BDF8" />
      <circle cx="82" cy="103" r="2.5" fill="#FFFFFF" />

      <ellipse cx="116" cy="105" rx="6" ry="7" fill="#38BDF8" />
      <circle cx="114" cy="103" r="2.5" fill="#FFFFFF" />

      {/* Cheerful Blush */}
      <ellipse cx="72" cy="116" rx="4" ry="2.5" fill="#F43F5E" opacity="0.7" />
      <ellipse cx="128" cy="116" rx="4" ry="2.5" fill="#F43F5E" opacity="0.7" />

      {/* Oversized Neon Headphones Band */}
      <path
        d="M50 100 C50 55 150 55 150 100"
        stroke="#0F172A"
        strokeWidth="10"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M52 98 C52 58 148 58 148 98"
        stroke="#38BDF8"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Left Ear Cushion */}
      <rect x="36" y="86" width="16" height="34" rx="8" fill="#1E1B4B" stroke="#38BDF8" strokeWidth="3" />
      <circle cx="44" cy="103" r="4" fill="#A855F7" />

      {/* Right Ear Cushion */}
      <rect x="148" y="86" width="16" height="34" rx="8" fill="#1E1B4B" stroke="#38BDF8" strokeWidth="3" />
      <circle cx="156" cy="103" r="4" fill="#A855F7" />

      {/* Left Floating Arm / Hand */}
      <ellipse cx="48" cy="132" rx="10" ry="14" fill="#8B5CF6" transform="rotate(25 48 132)" stroke="#38BDF8" strokeWidth="1.5" />

      {/* Right Floating Arm waving enthusiastically */}
      <ellipse cx="154" cy="122" rx="10" ry="14" fill="#8B5CF6" transform="rotate(-35 154 122)" stroke="#38BDF8" strokeWidth="1.5" />
    </svg>
  );
};
