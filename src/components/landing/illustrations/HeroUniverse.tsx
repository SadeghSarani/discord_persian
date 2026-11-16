import React from 'react';
import {
  CutoutMimo,
  CutoutZyro,
  CutoutVex,
  CutoutOrbi,
} from '../characters';

export const HeroUniverse: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative w-full max-w-6xl mx-auto h-[600px] md:h-[680px] flex items-center justify-center select-none ${className}`}>
      {/* Background Cosmic Energy Aura & Constellation */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[650px] h-[360px] bg-gradient-to-r from-purple-600/25 via-cyan-500/20 to-pink-500/25 rounded-full blur-[130px]" />
      </div>

      <svg
        viewBox="0 0 800 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
      >
        <ellipse cx="400" cy="300" rx="340" ry="140" stroke="#8B5CF6" strokeWidth="1.5" strokeDasharray="6 6" />
        <ellipse cx="400" cy="300" rx="220" ry="260" stroke="#06B6D4" strokeWidth="1" strokeDasharray="4 8" />
        <line x1="160" y1="200" x2="380" y2="290" stroke="#C084FC" strokeWidth="1.5" strokeDasharray="3 3" />
        <line x1="380" y1="290" x2="620" y2="220" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="3 3" />
        <line x1="380" y1="290" x2="520" y2="480" stroke="#F43F5E" strokeWidth="1.5" strokeDasharray="3 3" />
        <line x1="160" y1="200" x2="240" y2="460" stroke="#A78BFA" strokeWidth="1.5" strokeDasharray="3 3" />
      </svg>

      {/* Floating Interactive Chat Bubble 1 */}
      <div className="absolute top-8 left-2 md:left-12 z-40 p-3 rounded-2xl bg-[#090c16]/90 backdrop-blur-xl border border-white/20 shadow-xl animate-mascot-float">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎮</span>
          <div>
            <div className="text-xs font-bold text-white">کی پرمیر کانتر پایه‌س؟</div>
            <div className="text-[10px] text-cyan-300">لابی صوتی ۳ از ۵ نفر • ZYRO آنلاینه</div>
          </div>
        </div>
      </div>

      {/* Floating Interactive Chat Bubble 2 */}
      <div className="absolute bottom-12 right-2 md:right-12 z-40 p-3 rounded-2xl bg-[#090c16]/90 backdrop-blur-xl border border-white/20 shadow-xl animate-mascot-float-reverse">
        <div className="flex items-center gap-2">
          <span className="text-xl">✨</span>
          <div>
            <div className="text-xs font-bold text-white">مومنت هوش مصنوعی شروع شد!</div>
            <div className="text-[10px] text-pink-300">MIMO و VEX در حال استریم</div>
          </div>
        </div>
      </div>

      {/* Center Social Metropolis Planet */}
      <div className="absolute z-10 w-44 h-44 rounded-full bg-gradient-to-tr from-purple-700 via-indigo-600 to-cyan-500 shadow-[0_0_90px_rgba(139,92,246,0.65)] flex items-center justify-center border-2 border-white/30 animate-energy-bob">
        <div className="absolute inset-2 rounded-full border border-white/20 animate-spin" style={{ animationDuration: '40s' }}>
          <div className="w-3.5 h-3.5 rounded-full bg-cyan-300 absolute -top-1.5 left-1/2 -translate-x-1/2 shadow-[0_0_12px_#38bdf8]" />
        </div>
        <span className="text-5xl filter drop-shadow">🌌</span>
      </div>

      {/* Character 1: MIMO (Upper Left - Cutout with Transparent BG & Floating Motion) */}
      <div className="absolute top-4 left-6 md:left-16 z-30 transition-transform duration-300 hover:scale-110 cursor-pointer animate-mascot-float">
        <CutoutMimo size={220} angle="default" />
      </div>

      {/* Character 2: ZYRO (Upper Right - Cool 3/4 Perspective Gamer) */}
      <div className="absolute top-2 right-6 md:right-20 z-30 transition-transform duration-300 hover:scale-110 cursor-pointer animate-mascot-float-reverse">
        <CutoutZyro size={210} angle="default" />
      </div>

      {/* Character 3: VEX (Lower Left - Fashion Pose in Action) */}
      <div className="absolute bottom-4 left-8 md:left-28 z-30 transition-transform duration-300 hover:scale-110 cursor-pointer animate-mascot-float-reverse">
        <CutoutVex size={230} angle="reverse" />
      </div>

      {/* Character 4: ORBI (Lower Right - Floating Companion Robot Orbiting) */}
      <div className="absolute bottom-6 right-8 md:right-28 z-30 transition-transform duration-300 hover:scale-110 cursor-pointer animate-mascot-float">
        <CutoutOrbi size={190} angle="default" />
      </div>
    </div>
  );
};
