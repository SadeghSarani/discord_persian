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
} from 'lucide-react';
import { User, Message } from '@/types/discord';
import { initialMessages, currentUser, sampleUsers } from '@/data/mockData';
import { ProfileModal } from '@/components/ProfileModal';
import { AuthModal } from '@/components/AuthModal';
import confetti from 'canvas-confetti';

interface PlanetWorld {
  id: string;
  name: string;
  subTitle: string;
  genre: string;
  slug: string;
  gradient: string;
  shadowColor: string;
  accentColor: string;
  icon: string;
  activePilots: number;
  openLobbies: number;
  description: string;
  coordinates: { x: number; y: number }; // Percentage in galaxy map
  size: number; // in pixels
  hubs: {
    id: string;
    name: string;
    type: 'chat' | 'voice' | 'tournament';
    activeCount: number;
  }[];
  musicTrack: string;
}

const PLANET_WORLDS: PlanetWorld[] = [
  {
    id: 'planet-cs2',
    name: 'سیاره کانتر ۲ (Dust Orbit)',
    subTitle: 'Counter-Strike 2 & Tactical FPS',
    genre: 'شوتینگ تاکتیکال',
    slug: 'cs2',
    gradient: 'from-amber-600 via-orange-500 to-yellow-400',
    shadowColor: 'rgba(245, 158, 11, 0.5)',
    accentColor: '#f59e0b',
    icon: '💣',
    activePilots: 142,
    openLobbies: 8,
    description: 'پایگاه لابی‌های کامپتیتیو، پرمیر، مچ‌های ۵v۵ و تمرین اسموک و ریتیک.',
    coordinates: { x: 22, y: 32 },
    size: 110,
    hubs: [
      { id: 'cs-general', name: 'کانال تاکتیکال و تبادل نظر', type: 'chat', activeCount: 65 },
      { id: 'cs-lobby1', name: 'اتاق صوتی پرمیر رنک +۱۵k', type: 'voice', activeCount: 5 },
      { id: 'cs-tourney', name: 'جام هفتگی دیسکافه CS2', type: 'tournament', activeCount: 32 },
    ],
    musicTrack: 'Dust II Combat Radio (Live)',
  },
  {
    id: 'planet-fc27',
    name: 'سیاره فوتبال ۲۷ (San Siro Core)',
    subTitle: 'EA FC & Football Universe',
    genre: 'شبیه‌ساز فوتبال و تورنومنت',
    slug: 'fc',
    gradient: 'from-emerald-600 via-teal-500 to-cyan-400',
    shadowColor: 'rgba(16, 185, 129, 0.5)',
    accentColor: '#10b981',
    icon: '⚽',
    activePilots: 189,
    openLobbies: 12,
    description: 'جامعه رقابت‌های آلتیمیت تیم، پرو کلابز ۱۱ نفره و تورنومنت‌های جایزه‌دار پی‌اس‌فایو و پی‌سی.',
    coordinates: { x: 74, y: 26 },
    size: 125,
    hubs: [
      { id: 'fc-general', name: 'چت عمومی استادیوم', type: 'chat', activeCount: 92 },
      { id: 'fc-voice', name: 'ویس روم مسابقات ۱v۱ دوستانه', type: 'voice', activeCount: 14 },
      { id: 'fc-proclubs', name: 'باشگاه رسمی پرو کلابز ایرانیان', type: 'tournament', activeCount: 22 },
    ],
    musicTrack: 'Stadium Anthem & Crowds 24/7',
  },
  {
    id: 'planet-dota2',
    name: 'سیاره دوتا ۲ (Ancient Sanctum)',
    subTitle: 'Dota 2 & Strategy Realm',
    genre: 'موبا و استراتژیک',
    slug: 'dota2',
    gradient: 'from-red-600 via-rose-500 to-amber-600',
    shadowColor: 'rgba(239, 68, 68, 0.5)',
    accentColor: '#ef4444',
    icon: '⚔️',
    activePilots: 115,
    openLobbies: 6,
    description: 'هماهنگی پارتی‌های رنکد، تماشای تورنومنت‌های میجر و اینترنشنال با پینگ فوق‌العاده.',
    coordinates: { x: 30, y: 72 },
    size: 105,
    hubs: [
      { id: 'dota-chat', name: 'تالار استراتژی و پیک‌ها', type: 'chat', activeCount: 48 },
      { id: 'dota-voice', name: 'اتاق ویس لابی کاستوم ۵v۵', type: 'voice', activeCount: 10 },
    ],
    musicTrack: 'The International Live Cast',
  },
  {
    id: 'planet-valorant',
    name: 'سیاره والورانت (Radiant Haven)',
    subTitle: 'Valorant & Future Tactics',
    genre: 'هیرو شوتر',
    slug: 'val',
    gradient: 'from-pink-600 via-fuchsia-500 to-rose-400',
    shadowColor: 'rgba(236, 72, 153, 0.5)',
    accentColor: '#ec4899',
    icon: '🎯',
    activePilots: 168,
    openLobbies: 11,
    description: 'لابی‌های پر انرژی، لاین‌آپ‌های سووا و وایپر، کلن‌وارز و کاستوم‌های ۲۴ ساعته.',
    coordinates: { x: 68, y: 74 },
    size: 115,
    hubs: [
      { id: 'val-chat', name: 'چت رادیانت‌ها و تیم‌یابی', type: 'chat', activeCount: 77 },
      { id: 'val-voice', name: 'اسکوات ۵ نفره رنک ایمورتال', type: 'voice', activeCount: 5 },
    ],
    musicTrack: 'VCT Champions Tokyo Synth',
  },
  {
    id: 'planet-hub',
    name: 'سیاره مرکزی نکسوس (Nexus Prime)',
    subTitle: 'The Central Social Metropolis',
    genre: 'چت آزاد و دورهمی عمومی',
    slug: 'prime',
    gradient: 'from-purple-600 via-indigo-600 to-cyan-500',
    shadowColor: 'rgba(168, 85, 247, 0.6)',
    accentColor: '#a855f7',
    icon: '🌌',
    activePilots: 340,
    openLobbies: 25,
    description: 'سیاره پایتخت کل کهکشان؛ جایی برای آشنایی، گوش دادن به موسیقی اشتراکی و مینی‌گیم‌های فضایی.',
    coordinates: { x: 50, y: 50 },
    size: 145,
    hubs: [
      { id: 'prime-chat', name: 'میدان مرکزی نکسوس', type: 'chat', activeCount: 154 },
      { id: 'prime-lounge', name: 'لاونج صوتی ۲۴/۷ و پادکست', type: 'voice', activeCount: 38 },
      { id: 'prime-games', name: 'پاد بازی‌های چندنفره سریع', type: 'tournament', activeCount: 18 },
    ],
    musicTrack: 'Interstellar Lo-Fi Radio (Chill)',
  },
];

