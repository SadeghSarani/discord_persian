export interface User {
  id: string;
  name: string;
  username: string;
  avatarStyle: string; // references avatarPresets
  status: 'online' | 'idle' | 'dnd' | 'offline';
  customStatus?: string;
  gameActivity?: string;
  role?: string;
  roleColor?: string;
}

export interface Message {
  id: string;
  userId: string;
  userName: string;
  userAvatarStyle: string;
  role?: string;
  roleColor?: string;
  content: string;
  timestamp: string;
  reactions?: {
    emoji: string;
    count: number;
    users: string[];
  }[];
}

export interface Channel {
  id: string;
  name: string;
  type: 'text' | 'voice';
  isPrivate?: boolean;
  description?: string;
  unreadCount?: number;
}

export interface ChannelCategory {
  id: string;
  name: string;
  channels: Channel[];
}

export interface Server {
  id: string;
  name: string;
  icon: string;
  acronym: string;
  banner?: string;
  description: string;
  categories: ChannelCategory[];
  membersCount: number;
}
