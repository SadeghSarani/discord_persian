import React from 'react';
import { NexusGlyphName } from './types';

interface GlyphSvgInternalProps {
  strokeWidth: number;
  active: boolean;
}

export const GLYPH_PATHS: Record<NexusGlyphName, (props: GlyphSvgInternalProps) => React.ReactNode> = {
  // 1. NexusCore: Abstract geometric symbol of converging cosmic paths & interconnected social network
  core: ({ strokeWidth, active }) => (
    <>
      <circle cx="12" cy="12" r={active ? 3.5 : 2.5} fill={active ? 'currentColor' : 'none'} />
      <path d="M12 2.5V6.5M12 17.5V21.5M2.5 12H6.5M17.5 12H21.5" />
      <path d="M5.3 5.3L8.1 8.1M15.9 15.9L18.7 18.7M18.7 5.3L15.9 8.1M8.1 15.9L5.3 18.7" />
      {active && <circle cx="12" cy="12" r="8" strokeDasharray="3 3" />}
    </>
  ),

  // 2. NexusHome: Futuristic orbital command station
  home: ({ strokeWidth, active }) => (
    <>
      <polygon points="12 2.5 21 8.5 21 19.5 3 19.5 3 8.5" fill={active ? 'currentColor' : 'none'} fillOpacity={active ? 0.15 : 0} />
      <polyline points="7 19.5 7 13.5 17 13.5 17 19.5" />
      <circle cx="12" cy="8.5" r="1.5" fill={active ? 'currentColor' : 'none'} />
      {active && <line x1="3" y1="21.5" x2="21" y2="21.5" />}
    </>
  ),

  // 3. NexusExplore: Futuristic astrolabe & directional celestial compass
  explore: ({ strokeWidth, active }) => (
    <>
      <circle cx="12" cy="12" r="9" />
      <polygon points="12 4.5 15.5 12 12 19.5 8.5 12" fill={active ? 'currentColor' : 'none'} fillOpacity={active ? 0.2 : 0} />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <path d="M3 12H5M19 12H21M12 3V5M12 19V21" />
    </>
  ),

  // 4. NexusMoments: Signature incomplete circular orbital loop with central pulsating active hub
  moments: ({ strokeWidth, active }) => (
    <>
      <path d="M12 3A9 9 0 1 1 4.5 16.5" />
      <polyline points="4.5 11 4.5 16.5 10 16.5" />
      <circle cx="12" cy="12" r={active ? 3 : 2} fill={active ? 'currentColor' : 'none'} />
      {active && <circle cx="18" cy="8" r="1" fill="currentColor" />}
    </>
  ),

  // 5. NexusSignal: Signature intent node emitting directional converging signal waves
  signal: ({ strokeWidth, active }) => (
    <>
      <circle cx="12" cy="12" r={active ? 3 : 2} fill="currentColor" />
      <path d="M8 8C5.8 10.2 5.8 13.8 8 16" />
      <path d="M16 8C18.2 10.2 18.2 13.8 16 16" />
      <path d="M5 5C1.1 8.9 1.1 15.1 5 19" />
      <path d="M19 5C22.9 8.9 22.9 15.1 19 19" />
      {active && <circle cx="12" cy="12" r="5" strokeDasharray="2 2" />}
    </>
  ),

  // 6. NexusCommunities: Concentric planetary orbits forming an interconnected gaming multiverse
  communities: ({ strokeWidth, active }) => (
    <>
      <circle cx="8" cy="9" r="4.5" fill={active ? 'currentColor' : 'none'} fillOpacity={active ? 0.15 : 0} />
      <circle cx="16" cy="15" r="5.5" />
      <path d="M12 12L12.5 11.5M4 9C4 5 7 2 11 2M13 22C18 22 21 19 21 14" strokeDasharray="2 2" />
    </>
  ),

  // 7. NexusFriends: Dual reciprocal social nodes bonded by an orbital quantum axis
  friends: ({ strokeWidth, active }) => (
    <>
      <circle cx="8.5" cy="8.5" r="3.5" />
      <circle cx="15.5" cy="8.5" r="3.5" />
      <path d="M3.5 19.5C3.5 16 6 14 8.5 14C11 14 12 15 12 15.5" />
      <path d="M20.5 19.5C20.5 16 18 14 15.5 14C13.5 14 12.5 14.8 12 15.5" />
      {active && <line x1="8.5" y1="8.5" x2="15.5" y2="8.5" strokeDasharray="1.5 1.5" />}
    </>
  ),

  // 8. NexusMessages: Geometric holographic signal capsule with encoded telemetry lines
  messages: ({ strokeWidth, active }) => (
    <>
      <path d="M3 6.5C3 4.8 4.3 3.5 6 3.5H18C19.7 3.5 21 4.8 21 6.5V15.5C21 17.2 19.7 18.5 18 18.5H8L3 21.5V6.5Z" fill={active ? 'currentColor' : 'none'} fillOpacity={active ? 0.15 : 0} />
      <line x1="7" y1="8.5" x2="17" y2="8.5" />
      <line x1="7" y1="13.5" x2="13" y2="13.5" />
    </>
  ),

  // 9. NexusVoice: Polygonal acoustic frequency diaphragm with radial acoustic wave emission
  voice: ({ strokeWidth, active }) => (
    <>
      <rect x="8.5" y="3" width="7" height="12" rx="3.5" fill={active ? 'currentColor' : 'none'} fillOpacity={active ? 0.2 : 0} />
      <path d="M4.5 10.5C4.5 14.6 7.9 18 12 18C16.1 18 19.5 14.6 19.5 10.5" />
      <line x1="12" y1="18" x2="12" y2="21.5" />
      <line x1="8" y1="21.5" x2="16" y2="21.5" />
    </>
  ),

  // 10. NexusVideo: Holographic optical cinema lens with geometric live transmission field
  video: ({ strokeWidth, active }) => (
    <>
      <rect x="2.5" y="5.5" width="13" height="13" rx="3" fill={active ? 'currentColor' : 'none'} fillOpacity={active ? 0.15 : 0} />
      <polygon points="15.5 10 21.5 6.5 21.5 17.5 15.5 14" fill={active ? 'currentColor' : 'none'} />
      <circle cx="9" cy="12" r="2" fill={active ? 'currentColor' : 'none'} />
    </>
  ),

  // 11. NexusRadar: Signature precise scanning arc with localized connection coordinates
  radar: ({ strokeWidth, active }) => (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="12" x2="19.5" y2="7" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <circle cx="17" cy="8.5" r="1" fill="currentColor" />
      {active && <circle cx="7" cy="15" r="1" fill="currentColor" />}
    </>
  ),

  // 12. NexusPlayground: Signature premium geometric co-op glyph with dynamic vertex angles
  playground: ({ strokeWidth, active }) => (
    <>
      <polygon points="12 2.5 21.5 8 18 19.5 6 19.5 2.5 8" fill={active ? 'currentColor' : 'none'} fillOpacity={active ? 0.15 : 0} />
      <circle cx="8.5" cy="10" r="1.5" fill="currentColor" />
      <circle cx="15.5" cy="10" r="1.5" fill="currentColor" />
      <polyline points="9 15.5 12 13.5 15 15.5" />
    </>
  ),

  // 13. NexusQuests: Diamond celestial milestone with progressive target vector
  quests: ({ strokeWidth, active }) => (
    <>
      <polygon points="12 2 21 12 12 22 3 12" fill={active ? 'currentColor' : 'none'} fillOpacity={active ? 0.15 : 0} />
      <polygon points="12 6.5 17.5 12 12 17.5 6.5 12" fill={active ? 'currentColor' : 'none'} />
      <circle cx="12" cy="12" r="1.5" fill="#ffffff" />
    </>
  ),

  // 14. NexusXP: Plasma energy crystal with multi-tier orbital charge lines
  xp: ({ strokeWidth, active }) => (
    <>
      <polygon points="13 2 4 13.5 11 13.5 10 22 20 9.5 13 9.5" fill={active ? 'currentColor' : 'none'} fillOpacity={active ? 0.3 : 0} />
      {active && <path d="M2.5 2.5L5.5 5.5M18.5 18.5L21.5 21.5" />}
    </>
  ),

  // 15. NexusLevel: Stepped hierarchical tier crest with ascending orbital chevron
  level: ({ strokeWidth, active }) => (
    <>
      <polyline points="4 16 12 10 20 16" />
      <polyline points="4 11 12 5 20 11" />
      <polyline points="4 21 12 15 20 21" />
      {active && <circle cx="12" cy="3" r="1.5" fill="currentColor" />}
    </>
  ),

  // 16. NexusAchievements: Hexagonal orbital victor star with sovereign crown crest
  achievements: ({ strokeWidth, active }) => (
    <>
      <circle cx="12" cy="9.5" r="6.5" fill={active ? 'currentColor' : 'none'} fillOpacity={active ? 0.2 : 0} />
      <polygon points="12 5.5 13.5 8.5 16.5 9 14 11.5 15 14.5 12 13 9 14.5 10 11.5 7.5 9 10.5 8.5" fill="currentColor" />
      <polyline points="7.5 14.5 5 21.5 12 18.5 19 21.5 16.5 14.5" />
    </>
  ),

  // 17. NexusTrending: High-velocity cosmic momentum vector with ascending telemetry trail
  trending: ({ strokeWidth, active }) => (
    <>
      <polyline points="21 7 13 15 8 10 3 15" />
      <polyline points="15 7 21 7 21 13" />
      <circle cx="21" cy="7" r="1.5" fill="currentColor" />
      {active && <line x1="3" y1="19.5" x2="21" y2="19.5" strokeDasharray="2 2" />}
    </>
  ),

  // 18. NexusAI: Synaptic computational matrix with neural network nodes
  ai: ({ strokeWidth, active }) => (
    <>
      <rect x="5" y="5" width="14" height="14" rx="4" fill={active ? 'currentColor' : 'none'} fillOpacity={active ? 0.15 : 0} />
      <circle cx="9" cy="9" r="1.5" fill="currentColor" />
      <circle cx="15" cy="9" r="1.5" fill="currentColor" />
      <circle cx="12" cy="15" r="1.5" fill="currentColor" />
      <line x1="9" y1="9" x2="15" y2="9" />
      <line x1="9" y1="9" x2="12" y2="15" />
      <line x1="15" y1="9" x2="12" y2="15" />
      <path d="M12 2V4M12 20V22M2 12H4M20 12H22" />
    </>
  ),

  // 19. NexusNotifications: Resonant alert beacon with dual broadcast ripples
  notifications: ({ strokeWidth, active }) => (
    <>
      <path d="M18 8A6 6 0 0 0 6 8C6 14 3.5 16.5 3.5 16.5H20.5S18 14 18 8" fill={active ? 'currentColor' : 'none'} fillOpacity={active ? 0.15 : 0} />
      <path d="M10.3 20A2 2 0 0 0 13.7 20" />
      <circle cx="18" cy="5" r={active ? 2.5 : 2} fill="#ec4899" stroke="#090b14" strokeWidth="1.5" />
    </>
  ),

  // 20. NexusProfile: Biometric identity orbital pod with verified clearance ring
  profile: ({ strokeWidth, active }) => (
    <>
      <circle cx="12" cy="8" r="4.5" fill={active ? 'currentColor' : 'none'} fillOpacity={active ? 0.2 : 0} />
      <path d="M4.5 20C4.5 16.5 8 14.5 12 14.5C16 14.5 19.5 16.5 19.5 20" />
      {active && <circle cx="12" cy="12" r="10" strokeDasharray="3 3" />}
    </>
  ),
};