export default function GalaxyUniverseApp() {
  const [activePlanet, setActivePlanet] = useState<PlanetWorld | null>(null);
  const [selectedHub, setSelectedHub] = useState<string>('prime-chat');
  const [activeUser, setActiveUser] = useState<User>(currentUser);
  const [isCopied, setIsCopied] = useState(false);

  // Audio / Mic
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(true);

  // Modals
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Chat message stream within a planet
  const [messages, setMessages] = useState<Message[]>(initialMessages['ch_1'] || []);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Check URL hash for direct planet link: e.g. #cs2 or #fc
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash) {
        const found = PLANET_WORLDS.find((p) => p.slug === hash);
        if (found) {
          setActivePlanet(found);
          setSelectedHub(found.hubs[0]?.id || '');
        }
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleSelectPlanet = (planet: PlanetWorld) => {
    setActivePlanet(planet);
    setSelectedHub(planet.hubs[0]?.id || '');
    window.location.hash = planet.slug;
    confetti({
      particleCount: 40,
      spread: 60,
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
    if (!chatInput.trim()) return;

    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      userId: activeUser.id,
      userName: activeUser.name,
      userAvatarStyle: activeUser.avatarStyle,
      role: activeUser.role,
      roleColor: activePlanet?.accentColor || '#a855f7',
      content: chatInput.trim(),
      timestamp: new Date().toLocaleTimeString('fa-IR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      reactions: [],
    };

    setMessages((prev) => [...prev, newMsg]);
    setChatInput('');
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden deep-space-stars text-slate-100 select-none" dir="rtl">
      {/* 2. Top Galaxy Command Deck */}
      <header className="absolute top-4 left-6 right-6 h-14 rounded-2xl bg-[#090c16]/80 backdrop-blur-2xl border border-white/10 flex items-center justify-between px-6 z-50 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white text-base font-black shadow-[0_0_20px_rgba(168,85,247,0.5)]">
            🌌
          </div>
          <div>
            <div className="text-sm font-black text-white flex items-center gap-2">
              <span>کهکشان گیمینگ نکسوس</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Nexus Multiverse v3.0
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              سیاره بازی خود را انتخاب کنید یا از لینک مستقیم وارد شوید
            </p>
          </div>
        </div>

        {/* Galaxy quick switcher pills */}
        <div className="hidden lg:flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/5">
          {PLANET_WORLDS.map((planet) => {
            const isSelected = activePlanet?.id === planet.id;
            return (
              <button
                key={planet.id}
                onClick={() => handleSelectPlanet(planet)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-white/15 text-white shadow-sm border border-white/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{planet.icon}</span>
                <span>{planet.name.split(' ')[1]}</span>
              </button>
            );
          })}
        </div>

        {/* User Status Bar */}
        <div className="flex items-center gap-3">
          {/* Audio Controls */}
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

          {/* User Profile */}
          <div
            onClick={() => setIsProfileOpen(true)}
            className="flex items-center gap-2 p-1 pl-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-all"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-xs font-black text-white">
              {activeUser.name.charAt(0)}
            </div>
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-white leading-tight">{activeUser.name}</div>
              <div className="text-[10px] text-emerald-400 font-medium">خلبان آماده پرواز</div>
            </div>
          </div>
        </div>
      </header>

      {/* 3. The Main Galaxy Celestial Map (View from Space) */}
      <main className="relative w-full h-full flex items-center justify-center">
        {/* Orbital Trajectory Circles in Space */}
        <div className="orbit-ring w-[400px] h-[400px] top-1/2 left-1/2" />
        <div className="orbit-ring w-[650px] h-[650px] top-1/2 left-1/2" style={{ animationDuration: '200s' }} />
        <div className="orbit-ring w-[950px] h-[950px] top-1/2 left-1/2" style={{ animationDuration: '320s' }} />

        {/* Orbiting 3D Planet Nodes */}
        {PLANET_WORLDS.map((planet) => {
          const isSelected = activePlanet?.id === planet.id;

          return (
            <div
              key={planet.id}
              onClick={() => handleSelectPlanet(planet)}
              style={{
                left: `${planet.coordinates.x}%`,
                top: `${planet.coordinates.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className="absolute flex flex-col items-center group cursor-pointer z-20"
            >
              {/* Planet Celestial Sphere */}
              <div
                style={{
                  width: `${planet.size}px`,
                  height: `${planet.size}px`,
                  boxShadow: isSelected
                    ? `0 0 60px ${planet.shadowColor}, 0 0 100px ${planet.shadowColor}`
                    : `0 0 35px ${planet.shadowColor}`,
                }}
                className={`planet-sphere bg-gradient-to-tr ${planet.gradient} flex items-center justify-center relative`}
              >
                {/* 3D Atmospheric Ring */}
                <div className="absolute inset-[-6px] rounded-full border border-white/20 group-hover:border-white/50 transition-colors animate-pulse" />

                {/* Planet Center Icon */}
                <span className="text-3xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] filter group-hover:scale-125 transition-transform duration-300">
                  {planet.icon}
                </span>

                {/* Pilot Count Badge */}
                <div className="absolute -bottom-2 px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-[10px] font-bold text-white flex items-center gap-1 shadow-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>{planet.activePilots} پلیر</span>
                </div>
              </div>

              {/* Planet Information Card Tag */}
              <div className="mt-4 text-center transition-all group-hover:translate-y-1">
                <div className="text-sm font-extrabold text-white flex items-center gap-1.5 justify-center">
                  <span>{planet.name}</span>
                </div>
                <div className="text-[11px] text-slate-400 font-medium">{planet.genre}</div>

                {/* Direct Link Share Pill */}
                <button
                  onClick={(e) => handleCopyPlanetLink(planet, e)}
                  className="mt-2 opacity-0 group-hover:opacity-100 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-[10px] text-slate-200 font-bold transition-all flex items-center gap-1 mx-auto"
                  title="کپی لینک مستقیم ورود به این سیاره"
                >
                  <LinkIcon className="w-3 h-3 text-cyan-400" />
                  <span>کپی لینک سیاره</span>
                </button>
              </div>
            </div>
          );
        })}
      </main>

      {/* 4. Planet Surface Holographic Portal (When a planet is opened) */}
      {activePlanet && (
        <div className="absolute inset-0 z-40 bg-black/75 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-5xl h-[85vh] rounded-3xl hologram-glass overflow-hidden flex flex-col shadow-[0_0_80px_rgba(0,0,0,0.9)] border border-white/20">
            {/* Planet Header Banner */}
            <div
              className={`p-6 bg-gradient-to-r ${activePlanet.gradient} relative flex items-center justify-between shadow-lg`}
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-black/40 backdrop-blur-md border border-white/30 flex items-center justify-center text-3xl shadow-inner">
                  {activePlanet.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-2xl font-black text-white">{activePlanet.name}</h2>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-black/50 text-white font-bold border border-white/20">
                      #{activePlanet.slug}
                    </span>
                  </div>
                  <p className="text-xs text-white/90 max-w-xl font-medium">
                    {activePlanet.description}
                  </p>
                </div>
              </div>

              {/* Actions: Copy Planet Link & Close */}
              <div className="flex items-center gap-2.5">
                <button
                  onClick={(e) => handleCopyPlanetLink(activePlanet, e)}
                  className="px-4 py-2 rounded-xl bg-black/40 hover:bg-black/60 text-white text-xs font-bold border border-white/25 flex items-center gap-1.5 transition-all shadow-md"
                >
                  {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-cyan-300" />}
                  <span>{isCopied ? 'لینک کپی شد!' : 'اشتراک لینک سیاره'}</span>
                </button>

                <button
                  onClick={() => {
                    setActivePlanet(null);
                    window.location.hash = '';
                  }}
                  className="w-10 h-10 rounded-xl bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-all border border-white/25"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Planet Hubs & Realtime Communication Workspace */}
            <div className="flex-1 flex overflow-hidden">
              {/* Hub / Station Selector Sidebar */}
              <aside className="w-64 bg-black/40 border-l border-white/10 p-4 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">
                    ایستگاه‌های فعال این سیاره
                  </div>

                  <div className="space-y-1.5">
                    {activePlanet.hubs.map((hub) => {
                      const isSelected = selectedHub === hub.id;
                      return (
                        <button
                          key={hub.id}
                          onClick={() => setSelectedHub(hub.id)}
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
                              <Radio className="w-4 h-4 text-purple-400 shrink-0" />
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
                    <span>رادیوی اختصاصی سیاره</span>
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

                  {messages.map((msg) => (
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

      {/* 5. Bottom Galaxy Flight Status */}
      <footer className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-2xl bg-[#090c16]/80 backdrop-blur-2xl border border-white/10 flex items-center gap-6 z-30 text-xs shadow-2xl">
        <div className="flex items-center gap-2 text-slate-400">
          <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>ارتباط کیهانی: آنلاین (پینگ ۱۸ms)</span>
        </div>
        <div className="w-[1px] h-3 bg-white/10" />
        <div className="flex items-center gap-2 text-slate-400">
          <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>۵ سیاره فعال در مدار</span>
        </div>
        <div className="w-[1px] h-3 bg-white/10" />
        <div className="flex items-center gap-2 text-slate-400">
          <Users className="w-3.5 h-3.5 text-purple-400" />
          <span>۹۵۴ گیمر در کهکشان</span>
        </div>
      </footer>

      {/* Modals */}
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
