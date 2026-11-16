import React from 'react';
import Link from 'next/link';
import { DiscordStyleMascot, DiscordStyleRobot } from './DiscordStyleCharacters';
import { ArrowRight, Download, Laptop, Smartphone, Volume2, Mic, Headphones } from 'lucide-react';

export const HeroUniverse: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative w-full max-w-6xl mx-auto flex flex-col items-center select-none pt-4 pb-12 ${className}`}>
      {/* Background Discord Blue/Purple Radial Ambient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[450px] bg-gradient-to-r from-[#5865F2]/30 via-[#7983F5]/20 to-[#57F287]/20 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Hero Visual Composition: UI Mockup flanked by Discord style vector characters */}
      <div className="relative w-full flex items-center justify-center min-h-[460px] md:min-h-[520px]">
        {/* Left Floating Discord-Style Plush Mascot */}
        <div className="absolute -left-2 md:left-8 bottom-4 z-30 transform hover:scale-110 transition duration-300 animate-mascot-float cursor-pointer">
          <DiscordStyleMascot size={230} />
          {/* Chat Bubble from Mascot */}
          <div className="absolute -top-10 -right-6 bg-white text-[#23272A] px-3.5 py-1.5 rounded-2xl rounded-bl-sm font-black text-xs shadow-xl flex items-center gap-1.5 whitespace-nowrap">
            <span>سلااام! بیا دیسکافه 🎮</span>
          </div>
        </div>

        {/* Right Floating Friendly Robot */}
        <div className="absolute -right-2 md:right-8 top-6 z-30 transform hover:scale-110 transition duration-300 animate-mascot-float-reverse cursor-pointer">
          <DiscordStyleRobot size={180} />
          <div className="absolute -bottom-8 -left-4 bg-[#57F287] text-[#23272A] px-3 py-1 rounded-2xl rounded-tr-sm font-black text-[11px] shadow-xl whitespace-nowrap">
            <span>سیستم آنلاین و پرسرعت ⚡</span>
          </div>
        </div>

        {/* Central High-Fidelity Discord Channel Stage Card */}
        <div className="relative z-20 w-full max-w-2xl rounded-3xl bg-[#2B2D31]/95 border border-[#3F4147] shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden">
          {/* Top Window Chrome */}
          <div className="h-10 px-4 bg-[#1E1F22] border-b border-[#313338] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#ED4245]" />
              <span className="w-3 h-3 rounded-full bg-[#FEE75C]" />
              <span className="w-3 h-3 rounded-full bg-[#57F287]" />
              <span className="text-xs font-bold text-[#949BA4] mr-2"># لابی-اصلی-گیمرها</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#5865F2]/20 text-[#5865F2] font-black border border-[#5865F2]/30">
              DISCORD IRAN LIVE
            </span>
          </div>

          {/* Body: Voice Stage & Live Users */}
          <div className="p-6 bg-[#313338] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-black text-sm">
                <Volume2 className="w-4 h-4 text-[#57F287] animate-pulse" />
                <span>ویس‌روم عمومی شماره ۱ (پینگ ۲۰ms تهران)</span>
              </div>
              <span className="text-xs text-[#57F287] font-bold">● ۶ کاربر متصل</span>
            </div>

            {/* Avatars Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { name: 'صادق (ادمین)', color: '#5865F2', speaking: true, role: 'Owner' },
                { name: 'آرین_CS', color: '#57F287', speaking: true, role: 'پرمیر رنک ۱۸k' },
                { name: 'کیان_FC', color: '#FEE75C', speaking: false, role: 'پروکلابز' },
                { name: 'مریم', color: '#EB459E', speaking: false, role: 'طراح UI' },
                { name: 'سامان_GTA', color: '#ED4245', speaking: false, role: 'رول‌پلی' },
                { name: 'شما (مهمان)', color: '#949BA4', speaking: false, role: 'خلبان تازه' },
              ].map((user, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-2xl bg-[#2B2D31] flex items-center justify-between border transition-all ${
                    user.speaking ? 'border-[#57F287] shadow-[0_0_15px_rgba(87,242,135,0.3)]' : 'border-[#3F4147]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <div
                      style={{ backgroundColor: user.color }}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0 shadow"
                    >
                      {user.name.charAt(0)}
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold text-white truncate">{user.name}</div>
                      <div className="text-[10px] text-[#949BA4]">{user.role}</div>
                    </div>
                  </div>
                  {user.speaking ? (
                    <Mic className="w-3.5 h-3.5 text-[#57F287]" />
                  ) : (
                    <Headphones className="w-3.5 h-3.5 text-[#949BA4]" />
                  )}
                </div>
              ))}
            </div>

            {/* Bottom Input Area Mockup */}
            <div className="pt-2 flex items-center gap-2">
              <div className="flex-1 px-4 py-2.5 rounded-xl bg-[#383A40] text-xs text-[#949BA4] border border-[#3F4147]">
                ارسال پیام در #لابی-اصلی-گیمرها...
              </div>
              <Link
                href="/panel"
                className="px-5 py-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-black shadow-lg transition flex items-center gap-2 shrink-0"
              >
                <span>پیوستن به ویس</span>
                <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
