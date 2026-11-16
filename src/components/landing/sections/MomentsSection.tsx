import React from 'react';
import { CutoutZyro, CutoutMimo } from '../characters';
import { MessageSquare, Volume2, Sparkles, Flame, Check } from 'lucide-react';

export const MomentsSection: React.FC = () => {
  return (
    <section className="relative py-24 px-6 overflow-hidden border-t border-white/10 select-none">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        {/* Left/Start: Story Text */}
        <div className="flex-1 text-right">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-pink-500/15 border border-pink-500/30 text-pink-300 text-xs font-black mb-4">
            <Flame className="w-3.5 h-3.5 text-pink-400" />
            <span>رویدادهای زنده و زودگذر</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-5">
            هر لحظه، یه{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">
              ماجرای تازه!
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
            از گپ‌های شبونه و گوش دادن جمعی به موزیک گرفته تا لابی‌های مسابقات داغ؛ در مومنت‌ها همیشه رویدادی زنده در حال اجراست که فقط با یک کلیک می‌تونی بخشی از اون باشی.
          </p>

          <div className="space-y-3">
            {[
              'تشکیل آنی استیج‌های گفتگو بدون نیاز به عضویت طولانی',
              'اتاق‌های صوتی و تصویری HD با مینی‌گیم‌های چندنفره',
              'انقضای خودکار پس از پایان فعالیت برای جلوگیری از کانال‌های متروکه',
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center text-xs shrink-0 font-black">
                  ✓
                </div>
                <span className="text-xs sm:text-sm text-slate-300 font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right/End: Custom Scene Illustration (Zyro & Mimo in Action) */}
        <div className="flex-1 relative w-full h-[380px] sm:h-[440px] rounded-3xl bg-gradient-to-br from-[#121426] via-[#1a1532] to-[#0c0d18] border border-white/15 p-6 shadow-2xl flex items-center justify-center overflow-hidden">
          {/* Animated Background Aura */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-600/20 rounded-full blur-[90px]" />

          {/* Interactive Floating Moment Preview Card */}
          <div className="relative z-20 w-72 rounded-2xl bg-[#090b14]/90 border border-white/20 p-4 shadow-2xl backdrop-blur-2xl animate-float-slow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-emerald-400" />
                استیج صوتی کانتر ۲
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                LIVE
              </span>
            </div>

            <p className="text-[11px] text-slate-300 mb-3">
              مسابقه فینال پرمیر رنک +۱۸k همراه با استریم زنده و چت صوتی
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[10px] text-slate-400">
              <span className="text-emerald-400 font-bold">● ۶ خلبان در استیج</span>
              <span className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-bold">ورود</span>
            </div>
          </div>

          {/* Zyro interacting from left */}
          <div className="absolute -left-4 bottom-2 z-30 transform hover:scale-110 transition animate-mascot-float">
            <CutoutZyro size={210} angle="reverse" />
          </div>

          {/* Mimo floating on top right */}
          <div className="absolute -right-4 top-2 z-30 transform hover:scale-110 transition animate-mascot-float-reverse">
            <CutoutMimo size={200} angle="default" />
          </div>
        </div>
      </div>
    </section>
  );
};
