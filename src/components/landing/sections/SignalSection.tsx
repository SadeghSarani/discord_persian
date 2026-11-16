import React from 'react';
import { OfficialOrbi, OfficialVex } from '../characters';
import { Radio, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';

export const SignalSection: React.FC = () => {
  return (
    <section className="relative py-24 px-6 overflow-hidden border-t border-white/10 select-none bg-[#070810]">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row-reverse items-center gap-12">
        {/* Story Text */}
        <div className="flex-1 text-right">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-black mb-4">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>رادار هوشمند تطبیق نیت اجتماعی</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-5">
            فقط بگو{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              چی تو ذهنته!
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
            دلت بازی می‌خواد؟ یه گپ دوستانه؟ یا هم‌فکری درباره تکنولوژی؟ به جای گشتن در سرورهای خلوت، نیت خودت رو اعلام کن تا نکسوس سیگنال در کمتر از چند دقیقه افراد هم‌سلیقه رو دور هم جمع کنه.
          </p>

          <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-cyan-200 mb-6 flex items-center gap-3">
            <Zap className="w-5 h-5 text-yellow-400 shrink-0" />
            <span>
              <strong>فرمول جادویی نکسوس:</strong> بیان نیت ➔ کشف افراد هم‌مسیر ➔ تجربه مشترک بی‌درنگ
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>سیستم تطبیق قطعی بدون نیاز به پروفایل‌سازی مخفی یا افشای حریم خصوصی</span>
          </div>
        </div>

        {/* Scene Illustration (Orbi Drone & Vex on Platform) */}
        <div className="flex-1 relative w-full h-[380px] sm:h-[440px] rounded-3xl bg-gradient-to-br from-[#0c1222] via-[#0e1830] to-[#080d19] border border-cyan-500/30 p-6 shadow-2xl flex items-center justify-center overflow-hidden">
          {/* Central Radar Pulse Circles */}
          <div className="absolute w-64 h-64 rounded-full border border-cyan-500/30 animate-ping opacity-25" style={{ animationDuration: '4s' }} />
          <div className="absolute w-96 h-96 rounded-full border border-cyan-500/20" />

          {/* Central Intention Card */}
          <div className="relative z-20 p-4 rounded-2xl bg-[#070b16]/95 border border-cyan-500/40 text-center shadow-2xl backdrop-blur-xl max-w-xs">
            <div className="text-[10px] text-cyan-400 font-mono mb-1">INTENT DETECTED</div>
            <div className="text-xs font-black text-white mb-2">«می‌خوام با ۳ نفر راجع به AI حرف بزنم»</div>
            <div className="w-full bg-cyan-950 h-2 rounded-full overflow-hidden mb-2">
              <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full w-[85%] rounded-full" />
            </div>
            <div className="text-[10px] text-emerald-400 font-bold">۲ نفر آماده‌اند • در حال تشکیل...</div>
          </div>

          {/* Orbi Drone Scanning from Top */}
          <div className="absolute top-2 right-4 z-30 transition-transform duration-300 hover:scale-110 animate-mascot-float">
            <OfficialOrbi size={190} />
          </div>

          {/* Vex Observing from Bottom Left */}
          <div className="absolute -left-4 bottom-2 z-30 transition-transform duration-300 hover:scale-110 animate-mascot-float-reverse">
            <OfficialVex size={220} />
          </div>
        </div>
      </div>
    </section>
  );
};
