'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Hash,
  Send,
  Sparkles,
  Paperclip,
  Smile,
  Volume2
} from 'lucide-react';
import { Channel, Message, User } from '@/types/discord';
import { fa } from '@/lib/i18n/fa';

interface ChatAreaProps {
  channel: Channel;
  messages: Message[];
  onSendMessage: (text: string) => void;
  onAddReaction: (messageId: string, emoji: string) => void;
  currentUser: User;
}

const quickReactions = ['❤️', '🔥', '👏', '🎯', '😂', '🚀'];

export const ChatArea: React.FC<ChatAreaProps> = ({
  channel,
  messages,
  onSendMessage,
  onAddReaction,
  currentUser,
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
    <div className="flex-1 flex flex-col h-full bg-[var(--nexus-bg)] overflow-hidden text-right" dir="rtl">
      {/* Channel Top Header */}
      <div className="h-14 px-6 border-b border-[var(--nexus-border)] flex items-center justify-between bg-[var(--nexus-sidebar)]/60 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[var(--nexus-surface)] border border-[var(--nexus-border)] flex items-center justify-center text-[var(--nexus-primary-light)]">
            {channel.type === 'voice' ? <Volume2 className="w-4 h-4" /> : <Hash className="w-4 h-4" />}
          </div>
          <div>
            <h2 className="text-sm font-black text-white">{channel.name}</h2>
            <p className="text-[11px] text-[var(--nexus-text-muted)] font-medium">
              کانال گفتگوی رسمی
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-full bg-[var(--nexus-surface)] text-[var(--nexus-text-muted)] border border-[var(--nexus-border)]">
            {messages.length} پیام
          </span>
        </div>
      </div>

      {/* Messages Scroll View */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-12 h-12 rounded-2xl bg-[var(--nexus-surface)] border border-[var(--nexus-border)] flex items-center justify-center text-[var(--nexus-text-dim)] mb-3">
              <Hash className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">شروع گفتگو در #{channel.name}</h3>
            <p className="text-xs text-[var(--nexus-text-muted)] max-w-xs">
              پیام جدیدی در این کانال نیست. اولین نفری باشید که پیام ارسال می‌کند!
            </p>
          </div>
        ) : (
          messages.map((message) => {
            const isMe = message.userId === currentUser.id;
            return (
              <div
                key={message.id}
                className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-[var(--nexus-surface)]/50 transition-colors"
              >
                {/* Avatar */}
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[var(--nexus-primary)] to-[var(--nexus-accent)] flex items-center justify-center text-xs font-black text-white shrink-0 shadow-sm">
                  {message.userName.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-white hover:underline cursor-pointer">
                      {message.userName}
                    </span>
                    {message.role && (
                      <span
                        className="text-[10px] px-1.5 py-0.2 rounded font-semibold"
                        style={{
                          backgroundColor: `${message.roleColor || '#8b5cf6'}20`,
                          color: message.roleColor || '#8b5cf6',
                          border: `1px solid ${message.roleColor || '#8b5cf6'}40`,
                        }}
                      >
                        {message.role}
                      </span>
                    )}
                    <span className="text-[10px] text-[var(--nexus-text-dim)]">
                      {message.timestamp}
                    </span>
                  </div>

                  {/* Message Content */}
                  <p className="text-xs text-[var(--nexus-text)] leading-relaxed whitespace-pre-wrap break-words">
                    {message.content}
                  </p>

                  {/* Reactions Bar */}
                  {message.reactions && message.reactions.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      {message.reactions.map((r, idx) => (
                        <button
                          key={idx}
                          onClick={() => onAddReaction(message.id, r.emoji)}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[var(--nexus-surface)] hover:bg-[var(--nexus-surface-elevated)] border border-[var(--nexus-border)] text-xs text-white transition-all"
                        >
                          <span>{r.emoji}</span>
                          <span className="text-[10px] font-bold text-[var(--nexus-text-muted)]">
                            {r.count}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Emoji Reaction Pill */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 bg-[var(--nexus-surface-elevated)] border border-[var(--nexus-border)] rounded-lg p-0.5 shadow-sm">
                  {quickReactions.slice(0, 3).map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => onAddReaction(message.id, emoji)}
                      className="p-1 hover:bg-white/10 rounded text-xs transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Box */}
      <div className="p-4 border-t border-[var(--nexus-border)] bg-[var(--nexus-sidebar)]/80">
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-[var(--nexus-surface)] border border-[var(--nexus-border)] focus-within:border-[var(--nexus-primary)] transition-all"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`ارسال پیام در #${channel.name}...`}
            className="flex-1 bg-transparent border-none text-xs text-white placeholder:text-[var(--nexus-text-dim)] focus:outline-none"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-8 h-8 rounded-xl bg-[var(--nexus-primary)] disabled:opacity-40 hover:bg-[var(--nexus-primary-light)] text-white flex items-center justify-center transition-all shadow-sm"
          >
            <Send className="w-3.5 h-3.5 rotate-180" />
          </button>
        </form>
      </div>
    </div>
  );
};
