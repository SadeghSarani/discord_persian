import { SolarSystem, PlanetWorld } from '../types/planet';

export const SOLAR_SYSTEMS_CONFIG: Omit<SolarSystem, 'planets'>[] = [
  {
    id: 'system-prime',
    name: 'منظومه مرکزی نکسوس (Nexus Metropolis)',
    englishName: 'Central Social Galaxy',
    description: 'هاب اصلی دورهمی، چت عمومی، پادکست‌های شبانه و رویدادهای زنده.',
    icon: '🌌',
    glyph: 'core',
    bannerGradient: 'from-purple-600 via-indigo-600 to-cyan-500',
    glowColor: 'rgba(168, 85, 247, 0.6)',
    accentColor: '#a855f7',
    coordinates: { x: 50, y: 50 },
    size: 150,
  },
  {
    id: 'system-fps-esports',
    name: 'منظومه شوتر و رقابتی (Tactical FPS & MOBA)',
    englishName: 'Esports & Competitive Realm',
    description: 'جهان پرمیر کانتر، لابی‌های ایمورتال والورانت و میدان دوتا ۲.',
    icon: '🎯',
    glyph: 'quests',
    bannerGradient: 'from-amber-600 via-red-600 to-rose-600',
    glowColor: 'rgba(245, 158, 11, 0.6)',
    accentColor: '#f59e0b',
    coordinates: { x: 20, y: 32 },
    size: 130,
  },
  {
    id: 'system-dev-tech',
    name: 'منظومه برنامه‌نویسی و تک (Dev & Tech Sector)',
    englishName: 'Software Engineering & AI',
    description: 'تالار مهندسان کامپیوتر، کامیونیتی‌های هوش مصنوعی، لینوکس و دیباگ شبانه.',
    icon: '💻',
    glyph: 'ai',
    bannerGradient: 'from-cyan-600 via-blue-600 to-indigo-600',
    glowColor: 'rgba(6, 182, 212, 0.6)',
    accentColor: '#06b6d4',
    coordinates: { x: 80, y: 30 },
    size: 130,
  },
  {
    id: 'system-sports-racing',
    name: 'منظومه ورزش و مسابقه (Sports & Simulators)',
    englishName: 'FC Football & Racing Universe',
    description: 'مسابقات هفتگی دیویژن ریوالز، کلابز آنلاین و تورنومنت‌های راکت‌لیگ.',
    icon: '⚽',
    glyph: 'achievements',
    bannerGradient: 'from-emerald-600 via-teal-600 to-cyan-600',
    glowColor: 'rgba(16, 185, 129, 0.6)',
    accentColor: '#10b981',
    coordinates: { x: 22, y: 72 },
    size: 130,
  },
  {
    id: 'system-sandbox-rp',
    name: 'منظومه جهان‌های باز و رول‌پلی (Sandbox & Roleplay)',
    englishName: 'Roleplay & Open Worlds',
    description: 'سرورهای فایوم، ماینکرفت هاردکور، سوروایوال راست و سرگرمی‌های بی‌پایان.',
    icon: '🧱',
    glyph: 'explore',
    bannerGradient: 'from-rose-600 via-orange-600 to-amber-500',
    glowColor: 'rgba(244, 63, 94, 0.6)',
    accentColor: '#f43f5e',
    coordinates: { x: 78, y: 72 },
    size: 130,
  },
  {
    id: 'system-art-anime',
    name: 'منظومه هنر، سینما و انیمه (Creative Arts & Otaku)',
    englishName: 'Anime, Design & Media',
    description: 'اتاق‌های انیمه، نقد فیلم، تبادل طرح‌های گرافیکی و پلی‌لیست‌های لوفای.',
    icon: '🌸',
    glyph: 'moments',
    bannerGradient: 'from-pink-600 via-fuchsia-600 to-purple-600',
    glowColor: 'rgba(236, 72, 153, 0.6)',
    accentColor: '#ec4899',
    coordinates: { x: 50, y: 86 },
    size: 125,
  },
];

