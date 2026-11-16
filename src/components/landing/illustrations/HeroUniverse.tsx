import React from 'react';
import Link from 'next/link';
import { NexusIcon } from '@/components/glyphs';
import { ArrowRight } from 'lucide-react';

export const HeroUniverse: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative w-full max-w-5xl mx-auto h-[540px] md:h-[600px] flex items-center justify-center select-none ${className}`}>
      {/* Background Cosmic Energy Aura & Grid */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[650px] h-[360px] bg-gradient-to-r from-purple-600/25 via-cyan-500/20 to-pink-500/25 rounded-full blur-[130px]" />
      </div>

      {/* Futuristic Orbit Circles & Vector Constellation */}
      <svg
        viewBox="0 0 800 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full pointer-events-none opacity-45"
      >
        <ellipse cx="400" cy="300" rx="360" ry="150" stroke="#8B7CFF" strokeWidth="1.5" strokeDasharray="6 6" />
        <ellipse cx="400" cy="300" rx="240" ry="260" stroke="#43C9D8" strokeWidth="1" strokeDasharray="4 8" />
        <circle cx="400" cy="300" r="160" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

        {/* Dynamic Telemetry Lines */}
        <line x1="160" y1="180" x2="380" y2="290" stroke="#C084FC" strokeWidth="1.5" strokeDasharray="3 3" />
        <line x1="380" y1="290" x2="620" y2="200" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="3 3" />
        <line x1="380" y1="290" x2="540" y2="460" stroke="#F43F5E" strokeWidth="1.5" strokeDasharray="3 3" />
        <line x1="160" y1="180" x2="220" y2="440" stroke="#A78BFA" strokeWidth="1.5" strokeDasharray="3 3" />

        {/* Orbit Signal Nodes */}
        <circle cx="160" cy="180" r="4.5" fill="#FDE047" />
        <circle cx="620" cy="200" r="5" fill="#43C9D8" />
        <circle cx="220" cy="440" r="4.5" fill="#8B7CFF" />
        <circle cx="540" cy="460" r="4.5" fill="#FF748C" />
      </svg>

      {/* Floating Holographic Social Node 1 (Gaming Lobby) */}
      <div className="absolute top-8 left-4 md:left-12 z-30 p-4 rounded-2xl bg-[#0a0d1c]/90 backdrop-blur-2xl border border-cyan-500/30 shadow-[0_10px_30px_rgba(6,182,212,0.25)] animate-mascot-float">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shadow-md">
            <NexusIcon name="playground" size={20} />
          </div>
          <div>
            <div className="text-xs font-black text-white flex items-center gap-1.5">
              <span>لابی مسابقات کانتر ۲</span>
              <span className="text-[9px] bg-cyan-400 text-black px-1.5 py-0.2 rounded font-extrabold">LIVE</span>
            </div>
            <div className="text-[11px] text-cyan-300 font-medium mt-0.5">۴ از ۵ بازیکن آنلاین • ویس‌روم فعال</div>
          </div>
        </div>
      </div>

      {/* Floating Holographic Social Node 2 (AI Moment) */}
      <div className="absolute top-10 right-4 md:right-12 z-30 p-4 rounded-2xl bg-[#0d091a]/90 backdrop-blur-2xl border border-purple-500/30 shadow-[0_10px_30px_rgba(139,92,246,0.25)] animate-mascot-float-reverse">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300 shadow-md">
            <NexusIcon name="moments" size={20} />
          </div>
          <div>
            <div className="text-xs font-black text-white flex items-center gap-1.5">
              <span>مومنت هوش مصنوعی و کدنویسی</span>
              <span className="text-[9px] bg-purple-400 text-black px-1.5 py-0.2 rounded font-extrabold">مومنت داغ</span>
            </div>
            <div className="text-[11px] text-purple-300 font-medium mt-0.5">۳۸ خلبان در حال گفت‌وگو و استریم</div>
          </div>
        </div>
      </div>

      {/* Floating Holographic Social Node 3 (Signal Radar Match) */}
      <div className="absolute bottom-10 left-4 md:left-16 z-30 p-4 rounded-2xl bg-[#140b18]/90 backdrop-blur-2xl border border-pink-500/30 shadow-[0_10px_30px_rgba(244,63,94,0.25)] animate-mascot-float-reverse">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-300 shadow-md">
            <NexusIcon name="signal" size={20} />
          </div>
          <div>
            <div className="text-xs font-black text-white flex items-center gap-1.5">
              <span>سیگنال موفق: «بحث روی گیم‌پلی»</span>
            </div>
            <div className="text-[11px] text-pink-300 font-medium mt-0.5">اتصال ۳ نفر در ویس‌روم موقت</div>
          </div>
        </div>
      </div>

      {/* Floating Holographic Social Node 4 (Planet Radio) */}
      <div className="absolute bottom-10 right-4 md:right-16 z-30 p-4 rounded-2xl bg-[#09151c]/90 backdrop-blur-2xl border border-teal-500/30 shadow-[0_10px_30px_rgba(20,184,166,0.25)] animate-mascot-float">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-300 shadow-md">
            <NexusIcon name="voice" size={20} />
          </div>
          <div>
            <div className="text-xs font-black text-white flex items-center gap-1.5">
              <span>رادیو لوفای سیاره سن‌آندریاس</span>
            </div>
            <div className="text-[11px] text-teal-300 font-medium mt-0.5">در حال پخش زنده برای ۹۴ نفر</div>
          </div>
        </div>
      </div>

      {/* Central Interactive Nexus Quantum Core */}
      <Link
        href="/panel"
        className="relative z-20 group cursor-pointer flex flex-col items-center"
      >
        <div className="relative w-52 h-52 rounded-full bg-gradient-to-tr from-purple-700 via-indigo-600 to-cyan-500 shadow-[0_0_100px_rgba(139,92,246,0.7)] flex items-center justify-center border-2 border-white/40 group-hover:scale-105 transition-transform duration-500 animate-energy-bob">
          {/* Orbital Ring 1 */}
          <div
            className="absolute inset-2 rounded-full border border-cyan-400/40 animate-spin"
            style={{ animationDuration: '30s' }}
          >
            <div className="w-3.5 h-3.5 rounded-full bg-cyan-300 absolute -top-1.5 left-1/2 -translate-x-1/2 shadow-[0_0_15px_#38bdf8]" />
          </div>
          {/* Orbital Ring 2 */}
          <div
            className="absolute inset-5 rounded-full border border-purple-400/40 animate-spin"
            style={{ animationDuration: '20s', animationDirection: 'reverse' }}
          >
            <div className="w-3 h-3 rounded-full bg-pink-400 absolute -bottom-1.5 left-1/2 -translate-x-1/2 shadow-[0_0_15px_#f43f5e]" />
          </div>

          {/* Core Vector Icon */}
          <div className="text-center flex flex-col items-center justify-center text-white">
            <NexusIcon name="core" size={52} strokeWidth={2} />
            <div className="text-[11px] font-black tracking-widest text-white mt-2 group-hover:text-cyan-300 transition">
              NEXUS CORE
            </div>
          </div>
        </div>

        {/* Click To Enter Badge */}
        <div className="mt-4 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-cyan-300 shadow-lg backdrop-blur-xl group-hover:border-cyan-400 transition flex items-center gap-1.5">
          <span>ورود به کهکشان و روم‌ها</span>
          <ArrowRight className="w-3.5 h-3.5 rotate-180" />
        </div>
      </Link>
    </div>
  );
};
