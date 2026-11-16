'use client';

import React from 'react';
import { LandingNav } from '@/components/landing/LandingNav';
import { HeroSection } from '@/components/landing/sections/HeroSection';
import { MomentsSection } from '@/components/landing/sections/MomentsSection';
import { SignalSection } from '@/components/landing/sections/SignalSection';
import { CommunitiesSection } from '@/components/landing/sections/CommunitiesSection';
import { PlaygroundSection } from '@/components/landing/sections/PlaygroundSection';
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

        <div id="playground">
          <PlaygroundSection />
        </div>

        <FinalCTA />
      </main>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10 bg-[#030408] text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-base">🌌</span>
            <span className="font-bold text-slate-300">NEXUS UNIVERSE © ۲۰۲۶</span>
            <span>— تمام حقوق برای شبکه اجتماعی نکسوس محفوظ است.</span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-cyan-400 transition">ورود به کهکشان</Link>
            <Link href="/glyphs" className="hover:text-purple-400 transition">سامانه آیکون‌ها (GLYPHS)</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
