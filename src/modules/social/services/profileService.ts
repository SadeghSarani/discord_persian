import { prisma } from '../../../lib/db.ts';
import { FriendshipStatus } from '@prisma/client';

export interface UpdateProfileDTO {
  name?: string;
  username?: string;
  bio?: string;
  avatarStyle?: string;
  bannerStyle?: string;
  customStatus?: string;
  gameActivity?: string;
}

export interface UpdatePreferencesDTO {
  theme?: string;
  language?: string;
  soundEffects?: boolean;
  notifications?: boolean;
}

export interface UpdatePrivacyDTO {
  profileVisibility?: 'public' | 'friends_only' | 'private';
  showOnlineStatus?: boolean;
  showGameActivity?: boolean;
  showCommunityList?: boolean;
  allowDirectMessages?: 'everyone' | 'friends_only' | 'none';
  allowMomentInvites?: 'everyone' | 'friends_only' | 'none';
}

const RESERVED_USERNAMES = new Set([
  'admin', 'administrator', 'root', 'nexus', 'discaf', 'system', 'moderator', 'support', 'help', 'api', 'bot'
]);

export class ProfileService {
  /**
   * Get full profile of currently authenticated user with settings & preferences
   */
  static async getMyProfile(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      include: {
        preferences: true,
        privacySettings: true,
        socialLinks: true,
        userXp: true,
        badges: { include: { badge: true } },
        interests: { include: { interest: true } },
        _count: {
          select: {
            communityMembers: true,
            createdMoments: true,
            sentFriendRequests: { where: { status: FriendshipStatus.ACCEPTED } },
          },
        },
      },
    });
  }

  /**
   * Update profile fields (with username validation and collision check)
   */
  static async updateProfile(userId: string, data: UpdateProfileDTO) {
    const updateData: any = {};

    if (data.name !== undefined) {
      const name = data.name.trim();
      if (!name || name.length > 64) throw new Error('INVALID_NAME');
      updateData.name = name;
    }

    if (data.username !== undefined) {
      const username = data.username.trim().toLowerCase();
      if (!/^[a-z0-9_]{3,32}$/.test(username)) {
        throw new Error('INVALID_USERNAME_FORMAT');
      }
      if (RESERVED_USERNAMES.has(username)) {
        throw new Error('RESERVED_USERNAME');
      }

      // Check collision if changed
      const existing = await prisma.user.findFirst({
        where: { username, id: { not: userId } },
      });
      if (existing) {
        throw new Error('USERNAME_ALREADY_TAKEN');
      }
      updateData.username = username;
    }

    if (data.bio !== undefined) {
      updateData.bio = data.bio ? data.bio.trim().slice(0, 255) : null;
    }

    if (data.avatarStyle !== undefined) {
      updateData.avatarStyle = data.avatarStyle.trim();
    }

    if (data.bannerStyle !== undefined) {
      updateData.bannerStyle = data.bannerStyle.trim();
    }

    if (data.customStatus !== undefined) {
      updateData.customStatus = data.customStatus ? data.customStatus.trim().slice(0, 128) : null;
    }

    if (data.gameActivity !== undefined) {
      updateData.gameActivity = data.gameActivity ? data.gameActivity.trim().slice(0, 128) : null;
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    await prisma.transactionalOutbox.create({
      data: {
        aggregateType: 'USER',
        aggregateId: userId,
        eventType: 'profile.updated',
        payload: { userId, ...updateData },
      },
    });

    return updated;
  }

  /**
   * Get public profile by username, enforcing privacy settings and block checks
   */
  static async getPublicProfile(username: string, viewerId?: string) {
    const targetUser = await prisma.user.findUnique({
      where: { username: username.toLowerCase() },
      include: {
        privacySettings: true,
        socialLinks: true,
        userXp: true,
        badges: { include: { badge: true } },
        interests: { include: { interest: true } },
        communityMembers: {
          include: { community: { select: { id: true, name: true, icon: true, isPublic: true } } },
        },
      },
    });

    if (!targetUser || targetUser.isBanned) return null;

    // Check block between viewer and target
    if (viewerId && viewerId !== targetUser.id) {
      const isBlocked = await prisma.userBlock.findFirst({
        where: {
          OR: [
            { blockerId: targetUser.id, blockedId: viewerId },
            { blockerId: viewerId, blockedId: targetUser.id },
          ],
        },
      });
      if (isBlocked) return null;
    }

    const privacy = targetUser.privacySettings || {
      profileVisibility: 'public',
      showOnlineStatus: true,
      showGameActivity: true,
      showCommunityList: true,
    };

    // Evaluate profileVisibility
    if (privacy.profileVisibility === 'private' && viewerId !== targetUser.id) {
      return {
        id: targetUser.id,
        username: targetUser.username,
        name: targetUser.name,
        avatarStyle: targetUser.avatarStyle,
        isPrivate: true,
      };
    }

    let isFriend = false;
    if (viewerId && viewerId !== targetUser.id) {
      const friendship = await prisma.friendship.findFirst({
        where: {
          status: FriendshipStatus.ACCEPTED,
          OR: [
            { requesterId: targetUser.id, addresseeId: viewerId },
            { requesterId: viewerId, addresseeId: targetUser.id },
          ],
        },
      });
      isFriend = !!friendship;
    }

    if (privacy.profileVisibility === 'friends_only' && viewerId !== targetUser.id && !isFriend) {
      return {
        id: targetUser.id,
        username: targetUser.username,
        name: targetUser.name,
        avatarStyle: targetUser.avatarStyle,
        isPrivate: true,
        requiresFriendship: true,
      };
    }

    // Build safe public DTO respecting sub-toggles
    return {
      id: targetUser.id,
      username: targetUser.username,
      name: targetUser.name,
      avatarStyle: targetUser.avatarStyle,
      bannerStyle: targetUser.bannerStyle,
      bio: targetUser.bio,
      customStatus: targetUser.customStatus,
      gameActivity: privacy.showGameActivity ? targetUser.gameActivity : null,
      role: targetUser.role,
      roleColor: targetUser.roleColor,
      isVerified: targetUser.isVerified,
      createdAt: targetUser.createdAt,
      xp: targetUser.userXp ? { totalXp: targetUser.userXp.totalXp, level: targetUser.userXp.currentLevel } : null,
      badges: targetUser.badges.map((b) => ({
        id: b.badge.id,
        code: b.badge.code,
        nameFa: b.badge.nameFa,
        icon: b.badge.icon,
        rarity: b.badge.rarity,
      })),
      interests: targetUser.interests.map((ui) => ({
        id: ui.interest.id,
        slug: ui.interest.slug,
        nameFa: ui.interest.nameFa,
        icon: ui.interest.icon,
        category: ui.interest.category,
      })),
      socialLinks: targetUser.socialLinks.map((sl) => ({
        platform: sl.platform,
        url: sl.url,
      })),
      communities: privacy.showCommunityList
        ? targetUser.communityMembers.filter((cm) => cm.community.isPublic).map((cm) => cm.community)
        : [],
    };
  }

  /**
   * Update user preferences
   */
  static async updatePreferences(userId: string, data: UpdatePreferencesDTO) {
    return prisma.userPreference.upsert({
      where: { userId },
      create: {
        userId,
        theme: data.theme || 'dark',
        language: data.language || 'fa',
        soundEffects: data.soundEffects ?? true,
        notifications: data.notifications ?? true,
      },
      update: {
        ...(data.theme ? { theme: data.theme } : {}),
        ...(data.language ? { language: data.language } : {}),
        ...(data.soundEffects !== undefined ? { soundEffects: data.soundEffects } : {}),
        ...(data.notifications !== undefined ? { notifications: data.notifications } : {}),
      },
    });
  }

  /**
   * Update privacy settings
   */
  static async updatePrivacySettings(userId: string, data: UpdatePrivacyDTO) {
    return prisma.userPrivacySetting.upsert({
      where: { userId },
      create: {
        userId,
        profileVisibility: data.profileVisibility || 'public',
        showOnlineStatus: data.showOnlineStatus ?? true,
        showGameActivity: data.showGameActivity ?? true,
        showCommunityList: data.showCommunityList ?? true,
        allowDirectMessages: data.allowDirectMessages || 'everyone',
        allowMomentInvites: data.allowMomentInvites || 'everyone',
      },
      update: {
        ...(data.profileVisibility ? { profileVisibility: data.profileVisibility } : {}),
        ...(data.showOnlineStatus !== undefined ? { showOnlineStatus: data.showOnlineStatus } : {}),
        ...(data.showGameActivity !== undefined ? { showGameActivity: data.showGameActivity } : {}),
        ...(data.showCommunityList !== undefined ? { showCommunityList: data.showCommunityList } : {}),
        ...(data.allowDirectMessages ? { allowDirectMessages: data.allowDirectMessages } : {}),
        ...(data.allowMomentInvites ? { allowMomentInvites: data.allowMomentInvites } : {}),
      },
    });
  }

  /**
   * Manage social links
   */
  static async setSocialLink(userId: string, platform: string, rawUrl: string) {
    const validPlatforms = ['discord', 'telegram', 'steam', 'twitch', 'youtube', 'twitter', 'instagram', 'github'];
    if (!validPlatforms.includes(platform.toLowerCase())) {
      throw new Error('INVALID_PLATFORM');
    }

    // URL validation
    let parsed: URL;
    try {
      parsed = new URL(rawUrl);
    } catch {
      throw new Error('INVALID_URL');
    }

    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      throw new Error('UNSAFE_URL_PROTOCOL');
    }

    return prisma.userSocialLink.upsert({
      where: {
        userId_platform: {
          userId,
          platform: platform.toLowerCase(),
        },
      },
      create: {
        userId,
        platform: platform.toLowerCase(),
        url: parsed.toString(),
      },
      update: {
        url: parsed.toString(),
      },
    });
  }

  static async removeSocialLink(userId: string, platform: string) {
    return prisma.userSocialLink.deleteMany({
      where: { userId, platform: platform.toLowerCase() },
    });
  }
}
