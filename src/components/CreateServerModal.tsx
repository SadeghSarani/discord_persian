'use client';

import React, { useState } from 'react';
import { X, Sparkles, Plus } from 'lucide-react';
import { Server } from '@/types/discord';
import { fa } from '@/lib/i18n/fa';

interface CreateServerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (server: Server) => void;
}

export const CreateServerModal: React.FC<CreateServerModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [serverName, setServerName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🔥');

  if (!isOpen) return null;

  const emojis = ['🎮', '🔥', '⚡', '💣', '🏆', '👾', '🚀', '👑', '🎯', '🦁'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serverName.trim()) return;

    const newServer: Server = {
      id: `server_${Date.now()}`,
      name: serverName.trim(),
      icon: selectedEmoji,
      acronym: serverName.trim().slice(0, 3),
      description: description.trim() || 'جامعه گیمری جدید نکسوس',
      membersCount: 1,
      categories: [
        {
          id: `cat_welcome_${Date.now()}`,
          name: '📌 اطلاعات و قوانین',
          channels: [
            { id: `ch_rules_${Date.now()}`, name: 'قوانین', type: 'text' },
            { id: `ch_welcome_${Date.now()}`, name: 'خوش‌آمدید', type: 'text' },
          ],
        },
        {
          id: `cat_general_${Date.now()}`,
          name: '💬 کانال‌های گفتگو',
          channels: [
            { id: `ch_general_${Date.now()}`, name: 'گفتگوی-عمومی', type: 'text' },
          ],
        },
        {
          id: `cat_voice_${Date.now()}`,
          name: '🎙️ کانال‌های صوتی',
          channels: [
            { id: `ch_voice_main_${Date.now()}`, name: 'اتاق صوتی اصلی', type: 'voice' },
          ],
        },
      ],
    };

    onCreate(newServer);
    setServerName('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-[var(--nexus-sidebar)] w-full max-w-md rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-[var(--nexus-border)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5 flex items-center justify-between border-b border-[var(--nexus-border)] bg-[var(--nexus-surface)]/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[var(--nexus-primary)] to-[var(--nexus-accent)] flex items-center justify-center text-white shadow-sm font-bold text-sm">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">{fa.communities.create}</h3>
              <p className="text-[11px] text-[var(--nexus-text-muted)]">ساخت جامعه و سرور جدید برای اعضا</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[var(--nexus-text-muted)] hover:text-white transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-bold text-[var(--nexus-text-muted)] block mb-1.5">
              نام انجمن *
            </label>
            <input
              type="text"
              value={serverName}
              onChange={(e) => setServerName(e.target.value)}
              placeholder="مثال: کلاب گیمرهای وارزون"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--nexus-surface)] border border-[var(--nexus-border)] text-white text-xs placeholder:text-[var(--nexus-text-dim)] focus:outline-none focus:border-[var(--nexus-primary)] transition-all font-medium"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[var(--nexus-text-muted)] block mb-1.5">
              توضیحات کوتاه
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="درباره فعالیت‌ها، قوانین یا بازی‌های مورد علاقه انجمن بنویسید..."
              className="w-full px-3.5 py-2 rounded-xl bg-[var(--nexus-surface)] border border-[var(--nexus-border)] text-white text-xs placeholder:text-[var(--nexus-text-dim)] focus:outline-none focus:border-[var(--nexus-primary)] transition-all resize-none font-medium"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[var(--nexus-text-muted)] block mb-2">
              آیکون یا نشان
            </label>
            <div className="flex flex-wrap gap-2">
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setSelectedEmoji(emoji)}
                  className={`w-9 h-9 rounded-xl border flex items-center justify-center text-base transition-all ${
                    selectedEmoji === emoji
                      ? 'bg-[var(--nexus-surface-elevated)] border-[var(--nexus-accent)] shadow-sm scale-110'
                      : 'bg-[var(--nexus-surface)] border-[var(--nexus-border)] hover:bg-[var(--nexus-surface-elevated)]'
                  }`}
                >
                  {emoji}
                </button>
              ))}
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
