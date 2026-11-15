import { prisma } from '../../../lib/db.ts';

export interface CreateCommunityDTO {
  name: string;
  description?: string;
  icon?: string;
  isPublic?: boolean;
}

export class CommunityService {
  /**
   * Create a new Community with default owner role, default general category & channels
   */
  static async createCommunity(ownerId: string, data: CreateCommunityDTO) {
    const name = data.name.trim();
    if (!name || name.length > 64) throw new Error('INVALID_COMMUNITY_NAME');

    return prisma.$transaction(async (tx) => {
      // 1. Create Community
      const community = await tx.community.create({
        data: {
          ownerId,
          name,
          description: data.description?.trim() || '',
          icon: data.icon || null,
          isPublic: data.isPublic ?? true,
        },
      });

      // 2. Create Owner Role
      const ownerRole = await tx.communityRole.create({
        data: {
          communityId: community.id,
          name: 'Owner',
          color: '#F59E0B',
          position: 0,
          permissions: BigInt(0x7fffffff), // All permissions bitmask
        },
      });

      // 3. Create General Member Role
      await tx.communityRole.create({
        data: {
          communityId: community.id,
          name: 'Member',
          color: '#8B7CFF',
          position: 1,
          permissions: BigInt(0x00000001), // Basic member bitmask
        },
      });

      // 4. Add owner as member with Owner role
      await tx.communityMember.create({
        data: {
          communityId: community.id,
          userId: ownerId,
          roleId: ownerRole.id,
        },
      });

      // 5. Create default Category & Channels
      const defaultCategory = await tx.channelCategory.create({
        data: {
          communityId: community.id,
          name: 'عمومی',
          position: 0,
        },
      });

      await tx.channel.create({
        data: {
          communityId: community.id,
          categoryId: defaultCategory.id,
          name: 'چت-عمومی',
          type: 'TEXT',
          position: 0,
        },
      });

      await tx.channel.create({
        data: {
          communityId: community.id,
          categoryId: defaultCategory.id,
          name: 'صوتی-عمومی',
          type: 'VOICE',
          position: 1,
        },
      });

      // 6. Outbox Event
      await tx.transactionalOutbox.create({
        data: {
          aggregateType: 'COMMUNITY',
          aggregateId: community.id,
          eventType: 'community.created',
          payload: {
            communityId: community.id,
            name: community.name,
            ownerId,
            isPublic: community.isPublic,
          },
        },
      });

      return community;
    });
  }

  /**
   * Get community by ID with membership validation
   */
  static async getCommunityById(communityId: string, viewerId?: string) {
    const community = await prisma.community.findUnique({
      where: { id: communityId },
      include: {
        owner: { select: { id: true, name: true, username: true, avatarStyle: true } },
        roles: { orderBy: { position: 'asc' } },
        categories: {
          orderBy: { position: 'asc' },
          include: {
            channels: { orderBy: { position: 'asc' } },
          },
        },
        _count: { select: { members: true } },
      },
    });

    if (!community) return null;

    if (!community.isPublic) {
      if (!viewerId) return null;
      const isMember = await prisma.communityMember.findUnique({
        where: { communityId_userId: { communityId, userId: viewerId } },
      });
      if (!isMember) return null;
    }

    return community;
  }

  /**
   * List discoverable public communities
   */
  static async listCommunities(viewerId?: string) {
    return prisma.community.findMany({
      where: { isPublic: true },
      orderBy: { createdAt: 'desc' },
      include: {
        owner: { select: { id: true, name: true, username: true, avatarStyle: true } },
        _count: { select: { members: true } },
      },
    });
  }

