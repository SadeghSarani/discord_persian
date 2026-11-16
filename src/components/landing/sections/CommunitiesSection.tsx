import React from 'react';
import { Vex, Mimo } from '../characters';
import { Compass, Users, Globe2, ShieldCheck } from 'lucide-react';

export const CommunitiesSection: React.FC = () => {
  return (
    <section className="relative py-24 px-6 overflow-hidden border-t border-white/10 select-none">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        {/* Story Text */}
        <div className="flex-1 text-right">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-black mb-4">
            <Globe2 className="w-3.5 h-3.5 text-purple-400" />
            <span>سیارات پایدار بازی‌ها</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-5">
            اینجا هر علاقه‌ای{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-cyan-300">
              یه دنیا داره!
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
            گیمرهای کانتر ۲، پروکلابزهای FC27، رادیانت‌های والورانت یا مهندسان نرم‌افزار؛ هر کدام دارای یک سیاره سه‌بعدی اختصاصی، ایستگاه‌های رادیویی زنده، کانال‌های تاکتیکال و جدول مسابقات هفتگی هستند.
          </p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
              <div className="text-lg mb-1">🪐</div>
              <div className="text-xs font-bold text-white mb-0.5">سیارات سه‌بعدی ۳D</div>
              <div className="text-[11px] text-slate-400">کره‌های زنده WebGL با گردش و اتمسفر واقعی</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
              <div className="text-lg mb-1">📻</div>
              <div className="text-xs font-bold text-white mb-0.5">رادیوهای اختصاصی</div>
              <div className="text-[11px] text-slate-400">پخش زنده موسیقی لوفای و گزارش مسابقات</div>
            </div>
          </div>
        </div>

        {/* Scene Illustration: Floating Planet Islands */}
        <div className="flex-1 relative w-full h-[380px] sm:h-[440px] rounded-3xl bg-gradient-to-br from-[#120e24] via-[#1a1236] to-[#0a0817] border border-purple-500/30 p-6 shadow-2xl flex items-center justify-center overflow-hidden">
          {/* Planetary Mini Orbits */}
          <div className="absolute w-44 h-44 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-400 shadow-[0_0_50px_rgba(245,158,11,0.5)] -left-4 top-10 flex items-center justify-center text-2xl border border-white/30 animate-pulse">
            💣
          </div>

          <div className="absolute w-36 h-36 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 shadow-[0_0_40px_rgba(16,185,129,0.5)] right-6 bottom-8 flex items-center justify-center text-2xl border border-white/30">
            ⚽
          </div>

          {/* Vex Character center right */}
          <div className="absolute right-12 top-6 z-30">
            <Vex size={165} />
          </div>

          {/* Mimo Character exploring from bottom left */}
          <div className="absolute left-8 bottom-6 z-30">
            <Mimo size={135} />
          </div>
        </div>
      </div>
    </section>
  );
};
