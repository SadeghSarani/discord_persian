'use client';

import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { User } from '@/types/discord';

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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-[#313338] w-full max-w-md rounded-[8px] shadow-2xl border border-[#232428] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Banner with Avatar Overlay */}
        <div className="h-24 bg-[#5865F2] relative">
          <button
            onClick={onClose}
            className="absolute left-3 top-3 w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute -bottom-8 right-5">
            <div className="relative">
              <div className="w-18 h-18 rounded-full bg-[#1e1f22] p-1">
                <div className="w-full h-full rounded-full bg-[#5865F2] flex items-center justify-center text-xl font-extrabold text-white">
                  {name.charAt(0)}
                </div>
              </div>
              <span className="absolute bottom-1 left-1 w-4 h-4 rounded-full bg-[#23a55a] border-2 border-[#1e1f22]" />
            </div>
          </div>
        </div>

        {/* Profile Details Container */}
        <div className="pt-10 px-5 pb-5">
          <div className="mb-4">
            <h3 className="text-base font-extrabold text-white">{name}</h3>
            <p className="text-xs text-[#949ba4]">@{username}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-[#b5bac1] uppercase tracking-wider mb-1.5">
                نام نمایشی
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-[4px] bg-[#1e1f22] border border-[#232428] text-white text-xs focus:outline-none focus:border-[#5865F2]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#b5bac1] uppercase tracking-wider mb-1.5">
                وضعیت سفارشی
              </label>
              <input
                type="text"
                value={customStatus}
                onChange={(e) => setCustomStatus(e.target.value)}
                placeholder="مثال: آنلاین در دیسکافه 🎮"
                className="w-full px-3 py-2 rounded-[4px] bg-[#1e1f22] border border-[#232428] text-white text-xs placeholder:text-[#80848e] focus:outline-none focus:border-[#5865F2]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#b5bac1] uppercase tracking-wider mb-1.5">
                در حال بازی
              </label>
              <input
                type="text"
                value={gameActivity}
                onChange={(e) => setGameActivity(e.target.value)}
                placeholder="مثال: Dota 2 یا Counter-Strike 2"
                className="w-full px-3 py-2 rounded-[4px] bg-[#1e1f22] border border-[#232428] text-white text-xs placeholder:text-[#80848e] focus:outline-none focus:border-[#5865F2]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#b5bac1] uppercase tracking-wider mb-1.5">
                وضعیت آنلاین
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setStatus('online')}
                  className={`p-2 rounded-[4px] text-xs font-bold flex items-center justify-center gap-1.5 border transition-colors ${
                    status === 'online'
                      ? 'bg-[#23a55a]/20 border-[#23a55a] text-white'
                      : 'bg-[#2b2d31] border-[#232428] text-[#949ba4]'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-[#23a55a]" />
                  <span>آنلاین</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className={`p-2 rounded-[4px] text-xs font-bold flex items-center justify-center gap-1.5 border transition-colors ${
                    status === 'idle'
                      ? 'bg-[#f0b232]/20 border-[#f0b232] text-white'
                      : 'bg-[#2b2d31] border-[#232428] text-[#949ba4]'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-[#f0b232]" />
                  <span>غایب</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('dnd')}
                  className={`p-2 rounded-[4px] text-xs font-bold flex items-center justify-center gap-1.5 border transition-colors ${
                    status === 'dnd'
                      ? 'bg-[#f23f43]/20 border-[#f23f43] text-white'
                      : 'bg-[#2b2d31] border-[#232428] text-[#949ba4]'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-[#f23f43]" />
                  <span>مزاحم نشوید</span>
                </button>
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
                className="px-4 py-1.5 rounded-[4px] bg-[#5865F2] hover:bg-[#4752c4] text-white text-xs font-bold transition-colors"
              >
                ذخیره تغییرات
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
