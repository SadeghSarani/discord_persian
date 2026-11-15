'use client';

import React, { useState } from 'react';
import { MomentCategory, MOMENT_CATEGORIES } from '@/types/moments';
import { X, Plus } from 'lucide-react';

interface CreateMomentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (moment: any) => void;
}

export default function CreateMomentModal({
  isOpen,
  onClose,
  onCreated,
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
      setError('عنوان دورهمی الزامی است');
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
          creatorId: 'user_me',
        }),
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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-[#313338] w-full max-w-md rounded-[8px] shadow-2xl border border-[#232428] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-[#2b2d31] flex items-center justify-between">
          <h3 className="text-base font-extrabold text-white">ساخت دورهمی جدید</h3>
          <button
            onClick={onClose}
            className="text-[#949ba4] hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5">
          {error && (
            <div className="p-2.5 rounded-[4px] bg-[#f23f43]/15 text-[#f23f43] text-xs font-semibold">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#b5bac1] uppercase tracking-wider mb-1.5">
              عنوان دورهمی *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: کاستوم لابی دوتا ۲ یا والورانت"
              className="w-full px-3 py-2 rounded-[4px] bg-[#1e1f22] border border-[#232428] text-white text-xs placeholder:text-[#80848e] focus:outline-none focus:border-[#5865F2]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#b5bac1] uppercase tracking-wider mb-1.5">
              توضیحات کوتاه
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="درباره لابی، رنک یا بازی توضیح بدید..."
              className="w-full px-3 py-2 rounded-[4px] bg-[#1e1f22] border border-[#232428] text-white text-xs placeholder:text-[#80848e] focus:outline-none focus:border-[#5865F2] resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#b5bac1] uppercase tracking-wider mb-1.5">
              دسته‌بندی موضوعی
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {MOMENT_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`p-2 rounded-[4px] border text-xs font-bold flex items-center justify-center gap-1 transition-colors ${
                    category === cat.id
                      ? 'bg-[#5865F2] border-[#5865F2] text-white'
                      : 'bg-[#2b2d31] border-[#232428] text-[#949ba4] hover:bg-[#35373c] hover:text-[#dbdee1]'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span className="truncate">{cat.nameFa}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#b5bac1] uppercase tracking-wider mb-1.5">
                ظرفیت ({capacity} نفر)
              </label>
              <input
                type="range"
                min="2"
                max="25"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full accent-[#5865F2] cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#b5bac1] uppercase tracking-wider mb-1.5">
                مدت زمان
              </label>
              <select
                value={durationHours}
                onChange={(e) => setDurationHours(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded-[4px] bg-[#1e1f22] border border-[#232428] text-white text-xs focus:outline-none focus:border-[#5865F2]"
              >
                <option value={1}>۱ ساعت</option>
                <option value={2}>۲ ساعت</option>
                <option value={4}>۴ ساعت</option>
                <option value={8}>۸ ساعت</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#2b2d31]">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-[4px] hover:underline text-xs text-white"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 rounded-[4px] bg-[#5865F2] hover:bg-[#4752c4] text-white text-xs font-bold transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'در حال ایجاد...' : 'ساخت دورهمی'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
