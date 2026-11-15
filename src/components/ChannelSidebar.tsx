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
    <aside
      className="w-60 bg-[#2b2d31] flex flex-col h-full select-none shrink-0 text-right z-20 border-l border-[#1f2023]"
      dir="rtl"
    >
      {/* 1. Discord Server Header Header Dropdown */}
      <header
        className="h-12 px-4 border-b border-[#1f2023] flex items-center justify-between hover:bg-[#35373c] transition-colors cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
        onClick={onOpenCreateChannelModal}
      >
        <span className="text-sm font-extrabold text-white truncate tracking-wide">
          {server.name}
        </span>
        <ChevronDown className="w-4 h-4 text-[#949ba4]" />
      </header>

      {/* 2. Categorized Channels Tree */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4 no-scrollbar">
        {server.categories.map((category) => {
          const isCollapsed = collapsedCategories[category.id];
          return (
            <div key={category.id} className="space-y-0.5">
              {/* Category Header */}
              <div
                onClick={() => toggleCategory(category.id)}
                className="flex items-center justify-between px-1 py-1 text-[11px] font-bold text-[#949ba4] hover:text-[#dbdee1] cursor-pointer group uppercase tracking-wider"
              >
                <div className="flex items-center gap-1 truncate">
                  <ChevronDown
                    className={`w-3 h-3 transition-transform duration-200 text-[#949ba4] ${
                      isCollapsed ? '-rotate-90' : ''
                    }`}
                  />
                  <span className="truncate">{category.name}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenCreateChannelModal();
                  }}
                  className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-white transition-opacity"
                  title="ایجاد کانال"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Channels in Category */}
              {!isCollapsed && (
                <div className="space-y-0.5 mt-0.5">
                  {category.channels.map((channel) => {
                    const isActive = channel.id === activeChannelId;
                    const isVoice = channel.type === 'voice';

                    return (
                      <button
                        key={channel.id}
                        onClick={() => onSelectChannel(channel)}
                        className={`w-full flex items-center justify-between px-2 py-1.5 rounded-[4px] text-xs font-semibold transition-colors group ${
                          isActive
                            ? 'bg-[#404249] text-white'
                            : 'text-[#949ba4] hover:bg-[#35373c] hover:text-[#dbdee1]'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          {isVoice ? (
                            <Volume2
                              className={`w-4 h-4 shrink-0 ${
                                isActive ? 'text-white' : 'text-[#80848e]'
                              }`}
                            />
                          ) : (
                            <Hash
                              className={`w-4 h-4 shrink-0 ${
                                isActive ? 'text-white' : 'text-[#80848e]'
                              }`}
                            />
                          )}
                          <span className="truncate">{channel.name}</span>
                        </div>

                        {isVoice && (
                          <span className="text-[10px] text-[#80848e] group-hover:text-[#dbdee1]">
                            صوتی
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

      {/* 3. Connected Voice Bar (when inside a voice channel) */}
      {activeVoiceChannel && (
        <div className="px-3 py-2 bg-[#232428] border-t border-[#1f2023] flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <Volume2 className="w-5 h-5 text-[#23a55a] animate-pulse shrink-0" />
            <div className="truncate">
              <div className="text-xs font-bold text-[#23a55a] truncate leading-tight">
                صدا متصل شد
              </div>
              <div className="text-[11px] text-[#949ba4] truncate">
                {activeVoiceChannel.name} / {server.name}
              </div>
            </div>
          </div>
          <button
            onClick={onDisconnectVoice}
            title="قطع تماس"
            className="p-1.5 rounded hover:bg-[#35373c] text-[#f23f43] transition-colors"
          >
            <PhoneOff className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 4. Discord User Bar (Bottom Controls) */}
      <footer className="h-14 px-2 bg-[#232428] flex items-center justify-between z-10">
        <div
          onClick={onOpenProfile}
          className="flex items-center gap-2 p-1 rounded hover:bg-[#35373c] cursor-pointer transition-colors flex-1 min-w-0"
        >
          {/* Avatar with Status indicator */}
          <div className="relative shrink-0">
            <div className="w-8 h-8 rounded-full bg-[#5865F2] flex items-center justify-center text-xs font-extrabold text-white">
              {currentUser.name.charAt(0)}
            </div>
            <span className="absolute -bottom-0.5 -left-0.5 w-3 h-3 rounded-full bg-[#23a55a] border-2 border-[#232428]" />
          </div>

          <div className="truncate leading-tight">
            <div className="text-xs font-bold text-white truncate">{currentUser.name}</div>
            <div className="text-[11px] text-[#949ba4] truncate">
              {currentUser.status === 'online' ? 'آنلاین' : 'در دسترس'}
            </div>
          </div>
        </div>

        {/* Audio Mute, Deafen & Settings icons */}
        <div className="flex items-center gap-0.5 shrink-0 text-[#b5bac1]">
          <button
            onClick={onToggleMute}
            className={`p-1.5 rounded hover:bg-[#35373c] hover:text-[#dbdee1] transition-colors ${
              isMuted ? 'text-[#f23f43]' : ''
            }`}
            title={isMuted ? 'میکروفون قطع است' : 'قطع میکروفون'}
          >
            {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <button
            onClick={onToggleDeafen}
            className={`p-1.5 rounded hover:bg-[#35373c] hover:text-[#dbdee1] transition-colors ${
              isDeafened ? 'text-[#f23f43]' : ''
            }`}
            title={isDeafened ? 'بلندگو قطع است' : 'قطع صدا'}
          >
            <Headphones className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenProfile}
            className="p-1.5 rounded hover:bg-[#35373c] hover:text-[#dbdee1] transition-colors"
            title="تنظیمات کاربر"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </aside>
  );
};
