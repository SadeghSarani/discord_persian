import React from 'react';
import { Radio, Zap, ArrowRight, CheckCircle2, Compass, Users, Sparkles } from 'lucide-react';

export const SignalSection: React.FC = () => {
  return (
    <section className="relative py-24 px-6 overflow-hidden border-t border-white/10 select-none bg-[#070810]">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row-reverse items-center gap-12">
        {/* Story Text */}
        <div className="flex-1 text-right">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-black mb-4">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span>نکسوس سیگنال (NEXUS SIGNAL)</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-5">
            دنبال آدما نگرد؛{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300">
              آدماتو پیدا کن!
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6 font-normal">
            به جای چرخیدن در سرورها و پیام فرستادن به افراد غریبه، فقط کافیه بگی «الان چی می‌خوای؟». نکسوس سیگنال افراد دارای نیت یکسان را در کمتر از چند ثانیه به هم متصل می‌کنه.
          </p>

          <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 mb-6 text-xs text-cyan-200 leading-relaxed">
            <span>
              <strong>فرمول جادویی نکسوس:</strong> بیان نیت ➔ کشف افراد هم‌مسیر ➔ تجربه مشترک بی‌درنگ
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>سیستم تطبیق قطعی بدون نیاز به پروفایل‌سازی مخفی یا افشای حریم خصوصی</span>
          </div>
        </div>

        {/* Scene Illustration: Radar & Match Formations */}
        <div className="flex-1 relative w-full h-[380px] sm:h-[440px] rounded-3xl bg-gradient-to-br from-[#0c1222] via-[#0e1830] to-[#080d19] border border-cyan-500/30 p-6 shadow-2xl flex items-center justify-center overflow-hidden">
          {/* Central Radar Pulse Circles */}
          <div className="absolute w-64 h-64 rounded-full border border-cyan-500/30 animate-ping opacity-25" style={{ animationDuration: '4s' }} />
          <div className="absolute w-96 h-96 rounded-full border border-cyan-500/20" />

          {/* Central Intention Card */}
          <div className="relative z-20 p-5 rounded-2xl bg-[#070b16]/95 border border-cyan-500/40 text-center shadow-2xl backdrop-blur-xl max-w-sm w-full">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
              <span className="text-[10px] text-cyan-400 font-mono font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                SIGNAL RADAR LIVE
              </span>
              <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full font-bold">
                تطبیق ۹۸٪
              </span>
            </div>

            <div className="text-sm font-black text-white mb-2 leading-relaxed">
              «می‌خوام نیم ساعت راجع به گیم‌پلی و ترفندهای جدید CS2 حرف بزنم»
            </div>

            <div className="w-full bg-cyan-950 h-2.5 rounded-full overflow-hidden my-3">
              <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full w-[85%] rounded-full animate-pulse" />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span>●</span> ۲ خلبان هم‌مسیر پیدا شدند
              </span>
              <button className="px-3 py-1 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black shadow">
                پیوستن به ویس‌روم
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
