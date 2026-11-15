'use client';

import React from 'react';
import { MomentItem, MOMENT_CATEGORIES } from '@/types/moments';
import { Clock, Users, Flame, ArrowLeft, Check } from 'lucide-react';

interface MomentCardProps {
  moment: MomentItem;
  currentUserId?: string;
  onJoin?: (id: string) => void;
  onLeave?: (id: string) => void;
  onClick?: (moment: MomentItem) => void;
}

export default function MomentCard({
  moment,
  currentUserId = 'user_me',
  onJoin,
  onLeave,
  onClick,
}: MomentCardProps) {
  const participants = moment.participants || [];
  const categoryMeta = MOMENT_CATEGORIES.find((c) => c.id === moment.category) || {
    id: 'Other' as const,
    nameFa: moment.category,
    icon: '⚡',
  };

  const isJoined = participants.some((p) => p.userId === currentUserId);
  const isFull = moment.participantCount >= moment.capacity;

  const capacityPercent = Math.min(
    100,
    Math.round((moment.participantCount / Math.max(1, moment.capacity)) * 100)
  );

  const now = new Date();
  const expiresAt = new Date(moment.expiresAt);
  const diffMinutes = Math.max(0, Math.floor((expiresAt.getTime() - now.getTime()) / 60000));
  const diffHours = Math.floor(diffMinutes / 60);
  const remMinutes = diffMinutes % 60;
  const timeString =
    diffHours > 0 ? `${diffHours} ساعت و ${remMinutes} دقیقه` : `${remMinutes} دقیقه`;

  return (
    <div
      onClick={() => onClick?.(moment)}
      className="group relative flex flex-col justify-between rounded-[8px] bg-[#2b2d31] hover:bg-[#35373c] border border-[#1f2023] p-4 transition-all duration-150 cursor-pointer text-right shadow-sm"
      dir="rtl"
    >
      <div>
        {/* Header Tag & Time */}
        <div className="flex items-center justify-between mb-2.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] text-xs font-semibold bg-[#1e1f22] text-[#dbdee1]">
            <span>{categoryMeta.icon}</span>
            <span>{categoryMeta.nameFa}</span>
          </span>

          <span className="inline-flex items-center gap-1 text-[11px] text-[#949ba4] font-medium">
            <Clock className="w-3.5 h-3.5 text-[#80848e]" />
            <span>{timeString}</span>
          </span>
        </div>

        {/* Title & Desc */}
        <div className="mb-3">
          <h3 className="text-sm font-bold text-white mb-1 line-clamp-1 group-hover:text-[#5865F2] transition-colors">
            {moment.title}
          </h3>
          {moment.description && (
            <p className="text-xs text-[#949ba4] line-clamp-2 leading-relaxed">
              {moment.description}
            </p>
          )}
        </div>
      </div>

      <div>
        {/* Capacity Indicator */}
        <div className="space-y-1.5 mb-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#949ba4] flex items-center gap-1 font-medium">
              <Users className="w-3.5 h-3.5" />
              <span>ظرفیت</span>
            </span>
            <span className="font-bold text-white">
              {moment.participantCount} / {moment.capacity} نفر
            </span>
          </div>

          <div className="w-full h-1.5 bg-[#1e1f22] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isFull ? 'bg-[#f23f43]' : 'bg-[#23a55a]'
              }`}
              style={{ width: `${capacityPercent}%` }}
            />
          </div>
        </div>

        {/* Card Footer: Creator & Actions */}
        <div className="flex items-center justify-between pt-2.5 border-t border-[#35363c]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#5865F2] flex items-center justify-center text-[10px] font-bold text-white">
              {moment.creator?.name ? moment.creator.name.charAt(0) : 'U'}
            </div>
            <span className="text-xs text-[#949ba4] truncate max-w-[100px]">
              {moment.creator?.name || 'میزبان'}
            </span>
          </div>

          <div>
            {isJoined ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onLeave?.(moment.id);
                }}
                className="px-2.5 py-1 rounded-[4px] bg-[#23a55a]/15 hover:bg-[#f23f43]/20 text-[#23a55a] hover:text-[#f23f43] text-xs font-bold transition-colors flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>عضو هستید</span>
              </button>
            ) : isFull ? (
              <span className="px-2.5 py-1 rounded-[4px] bg-[#1e1f22] text-[#80848e] text-xs font-medium">
                تکمیل ظرفیت
              </span>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onJoin?.(moment.id);
                }}
                className="px-3 py-1 rounded-[4px] bg-[#5865F2] hover:bg-[#4752c4] text-white text-xs font-bold transition-colors flex items-center gap-1"
              >
                <span>پیوستن</span>
                <ArrowLeft className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
