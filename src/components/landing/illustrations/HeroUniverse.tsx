import React from 'react';
import { Zyro, Mimo, Vex, Orbi } from '../characters';

export const HeroUniverse: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative w-full h-[540px] md:h-[620px] flex items-center justify-center select-none ${className}`}>
      {/* Background Cosmic Constellation SVG */}
      <svg
        viewBox="0 0 800 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
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
        <line x1="220" y1="180" x2="380" y2="290" stroke="#C084FC" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="380" y1="290" x2="580" y2="210" stroke="#38BDF8" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="380" y1="290" x2="490" y2="440" stroke="#F43F5E" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="220" y1="180" x2="260" y2="420" stroke="#A78BFA" strokeWidth="1" strokeDasharray="3 3" />

        {/* Star Nodes */}
        <circle cx="220" cy="180" r="4" fill="#FDE047" />
        <circle cx="580" cy="210" r="5" fill="#38BDF8" />
        <circle cx="260" cy="420" r="4.5" fill="#A855F7" />
        <circle cx="490" cy="440" r="4" fill="#F43F5E" />
      </svg>

      {/* Floating Interactive Chat Bubble 1 */}
      <div className="absolute top-12 left-4 md:left-16 z-20 p-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl animate-bounce-gentle">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎮</span>
          <div>
            <div className="text-xs font-bold text-white">کی پرمیر کانتر پایه‌س؟</div>
            <div className="text-[10px] text-cyan-300">لابی صوتی ۳ از ۵ نفر</div>
          </div>
        </div>
      </div>

      {/* Floating Interactive Chat Bubble 2 */}
      <div className="absolute bottom-16 right-4 md:right-20 z-20 p-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl animate-float-slow">
        <div className="flex items-center gap-2">
          <span className="text-xl">✨</span>
          <div>
            <div className="text-xs font-bold text-white">مومنت هوش مصنوعی شروع شد!</div>
            <div className="text-[10px] text-pink-300">۲۲ نفر آنلاین در استیج</div>
          </div>
        </div>
      </div>

      {/* Center Social Metropolis Planet */}
      <div className="absolute z-10 w-44 h-44 rounded-full bg-gradient-to-tr from-purple-700 via-indigo-600 to-cyan-500 shadow-[0_0_80px_rgba(139,92,246,0.6)] flex items-center justify-center border-2 border-white/30">
        <div className="absolute inset-2 rounded-full border border-white/20 animate-spin" style={{ animationDuration: '40s' }}>
          <div className="w-3 h-3 rounded-full bg-cyan-300 absolute -top-1.5 left-1/2 -translate-x-1/2 shadow-[0_0_10px_#38bdf8]" />
        </div>
        <span className="text-4xl filter drop-shadow">🌌</span>
      </div>

      {/* Character 1: ZYRO (Upper Left) */}
      <div className="absolute top-8 left-12 md:left-24 z-30 transition-transform duration-300 hover:scale-110 cursor-pointer">
        <Zyro size={160} />
      </div>

      {/* Character 2: MIMO (Upper Right) */}
      <div className="absolute top-14 right-10 md:right-28 z-30 transition-transform duration-300 hover:scale-110 cursor-pointer">
        <Mimo size={145} />
      </div>

      {/* Character 3: VEX (Lower Left) */}
      <div className="absolute bottom-10 left-10 md:left-32 z-30 transition-transform duration-300 hover:scale-110 cursor-pointer">
        <Vex size={170} />
      </div>

      {/* Character 4: ORBI (Lower Right) */}
      <div className="absolute bottom-12 right-12 md:right-36 z-30 transition-transform duration-300 hover:scale-110 cursor-pointer">
        <Orbi size={135} />
      </div>
    </div>
  );
};
