'use client';

import React from 'react';
import { NexusGlyphProps, NexusGlyphName } from './types';
import { GLYPH_PATHS } from './paths';

export const NexusIcon: React.FC<NexusGlyphProps> = ({
  name,
  size = 24,
  strokeWidth = 1.75,
  active = false,
  animate = 'none',
  className = '',
  title,
  ...props
}) => {
  const pathRenderer = GLYPH_PATHS[name];

  if (!pathRenderer) {
    console.warn(`[NEXUS GLYPHS] Glyph "${name}" is not recognized.`);
    return null;
  }

  // Animation classes
  const getAnimationClass = () => {
    switch (animate) {
      case 'spin':
        return 'animate-spin';
      case 'pulse':
        return 'animate-pulse';
      case 'bounce':
        return 'animate-bounce';
      case 'radar-sweep':
        return 'origin-center animate-[spin_4s_linear_infinite]';
      case 'glow':
        return 'filter drop-shadow-[0_0_8px_currentColor]';
      case 'wave':
        return 'animate-[pulse_1.5s_ease-in-out_infinite]';
      default:
        return '';
    }
  };

  const animClass = getAnimationClass();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={!title}
      role={title ? 'img' : 'presentation'}
      className={`nexus-glyph nexus-glyph-${name} transition-all duration-200 ${animClass} ${className}`}
      {...props}
    >
      {title && <title>{title}</title>}
      {pathRenderer({ strokeWidth, active })}
    </svg>
  );
};

// Export convenience individual components
export const NexusCore: React.FC<Omit<NexusGlyphProps, 'name'>> = (p) => <NexusIcon name="core" {...p} />;
export const NexusHome: React.FC<Omit<NexusGlyphProps, 'name'>> = (p) => <NexusIcon name="home" {...p} />;
export const NexusExplore: React.FC<Omit<NexusGlyphProps, 'name'>> = (p) => <NexusIcon name="explore" {...p} />;
export const NexusMoments: React.FC<Omit<NexusGlyphProps, 'name'>> = (p) => <NexusIcon name="moments" {...p} />;
export const NexusSignal: React.FC<Omit<NexusGlyphProps, 'name'>> = (p) => <NexusIcon name="signal" {...p} />;
export const NexusCommunities: React.FC<Omit<NexusGlyphProps, 'name'>> = (p) => <NexusIcon name="communities" {...p} />;
export const NexusFriends: React.FC<Omit<NexusGlyphProps, 'name'>> = (p) => <NexusIcon name="friends" {...p} />;
export const NexusMessages: React.FC<Omit<NexusGlyphProps, 'name'>> = (p) => <NexusIcon name="messages" {...p} />;
export const NexusVoice: React.FC<Omit<NexusGlyphProps, 'name'>> = (p) => <NexusIcon name="voice" {...p} />;
export const NexusVideo: React.FC<Omit<NexusGlyphProps, 'name'>> = (p) => <NexusIcon name="video" {...p} />;
export const NexusRadar: React.FC<Omit<NexusGlyphProps, 'name'>> = (p) => <NexusIcon name="radar" {...p} />;
export const NexusPlayground: React.FC<Omit<NexusGlyphProps, 'name'>> = (p) => <NexusIcon name="playground" {...p} />;
export const NexusQuests: React.FC<Omit<NexusGlyphProps, 'name'>> = (p) => <NexusIcon name="quests" {...p} />;
export const NexusXP: React.FC<Omit<NexusGlyphProps, 'name'>> = (p) => <NexusIcon name="xp" {...p} />;
export const NexusLevel: React.FC<Omit<NexusGlyphProps, 'name'>> = (p) => <NexusIcon name="level" {...p} />;
export const NexusAchievements: React.FC<Omit<NexusGlyphProps, 'name'>> = (p) => <NexusIcon name="achievements" {...p} />;
export const NexusTrending: React.FC<Omit<NexusGlyphProps, 'name'>> = (p) => <NexusIcon name="trending" {...p} />;
export const NexusAI: React.FC<Omit<NexusGlyphProps, 'name'>> = (p) => <NexusIcon name="ai" {...p} />;
export const NexusNotifications: React.FC<Omit<NexusGlyphProps, 'name'>> = (p) => <NexusIcon name="notifications" {...p} />;
export const NexusProfile: React.FC<Omit<NexusGlyphProps, 'name'>> = (p) => <NexusIcon name="profile" {...p} />;

export default NexusIcon;
