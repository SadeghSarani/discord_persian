'use client';

import React from 'react';
import { fa } from '@/lib/i18n/fa';
import { Flame, Compass, Users, Sparkles, MessageSquare } from 'lucide-react';

export type NavigationTab = 'moments' | 'communities' | 'discovery' | 'friends';

interface AppNavigationProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  userXp?: number;
  userLevel?: number;
  onOpenProfile?: () => void;
  onOpenAuth?: () => void;
  onLogout?: () => void;
  isLoggedIn?: boolean;
  currentUserName?: string;
  currentUserRole?: string;
}

export default function AppNavigation({
  activeTab,
  onTabChange,
  userXp = 120,
  userLevel = 2,
  onOpenProfile,
  onOpenAuth,
  onLogout,
  isLoggedIn = true,
  currentUserName = 'کاربر دیسکافه',
  currentUserRole = 'عضو رسمی',
}: AppNavigationProps) {
  const tabs = [
    {
      id: 'moments' as NavigationTab,
      label: fa.nav.moments,
      badge: fa.common.status.live,
      icon: <Flame className="w-4 h-4" />
    },
    {
      id: 'communities' as NavigationTab,
      label: fa.nav.communities,
      badge: null,
      icon: <Users className="w-4 h-4" />
    },
    {
      id: 'discovery' as NavigationTab,
      label: fa.nav.discovery,
      badge: null,
      icon: <Compass className="w-4 h-4" />
    },
  ];

  return (
    <header className="h-14 border-b border-[var(--nexus-border)] bg-[var(--nexus-sidebar)]/80 backdrop-blur-xl flex items-center justify-between px-4 z-40 select-none text-right" dir="rtl">
      {/* Brand & Platform Identity */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[var(--nexus-primary)] to-[var(--nexus-accent)] flex items-center justify-center text-white font-black text-sm shadow-[0_0_16px_rgba(139,92,246,0.35)]">
            N
          </div>
          <div>
            <div className="text-sm font-black tracking-wide text-white flex items-center gap-1.5">
              <span>{fa.common.appName}</span>
              <span className="text-[10px] font-bold text-[var(--nexus-accent)] px-1.5 py-0.2 rounded bg-[var(--nexus-accent)]/10 border border-[var(--nexus-accent)]/25">
                {fa.common.tagline}
              </span>
            </div>
            <div className="text-[10px] text-[var(--nexus-text-muted)] -mt-0.5 font-medium">
              شبکه اجتماعی و گیمینگ نسل نو
            </div>
          </div>
        </div>

        {/* Vertical divider */}
        <div className="h-5 w-[1px] bg-[var(--nexus-border)] mx-1" />

        {/* Primary Navigation Tabs */}
        <nav className="flex items-center gap-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-[var(--nexus-surface-elevated)] text-white shadow-sm border border-[var(--nexus-border-glow)]'
                    : 'text-[var(--nexus-text-muted)] hover:text-white hover:bg-white/5'
                }`}
              >
                <span className={isActive ? 'text-[var(--nexus-accent)]' : ''}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                    {tab.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-[var(--nexus-primary)] to-[var(--nexus-accent)] rounded-full shadow-[0_0_8px_var(--nexus-accent)]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Status / XP / Quick Actions */}
      <div className="flex items-center gap-2.5">
        {/* Level & XP Capsule */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-xl bg-[var(--nexus-surface)] border border-[var(--nexus-border)]">
          <div className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[var(--nexus-accent)]" />
            <span className="text-xs font-bold text-white">سطح {userLevel}</span>
          </div>
          <div className="h-3 w-[1px] bg-[var(--nexus-border)]" />
          <div className="text-[11px] text-[var(--nexus-text-muted)] font-medium">
            <span className="text-[var(--nexus-primary-light)] font-bold">{userXp}</span> امتیاز
          </div>
        </div>

        {/* Auth / Profile Button */}
        {isLoggedIn ? (
          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl bg-[var(--nexus-surface)] hover:bg-[var(--nexus-surface-elevated)] hover:border-[var(--nexus-primary)] border border-[var(--nexus-border)] transition-all"
            >
              <div className="text-right hidden md:block">
                <div className="text-xs font-bold text-white leading-tight">{currentUserName}</div>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1 justify-end font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {currentUserRole}
                </div>
              </div>
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[var(--nexus-primary)] to-[var(--nexus-accent)] flex items-center justify-center text-xs font-bold text-white shadow-sm">
                {currentUserName.charAt(0).toUpperCase()}
              </div>
            </button>

            {onLogout && (
              <button
                onClick={onLogout}
                title={fa.auth.logout}
                className="px-3 py-1.5 rounded-xl bg-[var(--nexus-surface)] border border-[var(--nexus-border)] hover:bg-rose-500/10 hover:border-rose-500/30 text-[var(--nexus-text-muted)] hover:text-rose-400 transition-all text-xs font-medium"
              >
                {fa.auth.logout}
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[var(--nexus-primary)] to-[var(--nexus-primary-dark)] text-white text-xs font-bold hover:shadow-[0_0_16px_rgba(139,92,246,0.4)] transition-all border border-purple-400/30"
          >
            {fa.auth.loginRegister}
          </button>
        )}
      </div>
    </header>
  );
}
