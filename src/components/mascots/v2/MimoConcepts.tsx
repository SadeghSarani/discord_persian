'use client';

import React from 'react';

export interface MimoConceptProps {
  className?: string;
  size?: number;
  variant?: 'color' | 'silhouette';
}

/**
 * DIRECTION A: "Crescent Core & Streetwear Drifter"
 * - Distinctive crescent asymmetric skull curving around an upper floating glowing star chamber.
 * - One soft curved horn contour on the left, floating segmented acoustic ear flap on the right.
 * - Expressive asymmetrical facial architecture: large elongated almond eye with layered iris + smaller tilted curious eye.
 * - Twisted organic elongated torso with layered satin tech-fabric bands.
 * - Long expressive 3-fingered hands, crossbody geometric connection flask with floating cyan embers.
 * - Asymmetrical chunky designer streetwear sneakers.
 */
export const MimoConceptA: React.FC<MimoConceptProps> = ({ className = '', size = 360, variant = 'color' }) => {
  const isSil = variant === 'silhouette';

  return (
    <svg
      viewBox="0 0 400 480"
      width={size}
      height={(size * 480) / 400}
      className={`transition-all duration-300 ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Glow & Shadow Filters */}
        <filter id="mimoA-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="mimoA-shadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="14" stdDeviation="12" floodColor="#04060f" floodOpacity="0.75" />
        </filter>

        {/* Gradients */}
        <linearGradient id="mimoA-bodyGrad" x1="120" y1="80" x2="280" y2="400" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#DDD5FF" />
          <stop offset="45%" stopColor="#A794FF" />
          <stop offset="85%" stopColor="#6C53E3" />
          <stop offset="100%" stopColor="#432EB0" />
        </linearGradient>

        <linearGradient id="mimoA-chamberGrad" x1="180" y1="60" x2="240" y2="130" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#120D2D" />
          <stop offset="100%" stopColor="#060914" />
        </linearGradient>

        <radialGradient id="mimoA-coreEnergy" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="30%" stopColor="#7BFAF8" />
          <stop offset="70%" stopColor="#43C9D8" />
          <stop offset="100%" stopColor="#8B7CFF" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="mimoA-earGrad" x1="280" y1="120" x2="340" y2="180" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#43C9D8" />
          <stop offset="60%" stopColor="#8B7CFF" />
          <stop offset="100%" stopColor="#302070" />
        </linearGradient>

        <linearGradient id="mimoA-strapGrad" x1="150" y1="230" x2="250" y2="330" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF748C" />
          <stop offset="100%" stopColor="#9B264A" />
        </linearGradient>

        <linearGradient id="mimoA-shoeLeft" x1="110" y1="410" x2="170" y2="460" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#43C9D8" />
          <stop offset="100%" stopColor="#1B4D68" />
        </linearGradient>

        <linearGradient id="mimoA-shoeRight" x1="220" y1="410" x2="300" y2="465" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF748C" />
          <stop offset="60%" stopColor="#8B7CFF" />
          <stop offset="100%" stopColor="#25164B" />
        </linearGradient>
      </defs>

      {/* Silhouette Mode Base Fill */}
      {isSil ? (
        <g fill="#0b0f19" stroke="#374151" strokeWidth="2">
          {/* Ground Shadow */}
          <ellipse cx="205" cy="460" rx="100" ry="12" fill="#030408" opacity="0.6" />
          {/* Entire Merged Silhouette */}
          <path d="M 130 90 C 80 120 70 200 110 240 C 90 270 120 330 130 360 L 120 420 L 170 450 L 190 410 L 210 410 L 230 455 L 290 445 L 270 380 C 290 350 280 300 270 250 C 330 230 350 160 320 110 C 290 60 220 50 170 65 Z" />
          {/* Floating Horn & Ears Silhouette */}
          <path d="M 125 95 C 100 45 130 20 165 40 C 145 60 140 80 125 95 Z" />
          <circle cx="310" cy="130" r="16" />
          <circle cx="330" cy="165" r="12" />
          <circle cx="340" cy="195" r="8" />
          {/* Hands */}
          <path d="M 85 280 C 70 310 90 340 115 330 C 105 310 95 295 85 280 Z" />
          <path d="M 315 270 C 335 295 320 330 295 325 C 300 305 310 285 315 270 Z" />
          {/* Core Star cutout highlight */}
          <circle cx="210" cy="100" r="14" fill="#38BDF8" stroke="none" />
        </g>
      ) : (
        <g filter="url(#mimoA-shadow)">
          {/* Ground Drop Shadow */}
          <ellipse cx="205" cy="462" rx="110" ry="14" fill="#04060E" opacity="0.8" />

          {/* ================= BACK ACCESSORIES ================= */}
          {/* Segmented Floating Kinetic Ear Elements (Right) */}
          <g className="transition-transform duration-500 hover:translate-x-1">
            <path d="M 285 110 C 320 95 335 125 315 145 C 300 140 290 125 285 110 Z" fill="url(#mimoA-earGrad)" />
            <circle cx="325" cy="155" r="14" fill="#43C9D8" opacity="0.9" />
            <circle cx="325" cy="155" r="8" fill="#FFFFFF" opacity="0.6" />
            <circle cx="342" cy="185" r="9" fill="#8B7CFF" />
            <circle cx="350" cy="210" r="5.5" fill="#FF748C" />
            {/* Tether Wave Line */}
            <path d="M 295 125 Q 330 165 350 215" stroke="#43C9D8" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.5" />
          </g>

          {/* Left Horn/Crescent Extension Hook */}
          <path
            d="M 145 85 C 105 40 120 10 160 22 C 175 26 180 45 165 65 C 155 75 148 80 145 85 Z"
            fill="url(#mimoA-bodyGrad)"
            stroke="#C4B9FF"
            strokeWidth="1.5"
          />
          {/* Soft inner glow highlight on horn */}
          <path d="M 135 60 C 130 40 140 25 158 26" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.7" />

          {/* ================= LEGS & DESIGNER FOOTWEAR ================= */}
          {/* Left Leg (Darkened organic limb) */}
          <path d="M 160 365 C 155 390 148 415 142 430" stroke="#4B399B" strokeWidth="22" strokeLinecap="round" />
          {/* Right Leg */}
          <path d="M 235 365 C 242 390 250 415 258 430" stroke="#4B399B" strokeWidth="22" strokeLinecap="round" />

          {/* Left Shoe: High-top Cyan/Teal Geometric Sneaker */}
          <g>
            <path
              d="M 112 430 C 125 415 155 420 168 430 L 175 452 C 150 460 105 460 100 448 Z"
              fill="url(#mimoA-shoeLeft)"
              stroke="#5EEAD4"
              strokeWidth="1.5"
            />
            {/* Sole Cushion */}
            <path d="M 98 448 C 108 462 165 462 178 454 L 176 462 C 160 468 100 468 95 455 Z" fill="#0C2533" />
            {/* Lacing Accent */}
            <path d="M 125 427 L 145 435 M 120 435 L 140 443" stroke="#A5F3FC" strokeWidth="2" strokeLinecap="round" />
            <circle cx="158" cy="442" r="3" fill="#FFFFFF" />
          </g>

          {/* Right Shoe: Asymmetrical Streetwear Chunky Violet/Coral Runner */}
          <g>
            <path
              d="M 232 430 C 250 410 285 415 298 430 L 305 450 C 280 462 230 462 222 448 Z"
              fill="url(#mimoA-shoeRight)"
              stroke="#F472B6"
              strokeWidth="1.5"
            />
            {/* Chunky Aerodynamic Sole */}
            <path d="M 220 448 C 235 466 295 466 312 452 L 310 463 C 290 472 225 470 216 454 Z" fill="#180B30" />
            {/* Coral heel clip & air capsule */}
            <rect x="230" y="442" width="16" height="6" rx="3" fill="#FF748C" />
            <path d="M 265 428 L 285 436" stroke="#DDD5FF" strokeWidth="2" strokeLinecap="round" />
          </g>

          {/* ================= TORSO & DRAPING STREETWEAR ================= */}
          {/* Elongated, gently twisted organic torso */}
          <path
            d="M 152 230 C 135 270 140 320 155 365 C 180 375 225 375 250 365 C 265 315 260 265 248 230 Z"
            fill="url(#mimoA-bodyGrad)"
          />
          {/* Subtle Torso Shading Contour */}
          <path
            d="M 155 240 C 185 260 200 310 195 365 C 175 365 160 350 155 320 Z"
            fill="#432EB0"
            opacity="0.35"
          />

          {/* Crossbody Tactical Strap & Flask */}
          <g>
            <path
              d="M 160 220 Q 210 280 255 340"
              stroke="url(#mimoA-strapGrad)"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <path
              d="M 162 220 Q 210 280 253 340"
              stroke="#FFE4E6"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              opacity="0.8"
            />
            {/* Geometric Connection Container / Flask */}
            <g transform="translate(225, 300) rotate(15)">
              <rect x="0" y="0" width="36" height="48" rx="10" fill="#0E1726" stroke="#43C9D8" strokeWidth="2" />
              <rect x="6" y="8" width="24" height="32" rx="6" fill="#162A45" />
              {/* Floating connection fragments inside translucent vial */}
              <circle cx="18" cy="20" r="4" fill="#43C9D8" filter="url(#mimoA-glow)" />
              <circle cx="14" cy="30" r="3" fill="#FF748C" />
              <circle cx="23" cy="28" r="2.5" fill="#FFFFFF" />
              {/* Glowing level indicator */}
              <line x1="8" y1="36" x2="28" y2="36" stroke="#43C9D8" strokeWidth="2" strokeLinecap="round" />
            </g>
          </g>

          {/* ================= ARMS & 3-FINGERED HANDS ================= */}
          {/* Left Arm (Relaxed forward gesture) */}
          <g>
            <path
              d="M 150 240 C 120 270 95 300 90 335"
              stroke="url(#mimoA-bodyGrad)"
              strokeWidth="18"
              strokeLinecap="round"
            />
            {/* Cuff accent */}
            <ellipse cx="92" cy="330" rx="11" ry="6" fill="#6C53E3" stroke="#A794FF" strokeWidth="1.5" />
            {/* 3-Fingered Hand Left (Curled expressive hold) */}
            <path
              d="M 94 336 C 85 345 75 352 70 358 C 76 363 88 355 94 348 M 90 352 C 86 362 82 370 85 372 C 92 372 98 360 100 350 M 96 348 C 98 358 102 366 108 365 C 112 360 108 350 104 342"
              stroke="#DDD5FF"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* Right Arm (Waving / Guiding gesture) */}
          <g>
            <path
              d="M 250 240 C 285 265 310 290 318 315"
              stroke="url(#mimoA-bodyGrad)"
              strokeWidth="18"
              strokeLinecap="round"
            />
            {/* Cuff accent */}
            <ellipse cx="316" cy="312" rx="11" ry="6" fill="#6C53E3" stroke="#A794FF" strokeWidth="1.5" />
            {/* 3-Fingered Hand Right (Open welcoming gesture) */}
            <path
              d="M 318 316 C 330 326 342 334 348 338 C 348 330 338 322 328 316 M 324 322 C 338 332 348 342 346 348 C 338 348 330 336 322 324 M 318 326 C 328 340 336 352 332 356 C 324 354 318 340 314 328"
              stroke="#DDD5FF"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* ================= ASYMMETRICAL CRESCENT HEAD ================= */}
          {/* Main Skull Silhouette */}
          <path
            d="M 135 150 C 115 110 145 65 190 62 C 225 60 270 80 282 120 C 295 165 280 215 250 235 C 210 255 160 250 138 220 C 122 198 126 170 135 150 Z"
            fill="url(#mimoA-bodyGrad)"
            stroke="#DCD4FF"
            strokeWidth="2"
          />

          {/* Head 3D Ambient Highlight */}
          <path
            d="M 150 90 C 180 75 240 85 260 115"
            stroke="#FFFFFF"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.5"
          />

          {/* ================= SIGNATURE ENERGY CHAMBER ================= */}
          {/* Cavity / Portal cut into upper head */}
          <path
            d="M 182 80 C 175 62 205 52 225 58 C 242 63 248 85 235 98 C 220 112 188 102 182 80 Z"
            fill="url(#mimoA-chamberGrad)"
            stroke="#6C53E3"
            strokeWidth="2.5"
          />
          {/* Inner Cyan Glowing Horizon */}
          <ellipse cx="210" cy="80" rx="24" ry="16" fill="url(#mimoA-coreEnergy)" />

          {/* Floating Radiant 4-Point Geometric Star (MIMO's Signature Identity) */}
          <g filter="url(#mimoA-glow)" className="animate-pulse">
            <path
              d="M 210 66 Q 212 78 224 80 Q 212 82 210 94 Q 208 82 196 80 Q 208 78 210 66 Z"
              fill="#FFFFFF"
            />
            <circle cx="210" cy="80" r="3.5" fill="#43C9D8" />
          </g>

          {/* Tiny suspended particles orbiting chamber */}
          <circle cx="196" cy="72" r="1.5" fill="#A5F3FC" />
          <circle cx="226" cy="88" r="1.5" fill="#FF748C" />

          {/* ================= UNCONVENTIONAL FACIAL ARCHITECTURE ================= */}
          {/* Eye 1: Left Eye - Oversized, Vertically Elongated Almond */}
          <g>
            {/* Eye Socket / Shadow */}
            <ellipse cx="172" cy="155" rx="19" ry="26" fill="#140E2D" />
            {/* Sclera & Cyan-Indigo Gradient Iris */}
            <ellipse cx="173" cy="155" rx="17" ry="24" fill="#1E1942" stroke="#43C9D8" strokeWidth="1.5" />
            {/* Vibrant Layered Iris */}
            <ellipse cx="174" cy="154" rx="13" ry="19" fill="#3B82F6" />
            <ellipse cx="175" cy="153" rx="10" ry="15" fill="#06B6D4" />
            {/* Pupil */}
            <ellipse cx="176" cy="152" rx="6" ry="10" fill="#090B14" />
            {/* Dual Star Catchlight Highlights */}
            <circle cx="172" cy="144" r="5" fill="#FFFFFF" />
            <circle cx="180" cy="160" r="2.5" fill="#FFFFFF" opacity="0.8" />
            {/* Expressive Upper Eyelid Fold */}
            <path d="M 152 140 C 165 128 185 132 194 144" stroke="#8B7CFF" strokeWidth="2.5" strokeLinecap="round" />
          </g>

          {/* Eye 2: Right Eye - Smaller, Tilted, Inquisitive Arch */}
          <g transform="rotate(8, 235, 160)">
            <ellipse cx="235" cy="158" rx="13" ry="17" fill="#140E2D" />
            <ellipse cx="235" cy="158" rx="11" ry="15" fill="#1E1942" stroke="#FF748C" strokeWidth="1.5" />
            <ellipse cx="236" cy="157" rx="8" ry="12" fill="#8B7CFF" />
            <ellipse cx="237" cy="156" rx="5" ry="8" fill="#EC4899" />
            <ellipse cx="237" cy="156" rx="3.5" ry="5.5" fill="#090B14" />
            <circle cx="233" cy="151" r="3.5" fill="#FFFFFF" />
            <circle cx="239" cy="162" r="1.5" fill="#FFFFFF" opacity="0.7" />
            {/* Expressive Eyelid */}
            <path d="M 221 146 C 232 138 244 140 250 148" stroke="#8B7CFF" strokeWidth="2.5" strokeLinecap="round" />
          </g>

          {/* Soft Coral Cheek Warmth */}
          <ellipse cx="152" cy="182" rx="9" ry="5" fill="#FF748C" opacity="0.45" />
          <ellipse cx="248" cy="184" rx="7" ry="4" fill="#FF748C" opacity="0.4" />

          {/* Small, Asymmetrical Inquisitive Mouth */}
          <path
            d="M 198 194 C 204 202 214 200 218 192"
            stroke="#2B1559"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Subtle lower lip catchlight */}
          <path d="M 203 203 C 208 205 212 204 215 201" stroke="#FFA4BA" strokeWidth="1.5" strokeLinecap="round" />

          {/* Forehead Micro-Markings (Connection Pattern) */}
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

/**
 * DIRECTION B: "Geometric Biomech Oracle"
 * - Faceted architectural skull silhouette with layered crystal carapace.
 * - Upper head features a dual-chamber prism matrix where floating chromatic shards refract light.
 * - One eye is an organic biological lens, the second is a floating tri-aperture optic ring.
 * - Tall slender torso constructed with interlocking matte bio-ceramic plates.
 * - Floating segmented tail/stabilizer ribbon draping down to the ground.
 * - High-fashion exaggerated platform boots with holographic sole prisms.
 */
export const MimoConceptB: React.FC<MimoConceptProps> = ({ className = '', size = 360, variant = 'color' }) => {
  const isSil = variant === 'silhouette';

  return (
    <svg
      viewBox="0 0 400 480"
      width={size}
      height={(size * 480) / 400}
      className={`transition-all duration-300 ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="mimoB-body" x1="100" y1="50" x2="300" y2="420" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#EDE9FE" />
          <stop offset="40%" stopColor="#C4B5FD" />
          <stop offset="80%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#3B0764" />
        </linearGradient>

        <linearGradient id="mimoB-prism" x1="160" y1="40" x2="240" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="50%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#F43F5E" />
        </linearGradient>

        <linearGradient id="mimoB-plate" x1="150" y1="220" x2="250" y2="340" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2E1065" />
          <stop offset="100%" stopColor="#1E1B4B" />
        </linearGradient>

        <filter id="mimoB-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {isSil ? (
        <g fill="#0b0f19" stroke="#374151" strokeWidth="2">
          <ellipse cx="200" cy="460" rx="90" ry="10" fill="#030408" opacity="0.6" />
          {/* Faceted angular silhouette */}
          <path d="M 120 120 L 160 40 L 240 30 L 275 80 L 310 140 L 265 230 L 255 350 L 285 430 L 225 455 L 210 370 L 185 370 L 175 455 L 115 435 L 145 350 L 135 230 Z" />
          <path d="M 260 250 Q 320 320 330 420 Q 295 440 280 370 Z" />
          <circle cx="200" cy="85" r="15" fill="#38BDF8" stroke="none" />
        </g>
      ) : (
        <g>
          {/* Ground Shadow */}
          <ellipse cx="200" cy="460" rx="95" ry="12" fill="#030408" opacity="0.75" />

          {/* Floating Kinetic Stabilizer Ribbon (Flowing around back) */}
          <path
            d="M 230 260 Q 320 310 335 410 C 330 435 305 440 285 390 C 275 350 255 310 240 285 Z"
            fill="url(#mimoB-prism)"
            opacity="0.8"
          />

          {/* ================= LEGS & PLATFORM PRISM BOOTS ================= */}
          <path d="M 160 350 L 148 420" stroke="#4C1D95" strokeWidth="18" strokeLinecap="round" />
          <path d="M 240 350 L 252 420" stroke="#4C1D95" strokeWidth="18" strokeLinecap="round" />

          {/* High-fashion Platform Left */}
          <g>
            <path d="M 125 420 L 168 415 L 178 448 L 120 455 Z" fill="#1E1B4B" stroke="#A78BFA" strokeWidth="1.5" />
            <path d="M 115 452 L 180 445 L 185 460 L 110 464 Z" fill="#06B6D4" opacity="0.9" />
          </g>

          {/* High-fashion Platform Right */}
          <g>
            <path d="M 230 415 L 275 420 L 285 455 L 222 448 Z" fill="#1E1B4B" stroke="#F43F5E" strokeWidth="1.5" />
            <path d="M 220 445 L 288 452 L 292 464 L 218 460 Z" fill="#F43F5E" opacity="0.9" />
          </g>

          {/* ================= INTERLOCKING BIOMECH TORSO ================= */}
          <path
            d="M 150 220 L 250 220 L 235 350 L 165 350 Z"
            fill="url(#mimoB-body)"
            stroke="#DDD6FE"
            strokeWidth="1.5"
          />
          {/* Ceramic Abdominal Plate */}
          <polygon points="175,240 225,240 215,310 185,310" fill="url(#mimoB-plate)" stroke="#8B5CF6" strokeWidth="1.5" />
          <circle cx="200" cy="275" r="5" fill="#38BDF8" filter="url(#mimoB-glow)" />

          {/* Slender Arms */}
          <path d="M 148 230 Q 110 270 105 320" stroke="#7C3AED" strokeWidth="12" strokeLinecap="round" />
          <path d="M 252 230 Q 290 270 295 320" stroke="#7C3AED" strokeWidth="12" strokeLinecap="round" />
          <circle cx="104" cy="325" r="7" fill="#C4B5FD" />
          <circle cx="296" cy="325" r="7" fill="#C4B5FD" />

          {/* ================= FACETED ARCHITECTURAL HEAD ================= */}
          <polygon
            points="130,140 160,50 240,40 280,100 290,170 250,225 150,225"
            fill="url(#mimoB-body)"
            stroke="#EDE9FE"
            strokeWidth="2"
          />

          {/* Prism Chamber Cavity */}
          <polygon
            points="175,65 225,60 240,105 165,110"
            fill="#0F172A"
            stroke="#A855F7"
            strokeWidth="2"
          />
          {/* Floating Chromatic Diamond Core */}
          <g filter="url(#mimoB-glow)">
            <polygon points="200,68 218,85 200,102 182,85" fill="url(#mimoB-prism)" />
            <polygon points="200,75 210,85 200,95 190,85" fill="#FFFFFF" opacity="0.75" />
          </g>

          {/* EYES */}
          {/* Left Eye: Biological Organic Diamond */}
          <ellipse cx="170" cy="160" rx="14" ry="20" fill="#09090B" stroke="#38BDF8" strokeWidth="2" />
          <circle cx="170" cy="160" r="8" fill="#38BDF8" />
          <circle cx="168" cy="156" r="3" fill="#FFFFFF" />

          {/* Right Eye: Tri-Aperture Floating Ring */}
          <circle cx="240" cy="155" r="16" stroke="#F43F5E" strokeWidth="2" strokeDasharray="6 3" />
          <circle cx="240" cy="155" r="9" fill="#09090B" stroke="#A855F7" strokeWidth="2" />
          <circle cx="240" cy="155" r="4" fill="#F43F5E" />

          {/* Minimalist Micro Mouth */}
          <line x1="195" y1="195" x2="210" y2="197" stroke="#3B0764" strokeWidth="3" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
};

/**
 * DIRECTION C: "Nebula Nomadic Shaman"
 * - Soft organic mantle with asymmetrical floating cloud-antennae.
 * - Upper head features a natural crystalline geode fissure showing pulsating starry plasma.
 * - Expressive hooded veil drape with luminescent runes.
 * - Compact teardrop torso with woven textile poncho and talisman charms.
 * - Long articulated wooden/fiber limbs with ceramic rings.
 * - Asymmetrical woven sandals with floating kinetic prayer stones.
 */
export const MimoConceptC: React.FC<MimoConceptProps> = ({ className = '', size = 360, variant = 'color' }) => {
  const isSil = variant === 'silhouette';

  return (
    <svg
      viewBox="0 0 400 480"
      width={size}
      height={(size * 480) / 400}
      className={`transition-all duration-300 ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="mimoC-cloak" x1="120" y1="100" x2="280" y2="380" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#C084FC" />
          <stop offset="50%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#1E1B4B" />
        </linearGradient>

        <radialGradient id="mimoC-plasma" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="40%" stopColor="#EC4899" />
          <stop offset="80%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#0B0F19" />
        </radialGradient>

        <filter id="mimoC-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="7" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {isSil ? (
        <g fill="#0b0f19" stroke="#374151" strokeWidth="2">
          <ellipse cx="200" cy="460" rx="90" ry="12" fill="#030408" opacity="0.6" />
          <path d="M 110 160 C 90 90 140 40 200 45 C 270 30 320 90 290 160 C 330 200 340 320 280 370 L 260 445 L 215 450 L 195 380 L 180 445 L 135 450 L 120 370 C 60 320 70 200 110 160 Z" />
          <circle cx="100" cy="70" r="18" />
          <circle cx="200" cy="90" r="14" fill="#FDE047" stroke="none" />
        </g>
      ) : (
        <g>
          {/* Ground Shadow */}
          <ellipse cx="200" cy="460" rx="95" ry="12" fill="#030408" opacity="0.75" />

          {/* Floating Cloud Antenna (Left side) */}
          <g>
            <path d="M 125 100 Q 80 80 95 55 Q 120 40 140 70" stroke="#C084FC" strokeWidth="4" fill="none" />
            <circle cx="95" cy="55" r="14" fill="#E879F9" opacity="0.8" />
            <circle cx="95" cy="55" r="7" fill="#FFFFFF" />
          </g>

          {/* ================= LEGS & NOMADIC WRAPS ================= */}
          <path d="M 160 360 L 150 435" stroke="#312E81" strokeWidth="16" strokeLinecap="round" />
          <path d="M 240 360 L 250 435" stroke="#312E81" strokeWidth="16" strokeLinecap="round" />
          {/* Woven Sandals Left */}
          <ellipse cx="145" cy="445" rx="20" ry="10" fill="#4338CA" stroke="#818CF8" strokeWidth="2" />
          {/* Woven Sandals Right */}
          <ellipse cx="255" cy="445" rx="20" ry="10" fill="#4338CA" stroke="#F472B6" strokeWidth="2" />

          {/* ================= CLOAK & TEXTILE PONCHO ================= */}
          <path
            d="M 120 180 C 80 230 90 330 130 365 C 170 380 230 380 270 365 C 310 330 320 230 280 180 Z"
            fill="url(#mimoC-cloak)"
            stroke="#DDD6FE"
            strokeWidth="1.5"
          />
          {/* Talisman Pendant Rope */}
          <path d="M 170 230 Q 200 290 230 230" stroke="#FDE047" strokeWidth="3" fill="none" />
          <circle cx="200" cy="275" r="9" fill="#06B6D4" stroke="#FFFFFF" strokeWidth="2" filter="url(#mimoC-glow)" />

          {/* Arms emerging from cloak */}
          <path d="M 110 250 C 90 280 90 320 110 335" stroke="#C084FC" strokeWidth="10" strokeLinecap="round" />
          <path d="M 290 250 C 310 280 310 320 290 335" stroke="#C084FC" strokeWidth="10" strokeLinecap="round" />

          {/* ================= HOODED / CRESCENT HEAD ================= */}
          <path
            d="M 130 160 C 105 110 135 60 200 55 C 265 60 295 110 270 160 C 255 190 230 205 200 205 C 170 205 145 190 130 160 Z"
            fill="url(#mimoC-cloak)"
            stroke="#E9D5FF"
            strokeWidth="2"
          />

          {/* Geode Fissure / Starry Plasma Chamber */}
          <path
            d="M 180 85 C 170 65 200 60 220 68 C 235 75 230 95 215 105 C 195 115 185 100 180 85 Z"
            fill="url(#mimoC-plasma)"
            stroke="#FDE047"
            strokeWidth="2"
          />
          <circle cx="202" cy="85" r="5" fill="#FFFFFF" filter="url(#mimoC-glow)" />

          {/* EYES */}
          {/* Big Deep Mystic Left Eye */}
          <ellipse cx="170" cy="145" rx="16" ry="22" fill="#09090B" stroke="#F472B6" strokeWidth="2" />
          <circle cx="170" cy="145" r="10" fill="#EC4899" />
          <circle cx="168" cy="140" r="4" fill="#FFFFFF" />

          {/* Half-Lidded Dreamy Right Eye */}
          <ellipse cx="230" cy="148" rx="14" ry="18" fill="#09090B" stroke="#818CF8" strokeWidth="2" />
          <circle cx="230" cy="148" r="8" fill="#6366F1" />
          <circle cx="228" cy="144" r="3" fill="#FFFFFF" />
          <path d="M 216 142 Q 230 132 244 142" stroke="#C084FC" strokeWidth="4" strokeLinecap="round" />

          {/* Soft Gentle Smile */}
          <path d="M 195 180 Q 200 188 210 180" stroke="#1E1B4B" strokeWidth="3" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
};
