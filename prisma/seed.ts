import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedDatabase() {
  console.log('[Seed] Starting clean deterministic database seed...');

  // 1. Seed Interests Taxonomy
  const interestsData = [
    { slug: 'gaming', nameFa: 'گیمینگ و استریم', icon: '🎮', category: 'Gaming' },
    { slug: 'football-fc', nameFa: 'فوتبال و FC', icon: '⚽', category: 'Sports' },
    { slug: 'programming-ai', nameFa: 'برنامه‌نویسی و هوش مصنوعی', icon: '💻', category: 'Tech' },
    { slug: 'music-dj', nameFa: 'موسیقی و دی‌جی', icon: '🎵', category: 'Music' },
    { slug: 'cinema-anime', nameFa: 'سینما و انیمه', icon: '🍿', category: 'Entertainment' },
    { slug: 'crypto-finance', nameFa: 'کریپتو و بازارهای مالی', icon: '📈', category: 'Finance' },
  ];

  for (const interest of interestsData) {
    await prisma.interest.upsert({
      where: { slug: interest.slug },
      update: interest,
      create: interest,
    });
  }
  console.log(`[Seed] Seeded ${interestsData.length} Interests.`);

  // 2. Seed Verified Personas
  // Leader persona
  const leaderUser = await prisma.user.upsert({
    where: { username: 'sadegh' },
    update: {},
    create: {
      username: 'sadegh',
      name: 'صادق (مدیر کلن)',
      email: 'sadegh@discaf.ir',
      avatarStyle: 'golden_king',
      bio: 'توسعه‌دهنده پلتفرم نکسوس و لیدر کلن گیمینگ',
      customStatus: 'در حال ساخت دنیای دیسکاف 🚀',
      role: 'leader',
      roleColor: '#f59e0b',
      isVerified: true,
      credential: {
        create: {
          passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$dummy_hash_for_test$nexus_secure_hash',
        },
      },
      userXp: {
        create: {
          totalXp: 750,
          currentLevel: 5,
        },
      },
      referralCode: {
        create: {
          code: 'NEXUS-SADEGH',
        },
      },
    },
  });

  // Second Member Persona
  const memberUser = await prisma.user.upsert({
    where: { username: 'arash' },
    update: {},
    create: {
      username: 'arash',
      name: 'آرش شب‌نورد',
      email: 'arash@discaf.ir',
      avatarStyle: 'cyber_samurai',
      bio: 'استریمر و پلیر فیفا و ولورانت',
      customStatus: 'آماده برای مچ شبانه 🎮',
      role: 'member',
      roleColor: '#8b5cf6',
      isVerified: true,
      credential: {
        create: {
          passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$dummy_hash_for_test$nexus_secure_hash',
        },
      },
      userXp: {
        create: {
          totalXp: 225,
          currentLevel: 3,
        },
      },
      referralCode: {
        create: {
          code: 'NEXUS-ARASH',
        },
      },
    },
  });
  console.log('[Seed] Seeded core personas: @sadegh (Lv.5), @arash (Lv.3).');

  // Bind User Interests
  const gamingInterest = await prisma.interest.findUnique({ where: { slug: 'gaming' } });
  if (gamingInterest) {
    await prisma.userInterest.upsert({
      where: { userId_interestId: { userId: leaderUser.id, interestId: gamingInterest.id } },
      update: {},
      create: { userId: leaderUser.id, interestId: gamingInterest.id },
    });
    await prisma.userInterest.upsert({
      where: { userId_interestId: { userId: memberUser.id, interestId: gamingInterest.id } },
      update: {},
      create: { userId: memberUser.id, interestId: gamingInterest.id },
    });
  }

  // 3. Seed Starter Badges
  const badgesData = [
    {
      code: 'founder',
      nameFa: 'بنیان‌گذار نکسوس',
      description: 'عضویت در نخستین دوره رونمایی پلتفرم دیسکاف',
      icon: '👑',
      rarity: 'LEGENDARY' as const,
      criteria: JSON.stringify({ type: 'EVENT', event: 'EARLY_ADOPTER' }),
    },
    {
      code: 'moment_starter',
      nameFa: 'استاد لحظه‌ها',
      description: 'ایجاد ۳ لحظه موفق و جذب هم‌تیمی',
      icon: '⚡',
      rarity: 'RARE' as const,
      criteria: JSON.stringify({ type: 'MOMENT_COUNT', count: 3 }),
    },
    {
      code: 'social_connector',
      nameFa: 'کانکتور برتر',
      description: 'دعوت و فعال‌سازی موفق ۵ دوست در کلن',
      icon: '🤝',
      rarity: 'EPIC' as const,
      criteria: JSON.stringify({ type: 'REFERRAL_COUNT', count: 5 }),
    },
  ];

  for (const b of badgesData) {
    const badge = await prisma.badge.upsert({
      where: { code: b.code },
      update: b,
      create: b,
    });
    // Award founder badge to leader
    if (b.code === 'founder') {
      await prisma.userBadge.upsert({
        where: { userId_badgeId: { userId: leaderUser.id, badgeId: badge.id } },
        update: {},
        create: { userId: leaderUser.id, badgeId: badge.id, isPinned: true },
      });
    }
  }
  console.log(`[Seed] Seeded ${badgesData.length} Badges.`);

  // 4. Seed Daily & Weekly Quests
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const questsData = [
    {
      code: 'daily_moment_join',
      title: 'هم‌تیمی روزانه',
      description: 'به یک لحظه زنده ملحق شو و چت کن',
      questType: 'DAILY' as const,
      rewardXp: 30,
      actionType: 'MOMENT_JOIN',
      targetCount: 1,
      endsAt: tomorrow,
    },
    {
      code: 'daily_chat_activity',
      title: 'حرفه‌ای و فعال',
      description: '۵ پیام در روم‌های عمومی کلن ارسال کن',
      questType: 'DAILY' as const,
      rewardXp: 20,
      actionType: 'CHAT_MESSAGE',
      targetCount: 5,
      endsAt: tomorrow,
    },
    {
      code: 'weekly_moment_host',
      title: 'میزبان هفتگی',
      description: '۲ مامنت جدید با ظرفیت حداقل ۴ نفر ایجاد کن',
      questType: 'WEEKLY' as const,
      rewardXp: 100,
      actionType: 'MOMENT_CREATE',
      targetCount: 2,
      endsAt: nextWeek,
    },
  ];

  for (const q of questsData) {
    await prisma.quest.upsert({
      where: { code: q.code },
      update: q,
      create: q,
    });
  }
  console.log(`[Seed] Seeded ${questsData.length} Quests.`);

  // 5. Seed Core Community (Server) with Channels
  const mainCommunity = await prisma.community.upsert({
    where: { id: 'comm_main_nexus' },
    update: {},
    create: {
      id: 'comm_main_nexus',
      ownerId: leaderUser.id,
      name: 'جامعه رسمی دیسکافه 🇮🇷',
      description: 'هاب مرکزی گیمرها، لحظات بازی و دورهمی‌های صوتی',
      isPublic: true,
      roles: {
        create: [
          { name: 'مدیر ارشد', color: '#f59e0b', position: 1, permissions: BigInt(255) },
          { name: 'عضو کلن', color: '#8b7cff', position: 2, permissions: BigInt(15) },
        ],
      },
    },
  });

  // Create Categories and Channels linked to Community
  const catGeneral = await prisma.channelCategory.create({
    data: {
      communityId: mainCommunity.id,
      name: '💬 کانال‌های عمومی',
      position: 1,
      channels: {
        create: [
          { communityId: mainCommunity.id, name: '☕-گفتگو-عمومی', type: 'TEXT', topic: 'چت عمومی و احوالپرسی', position: 1 },
          { communityId: mainCommunity.id, name: '📢-اطلاعیه‌ها', type: 'TEXT', topic: 'اخبار رسمی پلتفرم', position: 2 },
        ],
      },
    },
  });

  const catVoice = await prisma.channelCategory.create({
    data: {
      communityId: mainCommunity.id,
      name: '🎙️ روم‌های صوتی و بازی',
      position: 2,
      channels: {
        create: [
          { communityId: mainCommunity.id, name: '🎮 لابی بازی و گفت‌وگو', type: 'VOICE', position: 1 },
          { communityId: mainCommunity.id, name: '⚡ مچ فیفا و استریم', type: 'VOICE', position: 2 },
        ],
      },
    },
  });

  // Add members
  await prisma.communityMember.upsert({
    where: { communityId_userId: { communityId: mainCommunity.id, userId: leaderUser.id } },
    update: {},
    create: { communityId: mainCommunity.id, userId: leaderUser.id, nickname: 'صادق' },
  });

  await prisma.communityMember.upsert({
    where: { communityId_userId: { communityId: mainCommunity.id, userId: memberUser.id } },
    update: {},
    create: { communityId: mainCommunity.id, userId: memberUser.id, nickname: 'آرش' },
  });
  console.log(`[Seed] Seeded Community: ${mainCommunity.name} with categories & channels.`);

  // 6. Seed Sample Live Moment
  const expiresAt = new Date(Date.now() + 3 * 60 * 60 * 1000);
  const liveMoment = await prisma.moment.upsert({
    where: { id: 'moment_live_seed' },
    update: {},
    create: {
      id: 'moment_live_seed',
      creatorId: leaderUser.id,
      title: 'مچ دیویژن ریوالز FC 27 کلن',
      description: '۴ نفر برای تشکیل اسکواد و تست تاکتیک پرس سنگین',
      category: 'Gaming',
      tags: ['fc27', 'rivals', 'gaming'],
      visibility: 'PUBLIC',
      capacity: 4,
      participantCount: 2,
      status: 'LIVE',
      expiresAt,
      participants: {
        create: [
          { userId: leaderUser.id, status: 'ACTIVE' },
          { userId: memberUser.id, status: 'ACTIVE' },
        ],
      },
    },
  });
  console.log(`[Seed] Seeded active Moment: "${liveMoment.title}" with 2 participants.`);

  console.log('[Seed] Database seed completed successfully! 🚀');
}

seedDatabase()
  .catch((e) => {
    console.error('[Seed Error]:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
