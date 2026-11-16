import React from 'react';
import {
  OfficialMimo,
  OfficialZyro,
  OfficialVex,
  OfficialOrbi,
  OfficialSquadScene,
} from '../characters';

export const HeroUniverse: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative w-full max-w-5xl mx-auto flex flex-col items-center select-none ${className}`}>
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-r from-purple-600/30 via-pink-600/20 to-cyan-500/30 rounded-full blur-[140px] pointer-events-none" />

      {/* Floating Interactive Chat Bubble 1 */}
      <div className="absolute -top-6 left-4 md:left-8 z-30 p-3 rounded-2xl bg-[#090c16]/90 backdrop-blur-xl border border-white/20 shadow-xl animate-mascot-float">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎮</span>
          <div>
            <div className="text-xs font-bold text-white">کی پرمیر کانتر پایه‌س؟</div>
            <div className="text-[10px] text-cyan-300">لابی صوتی ۳ از ۵ نفر • ZYRO آنلاینه</div>
          </div>
        </div>
      </div>

      {/* Floating Interactive Chat Bubble 2 */}
      <div className="absolute -bottom-6 right-4 md:right-8 z-30 p-3 rounded-2xl bg-[#090c16]/90 backdrop-blur-xl border border-white/20 shadow-xl animate-mascot-float-reverse">
        <div className="flex items-center gap-2">
          <span className="text-xl">✨</span>
          <div>
            <div className="text-xs font-bold text-white">مومنت هوش مصنوعی شروع شد!</div>
            <div className="text-[10px] text-pink-300">MIMO و VEX در حال استریم</div>
          </div>
        </div>
      </div>

      {/* Official Master Squad 3D Illustration */}
      <div className="relative z-20 w-full rounded-3xl overflow-hidden border border-white/20 shadow-[0_20px_70px_rgba(139,92,246,0.35)] group">
        <OfficialSquadScene />

        {/* Dynamic Holographic Hover Glass Tag */}
        <div className="absolute bottom-4 left-6 right-6 p-4 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/15 flex flex-wrap items-center justify-between gap-3 opacity-95">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-black text-white">تیم رسمی کاراکترهای سه‌بعدی نکسوس (NEXUS CREW)</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-bold text-slate-300">
            <span className="text-purple-300">🟣 MIMO (ماسکوت هودی‌پوش)</span>
            <span className="text-cyan-300">🎧 ZYRO (گیمر هدست‌دار)</span>
            <span className="text-pink-300">🔥 VEX (خالق استریت‌ویر)</span>
            <span className="text-teal-300">🤖 ORBI (ربات همراه)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
