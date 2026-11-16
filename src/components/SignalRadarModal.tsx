'use client';

import React, { useState } from 'react';
import {
  Radio,
  Sparkles,
  Users,
  Clock,
  Send,
  X,
  Check,
  Share2,
  Gamepad2,
  MessageSquare,
  Code,
  Music,
  Compass,
  Zap,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { User } from '@/types/discord';
import confetti from 'canvas-confetti';

interface SignalRadarModalProps {
  isOpen: boolean;
  currentUser: User;
  onClose: () => void;
  onMomentFormed?: (momentId: string, title: string) => void;
}

interface ActiveSignalItem {
  id: string;
  creatorName: string;
  creatorAvatar: string;
  category: string;
  categoryIcon: string;
  description: string;
  targetCount: number;
  currentCount: number;
  durationMinutes: number;
  status: 'BROADCASTING' | 'FORMED';
  isJoined?: boolean;
}

const CATEGORY_CHOICES = [
  { id: 'gaming', label: 'بازی و لابی تیمی', icon: '🎮', color: 'from-amber-500 to-red-500' },
  { id: 'casual', label: 'گپ و گفت صمیمی', icon: '☕', color: 'from-purple-500 to-indigo-500' },
  { id: 'tech', label: 'تکنولوژی و هوش مصنوعی', icon: '🤖', color: 'from-cyan-500 to-blue-500' },
  { id: 'dev', label: 'کدنویسی و توسعه', icon: '💻', color: 'from-emerald-500 to-teal-500' },
  { id: 'music', label: 'موسیقی و شنیدن جمعی', icon: '🎵', color: 'from-pink-500 to-rose-500' },
];

export default function SignalRadarModal({
  isOpen,
  currentUser,
  onClose,
  onMomentFormed,
}: SignalRadarModalProps) {
  const [activeTab, setActiveTab] = useState<'discover' | 'broadcast'>('broadcast');

  // Broadcast state
  const [selectedCat, setSelectedCat] = useState('gaming');
  const [description, setDescription] = useState('');
  const [targetCount, setTargetCount] = useState(3);
  const [duration, setDuration] = useState(25);
  const [isCopied, setIsCopied] = useState(false);

  // Live Broadcasted Signals (preloaded with sample active signals)
  const [signals, setSignals] = useState<ActiveSignalItem[]>([
    {
      id: 'sig_1',
      creatorName: 'ساشا اسموکر',
      creatorAvatar: 'cyber_neon',
      category: 'gaming',
      categoryIcon: '🎮',
      description: 'نیاز به ۲ نفر برای پرمیر کانتر ۲ رنک ۱۵k+',
      targetCount: 3,
      currentCount: 2,
      durationMinutes: 30,
      status: 'BROADCASTING',
    },
    {
      id: 'sig_2',
      creatorName: 'آرش شب‌نورد',
      creatorAvatar: 'matrix_hacker',
      category: 'tech',
      categoryIcon: '🤖',
      description: 'بحث آزاد درباره آینده مدل‌های هوش مصنوعی و ادجنت‌ها',
      targetCount: 4,
      currentCount: 3,
      durationMinutes: 20,
      status: 'BROADCASTING',
    },
  ]);

  if (!isOpen) return null;

  const handleBroadcastSignal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const newSignal: ActiveSignalItem = {
      id: `sig_${Date.now()}`,
      creatorName: currentUser.name,
      creatorAvatar: currentUser.avatarStyle,
      category: selectedCat,
      categoryIcon: CATEGORY_CHOICES.find((c) => c.id === selectedCat)?.icon || '📡',
      description: description.trim(),
      targetCount,
      currentCount: 1,
      durationMinutes: duration,
      status: 'BROADCASTING',
      isJoined: true,
    };

    setSignals((prev) => [newSignal, ...prev]);
    setActiveTab('discover');
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.4 } });
  };

  const handleJoinSignal = (signalId: string) => {
    setSignals((prev) =>
      prev.map((sig) => {
        if (sig.id === signalId) {
          const nextCount = sig.currentCount + 1;
          const isFormed = nextCount >= sig.targetCount;
          if (isFormed) {
            confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 } });
            if (onMomentFormed) {
              onMomentFormed(sig.id, sig.description);
            }
          }
          return {
            ...sig,
            currentCount: nextCount,
            status: isFormed ? 'FORMED' : 'BROADCASTING',
            isJoined: true,
          };
        }
        return sig;
      })
    );
  };

  const handleCopySignalLink = (sigId: string) => {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/#signal-${sigId}` : '';
    if (navigator.clipboard) navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-xl z-50 flex items-center justify-center p-4 select-none" dir="rtl">
      {/* Outer Glow container */}
      <div className="relative w-full max-w-2xl bg-[#090b14]/95 rounded-3xl border border-white/15 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-purple-900/30 via-indigo-900/20 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-xl shadow-[0_0_20px_rgba(6,182,212,0.4)]">
              📡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white">نکسوس سیگنال (NEXUS SIGNAL)</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  رادار زنده
                </span>
              </div>
              <p className="text-xs text-slate-400">به جای گشتن دنبال افراد، نیت خودت رو بگو تا جمع تشکیل بشه.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition border border-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 pt-4 pb-2 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2 bg-black/40 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setActiveTab('broadcast')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'broadcast'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>ارسال سیگنال (من الان چی می‌خوام؟)</span>
            </button>

            <button
              onClick={() => setActiveTab('discover')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'discover'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>رادار سیگنال‌های فعال ({signals.length})</span>
            </button>
          </div>

          <span className="text-[11px] text-slate-400 hidden sm:inline">
            💡 تشکیل لحظه‌ای گروه‌های اجتماعی
          </span>
        </div>

        {/* Tab 1: Broadcast Signal */}
        {activeTab === 'broadcast' && (
          <form onSubmit={handleBroadcastSignal} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                ۱. الان تمایل به انجام چه فعالیتی داری؟
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CATEGORY_CHOICES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCat(cat.id)}
                    className={`p-3 rounded-2xl border text-right transition-all flex items-center gap-2.5 ${
                      selectedCat === cat.id
                        ? 'bg-white/15 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] scale-[1.02]'
                        : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.08]'
                    }`}
                  >
                    <span className="text-xl">{cat.icon}</span>
                    <span className="text-xs font-bold text-white">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                ۲. شرح نیت یا هدف از این همنشینی
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="مثال: می‌خوام با ۲ نفر راجع به تکنولوژی صحبت کنم یا برای پرمیر کانتر تیم شیم..."
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  ۳. تعداد افراد مورد نیاز
                </label>
                <div className="flex items-center gap-2">
                  {[2, 3, 4, 5].map((cnt) => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => setTargetCount(cnt)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition border ${
                        targetCount === cnt
                          ? 'bg-cyan-500 text-black border-cyan-400 font-black shadow-md'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
                      }`}
                    >
                      {cnt} نفر
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  ۴. مدت زمان تقریبی
                </label>
                <div className="flex items-center gap-2">
                  {[15, 25, 45].map((dur) => (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => setDuration(dur)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition border ${
                        duration === dur
                          ? 'bg-purple-600 text-white border-purple-400 font-black shadow-md'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
                      }`}
                    >
                      {dur} دقیقه
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:opacity-95 text-white font-black text-xs transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4 rotate-180" />
              <span>ارسال سیگنال در مدار نکسوس و جستجوی افراد</span>
            </button>
          </form>
        )}

        {/* Tab 2: Discover Active Signals */}
        {activeTab === 'discover' && (
          <div className="p-6 space-y-3 max-h-[420px] overflow-y-auto no-scrollbar">
            {signals.map((sig) => {
              const progressPercent = Math.min(100, (sig.currentCount / sig.targetCount) * 100);
              const isFormed = sig.status === 'FORMED';

              return (
                <div
                  key={sig.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isFormed
                      ? 'bg-emerald-500/10 border-emerald-500/40'
                      : 'bg-white/[0.04] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-start gap-2.5">
                      <span className="text-2xl">{sig.categoryIcon}</span>
                      <div>
                        <div className="text-xs font-black text-white">{sig.description}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>سازنده: <strong>{sig.creatorName}</strong></span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-cyan-400" />
                            {sig.durationMinutes} دقیقه
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleCopySignalLink(sig.id)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10"
                        title="دعوت دوستان با لینک اختصاصی"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                      </button>

                      {isFormed ? (
                        <span className="px-3 py-1.5 rounded-xl bg-emerald-500 text-black font-black text-xs flex items-center gap-1 shadow-md">
                          <Check className="w-3.5 h-3.5" />
                          تشکیل شد! ورود به مومنت
                        </span>
                      ) : sig.isJoined ? (
                        <span className="px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold">
                          حاضر در رادار ({sig.currentCount}/{sig.targetCount})
                        </span>
                      ) : (
                        <button
                          onClick={() => handleJoinSignal(sig.id)}
                          className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs transition shadow-md"
                        >
                          + منم هستم ({sig.currentCount}/{sig.targetCount})
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Formation Progress Bar */}
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden mt-3 border border-white/5">
                    <div
                      style={{ width: `${progressPercent}%` }}
                      className={`h-full transition-all duration-500 ${
                        isFormed
                          ? 'bg-gradient-to-r from-emerald-400 to-teal-400'
                          : 'bg-gradient-to-r from-cyan-500 to-purple-500'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
