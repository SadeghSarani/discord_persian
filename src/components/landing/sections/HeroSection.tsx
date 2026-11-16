import React from 'react';
import Link from 'next/link';
import { HeroUniverse } from '../illustrations/HeroUniverse';
import { Sparkles, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-[92vh] flex flex-col items-center justify-center pt-28 pb-16 px-4 sm:px-6 overflow-hidden select-none">
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-purple-600/25 via-indigo-600/20 to-cyan-500/25 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-6xl mx-auto w-full flex flex-col items-center text-center z-10">
        {/* Release Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/15 backdrop-blur-xl mb-6 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-black text-white">پلتفرم ارتباطی و دورهمی گیمرها و کامیونیتی‌های ایرانی</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-300 border border-purple-500/40 font-mono">
            NEXUS IRAN
          </span>
        </div>

        {/* Oversized Persian Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.3] max-w-4xl mb-6 drop-shadow-xl">
          جایی برای مکالمه صوتی، بازی و{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-300">
            دورهمی با دوستان!
          </span>
        </h1>

        {/* Supporting Copy */}
        <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl leading-relaxed mb-8 font-normal">
          چه عضو یک اسکواد گیمینگ باشید، چه تیم برنامه‌نویسی یا دورهمی‌های دوستانه؛ نکسوس با پینگ داخلی پایین، رادار سیگنال و سیارات موضوعی بهترین تجربه مکالمه و حضور زنده را برای شما فراهم می‌کند.
        </p>

        {/* Primary & Secondary Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-10 w-full sm:w-auto">
          <Link
            href="/panel"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-base shadow-[0_0_35px_rgba(124,58,237,0.5)] transition hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
          >
            <span>ورود مستقیم در مرورگر</span>
            <ArrowRight className="w-5 h-5 rotate-180" />
          </Link>

          <Link
            href="#communities"
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white font-bold text-sm transition hover:scale-105 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>مشاهده کهکشان سیارات</span>
          </Link>
        </div>

        {/* Hero Illustration Universe Composition */}
        <div className="w-full mt-2">
          <HeroUniverse />
        </div>
      </div>
    </section>
  );
};
