import React from 'react';
import Link from 'next/link';
import { NexusIcon } from '@/components/glyphs';

export const LandingNav: React.FC = () => {
  return (
    <header className="fixed top-4 left-6 right-6 h-16 rounded-2xl bg-[#090c16]/85 backdrop-blur-2xl border border-white/10 flex items-center justify-between px-6 z-50 shadow-2xl select-none" dir="rtl">
      {/* Brand Logo */}
      <Link href="/" className="flex items-center gap-3 group">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white text-lg font-black shadow-[0_0_20px_rgba(168,85,247,0.5)] group-hover:scale-105 transition">
          🌌
        </div>
        <div>
          <div className="text-base font-black text-white flex items-center gap-2">
            <span>NEXUS</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
              Universe
            </span>
          </div>
          <p className="text-[10px] text-slate-400 hidden sm:block">شبکه اجتماعی نسل نو</p>
        </div>
      </Link>

      {/* Center Nav Links */}
      <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-300">
        <Link href="#moments" className="hover:text-cyan-300 transition">مومنت‌ها</Link>
        <Link href="#signal" className="hover:text-cyan-300 transition">نکسوس سیگنال</Link>
        <Link href="#communities" className="hover:text-cyan-300 transition">سیارات و بازی‌ها</Link>
        <Link href="#playground" className="hover:text-cyan-300 transition">زمین بازی</Link>
        <Link href="/glyphs" className="text-[#8B7CFF] hover:underline flex items-center gap-1">
          <span>آیکون‌ها (Glyphs)</span>
        </Link>
      </nav>

      {/* Left/End Action CTA */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#8B7CFF] to-[#43C9D8] text-white text-xs font-black shadow-md hover:opacity-95 transition"
        >
          ورود به اپلیکیشن
        </Link>
      </div>
    </header>
  );
};
