import React, { useState } from 'react';
import Link from 'next/link';
import { NexusIcon } from '@/components/glyphs';
import { Menu, X, ArrowLeft } from 'lucide-react';

export const LandingNav: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-3 sm:top-4 left-3 sm:left-6 right-3 sm:right-6 h-14 sm:h-16 rounded-2xl bg-[#090c16]/90 backdrop-blur-2xl border border-white/10 flex items-center justify-between px-4 sm:px-6 z-50 shadow-2xl select-none" dir="rtl">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-[0_0_20px_rgba(168,85,247,0.5)] group-hover:scale-105 transition">
            <NexusIcon name="core" size={20} strokeWidth={2} />
          </div>
          <div>
            <div className="text-sm sm:text-base font-black text-white flex items-center gap-1.5 sm:gap-2">
              <span>NEXUS</span>
              <span className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                Universe
              </span>
            </div>
            <p className="text-[9px] sm:text-[10px] text-slate-400 hidden sm:block">شبکه اجتماعی نسل نو</p>
          </div>
        </Link>

        {/* Center Nav Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-300">
          <Link href="#features" className="hover:text-cyan-300 transition">امکانات پلتفرم</Link>
          <Link href="#moments" className="hover:text-cyan-300 transition">اتاق‌های صوتی (Moments)</Link>
          <Link href="#signal" className="hover:text-cyan-300 transition">پیدا کردن هم‌بازی (Signal)</Link>
          <Link href="#communities" className="hover:text-cyan-300 transition">سیارات و لابی‌ها</Link>
        </nav>

        {/* Actions (Panel Button + Mobile Menu Trigger) */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/panel"
            className="px-4 sm:px-6 py-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-black shadow-lg hover:shadow-indigo-500/30 transition flex items-center gap-1.5"
          >
            <span>ورود به برنامه</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white"
            aria-label="باز کردن منو"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-3 top-20 z-40 md:hidden p-5 rounded-2xl bg-[#090c16]/95 backdrop-blur-2xl border border-white/15 shadow-2xl flex flex-col gap-3 text-right" dir="rtl">
          <Link
            href="#moments"
            onClick={() => setMobileMenuOpen(false)}
            className="p-2.5 rounded-xl text-xs font-bold text-slate-200 hover:bg-white/5"
          >
            اتاق‌های صوتی (Moments)
          </Link>
          <Link
            href="#signal"
            onClick={() => setMobileMenuOpen(false)}
            className="p-2.5 rounded-xl text-xs font-bold text-slate-200 hover:bg-white/5"
          >
            پیدا کردن هم‌بازی (Signal)
          </Link>
          <Link
            href="#communities"
            onClick={() => setMobileMenuOpen(false)}
            className="p-2.5 rounded-xl text-xs font-bold text-slate-200 hover:bg-white/5"
          >
            سیارات و لابی‌های بازی
          </Link>
          <Link
            href="#playground"
            onClick={() => setMobileMenuOpen(false)}
            className="p-2.5 rounded-xl text-xs font-bold text-slate-200 hover:bg-white/5"
          >
            مینی‌گیم‌ها و سرگرمی
          </Link>
          <div className="h-px bg-white/10 my-1" />
          <Link
            href="/panel"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-2 py-3 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-center text-xs font-black text-white"
          >
            ورود به برنامه نکسوس
          </Link>
        </div>
      )}
    </>
  );
};
