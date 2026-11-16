'use client';

import React from 'react';

export interface OrbiV2Props {
  className?: string;
  size?: number;
  expression?: 'neutral' | 'curious' | 'thinking' | 'excited' | 'searching' | 'discovery';
  pose?: 'floating' | 'scanning' | 'discovery' | 'guide' | 'sleeping';
  variant?: 'color' | 'silhouette';
  interactive?: boolean;
}

/**
 * ORBI V2 — THE IMPOSSIBLE MACHINE (ODDVERSE EDITION)
 * 100% Original SVG geometry:
 * - Floating mechanical entity composed of disconnected orbital structures (not a generic ball)
 * - Suspended central core resembling an artificial eye inside floating mechanical frame
 * - Incomplete orbital rings, floating armor fragments, asymmetric antenna sensors
 * - Large floating rotating lens element on the right
 * - Brushed lavender metal + deep navy structural components + translucent cyan glass
 */
export const OrbiMascotV2: React.FC<OrbiV2Props> = ({
  className = '',
  size = 400,
  expression = 'neutral',
  pose = 'floating',
  variant = 'color',
  interactive = true,
}) => {
  const isSil = variant === 'silhouette';
  const isScanning = pose === 'scanning' || expression === 'searching';

  return (
    <svg
      viewBox="0 0 440 440"
      width={size}
      height={size}
      className={`transition-all duration-300 ${interactive ? 'cursor-pointer group' : ''} ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="orbiV2-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="orbiV2-shadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="16" stdDeviation="16" floodColor="#04060f" floodOpacity="0.85" />
        </filter>

        <radialGradient id="orbiV2-coreEye" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="35%" stopColor="#67E8F9" />
          <stop offset="70%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#0B132B" />
        </radialGradient>

        <linearGradient id="orbiV2-ringA" x1="60" y1="120" x2="380" y2="320" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#C4B5FD" />
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#1E1B4B" />
        </linearGradient>

        <linearGradient id="orbiV2-ringB" x1="100" y1="360" x2="340" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#43C9D8" />
          <stop offset="50%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
      </defs>

      {isSil ? (
        <g fill="#0b0f19" stroke="#374151" strokeWidth="2">
          <ellipse cx="220" cy="415" rx="80" ry="10" fill="#030408" opacity="0.6" />
          {/* Complex disconnected orbital mechanical silhouette */}
          <ellipse cx="220" cy="210" rx="60" ry="60" />
          <path d="M 90 220 C 80 120 160 70 260 75 L 280 95 C 200 90 120 130 130 220 Z" />
          <path d="M 350 200 C 360 300 280 350 180 345 L 160 325 C 240 330 320 290 310 200 Z" />
          <polygon points="350,180 395,200 380,245 335,225" />
          <circle cx="220" cy="210" r="25" fill="#43C9D8" stroke="none" />
        </g>
      ) : (
        <g filter="url(#orbiV2-shadow)">
          {/* Ground Drop Shadow */}
          <ellipse cx="220" cy="415" rx="90" ry="12" fill="#04060E" opacity="0.7" />

          {/* ================= SCANNING HOLOGRAPHIC CONE ================= */}
          {isScanning && (
            <g opacity="0.4" filter="url(#orbiV2-glow)">
              <polygon points="220,220 120,400 320,400" fill="url(#orbiV2-ringB)" />
              <ellipse cx="220" cy="400" rx="100" ry="15" stroke="#43C9D8" strokeWidth="2" strokeDasharray="6 4" fill="none" />
            </g>
          )}

          {/* ================= INCOMPLETE ORBITAL RINGS & ARMOR FRAGMENTS ================= */}
          {/* Ring A: Tilted Diagonal Orbital Arc (Back) */}
          <path
            d="M 90 260 C 60 160 140 80 270 90 C 350 95 380 150 360 210"
            stroke="url(#orbiV2-ringA)"
            strokeWidth="12"
            strokeLinecap="round"
            fill="none"
          />

          {/* Floating Mechanical Stabilizers & Thrusters */}
          <g transform="translate(85, 235) rotate(-30)">
            <rect x="0" y="0" width="28" height="14" rx="4" fill="#1E1B4B" stroke="#8B5CF6" strokeWidth="1.5" />
            <polygon points="-8,7 0,2 0,12" fill="#06B6D4" filter="url(#orbiV2-glow)" />
          </g>

          {/* Ring B: Counter-Clockwise Secondary Orbital Arc (Front/Bottom) */}
          <path
            d="M 330 160 C 370 270 280 340 160 330 C 90 325 70 280 95 220"
            stroke="url(#orbiV2-ringB)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray="90 15 40 15"
            fill="none"
          />

          {/* Asymmetric Top Sensor Antenna */}
          <g>
            <path d="M 220 140 L 220 70 L 250 50" stroke="#C4B5FD" strokeWidth="3" strokeLinecap="round" fill="none" />
            <circle cx="250" cy="50" r="6" fill="#06B6D4" filter="url(#orbiV2-glow)" />
            <circle cx="250" cy="50" r="2.5" fill="#FFFFFF" />
          </g>

          {/* ================= SIGNATURE FLOATING OPTICAL LENS (RIGHT SIDE) ================= */}
          <g transform="translate(330, 180) rotate(15)" className="animate-spin" style={{ animationDuration: '14s' }}>
            <circle cx="25" cy="25" r="30" fill="#0F172A" stroke="#43C9D8" strokeWidth="2.5" />
            <circle cx="25" cy="25" r="22" fill="#162A45" stroke="#38BDF8" strokeWidth="1.5" />
            <circle cx="25" cy="25" r="14" fill="#06B6D4" opacity="0.6" />
            {/* Aperture blades */}
            <line x1="25" y1="3" x2="38" y2="25" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.75" />
            <line x1="38" y1="25" x2="16" y2="38" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.75" />
            <line x1="16" y1="38" x2="25" y2="3" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.75" />
          </g>

          {/* ================= SUSPENDED CENTRAL CHASSIS & CORE EYE ================= */}
          {/* Main Floating Mechanical Frame */}
          <ellipse cx="220" cy="210" rx="64" ry="64" fill="#090D1A" stroke="#8B5CF6" strokeWidth="3" />
          {/* Concentric Frame Bevel */}
          <ellipse cx="220" cy="210" rx="52" ry="52" fill="#111827" stroke="#43C9D8" strokeWidth="2" />
          <ellipse cx="220" cy="210" rx="42" ry="42" fill="#030712" />

          {/* High-Definition Luminous Concentric Core Eye */}
          <g filter="url(#orbiV2-glow)">
            <circle cx="220" cy="210" r="32" fill="url(#orbiV2-coreEye)" />
            {/* Concentric Reticle Rings */}
            <circle cx="220" cy="210" r="24" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="4 2" fill="none" opacity="0.8" />
            <circle cx="220" cy="210" r="14" stroke="#090D1A" strokeWidth="2" fill="none" />
            {/* Pupil Center */}
            <circle cx="220" cy="210" r="7" fill="#090D1A" />
            {/* Dual Star Catchlight Reflections */}
            <circle cx="212" cy="198" r="5" fill="#FFFFFF" />
            <circle cx="228" cy="218" r="2.5" fill="#FFFFFF" opacity="0.8" />
          </g>
        </g>
      )}
    </svg>
  );
};
