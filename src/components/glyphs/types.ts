import React from 'react';

export type NexusGlyphName =
  | 'core'
  | 'home'
  | 'explore'
  | 'moments'
  | 'signal'
  | 'communities'
  | 'friends'
  | 'messages'
  | 'voice'
  | 'video'
  | 'radar'
  | 'playground'
  | 'quests'
  | 'xp'
  | 'level'
  | 'achievements'
  | 'trending'
  | 'ai'
  | 'notifications'
  | 'profile';

export type NexusGlyphAnimation =
  | 'none'
  | 'pulse'
  | 'spin'
  | 'radar-sweep'
  | 'bounce'
  | 'glow'
  | 'wave';

export interface NexusGlyphProps extends React.SVGProps<SVGSVGElement> {
  name: NexusGlyphName;
  size?: number | string;
  strokeWidth?: number;
  active?: boolean;
  animate?: NexusGlyphAnimation;
  className?: string;
  title?: string;
}

export const GLYPH_DESCRIPTIONS: Record<NexusGlyphName, { titleFa: string; descFa: string; category: string }> = {
  core: { titleFa: 'نکسوس هسته (NexusCore)', descFa: 'نماد همگرایی مسیرهای کیهانی و شبکه‌های اجتماعی', category: 'Core Navigation' },
  home: { titleFa: 'پایگاه مداری (NexusHome)', descFa: 'پایگاه اصلی کاربر و دید کلی کهکشان', category: 'Core Navigation' },
  explore: { titleFa: 'اکتشاف (NexusExplore)', descFa: 'رصد سیارات، خوشه‌ها و لابی‌های جدید', category: 'Core Navigation' },
  moments: { titleFa: 'لحظه‌ها (NexusMoments)', descFa: 'حلقه‌ی باز رویدادهای زودگذر با نقطه تعامل مرکزی', category: 'Core Navigation' },
  signal: { titleFa: 'سیگنال (NexusSignal)', descFa: 'امواج نیت اجتماعی همگرا پیرامون هسته هدف', category: 'Core Navigation' },
  communities: { titleFa: 'سیارات و کامیونیتی‌ها', descFa: 'مدارهای تو در توی زیست‌بوم گیمرها', category: 'Core Navigation' },
  friends: { titleFa: 'دوستان و هم‌تیمی‌ها', descFa: 'پیوند گره‌های انسانی دوگانه با محور اعتماد', category: 'Core Navigation' },
  messages: { titleFa: 'سیگنال‌های متنی', descFa: 'کپسول هندسی پیام‌رسانی فوری با خطوط داده', category: 'Core Navigation' },
  voice: { titleFa: 'استیج صوتی', descFa: 'دیافراگم چندضلعی فرکانس صدا با انتشار کروی', category: 'Social Interaction' },
  video: { titleFa: 'استریم تصویری', descFa: 'لنز اپتیکال هولوگرافیک جهت پخش زنده', category: 'Social Interaction' },
  radar: { titleFa: 'رادار هوشمند', descFa: 'کمان پویشگر با گره‌های ردیابی کشف فعال', category: 'Social Interaction' },
  playground: { titleFa: 'زمین بازی نکسوس', descFa: 'چندضلعی تعاملی چندنفره و فعالیت‌های گیمینگ', category: 'Social Interaction' },
  quests: { titleFa: 'ماموریت‌های کیهانی', descFa: 'پرتوی الماس‌گون جهت دستیابی به اهداف', category: 'Gamification' },
  xp: { titleFa: 'انرژی و تجربه (XP)', descFa: 'کریستال انرژی پلاسما با شارژ دوطرفه', category: 'Gamification' },
  level: { titleFa: 'سطح و تراز خلبان', descFa: 'پله‌های سلسله‌مراتب مدار نکسوس', category: 'Gamification' },
  achievements: { titleFa: 'دستاوردها و افتخارات', descFa: 'نشان زرین پیروزی مداری با ستاره شش‌ضلعی', category: 'Gamification' },
  trending: { titleFa: 'جریان‌های داغ', descFa: 'بردار جهش نوسانی با شتاب کهکشانی', category: 'Intelligence & Activity' },
  ai: { titleFa: 'هوش شبکه نکسوس', descFa: 'ماتریس سیناپسی محاسبات عصبی', category: 'Intelligence & Activity' },
  notifications: { titleFa: 'سیگنال‌های دریافتی', descFa: 'بلور تشدیدگر هشدار با انتشار امواج', category: 'Intelligence & Activity' },
  profile: { titleFa: 'هویت مداری خلبان', descFa: 'کپسول شناسه بایومتریک کاربر', category: 'Intelligence & Activity' },
};
