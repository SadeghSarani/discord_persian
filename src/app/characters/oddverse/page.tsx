'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MimoMascotV2 } from '@/components/mascots/v2/MimoMascotV2';
import { ZyroMascotV2 } from '@/components/mascots/v2/ZyroMascotV2';
import { VexMascotV2 } from '@/components/mascots/v2/VexMascotV2';
import { OrbiMascotV2 } from '@/components/mascots/v2/OrbiMascotV2';
import { NexusOddverseGroup } from '@/components/mascots/v2/NexusOddverseGroup';
import {
  Sparkles,
  ArrowRight,
  Eye,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Layers,
  Activity,
  Heart,
  Zap,
  Palette,
  Radio,
} from 'lucide-react';

export default function OddverseShowcasePage() {
  const [activeTab, setActiveTab] = useState<'group' | 'mimo' | 'zyro' | 'vex' | 'orbi'>('group');
  const [renderMode, setRenderMode] = useState<'color' | 'silhouette'>('color');
  const [scaleFactor, setScaleFactor] = useState<number>(340);

  // MIMO state controls
  const [mimoExpr, setMimoExpr] = useState<'neutral' | 'excited' | 'curious' | 'laughing' | 'surprised' | 'sleepy' | 'celebrating'>('excited');
  const [mimoPose, setMimoPose] = useState<'hero' | 'wave' | 'celebrate' | 'thinking' | 'sleep'>('celebrate');

  // ZYRO state controls
  const [zyroExpr, setZyroExpr] = useState<'confident' | 'excited' | 'competitive' | 'celebrating'>('confident');
  const [zyroPose, setZyroPose] = useState<'gaming' | 'victory' | 'jump'>('gaming');

  // VEX state controls
  const [vexPose, setVexPose] = useState<'hero' | 'creative' | 'celebration'>('creative');

  // ORBI state controls
  const [orbiPose, setOrbiPose] = useState<'floating' | 'scanning' | 'discovery'>('scanning');

  return (
    <div className="min-h-screen bg-[#05060b] text-slate-100 font-sans p-6 sm:p-10 select-none" dir="rtl">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/" className="text-xs font-bold text-slate-400 hover:text-white transition">
              صفحه اصلی
            </Link>
            <span className="text-slate-600">/</span>
            <Link href="/landing" className="text-xs font-bold text-slate-400 hover:text-white transition">
              لندینگ
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-xs font-black text-cyan-400">NEXUS ODDVERSE V2</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono border border-cyan-500/30">
              PRODUCTION READY
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <span>کتابچه تولید ماسکوت‌های فوق‌العاده نکسوس (NEXUS ODDVERSE)</span>
            <span className="text-xs font-black text-purple-300 px-3 py-1 rounded-xl bg-purple-950/80 border border-purple-500/30">
              نسخه ۲.۰
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-3xl leading-relaxed">
            بازطراحی کامل ۴ کاراکتر اریجینال نکسوس طبق الزامات <strong>Creative Direction V2</strong> با سیلوئت‌های نامتعارف، پوشش فشن آینده‌نگرانه، اکسسوری‌های لایه‌بندی شده و جزییات متریال وکتور اختصاصی SVG.
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/10 shrink-0">
          <button
            onClick={() => setRenderMode('color')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              renderMode === 'color'
                ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>رندر کامل رنگی</span>
          </button>
          <button
            onClick={() => setRenderMode('silhouette')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              renderMode === 'silhouette'
                ? 'bg-slate-800 text-cyan-300 border border-cyan-500/40 shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>تست سیلوئت (Silhouette Test)</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto py-6 border-b border-white/5">
        <button
          onClick={() => setActiveTab('group')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-2 shrink-0 ${
            activeTab === 'group'
              ? 'bg-gradient-to-r from-[#8B7CFF] to-[#43C9D8] text-white shadow-lg'
              : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>ترکیب گروهی (ODDVERSE UNIVERSE)</span>
        </button>

        <button
          onClick={() => setActiveTab('mimo')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-2 shrink-0 ${
            activeTab === 'mimo'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
              : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
          }`}
        >
          <Heart className="w-4 h-4 text-pink-400" />
          <span>MIMO — قلب احساسی و ماسکوت اصلی</span>
        </button>

        <button
          onClick={() => setActiveTab('zyro')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-2 shrink-0 ${
            activeTab === 'zyro'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
              : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
          }`}
        >
          <Zap className="w-4 h-4 text-cyan-400" />
          <span>ZYRO — عاصی پرانرژی و هیلو مکانیکی</span>
        </button>

        <button
          onClick={() => setActiveTab('vex')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-2 shrink-0 ${
            activeTab === 'vex'
              ? 'bg-gradient-to-r from-indigo-700 to-pink-600 text-white shadow-lg'
              : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
          }`}
        >
          <Palette className="w-4 h-4 text-pink-400" />
          <span>VEX — خالق انتزاعی و فشن معمارانه</span>
        </button>

        <button
          onClick={() => setActiveTab('orbi')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-2 shrink-0 ${
            activeTab === 'orbi'
              ? 'bg-gradient-to-r from-teal-600 to-cyan-500 text-white shadow-lg'
              : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
          }`}
        >
          <Radio className="w-4 h-4 text-teal-300" />
          <span>ORBI — ماشین غیرممکن مداری</span>
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="max-w-7xl mx-auto mt-8">
        {/* ================= 1. GROUP TAB ================= */}
        {activeTab === 'group' && (
          <div className="space-y-8">
            <div className="p-8 rounded-3xl bg-gradient-to-br from-[#0c0f1e] via-[#090b14] to-[#04060b] border border-white/10 shadow-2xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">ترکیب قهرمانان کهکشان ODDVERSE</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    چهار هویت بصری کاملاً مجزا با تست سیلوئت تایید شده؛ هیچ کاراکتری شباهت آناتومیک به دیگری ندارد.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-cyan-300 px-3 py-1 rounded-xl bg-cyan-950/80 border border-cyan-500/30">
                    ۴ هویت • ۴ گونه مجزا
                  </span>
                </div>
              </div>

              {/* Group Canvas */}
              <NexusOddverseGroup variant={renderMode} />
            </div>

            {/* 4-Column Differentiation Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* MIMO Card */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <div className="text-xs font-black text-purple-300 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                  <span>MIMO (ماسکوت اصلی)</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-light">
                  جمجمه هلالی نامتقارن، محفظه پورتال با ستاره کوانتومی معلق، چشم‌های نامتقارن، کفش‌های لنگه به لنگه استریت‌ویر.
                </p>
              </div>

              {/* ZYRO Card */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <div className="text-xs font-black text-cyan-300 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  <span>ZYRO (انرژی و گیمینگ)</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-light">
                  سیلوئت متمایل به جلو، هیلو صوتی مکانیکی با ماژول‌های آکوستیک، کاپشن عملکردی زرهی با زیپ اریب و توکن مداری.
                </p>
              </div>

              {/* VEX Card */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <div className="text-xs font-black text-pink-300 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-pink-400" />
                  <span>VEX (خلاقیت و کامیونیتی)</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-light">
                  پالتوی بلند معمارانه با یقه زاویه‌دار، فیس‌پلیت دوگانه هندسی/ارگانیک، روبان‌های تاخورده سر و شیشه‌های شناور.
                </p>
              </div>

              {/* ORBI Card */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <div className="text-xs font-black text-teal-300 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
                  <span>ORBI (هوش و دستیار)</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-light">
                  سیستم مکانیکی مداری معلق نامتقارن، شاسی چشم هم‌مرکز نورانی، لنز مستقل در حال چرخش و سنسورهای راداری.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ================= 2. MIMO EXPANDED TAB ================= */}
        {activeTab === 'mimo' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Interactive Preview Canvas */}
            <div className="lg:col-span-7 p-8 rounded-3xl bg-gradient-to-b from-[#110e24] via-[#0c0a1a] to-[#06060f] border border-purple-500/30 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <span className="text-[11px] font-black text-purple-300 bg-purple-950/80 px-2.5 py-1 rounded-full border border-purple-500/40">
                  وضعیت فعلی: {mimoExpr} • ژست: {mimoPose}
                </span>
              </div>

              <MimoMascotV2 size={scaleFactor} expression={mimoExpr} pose={mimoPose} variant={renderMode} />

              {/* CoAnimator Rendered Animation Player */}
              <div className="mt-6 w-full max-w-md p-4 rounded-2xl bg-black/50 border border-purple-500/20 flex flex-col items-center gap-2">
                <div className="flex items-center justify-between w-full text-xs font-bold text-purple-300">
                  <span className="flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-cyan-400" />
                    <span>رندر متحرک CoAnimator (کروماکی ۵ ثانیه)</span>
                  </span>
                  <a
                    href="/animations/mimo-animation.mp4"
                    download
                    className="text-[10px] bg-purple-600/60 hover:bg-purple-600 text-white px-2 py-0.5 rounded transition"
                  >
                    دانلود MP4
                  </a>
                </div>
                <video
                  src="/animations/mimo-animation.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="rounded-xl w-full h-auto max-h-56 object-contain border border-white/5 shadow-inner"
                />
              </div>
            </div>

            {/* Interactive Control Panel */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-3xl bg-[#090b14] border border-white/10 space-y-4">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <span>تغییر حالت احساسی MIMO (Expressions)</span>
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {(['neutral', 'excited', 'curious', 'laughing', 'surprised', 'sleepy', 'celebrating'] as const).map((expr) => (
                    <button
                      key={expr}
                      onClick={() => setMimoExpr(expr)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition text-right ${
                        mimoExpr === expr
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {expr === 'neutral' && 'عادی (Neutral)'}
                      {expr === 'excited' && 'هیجان‌زده (Excited)'}
                      {expr === 'curious' && 'کنجکاو (Curious)'}
                      {expr === 'laughing' && 'خندان (Laughing)'}
                      {expr === 'surprised' && 'متعجب (Surprised)'}
                      {expr === 'sleepy' && 'خواب‌آلود (Sleepy)'}
                      {expr === 'celebrating' && 'جشن (Celebrating)'}
                    </button>
                  ))}
                </div>

                <h3 className="text-base font-black text-white flex items-center gap-2 pt-2">
                  <Activity className="w-4 h-4 text-purple-400" />
                  <span>تغییر ژست بدنی (Poses)</span>
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {(['hero', 'wave', 'celebrate', 'thinking', 'sleep'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setMimoPose(p)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition text-right ${
                        mimoPose === p
                          ? 'bg-cyan-600 text-white shadow-md'
                          : 'bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {p === 'hero' && 'ایستاده قهرمان (Hero)'}
                      {p === 'wave' && 'دست تکان دادن (Wave)'}
                      {p === 'celebrate' && 'شادی پیروزی (Celebrate)'}
                      {p === 'thinking' && 'در حال تفکر (Thinking)'}
                      {p === 'sleep' && 'استراحت (Sleep)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Anatomy Key */}
              <div className="p-6 rounded-3xl bg-[#090b14] border border-white/10 space-y-2 text-xs text-slate-400 leading-relaxed">
                <strong className="text-white block font-bold">رفتار انیمیشن امضا (MIMO Signature Reaction):</strong>
                هنگام سوئیچ به حالت <em>Excited</em> یا <em>Celebrating</em>، ستاره ۴ پر معلق داخل محفظه سر بالا می‌آید، بزرگتر شده و تپش نورانی پیدا می‌کند؛ گوش‌های آکوستیک شناور سمت راست نیز بازتر می‌شوند.
              </div>
            </div>
          </div>
        )}

        {/* ================= 3. ZYRO EXPANDED TAB ================= */}
        {activeTab === 'zyro' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 p-8 rounded-3xl bg-gradient-to-b from-[#0e162a] via-[#090f1d] to-[#04060f] border border-cyan-500/30 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
              <ZyroMascotV2 size={scaleFactor} expression={zyroExpr} pose={zyroPose} variant={renderMode} />

              {/* CoAnimator Rendered Animation Player */}
              <div className="mt-6 w-full max-w-md p-4 rounded-2xl bg-black/50 border border-cyan-500/20 flex flex-col items-center gap-2">
                <div className="flex items-center justify-between w-full text-xs font-bold text-cyan-300">
                  <span className="flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-cyan-400" />
                    <span>رندر متحرک CoAnimator (کروماکی ۵ ثانیه)</span>
                  </span>
                  <a
                    href="/animations/zyro-animation.mp4"
                    download
                    className="text-[10px] bg-cyan-600/60 hover:bg-cyan-600 text-white px-2 py-0.5 rounded transition"
                  >
                    دانلود MP4
                  </a>
                </div>
                <video
                  src="/animations/zyro-animation.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="rounded-xl w-full h-auto max-h-56 object-contain border border-white/5 shadow-inner"
                />
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-3xl bg-[#090b14] border border-white/10 space-y-4">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>ژست‌ها و حالات ZYRO</span>
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {(['gaming', 'victory', 'jump'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setZyroPose(p)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition text-right ${
                        zyroPose === p
                          ? 'bg-cyan-600 text-white shadow-md'
                          : 'bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {p === 'gaming' && 'تمرکز گیمینگ (Gaming)'}
                      {p === 'victory' && 'دست بالا پیروزی (Victory)'}
                      {p === 'jump' && 'آماده جهش (Jump)'}
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <h4 className="text-xs font-bold text-slate-300 mb-2">حالت احساسی صورت:</h4>
                  <div className="flex gap-2">
                    {(['confident', 'competitive', 'celebrating'] as const).map((e) => (
                      <button
                        key={e}
                        onClick={() => setZyroExpr(e)}
                        className={`py-1.5 px-3 rounded-lg text-xs font-bold transition ${
                          zyroExpr === e
                            ? 'bg-blue-600 text-white'
                            : 'bg-white/5 text-slate-400 hover:text-white'
                        }`}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-[#090b14] border border-white/10 space-y-2 text-xs text-slate-400 leading-relaxed">
                <strong className="text-white block font-bold">هیلو صوتی اریجینال (Mechanical Audio Halo):</strong>
                به جای هدفون‌های معمولی، یک هیلو معلق با شیارهای شکل‌موج (Waveform) و دو ماژول صوتی فضایی در طرفین سر قرار دارد. همچنین دستکش‌های چانکی مجهز به ناکل‌های سایبرنتیک هستند.
              </div>
            </div>
          </div>
        )}

        {/* ================= 4. VEX EXPANDED TAB ================= */}
        {activeTab === 'vex' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 p-8 rounded-3xl bg-gradient-to-b from-[#180f26] via-[#100a1c] to-[#05030a] border border-pink-500/30 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
              <VexMascotV2 size={scaleFactor} pose={vexPose} variant={renderMode} />
            </div>

            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-3xl bg-[#090b14] border border-white/10 space-y-4">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Palette className="w-4 h-4 text-pink-400" />
                  <span>ژست‌های خلق هنری VEX</span>
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {(['creative', 'hero', 'celebration'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setVexPose(p)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition text-right ${
                        vexPose === p
                          ? 'bg-pink-600 text-white shadow-md'
                          : 'bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {p === 'creative' && 'خلق فرگمنت‌ها (Creative)'}
                      {p === 'hero' && 'استایل فشن (Hero)'}
                      {p === 'celebration' && 'پیروزی (Celebration)'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-[#090b14] border border-white/10 space-y-2 text-xs text-slate-400 leading-relaxed">
                <strong className="text-white block font-bold">معماری فشن و شاردها:</strong>
                پالتوی اورسایز با خطوط دوخت مرجانی نئون، فیس‌پلیت متالیک دوگانه، روبان‌های تاخورده سر به جای مو و شارد‌های هندسی معلق چرخان که با دست راست هدایت می‌شوند.
              </div>
            </div>
          </div>
        )}

        {/* ================= 5. ORBI EXPANDED TAB ================= */}
        {activeTab === 'orbi' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 p-8 rounded-3xl bg-gradient-to-b from-[#091822] via-[#071118] to-[#03060a] border border-teal-500/30 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
              <OrbiMascotV2 size={scaleFactor} pose={orbiPose} variant={renderMode} />
            </div>

            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-3xl bg-[#090b14] border border-white/10 space-y-4">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Radio className="w-4 h-4 text-teal-400" />
                  <span>وضعیت‌های اسکن ORBI</span>
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {(['scanning', 'floating', 'discovery'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setOrbiPose(p)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition text-right ${
                        orbiPose === p
                          ? 'bg-teal-600 text-white shadow-md'
                          : 'bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {p === 'scanning' && 'پرتو اسکن هولوگرافیک (Scanning)'}
                      {p === 'floating' && 'شناور آرام (Floating)'}
                      {p === 'discovery' && 'کشف سیگنال (Discovery)'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-[#090b14] border border-white/10 space-y-2 text-xs text-slate-400 leading-relaxed">
                <strong className="text-white block font-bold">ماشین مداری غیرممکن:</strong>
                بدنه دیگر یک کره تخت نیست؛ شامل حلقه‌های مداری باز و ناقص، فریم مکانیکی معلق، چشم هسته‌ای نوری چند لایه، و لنز اپتیکال مستقلی است که پیوسته در مدار راست می‌چرخد.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
