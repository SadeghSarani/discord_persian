'use client';

import React, { useState } from 'react';
import { MomentCategory, MOMENT_CATEGORIES } from '@/types/moments';
import { fa } from '@/lib/i18n/fa';
import { X, Sparkles, Clock, Users, Flame, Plus } from 'lucide-react';

interface CreateMomentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (moment: any) => void;
}

export default function CreateMomentModal({
  isOpen,
  onClose,
  onCreated
}: CreateMomentModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<MomentCategory>('Gaming');
  const [capacity, setCapacity] = useState(6);
  const [durationHours, setDurationHours] = useState(2);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError(fa.moments.form.titlePlaceholder);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/v1/moments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          category,
          capacity: Number(capacity),
          durationHours: Number(durationHours),
          creatorId: 'user_me'
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'خطا در ثبت رویداد');
      }

      onCreated(data);
      onClose();
      setTitle('');
      setDescription('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-[var(--nexus-sidebar)] w-full max-w-lg rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-[var(--nexus-border)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-[var(--nexus-border)] flex items-center justify-between bg-[var(--nexus-surface)]/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[var(--nexus-primary)] to-[var(--nexus-accent)] flex items-center justify-center text-white shadow-sm">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">{fa.moments.create}</h3>
              <p className="text-xs text-[var(--nexus-text-muted)]">دورهمی گذرا برای بازی، گفتگو و همکاری</p>
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
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[var(--nexus-text-muted)] mb-1.5">
              {fa.moments.form.title} *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={fa.moments.form.titlePlaceholder}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--nexus-surface)] border border-[var(--nexus-border)] text-white text-xs placeholder:text-[var(--nexus-text-dim)] focus:outline-none focus:border-[var(--nexus-primary)] transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--nexus-text-muted)] mb-1.5">
              {fa.moments.form.description}
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={fa.moments.form.descriptionPlaceholder}
              className="w-full px-3.5 py-2 rounded-xl bg-[var(--nexus-surface)] border border-[var(--nexus-border)] text-white text-xs placeholder:text-[var(--nexus-text-dim)] focus:outline-none focus:border-[var(--nexus-primary)] transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--nexus-text-muted)] mb-2">
              {fa.moments.form.category}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {MOMENT_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    category === cat.id
                      ? 'bg-[var(--nexus-primary)]/15 border-[var(--nexus-primary)] text-white shadow-sm'
                      : 'bg-[var(--nexus-surface)] border-[var(--nexus-border)] text-[var(--nexus-text-muted)] hover:text-white hover:bg-[var(--nexus-surface-elevated)]'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.nameFa}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-bold text-[var(--nexus-text-muted)] mb-1.5">
                {fa.moments.form.capacity} ({capacity} نفر)
              </label>
              <input
                type="range"
                min="2"
                max="25"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full accent-[var(--nexus-primary)] cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--nexus-text-muted)] mb-1.5">
                {fa.moments.form.duration} ({durationHours} ساعت)
              </label>
              <select
                value={durationHours}
                onChange={(e) => setDurationHours(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-[var(--nexus-surface)] border border-[var(--nexus-border)] text-white text-xs focus:outline-none focus:border-[var(--nexus-primary)]"
              >
                <option value={1}>۱ ساعت</option>
                <option value={2}>۲ ساعت</option>
                <option value={4}>۴ ساعت</option>
                <option value={8}>۸ ساعت</option>
                <option value={24}>۲۴ ساعت (یک شبانه‌روز)</option>
              </select>
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
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[var(--nexus-primary)] to-[var(--nexus-primary-dark)] hover:opacity-95 text-white text-xs font-bold shadow-[0_0_15px_rgba(139,92,246,0.35)] transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? fa.common.status.loading : fa.common.actions.create}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
