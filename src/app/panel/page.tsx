'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
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
  X,
  Volume2,
  Share2,
  Link as LinkIcon,
  Check,
  ArrowRight,
  ShieldAlert,
  Zap,
  Globe2,
  Activity,
  Layers,
  ChevronLeft,
  MessageSquare,
  Hash,
  LogIn,
  Search,
  HelpCircle,
  Play,
  Flame as FireIcon,
} from 'lucide-react';
import { User, Message } from '@/types/discord';
import { PlanetWorld, SolarSystem } from '@/types/planet';
import { NexusIcon } from '@/components/glyphs';
import { getSolarSystems } from '@/data/planetsData';
import { initialMessages, currentUser, sampleUsers } from '@/data/mockData';
import { ProfileModal } from '@/components/ProfileModal';
import { AuthModal } from '@/components/AuthModal';
import Planet3D from '@/components/Planet3D';
import PrivateDMsPanel from '@/components/PrivateDMsPanel';
import { VoiceVideoRoom } from '@/components/VoiceVideoRoom';
import SignalRadarModal from '@/components/SignalRadarModal';
import confetti from 'canvas-confetti';

const INITIAL_SOLAR_SYSTEMS: SolarSystem[] = getSolarSystems();

export default function GalaxyUniverseApp() {
  const [solarSystems, setSolarSystems] = useState<SolarSystem[]>(INITIAL_SOLAR_SYSTEMS);
  const [activeSystem, setActiveSystem] = useState<SolarSystem | null>(null);
  const [activePlanet, setActivePlanet] = useState<PlanetWorld | null>(null);
  const [selectedHub, setSelectedHub] = useState<string>('prime-chat');
  const [activeUser, setActiveUser] = useState<User>(currentUser);
  // 1. Session Persistence: Check active cookie session on mount or refresh
  useEffect(() => {
    async function restoreSession() {
      try {
        const res = await fetch('/api/v1/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setActiveUser({
              id: data.user.id,
              name: data.user.name,
              username: data.user.username,
              avatarStyle: data.user.avatarStyle || 'golden_king',
              status: 'online',
              customStatus: data.user.customStatus || 'خلبان رسمی کهکشان نکسوس 🌌',
              role: data.user.role || 'عضو نکسوس',
              roleColor: data.user.roleColor || '#8B7CFF',
            });
          }
        }
      } catch (err) {
        console.error('Session validation error:', err);
      }
    }
    restoreSession();
  }, []);

  const [isCopied, setIsCopied] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  
  // Load real admin communities from database API and merge into 50 cosmic planets
  useEffect(() => {
    async function loadAdminCommunities() {
      try {
        const res = await fetch('/api/v1/communities');
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setSolarSystems(getSolarSystems(json.data));
        }
      } catch (err) {
        console.error('Failed to load communities:', err);
      }
    }
    loadAdminCommunities();
  }, []);

  // Audio / Mic
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);

  // Modals & Panels
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isDMsOpen, setIsDMsOpen] = useState(false);
  const [isSignalRadarOpen, setIsSignalRadarOpen] = useState(false);
  const [activeCall, setActiveCall] = useState<{
    friend?: User;
    channelName?: string;
    isVideo: boolean;
  } | null>(null);

  // Chat message stream within a planet (starts empty for real user messages)
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>({});

  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Check URL hash for direct planet link: e.g. #cs2 or #fc
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash) {
        for (const system of solarSystems) {
          const found = system.planets.find((p) => p.slug === hash);
          if (found) {
            setActiveSystem(system);
            setActivePlanet(found);
            setSelectedHub(found.hubs[0]?.id || '');
            return;
          }
        }
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [solarSystems]);

  const handleSelectPlanet = (planet: PlanetWorld) => {
    setActivePlanet(planet);
    setSelectedHub(planet.hubs[0]?.id || '');
    window.location.hash = planet.slug;
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { x: planet.coordinates.x / 100, y: planet.coordinates.y / 100 },
    });
  };

  const handleCopyPlanetLink = (planet: PlanetWorld, e: React.MouseEvent) => {
    e.stopPropagation();
    const link = `${window.location.origin}/#${planet.slug}`;
    navigator.clipboard.writeText(link);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activePlanet) return;

    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      userId: activeUser.id,
      userName: activeUser.name,
      userAvatarStyle: activeUser.avatarStyle,
      role: activeUser.role,
      roleColor: activePlanet.accentColor,
      content: chatInput.trim(),
      timestamp: new Date().toLocaleTimeString('fa-IR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      reactions: [],
    };

    setMessagesMap((prev) => ({
      ...prev,
      [selectedHub]: [...(prev[selectedHub] || []), newMsg],
    }));
    setChatInput('');
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  const currentMessages = messagesMap[selectedHub] || [];

  return (
    <div className="relative w-screen h-screen overflow-hidden deep-space-stars text-slate-100 select-none" dir="rtl">
      {/* 1. Top Galaxy Command Deck */}
      <header className="absolute top-4 left-6 right-6 h-14 rounded-2xl bg-[#090c16]/85 backdrop-blur-2xl border border-white/10 flex items-center justify-between px-6 z-50 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white text-base font-black shadow-[0_0_20px_rgba(168,85,247,0.5)]">
            🌌
          </div>
          <div>
            <div className="text-sm font-black text-white flex items-center gap-2">
              <span>کهکشان نکسوس</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Nexus Universe v3.2
              </span>
            </div>
            <p className="text-[10px] text-slate-400">شبکه چت و دورهمی گیمرها بر اساس سیاره‌های بازی</p>
          </div>
        </div>

        {/* Center Quick Navigation, Signals & DMs Button */}
        <div className="hidden 2xl:flex items-center gap-2">
          {/* Clean minimal quick triggers */}
          <button
            onClick={() => setIsSignalRadarOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/35 border border-cyan-500/30 text-xs font-bold text-cyan-200 transition-all"
          >
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span>رادار سیگنال</span>
          </button>

          <button
            onClick={() => setIsDMsOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-600/20 hover:bg-pink-600/35 border border-pink-500/30 text-xs font-bold text-pink-200 transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5 text-pink-400" />
            <span>پیام‌های خصوصی</span>
          </button>

          <button
            onClick={() => setIsHelpOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 transition-all"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>راهنما</span>
          </button>
        </div>

        {/* User Identity & Audio Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Sidebar & Menu Toggle */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="xl:hidden p-2 rounded-xl bg-purple-600/25 border border-purple-500/30 text-purple-300 hover:text-white"
            title="لیست سیارات و چت‌ها"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/5 border border-white/10">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-1.5 rounded-lg transition-colors ${
                isMuted ? 'bg-red-500/20 text-red-400' : 'text-slate-300 hover:text-white'
              }`}
              title={isMuted ? 'میکروفون قطع است' : 'قطع میکروفون'}
            >
              {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsDeafened(!isDeafened)}
              className={`p-1.5 rounded-lg transition-colors ${
                isDeafened ? 'bg-red-500/20 text-red-400' : 'text-slate-300 hover:text-white'
              }`}
              title={isDeafened ? 'صدا قطع است' : 'قطع صدا'}
            >
              <Headphones className="w-4 h-4" />
            </button>
          </div>

          {/* Auth / Account Switch Button (Only visible if not authenticated) */}
          {activeUser.id === 'guest_user' ? (
            <button
              onClick={() => setIsAuthOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/35 border border-purple-500/30 text-xs font-bold text-purple-300 transition-all shadow-sm"
              title="ورود یا ثبت‌نام حساب کاربری"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ورود / ثبت‌نام</span>
            </button>
          ) : (
            <button
              onClick={async () => {
                try {
                  await fetch('/api/v1/auth/logout', { method: 'POST' });
                  window.location.reload();
                } catch (e) {
                  console.error('Logout error:', e);
                }
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-xs font-bold text-red-300 transition-all shadow-sm"
              title="خروج از حساب کاربری"
            >
              <LogIn className="w-3.5 h-3.5 rotate-180" />
              <span className="hidden sm:inline">خروج</span>
            </button>
          )}

          <div
            onClick={() => setIsProfileOpen(true)}
            className="flex items-center gap-2 p-1 pl-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-all"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-xs font-black text-white">
              {activeUser.name.charAt(0)}
            </div>
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-white leading-tight">{activeUser.name}</div>
              <div className="text-[10px] text-emerald-400 font-medium">خلبان آنلاین</div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Left Sidebar Directory (منظومه‌ها و سیارات) */}
      <aside className={`absolute right-4 sm:right-6 top-20 sm:top-24 bottom-6 sm:bottom-16 w-[calc(100vw-2rem)] sm:w-80 rounded-3xl bg-[#090c16]/95 backdrop-blur-2xl border border-white/10 z-30 flex flex-col overflow-hidden shadow-2xl transition-all duration-300 ${
        isSidebarOpen ? 'translate-x-0' : 'translate-x-[120%] xl:translate-x-0'
      }`}>
        {/* Panel Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-black text-white">
              {activeSystem ? activeSystem.name.split('(')[0] : 'کهکشان منظومه‌های نکسوس'}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {activeSystem ? (
              <button
                onClick={() => setActiveSystem(null)}
                className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30 hover:bg-cyan-500/30 transition flex items-center gap-1"
              >
                <span>کل کهکشان</span>
                <ChevronLeft className="w-3 h-3 rotate-180" />
              </button>
            ) : (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 font-bold border border-purple-500/20">
                {solarSystems.length} منظومه
              </span>
            )}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="xl:hidden p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Explanatory Banner for Users */}
        <div className="p-3 mx-3 my-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-[11px] text-purple-200 leading-relaxed font-medium">
          {activeSystem ? (
            <span>🚀 <strong>در حال مشاهده منظومه:</strong> روی هر سیاره کلیک کنید تا وارد چت و ویس‌روم شوید.</span>
          ) : (
            <span>🌌 روی هر <strong>منظومه</strong> کلیک کنید تا وارد سیارات تخصصی آن حوزه شوید.</span>
          )}
        </div>

        {/* Systems & Planets List Items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 sleek-scrollbar">
          {/* Quick Signal Radar Action Card */}
          <div
            onClick={() => setIsSignalRadarOpen(true)}
            className="p-3 rounded-2xl border border-cyan-500/40 bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-transparent hover:from-cyan-500/25 transition-all cursor-pointer group mb-2 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">📡</span>
                <div>
                  <div className="text-xs font-black text-cyan-300 group-hover:text-cyan-200 flex items-center gap-1.5">
                    <span>نکسوس سیگنال</span>
                    <span className="text-[9px] bg-cyan-400 text-black px-1.5 py-0.2 rounded font-extrabold">LIVE</span>
                  </div>
                  <div className="text-[10px] text-slate-400">الان چی می‌خوای؟ پیدا کردن هم‌بازی</div>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                رادار
              </span>
            </div>
          </div>

          {/* Quick DMs access card */}
          <div
            onClick={() => setIsDMsOpen(true)}
            className="p-3 rounded-2xl border border-pink-500/30 bg-gradient-to-r from-pink-500/10 to-purple-500/10 hover:from-pink-500/20 hover:to-purple-500/20 transition-all cursor-pointer group mb-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">💬</span>
                <div>
                  <div className="text-xs font-black text-pink-300 group-hover:text-pink-200">
                    پیام‌های خصوصی و دوستان
                  </div>
                  <div className="text-[10px] text-slate-400">تماس صوتی و تصویری ۱ به ۱</div>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-bold border border-pink-500/30">
                باز کردن
              </span>
            </div>
          </div>

          {/* If looking at a single Solar System, show its planets */}
          {activeSystem ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1 text-[11px] text-slate-400 font-bold">
                <span>سیارات این منظومه:</span>
                <button
                  onClick={() => setActiveSystem(null)}
                  className="text-cyan-400 hover:underline flex items-center gap-1 text-[10px]"
                >
                  <ArrowRight className="w-3 h-3" />
                  <span>بازگشت به منظومه‌ها</span>
                </button>
              </div>

              {activeSystem.planets.map((planet) => {
                const isSelected = activePlanet?.id === planet.id;
                return (
                  <div
                    key={planet.id}
                    onClick={() => handleSelectPlanet(planet)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer group ${
                      isSelected
                        ? 'bg-white/15 border-white/30 shadow-lg scale-[1.02]'
                        : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl filter drop-shadow">{planet.icon}</span>
                        <div>
                          <div className="text-xs font-black text-white group-hover:text-cyan-300 transition-colors">
                            {planet.name.split('(')[0]}
                          </div>
                          <div className="text-[10px] text-slate-400 font-medium">{planet.genre}</div>
                        </div>
                      </div>

                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/60 text-emerald-400 font-bold border border-white/10 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {planet.activePilots}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-white/5 text-[10px] text-slate-400">
                      <span className="text-purple-400 font-bold">ورود به چت و ویس</span>
                      <ChevronLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Otherwise show list of Solar Systems */
            <div className="space-y-2">
              <div className="px-1 text-[11px] text-slate-400 font-bold">انتخاب منظومه:</div>
              {solarSystems.map((system) => {
                return (
                  <div
                    key={system.id}
                    onClick={() => setActiveSystem(system)}
                    className="p-3.5 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] transition-all cursor-pointer group hover:scale-[1.02] shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2.5">
                        <div
                          style={{ borderColor: system.accentColor, backgroundColor: system.accentColor + '20' }}
                          className="w-9 h-9 rounded-xl border flex items-center justify-center text-white shrink-0 shadow-md group-hover:scale-105 transition-transform"
                        >
                          <NexusIcon name={system.glyph} size={20} strokeWidth={2} />
                        </div>
                        <div>
                          <div className="text-xs font-black text-white group-hover:text-purple-300 transition-colors">
                            {system.name.split('(')[0]}
                          </div>
                          <div className="text-[10px] text-slate-400">{system.englishName}</div>
                        </div>
                      </div>

                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                        {system.planets.length} سیاره
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 line-clamp-1 mt-1 font-normal">
                      {system.description}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </aside>

      {/* 3. The 3D Orbital Canvas (Center - Left biased to avoid sidebar overlap) */}
      <main className="relative w-full h-full flex items-center justify-center pl-0 md:pr-80">
        {/* Orbital Trajectory Circles in Space */}
        <div className="orbit-ring w-[340px] h-[340px] top-1/2 left-[38%]" />
        <div className="orbit-ring w-[560px] h-[560px] top-1/2 left-[38%]" style={{ animationDuration: '200s' }} />
        <div className="orbit-ring w-[780px] h-[780px] top-1/2 left-[38%]" style={{ animationDuration: '320s' }} />

        {/* View Mode Header Pill in Center Space */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 md:left-[38%] z-20 flex items-center gap-2 px-4 py-2 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/15 shadow-xl">
          {activeSystem ? (
            <div className="flex items-center gap-2">
              <span className="text-xl">{activeSystem.icon}</span>
              <span className="text-xs font-black text-white">{activeSystem.name}</span>
              <button
                onClick={() => setActiveSystem(null)}
                className="mr-2 px-2.5 py-1 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 text-[10px] font-bold border border-purple-500/40 transition flex items-center gap-1"
              >
                <span>بازگشت به نمای کهکشان</span>
                <ChevronLeft className="w-3 h-3 rotate-180" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-base">🌌</span>
              <span className="text-xs font-bold text-slate-300">نمای کهکشان نکسوس — یک منظومه را برای ورود انتخاب کنید</span>
            </div>
          )}
        </div>

        {/* A. If inside a Solar System: Render the cleanly spaced 3D Planets */}
        {activeSystem ? (
          activeSystem.planets.map((planet) => {
            return (
              <div
                key={planet.id}
                onClick={() => handleSelectPlanet(planet)}
                style={{
                  left: `${planet.coordinates.x * 0.72}%`,
                  top: `${planet.coordinates.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className="absolute flex flex-col items-center group cursor-pointer z-20 transition-transform duration-300 hover:scale-105"
              >
                {/* Real 3D Planet Sphere via WebGL */}
                <div className="relative flex items-center justify-center">
                  <Planet3D
                    id={planet.id}
                    size={planet.size}
                    theme={planet.theme}
                    hasRings={planet.hasRings}
                  />

                  {/* Pilot Count Badge */}
                  <div className="absolute -bottom-2 px-2.5 py-0.5 rounded-full bg-black/85 backdrop-blur-md border border-white/20 text-[10px] font-bold text-white flex items-center gap-1 shadow-lg pointer-events-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>{planet.activePilots} پلیر</span>
                  </div>
                </div>

                {/* Planet Information Card Tag */}
                <div className="mt-3 text-center transition-all group-hover:translate-y-1">
                  <div className="text-sm font-extrabold text-white flex items-center gap-1.5 justify-center">
                    <span>{planet.name}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">{planet.genre}</div>

                  {/* Direct Action Pill */}
                  <div className="mt-1.5 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-[10px] text-cyan-300 font-bold group-hover:bg-cyan-500/30 transition-all">
                    کلیک برای ورود به چت
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          /* B. Galaxy Overview: Render the 6 Majestic Solar System Hubs */
          solarSystems.map((system) => {
            return (
              <div
                key={system.id}
                onClick={() => setActiveSystem(system)}
                style={{
                  left: `${system.coordinates.x * 0.72}%`,
                  top: `${system.coordinates.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className="absolute flex flex-col items-center group cursor-pointer z-20 transition-all duration-300 hover:scale-110"
              >
                {/* Glowing Cosmic Solar System Core Sphere */}
                <div className="relative flex items-center justify-center">
                  {/* Outer pulsating radial glow */}
                  <div
                    style={{ backgroundColor: system.accentColor }}
                    className="absolute w-28 h-28 sm:w-36 sm:h-36 rounded-full blur-2xl opacity-40 group-hover:opacity-75 transition-opacity"
                  />

                  {/* Glowing Core Orbit Circle */}
                  <div className={`w-20 h-20 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr ${system.bannerGradient} p-1 shadow-2xl flex items-center justify-center border-2 border-white/30 backdrop-blur-xl relative group-hover:rotate-6 group-hover:scale-105 transition-all duration-300`}>
                    <div className="w-full h-full rounded-[22px] bg-black/50 flex flex-col items-center justify-center shadow-inner relative overflow-hidden">
                      {/* Subtle cyber background grid */}
                      <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />
                      <div className="text-white relative z-10 drop-shadow-[0_0_12px_rgba(255,255,255,0.7)]">
                        <NexusIcon name={system.glyph} size={38} strokeWidth={2.2} />
                      </div>
                    </div>

                    {/* Orbiting Satellite Dots indicating planets inside */}
                    <div className="absolute -inset-2 rounded-3xl border border-white/20 border-dashed animate-spin" style={{ animationDuration: '25s' }} />
                  </div>

                  {/* Planet Count Pill */}
                  <div className="absolute -bottom-2 px-3 py-0.5 rounded-full bg-black/90 backdrop-blur-md border border-white/25 text-[10px] font-black text-white flex items-center gap-1.5 shadow-xl">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                    <span>{system.planets.length} سیاره</span>
                  </div>
                </div>

                {/* System Title & Details */}
                <div className="mt-3 text-center">
                  <div className="text-xs sm:text-sm font-black text-white group-hover:text-cyan-300 transition-colors drop-shadow-md">
                    {system.name.split('(')[0]}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">
                    {system.englishName}
                  </div>
                  <div className="mt-1 px-2.5 py-0.5 rounded-full bg-white/10 group-hover:bg-purple-600/40 text-[9px] text-slate-300 group-hover:text-purple-200 border border-white/10 transition">
                    ورود به منظومه ➔
                  </div>
                </div>
              </div>
            );
          })
        )}
      </main>

      {/* 4. Planet Surface Holographic Portal (When a planet is opened) */}
      {activePlanet && (
        <div className="absolute inset-0 z-40 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-5xl h-[94vh] sm:h-[85vh] rounded-3xl hologram-glass overflow-hidden flex flex-col shadow-[0_0_80px_rgba(0,0,0,0.9)] border border-white/20">
            {/* Planet Header Banner */}
            <div
              className={`p-4 sm:p-6 bg-gradient-to-r ${activePlanet.gradient} relative flex items-center justify-between shadow-lg`}
            >
              <div className="flex items-center gap-3 sm:gap-4 truncate">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-black/40 backdrop-blur-md border border-white/30 flex items-center justify-center text-2xl sm:text-3xl shadow-inner shrink-0">
                  {activePlanet.icon}
                </div>
                <div className="truncate">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-lg sm:text-2xl font-black text-white truncate">{activePlanet.name}</h2>
                    <span className="text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 rounded-full bg-black/50 text-white font-bold border border-white/20 shrink-0">
                      #{activePlanet.slug}
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-white/90 max-w-xl font-medium truncate sm:whitespace-normal">
                    {activePlanet.description}
                  </p>
                </div>
              </div>

              {/* Actions: Copy Planet Link & Close */}
              <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
                <button
                  onClick={(e) => handleCopyPlanetLink(activePlanet, e)}
                  className="hidden sm:flex px-4 py-2 rounded-xl bg-black/40 hover:bg-black/60 text-white text-xs font-bold border border-white/25 items-center gap-1.5 transition-all shadow-md"
                  title="کپی لینک اختصاصی این سیاره برای دعوت دوستان"
                >
                  {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-cyan-300" />}
                  <span>{isCopied ? 'لینک کپی شد!' : 'لینک اختصاصی سیاره'}</span>
                </button>

                <button
                  onClick={() => {
                    setActivePlanet(null);
                    window.location.hash = '';
                  }}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-all border border-white/25"
                  title="بازگشت به نقشه کهکشان"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Planet Hubs & Realtime Communication Workspace */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              {/* Hub / Station Selector Sidebar */}
              <aside className="w-full md:w-64 bg-black/40 border-b md:border-b-0 md:border-l border-white/10 p-3 sm:p-4 flex md:flex-col justify-between shrink-0">
                <div className="w-full">
                  <div className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 md:mb-3 px-1 flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5 text-purple-400" />
                    <span>کانال‌ها و ایستگاه‌ها</span>
                  </div>

                  <div className="flex md:flex-col gap-1.5 overflow-x-auto md:overflow-x-visible no-scrollbar pb-1 md:pb-0">
                    {activePlanet.hubs.map((hub) => {
                      const isSelected = selectedHub === hub.id;
                      return (
                        <button
                          key={hub.id}
                          onClick={() => {
                            setSelectedHub(hub.id);
                            if (hub.type === 'voice') {
                              setActiveCall({
                                channelName: `${activePlanet.name} - ${hub.name}`,
                                isVideo: false,
                              });
                            }
                          }}
                          className={`w-full p-2.5 rounded-xl text-right transition-all flex items-center justify-between text-xs font-bold ${
                            isSelected
                              ? 'bg-white/15 text-white border border-white/20 shadow-md'
                              : 'text-slate-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            {hub.type === 'voice' ? (
                              <Volume2 className="w-4 h-4 text-cyan-400 shrink-0" />
                            ) : hub.type === 'tournament' ? (
                              <Gamepad2 className="w-4 h-4 text-amber-400 shrink-0" />
                            ) : (
                              <MessageSquare className="w-4 h-4 text-purple-400 shrink-0" />
                            )}
                            <span className="truncate">{hub.name}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {hub.activeCount}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Planet Audio Streamer */}
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                  <div className="text-[10px] text-cyan-400 font-bold mb-1 flex items-center gap-1">
                    <Radio className="w-3.5 h-3.5 animate-pulse" />
                    <span>رادیوی زنده سیاره</span>
                  </div>
                  <div className="text-xs font-bold text-white truncate">{activePlanet.musicTrack}</div>
                </div>
              </aside>

              {/* Main Planet Chat & Live Feed */}
              <div className="flex-1 flex flex-col bg-black/20 overflow-hidden">
                {/* Messages stream */}
                <div className="flex-1 p-6 overflow-y-auto space-y-4 no-scrollbar">
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-center mb-4">
                    <div className="text-sm font-black text-white mb-1">
                      به اتمسفر {activePlanet.name} خوش آمدید!
                    </div>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      تمام بازیکنان این بازی در اینجا به صورت بی‌درنگ متصل هستند. برای لابی، بازی دوستانه و گفت‌وگو پیام بفرستید.
                    </p>
                  </div>

                  {currentMessages.map((msg) => (
                    <div key={msg.id} className="flex items-start gap-3 group">
                      <div
                        style={{ backgroundColor: activePlanet.accentColor }}
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black text-white shrink-0 shadow-md"
                      >
                        {msg.userName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-white">{msg.userName}</span>
                          <span
                            style={{ color: activePlanet.accentColor }}
                            className="text-[10px] bg-white/10 px-1.5 py-0.2 rounded font-bold"
                          >
                            پلیر رسمی
                          </span>
                          <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                        </div>
                        <div className="p-3 rounded-2xl bg-white/[0.05] border border-white/5 text-xs text-slate-200 leading-relaxed font-normal">
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                {/* Chat Input Field */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-4 border-t border-white/10 bg-black/40 flex items-center gap-3"
                >
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={`ارسال سیگنال در سیاره ${activePlanet.name}...`}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-all"
                  />
                  <button
                    type="submit"
                    style={{ backgroundColor: activePlanet.accentColor }}
                    className="w-10 h-10 rounded-xl text-white flex items-center justify-center transition-all shadow-md hover:opacity-90"
                  >
                    <Send className="w-4 h-4 rotate-180" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Quick Help Modal (از کجا شروع کنم؟) */}
      {isHelpOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0e1220] w-full max-w-lg rounded-3xl border border-white/15 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🧭</span>
                <h3 className="text-base font-black text-white">راهنمای کهکشان نکسوس</h3>
              </div>
              <button
                onClick={() => setIsHelpOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs leading-relaxed text-slate-300">
              <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20">
                <div className="font-bold text-purple-300 mb-1 flex items-center gap-1.5">
                  <span>۱. انتخاب سیاره بازی</span>
                </div>
                <p>
                  هر بازی (کانتر ۲، FC 27، والورانت، دوتا ۲ یا هاب مرکزی) یک سیاره اختصاصی دارد. روی کره سه‌بعدی هر سیاره یا از ستون سمت راست روی نام آن کلیک کنید.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
                <div className="font-bold text-cyan-300 mb-1 flex items-center gap-1.5">
                  <span>۲. چت، ویس‌روم و پیدا کردن هم‌تیمی</span>
                </div>
                <p>
                  با ورود به هر سیاره، تالار گفتگوی متنی، اتاق‌های صوتی و لابی‌های مسابقات اختصاصی آن بازی در اختیار شما قرار می‌گیرد.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="font-bold text-emerald-300 mb-1 flex items-center gap-1.5">
                  <span>۳. لینک مستقیم و دعوت دوستان</span>
                </div>
                <p>
                  هر سیاره لینک مستقیم دارد (مثل <code>/#cs2</code> یا <code>/#fc</code>). دکمه «لینک اختصاصی سیاره» را بزنید و برای دوستانتان بفرستید تا سریعاً در همان بازی به شما ملحق شوند.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsHelpOpen(false)}
              className="mt-6 w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all text-xs"
            >
              متوجه شدم، بزن بریم!
            </button>
          </div>
        </div>
      )}

      {/* 6. Bottom Galaxy Status */}
      <footer className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-2xl bg-[#090c16]/80 backdrop-blur-2xl border border-white/10 flex items-center gap-6 z-30 text-xs shadow-2xl">
        <div className="flex items-center gap-2 text-slate-400">
          <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>پینگ مدار: ۱۸ms</span>
        </div>
        <div className="w-[1px] h-3 bg-white/10" />
        <div className="flex items-center gap-2 text-slate-400">
          <Users className="w-3.5 h-3.5 text-purple-400" />
          <span>۹۵۴ گیمر فعال در سیارات</span>
        </div>
      </footer>

      {/* NEXUS SIGNAL Intent Formation Radar Modal */}
      <SignalRadarModal
        isOpen={isSignalRadarOpen}
        currentUser={activeUser}
        onClose={() => setIsSignalRadarOpen(false)}
        onMomentFormed={(momentId, title) => {
          setIsSignalRadarOpen(false);
          setActiveCall({
            channelName: title,
            isVideo: false,
          });
        }}
      />

      {/* Modals & Panels */}
      {isDMsOpen && (
        <PrivateDMsPanel
          currentUser={activeUser}
          friends={sampleUsers}
          onStartCall={(friend, isVideo) => {
            setActiveCall({
              friend,
              isVideo,
            });
            setIsDMsOpen(false);
          }}
          onClose={() => setIsDMsOpen(false)}
        />
      )}

      {/* Voice / Video Call Modal */}
      {activeCall && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col p-4 md:p-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-2">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{activeCall.isVideo ? '📹' : '🎙️'}</span>
              <div>
                <h3 className="text-base font-black text-white">
                  {activeCall.friend
                    ? `تماس ${activeCall.isVideo ? 'تصویری' : 'صوتی'} با ${activeCall.friend.name}`
                    : activeCall.channelName || 'اتاق مکالمه صوتی'}
                </h3>
                <span className="text-xs text-emerald-400 font-medium">اتصال برقرار است • کیفیت HD</span>
              </div>
            </div>

            <button
              onClick={() => setActiveCall(null)}
              className="px-4 py-2 rounded-xl bg-red-600/30 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/40 text-xs font-bold transition-all flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              <span>قطع و خروج</span>
            </button>
          </div>

          <div className="flex-1 min-h-0">
            <VoiceVideoRoom
              channel={{
                id: activeCall.friend ? `call_${activeCall.friend.id}` : 'planet_voice',
                name: activeCall.friend
                  ? `استریم و تماس با ${activeCall.friend.name}`
                  : activeCall.channelName || 'استریم زنده و استیج صوتی',
                type: 'voice',
                description: 'استریم زنده، اشتراک تصویر و مکالمه گروهی نکسوس',
              }}
              currentUser={activeUser}
              connectedUsers={activeCall.friend ? [activeUser, activeCall.friend] : [activeUser, ...sampleUsers.slice(0, 3)]}
              availableFriends={sampleUsers}
              isMuted={isMuted}
              onToggleMute={() => setIsMuted(!isMuted)}
              onDisconnect={() => setActiveCall(null)}
              onAddUser={(newUser) => {
                // Keep caller state updated with invited friends
              }}
            />
          </div>
        </div>
      )}

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentUser={activeUser}
        onUpdateUser={(updated) => setActiveUser((prev) => ({ ...prev, ...updated }))}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={(u) => setActiveUser(u)}
      />
    </div>
  );
}