// Definition of curated planets grouped by solar system
const SYSTEM_PLANETS_MAP: Record<string, Omit<PlanetWorld, 'systemId' | 'coordinates'>[]> = {
  'system-prime': [
    {
      id: 'planet-prime',
      name: 'سیاره مرکزی نکسوس (Nexus Prime)',
      subTitle: 'The Central Social Metropolis',
      genre: 'چت عمومی و دورهمی گیمرها',
      slug: 'prime',
      theme: 'prime',
      hasRings: true,
      gradient: 'from-purple-600 via-indigo-600 to-cyan-500',
      shadowColor: 'rgba(168, 85, 247, 0.6)',
      accentColor: '#a855f7',
      icon: '🌌',
      activePilots: 340,
      openLobbies: 25,
      description: 'پایتخت کهکشان نکسوس برای گفتگوی آزاد، آشنایی با بازیکنان، پخش موسیقی و دورهمی.',
      size: 145,
      hubs: [
        { id: 'prime-chat', name: 'تالار گفتگوی همگانی', type: 'chat', activeCount: 154 },
        { id: 'prime-lounge', name: 'لاونج صوتی ۲۴ ساعته', type: 'voice', activeCount: 42 },
        { id: 'prime-games', name: 'رویدادها و مینی‌گیم‌ها', type: 'tournament', activeCount: 19 },
      ],
      musicTrack: 'Interstellar Lo-Fi Radio (Chill)',
    },
    {
      id: 'planet-cafe',
      name: 'سیاره کافه دیسکاف (Midnight Lounge)',
      subTitle: 'Late Night Talks & Chill',
      genre: 'گفتگوهای شبانه و لوفای',
      slug: 'lounge',
      theme: 'prime',
      gradient: 'from-indigo-600 via-purple-600 to-pink-500',
      shadowColor: 'rgba(99, 102, 241, 0.5)',
      accentColor: '#6366f1',
      icon: '☕',
      activePilots: 180,
      openLobbies: 12,
      description: 'فضایی آرام برای گوش دادن به موزیک، هم‌صحبتی شبانه و تجدید قوا.',
      size: 105,
      hubs: [
        { id: 'lounge-chat', name: 'چت دنج و احوالپرسی', type: 'chat', activeCount: 65 },
        { id: 'lounge-voice', name: 'ویس‌روم کافه موسیقی', type: 'voice', activeCount: 22 },
      ],
      musicTrack: 'Late Night Coffee Lo-Fi Beats',
    },
    {
      id: 'planet-podcast',
      name: 'سیاره استودیو پادکست (Nexus Broadcast)',
      subTitle: 'Live Panels & Discussions',
      genre: 'استیج صوتی و مصاحبه',
      slug: 'podcast',
      theme: 'prime',
      hasRings: true,
      gradient: 'from-cyan-600 via-blue-600 to-violet-600',
      shadowColor: 'rgba(6, 182, 212, 0.5)',
      accentColor: '#06b6d4',
      icon: '🎙️',
      activePilots: 120,
      openLobbies: 6,
      description: 'برگزاری اتاق‌های گفتگو با حضور سخنرانان، کارشناسان و بحث‌های داغ.',
      size: 100,
      hubs: [
        { id: 'podcast-stage', name: 'استیج اصلی برنامه زنده', type: 'voice', activeCount: 45 },
        { id: 'podcast-chat', name: 'چت متنی حضار و پرسش و پاسخ', type: 'chat', activeCount: 75 },
      ],
      musicTrack: 'Broadcast Ambient Tune',
    },
  ],

  'system-fps-esports': [
    {
      id: 'planet-cs2',
      name: 'سیاره کانتر ۲ (Dust Orbit)',
      subTitle: 'Counter-Strike 2 & Tactical FPS',
      genre: 'شوتینگ تاکتیکال و پرمیر',
      slug: 'cs2',
      theme: 'cs2',
      gradient: 'from-amber-600 via-orange-500 to-yellow-400',
      shadowColor: 'rgba(245, 158, 11, 0.5)',
      accentColor: '#f59e0b',
      icon: '💣',
      activePilots: 215,
      openLobbies: 14,
      description: 'پایگاه لابی‌های کامپتیتیو، پرمیر، مچ‌های ۵v۵ و تمرین اسموک و ریتیک.',
      size: 120,
      hubs: [
        { id: 'cs-general', name: 'چت متنی و هماهنگی اسکواد', type: 'chat', activeCount: 85 },
        { id: 'cs-lobby1', name: 'اتاق صوتی پرمیر رنک +۱۵k', type: 'voice', activeCount: 8 },
        { id: 'cs-tourney', name: 'جام هفتگی CS2 نکسوس', type: 'tournament', activeCount: 32 },
      ],
      musicTrack: 'Dust II Combat Radio (Live)',
    },
    {
      id: 'planet-valorant',
      name: 'سیاره والورانت (Radiant Haven)',
      subTitle: 'Valorant & Hero Shooter',
      genre: 'شوتر قهرمان‌محور و رنکد',
      slug: 'valorant',
      theme: 'val',
      hasRings: true,
      gradient: 'from-pink-600 via-rose-500 to-indigo-400',
      shadowColor: 'rgba(236, 72, 153, 0.5)',
      accentColor: '#ec4899',
      icon: '🎯',
      activePilots: 195,
      openLobbies: 11,
      description: 'کلن‌های ایمورتال و رادیانت، ترکیب ابیلیتی‌ها و تاکتیک‌های پلنت و دیفیوز.',
      size: 115,
      hubs: [
        { id: 'val-chat', name: 'چت تاکتیکال و تیم‌یابی', type: 'chat', activeCount: 78 },
        { id: 'val-voice', name: 'ویس‌روم رنک اسندنت/رادیانت', type: 'voice', activeCount: 14 },
      ],
      musicTrack: 'Die For You - Valorant Remix',
    },
    {
      id: 'planet-dota2',
      name: 'سیاره دوتا ۲ (Ancient Sanctum)',
      subTitle: 'Dota 2 & Strategy Multiverse',
      genre: 'موبا و استراتژی رقابتی',
      slug: 'dota2',
      theme: 'dota2',
      gradient: 'from-rose-600 via-red-500 to-amber-500',
      shadowColor: 'rgba(239, 68, 68, 0.5)',
      accentColor: '#ef4444',
      icon: '⚔️',
      activePilots: 165,
      openLobbies: 9,
      description: 'هماهنگی پارتی‌های رنک، اسکوادهای بتل‌کاپ و کل کل گیمرهای هاردکور.',
      size: 115,
      hubs: [
        { id: 'dota-chat', name: 'پارتی‌یابی و کل‌کل رقابتی', type: 'chat', activeCount: 62 },
        { id: 'dota-voice', name: 'ویس‌روم کاپیتانز مود', type: 'voice', activeCount: 10 },
      ],
      musicTrack: 'The International Dota 2 Theme',
    },
    {
      id: 'planet-apex',
      name: 'سیاره اپکس لجندز (Outlands Rift)',
      subTitle: 'Apex Legends Battle Royale',
      genre: 'بتل رویال و موومنت سریع',
      slug: 'apex',
      theme: 'apex',
      gradient: 'from-orange-600 via-amber-500 to-red-400',
      shadowColor: 'rgba(249, 115, 22, 0.5)',
      accentColor: '#f97316',
      icon: '🔥',
      activePilots: 140,
      openLobbies: 8,
      description: 'اسکوادهای ۳ نفره، روتین‌های فرود در هات‌دراپ و پیروزی‌های پیاپی.',
      size: 105,
      hubs: [
        { id: 'apex-chat', name: 'اسکوادیابی رنک مستر/پردیتور', type: 'chat', activeCount: 52 },
        { id: 'apex-voice', name: 'ویس روم موومنت و فرود سریع', type: 'voice', activeCount: 9 },
      ],
      musicTrack: 'Apex Legends Electronic Theme',
    },
    {
      id: 'planet-warzone',
      name: 'سیاره کالاف وارزون (Citadel Urzikstan)',
      subTitle: 'Warzone & Modern Warfare',
      genre: 'بتل رویال نظامی',
      slug: 'warzone',
      theme: 'cs2',
      gradient: 'from-stone-700 via-amber-600 to-yellow-600',
      shadowColor: 'rgba(217, 119, 6, 0.5)',
      accentColor: '#d97706',
      icon: '🪖',
      activePilots: 175,
      openLobbies: 12,
      description: 'هایست‌های سنگین، بهترین لوداوت‌های گان‌اسمیت و پیروزی در گولاگ.',
      size: 110,
      hubs: [
        { id: 'wz-chat', name: 'هماهنگی اسکواد ۴ نفره', type: 'chat', activeCount: 71 },
        { id: 'wz-voice', name: 'بیسیم صوتی تاکتیکال', type: 'voice', activeCount: 16 },
      ],
      musicTrack: 'Modern Warfare Tactical Comms',
    },
  ],

  'system-dev-tech': [
    {
      id: 'planet-devs',
      name: 'سیاره کد و نرم‌افزار (Code Nebulae)',
      subTitle: 'Devs, Programmers & Engineers',
      genre: 'فرانت‌اند، بک‌اند و اوپن‌سورس',
      slug: 'devs',
      theme: 'prime',
      hasRings: true,
      gradient: 'from-violet-700 via-indigo-600 to-cyan-400',
      shadowColor: 'rgba(99, 102, 241, 0.5)',
      accentColor: '#6366f1',
      icon: '💻',
      activePilots: 280,
      openLobbies: 18,
      description: 'کدریویو، معرفی ابزارهای مدرن وب، تبادل تجربه پروژه‌ها و دیباگ شبانه.',
      size: 125,
      hubs: [
        { id: 'dev-chat', name: 'گفتگوی فنی و دیباگ کد', type: 'chat', activeCount: 112 },
        { id: 'dev-voice', name: 'اتاق هم‌اندیشی و استریم کد', type: 'voice', activeCount: 18 },
      ],
      musicTrack: 'Synthesizer Coding Flow',
    },
    {
      id: 'planet-ai',
      name: 'سیاره هوش مصنوعی (Deep Neural Hub)',
      subTitle: 'Machine Learning, LLMs & Agents',
      genre: 'مدل‌های زبانی و پردازش هوشمند',
      slug: 'ai-core',
      theme: 'prime',
      gradient: 'from-cyan-600 via-teal-500 to-emerald-400',
      shadowColor: 'rgba(6, 182, 212, 0.5)',
      accentColor: '#06b6d4',
      icon: '🤖',
      activePilots: 210,
      openLobbies: 14,
      description: 'بررسی معماری‌های جدید یادگیری ماشین، پرامپت‌نویسی و ساخت ایجنت‌های هوشمند.',
      size: 115,
      hubs: [
        { id: 'ai-chat', name: 'بحث‌های مدل‌های هوش مصنوعی', type: 'chat', activeCount: 88 },
        { id: 'ai-voice', name: 'وبینار هفتگی ایجنت‌ها', type: 'voice', activeCount: 15 },
      ],
      musicTrack: 'Neural Pulse Ambient Sound',
    },
    {
      id: 'planet-linux',
      name: 'سیاره لینوکس و دواپس (Kernel Terminal)',
      subTitle: 'SysAdmin, Docker & Security',
      genre: 'زیرساخت، سرور و امنیت سایبری',
      slug: 'linux',
      theme: 'gta',
      gradient: 'from-emerald-700 via-green-600 to-cyan-600',
      shadowColor: 'rgba(16, 185, 129, 0.5)',
      accentColor: '#10b981',
      icon: '🐧',
      activePilots: 145,
      openLobbies: 8,
      description: 'کانفیگ سرورهای لینوکس، کانتینرها، پایپ‌لاین‌های CI/CD و تست نفوذ.',
      size: 105,
      hubs: [
        { id: 'linux-chat', name: 'ترمینال عمومی و حل اشکال', type: 'chat', activeCount: 65 },
        { id: 'linux-voice', name: 'اتاق صوتی متخصصان سرور', type: 'voice', activeCount: 12 },
      ],
      musicTrack: 'Terminal Cyber Grid',
    },
  ],

  'system-sports-racing': [
    {
      id: 'planet-fc27',
      name: 'سیاره فوتبال ۲۷ (San Siro Core)',
      subTitle: 'EA FC & Football Universe',
      genre: 'شبیه‌ساز فوتبال و تورنومنت',
      slug: 'fc',
      theme: 'fc',
      hasRings: true,
      gradient: 'from-emerald-600 via-teal-500 to-cyan-400',
      shadowColor: 'rgba(16, 185, 129, 0.5)',
      accentColor: '#10b981',
      icon: '⚽',
      activePilots: 230,
      openLobbies: 16,
      description: 'لابی‌های پروکلابز، مسابقات آنلاین دیویژن و تحلیل تاکتیک و التیمیت تیم.',
      size: 125,
      hubs: [
        { id: 'fc-general', name: 'چت پروکلابز و التیمیت تیم', type: 'chat', activeCount: 95 },
        { id: 'fc-voice', name: 'اتاق صوتی حین بازی و مسابقه', type: 'voice', activeCount: 22 },
        { id: 'fc-tourney', name: 'جام هفتگی قهرمانان نکسوس', type: 'tournament', activeCount: 32 },
      ],
      musicTrack: 'San Siro Stadium Anthem',
    },
    {
      id: 'planet-rocket-league',
      name: 'سیاره راکت لیگ (Octane Arena)',
      subTitle: 'Rocket League Competitive',
      genre: 'فوتبال ماشینی و آکروباتیک',
      slug: 'rocket-league',
      theme: 'prime',
      gradient: 'from-blue-600 via-cyan-500 to-amber-400',
      shadowColor: 'rgba(2, 132, 199, 0.5)',
      accentColor: '#0284c7',
      icon: '🏎️',
      activePilots: 135,
      openLobbies: 9,
      description: 'لابی‌های پرواز هوایی، تورنومنت‌های ۲v۲ و چمپیون‌های کشوری.',
      size: 110,
      hubs: [
        { id: 'rl-chat', name: 'هماهنگی دوئت و تریپل', type: 'chat', activeCount: 55 },
        { id: 'rl-voice', name: 'ویس‌روم پاسکاری و ایرریل', type: 'voice', activeCount: 12 },
      ],
      musicTrack: 'Rocket League EDM High Energy',
    },
  ],

  'system-sandbox-rp': [
    {
      id: 'planet-gta',
      name: 'سیاره سن آندریاس (Neon Los Santos)',
      subTitle: 'GTA Online & Roleplay',
      genre: 'جهان‌باز و رول‌پلی شهری',
      slug: 'gta',
      theme: 'gta',
      hasRings: true,
      gradient: 'from-rose-600 via-orange-500 to-amber-400',
      shadowColor: 'rgba(244, 63, 94, 0.5)',
      accentColor: '#f43f5e',
      icon: '🚗',
      activePilots: 290,
      openLobbies: 20,
      description: 'سرورهای فایوم (FiveM)، رول‌پلی، هایست‌های سنگین و دورهمی شبانه.',
      size: 130,
      hubs: [
        { id: 'gta-chat', name: 'تالار شهر و معاملات هایست', type: 'chat', activeCount: 115 },
        { id: 'gta-voice', name: 'بیسیم رادیویی پلیس و شهروندان', type: 'voice', activeCount: 26 },
      ],
      musicTrack: 'Los Santos Underground Radio Live',
    },
    {
      id: 'planet-minecraft',
      name: 'سیاره ماینکرفت (Voxel Universe)',
      subTitle: 'Minecraft & Creative Sandbox',
      genre: 'سندباکس و ساخت و ساز',
      slug: 'minecraft',
      theme: 'minecraft',
      gradient: 'from-emerald-600 via-green-500 to-lime-400',
      shadowColor: 'rgba(34, 197, 94, 0.5)',
      accentColor: '#22c55e',
      icon: '🟩',
      activePilots: 215,
      openLobbies: 15,
      description: 'سرورهای سوروایوال ایرانی، ساخت سازه‌های عظیم و هاردکور تیمی.',
      size: 115,
      hubs: [
        { id: 'mc-chat', name: 'چت عمومی ماینرها و معرفی سرور', type: 'chat', activeCount: 88 },
        { id: 'mc-voice', name: 'ویس روم ساخت و ساز و پروژه', type: 'voice', activeCount: 16 },
      ],
      musicTrack: 'C418 Subwoofer Lullaby Chill',
    },
  ],

  'system-art-anime': [
    {
      id: 'planet-anime',
      name: 'سیاره انیمه و مانگا (Neo Tokyo)',
      subTitle: 'Anime, Manga & Japanese Art',
      genre: 'فرهنگ انیمه و اوتاکو',
      slug: 'anime',
      theme: 'val',
      hasRings: true,
      gradient: 'from-pink-500 via-purple-500 to-rose-400',
      shadowColor: 'rgba(244, 63, 94, 0.5)',
      accentColor: '#f43f5e',
      icon: '🌸',
      activePilots: 185,
      openLobbies: 11,
      description: 'بحث و بررسی فصول فصلی انیمه‌ها، فن‌آرت‌ها و نقد و بررسی هفتگی مانگا.',
      size: 115,
      hubs: [
        { id: 'anime-chat', name: 'نقد هفتگی انیمه و اسپویلر', type: 'chat', activeCount: 80 },
        { id: 'anime-voice', name: 'واچ‌پارتی صوتی همزمان', type: 'voice', activeCount: 18 },
      ],
      musicTrack: 'Neo Tokyo Synthwave Chill',
    },
    {
      id: 'planet-cinema',
      name: 'سیاره سینما و سریال (Cinephile Hub)',
      subTitle: 'Movies, Series & Critiques',
      genre: 'فیلم، سریال و مستند',
      slug: 'cinema',
      theme: 'prime',
      gradient: 'from-amber-600 via-rose-600 to-purple-600',
      shadowColor: 'rgba(217, 119, 6, 0.5)',
      accentColor: '#d97706',
      icon: '🎬',
      activePilots: 130,
      openLobbies: 7,
      description: 'تحلیل فیلم‌های روز، پیشنهادهای هفتگی و بحث‌های داغ منتقدین سینما.',
      size: 105,
      hubs: [
        { id: 'cine-chat', name: 'بحث و تبادل نظر فیلم‌ها', type: 'chat', activeCount: 55 },
        { id: 'cine-voice', name: 'دورهمی صوتی تحلیل هفتگی', type: 'voice', activeCount: 12 },
      ],
      musicTrack: 'Cinematic Orchestral Theme',
    },
  ],
};

