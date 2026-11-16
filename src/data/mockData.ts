import { Server, User, Message } from '@/types/discord';

export const currentUser: User = {
  id: 'guest_user',
  name: 'کاربر مهمان',
  username: 'guest',
  avatarStyle: 'golden_king',
  status: 'online',
  customStatus: 'خوش آمدید به کهکشان نکسوس 🌌',
  role: 'مهمان',
  roleColor: '#8B7CFF',
};

export const sampleUsers: User[] = [];

export const initialServers: Server[] = [];

export const initialMessages: Record<string, Message[]> = {};
