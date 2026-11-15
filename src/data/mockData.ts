import { Server, User, Message } from '@/types/discord';

export const currentUser: User = {
  id: 'user_admin',
  name: 'مدیر کل سرور',
  username: 'admin',
  avatarStyle: 'golden_king',
  status: 'online',
  customStatus: 'خوش آمدید به دیسکافه 🎮',
  gameActivity: 'آنلاین در دیسکافه',
  role: 'مدیر کل سرور',
  roleColor: '#f59e0b',
};

export const sampleUsers: User[] = [
  currentUser,
];

export const initialServers: Server[] = [
  {
    id: 'server_main',
    name: 'سرور اصلی دیسکافه 🇮🇷',
    icon: '🎮',
    acronym: 'دیسکافه',
    description: 'جامعه گیمرها و دورهمی کاربران دیسکافه',
    membersCount: 1,
    categories: [
      {
        id: 'cat_general',
        name: '💬 کانال‌های عمومی',
        channels: [
          { id: 'ch_general_chat', name: '☕-گفتگو-عمومی', type: 'text', isPrivate: false, description: 'چت آزاد، احوالپرسی و صحبت گیمری' },
          { id: 'ch_announcements', name: '📢-اطلاعیه‌ها', type: 'text', isPrivate: false, description: 'اخبار و اطلاعیه‌های رسمی سرور' },
        ],
      },
      {
        id: 'cat_private',
        name: '🔒 کانال‌های اختصاصی',
        channels: [
          { id: 'ch_vip_lounge', name: '👑-اتاق-ویژه-مدیران', type: 'text', isPrivate: true, description: 'جلسات خصوصی مدیران' },
        ],
      },
      {
        id: 'cat_voice',
        name: '🎙️ کانال‌های صوتی و استریم',
        channels: [
          { id: 'ch_voice_lobby', name: '🔊 لابی صوتی عمومی', type: 'voice' },
          { id: 'ch_voice_gaming', name: '🎮 اتاق بازی و استریم', type: 'voice' },
        ],
      },
    ],
  },
];

export const initialMessages: Record<string, Message[]> = {
  ch_general_chat: [
    {
      id: 'm_welcome',
      userId: 'user_admin',
      userName: 'مدیر کل سرور',
      userAvatarStyle: 'golden_king',
      role: 'مدیر کل سرور',
      roleColor: '#f59e0b',
      content: 'سلام به پلتفرم دیسکافه خوش آمدید! 🎉\nمی‌توانید پیام بفرستید، وارد ویس‌روم و تماس تصویری شوید یا در بخش «شهر دیسکافه» کاراکتر خود را حرکت دهید.',
      timestamp: 'همین الان',
    },
  ],
  ch_announcements: [
    {
      id: 'm_rules',
      userId: 'user_admin',
      userName: 'مدیر کل سرور',
      userAvatarStyle: 'golden_king',
      role: 'مدیر کل سرور',
      roleColor: '#f59e0b',
      content: '📌 سرور با موفقیت راه‌اندازی شد. برای ساخت کانال و سرورهای جدید از منوهای کناری استفاده کنید.',
      timestamp: 'همین الان',
    },
  ],
};
