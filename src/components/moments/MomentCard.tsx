'use client';

import React from 'react';
import { MomentItem, MOMENT_CATEGORIES } from '@/types/moments';
import GamerAvatar from '@/components/GamerAvatar';
import { fa } from '@/lib/i18n/fa';
import { Clock, Users, Flame, ArrowLeft, Check, Sparkles } from 'lucide-react';

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
  onClick
}: MomentCardProps) {
  const participants = moment.participants || [];
  const categoryMeta = MOMENT_CATEGORIES.find((c) => c.id === moment.category) || {
    id: 'Other' as const,
    nameFa: moment.category,
    icon: '⚡'
  };

  const isJoined = participants.some((p) => p.userId === currentUserId);
  const isFull = moment.participantCount >= moment.capacity;

  const capacityPercent = Math.min(
    100,
    Math.round((moment.participantCount / Math.max(1, moment.capacity)) * 100)
  );

  // Time remaining calculation in Persian
  const now = new Date();
  const expiresAt = new Date(moment.expiresAt);
  const diffMinutes = Math.max(0, Math.floor((expiresAt.getTime() - now.getTime()) / 60000));
  const diffHours = Math.floor(diffMinutes / 60);
  const remMinutes = diffMinutes % 60;
  const timeString = diffHours > 0 ? `${diffHours} ساعت و ${remMinutes} دقیقه` : `${remMinutes} دقیقه`;

  return (
    <div
      onClick={() => onClick?.(moment)}
      className="group relative flex flex-col justify-between rounded-2xl bg-[var(--nexus-surface)] border border-[var(--nexus-border)] p-5 hover:border-[var(--nexus-border-glow)] hover:bg-[var(--nexus-surface-elevated)]/90 transition-all duration-300 cursor-pointer overflow-hidden text-right shadow-sm hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
      dir="rtl"
    >
      {/* Subtle Linear-style corner glow */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--nexus-primary)]/10 rounded-full blur-3xl pointer-events-none transition-opacity duration-300 group-hover:opacity-40" />

      <div>
        {/* Header: Category Badge & Status */}
        <div className="flex items-center justify-between mb-3 z-10 relative">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--nexus-surface-elevated)] text-[var(--nexus-text-muted)] border border-[var(--nexus-border)] group-hover:border-[var(--nexus-border-glow)] group-hover:text-white transition-all">
            <span>{categoryMeta.icon}</span>
            <span>{categoryMeta.nameFa}</span>
          </span>

          <div className="flex items-center gap-2">
            {(moment.status === 'live' || (moment.status as any) === 'ACTIVE') && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {fa.common.status.live}
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-[11px] text-[var(--nexus-text-muted)] font-medium">
              <Clock className="w-3.5 h-3.5 text-[var(--nexus-text-dim)]" />
              <span>{timeString}</span>
            </span>
          </div>
        </div>

        {/* Title & Description */}
        <div className="mb-4 relative z-10">
          <h3 className="text-base font-bold text-white mb-1.5 line-clamp-1 group-hover:text-[var(--nexus-accent)] transition-colors duration-200">
            {moment.title}
          </h3>
          {moment.description && (
            <p className="text-xs text-[var(--nexus-text-muted)] line-clamp-2 leading-relaxed">
              {moment.description}
            </p>
          )}
        </div>
      </div>

      <div className="relative z-10">
        {/* Participants & Capacity Bar */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--nexus-text-muted)] flex items-center gap-1 font-medium">
              <Users className="w-3.5 h-3.5 text-[var(--nexus-text-dim)]" />
              <span>{fa.moments.participants}</span>
            </span>
            <span className="font-bold text-white">
              {moment.participantCount} / {moment.capacity} نفر
            </span>
          </div>

          {/* Clean progress bar */}
          <div className="w-full h-1.5 bg-[var(--nexus-surface-elevated)] rounded-full overflow-hidden border border-[var(--nexus-border)]/50">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isFull
                  ? 'bg-rose-500'
                  : capacityPercent > 70
                  ? 'bg-amber-400'
                  : 'bg-gradient-to-r from-[var(--nexus-primary)] to-[var(--nexus-accent)]'
              }`}
              style={{ width: `${capacityPercent}%` }}
            />
          </div>
        </div>

        {/* Footer: Creator & Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-[var(--nexus-border)]">
          {/* Creator Stack */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[var(--nexus-surface-elevated)] border border-[var(--nexus-border)] flex items-center justify-center text-[10px] font-bold text-[var(--nexus-accent)]">
              {moment.creator?.name ? moment.creator.name.charAt(0) : 'N'}
            </div>
            <span className="text-xs text-[var(--nexus-text-muted)] font-medium truncate max-w-[100px]">
              {moment.creator?.name || 'میزبان'}
            </span>
          </div>

          {/* Action button */}
          <div className="flex items-center gap-2">
            {isJoined ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onLeave?.(moment.id);
                }}
                className="px-3 py-1 rounded-xl bg-emerald-500/10 hover:bg-rose-500/20 text-emerald-400 hover:text-rose-400 border border-emerald-500/30 hover:border-rose-500/40 text-xs font-bold transition-all flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{fa.moments.joined}</span>
              </button>
            ) : isFull ? (
              <span className="px-3 py-1 rounded-xl bg-[var(--nexus-surface-elevated)] text-[var(--nexus-text-dim)] border border-[var(--nexus-border)] text-xs font-medium">
                {fa.moments.full}
              </span>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onJoin?.(moment.id);
                }}
                className="px-3.5 py-1 rounded-xl bg-[var(--nexus-primary)] hover:bg-[var(--nexus-primary-light)] text-white text-xs font-bold transition-all flex items-center gap-1 shadow-sm hover:shadow-[0_0_12px_rgba(139,92,246,0.35)]"
              >
                <span>{fa.moments.join}</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
