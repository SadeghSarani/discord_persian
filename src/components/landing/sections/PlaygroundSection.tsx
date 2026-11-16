import React from 'react';
import { OfficialZyro, OfficialOrbi } from '../characters';
import { Gamepad2, Trophy, Sparkles, Flame } from 'lucide-react';

export const PlaygroundSection: React.FC = () => {
  return (
    <section className="relative py-24 px-6 overflow-hidden border-t border-white/10 select-none bg-[#080912]">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row-reverse items-center gap-12">
        {/* Story Text */}
        <div className="flex-1 text-right">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-black mb-4">
            <Gamepad2 className="w-3.5 h-3.5 text-amber-400" />
            <span>زمین بازی و سرگرمی جمعی</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-5">
            رفاقت فقط{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400">
              چت کردن نیست!
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
            با هم وسط مکالمه صوتی دوز بازی کنید، مسابقات سریع راه بیندازید و لحظه‌های خنده‌داری بسازید که بعداً توی سیگنال‌ها درباره‌اش حرف بزنید. سرگرمی در نکسوس در دل ارتباطات تنیده شده است.
          </p>

          <div className="flex items-center gap-4 text-xs font-bold text-slate-300">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.05] border border-white/10">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>کسب XP و لول‌آپ</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.05] border border-white/10">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>افکت‌های جشن و هایپ زنده</span>
            </div>
          </div>
        </div>

        {/* Scene Illustration: Zyro jumping with Mini-Game Board */}
        <div className="flex-1 relative w-full h-[380px] sm:h-[440px] rounded-3xl bg-gradient-to-br from-[#191522] via-[#241a34] to-[#0d0c18] border border-amber-500/30 p-6 shadow-2xl flex items-center justify-center overflow-hidden">
          {/* Tic Tac Toe Board Mockup floating in space */}
          <div className="relative z-20 grid grid-cols-3 gap-2 p-3 rounded-2xl bg-black/60 border border-white/20 backdrop-blur-xl shadow-2xl rotate-3">
            {['❌', '⭕', '❌', '⭕', '❌', '', '', '⭕', '❌'].map((cell, idx) => (
              <div
                key={idx}
                className="w-12 h-12 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-xl font-bold text-white shadow"
              >
                {cell}
              </div>
            ))}
          </div>

          {/* Zyro Enthusiastic Jumper */}
          <div className="absolute -left-2 top-2 z-30 transition-transform duration-300 hover:scale-110 animate-mascot-float">
            <OfficialZyro size={210} />
          </div>

          {/* Orbi Drone floating with Trophy */}
          <div className="absolute right-4 bottom-4 z-30 transition-transform duration-300 hover:scale-110 animate-mascot-float-reverse">
            <OfficialOrbi size={185} />
          </div>
        </div>
      </div>
    </section>
  );
};