  /**
   * Join public community or check banned
   */
  static async joinCommunity(communityId: string, userId: string) {
    return prisma.$transaction(async (tx) => {
      const community = await tx.community.findUnique({
        where: { id: communityId },
        include: { roles: true },
      });
      if (!community) throw new Error('COMMUNITY_NOT_FOUND');

      const isBanned = await tx.communityBan.findUnique({
        where: { communityId_userId: { communityId, userId } },
      });
      if (isBanned) throw new Error('COMMUNITY_BANNED');

      if (!community.isPublic) {
        throw new Error('INVITE_REQUIRED_FOR_PRIVATE_COMMUNITY');
      }

      const existing = await tx.communityMember.findUnique({
        where: { communityId_userId: { communityId, userId } },
      });
      if (existing) return existing;

      // Assign default Member role
      const memberRole = community.roles.find((r) => r.name === 'Member') || community.roles[0];

      const member = await tx.communityMember.create({
        data: {
          communityId,
          userId,
          roleId: memberRole ? memberRole.id : null,
        },
      });

      await tx.transactionalOutbox.create({
        data: {
          aggregateType: 'COMMUNITY',
          aggregateId: communityId,
          eventType: 'community.member_joined',
          payload: { communityId, userId },
        },
      });

      return member;
    });
  }

  /**
   * Leave community (Owner cannot leave without deleting or transferring ownership)
   */
  static async leaveCommunity(communityId: string, userId: string) {
    return prisma.$transaction(async (tx) => {
      const community = await tx.community.findUnique({ where: { id: communityId } });
      if (!community) throw new Error('COMMUNITY_NOT_FOUND');
      if (community.ownerId === userId) {
        throw new Error('OWNER_CANNOT_LEAVE_COMMUNITY');
      }

      const member = await tx.communityMember.findUnique({
        where: { communityId_userId: { communityId, userId } },
      });
      if (!member) return;

      await tx.communityMember.delete({ where: { id: member.id } });

      await tx.transactionalOutbox.create({
        data: {
          aggregateType: 'COMMUNITY',
          aggregateId: communityId,
          eventType: 'community.member_left',
          payload: { communityId, userId },
        },
      });
    });
  }

  /**
   * Ban member (Admin/Owner only)
   */
  static async banMember(communityId: string, actorId: string, targetUserId: string, reason?: string) {
    return prisma.$transaction(async (tx) => {
      const community = await tx.community.findUnique({ where: { id: communityId } });
      if (!community) throw new Error('COMMUNITY_NOT_FOUND');
      if (community.ownerId !== actorId) {
        throw new Error('FORBIDDEN_NOT_COMMUNITY_OWNER');
      }
      if (community.ownerId === targetUserId) {
        throw new Error('CANNOT_BAN_COMMUNITY_OWNER');
      }

      // Remove from members
      await tx.communityMember.deleteMany({
        where: { communityId, userId: targetUserId },
      });

      const ban = await tx.communityBan.upsert({
        where: { communityId_userId: { communityId, userId: targetUserId } },
        create: {
          communityId,
          userId: targetUserId,
          bannedById: actorId,
          reason: reason || null,
        },
        update: { reason: reason || null, bannedById: actorId },
      });

      await tx.transactionalOutbox.create({
        data: {
          aggregateType: 'COMMUNITY',
          aggregateId: communityId,
          eventType: 'community.member_banned',
          payload: { communityId, userId: targetUserId },
        },
      });

      return ban;
    });
  }

  /**
   * Create Channel Category
   */
  static async createCategory(communityId: string, actorId: string, name: string) {
    const community = await prisma.community.findUnique({ where: { id: communityId } });
    if (!community) throw new Error('COMMUNITY_NOT_FOUND');
    if (community.ownerId !== actorId) throw new Error('FORBIDDEN');

    return prisma.channelCategory.create({
      data: {
        communityId,
        name: name.trim(),
      },
    });
  }

  /**
   * Create Channel
   */
  static async createChannel(communityId: string, actorId: string, data: { name: string; type?: 'TEXT' | 'VOICE'; categoryId?: string; isPrivate?: boolean }) {
    const community = await prisma.community.findUnique({ where: { id: communityId } });
    if (!community) throw new Error('COMMUNITY_NOT_FOUND');
    if (community.ownerId !== actorId) throw new Error('FORBIDDEN');

    return prisma.channel.create({
      data: {
        communityId,
        name: data.name.trim(),
        type: data.type || 'TEXT',
        categoryId: data.categoryId || null,
        isPrivate: data.isPrivate || false,
      },
    });
  }
}
