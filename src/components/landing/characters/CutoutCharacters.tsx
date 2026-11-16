'use client';

import React from 'react';
import Image from 'next/image';

export interface CharacterCardProps {
  className?: string;
  size?: number;
  angle?: 'default' | 'reverse' | 'avatar';
  interactive?: boolean;
}

/**
 * MIMO — 3D Cutout Character with transparent background and perspective angles
 */
export const CutoutMimo: React.FC<CharacterCardProps> = ({
  className = '',
  size = 240,
  angle = 'default',
  interactive = true,
}) => {
  const src =
    angle === 'reverse'
      ? '/cutout_mimo_alt.png'
      : angle === 'avatar'
      ? '/cutout_mimo_avatar.png'
      : '/cutout_mimo.png';

  const aspectRatio = angle === 'avatar' ? 260 / 242 : 260 / 440;

  return (
    <div
      style={{ width: size, height: size / aspectRatio }}
      className={`relative select-none transition-transform duration-300 ${
        interactive ? 'cursor-pointer hover:scale-110 active:scale-95' : ''
      } ${className}`}
    >
      <div className="absolute inset-0 bg-radial from-purple-500/25 via-transparent to-transparent blur-2xl pointer-events-none" />
      <Image
        src={src}
        alt="NEXUS MIMO Mascot"
        fill
        sizes="(max-width: 768px) 180px, 300px"
        className="object-contain filter drop-shadow-[0_15px_30px_rgba(139,92,246,0.5)]"
        priority
      />
    </div>
  );
};

/**
 * ZYRO — 3D Cutout Gamer Character
 */
export const CutoutZyro: React.FC<CharacterCardProps> = ({
  className = '',
  size = 230,
  angle = 'default',
  interactive = true,
}) => {
  const src =
    angle === 'reverse'
      ? '/cutout_zyro_alt.png'
      : angle === 'avatar'
      ? '/cutout_zyro_avatar.png'
      : '/cutout_zyro.png';

  const aspectRatio = angle === 'avatar' ? 215 / 294 : 215 / 535;

  return (
    <div
      style={{ width: size, height: size / aspectRatio }}
      className={`relative select-none transition-transform duration-300 ${
        interactive ? 'cursor-pointer hover:scale-110 active:scale-95' : ''
      } ${className}`}
    >
      <div className="absolute inset-0 bg-radial from-cyan-500/25 via-transparent to-transparent blur-2xl pointer-events-none" />
      <Image
        src={src}
        alt="NEXUS ZYRO Character"
        fill
        sizes="(max-width: 768px) 180px, 300px"
        className="object-contain filter drop-shadow-[0_15px_30px_rgba(6,182,212,0.5)]"
        priority
      />
    </div>
  );
};

/**
 * VEX — 3D Cutout Streetwear Character
 */
export const CutoutVex: React.FC<CharacterCardProps> = ({
  className = '',
  size = 250,
  angle = 'default',
  interactive = true,
}) => {
  const src =
    angle === 'reverse'
      ? '/cutout_vex_alt.png'
      : angle === 'avatar'
      ? '/cutout_vex_avatar.png'
      : '/cutout_vex.png';

  const aspectRatio = angle === 'avatar' ? 250 / 297 : 250 / 540;

  return (
    <div
      style={{ width: size, height: size / aspectRatio }}
      className={`relative select-none transition-transform duration-300 ${
        interactive ? 'cursor-pointer hover:scale-110 active:scale-95' : ''
      } ${className}`}
    >
      <div className="absolute inset-0 bg-radial from-pink-500/25 via-transparent to-transparent blur-2xl pointer-events-none" />
      <Image
        src={src}
        alt="NEXUS VEX Character"
        fill
        sizes="(max-width: 768px) 180px, 300px"
        className="object-contain filter drop-shadow-[0_15px_30px_rgba(236,72,153,0.5)]"
        priority
      />
    </div>
  );
};

/**
 * ORBI — 3D Cutout Floating Companion Bot
 */
export const CutoutOrbi: React.FC<CharacterCardProps> = ({
  className = '',
  size = 190,
  angle = 'default',
  interactive = true,
}) => {
  const src =
    angle === 'reverse'
      ? '/cutout_orbi_alt.png'
      : angle === 'avatar'
      ? '/cutout_orbi_avatar.png'
      : '/cutout_orbi.png';

  const aspectRatio = angle === 'avatar' ? 195 / 143 : 195 / 260;

  return (
    <div
      style={{ width: size, height: size / aspectRatio }}
      className={`relative select-none transition-transform duration-300 ${
        interactive ? 'cursor-pointer hover:scale-110 active:scale-95' : ''
      } ${className}`}
    >
      <div className="absolute inset-0 bg-radial from-cyan-400/30 via-transparent to-transparent blur-2xl pointer-events-none" />
      <Image
        src={src}
        alt="NEXUS ORBI Companion Robot"
        fill
        sizes="(max-width: 768px) 150px, 240px"
        className="object-contain filter drop-shadow-[0_15px_30px_rgba(56,189,248,0.5)]"
        priority
      />
    </div>
  );
};
