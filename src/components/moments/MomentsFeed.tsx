'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MomentItem, MomentCategory, MOMENT_CATEGORIES } from '@/types/moments';
import MomentCard from './MomentCard';
import CreateMomentModal from './CreateMomentModal';
import { realtimeClient } from '@/lib/realtime/client';
import { fa } from '@/lib/i18n/fa';
import { Flame, Plus, Search, Filter, Sparkles, RefreshCw } from 'lucide-react';

interface MomentsFeedProps {
  currentUserId?: string;
  onEnterMoment?: (moment: MomentItem) => void;
}

export default function MomentsFeed({
  currentUserId = 'user_me',
  onEnterMoment
}: MomentsFeedProps) {
  const [moments, setMoments] = useState<MomentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<MomentCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [sortOption, setSortOption] = useState<'recommended' | 'recent' | 'popular'>('recommended');
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const fetchMoments = useCallback(async (isLoadMore = false) => {
    try {
      if (!isLoadMore) setLoading(true);
      const params = new URLSearchParams();
      if (activeCategory !== 'ALL') params.set('category', activeCategory);
      if (searchQuery.trim()) params.set('search', searchQuery.trim());
      if (sortOption) params.set('sort', sortOption);
      if (isLoadMore && nextCursor) params.set('cursor', nextCursor);

      const res = await fetch(`/api/v1/moments?${params.toString()}`);
      const json = await res.json();
      const items = json.items || json.data || (Array.isArray(json) ? json : []);

      if (Array.isArray(items)) {
        if (isLoadMore) {
          setMoments((prev) => [...prev, ...items]);
        } else {
          setMoments(items);
        }
        setNextCursor(json.nextCursor || null);
        setHasMore(!!json.hasMore);
      }
    } catch (err) {
      console.error('Failed to load moments:', err);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, searchQuery, sortOption, nextCursor]);

  useEffect(() => {
    fetchMoments();
    const interval = setInterval(fetchMoments, 30000);

    realtimeClient.connect();
    realtimeClient.joinRoom('feed:moments');

    const handleMomentEvent = () => {
      fetchMoments();
    };

    realtimeClient.on('moment.created', handleMomentEvent);
    realtimeClient.on('moment.updated', handleMomentEvent);
    realtimeClient.on('moment.joined', handleMomentEvent);
    realtimeClient.on('moment.left', handleMomentEvent);
    realtimeClient.on('moment.expired', handleMomentEvent);
    realtimeClient.on('moment.cancelled', handleMomentEvent);

    return () => {
      clearInterval(interval);
      realtimeClient.leaveRoom('feed:moments');
      realtimeClient.off('moment.created', handleMomentEvent);
      realtimeClient.off('moment.updated', handleMomentEvent);
      realtimeClient.off('moment.joined', handleMomentEvent);
      realtimeClient.off('moment.left', handleMomentEvent);
      realtimeClient.off('moment.expired', handleMomentEvent);
      realtimeClient.off('moment.cancelled', handleMomentEvent);
    };
  }, [fetchMoments]);

  const handleJoin = async (id: string) => {
    try {
      const res = await fetch(`/api/v1/moments/${id}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId })
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(`خطا: ${data.error || 'امکان عضویت وجود ندارد'}`);
        return;
      }
      setMessage('✅ با موفقیت به دورهمی پیوستید! (+۱۰ امتیاز)');
      fetchMoments();
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      setMessage(`خطا در ارتباط: ${err.message}`);
    }
  };

  const handleLeave = async (id: string) => {
    try {
      const res = await fetch(`/api/v1/moments/${id}/join?userId=${currentUserId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setMessage('دورهمی را ترک کردید');
        fetchMoments();
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (err) {
      console.error('Error leaving:', err);
    }
  };

  const handleCreated = (newMoment: MomentItem) => {
    setMessage('🎉 دورهمی جدید با موفقیت ایجاد شد! (+۲۵ امتیاز)');
    fetchMoments();
    setTimeout(() => setMessage(null), 4000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--nexus-bg)] overflow-y-auto" dir="rtl">
      {/* Top Banner / Feed Header */}
      <div className="relative border-b border-[var(--nexus-border)] bg-[var(--nexus-sidebar)]/50 backdrop-blur-xl px-6 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-7 h-7 rounded-lg bg-[var(--nexus-primary)]/20 border border-[var(--nexus-primary)]/40 flex items-center justify-center text-[var(--nexus-primary-light)]">
                <Flame className="w-4 h-4" />
              </div>
              <h1 className="text-xl md:text-2xl font-black text-white tracking-wide">
                {fa.moments.title}
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[var(--nexus-accent)]/15 text-[var(--nexus-accent)] font-bold border border-[var(--nexus-accent)]/30">
                {fa.common.status.live}
              </span>
            </div>
            <p className="text-xs md:text-sm text-[var(--nexus-text-muted)] max-w-xl font-medium">
              {fa.moments.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsCreateOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[var(--nexus-primary)] to-[var(--nexus-primary-dark)] hover:opacity-95 text-white font-bold text-xs shadow-[0_0_20px_rgba(139,92,246,0.35)] transition-all flex items-center gap-2 active:scale-95 border border-purple-400/30"
            >
              <Plus className="w-4 h-4" />
              <span>{fa.moments.create}</span>
            </button>
          </div>
        </div>

        {/* Status notification toast */}
        {message && (
          <div className="mt-4 p-3 rounded-xl bg-[var(--nexus-surface-elevated)] border border-[var(--nexus-border-glow)] text-xs font-semibold text-white max-w-md animate-in fade-in slide-in-from-top-2">
            {message}
          </div>
        )}
      </div>

      {/* Filter and Categories Rail */}
      <div className="border-b border-[var(--nexus-border)] bg-[var(--nexus-sidebar)]/30 px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
            <button
              onClick={() => setActiveCategory('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeCategory === 'ALL'
                  ? 'bg-[var(--nexus-surface-elevated)] text-white border border-[var(--nexus-border-glow)]'
                  : 'text-[var(--nexus-text-muted)] hover:text-white hover:bg-white/5'
              }`}
            >
              {fa.moments.categories.all}
            </button>
            {MOMENT_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  activeCategory === cat.id
                    ? 'bg-[var(--nexus-surface-elevated)] text-white border border-[var(--nexus-border-glow)]'
                    : 'text-[var(--nexus-text-muted)] hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.nameFa}</span>
              </button>
            ))}
          </div>

          {/* Search bar & Sort */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-[var(--nexus-text-dim)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={fa.moments.search}
                className="w-full pr-9 pl-3 py-1.5 rounded-xl bg-[var(--nexus-surface)] border border-[var(--nexus-border)] text-xs text-white placeholder:text-[var(--nexus-text-dim)] focus:outline-none focus:border-[var(--nexus-primary)] transition-all font-medium"
              />
            </div>

            <select
              value={sortOption}
              onChange={(e: any) => setSortOption(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[var(--nexus-surface)] border border-[var(--nexus-border)] text-xs text-[var(--nexus-text-muted)] hover:text-white focus:outline-none focus:border-[var(--nexus-primary)] font-medium cursor-pointer"
            >
              <option value="recommended">{fa.moments.filter.recommended}</option>
              <option value="recent">{fa.moments.filter.newest}</option>
              <option value="popular">{fa.moments.filter.popular}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Moments */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-6">
        {loading && moments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-[var(--nexus-text-muted)]">
            <RefreshCw className="w-8 h-8 animate-spin text-[var(--nexus-primary)] mb-3" />
            <p className="text-xs font-medium">{fa.common.status.loading}</p>
          </div>
        ) : moments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[var(--nexus-surface)] border border-[var(--nexus-border)] flex items-center justify-center text-3xl mb-4 text-[var(--nexus-text-dim)]">
              ⚡
            </div>
            <h3 className="text-base font-bold text-white mb-1.5">{fa.moments.empty}</h3>
            <p className="text-xs text-[var(--nexus-text-muted)] max-w-sm mb-5">
              در حال حاضر رویداد فعالی در این بخش نیست. اولین نفری باشید که دورهمی جدیدی می‌سازد!
            </p>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="px-4 py-2 rounded-xl bg-[var(--nexus-primary)] text-white text-xs font-bold shadow-md hover:bg-[var(--nexus-primary-light)] transition-all"
            >
              {fa.moments.create}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {moments.map((moment) => (
              <MomentCard
                key={moment.id}
                moment={moment}
                currentUserId={currentUserId}
                onJoin={handleJoin}
                onLeave={handleLeave}
                onClick={onEnterMoment}
              />
            ))}
          </div>
        )}

        {hasMore && (
          <div className="flex justify-center mt-8 pb-8">
            <button
              onClick={() => fetchMoments(true)}
              className="px-5 py-2 rounded-xl bg-[var(--nexus-surface)] border border-[var(--nexus-border)] hover:bg-[var(--nexus-surface-elevated)] text-xs font-bold text-white transition-all"
            >
              {fa.common.actions.loadMore}
            </button>
          </div>
        )}
      </div>

      <CreateMomentModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={handleCreated}
      />
    </div>
  );
}
