import React from 'react';
import Link from 'next/link';
import { NexusIcon } from '@/components/glyphs';
import { ArrowRight, Sparkles } from 'lucide-react';

export const FinalCTA: React.FC = () => {
  return (
    <section className="relative py-28 px-6 overflow-hidden border-t border-white/10 select-none bg-gradient-to-b from-[#090b14] via-[#15102a] to-[#04050a]">
      {/* Massive Gradient Backlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-gradient-to-tr from-purple-600/30 via-pink-600/20 to-cyan-500/30 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto flex flex-col items-center text-center relative z-20">
        {/* Core Vector Emblem */}
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-[0_0_40px_rgba(168,85,247,0.6)] mb-6 animate-pulse">
          <NexusIcon name="core" size={32} strokeWidth={2} />
        </div>

        <h2 className="text-4xl sm:text-6xl font-black text-white leading-tight mb-5">
          ماجراجویی بعدی از{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-300">
            اینجا شروع می‌شه!
          </span>
        </h2>

        <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed mb-8 font-normal">
          یه دنیای تازه از آدما، لحظه‌ها، سیارات بازی و اتفاقای جذاب منتظرته. رایگان ثبت‌نام کن و خلبان کهکشان خودت باش.
        </p>

        <Link
          href="/panel"
          className="px-10 py-5 rounded-2xl bg-gradient-to-r from-[#8B7CFF] via-[#7C3AED] to-[#43C9D8] hover:opacity-95 text-white font-black text-lg shadow-[0_0_40px_rgba(139,124,255,0.6)] transition hover:scale-105 active:scale-95 flex items-center gap-3"
        >
          <span>ورود به پنل و کهکشان نکسوس</span>
          <ArrowRight className="w-5 h-5 rotate-180" />
        </Link>

        {/* Small Trust Footnote */}
        <div className="mt-8 text-xs text-slate-500 font-medium flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>بدون فیلتر • سرورهای پرسرعت داخلی در تهران • حریم خصوصی تضمین‌شده</span>
        </div>
      </div>
    </section>
  );
};
