import React from 'react';
import { MimoMascotV2, ZyroMascotV2, VexMascotV2, OrbiMascotV2 } from '../characters';

export const HeroUniverse: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative w-full h-[580px] md:h-[660px] flex items-center justify-center select-none ${className}`}>
      {/* Background Cosmic Constellation SVG */}
      <svg
        viewBox="0 0 800 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full pointer-events-none opacity-45"
      >
        <defs>
          <radialGradient id="heroCenterAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.45" />
            <stop offset="60%" stopColor="#06B6D4" stopOpacity="0.15" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="400" cy="300" r="280" fill="url(#heroCenterAura)" />
        <ellipse cx="400" cy="300" rx="340" ry="140" stroke="#8B5CF6" strokeWidth="1.5" strokeDasharray="6 6" />
        <ellipse cx="400" cy="300" rx="220" ry="260" stroke="#06B6D4" strokeWidth="1" strokeDasharray="4 8" />

        {/* Constellation Connection Lines */}
        <line x1="180" y1="160" x2="380" y2="290" stroke="#C084FC" strokeWidth="1.5" strokeDasharray="3 3" />
        <line x1="380" y1="290" x2="600" y2="180" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="3 3" />
        <line x1="380" y1="290" x2="520" y2="460" stroke="#F43F5E" strokeWidth="1.5" strokeDasharray="3 3" />
        <line x1="180" y1="160" x2="220" y2="440" stroke="#A78BFA" strokeWidth="1.5" strokeDasharray="3 3" />

        {/* Star Nodes */}
        <circle cx="180" cy="160" r="5" fill="#FDE047" />
        <circle cx="600" cy="180" r="6" fill="#38BDF8" />
        <circle cx="220" cy="440" r="5" fill="#A855F7" />
        <circle cx="520" cy="460" r="5" fill="#F43F5E" />
      </svg>

      {/* Floating Interactive Chat Bubble 1 */}
      <div className="absolute top-8 left-2 md:left-12 z-40 p-3 rounded-2xl bg-[#090c16]/85 backdrop-blur-xl border border-white/20 shadow-xl animate-mascot-float">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎮</span>
          <div>
            <div className="text-xs font-bold text-white">کی پرمیر کانتر پایه‌س؟</div>
            <div className="text-[10px] text-cyan-300">لابی صوتی ۳ از ۵ نفر • ZYRO آنلاینه</div>
          </div>
        </div>
      </div>

      {/* Floating Interactive Chat Bubble 2 */}
      <div className="absolute bottom-12 right-2 md:right-14 z-40 p-3 rounded-2xl bg-[#090c16]/85 backdrop-blur-xl border border-white/20 shadow-xl animate-mascot-float-reverse">
        <div className="flex items-center gap-2">
          <span className="text-xl">✨</span>
          <div>
            <div className="text-xs font-bold text-white">مومنت هوش مصنوعی شروع شد!</div>
            <div className="text-[10px] text-pink-300">MIMO و VEX در حال استریم</div>
          </div>
        </div>
      </div>

      {/* Center Social Metropolis Planet */}
      <div className="absolute z-10 w-48 h-48 rounded-full bg-gradient-to-tr from-purple-700 via-indigo-600 to-cyan-500 shadow-[0_0_90px_rgba(139,92,246,0.65)] flex items-center justify-center border-2 border-white/30 animate-energy-bob">
        <div className="absolute inset-2 rounded-full border border-white/20 animate-spin" style={{ animationDuration: '40s' }}>
          <div className="w-3.5 h-3.5 rounded-full bg-cyan-300 absolute -top-1.5 left-1/2 -translate-x-1/2 shadow-[0_0_12px_#38bdf8]" />
        </div>
        <span className="text-5xl filter drop-shadow">🌌</span>
      </div>

      {/* Character 1: ZYRO V2 (Upper Left - Animated Floating Kinetic Rebel) */}
      <div className="absolute top-2 left-6 md:left-16 z-30 transition-all duration-300 hover:scale-110 cursor-pointer animate-mascot-float">
        <ZyroMascotV2 size={210} pose="gaming" expression="confident" />
      </div>

      {/* Character 2: MIMO V2 (Upper Right - The Emotional Center) */}
      <div className="absolute top-4 right-6 md:right-16 z-30 transition-all duration-300 hover:scale-110 cursor-pointer animate-mascot-float-reverse">
        <MimoMascotV2 size={210} expression="excited" pose="wave" />
      </div>

      {/* Character 3: VEX V2 (Lower Left - Fashion Architectural Stance) */}
      <div className="absolute bottom-4 left-6 md:left-24 z-30 transition-all duration-300 hover:scale-110 cursor-pointer animate-mascot-float-reverse">
        <VexMascotV2 size={220} pose="creative" expression="confident" />
      </div>

      {/* Character 4: ORBI V2 (Lower Right - Floating Mechanical Impossible Machine) */}
      <div className="absolute bottom-6 right-6 md:right-24 z-30 transition-all duration-300 hover:scale-110 cursor-pointer animate-mascot-float">
        <OrbiMascotV2 size={200} pose="scanning" expression="curious" />
      </div>
    </div>
  );
};
