'use client';

import React, { useState } from 'react';
import {
  ChevronDown,
  Hash,
  Volume2,
  Plus,
  Mic,
  MicOff,
  Headphones,
  Settings,
  PhoneOff,
  User as UserIcon,
} from 'lucide-react';
import { Server, Channel, User } from '@/types/discord';
import { GamerAvatar } from '@/components/GamerAvatar';
import { fa } from '@/lib/i18n/fa';

interface ChannelSidebarProps {
  server: Server;
  activeChannelId: string;
  onSelectChannel: (channel: Channel) => void;
  currentUser: User;
  isMuted: boolean;
  isDeafened: boolean;
  onToggleMute: () => void;
  onToggleDeafen: () => void;
  activeVoiceChannel: Channel | null;
  onDisconnectVoice: () => void;
  onOpenCreateChannelModal: () => void;
  onOpenProfile: () => void;
}

export const ChannelSidebar: React.FC<ChannelSidebarProps> = ({
  server,
  activeChannelId,
  onSelectChannel,
  currentUser,
  isMuted,
  isDeafened,
  onToggleMute,
  onToggleDeafen,
  activeVoiceChannel,
  onDisconnectVoice,
  onOpenCreateChannelModal,
  onOpenProfile,
}) => {
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (catId: string) => {
    setCollapsedCategories((prev) => ({ ...prev, [catId]: !prev[catId] }));
  };

  return (
    <aside className="w-60 bg-[var(--nexus-sidebar)]/95 flex flex-col h-full select-none shrink-0 border-l border-[var(--nexus-border)] text-right" dir="rtl">
      {/* Community Header Banner */}
      <div className="h-14 px-4 border-b border-[var(--nexus-border)] flex items-center justify-between bg-[var(--nexus-surface)]/50 backdrop-blur-md">
        <div className="flex items-center gap-2 truncate">
          <span className="text-base font-extrabold text-white truncate">{server.name}</span>
        </div>
        <button
          onClick={onOpenCreateChannelModal}
          title={fa.communities.createChannel}
          className="p-1.5 rounded-lg text-[var(--nexus-text-muted)] hover:text-white hover:bg-[var(--nexus-surface-elevated)] transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Categories & Channel Tree */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4 no-scrollbar">
        {server.categories.map((category) => {
          const isCollapsed = collapsedCategories[category.id];
          return (
            <div key={category.id} className="space-y-0.5">
              {/* Category Header */}
              <div
                onClick={() => toggleCategory(category.id)}
                className="flex items-center justify-between px-2 py-1 text-[11px] font-bold text-[var(--nexus-text-muted)] hover:text-white cursor-pointer group uppercase tracking-wider"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <ChevronDown
                    className={`w-3 h-3 transition-transform duration-200 text-[var(--nexus-text-dim)] ${
                      isCollapsed ? '-rotate-90' : ''
                    }`}
                  />
                  <span className="truncate">{category.name}</span>
                </div>
              </div>

              {/* Channels List */}
              {!isCollapsed && (
                <div className="space-y-0.5 mt-0.5">
                  {category.channels.map((channel) => {
                    const isActive = channel.id === activeChannelId;
                    const isVoice = channel.type === 'voice';

                    return (
                      <button
                        key={channel.id}
                        onClick={() => onSelectChannel(channel)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all group ${
                          isActive
                            ? 'bg-[var(--nexus-surface-elevated)] text-white shadow-sm border border-[var(--nexus-border-glow)]'
                            : 'text-[var(--nexus-text-muted)] hover:text-white hover:bg-[var(--nexus-surface)]'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {isVoice ? (
                            <Volume2 className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[var(--nexus-accent)]' : 'text-[var(--nexus-text-dim)]'}`} />
                          ) : (
                            <Hash className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[var(--nexus-primary-light)]' : 'text-[var(--nexus-text-dim)]'}`} />
                          )}
                          <span className="truncate">{channel.name}</span>
                        </div>

                        {isVoice && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-[var(--nexus-surface)] text-[var(--nexus-text-dim)] group-hover:text-white">
                            {fa.communities.channels.voice}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Voice Status Bar (When in voice) */}
      {activeVoiceChannel && (
        <div className="p-3 bg-[var(--nexus-surface-elevated)] border-t border-[var(--nexus-border)] flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <div className="truncate">
              <div className="text-[11px] font-bold text-white truncate">{activeVoiceChannel.name}</div>
              <div className="text-[10px] text-emerald-400">{fa.common.status.connected}</div>
            </div>
          </div>
          <button
            onClick={onDisconnectVoice}
            title={fa.communities.channels.disconnect}
            className="p-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 transition-all"
          >
            <PhoneOff className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* User Status Bar at Bottom */}
      <div className="h-14 px-3 bg-[var(--nexus-surface)] border-t border-[var(--nexus-border)] flex items-center justify-between">
        <div
          onClick={onOpenProfile}
          className="flex items-center gap-2 truncate cursor-pointer hover:bg-[var(--nexus-surface-elevated)] p-1 rounded-xl transition-all flex-1 min-w-0"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[var(--nexus-primary)] to-[var(--nexus-accent)] flex items-center justify-center text-xs font-black text-white shrink-0">
            {currentUser.name.charAt(0)}
          </div>
          <div className="truncate">
            <div className="text-xs font-bold text-white truncate">{currentUser.name}</div>
            <div className="text-[10px] text-[var(--nexus-text-muted)] truncate">{currentUser.role || 'عضو'}</div>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onToggleMute}
            className={`p-1.5 rounded-lg transition-colors ${
              isMuted
                ? 'bg-rose-500/20 text-rose-400'
                : 'text-[var(--nexus-text-muted)] hover:text-white hover:bg-[var(--nexus-surface-elevated)]'
            }`}
            title={isMuted ? 'میکروفون قطع است' : 'قطع میکروفون'}
          >
            {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
          <button
            onClick={onToggleDeafen}
            className={`p-1.5 rounded-lg transition-colors ${
              isDeafened
                ? 'bg-rose-500/20 text-rose-400'
                : 'text-[var(--nexus-text-muted)] hover:text-white hover:bg-[var(--nexus-surface-elevated)]'
            }`}
            title={isDeafened ? 'صدا قطع است' : 'قطع صدا'}
          >
            <Headphones className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
