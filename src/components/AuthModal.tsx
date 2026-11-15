'use client';

import React, { useState } from 'react';
import { X, AlertCircle, Loader2 } from 'lucide-react';
import { User } from '@/types/discord';

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
          customStatus: data.user.customStatus || 'آنلاین در دیسکافه 🎮',
          role: data.user.role || 'عضو رسمی',
          roleColor: '#5865F2',
        };

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
          avatarStyle: 'golden_king',
          status: 'online',
          customStatus: 'عضو جدید دیسکافه 🎉',
          role: 'عضو رسمی',
          roleColor: '#5865F2',
        };

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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-[#313338] w-full max-w-md rounded-[8px] shadow-2xl border border-[#232428] overflow-hidden animate-in fade-in zoom-in-95 duration-150 p-6">
        <div className="text-center mb-5">
          <h2 className="text-xl font-extrabold text-white mb-1">
            {tab === 'login' ? 'خوش آمدید!' : tab === 'register' ? 'ساخت حساب کاربری' : 'بازیابی رمز عبور'}
          </h2>
          <p className="text-xs text-[#949ba4]">
            {tab === 'login'
              ? 'از دیدن دوباره شما خیلی خوشحالیم!'
              : tab === 'register'
              ? 'به جمع گیمرهای ایرانی دیسکافه بپیوندید.'
              : 'ایمیل خود را جهت دریافت لینک بازنشانی وارد نمایید.'}
          </p>
        </div>

        {errorMessage && (
          <div className="p-2.5 rounded-[4px] bg-[#f23f43]/15 text-[#f23f43] text-xs font-semibold flex items-center gap-2 mb-4">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'login' && (
            <>
              <div>
                <label className="block text-xs font-bold text-[#b5bac1] uppercase tracking-wider mb-1.5">
                  ایمیل یا نام کاربری *
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 rounded-[4px] bg-[#1e1f22] border border-[#232428] text-white text-xs focus:outline-none focus:border-[#5865F2]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#b5bac1] uppercase tracking-wider mb-1.5">
                  رمز عبور *
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-[4px] bg-[#1e1f22] border border-[#232428] text-white text-xs focus:outline-none focus:border-[#5865F2]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setTab('forgot')}
                  className="text-xs text-[#00a8fc] hover:underline mt-1.5 block font-medium"
                >
                  رمز عبور خود را فراموش کرده‌اید؟
                </button>
              </div>
            </>
          )}

          {tab === 'register' && (
            <>
              <div>
                <label className="block text-xs font-bold text-[#b5bac1] uppercase tracking-wider mb-1.5">
                  نام نمایشی
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-[4px] bg-[#1e1f22] border border-[#232428] text-white text-xs focus:outline-none focus:border-[#5865F2]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#b5bac1] uppercase tracking-wider mb-1.5">
                  نام کاربری (لاتین) *
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 rounded-[4px] bg-[#1e1f22] border border-[#232428] text-white text-xs focus:outline-none focus:border-[#5865F2] font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#b5bac1] uppercase tracking-wider mb-1.5">
                  ایمیل *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-[4px] bg-[#1e1f22] border border-[#232428] text-white text-xs focus:outline-none focus:border-[#5865F2] font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#b5bac1] uppercase tracking-wider mb-1.5">
                  رمز عبور *
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-[4px] bg-[#1e1f22] border border-[#232428] text-white text-xs focus:outline-none focus:border-[#5865F2]"
                  required
                />
              </div>
            </>
          )}

          {tab === 'forgot' && (
            <div>
              {resetSubmitted ? (
                <div className="p-3 rounded-[4px] bg-[#23a55a]/15 text-[#23a55a] text-xs text-center mb-3">
                  لینک بازیابی رمز ارسال شد. ایمیل خود را بررسی کنید.
                </div>
              ) : (
                <>
                  <label className="block text-xs font-bold text-[#b5bac1] uppercase tracking-wider mb-1.5">
                    ایمیل حساب کاربری
                  </label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-[4px] bg-[#1e1f22] border border-[#232428] text-white text-xs focus:outline-none focus:border-[#5865F2] mb-3"
                    required
                  />
                </>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-[4px] bg-[#5865F2] hover:bg-[#4752c4] text-white text-xs font-bold transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : tab === 'login' ? (
              'ورود به حساب'
            ) : tab === 'register' ? (
              'ادامه و ثبت‌نام'
            ) : (
              'ارسال لینک'
            )}
          </button>

          <div className="text-center pt-2 text-xs text-[#949ba4]">
            {tab === 'login' ? (
              <p>
                حساب کاربری ندارید؟{' '}
                <button
                  type="button"
                  onClick={() => setTab('register')}
                  className="text-[#00a8fc] hover:underline font-bold"
                >
                  ثبت‌نام کنید
                </button>
              </p>
            ) : (
              <p>
                قبلاً ثبت‌نام کرده‌اید؟{' '}
                <button
                  type="button"
                  onClick={() => setTab('login')}
                  className="text-[#00a8fc] hover:underline font-bold"
                >
                  ورود به حساب
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
