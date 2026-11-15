'use client';

import React, { useState } from 'react';
import { X, LogIn, UserPlus, KeyRound, ArrowRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { User } from '@/types/discord';
import { fa } from '@/lib/i18n/fa';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
}

type AuthTab = 'login' | 'register' | 'forgot';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
}) => {
  const [tab, setTab] = useState<AuthTab>('login');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Loading & error states
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Forgot Password fields
  const [resetEmail, setResetEmail] = useState('');
  const [resetSubmitted, setResetSubmitted] = useState(false);
  const [generatedResetToken, setGeneratedResetToken] = useState<string | null>(null);

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
        if (data.resetToken) {
          setGeneratedResetToken(data.resetToken);
        }
        setResetSubmitted(true);
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
          avatarStyle: data.user.avatarStyle || 'golden_king',
          status: 'online',
          customStatus: data.user.customStatus || 'آنلاین در نکسوس 🎮',
          role: data.user.role || 'عضو رسمی',
          roleColor: '#8b5cf6',
        };

        onLogin(authenticatedUser);
        onClose();
      } else {
        // Register flow
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
          avatarStyle: 'golden_king',
          status: 'online',
          customStatus: 'عضو جدید نکسوس 🎉',
          role: 'عضو رسمی',
          roleColor: '#8b5cf6',
        };

        onLogin(registeredUser);
        onClose();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'خطای غیرمنتظره‌ای رخ داد');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-[var(--nexus-sidebar)] w-full max-w-md rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-[var(--nexus-border)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-[var(--nexus-border)] flex items-center justify-between bg-[var(--nexus-surface)]/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[var(--nexus-primary)] to-[var(--nexus-accent)] flex items-center justify-center text-white shadow-sm font-bold text-sm">
              N
            </div>
            <div>
              <h3 className="text-sm font-black text-white">
                {tab === 'login' ? fa.auth.login : tab === 'register' ? fa.auth.register : fa.auth.forgotPassword}
              </h3>
              <p className="text-[11px] text-[var(--nexus-text-muted)]">
                ورود به حساب کاربری نکسوس
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-[var(--nexus-surface)] hover:bg-[var(--nexus-surface-elevated)] border border-[var(--nexus-border)] flex items-center justify-center text-[var(--nexus-text-muted)] hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="p-2 bg-[var(--nexus-surface)]/40 border-b border-[var(--nexus-border)] flex items-center gap-1">
          <button
            onClick={() => {
              setTab('login');
              setErrorMessage(null);
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              tab === 'login'
                ? 'bg-[var(--nexus-surface-elevated)] text-white border border-[var(--nexus-border-glow)]'
                : 'text-[var(--nexus-text-muted)] hover:text-white'
            }`}
          >
            {fa.auth.login}
          </button>
          <button
            onClick={() => {
              setTab('register');
              setErrorMessage(null);
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              tab === 'register'
                ? 'bg-[var(--nexus-surface-elevated)] text-white border border-[var(--nexus-border-glow)]'
                : 'text-[var(--nexus-text-muted)] hover:text-white'
            }`}
          >
            {fa.auth.register}
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {tab === 'login' && (
            <>
              <div>
                <label className="block text-xs font-bold text-[var(--nexus-text-muted)] mb-1.5">
                  نام کاربری یا ایمیل
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="username یا email@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--nexus-surface)] border border-[var(--nexus-border)] text-white text-xs placeholder:text-[var(--nexus-text-dim)] focus:outline-none focus:border-[var(--nexus-primary)] transition-all font-mono"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[var(--nexus-text-muted)]">
                    {fa.auth.password}
                  </label>
                  <button
                    type="button"
                    onClick={() => setTab('forgot')}
                    className="text-[11px] text-[var(--nexus-accent)] hover:underline font-medium"
                  >
                    {fa.auth.forgotPassword}؟
                  </button>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--nexus-surface)] border border-[var(--nexus-border)] text-white text-xs placeholder:text-[var(--nexus-text-dim)] focus:outline-none focus:border-[var(--nexus-primary)] transition-all"
                  required
                />
              </div>
            </>
          )}

          {tab === 'register' && (
            <>
              <div>
                <label className="block text-xs font-bold text-[var(--nexus-text-muted)] mb-1.5">
                  نام و نام خانوادگی
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: رضا محمدی"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--nexus-surface)] border border-[var(--nexus-border)] text-white text-xs placeholder:text-[var(--nexus-text-dim)] focus:outline-none focus:border-[var(--nexus-primary)] transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--nexus-text-muted)] mb-1.5">
                  {fa.auth.username} (لاتین)
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="reza_gamer"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--nexus-surface)] border border-[var(--nexus-border)] text-white text-xs placeholder:text-[var(--nexus-text-dim)] focus:outline-none focus:border-[var(--nexus-primary)] transition-all font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--nexus-text-muted)] mb-1.5">
                  {fa.auth.email}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--nexus-surface)] border border-[var(--nexus-border)] text-white text-xs placeholder:text-[var(--nexus-text-dim)] focus:outline-none focus:border-[var(--nexus-primary)] transition-all font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--nexus-text-muted)] mb-1.5">
                  {fa.auth.password}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="حداقل ۶ کاراکتر"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--nexus-surface)] border border-[var(--nexus-border)] text-white text-xs placeholder:text-[var(--nexus-text-dim)] focus:outline-none focus:border-[var(--nexus-primary)] transition-all"
                  required
                />
              </div>
            </>
          )}

          {tab === 'forgot' && (
            <div>
              {resetSubmitted ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs text-center space-y-2">
                  <CheckCircle2 className="w-6 h-6 mx-auto text-emerald-400" />
                  <p className="font-bold">لینک بازیابی ارسال شد</p>
                  <p className="text-[11px] text-[var(--nexus-text-muted)]">
                    در صورت تطابق ایمیل، راهنمای بازنشانی رمز عبور ارسال گردید.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setTab('login');
                      setResetSubmitted(false);
                    }}
                    className="mt-2 text-xs text-[var(--nexus-accent)] underline block mx-auto"
                  >
                    بازگشت به صفحه ورود
                  </button>
                </div>
              ) : (
                <>
                  <label className="block text-xs font-bold text-[var(--nexus-text-muted)] mb-1.5">
                    ایمیل حساب کاربری
                  </label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--nexus-surface)] border border-[var(--nexus-border)] text-white text-xs placeholder:text-[var(--nexus-text-dim)] focus:outline-none focus:border-[var(--nexus-primary)] transition-all font-mono mb-4"
                    required
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-xl bg-[var(--nexus-primary)] hover:bg-[var(--nexus-primary-light)] text-white text-xs font-bold transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'ارسال لینک بازیابی'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTab('login')}
                    className="mt-3 text-xs text-[var(--nexus-text-muted)] hover:text-white block mx-auto"
                  >
                    انصراف و بازگشت
                  </button>
                </>
              )}
            </div>
          )}

          {tab !== 'forgot' && (
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[var(--nexus-primary)] to-[var(--nexus-primary-dark)] hover:opacity-95 text-white text-xs font-bold shadow-[0_0_15px_rgba(139,92,246,0.35)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <span>{tab === 'login' ? fa.auth.login : fa.auth.register}</span>
              )}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};
