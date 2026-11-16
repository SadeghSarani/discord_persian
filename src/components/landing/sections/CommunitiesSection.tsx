import React from 'react';
import { Compass, Users, Globe2, ShieldCheck, Radio, Gamepad2 } from 'lucide-react';

export const CommunitiesSection: React.FC = () => {
  return (
    <section className="relative py-24 px-6 overflow-hidden border-t border-white/10 select-none">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        {/* Story Text */}
        <div className="flex-1 text-right">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-black mb-4">
            <Globe2 className="w-3.5 h-3.5 text-purple-400" />
            <span>سیارات پایدار بازی‌ها (WORLDS)</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-5">
            اینجا هر علاقه‌ای{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-cyan-300">
              یه دنیا داره!
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6 font-normal">
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

        {/* Scene Illustration: Floating Planet Worlds Cards */}
        <div className="flex-1 relative w-full h-[400px] sm:h-[460px] rounded-3xl bg-gradient-to-br from-[#120e24] via-[#1a1236] to-[#0a0817] border border-purple-500/30 p-6 shadow-2xl flex flex-col justify-center gap-3 overflow-hidden">
          {/* Planet Card 1: CS2 */}
          <div className="p-4 rounded-2xl bg-white/[0.05] border border-amber-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-600 to-yellow-500 flex items-center justify-center text-2xl shadow-lg">
                💣
              </div>
              <div>
                <div className="text-xs font-black text-white">سیاره کانتر ۲ (Dust Orbit)</div>
                <div className="text-[11px] text-slate-400">شوتینگ تاکتیکال و پرمیر • ۱۴۲ پلیر آنلاین</div>
              </div>
            </div>
            <span className="text-[10px] px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
              فعال
            </span>
          </div>

          {/* Planet Card 2: FC27 */}
          <div className="p-4 rounded-2xl bg-white/[0.05] border border-emerald-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-2xl shadow-lg">
                ⚽
              </div>
              <div>
                <div className="text-xs font-black text-white">سیاره فوتبال ۲۷ (San Siro Core)</div>
                <div className="text-[11px] text-slate-400">شبیه‌ساز و تورنمنت • ۱۰۹ پلیر آنلاین</div>
              </div>
            </div>
            <span className="text-[10px] px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
              فعال
            </span>
          </div>

          {/* Planet Card 3: Valorant */}
          <div className="p-4 rounded-2xl bg-white/[0.05] border border-pink-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-pink-600 to-purple-600 flex items-center justify-center text-2xl shadow-lg">
                🎯
              </div>
              <div>
                <div className="text-xs font-black text-white">سیاره والورانت (Radiant Haven)</div>
                <div className="text-[11px] text-slate-400">هیرو شوتر • ۱۶۸ پلیر آنلاین</div>
              </div>
            </div>
            <span className="text-[10px] px-2.5 py-1 rounded-xl bg-pink-500/20 text-pink-300 font-bold border border-pink-500/30">
              فعال
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
