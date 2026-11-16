'use client';

import React from 'react';

export interface VexV2Props {
  className?: string;
  size?: number;
  expression?: 'confident' | 'amused' | 'curious' | 'focused' | 'proud' | 'friendly';
  pose?: 'hero' | 'sitting' | 'creative' | 'community' | 'celebration';
  variant?: 'color' | 'silhouette';
  interactive?: boolean;
}

/**
 * VEX V2 — THE ABSTRACT CREATOR (ODDVERSE EDITION)
 * 100% Original SVG geometry:
 * - Tall, narrow, asymmetrical silhouette with high-fashion oversized architectural coat
 * - Sculptural head: one smooth organic side + geometric faceplate with narrow asymmetrical optic slits
 * - Layered floating folded-ribbon architectural hair/head structure
 * - Exaggerated diagonal coat collar, asymmetrical sleeves (one exaggerated draped, one fitted)
 * - Manipulates floating abstract creative fragments that assemble into sculptural geometry
 * - Deep navy textiles + matte violet + coral accents + translucent cyan panels
 */
export const VexMascotV2: React.FC<VexV2Props> = ({
  className = '',
  size = 400,
  expression = 'confident',
  pose = 'creative',
  variant = 'color',
  interactive = true,
}) => {
  const isSil = variant === 'silhouette';
  const isCreative = pose === 'creative';

  return (
    <svg
      viewBox="0 0 420 520"
      width={size}
      height={(size * 520) / 420}
      className={`transition-all duration-300 ${interactive ? 'cursor-pointer group' : ''} ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="vexV2-glow" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="vexV2-shadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="16" stdDeviation="14" floodColor="#04060f" floodOpacity="0.8" />
        </filter>

        <linearGradient id="vexV2-coat" x1="120" y1="180" x2="320" y2="450" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1E1B4B" />
          <stop offset="40%" stopColor="#0F172A" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>

        <linearGradient id="vexV2-ribbon" x1="140" y1="20" x2="280" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF748C" />
          <stop offset="50%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#43C9D8" />
        </linearGradient>

        <linearGradient id="vexV2-faceplate" x1="210" y1="100" x2="270" y2="180" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#43C9D8" />
          <stop offset="100%" stopColor="#1E3A8A" />
        </linearGradient>
      </defs>

      {isSil ? (
        <g fill="#0b0f19" stroke="#374151" strokeWidth="2">
          <ellipse cx="210" cy="500" rx="95" ry="12" fill="#030408" opacity="0.6" />
          {/* Tall dramatic architectural silhouette */}
          <path d="M 170 30 L 250 20 L 290 80 L 270 180 L 330 240 L 300 480 L 245 495 L 230 420 L 190 420 L 175 495 L 120 480 L 105 320 L 140 180 Z" />
          {/* Ribbon crest */}
          <polygon points="180,30 220,5 260,35 240,60 180,30" />
          {/* Floating abstract fragment cluster */}
          <circle cx="340" cy="220" r="14" fill="#FF748C" stroke="none" />
          <polygon points="360,180 380,195 370,215 350,200" fill="#43C9D8" stroke="none" />
        </g>
      ) : (
        <g filter="url(#vexV2-shadow)">
          {/* Ground Drop Shadow */}
          <ellipse cx="210" cy="502" rx="100" ry="14" fill="#04060E" opacity="0.85" />

          {/* ================= ARCHITECTURAL HAIR / FOLDED RIBBONS ================= */}
          <g>
            <path
              d="M 160 80 C 140 30 190 10 230 25 C 270 15 300 45 285 90 Z"
              fill="url(#vexV2-ribbon)"
            />
            {/* Folded Ribbon Planes */}
            <polygon points="175,45 225,20 250,55 200,75" fill="#FF748C" opacity="0.8" />
            <polygon points="215,22 270,30 285,70 235,60" fill="#43C9D8" opacity="0.8" />
            <line x1="225" y1="20" x2="200" y2="75" stroke="#FFFFFF" strokeWidth="1.5" />
          </g>

          {/* ================= LEGS & SCULPTURAL PLATFORMS ================= */}
          <path d="M 170 410 L 160 475" stroke="#0F172A" strokeWidth="20" strokeLinecap="round" />
          <path d="M 250 410 L 260 475" stroke="#0F172A" strokeWidth="20" strokeLinecap="round" />

          {/* Architectural Left Shoe */}
          <g>
            <polygon points="130,470 180,465 185,496 125,498" fill="#1E1B4B" stroke="#43C9D8" strokeWidth="1.5" />
            <line x1="125" y1="492" x2="185" y2="492" stroke="#FF748C" strokeWidth="2.5" />
          </g>

          {/* Architectural Right Shoe */}
          <g>
            <polygon points="235,465 285,470 295,498 230,496" fill="#1E1B4B" stroke="#FF748C" strokeWidth="1.5" />
            <line x1="230" y1="492" x2="295" y2="492" stroke="#43C9D8" strokeWidth="2.5" />
          </g>

          {/* ================= HIGH-FASHION ARCHITECTURAL OVERSIZED COAT ================= */}
          {/* Main Draping Coat Body */}
          <path
            d="M 130 200 C 150 170 270 170 290 200 L 315 440 C 260 465 160 465 105 440 Z"
            fill="url(#vexV2-coat)"
            stroke="#312E81"
            strokeWidth="2"
          />

          {/* Exaggerated Angular Diagonal Collar */}
          <polygon points="135,185 210,165 255,230 175,250" fill="#1E1B4B" stroke="#FF748C" strokeWidth="2" />
          <polygon points="205,168 285,180 250,250 185,240" fill="#0F172A" stroke="#43C9D8" strokeWidth="1.5" />

          {/* Coral Geometric Seam Lines */}
          <path d="M 175 250 L 140 440" stroke="#FF748C" strokeWidth="2" strokeDasharray="6 4" />
          <path d="M 245 250 L 280 440" stroke="#43C9D8" strokeWidth="2" strokeDasharray="6 4" />

          {/* Translucent Cyan Coat Segment Panel */}
          <polygon points="150,300 200,285 195,380 140,390" fill="#43C9D8" opacity="0.25" stroke="#43C9D8" strokeWidth="1" />

          {/* ================= ASYMMETRIC SLEEVES & ARMS ================= */}
          {/* Left Arm: Exaggerated Draped Architectural Sleeve */}
          <g>
            <path d="M 130 210 C 90 270 70 330 95 380 L 130 360 C 115 320 125 270 145 230 Z" fill="#1E1B4B" stroke="#818CF8" strokeWidth="1.5" />
            <circle cx="102" cy="375" r="7" fill="#C4B5FD" />
          </g>

          {/* Right Arm: Raised Creative Hand Manipulating Geometric Shards */}
          <g>
            <path
              d={isCreative ? 'M 290 210 C 330 240 350 220 340 180' : 'M 290 210 C 330 260 340 320 325 365'}
              stroke="#0F172A"
              strokeWidth="16"
              strokeLinecap="round"
            />
            {/* Hand */}
            <circle cx={isCreative ? 340 : 325} cy={isCreative ? 175 : 370} r="9" fill="#C4B5FD" stroke="#FF748C" strokeWidth="1.5" />
          </g>

          {/* ================= FLOATING ABSTRACT CREATIVE FRAGMENTS ================= */}
          <g filter="url(#vexV2-glow)" className="animate-pulse">
            {/* Rotating Rhombus */}
            <polygon points="360,140 375,152 360,164 345,152" fill="#FF748C" />
            {/* Translucent Cyan Triangle */}
            <polygon points="375,180 395,195 365,205" fill="#43C9D8" opacity="0.85" />
            {/* Glowing Golden Seed Particle */}
            <circle cx="345" cy="195" r="4" fill="#FDE047" />
            {/* Interconnecting Laser Coordinate Lines */}
            <line x1="360" y1="152" x2="375" y2="195" stroke="#A855F7" strokeWidth="1" strokeDasharray="2 2" />
          </g>

          {/* ================= SCULPTURAL HEAD WITH GEOMETRIC FACEPLATE ================= */}
          {/* Left Smooth Organic Side */}
          <path
            d="M 160 140 C 150 90 180 60 210 60 L 210 180 C 180 180 165 165 160 140 Z"
            fill="#7C3AED"
            stroke="#A78BFA"
            strokeWidth="1.5"
          />

          {/* Right Asymmetric Geometric Faceplate */}
          <path
            d="M 210 60 C 240 60 265 85 260 135 C 255 170 235 180 210 180 Z"
            fill="url(#vexV2-faceplate)"
            stroke="#43C9D8"
            strokeWidth="2"
          />

          {/* Fine Division Line between Faces */}
          <line x1="210" y1="60" x2="210" y2="180" stroke="#FF748C" strokeWidth="2" />

          {/* EYES: Narrow Expressive Asymmetrical Optic Slits */}
          {/* Left Eye: Soft Violet Slit */}
          <path d="M 175 125 Q 190 120 200 126" stroke="#EDE9FE" strokeWidth="3" strokeLinecap="round" />

          {/* Right Eye: High-Tech Glowing Cyan Laser Slit with Reticle */}
          <g>
            <path d="M 220 122 Q 235 118 248 124" stroke="#43C9D8" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="234" cy="120" r="2" fill="#FFFFFF" />
          </g>

          {/* Subtle Conceptual Mouth Line */}
          <line x1="200" y1="160" x2="220" y2="158" stroke="#1E1B4B" strokeWidth="3" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
};
