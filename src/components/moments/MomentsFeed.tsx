'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MomentItem, MomentCategory, MOMENT_CATEGORIES } from '@/types/moments';
import MomentCard from './MomentCard';
import CreateMomentModal from './CreateMomentModal';
import { realtimeClient } from '@/lib/realtime/client';
import { Flame, Plus, Search, Filter, RefreshCw } from 'lucide-react';

interface MomentsFeedProps {
  currentUserId?: string;
  onEnterMoment?: (moment: MomentItem) => void;
  onBackToChat?: () => void;
}

export default function MomentsFeed({
  currentUserId = 'user_me',
  onEnterMoment,
  onBackToChat,
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

  const fetchMoments = useCallback(
    async (isLoadMore = false) => {
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
    },
    [activeCategory, searchQuery, sortOption, nextCursor]
  );

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
        body: JSON.stringify({ userId: currentUserId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(`خطا: ${data.error || 'امکان عضویت وجود ندارد'}`);
        return;
      }
      setMessage('✅ با موفقیت به دورهمی پیوستید!');
      fetchMoments();
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      setMessage(`خطا در ارتباط: ${err.message}`);
    }
  };

  const handleLeave = async (id: string) => {
    try {
      const res = await fetch(`/api/v1/moments/${id}/join?userId=${currentUserId}`, {
        method: 'DELETE',
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
    setMessage('🎉 دورهمی جدید با موفقیت ایجاد شد!');
    fetchMoments();
    setTimeout(() => setMessage(null), 4000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#313338] overflow-y-auto" dir="rtl">
      {/* Discord Header for Moments */}
      <header className="h-12 px-6 border-b border-[#1f2023] flex items-center justify-between bg-[#313338] shrink-0">
        <div className="flex items-center gap-2.5">
          <Flame className="w-5 h-5 text-[#eb459e]" />
          <h1 className="text-sm font-extrabold text-white">دورهمی‌ها و رویدادهای زنده</h1>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#eb459e]/20 text-[#eb459e] font-bold">
            فعال
          </span>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-3.5 py-1.5 rounded-[4px] bg-[#5865F2] hover:bg-[#4752c4] text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>ساخت دورهمی</span>
        </button>
      </header>

      {/* Categories & Filter Bar */}
      <div className="border-b border-[#1f2023] bg-[#2b2d31] px-6 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
          <button
            onClick={() => setActiveCategory('ALL')}
            className={`px-3 py-1 rounded-[4px] text-xs font-bold transition-colors ${
              activeCategory === 'ALL'
                ? 'bg-[#404249] text-white'
                : 'text-[#949ba4] hover:bg-[#35373c] hover:text-[#dbdee1]'
            }`}
          >
            همه
          </button>
          {MOMENT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1 rounded-[4px] text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5 ${
                activeCategory === cat.id
                  ? 'bg-[#404249] text-white'
                  : 'text-[#949ba4] hover:bg-[#35373c] hover:text-[#dbdee1]'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.nameFa}</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-60">
          <Search className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-[#949ba4]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جست‌وجو در دورهمی‌ها..."
            className="w-full pr-8 pl-3 py-1 bg-[#1e1f22] rounded-[4px] text-xs text-[#dbdee1] placeholder:text-[#949ba4] focus:outline-none"
          />
        </div>
      </div>

      {/* Moments Grid */}
      <div className="flex-1 p-6 max-w-7xl mx-auto w-full">
        {loading && moments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#949ba4]">
            <RefreshCw className="w-8 h-8 animate-spin text-[#5865F2] mb-3" />
            <p className="text-xs">در حال بارگذاری...</p>
          </div>
        ) : moments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-[#2b2d31] flex items-center justify-center text-3xl mb-3 text-[#949ba4]">
              🎮
            </div>
            <h3 className="text-base font-extrabold text-white mb-1">
              هیچ دورهمی فعالی در این بخش پیدا نشد
            </h3>
            <p className="text-xs text-[#949ba4] max-w-sm mb-4">
              شما اولین نفری باشید که یک دورهمی بازی یا گفت‌وگو ایجاد می‌کند!
            </p>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="px-4 py-2 rounded-[4px] bg-[#5865F2] hover:bg-[#4752c4] text-white text-xs font-bold transition-colors"
            >
              ساخت دورهمی جدید
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
      </div>

      <CreateMomentModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={handleCreated}
      />
    </div>
  );
}
