'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Sparkles,
  Radio,
  Gamepad2,
  Flame,
  Users,
  Compass,
  Mic,
  MicOff,
  Headphones,
  Settings,
  Send,
  Plus,
  Maximize2,
  Minimize2,
  X,
  Volume2,
  Play,
  Pause,
  SkipForward,
  Activity,
  Layers,
  Smile,
  Shield,
  Zap,
  HelpCircle,
} from 'lucide-react';
import { User, Message } from '@/types/discord';
import { MomentItem } from '@/types/moments';
import { initialMessages, currentUser, sampleUsers } from '@/data/mockData';
import { ProfileModal } from '@/components/ProfileModal';
import { AuthModal } from '@/components/AuthModal';
import confetti from 'canvas-confetti';

interface SpatialNode {
  id: string;
  title: string;
  type: 'chat' | 'audio-lounge' | 'game-pod' | 'moments-orbit' | 'radar';
  x: number;
  y: number;
  w: number;
  h: number;
  minimized?: boolean;
  zIndex: number;
}

export default function SpatialCanvasApp() {
  const [activeUser, setActiveUser] = useState<User>(currentUser);
  const [allUsers, setAllUsers] = useState<User[]>(sampleUsers);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Audio & Mic Controls
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(true);

  // Canvas Pan & Zoom Transform
  const [zoom, setZoom] = useState(1);
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Modals
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Dynamic Nodes on Spatial Canvas
  const [nodes, setNodes] = useState<SpatialNode[]>([
    {
      id: 'node-chat',
      title: 'اتاق مکالمه فضایی (HyperChat)',
      type: 'chat',
      x: 380,
      y: 80,
      w: 480,
      h: 560,
      zIndex: 10,
    },
    {
      id: 'node-audio',
      title: 'لاونج صوتی و موسیقی (Audio Hub)',
      type: 'audio-lounge',
      x: 900,
      y: 80,
      w: 360,
      h: 270,
      zIndex: 9,
    },
    {
      id: 'node-game',
      title: 'پاد بازی سریع (Co-op Pod)',
      type: 'game-pod',
      x: 900,
      y: 380,
      w: 360,
      h: 260,
      zIndex: 8,
    },
    {
      id: 'node-moments',
      title: 'مدار دورهمی‌های زنده (Live Moments)',
      type: 'moments-orbit',
      x: 40,
      y: 80,
      w: 310,
      h: 560,
      zIndex: 7,
    },
  ]);

  // Messages in HyperChat
  const [chatMessages, setChatMessages] = useState<Message[]>(
    initialMessages['ch_1'] || [
      {
        id: 'msg_init_1',
        userId: 'user_1',
        userName: 'آریا گیمر',
        role: 'مدیر کل سرور',
        roleColor: '#a855f7',
        content: 'به بوم اجتماعی نسل جدید نکسوس خوش آمدید! همه‌چیز در یک صفحه به صورت ماژولار و زنده کنترل می‌شود. 🌌',
        timestamp: '۲۳:۲۰',
        reactions: [{ emoji: '🔥', count: 4, users: [] }],
      },
    ]
  );
  const [chatInput, setChatInput] = useState('');
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Mini-Game State (Tic-Tac-Toe in Game Pod)
  const [gameBoard, setGameBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isXTurn, setIsXTurn] = useState(true);
  const [gameWinner, setGameWinner] = useState<string | null>(null);

  // Active audio frequencies animation
  const [audioBars, setAudioBars] = useState<number[]>([40, 75, 95, 60, 85, 50, 70, 90]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAudioBars(Array.from({ length: 8 }, () => Math.floor(Math.random() * 70) + 25));
    }, 250);
    return () => clearInterval(interval);
  }, []);

  // Node Dragging State
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [nodeOffset, setNodeOffset] = useState({ x: 0, y: 0 });

  const bringToFront = (id: string) => {
    setNodes((prev) => {
      const maxZ = Math.max(...prev.map((n) => n.zIndex), 1);
      return prev.map((n) => (n.id === id ? { ...n, zIndex: maxZ + 1 } : n));
    });
  };

  const handleNodeMouseDown = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    bringToFront(id);
    const node = nodes.find((n) => n.id === id);
    if (!node) return;
    setDraggingNodeId(id);
    setNodeOffset({
      x: e.clientX - node.x,
      y: e.clientY - node.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingNodeId) {
      setNodes((prev) =>
        prev.map((n) =>
          n.id === draggingNodeId
            ? {
                ...n,
                x: Math.max(10, Math.min(window.innerWidth - 100, e.clientX - nodeOffset.x)),
                y: Math.max(10, Math.min(window.innerHeight - 100, e.clientY - nodeOffset.y)),
              }
            : n
        )
      );
    }
  };

  const handleMouseUp = () => {
    setDraggingNodeId(null);
  };

  // Chat message send
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      userId: activeUser.id,
      userName: activeUser.name,
      userAvatarStyle: activeUser.avatarStyle,
      role: activeUser.role,
      roleColor: '#a855f7',
      content: chatInput.trim(),
      timestamp: new Date().toLocaleTimeString('fa-IR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      reactions: [],
    };
    setChatMessages((prev) => [...prev, newMsg]);
    setChatInput('');
    setTimeout(() => chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  // Tic-Tac-Toe handling
  const handleCellClick = (idx: number) => {
    if (gameBoard[idx] || gameWinner) return;
    const next = [...gameBoard];
    next[idx] = isXTurn ? '❌' : '⭕';
    setGameBoard(next);
    setIsXTurn(!isXTurn);

    const wins = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (const [a, b, c] of wins) {
      if (next[a] && next[a] === next[b] && next[a] === next[c]) {
        setGameWinner(next[a]);
        confetti({ particleCount: 50, spread: 60 });
        return;
      }
    }
  };

  const resetGame = () => {
    setGameBoard(Array(9).fill(null));
    setGameWinner(null);
    setIsXTurn(true);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="relative w-screen h-screen overflow-hidden spatial-grid-bg text-[#f1f5f9] select-none"
      dir="rtl"
    >
      {/* 1. Spatial Ambient Glow Orbs in Void */}
      <div className="absolute top-1/4 right-1/4 w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* 2. Top Spatial Command Dock */}
      <header className="absolute top-4 left-6 right-6 h-14 rounded-2xl bg-[#0e111b]/80 backdrop-blur-2xl border border-white/10 flex items-center justify-between px-5 z-50 shadow-2xl">
        {/* Brand & Orbit Space */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center text-white font-black text-sm shadow-[0_0_20px_rgba(168,85,247,0.5)]">
            N
          </div>
          <div>
            <div className="text-sm font-black text-white flex items-center gap-2">
              <span>نکسوس فضایی</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Spatial Canvas v2.0
              </span>
            </div>
            <p className="text-[10px] text-slate-400">بوم زنده مکالمات، صوت و بازی بدون تغییر صفحه</p>
          </div>
        </div>

        {/* Dynamic Nodes Quick Toggle Bar */}
        <div className="hidden md:flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/5">
          <button
            onClick={() => bringToFront('node-chat')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white/10 text-white hover:bg-white/15 transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
            <span>چت فضایی</span>
          </button>
          <button
            onClick={() => bringToFront('node-audio')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-all"
          >
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span>لاونج صوتی</span>
          </button>
          <button
            onClick={() => bringToFront('node-game')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-all"
          >
            <Gamepad2 className="w-3.5 h-3.5 text-pink-400" />
            <span>پاد بازی</span>
          </button>
          <button
            onClick={() => bringToFront('node-moments')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-all"
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>مدار دورهمی</span>
          </button>
        </div>

        {/* User Identity & Audio Capsule */}
        <div className="flex items-center gap-3">
          {/* Quick Voice Bar */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/5 border border-white/10">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-1.5 rounded-lg transition-colors ${
                isMuted ? 'bg-red-500/20 text-red-400' : 'text-slate-300 hover:text-white'
              }`}
              title={isMuted ? 'میکروفون قطع' : 'میکروفون وصل'}
            >
              {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsDeafened(!isDeafened)}
              className={`p-1.5 rounded-lg transition-colors ${
                isDeafened ? 'bg-red-500/20 text-red-400' : 'text-slate-300 hover:text-white'
              }`}
              title={isDeafened ? 'صدا قطع' : 'صدا وصل'}
            >
              <Headphones className="w-4 h-4" />
            </button>
          </div>

          {/* Profile Card */}
          <div
            onClick={() => setIsProfileOpen(true)}
            className="flex items-center gap-2 p-1 pl-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-all"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-xs font-black text-white">
              {activeUser.name.charAt(0)}
            </div>
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-white leading-tight">{activeUser.name}</div>
              <div className="text-[10px] text-emerald-400 font-medium">آنلاین در مدار</div>
            </div>
          </div>
        </div>
      </header>

      {/* 3. Floating Spatial Canvas Nodes */}

      {/* NODE 1: HyperChat Floating Window */}
      {nodes.map((node) => {
        if (node.id === 'node-chat') {
          return (
            <div
              key={node.id}
              style={{
                top: node.y,
                left: node.x,
                width: node.w,
                height: node.h,
                zIndex: node.zIndex,
              }}
              onClick={() => bringToFront(node.id)}
              className="absolute spatial-node rounded-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95"
            >
              {/* Window Titlebar */}
              <div
                onMouseDown={(e) => handleNodeMouseDown(node.id, e)}
                className="h-11 px-4 bg-white/[0.04] border-b border-white/10 flex items-center justify-between cursor-move"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
                  <span className="text-xs font-bold text-white">{node.title}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 font-bold border border-purple-500/20">
                    کانال مرکزی
                  </span>
                </div>
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="flex items-start gap-3 group">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-xs font-black text-white shrink-0 shadow-md">
                      {msg.userName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-white">{msg.userName}</span>
                        <span className="text-[10px] text-purple-400 bg-purple-500/10 px-1.5 rounded">
                          {msg.role}
                        </span>
                        <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-white/[0.05] border border-white/5 text-xs text-slate-200 leading-relaxed font-normal">
                        {msg.content}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={chatBottomRef} />
              </div>

              {/* Chat Composer */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-white/10 bg-white/[0.02]">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.05] border border-white/10 focus-within:border-purple-500/60 transition-all">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="پیامی در بوم بنویسید..."
                    className="flex-1 bg-transparent border-none text-xs text-white placeholder:text-slate-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="w-7 h-7 rounded-lg bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center transition-all shadow-[0_0_12px_rgba(168,85,247,0.4)]"
                  >
                    <Send className="w-3.5 h-3.5 rotate-180" />
                  </button>
                </div>
              </form>
            </div>
          );
        }

        // NODE 2: Audio Lounge & Music Visualizer
        if (node.id === 'node-audio') {
          return (
            <div
              key={node.id}
              style={{
                top: node.y,
                left: node.x,
                width: node.w,
                height: node.h,
                zIndex: node.zIndex,
              }}
              onClick={() => bringToFront(node.id)}
              className="absolute spatial-node rounded-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95"
            >
              <div
                onMouseDown={(e) => handleNodeMouseDown(node.id, e)}
                className="h-11 px-4 bg-white/[0.04] border-b border-white/10 flex items-center justify-between cursor-move"
              >
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-white">{node.title}</span>
                </div>
                <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20 font-bold">
                  پخش زنده
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-white">Synthwave Lounge 24/7</span>
                    <span className="text-[11px] text-slate-400">۳ نفر در لاونج</span>
                  </div>

                  {/* Audio Visualizer Waves */}
                  <div className="h-16 flex items-end justify-between gap-1.5 px-3 py-2 bg-black/40 rounded-xl border border-white/5">
                    {audioBars.map((height, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-cyan-500 to-purple-500 rounded-full transition-all duration-200"
                        style={{ height: `${isPlayingMusic ? height : 6}%` }}
                      />
                    ))}
                  </div>
                </div>

                {/* Music Controls */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsPlayingMusic(!isPlayingMusic)}
                      className="w-8 h-8 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black flex items-center justify-center transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                    >
                      {isPlayingMusic ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                    </button>
                    <button className="p-2 text-slate-400 hover:text-white transition-colors">
                      <SkipForward className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Connected users avatars */}
                  <div className="flex -space-x-2 space-x-reverse">
                    {allUsers.slice(0, 3).map((u) => (
                      <div
                        key={u.id}
                        className="w-7 h-7 rounded-full bg-purple-600 border-2 border-[#0b0d14] flex items-center justify-center text-[10px] font-bold text-white"
                        title={u.name}
                      >
                        {u.name.charAt(0)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        }

        // NODE 3: Co-op Mini-Game Pod (Tic-Tac-Toe)
        if (node.id === 'node-game') {
          return (
            <div
              key={node.id}
              style={{
                top: node.y,
                left: node.x,
                width: node.w,
                height: node.h,
                zIndex: node.zIndex,
              }}
              onClick={() => bringToFront(node.id)}
              className="absolute spatial-node rounded-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95"
            >
              <div
                onMouseDown={(e) => handleNodeMouseDown(node.id, e)}
                className="h-11 px-4 bg-white/[0.04] border-b border-white/10 flex items-center justify-between cursor-move"
              >
                <div className="flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4 text-pink-400" />
                  <span className="text-xs font-bold text-white">{node.title}</span>
                </div>
                {gameWinner ? (
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">
                    برنده: {gameWinner}
                  </span>
                ) : (
                  <span className="text-[10px] text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded-full font-bold">
                    نوبت: {isXTurn ? '❌' : '⭕'}
                  </span>
                )}
              </div>

              <div className="p-3.5 flex-1 flex flex-col items-center justify-center">
                <div className="grid grid-cols-3 gap-2 w-48">
                  {gameBoard.map((cell, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleCellClick(idx)}
                      className="w-14 h-14 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 flex items-center justify-center text-xl font-black transition-all"
                    >
                      {cell}
                    </button>
                  ))}
                </div>

                {gameWinner && (
                  <button
                    onClick={resetGame}
                    className="mt-2 text-xs text-purple-400 hover:text-purple-300 font-bold underline"
                  >
                    شروع دوباره بازی
                  </button>
                )}
              </div>
            </div>
          );
        }

        // NODE 4: Moments Orbit
        if (node.id === 'node-moments') {
          return (
            <div
              key={node.id}
              style={{
                top: node.y,
                left: node.x,
                width: node.w,
                height: node.h,
                zIndex: node.zIndex,
              }}
              onClick={() => bringToFront(node.id)}
              className="absolute spatial-node rounded-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95"
            >
              <div
                onMouseDown={(e) => handleNodeMouseDown(node.id, e)}
                className="h-11 px-4 bg-white/[0.04] border-b border-white/10 flex items-center justify-between cursor-move"
              >
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white">{node.title}</span>
                </div>
                <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full font-bold">
                  مدارهای فعال
                </span>
              </div>

              <div className="p-3.5 flex-1 overflow-y-auto space-y-2.5">
                {[
                  { title: 'اسکوات ۴ نفره وارزون', cat: 'گیمینگ', time: '۱ ساعت', users: 3, max: 4 },
                  { title: 'کدنویسی گروهی و دیباگ', cat: 'توسعه', time: '۴۵ دقیقه', users: 2, max: 5 },
                  { title: 'تماشای مسابقات دوتا ۲', cat: 'استریم', time: '۲ ساعت', users: 6, max: 10 },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                        {item.cat}
                      </span>
                      <span className="text-[10px] text-amber-400">{item.time} باقی‌مانده</span>
                    </div>
                    <div className="text-xs font-bold text-white mb-2">{item.title}</div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{item.users} از {item.max} نفر</span>
                      <button className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-bold hover:bg-amber-500/30 transition-all">
                        پیوستن
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }

        return null;
      })}

      {/* 4. Bottom Quick Status Dock */}
      <footer className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-2xl bg-[#0e111b]/80 backdrop-blur-2xl border border-white/10 flex items-center gap-6 z-50 text-xs shadow-2xl">
        <div className="flex items-center gap-2 text-slate-400">
          <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>پینگ مدار: ۲۴ms</span>
        </div>
        <div className="w-[1px] h-3 bg-white/10" />
        <div className="flex items-center gap-2 text-slate-400">
          <Users className="w-3.5 h-3.5 text-purple-400" />
          <span>۴۵ گیمر آنلاین در بوم</span>
        </div>
      </footer>

      {/* Global Modals */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentUser={activeUser}
        onUpdateUser={(updated) => setActiveUser((prev) => ({ ...prev, ...updated }))}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={(u) => {
          setActiveUser(u);
          setIsAuthenticated(true);
        }}
      />
    </div>
  );
}
