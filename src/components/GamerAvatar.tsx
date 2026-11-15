import React from 'react';

export type AvatarStyle =
  | 'cyber_samurai'
  | 'neon_queen'
  | 'pixel_wizard'
  | 'tactical_soldier'
  | 'retro_gamer'
  | 'cyber_cat'
  | 'dj_spark'
  | 'golden_king';

interface GamerAvatarProps {
  styleId: AvatarStyle | string;
  size?: number;
  className?: string;
  withGlow?: boolean;
}

export const avatarPresets: {
  id: AvatarStyle;
  name: string;
  emoji: string;
  gradient: string;
  borderColor: string;
  description: string;
}[] = [
  {
    id: 'golden_king',
    name: 'تاج طلایی (لیدر)',
    emoji: '👑',
    gradient: 'from-amber-400 via-yellow-500 to-amber-600',
    borderColor: '#f59e0b',
    description: 'مدیر و لیدر کلن',
  },
  {
    id: 'cyber_samurai',
    name: 'سامورایی سایبر',
    emoji: '🥷',
    gradient: 'from-purple-600 via-indigo-600 to-blue-600',
    borderColor: '#8b5cf6',
    description: 'اسنایپر پرو',
  },
  {
    id: 'neon_queen',
    name: 'ملکه نئونی',
    emoji: '🎧',
    gradient: 'from-pink-500 via-rose-500 to-purple-600',
    borderColor: '#ec4899',
    description: 'استریمر کلن',
  },
  {
    id: 'pixel_wizard',
    name: 'جادوگر پیکسل',
    emoji: '🧙‍♂️',
    gradient: 'from-indigo-600 via-sky-600 to-cyan-500',
    borderColor: '#06b6d4',
    description: 'استراتژیست باسابقه',
  },
  {
    id: 'tactical_soldier',
    name: 'تکاور شوتی',
    emoji: '🏎️',
    gradient: 'from-emerald-500 via-teal-600 to-emerald-700',
    borderColor: '#10b981',
    description: 'شوتی‌سوار و دریفتر',
  },
  {
    id: 'retro_gamer',
    name: 'گیمر کلاسیک',
    emoji: '👾',
    gradient: 'from-fuchsia-600 via-purple-700 to-indigo-800',
    borderColor: '#d946ef',
    description: 'آرکید باز و رترو',
  },
  {
    id: 'dj_spark',
    name: 'دی‌جی راکر',
    emoji: '🎸',
    gradient: 'from-cyan-500 via-blue-600 to-indigo-700',
    borderColor: '#3b82f6',
    description: 'نوازنده و دی‌جی روم',
  },
  {
    id: 'cyber_cat',
    name: 'پاپ‌کورن باز',
    emoji: '🍿',
    gradient: 'from-amber-500 via-orange-500 to-red-500',
    borderColor: '#f97316',
    description: 'فیلم‌باز سینما',
  },
];

export const GamerAvatar: React.FC<GamerAvatarProps> = ({
  styleId,
  size = 40,
  className = '',
  withGlow = false,
}) => {
  const preset =
    avatarPresets.find((p) => p.id === styleId) || avatarPresets[0];

  return (
    <div
      className={`relative rounded-2xl flex items-center justify-center select-none overflow-hidden shrink-0 transition-transform duration-200 group-hover:scale-105 ${className}`}
      style={{
        width: size,
        height: size,
        boxShadow: withGlow
          ? `0 0 16px ${preset.borderColor}66, inset 0 0 12px rgba(255,255,255,0.2)`
          : undefined,
        border: `2px solid ${preset.borderColor}`,
      }}
    >
      {/* Background Gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${preset.gradient} opacity-90`}
      />

      {/* Cyber Grid Lines SVG Pattern */}
      <svg
        className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id={`grid-${preset.id}`}
            width="8"
            height="8"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 8 0 L 0 0 0 8"
              fill="none"
              stroke="#ffffff"
              strokeWidth="0.75"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#grid-${preset.id})`} />
      </svg>

      {/* Gloss Highlight on Top */}
      <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />

      {/* Center Icon Emoji / Glyph */}
      <span
        className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
        style={{ fontSize: size * 0.52 }}
      >
        {preset.emoji}
      </span>
    </div>
  );
};

export default GamerAvatar;
