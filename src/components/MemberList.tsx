'use client';

import React from 'react';
import { User } from '@/types/discord';
import { Crown, ShieldCheck } from 'lucide-react';

interface MemberListProps {
  members: User[];
  onSelectMember?: (member: User) => void;
}

export const MemberList: React.FC<MemberListProps> = ({ members, onSelectMember }) => {
  const onlineMembers = members.filter((m) => m.status !== 'offline');
  const offlineMembers = members.filter((m) => m.status === 'offline');

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'online':
        return 'bg-[#23a55a]';
      case 'idle':
        return 'bg-[#f0b232]';
      case 'dnd':
        return 'bg-[#f23f43]';
      default:
        return 'bg-[#80848e]';
    }
  };

  const renderMember = (user: User) => (
    <div
      key={user.id}
      onClick={() => onSelectMember && onSelectMember(user)}
      className="flex items-center px-2 py-1.5 rounded-[4px] hover:bg-[#35373c] cursor-pointer group transition-colors select-none"
    >
      {/* Avatar with status bullet */}
      <div className="relative shrink-0 ml-3">
        <div className="w-8 h-8 rounded-full bg-[#5865F2] flex items-center justify-center text-xs font-bold text-white">
          {user.name.charAt(0)}
        </div>
        <span
          className={`absolute -bottom-0.5 -left-0.5 w-3 h-3 rounded-full border-2 border-[#2b2d31] ${getStatusColor(
            user.status
          )}`}
        />
      </div>

      <div className="flex-1 min-w-0 leading-tight">
        <div className="flex items-center gap-1.5">
          <span
            className="text-xs font-bold truncate group-hover:text-white transition-colors"
            style={{ color: user.roleColor || '#dbdee1' }}
          >
            {user.name}
          </span>
          {user.role === 'مدیر کل سرور' && (
            <span title="مالک سرور">
              <Crown className="w-3.5 h-3.5 text-[#f0b232] shrink-0" />
            </span>
          )}
        </div>

        {(user.gameActivity || user.customStatus) && (
          <p className="text-[11px] text-[#949ba4] truncate mt-0.5">
            {user.gameActivity ? `در حال ${user.gameActivity}` : user.customStatus}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <aside
      className="w-60 bg-[#2b2d31] flex flex-col h-full border-r border-[#1f2023] p-3 select-none shrink-0 text-right overflow-y-auto no-scrollbar z-10"
      dir="rtl"
    >
      {/* Online Section */}
      {onlineMembers.length > 0 && (
        <div className="mb-4">
          <h3 className="text-[11px] font-extrabold text-[#949ba4] px-2 mb-1 uppercase tracking-wider">
            آنلاین — {onlineMembers.length}
          </h3>
          <div className="space-y-0.5">{onlineMembers.map(renderMember)}</div>
        </div>
      )}

      {/* Offline Section */}
      {offlineMembers.length > 0 && (
        <div>
          <h3 className="text-[11px] font-extrabold text-[#949ba4] px-2 mb-1 uppercase tracking-wider">
            آفلاین — {offlineMembers.length}
          </h3>
          <div className="space-y-0.5 opacity-60">{offlineMembers.map(renderMember)}</div>
        </div>
      )}
    </aside>
  );
};
