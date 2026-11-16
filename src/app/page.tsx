'use client';

import React from 'react';
import { LandingNav } from '@/components/landing/LandingNav';
import { HeroSection } from '@/components/landing/sections/HeroSection';
import { MomentsSection } from '@/components/landing/sections/MomentsSection';
import { SignalSection } from '@/components/landing/sections/SignalSection';
import { CommunitiesSection } from '@/components/landing/sections/CommunitiesSection';
import { FAQSection } from '@/components/landing/sections/FAQSection';
import { FinalCTA } from '@/components/landing/sections/FinalCTA';
import Link from 'next/link';

export default function NexusUniverseLandingPage() {
  return (
    <div className="min-h-screen bg-[#06070d] text-slate-100 font-sans selection:bg-purple-600 selection:text-white" dir="rtl">
      {/* Floating Navigation */}
      <LandingNav />

      {/* Main Sections */}
      <main className="relative">
        <HeroSection />

        <div id="moments">
          <MomentsSection />
        </div>

        <div id="signal">
          <SignalSection />
        </div>

        <div id="communities">
          <CommunitiesSection />
        </div>

        <div id="faq">
          <FAQSection />
        </div>

        <FinalCTA />
      </main>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10 bg-[#030408] text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-right">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
              <span className="font-bold text-slate-300 text-sm">NEXUS Universe</span>
            </div>
            <span>— پلتفرم ارتباطی و دورهمی گیمرهای ایرانی © ۲۰۲۶</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5">
            <Link href="/panel" className="text-slate-400 hover:text-white transition">ورود به پنل</Link>
            <Link href="#moments" className="text-slate-400 hover:text-white transition">مومنت‌ها</Link>
            <Link href="#signal" className="text-slate-400 hover:text-white transition">رادار سیگنال</Link>
            <Link href="#communities" className="text-slate-400 hover:text-white transition">سیارات</Link>
            <Link href="#faq" className="text-slate-400 hover:text-white transition">سوالات متداول</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