// Distribute planets evenly in orbital ring when inside a Solar System
function layoutPlanetsInOrbit(systemId: string, planetsList: Omit<PlanetWorld, 'systemId' | 'coordinates'>[]): PlanetWorld[] {
  const count = planetsList.length;
  const cx = 50;
  const cy = 50;

  return planetsList.map((p, idx) => {
    let x = 50;
    let y = 50;

    if (count === 1) {
      x = 50;
      y = 50;
    } else if (idx === 0) {
      // Core flagship planet in center
      x = 50;
      y = 50;
    } else {
      // Orbiting around center with ample spacing
      const orbitRadius = 32;
      const angle = ((idx - 1) / (count - 1)) * Math.PI * 2;
      x = Math.max(12, Math.min(88, Math.round(cx + Math.cos(angle) * orbitRadius * 1.25)));
      y = Math.max(16, Math.min(84, Math.round(cy + Math.sin(angle) * orbitRadius * 0.95)));
    }

    return {
      ...p,
      systemId,
      coordinates: { x, y },
    };
  });
}

// Generate all Solar Systems with their clean planetary layouts
export function getSolarSystems(adminCommunities: any[] = []): SolarSystem[] {
  const systems: SolarSystem[] = SOLAR_SYSTEMS_CONFIG.map((config) => {
    const rawPlanets = SYSTEM_PLANETS_MAP[config.id] || [];
    const planets = layoutPlanetsInOrbit(config.id, rawPlanets);
    return {
      ...config,
      planets,
    };
  });

  // Dynamically embed Admin-created Communities into the relevant solar system or prime!
  if (adminCommunities && adminCommunities.length > 0) {
    const primeSystem = systems.find((s) => s.id === 'system-prime');
    if (primeSystem) {
      adminCommunities.forEach((comm) => {
        const customPlanet: PlanetWorld = {
          id: `comm-${comm.id}`,
          systemId: 'system-prime',
          name: comm.name,
          subTitle: 'کامیونیتی رسمی ادمین',
          genre: 'سرور اختصاصی ادمین',
          slug: `comm-${comm.id}`,
          theme: 'prime',
          gradient: 'from-amber-500 via-purple-600 to-indigo-600',
          shadowColor: 'rgba(245, 158, 11, 0.6)',
          accentColor: '#f59e0b',
          icon: comm.icon || '🪐',
          activePilots: 50,
          openLobbies: 3,
          description: comm.description || 'جامعه اختصاصی ایجاد شده توسط ادمین نکسوس',
          coordinates: { x: 50 + (Math.random() * 20 - 10), y: 50 + (Math.random() * 20 - 10) },
          size: 110,
          hubs: [
            { id: `${comm.id}-general`, name: 'چت عمومی', type: 'chat', activeCount: 30 },
            { id: `${comm.id}-voice`, name: 'لابی صوتی', type: 'voice', activeCount: 8 },
          ],
          musicTrack: 'Interstellar Lo-Fi Cosmic Radio',
        };
        primeSystem.planets.push(customPlanet);
      });
      // Re-layout prime system planets cleanly
      primeSystem.planets = layoutPlanetsInOrbit('system-prime', primeSystem.planets);
    }
  }

  return systems;
}
