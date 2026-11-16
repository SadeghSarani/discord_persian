import React from 'react';
import { NexusIcon } from '@/components/glyphs';

export const PlaygroundSection: React.FC = () => {
  return (
    <section className="relative py-24 px-6 overflow-hidden border-t border-white/10 select-none bg-[#080912]">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row-reverse items-center gap-12">
        {/* Story Text */}
        <div className="flex-1 text-right">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-black mb-4">
            <NexusIcon name="playground" size={16} />
            <span>زمین بازی و سرگرمی جمعی (PLAYGROUND)</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-5">
            رفاقت فقط{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400">
              چت کردن نیست!
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6 font-normal">
            با هم وسط مکالمه صوتی دوز بازی کنید، مسابقات سریع راه بیندازید و لحظه‌های خنده‌داری بسازید که بعداً توی سیگنال‌ها درباره‌اش حرف بزنید. سرگرمی در نکسوس در دل ارتباطات تنیده شده است.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-300">
            <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/[0.05] border border-white/10">
              <NexusIcon name="xp" size={16} className="text-amber-400" />
              <span>کسب XP و لول‌آپ</span>
            </div>
            <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/[0.05] border border-white/10">
              <NexusIcon name="achievements" size={16} className="text-cyan-400" />
              <span>افکت‌های جشن و هایپ زنده</span>
            </div>
          </div>
        </div>

        {/* Scene Illustration: Futuristic Interactive Social Mini-Games */}
        <div className="flex-1 relative w-full h-[380px] sm:h-[440px] rounded-3xl bg-gradient-to-br from-[#191522] via-[#241a34] to-[#0d0c18] border border-amber-500/30 p-6 shadow-2xl flex flex-col items-center justify-center gap-4 overflow-hidden">
          {/* Tic Tac Toe Board Mockup with SVG vector icons */}
          <div className="relative z-20 grid grid-cols-3 gap-2.5 p-4 rounded-2xl bg-black/70 border border-white/20 backdrop-blur-xl shadow-2xl">
            {[1, 2, 1, 2, 1, 2, 2, 1, 1].map((cellType, idx) => (
              <div
                key={idx}
                className="w-14 h-14 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center shadow-inner"
              >
                {cellType === 1 ? (
                  <NexusIcon name="core" size={24} className="text-cyan-400" />
                ) : (
                  <NexusIcon name="signal" size={24} className="text-pink-400" />
                )}
              </div>
            ))}
          </div>

          <div className="text-xs font-black text-amber-300 flex items-center gap-2 bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20">
            <NexusIcon name="level" size={16} className="text-amber-400" />
            <span>مسابقه بی‌درنگ در دل تماس صوتی</span>
          </div>
        </div>
      </div>
    </section>
  );
};
