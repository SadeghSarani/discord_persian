'use client';

import React, { useState } from 'react';
import {
  X,
  AlertCircle,
  Loader2,
  Lock,
  Mail,
  User as UserIcon,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Gamepad2,
  Globe2,
  CheckCircle2,
} from 'lucide-react';
import { User } from '@/types/discord';
import confetti from 'canvas-confetti';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
}

type AuthTab = 'login' | 'register' | 'forgot';

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [tab, setTab] = useState<AuthTab>('login');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [resetEmail, setResetEmail] = useState('');
  const [resetSubmitted, setResetSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      if (tab === 'forgot') {
        const res = await fetch('/api/v1/auth/password-reset', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'request', email: resetEmail.trim() }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'خطا در ارسال درخواست بازیابی رمز');
        }
        setResetSubmitted(true);
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.5 } });
        return;
      }

      if (tab === 'login') {
        const res = await fetch('/api/v1/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            identifier: (username || email).trim(),
            password,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'اطلاعات ورود نادرست است');
        }

        const authenticatedUser: User = {
          id: data.user.id,
          name: data.user.name,
          username: data.user.username,
          avatarStyle: data.user.avatarStyle || 'cyber_neon',
          status: 'online',
          customStatus: data.user.customStatus || 'آماده بازی در کهکشان نکسوس 🌌',
          role: data.user.role || 'خلبان رسمی',
          roleColor: '#a855f7',
        };

        confetti({ particleCount: 100, spread: 80, origin: { y: 0.4 } });
        onLogin(authenticatedUser);
        onClose();
      } else {
        const res = await fetch('/api/v1/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: username.trim(),
            email: email.trim(),
            password,
            name: name.trim() || username.trim(),
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'خطا در ثبت‌نام حساب کاربری');
        }

        const registeredUser: User = {
          id: data.user.id,
          name: data.user.name,
          username: data.user.username,
          avatarStyle: 'matrix_hacker',
          status: 'online',
          customStatus: 'خلبان جدید مدار نکسوس 🎉',
          role: 'خلبان رسمی',
          roleColor: '#06b6d4',
        };

        confetti({ particleCount: 150, spread: 100, origin: { y: 0.4 } });
        onLogin(registeredUser);
        onClose();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'خطایی رخ داد');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-xl z-50 flex items-center justify-center p-4" dir="rtl">
      {/* Outer Glow Wrapper */}
      <div className="relative w-full max-w-md">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 rounded-[32px] blur-xl opacity-35 animate-pulse" />

        <div className="relative bg-[#0d0f1d]/95 rounded-[28px] shadow-2xl border border-white/15 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Top Banner & Header */}
          <div className="relative p-6 pb-4 border-b border-white/10 text-center overflow-hidden">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 left-4 w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-all border border-white/10"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Brand Logo & Icon */}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 mx-auto flex items-center justify-center text-white text-xl shadow-[0_0_25px_rgba(168,85,247,0.5)] mb-3">
              🌌
            </div>

            <h2 className="text-xl font-black text-white flex items-center justify-center gap-2">
              <span>{tab === 'login' ? 'ورود به کهکشان نکسوس' : tab === 'register' ? 'ثبت‌نام خلبان جدید' : 'بازیابی دسترسی مدار'}</span>
              <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              {tab === 'login'
                ? 'وارد پایگاه خود شوید و به سیارات بازی متصل گردید.'
                : tab === 'register'
                ? 'پروفایل گیمری خود را بسازید و وارد لابی‌های مسابقات شوید.'
                : 'ایمیل خود را جهت دریافت لینک بازیابی امن وارد کنید.'}
            </p>

            {/* Navigation Tabs (ورود / ثبت‌نام) */}
            <div className="flex rounded-xl bg-black/40 p-1 border border-white/10 mt-4">
              <button
                type="button"
                onClick={() => {
                  setTab('login');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  tab === 'login'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ورود به حساب
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab('register');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  tab === 'register'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ساخت حساب جدید
              </button>
            </div>
          </div>

          {/* Form Body */}
          <div className="p-6 pt-4">
            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-semibold flex items-center gap-2 mb-4 animate-in fade-in duration-150">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {tab === 'login' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <UserIcon className="w-3.5 h-3.5 text-purple-400" />
                      <span>نام کاربری یا ایمیل</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="مثال: gamer_pro یا email@site.com"
                        className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-purple-500 transition-all font-medium"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-purple-400" />
                        <span>رمز عبور</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setTab('forgot')}
                        className="text-[11px] text-cyan-400 hover:text-cyan-300 hover:underline font-medium"
                      >
                        رمز را فراموش کرده‌اید؟
                      </button>
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-purple-500 transition-all"
                      required
                    />
                  </div>
                </>
              )}

              {tab === 'register' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <UserIcon className="w-3.5 h-3.5 text-cyan-400" />
                      <span>نام نمایشی (فارسی یا انگلیسی)</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="مثال: ساشا اسموکر"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Gamepad2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>آیدی کاربری اختصاصی (انگلیسی)</span>
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="مثال: sasha_cs2"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-all font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-cyan-400" />
                      <span>ایمیل معتبر</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="player@nexus.gg"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-all font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>رمز عبور امن</span>
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="حداقل ۶ کاراکتر"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
                      required
                    />
                  </div>
                </>
              )}

              {tab === 'forgot' && (
                <div>
                  {resetSubmitted ? (
                    <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs text-center space-y-2">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                      <div className="font-bold">دستورالعمل بازیابی ارسال شد!</div>
                      <p className="text-[11px] text-emerald-200/80">
                        لینک تغییر رمز به ایمیل شما ارسال شد. لطفاً صندوق ورودی و هرزنامه خود را بررسی کنید.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-amber-400" />
                        <span>ایمیل حساب کاربری</span>
                      </label>
                      <input
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="your_email@domain.com"
                        className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-400 mb-3 font-mono"
                        required
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:opacity-90 text-white text-xs font-black transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] flex items-center justify-center gap-2 mt-4"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : tab === 'login' ? (
                  <>
                    <span>ورود به پایگاه و پرواز</span>
                    <ArrowRight className="w-4 h-4 rotate-180" />
                  </>
                ) : tab === 'register' ? (
                  <>
                    <span>ساخت اکانت و دریافت جایزه شروع</span>
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                  </>
                ) : (
                  <span>ارسال لینک بازیابی رمز</span>
                )}
              </button>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 pt-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>رمزنگاری محافظت‌شده Argon2id در سرورهای ابری نکسوس</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
