'use client';

import React from 'react';
import { User } from '@/types/discord';
import { GamerAvatar } from '@/components/GamerAvatar';
import { Bot, Crown, Sparkles, Users } from 'lucide-react';
import { fa } from '@/lib/i18n/fa';

interface MemberListProps {
  members: User[];
  onSelectMember?: (member: User) => void;
}

export const MemberList: React.FC<MemberListProps> = ({ members, onSelectMember }) => {
  const onlineMembers = members.filter((m) => m.status !== 'offline');
  const offlineMembers = members.filter((m) => m.status === 'offline');

  const getStatusBadge = (status: User['status']) => {
    switch (status) {
      case 'online':
        return 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]';
      case 'idle':
        return 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]';
      case 'dnd':
        return 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]';
      default:
        return 'bg-slate-500';
    }
  };

  const renderMember = (user: User) => (
    <div
      key={user.id}
      onClick={() => onSelectMember && onSelectMember(user)}
      className="flex items-center px-2.5 py-2 rounded-xl hover:bg-[var(--nexus-surface)] cursor-pointer group transition-all duration-200 border border-transparent hover:border-[var(--nexus-border)]"
    >
      <div className="relative shrink-0 ml-2.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[var(--nexus-primary)] to-[var(--nexus-accent)] flex items-center justify-center text-xs font-bold text-white shadow-sm">
          {user.name.charAt(0)}
        </div>
        <span
          className={`absolute -bottom-0.5 -left-0.5 w-2.5 h-2.5 rounded-full border-2 border-[var(--nexus-sidebar)] ${getStatusBadge(
            user.status
          )}`}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span
            className="text-xs font-bold truncate group-hover:text-white transition"
            style={{ color: user.roleColor || 'var(--nexus-text)' }}
          >
            {user.name}
          </span>
          {user.role === 'مدیر کل سرور' && (
            <Crown className="w-3 h-3 text-amber-400 shrink-0" />
          )}
        </div>
        {(user.gameActivity || user.customStatus) && (
          <p className="text-[10px] text-[var(--nexus-text-muted)] truncate mt-0.5">
            {user.gameActivity ? `در حال ${user.gameActivity}` : user.customStatus}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <aside className="w-56 bg-[var(--nexus-sidebar)]/80 flex flex-col h-full border-r border-[var(--nexus-border)] p-3 select-none shrink-0 text-right" dir="rtl">
      <div className="flex items-center justify-between mb-3 px-1 text-xs font-bold text-[var(--nexus-text-muted)]">
        <div className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-[var(--nexus-text-dim)]" />
          <span>{fa.communities.members}</span>
        </div>
        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[var(--nexus-surface)] border border-[var(--nexus-border)]">
          {members.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar">
        {onlineMembers.length > 0 && (
          <div>
            <div className="text-[10px] font-bold text-[var(--nexus-text-dim)] px-2 mb-1 uppercase tracking-wider">
              {fa.profile.statusOnline} — {onlineMembers.length}
            </div>
            <div className="space-y-0.5">
              {onlineMembers.map(renderMember)}
            </div>
          </div>
        )}

        {offlineMembers.length > 0 && (
          <div>
            <div className="text-[10px] font-bold text-[var(--nexus-text-dim)] px-2 mb-1 uppercase tracking-wider">
              {fa.profile.statusOffline} — {offlineMembers.length}
            </div>
            <div className="space-y-0.5 opacity-60">
              {offlineMembers.map(renderMember)}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
