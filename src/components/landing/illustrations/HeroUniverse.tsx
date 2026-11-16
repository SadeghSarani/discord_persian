import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Volume2, Mic, Headphones, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export const HeroUniverse: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative w-full max-w-6xl mx-auto flex flex-col items-center select-none pt-2 pb-8 ${className}`}>
      {/* Background Radial Ambient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-gradient-to-r from-purple-600/30 via-indigo-600/25 to-cyan-500/25 rounded-full blur-[150px] pointer-events-none" />

      {/* Main Squad Illustration Artwork with Glowing Glass Backdrop */}
      <div className="relative w-full rounded-3xl bg-gradient-to-b from-[#111625]/90 via-[#0a0d17]/95 to-[#070910] border border-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.85)] overflow-hidden p-4 sm:p-8 backdrop-blur-2xl">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        {/* Top Header inside stage */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#ED4245]/80" />
              <span className="w-3 h-3 rounded-full bg-[#FEE75C]/80" />
              <span className="w-3 h-3 rounded-full bg-[#57F287]/80" />
            </div>
            <span className="text-xs font-bold text-slate-300"># لابی-اصلی-نکسوس • شبکه ارتباطی مستقل</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>پینگ داخلی ۱۵ms</span>
            </span>
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
              NEXUS SQUAD
            </span>
          </div>
        </div>

        {/* Hero Character Showcase Composition */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Visual Artwork Banner */}
          <div className="lg:col-span-7 relative group">
            <div className="relative rounded-2xl overflow-hidden border border-purple-500/30 shadow-[0_15px_40px_rgba(124,58,237,0.25)] bg-[#0b0e1b]">
              <Image
                src="/nexus-squad-hero.webp"
                alt="کاراکترها و اسکواد گیمرهای نکسوس"
                width={1024}
                height={576}
                priority
                className="w-full h-auto object-cover group-hover:scale-102 transition duration-500"
              />
              {/* Subtle Bottom vignette overlay */}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0b0e1b] via-[#0b0e1b]/40 to-transparent pointer-events-none" />
              
              {/* Badges floating on image */}
              <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between">
                <span className="text-[11px] font-black text-white bg-black/60 backdrop-blur-md px-3 py-1 rounded-xl border border-white/15">
                  🎮 اسکواد رسمی نکسوس
                </span>
                <span className="text-[10px] font-bold text-cyan-300 bg-cyan-950/70 backdrop-blur-md px-2.5 py-1 rounded-xl border border-cyan-500/30">
                  دورهمی زنده و پایدار
                </span>
              </div>
            </div>
          </div>

          {/* Real Live Voice Room Preview (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-white font-black text-xs">
                  <Volume2 className="w-4 h-4 text-[#57F287] animate-pulse" />
                  <span>ویس‌روم شماره ۱ (استیج گیمینگ)</span>
                </div>
                <span className="text-[11px] text-[#57F287] font-bold">● متصل</span>
              </div>

              {/* Users in Voice */}
              <div className="space-y-2 mb-3">
                {[
                  { name: 'صادق (ادمین)', color: '#5865F2', role: 'سازنده سرور', speaking: true },
                  { name: 'آرین (Premier 19k)', color: '#10b981', role: 'کانتر ۲', speaking: true },
                  { name: 'ربات هوشمند NexusBot', color: '#8b5cf6', role: 'دستیار خودکار', speaking: false },
                  { name: 'کاربر مهمان (شما)', color: '#ec4899', role: 'آماده ورود', speaking: false },
                ].map((user, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl bg-white/[0.04] border flex items-center justify-between transition ${
                      user.speaking ? 'border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.2)]' : 'border-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        style={{ backgroundColor: user.color }}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white shrink-0 shadow"
                      >
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{user.name}</div>
                        <div className="text-[10px] text-slate-400">{user.role}</div>
                      </div>
                    </div>
                    {user.speaking ? (
                      <Mic className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Headphones className="w-3.5 h-3.5 text-slate-500" />
                    )}
                  </div>
                ))}
              </div>

              {/* Quick direct CTA */}
              <Link
                href="/panel"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg transition flex items-center justify-center gap-2 group"
              >
                <span>ورود و ملحق شدن به ویس‌روم</span>
                <ArrowRight className="w-3.5 h-3.5 rotate-180 group-hover:-translate-x-1 transition" />
              </Link>
            </div>

            {/* Feature Highlights beneath */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>رمزنگاری سرتاسری</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                <span>بدون نیاز به نصب</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
