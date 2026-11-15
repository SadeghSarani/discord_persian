export interface MomentItem {
  id: string;
  creatorId: string;
  creator: {
    id: string;
    name: string;
    username: string;
    avatarStyle: string;
    roleColor?: string;
  };
  title: string;
  description: string;
  category: string;
  visibility: 'public' | 'friends_only' | 'invite_only';
  capacity: number;
  participantCount: number;
  status: 'live' | 'scheduled' | 'ended' | 'cancelled';
  startsAt: string;
  expiresAt: string;
  serverId?: string | null;
  channelId?: string | null;
  createdAt: string;
  participants?: {
    id: string;
    userId: string;
    status: string;
    joinedAt: string;
    user: {
      id: string;
      name: string;
      username: string;
      avatarStyle: string;
    };
  }[];
}

export type MomentCategory =
  | 'Gaming'
  | 'Programming'
  | 'Technology'
  | 'Music'
  | 'Entertainment'
  | 'Friendship'
  | 'Conversation'
  | 'Education'
  | 'Other';

export const MOMENT_CATEGORIES: { id: MomentCategory; nameFa: string; icon: string }[] = [
  { id: 'Gaming', nameFa: 'گیمینگ و بازی', icon: '🎮' },
  { id: 'Programming', nameFa: 'برنامه‌نویسی و کد', icon: '💻' },
  { id: 'Technology', nameFa: 'فناوری و هوش مصنوعی', icon: '⚡' },
  { id: 'Music', nameFa: 'موسیقی و دی‌جی', icon: '🎵' },
  { id: 'Entertainment', nameFa: 'سرگرمی و فیلم', icon: '🍿' },
  { id: 'Friendship', nameFa: 'دوست‌یابی و گفتگو', icon: '☕' },
  { id: 'Education', nameFa: 'آموزش و تبادل نظر', icon: '📚' },
  { id: 'Other', nameFa: 'متفرقه', icon: '✨' },
];
