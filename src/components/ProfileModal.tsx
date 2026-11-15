'use client';

import React, { useState } from 'react';
import { X, Sparkles, User as UserIcon, Tag, Gamepad2, Check, Shield } from 'lucide-react';
import { User } from '@/types/discord';
import { fa } from '@/lib/i18n/fa';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onUpdateUser: (updated: Partial<User>) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
}) => {
  const [name, setName] = useState(currentUser.name);
  const [username, setUsername] = useState(currentUser.username);
  const [customStatus, setCustomStatus] = useState(currentUser.customStatus || '');
  const [gameActivity, setGameActivity] = useState(currentUser.gameActivity || '');
  const [status, setStatus] = useState<User['status']>(currentUser.status);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      name: name.trim() || currentUser.name,
      username: username.trim() || currentUser.username,
      customStatus: customStatus.trim(),
      gameActivity: gameActivity.trim(),
      status,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-[var(--nexus-sidebar)] w-full max-w-lg rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-[var(--nexus-border)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-5 border-b border-[var(--nexus-border)] flex items-center justify-between bg-[var(--nexus-surface)]/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[var(--nexus-primary)] to-[var(--nexus-accent)] flex items-center justify-center text-white shadow-sm">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">{fa.profile.title}</h3>
              <p className="text-xs text-[var(--nexus-text-muted)]">مدیریت اطلاعات و تنظیمات کاربری</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[var(--nexus-surface)] hover:bg-[var(--nexus-surface-elevated)] border border-[var(--nexus-border)] flex items-center justify-center text-[var(--nexus-text-muted)] hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Avatar Preview */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-[var(--nexus-surface)] border border-[var(--nexus-border)]">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[var(--nexus-primary)] to-[var(--nexus-accent)] flex items-center justify-center text-xl font-black text-white shadow-md">
              {name.charAt(0) || 'U'}
            </div>
            <div>
              <div className="text-sm font-bold text-white">{name || 'نام کاربری'}</div>
              <div className="text-xs text-[var(--nexus-accent)] font-medium">@{username || 'username'}</div>
              <div className="text-[11px] text-[var(--nexus-text-muted)] mt-0.5">
                {customStatus || 'آماده برای گفتگو و بازی 🎮'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[var(--nexus-text-muted)] mb-1.5">
                {fa.profile.displayName}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--nexus-surface)] border border-[var(--nexus-border)] text-white text-xs placeholder:text-[var(--nexus-text-dim)] focus:outline-none focus:border-[var(--nexus-primary)] transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--nexus-text-muted)] mb-1.5">
                {fa.profile.username}
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--nexus-surface)] border border-[var(--nexus-border)] text-white text-xs placeholder:text-[var(--nexus-text-dim)] focus:outline-none focus:border-[var(--nexus-primary)] transition-all font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--nexus-text-muted)] mb-1.5">
              {fa.profile.statusMessage}
            </label>
            <input
              type="text"
              value={customStatus}
              onChange={(e) => setCustomStatus(e.target.value)}
              placeholder="مثال: در حال بازی Valorant 🎮"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--nexus-surface)] border border-[var(--nexus-border)] text-white text-xs placeholder:text-[var(--nexus-text-dim)] focus:outline-none focus:border-[var(--nexus-primary)] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--nexus-text-muted)] mb-1.5">
              {fa.profile.statusOnline}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setStatus('online')}
                className={`p-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                  status === 'online'
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                    : 'bg-[var(--nexus-surface)] border-[var(--nexus-border)] text-[var(--nexus-text-muted)]'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>{fa.profile.statusOnline}</span>
              </button>
              <button
                type="button"
                onClick={() => setStatus('idle')}
                className={`p-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                  status === 'idle'
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                    : 'bg-[var(--nexus-surface)] border-[var(--nexus-border)] text-[var(--nexus-text-muted)]'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>{fa.profile.statusIdle}</span>
              </button>
              <button
                type="button"
                onClick={() => setStatus('dnd')}
                className={`p-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                  status === 'dnd'
                    ? 'bg-rose-500/15 border-rose-500/40 text-rose-400'
                    : 'bg-[var(--nexus-surface)] border-[var(--nexus-border)] text-[var(--nexus-text-muted)]'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                <span>{fa.profile.statusDnd}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[var(--nexus-border)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[var(--nexus-surface)] hover:bg-[var(--nexus-surface-elevated)] border border-[var(--nexus-border)] text-xs text-[var(--nexus-text-muted)] hover:text-white transition-all font-medium"
            >
              {fa.common.actions.cancel}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[var(--nexus-primary)] to-[var(--nexus-primary-dark)] hover:opacity-95 text-white text-xs font-bold shadow-[0_0_15px_rgba(139,92,246,0.35)] transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{fa.common.actions.save}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
