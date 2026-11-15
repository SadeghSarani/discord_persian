'use client';

import React, { useState } from 'react';
import { X, Hash, Volume2, Plus } from 'lucide-react';
import { fa } from '@/lib/i18n/fa';

interface CreateChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, type: 'text' | 'voice', categoryId: string) => void;
  categories: { id: string; name: string }[];
}

export const CreateChannelModal: React.FC<CreateChannelModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  categories,
}) => {
  const [channelName, setChannelName] = useState('');
  const [type, setType] = useState<'text' | 'voice'>('text');
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!channelName.trim()) return;
    const formattedName = channelName.trim().replace(/\s+/g, '-');
    onCreate(formattedName, type, selectedCategory);
    setChannelName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-[var(--nexus-sidebar)] w-full max-w-md rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-[var(--nexus-border)] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 flex items-center justify-between border-b border-[var(--nexus-border)] bg-[var(--nexus-surface)]/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[var(--nexus-primary)] to-[var(--nexus-accent)] flex items-center justify-center text-white shadow-sm font-bold text-sm">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">{fa.communities.createChannel}</h3>
              <p className="text-[11px] text-[var(--nexus-text-muted)]">ایجاد کانال صوتی یا متنی جدید</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[var(--nexus-text-muted)] hover:text-white transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-bold text-[var(--nexus-text-muted)] block mb-2">
              نوع کانال
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType('text')}
                className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all text-xs font-bold ${
                  type === 'text'
                    ? 'bg-[var(--nexus-surface-elevated)] border-[var(--nexus-primary)] text-white shadow-sm'
                    : 'bg-[var(--nexus-surface)] border-[var(--nexus-border)] text-[var(--nexus-text-muted)] hover:text-white'
                }`}
              >
                <Hash className="w-4 h-4 text-[var(--nexus-primary-light)]" />
                <span>{fa.communities.channels.text}</span>
              </button>

              <button
                type="button"
                onClick={() => setType('voice')}
                className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all text-xs font-bold ${
                  type === 'voice'
                    ? 'bg-[var(--nexus-surface-elevated)] border-[var(--nexus-accent)] text-white shadow-sm'
                    : 'bg-[var(--nexus-surface)] border-[var(--nexus-border)] text-[var(--nexus-text-muted)] hover:text-white'
                }`}
              >
                <Volume2 className="w-4 h-4 text-[var(--nexus-accent)]" />
                <span>{fa.communities.channels.voice}</span>
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[var(--nexus-text-muted)] block mb-1.5">
              نام کانال
            </label>
            <input
              type="text"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              placeholder="مثال: گفتگو-عمومی"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--nexus-surface)] border border-[var(--nexus-border)] text-white text-xs placeholder:text-[var(--nexus-text-dim)] focus:outline-none focus:border-[var(--nexus-primary)] transition-all font-medium"
              required
            />
          </div>

          {categories.length > 0 && (
            <div>
              <label className="text-xs font-bold text-[var(--nexus-text-muted)] block mb-1.5">
                دسته‌بندی والد
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--nexus-surface)] border border-[var(--nexus-border)] text-white text-xs focus:outline-none focus:border-[var(--nexus-primary)] cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

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
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[var(--nexus-primary)] to-[var(--nexus-primary-dark)] hover:opacity-95 text-white text-xs font-bold shadow-[0_0_15px_rgba(139,92,246,0.35)] transition-all"
            >
              {fa.common.actions.create}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
