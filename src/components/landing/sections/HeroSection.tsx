import React from 'react';
import Link from 'next/link';
import { HeroUniverse } from '../illustrations/HeroUniverse';
import { Sparkles, ArrowRight, Play, Users, Compass, Flame } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-[92vh] flex flex-col items-center justify-center pt-28 pb-16 px-6 overflow-hidden select-none">
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-purple-600/25 via-indigo-600/20 to-cyan-500/25 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-6xl mx-auto w-full flex flex-col items-center text-center z-10">
        {/* Release Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.1] border border-white/15 backdrop-blur-xl mb-6 shadow-lg transition cursor-pointer">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-xs font-black text-cyan-300">نسل جدید شبکه اجتماعی گیمرها و خالقان ایرانی</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-200 border border-purple-500/40 font-mono">
            NEXUS 3.0
          </span>
        </div>

        {/* Oversized Persian Headline in Discord Style */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[1.25] max-w-4xl mb-6 drop-shadow-xl">
          جایی برای گپ زدن، بازی و{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5865F2] via-[#7983F5] to-[#57F287]">
            دورهمی با دوستان!
          </span>
        </h1>

        {/* Supporting Copy */}
        <p className="text-base sm:text-lg md:text-xl text-[#DBDEE1] max-w-2xl leading-relaxed mb-8 font-normal">
          چه عضو یه کلن گیمینگ باشی، چه یه گروه دورهمی دوستانه، یا یه تیم برنامه‌نویسی؛ نکسوس بهترین جا برای چت، ویس‌کال بدون لگ و وقت‌گذرونیه.
        </p>

        {/* Primary & Secondary Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-10 w-full sm:w-auto">
          <Link
            href="/panel"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-black text-base shadow-[0_0_35px_rgba(88,101,242,0.6)] transition hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
          >
            <span>ورود مستقیم در مرورگر</span>
            <ArrowRight className="w-5 h-5 rotate-180" />
          </Link>

          <Link
            href="/panel"
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-[#23272A] hover:bg-[#2B2D31] border border-[#3F4147] text-white font-bold text-sm transition hover:scale-105 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#FEE75C]" />
            <span>مشاهده سرورهای آنلاین</span>
          </Link>
        </div>

        {/* Hero Illustration Universe Composition */}
        <div className="w-full mt-4">
          <HeroUniverse />
        </div>
      </div>
    </section>
  );
};
