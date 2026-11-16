'use client';

import React from 'react';
import { MimoMascotV2 } from './MimoMascotV2';
import { ZyroMascotV2 } from './ZyroMascotV2';
import { VexMascotV2 } from './VexMascotV2';
import { OrbiMascotV2 } from './OrbiMascotV2';

export interface OddverseGroupProps {
  className?: string;
  variant?: 'color' | 'silhouette';
}

/**
 * NEXUS ODDVERSE GROUP COMPOSITION V2
 * Unifies MIMO (Emotional Center), ZYRO (Kinetic Rebel), VEX (Abstract Creator), and ORBI (Impossible Machine).
 */
export const NexusOddverseGroup: React.FC<OddverseGroupProps> = ({
  className = '',
  variant = 'color',
}) => {
  return (
    <div className={`relative w-full max-w-6xl mx-auto h-[540px] flex items-center justify-center select-none ${className}`} dir="ltr">
      {/* Background Energy Matrix & Convergence Grid */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[340px] bg-gradient-to-r from-purple-600/20 via-cyan-500/15 to-pink-500/20 rounded-full blur-[110px]" />
      </div>

      {/* 1. VEX (Back Left - Tall Architectural Silhouette) */}
      <div className="absolute left-[5%] bottom-8 z-10 hover:z-30 transition-transform duration-500 hover:scale-105">
        <VexMascotV2 size={330} variant={variant} pose="creative" />
      </div>

      {/* 2. ORBI (Back Right - Floating Impossible Machine Orbiting High) */}
      <div className="absolute right-[6%] top-6 z-10 hover:z-30 transition-transform duration-500 hover:scale-105">
        <OrbiMascotV2 size={300} variant={variant} pose="scanning" />
      </div>

      {/* 3. ZYRO (Front Right - Energetic Forward Leaning Kinetic Stance) */}
      <div className="absolute right-[14%] bottom-4 z-20 hover:z-30 transition-transform duration-500 hover:scale-105">
        <ZyroMascotV2 size={340} variant={variant} pose="gaming" expression="confident" />
      </div>

      {/* 4. MIMO (Front Center - The Emotional Center & Mascot Hero) */}
      <div className="relative z-30 transition-transform duration-500 hover:scale-110">
        <MimoMascotV2 size={380} variant={variant} expression="excited" pose="celebrate" />
      </div>
    </div>
  );
};
