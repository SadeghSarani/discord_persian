'use client';

import React from 'react';

export interface MimoV2Props {
  className?: string;
  size?: number;
  expression?: 'neutral' | 'excited' | 'curious' | 'laughing' | 'surprised' | 'sleepy' | 'confused' | 'celebrating' | 'thinking' | 'waving';
  pose?: 'hero' | 'peek' | 'wave' | 'sleep' | 'celebrate' | 'thinking' | 'lost' | 'loading';
  variant?: 'color' | 'silhouette';
  interactive?: boolean;
}

/**
 * MIMO V2 — THE EMOTIONAL CENTER (ODDVERSE EDITION)
 * 100% Original SVG geometry:
 * - Asymmetrical crescent skull curving around floating energy chamber
 * - Floating quantum 4-point star in chamber that reacts to emotions
 * - Asymmetric facial architecture: elongated layered almond eye + tilted curious eye
 * - Elongated organic torso with crossbody tactical connection flask & floating sparks
 * - Segmented kinetic floating ear modules on the right, curved horn contour on the left
 * - 3-fingered expressive hands capable of authentic gestures
 * - Asymmetrical designer streetwear footwear (Cyan high-top + Violet chunky runner)
 */
export const MimoMascotV2: React.FC<MimoV2Props> = ({
  className = '',
  size = 360,
  expression = 'neutral',
  pose = 'hero',
  variant = 'color',
  interactive = true,
}) => {
  const isSil = variant === 'silhouette';
  const isExcited = expression === 'excited' || expression === 'celebrating';
  const isSurprised = expression === 'surprised';
  const isSleepy = expression === 'sleepy' || pose === 'sleep';
  const isCurious = expression === 'curious' || expression === 'thinking';
  const isLaughing = expression === 'laughing';

  return (
    <svg
      viewBox="0 0 400 480"
      width={size}
      height={(size * 480) / 400}
      className={`transition-all duration-300 ${interactive ? 'cursor-pointer group' : ''} ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="mimoV2-glow" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="7" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="mimoV2-starGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="9" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="mimoV2-shadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="14" stdDeviation="12" floodColor="#04060f" floodOpacity="0.75" />
        </filter>

        <linearGradient id="mimoV2-body" x1="120" y1="80" x2="280" y2="400" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#DDD5FF" />
          <stop offset="45%" stopColor="#A794FF" />
          <stop offset="85%" stopColor="#6C53E3" />
          <stop offset="100%" stopColor="#432EB0" />
        </linearGradient>

        <linearGradient id="mimoV2-chamber" x1="180" y1="60" x2="240" y2="130" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#120D2D" />
          <stop offset="100%" stopColor="#060914" />
        </linearGradient>

        <radialGradient id="mimoV2-energy" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="30%" stopColor="#7BFAF8" />
          <stop offset="70%" stopColor="#43C9D8" />
          <stop offset="100%" stopColor="#8B7CFF" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="mimoV2-ear" x1="280" y1="120" x2="340" y2="180" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#43C9D8" />
          <stop offset="60%" stopColor="#8B7CFF" />
          <stop offset="100%" stopColor="#302070" />
        </linearGradient>

        <linearGradient id="mimoV2-strap" x1="150" y1="230" x2="250" y2="330" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF748C" />
          <stop offset="100%" stopColor="#9B264A" />
        </linearGradient>

        <linearGradient id="mimoV2-shoeL" x1="110" y1="410" x2="170" y2="460" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#43C9D8" />
          <stop offset="100%" stopColor="#1B4D68" />
        </linearGradient>

        <linearGradient id="mimoV2-shoeR" x1="220" y1="410" x2="300" y2="465" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF748C" />
          <stop offset="60%" stopColor="#8B7CFF" />
          <stop offset="100%" stopColor="#25164B" />
        </linearGradient>
      </defs>

      {/* Silhouette Mode */}
      {isSil ? (
        <g fill="#0b0f19" stroke="#374151" strokeWidth="2">
          <ellipse cx="205" cy="460" rx="100" ry="12" fill="#030408" opacity="0.6" />
          <path d="M 130 90 C 80 120 70 200 110 240 C 90 270 120 330 130 360 L 120 420 L 170 450 L 190 410 L 210 410 L 230 455 L 290 445 L 270 380 C 290 350 280 300 270 250 C 330 230 350 160 320 110 C 290 60 220 50 170 65 Z" />
          <path d="M 125 95 C 100 45 130 20 165 40 C 145 60 140 80 125 95 Z" />
          <circle cx="310" cy="130" r="16" />
          <circle cx="330" cy="165" r="12" />
          <circle cx="340" cy="195" r="8" />
          <path d="M 85 280 C 70 310 90 340 115 330 C 105 310 95 295 85 280 Z" />
          <path d="M 315 270 C 335 295 320 330 295 325 C 300 305 310 285 315 270 Z" />
          <circle cx="210" cy="100" r="14" fill="#38BDF8" stroke="none" />
        </g>
      ) : (
        <g filter="url(#mimoV2-shadow)">
          {/* Ground Drop Shadow */}
          <ellipse cx="205" cy="462" rx="110" ry="14" fill="#04060E" opacity="0.8" />

          {/* ================= BACK ACCESSORIES ================= */}
          {/* Segmented Floating Kinetic Ear Elements (Right) */}
          <g className={`transition-all duration-500 ${isExcited ? 'translate-x-3 -translate-y-2' : ''}`}>
            <path d="M 285 110 C 320 95 335 125 315 145 C 300 140 290 125 285 110 Z" fill="url(#mimoV2-ear)" />
            <circle cx="325" cy="155" r={isExcited ? 16 : 14} fill="#43C9D8" opacity="0.9" />
            <circle cx="325" cy="155" r="8" fill="#FFFFFF" opacity="0.6" />
            <circle cx="342" cy="185" r="9" fill="#8B7CFF" />
            <circle cx="350" cy="210" r="5.5" fill="#FF748C" />
            <path d="M 295 125 Q 330 165 350 215" stroke="#43C9D8" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.5" />
          </g>

          {/* Left Horn/Crescent Extension Hook */}
          <path
            d="M 145 85 C 105 40 120 10 160 22 C 175 26 180 45 165 65 C 155 75 148 80 145 85 Z"
            fill="url(#mimoV2-body)"
            stroke="#C4B9FF"
            strokeWidth="1.5"
          />
          <path d="M 135 60 C 130 40 140 25 158 26" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.7" />

          {/* ================= LEGS & DESIGNER FOOTWEAR ================= */}
          <path d="M 160 365 C 155 390 148 415 142 430" stroke="#4B399B" strokeWidth="22" strokeLinecap="round" />
          <path d="M 235 365 C 242 390 250 415 258 430" stroke="#4B399B" strokeWidth="22" strokeLinecap="round" />

          {/* Left Shoe: High-top Cyan/Teal Geometric Sneaker */}
          <g>
            <path
              d="M 112 430 C 125 415 155 420 168 430 L 175 452 C 150 460 105 460 100 448 Z"
              fill="url(#mimoV2-shoeL)"
              stroke="#5EEAD4"
              strokeWidth="1.5"
            />
            <path d="M 98 448 C 108 462 165 462 178 454 L 176 462 C 160 468 100 468 95 455 Z" fill="#0C2533" />
            <path d="M 125 427 L 145 435 M 120 435 L 140 443" stroke="#A5F3FC" strokeWidth="2" strokeLinecap="round" />
            <circle cx="158" cy="442" r="3" fill="#FFFFFF" />
          </g>

          {/* Right Shoe: Asymmetrical Streetwear Chunky Violet/Coral Runner */}
          <g>
            <path
              d="M 232 430 C 250 410 285 415 298 430 L 305 450 C 280 462 230 462 222 448 Z"
              fill="url(#mimoV2-shoeR)"
              stroke="#F472B6"
              strokeWidth="1.5"
            />
            <path d="M 220 448 C 235 466 295 466 312 452 L 310 463 C 290 472 225 470 216 454 Z" fill="#180B30" />
            <rect x="230" y="442" width="16" height="6" rx="3" fill="#FF748C" />
            <path d="M 265 428 L 285 436" stroke="#DDD5FF" strokeWidth="2" strokeLinecap="round" />
          </g>

          {/* ================= TORSO & DRAPING STREETWEAR ================= */}
          <path
            d="M 152 230 C 135 270 140 320 155 365 C 180 375 225 375 250 365 C 265 315 260 265 248 230 Z"
            fill="url(#mimoV2-body)"
          />
          <path
            d="M 155 240 C 185 260 200 310 195 365 C 175 365 160 350 155 320 Z"
            fill="#432EB0"
            opacity="0.35"
          />

          {/* Crossbody Tactical Strap & Flask */}
          <g>
            <path d="M 160 220 Q 210 280 255 340" stroke="url(#mimoV2-strap)" strokeWidth="8" strokeLinecap="round" />
            <path d="M 162 220 Q 210 280 253 340" stroke="#FFE4E6" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.8" />
            <g transform="translate(225, 300) rotate(15)">
              <rect x="0" y="0" width="36" height="48" rx="10" fill="#0E1726" stroke="#43C9D8" strokeWidth="2" />
              <rect x="6" y="8" width="24" height="32" rx="6" fill="#162A45" />
              <circle cx="18" cy="20" r="4" fill="#43C9D8" filter="url(#mimoV2-glow)" />
              <circle cx="14" cy="30" r="3" fill="#FF748C" />
              <circle cx="23" cy="28" r="2.5" fill="#FFFFFF" />
              <line x1="8" y1="36" x2="28" y2="36" stroke="#43C9D8" strokeWidth="2" strokeLinecap="round" />
            </g>
          </g>

          {/* ================= ARMS & 3-FINGERED HANDS ================= */}
          {/* Left Arm */}
          <g>
            <path
              d={
                pose === 'wave' || pose === 'celebrate'
                  ? 'M 150 240 C 110 200 80 180 75 145'
                  : pose === 'thinking'
                  ? 'M 150 240 C 120 250 140 220 165 210'
                  : 'M 150 240 C 120 270 95 300 90 335'
              }
              stroke="url(#mimoV2-body)"
              strokeWidth="18"
              strokeLinecap="round"
            />
            {/* 3-Fingered Hand Left */}
            <path
              d={
                pose === 'wave' || pose === 'celebrate'
                  ? 'M 72 142 C 60 130 50 120 46 112 M 72 142 C 68 126 62 110 60 102 M 74 142 C 82 130 88 120 90 114'
                  : 'M 94 336 C 85 345 75 352 70 358 M 90 352 C 86 362 82 370 85 372 M 96 348 C 98 358 102 366 108 365'
              }
              stroke="#DDD5FF"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* Right Arm */}
          <g>
            <path
              d={
                pose === 'celebrate'
                  ? 'M 250 240 C 290 200 320 180 325 145'
                  : pose === 'wave'
                  ? 'M 250 240 C 285 210 325 180 335 150'
                  : 'M 250 240 C 285 265 310 290 318 315'
              }
              stroke="url(#mimoV2-body)"
              strokeWidth="18"
              strokeLinecap="round"
            />
            {/* 3-Fingered Hand Right */}
            <path
              d={
                pose === 'celebrate' || pose === 'wave'
                  ? 'M 326 148 C 338 135 348 124 352 116 M 326 148 C 330 132 336 116 338 108 M 324 148 C 316 135 310 125 308 119'
                  : 'M 318 316 C 330 326 342 334 348 338 M 324 322 C 338 332 348 342 346 348 M 318 326 C 328 340 336 352 332 356'
              }
              stroke="#DDD5FF"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* ================= ASYMMETRICAL CRESCENT HEAD ================= */}
          <path
            d="M 135 150 C 115 110 145 65 190 62 C 225 60 270 80 282 120 C 295 165 280 215 250 235 C 210 255 160 250 138 220 C 122 198 126 170 135 150 Z"
            fill="url(#mimoV2-body)"
            stroke="#DCD4FF"
            strokeWidth="2"
          />
          <path d="M 150 90 C 180 75 240 85 260 115" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" opacity="0.5" />

          {/* ================= SIGNATURE ENERGY CHAMBER ================= */}
          <path
            d="M 182 80 C 175 62 205 52 225 58 C 242 63 248 85 235 98 C 220 112 188 102 182 80 Z"
            fill="url(#mimoV2-chamber)"
            stroke="#6C53E3"
            strokeWidth="2.5"
          />
          <ellipse cx="210" cy="80" rx="24" ry="16" fill="url(#mimoV2-energy)" />

          {/* Floating Radiant 4-Point Geometric Star (Elevates & expands during excitation) */}
          <g
            filter="url(#mimoV2-starGlow)"
            className={`transition-all duration-700 ${
              isExcited
                ? '-translate-y-6 scale-125'
                : isSurprised
                ? '-translate-y-4 scale-110'
                : 'animate-pulse'
            }`}
          >
            <path
              d="M 210 66 Q 212 78 224 80 Q 212 82 210 94 Q 208 82 196 80 Q 208 78 210 66 Z"
              fill="#FFFFFF"
            />
            <circle cx="210" cy="80" r="3.5" fill="#43C9D8" />
          </g>

          {/* Floating Particles */}
          <circle cx="196" cy="72" r="1.5" fill="#A5F3FC" />
          <circle cx="226" cy="88" r="1.5" fill="#FF748C" />

          {/* ================= UNCONVENTIONAL FACIAL ARCHITECTURE ================= */}
          {/* Eye 1: Left Eye - Oversized, Vertically Elongated Almond */}
          <g>
            <ellipse cx="172" cy="155" rx={isSurprised ? 21 : 19} ry={isSurprised ? 28 : isSleepy ? 6 : 26} fill="#140E2D" />
            <ellipse cx="173" cy="155" rx="17" ry={isSleepy ? 5 : 24} fill="#1E1942" stroke="#43C9D8" strokeWidth="1.5" />
            {!isSleepy && (
              <>
                <ellipse cx="174" cy="154" rx="13" ry="19" fill="#3B82F6" />
                <ellipse cx="175" cy="153" rx="10" ry="15" fill="#06B6D4" />
                <ellipse cx="176" cy="152" rx="6" ry="10" fill="#090B14" />
                <circle cx="172" cy="144" r={isExcited ? 6 : 5} fill="#FFFFFF" />
                <circle cx="180" cy="160" r="2.5" fill="#FFFFFF" opacity="0.8" />
              </>
            )}
            <path d="M 152 140 C 165 128 185 132 194 144" stroke="#8B7CFF" strokeWidth="2.5" strokeLinecap="round" />
          </g>

          {/* Eye 2: Right Eye - Smaller, Tilted, Inquisitive Arch */}
          <g transform="rotate(8, 235, 160)">
            <ellipse cx="235" cy="158" rx={isSurprised ? 15 : 13} ry={isSurprised ? 19 : isSleepy ? 4 : 17} fill="#140E2D" />
            <ellipse cx="235" cy="158" rx="11" ry={isSleepy ? 3 : 15} fill="#1E1942" stroke="#FF748C" strokeWidth="1.5" />
            {!isSleepy && (
              <>
                <ellipse cx="236" cy="157" rx="8" ry="12" fill="#8B7CFF" />
                <ellipse cx="237" cy="156" rx="5" ry="8" fill="#EC4899" />
                <ellipse cx="237" cy="156" rx="3.5" ry="5.5" fill="#090B14" />
                <circle cx="233" cy="151" r="3.5" fill="#FFFFFF" />
                <circle cx="239" cy="162" r="1.5" fill="#FFFFFF" opacity="0.7" />
              </>
            )}
            <path d="M 221 146 C 232 138 244 140 250 148" stroke="#8B7CFF" strokeWidth="2.5" strokeLinecap="round" />
          </g>

          {/* Cheeks */}
          <ellipse cx="152" cy="182" rx="9" ry="5" fill="#FF748C" opacity={isExcited ? 0.75 : 0.45} />
          <ellipse cx="248" cy="184" rx="7" ry="4" fill="#FF748C" opacity={isExcited ? 0.7 : 0.4} />

          {/* Mouth Variants */}
          {isLaughing || expression === 'celebrating' ? (
            <path d="M 194 190 Q 208 214 222 190 Z" fill="#FF748C" stroke="#2B1559" strokeWidth="2.5" />
          ) : isSurprised ? (
            <ellipse cx="208" cy="198" rx="6" ry="8" fill="#140E2D" stroke="#2B1559" strokeWidth="2" />
          ) : isSleepy ? (
            <path d="M 200 198 Q 208 200 216 198" stroke="#2B1559" strokeWidth="2.5" strokeLinecap="round" />
          ) : (
            <path d="M 198 194 C 204 202 214 200 218 192" stroke="#2B1559" strokeWidth="3.5" strokeLinecap="round" />
          )}

          {/* Connection Micro-Markings */}
          <g opacity="0.6">
            <circle cx="206" cy="126" r="2" fill="#43C9D8" />
            <circle cx="214" cy="124" r="1.5" fill="#43C9D8" />
            <path d="M 206 126 L 214 124" stroke="#43C9D8" strokeWidth="1" />
          </g>
        </g>
      )}
    </svg>
  );
};
