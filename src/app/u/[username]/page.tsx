import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { ProfileService } from '@/modules/social/services/profileService';
import { notFound } from 'next/navigation';
import { GamerAvatar } from '@/components/GamerAvatar';

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const profile = await ProfileService.getPublicProfile(username);

  if (!profile) {
    return {
      title: 'کاربر یافت نشد | دیسکافه نکسوس',
    };
  }

  return {
    title: `${profile.name} (@${profile.username}) | پروفایل گیمری نکسوس`,
    description: profile.bio || `مشاهده پروفایل و فعالیت‌های گیمری ${profile.name} در دیسکافه نکسوس`,
    openGraph: {
      title: `${profile.name} (@${profile.username})`,
      description: profile.bio || 'پلتفرم اجتماعی و گیمینگ نکسوس',
      siteName: 'DISCAF NEXUS',
      locale: 'fa_IR',
      type: 'profile',
    },
  };
}

async function ProfileContent({ params }: Props) {
  const { username } = await params;
  const profile = await ProfileService.getPublicProfile(username);

  if (!profile) {
    notFound();
  }

  const isRestricted = (profile as any).isPrivate;

  return (
    <div className="w-full max-w-2xl bg-[var(--nexus-surface)] border border-[var(--nexus-border)] rounded-3xl overflow-hidden shadow-2xl">
      {/* Banner */}
      <div
        className="h-36 w-full"
        style={{ background: (profile as any).bannerStyle || 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)' }}
      />

      {/* Profile Header */}
      <div className="px-6 pb-6 relative">
        <div className="flex justify-between items-end -mt-14 mb-4">
          <div className="p-1.5 rounded-2xl bg-[var(--nexus-surface)] border-2 border-[var(--nexus-border)] shadow-lg inline-block">
            <GamerAvatar styleId={profile.avatarStyle} size={84} />
          </div>

          <div className="flex items-center gap-2">
            {profile.xp && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[var(--nexus-surface-elevated)] border border-[var(--nexus-border)] text-xs font-bold text-[var(--nexus-secondary)]">
                <span>⚡ Lv.{profile.xp.level}</span>
                <span className="text-[var(--nexus-text-muted)] font-normal">({profile.xp.totalXp} XP)</span>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-white">{profile.name}</h1>
            {profile.isVerified && <span className="text-blue-400 text-sm" title="کاربر تاییدشده">✓</span>}
          </div>
          <div className="text-xs text-[var(--nexus-text-muted)] font-mono dir-ltr text-right mt-0.5" dir="ltr">
            @{profile.username}
          </div>

          {profile.customStatus && (
            <div className="mt-2.5 inline-block text-xs px-2.5 py-1 rounded-lg bg-[var(--nexus-surface-elevated)] border border-[var(--nexus-border)] text-[var(--nexus-text)]">
              {profile.customStatus}
            </div>
          )}
        </div>

        {isRestricted ? (
          <div className="mt-8 p-6 text-center border border-dashed border-[var(--nexus-border)] rounded-2xl bg-[var(--nexus-surface-elevated)]/40">
            <div className="text-3xl mb-2">🔒</div>
            <h3 className="text-sm font-bold text-white mb-1">این حساب کاربری خصوصی است</h3>
            <p className="text-xs text-[var(--nexus-text-muted)]">
              اطلاعات و فعالیت‌های این کاربر فقط برای دوستان یا خودش قابل مشاهده است.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            {profile.bio && (
              <div>
                <h3 className="text-xs font-bold text-[var(--nexus-text-muted)] mb-1.5">درباره من</h3>
                <p className="text-xs leading-relaxed text-gray-200">{profile.bio}</p>
              </div>
            )}

            {/* Interests Tags */}
            {profile.interests && profile.interests.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-[var(--nexus-text-muted)] mb-2">علاقه‌مندی‌ها</h3>
                <div className="flex flex-wrap gap-1.5">
                  {profile.interests.map((it: any) => (
                    <span
                      key={it.id}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--nexus-surface-elevated)] border border-[var(--nexus-border)] text-xs text-white"
                    >
                      <span>{it.icon}</span>
                      <span>{it.nameFa}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Social Links */}
            {profile.socialLinks && profile.socialLinks.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-[var(--nexus-text-muted)] mb-2">شبکه‌های اجتماعی</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.socialLinks.map((sl: any) => (
                    <a
                      key={sl.platform}
                      href={sl.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 rounded-lg bg-[var(--nexus-primary)]/10 text-[var(--nexus-primary)] border border-[var(--nexus-primary)]/30 text-xs hover:bg-[var(--nexus-primary)]/20 transition capitalize"
                    >
                      {sl.platform} ↗
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Badges */}
            {profile.badges && profile.badges.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-[var(--nexus-text-muted)] mb-2">نشان‌ها و مدال‌ها</h3>
                <div className="flex gap-2">
                  {profile.badges.map((b: any) => (
                    <div
                      key={b.id}
                      title={b.nameFa}
                      className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-lg shadow-sm"
                    >
                      {b.icon}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PublicProfilePage(props: Props) {
  return (
    <div className="min-h-screen w-full bg-[var(--nexus-bg)] text-[var(--nexus-text)] flex justify-center py-12 px-4" dir="rtl">
      <Suspense fallback={
        <div className="w-full max-w-2xl bg-[var(--nexus-surface)] border border-[var(--nexus-border)] rounded-3xl p-12 text-center text-xs text-[var(--nexus-text-muted)]">
          در حال بارگذاری پروفایل کاربر...
        </div>
      }>
        <ProfileContent {...props} />
      </Suspense>
    </div>
  );
}
