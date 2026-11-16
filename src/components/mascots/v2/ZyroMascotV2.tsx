'use client';

import React from 'react';

export interface ZyroV2Props {
  className?: string;
  size?: number;
  expression?: 'confident' | 'excited' | 'laughing' | 'competitive' | 'surprised' | 'celebrating';
  pose?: 'gaming' | 'jump' | 'victory' | 'invitation' | 'relaxed';
  variant?: 'color' | 'silhouette';
  interactive?: boolean;
}

/**
 * ZYRO V2 — THE KINETIC REBEL (ODDVERSE EDITION)
 * 100% Original SVG geometry:
 * - Forward-leaning aggressive/energetic silhouette with disproportionate upper body
 * - Custom mechanical Audio Halo with segmented floating acoustic panels & cyan waveform engravings
 * - Wedge-shaped head structure with expressive brow ridge & confident asymmetrical grin
 * - Futuristic oversized performance jacket with shoulder armor plates, asymmetric zipper & geometric stitching
 * - Stylized oversized gamer gloves with cybernetic knuckles
 * - Floating kinetic token that rotates in orbit
 */
export const ZyroMascotV2: React.FC<ZyroV2Props> = ({
  className = '',
  size = 380,
  expression = 'confident',
  pose = 'gaming',
  variant = 'color',
  interactive = true,
}) => {
  const isSil = variant === 'silhouette';
  const isExcited = expression === 'excited' || expression === 'celebrating' || pose === 'victory';
  const isCompetitive = expression === 'competitive';

  return (
    <svg
      viewBox="0 0 420 480"
      width={size}
      height={(size * 480) / 420}
      className={`transition-all duration-300 ${interactive ? 'cursor-pointer group' : ''} ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="zyroV2-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="zyroV2-shadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="14" stdDeviation="12" floodColor="#04060f" floodOpacity="0.75" />
        </filter>

        <linearGradient id="zyroV2-jacket" x1="100" y1="180" x2="320" y2="380" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="50%" stopColor="#2E1065" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>

        <linearGradient id="zyroV2-head" x1="140" y1="60" x2="280" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="50%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#4C1D95" />
        </linearGradient>

        <linearGradient id="zyroV2-halo" x1="60" y1="80" x2="360" y2="180" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="50%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>

      {isSil ? (
        <g fill="#0b0f19" stroke="#374151" strokeWidth="2">
          <ellipse cx="210" cy="460" rx="110" ry="12" fill="#030408" opacity="0.6" />
          {/* Broad energetic forward-leaning silhouette */}
          <path d="M 120 180 C 70 120 110 50 200 40 C 290 35 340 100 310 170 C 370 200 370 290 340 350 L 320 440 L 260 455 L 240 380 L 180 380 L 160 455 L 100 440 L 80 350 C 50 290 60 210 120 180 Z" />
          {/* Halo arcs */}
          <path d="M 60 120 Q 210 30 360 120" stroke="#374151" strokeWidth="12" fill="none" />
          <circle cx="370" cy="240" r="16" fill="#06B6D4" stroke="none" />
        </g>
      ) : (
        <g filter="url(#zyroV2-shadow)">
          {/* Ground Drop Shadow */}
          <ellipse cx="210" cy="462" rx="115" ry="14" fill="#04060E" opacity="0.8" />

          {/* ================= MECHANICAL AUDIO HALO (BACK SEGMENTS) ================= */}
          <g className={`transition-transform duration-500 ${isExcited ? 'scale-105' : ''}`}>
            {/* Main Upper Arc */}
            <path
              d="M 80 140 C 70 60 160 20 220 22 C 280 24 350 65 340 145"
              stroke="url(#zyroV2-halo)"
              strokeWidth="12"
              strokeLinecap="round"
              fill="none"
            />
            {/* Waveform Engravings on Halo */}
            <path
              d="M 130 50 L 140 40 L 150 55 L 160 38 L 170 52 L 250 52 L 260 38 L 270 55 L 280 40 L 290 50"
              stroke="#A5F3FC"
              strokeWidth="2"
              fill="none"
              opacity="0.8"
            />
            {/* Floating Left Acoustic Module */}
            <g transform="translate(65, 120)">
              <rect x="0" y="0" width="34" height="48" rx="8" fill="#0E1726" stroke="#06B6D4" strokeWidth="2" />
              <rect x="6" y="8" width="22" height="32" rx="4" fill="#1E293B" />
              <line x1="10" y1="18" x2="24" y2="18" stroke="#38BDF8" strokeWidth="2" />
              <line x1="10" y1="24" x2="20" y2="24" stroke="#38BDF8" strokeWidth="2" />
              <circle cx="17" cy="32" r="3" fill="#A855F7" />
            </g>
            {/* Floating Right Acoustic Module */}
            <g transform="translate(320, 125)">
              <rect x="0" y="0" width="34" height="48" rx="8" fill="#0E1726" stroke="#8B5CF6" strokeWidth="2" />
              <rect x="6" y="8" width="22" height="32" rx="4" fill="#1E293B" />
              <line x1="10" y1="18" x2="24" y2="18" stroke="#A855F7" strokeWidth="2" />
              <line x1="14" y1="24" x2="24" y2="24" stroke="#A855F7" strokeWidth="2" />
              <circle cx="17" cy="32" r="3" fill="#06B6D4" />
            </g>
          </g>

          {/* ================= COMPACT LEGS & FUTURISTIC RUNNERS ================= */}
          <path d="M 160 380 L 150 435" stroke="#1E1B4B" strokeWidth="22" strokeLinecap="round" />
          <path d="M 260 380 L 270 435" stroke="#1E1B4B" strokeWidth="22" strokeLinecap="round" />

          {/* Left Runner Sneaker */}
          <g>
            <path d="M 115 435 C 130 420 165 422 178 435 L 182 454 C 150 464 105 462 102 450 Z" fill="#3B82F6" stroke="#60A5FA" strokeWidth="1.5" />
            <path d="M 100 450 C 112 464 175 464 186 456 L 184 464 C 160 470 100 470 96 458 Z" fill="#090D1A" />
            <rect x="120" y="442" width="14" height="5" rx="2" fill="#06B6D4" />
          </g>

          {/* Right Runner Sneaker */}
          <g>
            <path d="M 242 435 C 255 420 290 422 305 435 L 318 450 C 295 464 240 464 238 450 Z" fill="#8B5CF6" stroke="#C084FC" strokeWidth="1.5" />
            <path d="M 236 450 C 248 464 310 464 322 456 L 320 464 C 295 470 236 470 232 458 Z" fill="#090D1A" />
            <rect x="285" y="442" width="14" height="5" rx="2" fill="#EC4899" />
          </g>

          {/* ================= OVERSIZED PERFORMANCE JACKET ================= */}
          {/* Asymmetric Shoulders (Left higher than right) */}
          <path
            d="M 105 210 C 120 180 165 170 210 175 C 255 178 300 190 325 225 L 305 385 C 255 400 165 400 120 385 Z"
            fill="url(#zyroV2-jacket)"
            stroke="#6366F1"
            strokeWidth="2"
          />

          {/* Armored Shoulder Plate Left */}
          <path d="M 105 210 C 115 185 155 180 170 195 L 155 240 L 95 245 Z" fill="#1E1B4B" stroke="#06B6D4" strokeWidth="1.5" />

          {/* Diagonal Asymmetrical High-Tech Zipper */}
          <path d="M 215 178 Q 230 260 205 390" stroke="#06B6D4" strokeWidth="4" strokeLinecap="round" />
          <path d="M 215 178 Q 230 260 205 390" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="3 3" />

          {/* Patch / Graphic Badge on Jacket */}
          <polygon points="140,270 165,260 160,290 135,295" fill="#EF4444" opacity="0.9" />
          <circle cx="150" cy="278" r="4" fill="#FFFFFF" />

          {/* ================= STYLIZED GLOVES & ARMS ================= */}
          {/* Left Arm / Glove */}
          <g>
            <path d="M 110 230 C 80 270 70 320 85 360" stroke="#2E1065" strokeWidth="22" strokeLinecap="round" />
            <circle cx="85" cy="365" r="18" fill="#1E293B" stroke="#06B6D4" strokeWidth="2" />
            {/* Cybernetic Knuckles */}
            <rect x="74" y="358" width="6" height="12" rx="2" fill="#06B6D4" />
            <rect x="82" y="356" width="6" height="14" rx="2" fill="#06B6D4" />
            <rect x="90" y="358" width="6" height="12" rx="2" fill="#06B6D4" />
          </g>

          {/* Right Arm / Glove (Holding gesture towards token) */}
          <g>
            <path
              d={pose === 'victory' ? 'M 315 230 C 350 200 370 170 365 130' : 'M 315 230 C 345 270 355 310 340 355'}
              stroke="#2E1065"
              strokeWidth="22"
              strokeLinecap="round"
            />
            <circle cx={pose === 'victory' ? 365 : 340} cy={pose === 'victory' ? 125 : 360} r="18" fill="#1E293B" stroke="#8B5CF6" strokeWidth="2" />
            <rect x={pose === 'victory' ? 354 : 329} y={pose === 'victory' ? 118 : 353} width="6" height="12" rx="2" fill="#8B5CF6" />
            <rect x={pose === 'victory' ? 362 : 337} y={pose === 'victory' ? 116 : 351} width="6" height="14" rx="2" fill="#8B5CF6" />
            <rect x={pose === 'victory' ? 370 : 345} y={pose === 'victory' ? 118 : 353} width="6" height="12" rx="2" fill="#8B5CF6" />
          </g>

          {/* ================= FLOATING KINETIC TOKEN ================= */}
          <g transform="translate(365, 260)" filter="url(#zyroV2-glow)" className="animate-spin">
            <polygon points="0,-18 16,-6 16,14 0,22 -16,14 -16,-6" fill="#06B6D4" opacity="0.85" />
            <polygon points="0,-12 10,-4 10,9 0,14 -10,9 -10,-4" fill="#FFFFFF" />
            <circle cx="0" cy="3" r="3" fill="#3B82F6" />
          </g>

          {/* ================= WEDGE-SHAPED HEAD STRUCTURE ================= */}
          <path
            d="M 145 150 C 130 90 160 48 215 48 C 270 48 300 90 285 150 C 275 190 240 205 215 205 C 185 205 155 190 145 150 Z"
            fill="url(#zyroV2-head)"
            stroke="#C4B5FD"
            strokeWidth="2"
          />

          {/* Expressive Brow Ridge */}
          <path
            d="M 160 115 Q 215 130 270 115"
            stroke="#2E1065"
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* EYES: Sharp, Confident, Gaming Focus */}
          {/* Left Eye */}
          <g>
            <polygon points="168,125 196,128 190,148 165,142" fill="#090D1A" stroke="#06B6D4" strokeWidth="2" />
            <ellipse cx="182" cy="136" rx="6" ry="7" fill="#06B6D4" />
            <circle cx="180" cy="133" r="2.5" fill="#FFFFFF" />
          </g>

          {/* Right Eye */}
          <g>
            <polygon points="234,128 262,125 265,142 240,148" fill="#090D1A" stroke="#8B5CF6" strokeWidth="2" />
            <ellipse cx="248" cy="136" rx="6" ry="7" fill="#8B5CF6" />
            <circle cx="246" cy="133" r="2.5" fill="#FFFFFF" />
          </g>

          {/* Confident Asymmetrical Grin */}
          <path
            d="M 190 168 Q 215 185 242 165"
            stroke="#090D1A"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path d="M 210 178 L 235 170" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
};
