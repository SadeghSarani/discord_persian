'use client';

import React from 'react';
import Image from 'next/image';

export interface OfficialCharacterProps {
  className?: string;
  size?: number;
  interactive?: boolean;
}

/**
 * MIMO OFFICIAL 3D MASCOT
 * Cute lavender plush creature in oversized purple hoodie with ear cutouts,
 * black cargo strap bag, and white-purple chunky sneakers, waving cheerfully.
 */
export const OfficialMimo: React.FC<OfficialCharacterProps> = ({
  className = '',
  size = 280,
  interactive = true,
}) => {
  return (
    <div
      style={{ width: size, height: (size * 478) / 297 }}
      className={`relative select-none transition-transform duration-300 ${
        interactive ? 'cursor-pointer hover:scale-105 active:scale-95' : ''
      } ${className}`}
    >
      <div className="absolute inset-0 bg-radial from-purple-500/20 via-transparent to-transparent blur-xl pointer-events-none" />
      <Image
        src="/nexus_mimo_official.png"
        alt="NEXUS MIMO Official Mascot"
        fill
        sizes="(max-width: 768px) 200px, 320px"
        className="object-contain filter drop-shadow-[0_15px_30px_rgba(139,92,246,0.4)]"
        priority
      />
    </div>
  );
};

/**
 * ZYRO OFFICIAL CHARACTER
 * Energetic cool boy with black hair and purple/blue highlights,
 * glowing cyan cyberpunk headphones, blue/violet streetwear jacket and high-top sneakers.
 */
export const OfficialZyro: React.FC<OfficialCharacterProps> = ({
  className = '',
  size = 280,
  interactive = true,
}) => {
  return (
    <div
      style={{ width: size, height: (size * 553) / 225 }}
      className={`relative select-none transition-transform duration-300 ${
        interactive ? 'cursor-pointer hover:scale-105 active:scale-95' : ''
      } ${className}`}
    >
      <div className="absolute inset-0 bg-radial from-cyan-500/20 via-transparent to-transparent blur-xl pointer-events-none" />
      <Image
        src="/nexus_zyro_official.png"
        alt="NEXUS ZYRO Official Character"
        fill
        sizes="(max-width: 768px) 200px, 320px"
        className="object-contain filter drop-shadow-[0_15px_30px_rgba(6,182,212,0.4)]"
        priority
      />
    </div>
  );
};

/**
 * VEX OFFICIAL CHARACTER
 * Confident fashionable girl with vibrant wavy magenta/coral hair,
 * hoop earrings, black crop top with oversized dark streetwear bomber jacket, cargo pants with pink straps.
 */
export const OfficialVex: React.FC<OfficialCharacterProps> = ({
  className = '',
  size = 300,
  interactive = true,
}) => {
  return (
    <div
      style={{ width: size, height: (size * 559) / 266 }}
      className={`relative select-none transition-transform duration-300 ${
        interactive ? 'cursor-pointer hover:scale-105 active:scale-95' : ''
      } ${className}`}
    >
      <div className="absolute inset-0 bg-radial from-pink-500/20 via-transparent to-transparent blur-xl pointer-events-none" />
      <Image
        src="/nexus_vex_official.png"
        alt="NEXUS VEX Official Character"
        fill
        sizes="(max-width: 768px) 200px, 320px"
        className="object-contain filter drop-shadow-[0_15px_30px_rgba(236,72,153,0.4)]"
        priority
      />
    </div>
  );
};

/**
 * ORBI OFFICIAL FLOATING COMPANION BOT
 * Sleek floating futuristic white & silver companion robot with glowing cyan curved smile/eyes display,
 * spherical ear modules, and purple illumination accents.
 */
export const OfficialOrbi: React.FC<OfficialCharacterProps> = ({
  className = '',
  size = 220,
  interactive = true,
}) => {
  return (
    <div
      style={{ width: size, height: (size * 288) / 205 }}
      className={`relative select-none transition-transform duration-300 ${
        interactive ? 'cursor-pointer hover:scale-105 active:scale-95' : ''
      } ${className}`}
    >
      <div className="absolute inset-0 bg-radial from-cyan-400/25 via-transparent to-transparent blur-xl pointer-events-none" />
      <Image
        src="/nexus_orbi_official.png"
        alt="NEXUS ORBI Official Bot"
        fill
        sizes="(max-width: 768px) 160px, 240px"
        className="object-contain filter drop-shadow-[0_15px_30px_rgba(56,189,248,0.45)]"
        priority
      />
    </div>
  );
};

/**
 * OFFICIAL SQUAD BANNER & HERO SCENE
 */
export const OfficialSquadScene: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative w-full max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-white/15 ${className}`}>
      <div className="relative w-full aspect-[1024/576]">
        <Image
          src="/nexus_characters_squad.jpg"
          alt="NEXUS UNIVERSE Official Characters (MIMO, ZYRO, VEX, ORBI)"
          fill
          sizes="(max-width: 1200px) 100vw, 1200px"
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
};
