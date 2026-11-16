'use client';

import React, { useState } from 'react';
import {
  NexusIcon,
  NexusGlyphName,
  NexusGlyphAnimation,
  GLYPH_DESCRIPTIONS,
} from '@/components/glyphs';
import confetti from 'canvas-confetti';
import Link from 'next/link';

const ALL_GLYPH_NAMES: NexusGlyphName[] = [
  'core',
  'home',
  'explore',
  'moments',
  'signal',
  'communities',
  'friends',
  'messages',
  'voice',
  'video',
  'radar',
  'playground',
  'quests',
  'xp',
  'level',
  'achievements',
  'trending',
  'ai',
  'notifications',
  'profile',
];

export default function NexusGlyphsShowcasePage() {
  const [selectedSize, setSelectedSize] = useState<number>(24);
  const [strokeWidth, setStrokeWidth] = useState<number>(1.75);
  const [activeAll, setActiveAll] = useState<boolean>(false);
  const [animationMode, setAnimationMode] = useState<NexusGlyphAnimation>('none');
  const [copiedName, setCopiedName] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [bgMode, setBgMode] = useState<'deep' | 'dark' | 'glass'>('deep');

  const filteredGlyphs = ALL_GLYPH_NAMES.filter((name) => {
    const meta = GLYPH_DESCRIPTIONS[name];
    const q = search.toLowerCase();
    return (
      name.toLowerCase().includes(q) ||
      meta.titleFa.toLowerCase().includes(q) ||
      meta.descFa.toLowerCase().includes(q) ||
      meta.category.toLowerCase().includes(q)
    );
  });

  const handleCopyCode = (name: NexusGlyphName) => {
    const snippet = `<NexusIcon name="${name}" size={${selectedSize}} strokeWidth={${strokeWidth}} ${activeAll ? 'active ' : ''}/>`;
    if (navigator.clipboard) navigator.clipboard.writeText(snippet);
    setCopiedName(name);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
    setTimeout(() => setCopiedName(null), 1800);
  };

  return (
    <div
      className={`min-h-screen text-slate-100 p-6 md:p-10 select-none ${
        bgMode === 'deep'
          ? 'bg-[#06070d]'
          : bgMode === 'dark'
          ? 'bg-[#0f111a]'
          : 'bg-gradient-to-br from-[#0c0d18] via-[#121427] to-[#07080f]'
      }`}
      dir="rtl"
    >
      {/* Top Header */}
      <header className="max-w-6xl mx-auto mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#8B7CFF] to-[#43C9D8] flex items-center justify-center text-white text-xl shadow-[0_0_20px_rgba(139,124,255,0.4)]">
              <NexusIcon name="core" size={24} active />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white flex items-center gap-2">
                <span>NEXUS GLYPHS</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#8B7CFF]/20 text-[#8B7CFF] border border-[#8B7CFF]/30 font-bold">
                  v1.0 Original Geometry
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                سامانه نشانه‌شناسی و آیکون‌های وکتوری اورجینال شبکه اجتماعی نکسوس
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white transition flex items-center gap-2"
          >
            <span>بازگشت به کهکشان</span>
            <NexusIcon name="home" size={16} />
          </Link>
        </div>
      </header>

      {/* Control Deck */}
      <div className="max-w-6xl mx-auto mb-8 p-5 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl flex flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <div className="w-full sm:w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجوی آیکون یا دسته‌بندی..."
            className="w-full px-4 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#43C9D8] transition"
          />
        </div>

        {/* Size Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-bold">سایز:</span>
          {[16, 20, 24, 32].map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSize(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                selectedSize === s
                  ? 'bg-[#8B7CFF] text-white border-[#8B7CFF] shadow-md'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
              }`}
            >
              {s}px
            </button>
          ))}
        </div>

        {/* Stroke Width Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-bold">ضخامت خط:</span>
          {[1.5, 1.75, 2.0].map((sw) => (
            <button
              key={sw}
              onClick={() => setStrokeWidth(sw)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold transition border ${
                strokeWidth === sw
                  ? 'bg-[#43C9D8] text-black border-[#43C9D8] shadow-md'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
              }`}
            >
              {sw}
            </button>
          ))}
        </div>

        {/* Active Toggle */}
        <button
          onClick={() => setActiveAll(!activeAll)}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition border flex items-center gap-1.5 ${
            activeAll
              ? 'bg-purple-600/40 text-purple-200 border-purple-500/50'
              : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
          }`}
        >
          <NexusIcon name="moments" size={14} active={activeAll} />
          <span>{activeAll ? 'حالت فعال (Active On)' : 'حالت پیش‌فرض (Default)'}</span>
        </button>

        {/* Motion System Selector */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-400 font-bold">انیمیشن:</span>
          <select
            value={animationMode}
            onChange={(e) => setAnimationMode(e.target.value as NexusGlyphAnimation)}
            className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-[#43C9D8]"
          >
            <option value="none">بدون انیمیشن (ایستا)</option>
            <option value="pulse">پالس آرام (Pulse)</option>
            <option value="spin">چرخش مداری (Spin)</option>
            <option value="radar-sweep">اسکن راداری (Sweep)</option>
            <option value="glow">درخشش هاله‌ای (Glow)</option>
            <option value="bounce">جهش (Bounce)</option>
          </select>
        </div>
      </div>

      {/* Glyphs Showcase Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredGlyphs.map((name) => {
          const meta = GLYPH_DESCRIPTIONS[name];
          const isCopied = copiedName === name;

          return (
            <div
              key={name}
              onClick={() => handleCopyCode(name)}
              className="p-5 rounded-3xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-[#8B7CFF]/50 transition-all cursor-pointer group flex flex-col justify-between relative shadow-lg"
            >
              {/* Top Meta */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400 font-mono">
                  {meta.category}
                </span>
                <span className="text-[10px] text-[#43C9D8] font-mono group-hover:underline">
                  {isCopied ? 'کپی شد! ✓' : 'کپی کد کامپوننت'}
                </span>
              </div>

              {/* Icon Stage */}
              <div className="h-24 rounded-2xl bg-black/30 border border-white/5 flex items-center justify-center text-[#8B7CFF] group-hover:text-[#43C9D8] group-hover:scale-110 transition-all duration-300">
                <NexusIcon
                  name={name}
                  size={selectedSize}
                  strokeWidth={strokeWidth}
                  active={activeAll}
                  animate={animationMode}
                />
              </div>

              {/* Description */}
              <div className="mt-4">
                <div className="text-xs font-black text-white group-hover:text-cyan-300 transition-colors">
                  {meta.titleFa}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {meta.descFa}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-2 pt-2 border-t border-white/5">
                  &lt;NexusIcon name=&quot;{name}&quot; /&gt;
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
