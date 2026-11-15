'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Hash,
  Send,
  PlusCircle,
  Gift,
  Smile,
  Volume2,
  Bell,
  Pin,
  Users,
  Search,
  Inbox,
  HelpCircle,
} from 'lucide-react';
import { Channel, Message, User } from '@/types/discord';

interface ChatAreaProps {
  channel: Channel;
  messages: Message[];
  onSendMessage: (text: string) => void;
  onAddReaction: (messageId: string, emoji: string) => void;
  currentUser: User;
  onToggleMemberList?: () => void;
}

const quickReactions = ['❤️', '🔥', '😂', '👍', '🎉', '🎮'];

export const ChatArea: React.FC<ChatAreaProps> = ({
  channel,
  messages,
  onSendMessage,
  onAddReaction,
  currentUser,
  onToggleMemberList,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#313338] overflow-hidden text-right z-10" dir="rtl">
      {/* 1. Discord Channel Header Bar */}
      <header className="h-12 px-4 border-b border-[#1f2023] flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.2)] bg-[#313338] z-20 shrink-0">
        <div className="flex items-center gap-2 truncate">
          {channel.type === 'voice' ? (
            <Volume2 className="w-5 h-5 text-[#80848e] shrink-0" />
          ) : (
            <Hash className="w-5 h-5 text-[#80848e] shrink-0" />
          )}
          <span className="text-sm font-extrabold text-white truncate">{channel.name}</span>
          <div className="h-4 w-[1px] bg-[#3f4147] mx-1 hidden sm:block" />
          <span className="text-xs text-[#949ba4] font-medium truncate hidden sm:block">
            کانال گفتگوی رسمی سرور
          </span>
        </div>

        {/* Action icons on header (Bell, Pin, Users, Search) */}
        <div className="flex items-center gap-3 text-[#b5bac1] shrink-0">
          <button className="hover:text-[#dbdee1] transition-colors p-1" title="اعلان‌ها">
            <Bell className="w-4 h-4" />
          </button>
          <button className="hover:text-[#dbdee1] transition-colors p-1" title="پیام‌های سنجاق‌شده">
            <Pin className="w-4 h-4" />
          </button>
          <button
            onClick={onToggleMemberList}
            className="hover:text-[#dbdee1] transition-colors p-1"
            title="فهرست اعضا"
          >
            <Users className="w-4 h-4" />
          </button>

          {/* Quick search input */}
          <div className="relative hidden md:flex items-center">
            <input
              type="text"
              placeholder="جست‌وجو..."
              className="w-36 px-2 py-1 bg-[#1e1f22] rounded-[4px] text-xs text-[#dbdee1] placeholder:text-[#949ba4] focus:w-48 transition-all focus:outline-none"
            />
            <Search className="w-3.5 h-3.5 text-[#949ba4] absolute left-2 pointer-events-none" />
          </div>
        </div>
      </header>

      {/* 2. Messages List Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {/* Welcome to channel banner */}
        <div className="mb-6 pt-4 pb-2 border-b border-[#35363c]">
          <div className="w-14 h-14 rounded-full bg-[#404249] flex items-center justify-center text-[#dbdee1] mb-2">
            <Hash className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-white mb-1">
            به کانال #{channel.name} خوش آمدید!
          </h2>
          <p className="text-xs text-[#949ba4]">
            این نقطه شروع گفت‌وگوها در کانال #{channel.name} است.
          </p>
        </div>

        {messages.map((message) => {
          const isMe = message.userId === currentUser.id;
          return (
            <div
              key={message.id}
              className="group flex items-start gap-4 p-1 -mx-2 px-2 rounded hover:bg-[#2e3035] transition-colors relative"
            >
              {/* Member Avatar */}
              <div className="w-10 h-10 rounded-full bg-[#5865F2] flex items-center justify-center text-sm font-extrabold text-white shrink-0 mt-0.5">
                {message.userName.charAt(0)}
              </div>

              {/* Message Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span
                    className="text-xs font-bold hover:underline cursor-pointer"
                    style={{ color: message.roleColor || '#ffffff' }}
                  >
                    {message.userName}
                  </span>
                  {message.role && (
                    <span
                      className="text-[10px] px-1.5 py-0.2 rounded font-bold"
                      style={{
                        backgroundColor: `${message.roleColor || '#5865F2'}22`,
                        color: message.roleColor || '#5865F2',
                      }}
                    >
                      {message.role}
                    </span>
                  )}
                  <span className="text-[11px] text-[#949ba4] font-medium mr-1">
                    {message.timestamp}
                  </span>
                </div>

                {/* Content */}
                <p className="text-[13px] text-[#dbdee1] leading-relaxed break-words whitespace-pre-wrap font-normal">
                  {message.content}
                </p>

                {/* Reactions badge bar */}
                {message.reactions && message.reactions.length > 0 && (
                  <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                    {message.reactions.map((r, idx) => (
                      <button
                        key={idx}
                        onClick={() => onAddReaction(message.id, r.emoji)}
                        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] bg-[#2b2d31] hover:bg-[#35373c] border border-[#3f4147] text-xs transition-colors"
                      >
                        <span>{r.emoji}</span>
                        <span className="text-[11px] font-bold text-[#b5bac1]">{r.count}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Discord Floating Reaction Popover on Hover */}
              <div className="absolute left-4 -top-3.5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center bg-[#313338] border border-[#232428] rounded-[4px] shadow-md p-0.5">
                {quickReactions.slice(0, 3).map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => onAddReaction(message.id, emoji)}
                    className="p-1 hover:bg-[#35373c] rounded text-xs transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* 3. Discord Message Input Bar */}
      <footer className="p-4 pt-1 bg-[#313338] shrink-0">
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-3 px-4 py-2.5 rounded-[8px] bg-[#383a40] focus-within:ring-1 focus-within:ring-[#5865F2] transition-all"
        >
          {/* Plus action icon */}
          <button
            type="button"
            className="text-[#b5bac1] hover:text-[#dbdee1] transition-colors p-0.5"
            title="پیوست فایل"
          >
            <PlusCircle className="w-5 h-5" />
          </button>

          {/* Text input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`ارسال پیام در #${channel.name}`}
            className="flex-1 bg-transparent border-none text-[13px] text-[#dbdee1] placeholder:text-[#80848e] focus:outline-none"
          />

          {/* Emoji & Send buttons */}
          <div className="flex items-center gap-2 text-[#b5bac1]">
            <button
              type="button"
              className="hover:text-[#dbdee1] transition-colors"
              title="ارسال هدیه نیترو"
            >
              <Gift className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="hover:text-[#dbdee1] transition-colors"
              title="شکلک‌ها"
            >
              <Smile className="w-5 h-5" />
            </button>
            {inputText.trim() && (
              <button
                type="submit"
                className="p-1.5 rounded-[4px] bg-[#5865F2] text-white hover:bg-[#4752c4] transition-colors"
                title="ارسال پیام"
              >
                <Send className="w-3.5 h-3.5 rotate-180" />
              </button>
            )}
          </div>
        </form>
      </footer>
    </div>
  );
};
