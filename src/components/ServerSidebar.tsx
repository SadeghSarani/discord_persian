'use client';

import React from 'react';
import { Plus, Compass, Sparkles, Users, MessageSquare } from 'lucide-react';
import { Server } from '@/types/discord';
import { fa } from '@/lib/i18n/fa';

interface ServerSidebarProps {
  servers: Server[];
  activeServerId: string;
  onSelectServer: (id: string) => void;
  onOpenCreateModal: () => void;
  onOpenAuthModal?: () => void;
}

export const ServerSidebar: React.FC<ServerSidebarProps> = ({
  servers,
  activeServerId,
  onSelectServer,
  onOpenCreateModal,
}) => {
  return (
    <nav className="w-[72px] bg-[var(--nexus-sidebar)] flex flex-col items-center py-4 space-y-2.5 select-none z-30 shrink-0 border-l border-[var(--nexus-border)]" dir="rtl">
      {/* Home / Direct Messages Button */}
      <div className="relative group flex items-center justify-center w-full">
        <div
          className={`absolute right-0 w-1 rounded-l-full transition-all duration-200 ${
            activeServerId === 'home'
              ? 'h-8 bg-[var(--nexus-accent)] shadow-[0_0_12px_var(--nexus-accent)]'
              : 'h-0 opacity-0 group-hover:h-4 group-hover:opacity-100 bg-white/70'
          }`}
        />
        <button
          onClick={() => onSelectServer('home')}
          className={`w-12 h-12 rounded-2xl group-hover:rounded-xl transition-all duration-200 flex items-center justify-center relative overflow-hidden ${
            activeServerId === 'home'
              ? 'bg-gradient-to-tr from-[var(--nexus-primary)] to-[var(--nexus-accent)] text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] rounded-xl'
              : 'bg-[var(--nexus-surface)] text-[var(--nexus-text-muted)] hover:text-white hover:bg-[var(--nexus-surface-elevated)] border border-[var(--nexus-border)]'
          }`}
          title={fa.nav.dms}
        >
          <MessageSquare className="w-5 h-5 transition-transform duration-200 group-hover:scale-105" />
        </button>
      </div>

      <div className="w-8 h-[1px] bg-[var(--nexus-border)] rounded my-1" />

      {/* Community Server List */}
      <div className="flex-1 w-full space-y-2.5 overflow-y-auto no-scrollbar flex flex-col items-center py-1">
        {servers.map((server) => {
          const isActive = server.id === activeServerId;
          return (
            <div key={server.id} className="relative group flex items-center justify-center w-full">
              <div
                className={`absolute right-0 w-1 rounded-l-full transition-all duration-200 ${
                  isActive
                    ? 'h-8 bg-[var(--nexus-primary)] shadow-[0_0_12px_var(--nexus-primary)]'
                    : 'h-0 opacity-0 group-hover:h-4 group-hover:opacity-100 bg-white/70'
                }`}
              />
              <button
                onClick={() => onSelectServer(server.id)}
                className={`w-12 h-12 rounded-2xl group-hover:rounded-xl transition-all duration-200 flex items-center justify-center relative overflow-hidden text-base font-black ${
                  isActive
                    ? 'bg-gradient-to-tr from-[var(--nexus-primary-dark)] to-[var(--nexus-primary)] text-white shadow-[0_0_16px_rgba(139,92,246,0.35)] rounded-xl border border-purple-400/30'
                    : 'bg-[var(--nexus-surface)] text-[var(--nexus-text-muted)] hover:text-white hover:bg-[var(--nexus-surface-elevated)] border border-[var(--nexus-border)]'
                }`}
                title={server.name}
              >
                {server.icon && server.icon.length <= 2 ? (
                  <span>{server.icon}</span>
                ) : (
                  <span>{server.acronym || server.name.charAt(0)}</span>
                )}
              </button>
            </div>
          );
        })}
      </div>

      <div className="w-8 h-[1px] bg-[var(--nexus-border)] rounded my-1" />

      {/* Add New Community Button */}
      <div className="relative group flex items-center justify-center w-full">
        <button
          onClick={onOpenCreateModal}
          className="w-12 h-12 rounded-2xl group-hover:rounded-xl bg-[var(--nexus-surface)] hover:bg-emerald-500/15 hover:border-emerald-500/30 border border-[var(--nexus-border)] text-emerald-400 flex items-center justify-center transition-all duration-200"
          title={fa.communities.create}
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
        </button>
      </div>
    </nav>
  );
};
