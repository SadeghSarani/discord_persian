'use client';

import React, { useState } from 'react';
import {
  MessageSquare,
  Users,
  Search,
  UserPlus,
  Send,
  Video,
  Phone,
  PhoneOff,
  Smile,
  Shield,
  Circle,
  X,
  Sparkles,
} from 'lucide-react';
import { User, Message } from '@/types/discord';
import { GamerAvatar } from '@/components/GamerAvatar';

interface PrivateDMsPanelProps {
  currentUser: User;
  friends: User[];
  onStartCall: (friend: User, isVideo: boolean) => void;
  onClose: () => void;
}

export default function PrivateDMsPanel({
  currentUser,
  friends,
  onStartCall,
  onClose,
}: PrivateDMsPanelProps) {
  const [selectedFriend, setSelectedFriend] = useState<User>(friends[0] || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileChatView, setMobileChatView] = useState(false);
  const [dmInput, setDmInput] = useState('');
  const [dmMessages, setDmMessages] = useState<Record<string, Message[]>>({
    [friends[0]?.id || 'u1']: [
      {
        id: 'dm_1',
        userId: friends[0]?.id || 'u1',
        userName: friends[0]?.name || 'دوست',
        userAvatarStyle: 'cyber_neon',
        role: 'دوست رسمی',
        roleColor: '#06b6d4',
        content: 'سلام! برای بازی یا وویس کال آماده‌ای؟ 🎮',
        timestamp: '۱۱:۲۰',
        reactions: [],
      },
    ],
  });

  const handleSendDM = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dmInput.trim() || !selectedFriend) return;

    const newMsg: Message = {
      id: `dm_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatarStyle: currentUser.avatarStyle,
      role: currentUser.role,
      roleColor: '#a855f7',
      content: dmInput.trim(),
      timestamp: new Date().toLocaleTimeString('fa-IR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      reactions: [],
    };

    setDmMessages((prev) => ({
      ...prev,
      [selectedFriend.id]: [...(prev[selectedFriend.id] || []), newMsg],
    }));
    setDmInput('');
  };

  const filteredFriends = friends.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeFriendMessages = selectedFriend ? dmMessages[selectedFriend.id] || [] : [];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4" dir="rtl">
      <div className="relative w-full max-w-4xl h-[80vh] rounded-3xl bg-[#090c16]/95 border border-white/15 shadow-2xl flex overflow-hidden">
        {/* Left Side: Friends List & Search */}
        <div className={`w-full md:w-80 bg-black/40 border-l border-white/10 flex flex-col ${mobileChatView ? 'hidden md:flex' : 'flex'}`}>
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-black text-white">چت‌های خصوصی و دوستان</h3>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold">
              {friends.length} مخاطب
            </span>
          </div>

          {/* Search Friend */}
          <div className="p-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جست‌وجوی دوست..."
                className="w-full pr-8 pl-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Friends List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1 no-scrollbar">
            {filteredFriends.map((friend) => {
              const isSelected = selectedFriend?.id === friend.id;
              return (
                <div
                  key={friend.id}
                  onClick={() => {
                    setSelectedFriend(friend);
                    setMobileChatView(true);
                  }}
                  className={`p-2.5 rounded-2xl flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-white/15 border border-white/20 shadow-md'
                      : 'hover:bg-white/[0.05] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-purple-600 flex items-center justify-center text-xs font-black text-white">
                        {friend.name.charAt(0)}
                      </div>
                      <span className="absolute -bottom-0.5 -left-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-black" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{friend.name}</div>
                      <div className="text-[10px] text-slate-400">
                        {friend.gameActivity ? `در حال ${friend.gameActivity}` : 'آنلاین'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Conversation Area */}
        <div className={`flex-1 flex flex-col bg-black/20 ${!mobileChatView ? 'hidden md:flex' : 'flex'}`}>
          {selectedFriend ? (
            <>
              {/* Header with Call Actions */}
              <div className="h-16 px-4 md:px-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setMobileChatView(false)}
                    className="md:hidden p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4 rotate-45" />
                  </button>
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-purple-600 flex items-center justify-center text-xs font-black text-white">
                    {selectedFriend.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-black text-white">{selectedFriend.name}</div>
                    <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>اتصال ایمن و مستقیم P2P</span>
                    </div>
                  </div>
                </div>

                {/* Video & Voice Call Quick Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onStartCall(selectedFriend, false)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all shadow-sm"
                    title="شروع تماس صوتی خصوصی"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>وویس کال</span>
                  </button>

                  <button
                    onClick={() => onStartCall(selectedFriend, true)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/30 text-xs font-bold transition-all shadow-sm"
                    title="شروع تماس تصویری با اشتراک وبکم"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>ویدیو کال</span>
                  </button>

                  <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center mr-2 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Message Feed */}
              <div className="flex-1 p-6 overflow-y-auto space-y-3.5 no-scrollbar">
                {activeFriendMessages.map((msg) => {
                  const isMe = msg.userId === currentUser.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex items-start gap-2.5 ${isMe ? 'flex-row-reverse' : ''}`}
                    >
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-purple-600 flex items-center justify-center text-xs font-black text-white shrink-0">
                        {msg.userName.charAt(0)}
                      </div>
                      <div
                        className={`max-w-[70%] p-3 rounded-2xl text-xs leading-relaxed ${
                          isMe
                            ? 'bg-purple-600/30 text-white border border-purple-500/30'
                            : 'bg-white/[0.06] text-slate-200 border border-white/10'
                        }`}
                      >
                        <p>{msg.content}</p>
                        <span className="text-[9px] text-slate-400 block mt-1 text-left">
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Message Composer */}
              <form onSubmit={handleSendDM} className="p-4 border-t border-white/10 bg-black/40">
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/[0.05] border border-white/10 focus-within:border-cyan-400/60 transition-all">
                  <input
                    type="text"
                    value={dmInput}
                    onChange={(e) => setDmInput(e.target.value)}
                    placeholder={`ارسال پیام خصوصی به ${selectedFriend.name}...`}
                    className="flex-1 bg-transparent border-none text-xs text-white placeholder:text-slate-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="w-8 h-8 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black flex items-center justify-center transition-all shadow-md"
                  >
                    <Send className="w-3.5 h-3.5 rotate-180" />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
              <Users className="w-12 h-12 text-slate-600 mb-2" />
              <p className="text-xs">یک دوست را برای شروع چت خصوصی انتخاب کنید</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
