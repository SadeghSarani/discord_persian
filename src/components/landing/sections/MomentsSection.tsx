import React from 'react';
import { Volume2, Sparkles, Flame, Check, Radio, Users, Play, ShieldAlert } from 'lucide-react';

export const MomentsSection: React.FC = () => {
  return (
    <section className="relative py-24 px-6 overflow-hidden border-t border-white/10 select-none">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        {/* Left/Start: Story Text */}
        <div className="flex-1 text-right">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-pink-500/15 border border-pink-500/30 text-pink-300 text-xs font-black mb-4">
            <Flame className="w-3.5 h-3.5 text-pink-400" />
            <span>مومنت‌ها (MOMENTS)</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-5">
            تجربه‌های زنده،{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-400 to-amber-300">
              بدون معطلی و موقت!
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6 font-normal">
            دیگه نیازی نیست ساعت‌ها دنبال یه سرور شلوغ بگردی یا منتظر بمونی تا کسی پیدا بشه. مومنت‌ها فضاهای زنده‌ای هستند که بر اساس علایق مشترک ساخته می‌شن و بعد از اتمام فعالیت، بدون به جا گذاشتن شلوغی و کانال‌های متروکه منقضی می‌شن.
          </p>

          <div className="space-y-3">
            {[
              'تشکیل آنی استیج و لابی با یک کلیک',
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

        {/* Right/End: Custom Holographic Moments Dashboard */}
        <div className="flex-1 relative w-full h-[400px] sm:h-[460px] rounded-3xl bg-gradient-to-br from-[#121426] via-[#1a1532] to-[#0c0d18] border border-white/15 p-6 shadow-2xl flex flex-col justify-center gap-4 overflow-hidden">
          {/* Animated Background Aura */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-600/20 rounded-full blur-[100px] pointer-events-none" />

          {/* Moment Card 1: Active Voice Stage */}
          <div className="relative z-20 rounded-2xl bg-[#090b14]/90 border border-emerald-500/30 p-4 shadow-2xl backdrop-blur-2xl transition hover:border-emerald-400">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span>استیج صوتی کانتر ۲ — فینال پرمیر</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 font-mono">
                LIVE STAGE
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
              مسابقه رنک بالای ۱۸k همراه با اشتراک تصویر و گفت‌وگوی زنده تاکتیکی
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[10px]">
              <span className="text-emerald-400 font-bold">● ۶ خلبان آنلاین در استیج</span>
              <span className="px-3 py-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black shadow">
                ورود به استیج
              </span>
            </div>
          </div>

          {/* Moment Card 2: Tech Co-Working */}
          <div className="relative z-20 rounded-2xl bg-[#090b14]/90 border border-purple-500/30 p-4 shadow-2xl backdrop-blur-2xl transition hover:border-purple-400">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                <span>کافه‌کدینگ: هوش مصنوعی و نکست‌جی‌اس</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30 font-mono">
                FOCUS ROOM
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
              دورهمی دولوپرها برای رفع باگ و اشتراک پروژه‌های متن‌باز
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[10px]">
              <span className="text-purple-300 font-bold">● ۱۴ برنامه‌نویس در روم</span>
              <span className="px-3 py-1 rounded-xl bg-purple-600/30 text-purple-200 border border-purple-500/40 font-bold">
                مشاهده روم
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
