import { prisma } from '../../../lib/db.ts';
import {
  MomentStatus,
  MomentVisibility,
  ParticipantStatus,
  ReportStatus,
  FriendshipStatus,
} from '@prisma/client';
import crypto from 'node:crypto';

export interface CreateMomentDTO {
  creatorId: string;
  title: string;
  description: string;
  category: string;
  tags?: string[];
  capacity: number;
  durationHours?: number;
  visibility?: MomentVisibility;
}

export interface UpdateMomentDTO {
  title?: string;
  description?: string;
  category?: string;
  tags?: string[];
  capacity?: number;
  visibility?: MomentVisibility;
}

export interface DiscoveryQuery {
  viewerId?: string;
  category?: string;
  search?: string;
  cursor?: string;
  limit?: number;
  sort?: 'recommended' | 'recent' | 'popular';
}

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export class MomentService {
  /**
   * Automatically end expired moments and create outbox events
   */
  static async checkAndExpireMoments(): Promise<number> {
    const now = new Date();
    const expiredMoments = await prisma.moment.findMany({
      where: {
        status: MomentStatus.LIVE,
        expiresAt: { lt: now },
      },
      select: { id: true, title: true },
    });

    if (expiredMoments.length === 0) return 0;

    await prisma.$transaction(async (tx) => {
      await tx.moment.updateMany({
        where: {
          id: { in: expiredMoments.map((m) => m.id) },
        },
        data: {
          status: MomentStatus.ENDED,
        },
      });

      for (const m of expiredMoments) {
        await tx.transactionalOutbox.create({
          data: {
            aggregateType: 'MOMENT',
            aggregateId: m.id,
            eventType: 'moment.expired',
            payload: { momentId: m.id, title: m.title, expiredAt: now.toISOString() },
          },
        });
      }
    });

    return expiredMoments.length;
  }

  /**
   * Create a new Moment (Atomic with creator participation, XP, and Outbox)
   */
  static async createMoment(data: CreateMomentDTO) {
    const title = data.title.trim();
    const description = data.description.trim();
    if (!title || title.length > 100) throw new Error('INVALID_MOMENT_TITLE');
    if (!description || description.length > 300) throw new Error('INVALID_MOMENT_DESCRIPTION');

    const durationHours = Math.min(Math.max(data.durationHours || 4, 1), 72);
    const capacity = Math.min(Math.max(data.capacity || 8, 2), 50);
    const expiresAt = new Date(Date.now() + durationHours * 60 * 60 * 1000);

    return prisma.$transaction(async (tx) => {
      const moment = await tx.moment.create({
        data: {
          creatorId: data.creatorId,
          title,
          description,
          category: data.category,
          tags: data.tags || [],
          capacity,
          participantCount: 1,
          status: MomentStatus.LIVE,
          expiresAt,
          visibility: data.visibility || MomentVisibility.PUBLIC,
        },
      });

      // Creator is first active participant
      await tx.momentParticipant.create({
        data: {
          momentId: moment.id,
          userId: data.creatorId,
          status: ParticipantStatus.ACTIVE,
        },
      });

      // Award XP for creating a Moment (Idempotent 25 XP)
      const idempotencyKey = `moment_create_${moment.id}_${data.creatorId}`;
      await tx.xpTransaction.upsert({
        where: { idempotencyKey },
        create: {
          userId: data.creatorId,
          amount: 25,
          reason: `ساخت مامنت: ${title}`,
          sourceType: 'moment_create',
          sourceId: moment.id,
          idempotencyKey,
        },
        update: {},
      });

      await tx.userXp.upsert({
        where: { userId: data.creatorId },
        create: { userId: data.creatorId, totalXp: 25, currentLevel: 1 },
        update: { totalXp: { increment: 25 } },
      });

      // Outbox Event
      await tx.transactionalOutbox.create({
        data: {
          aggregateType: 'MOMENT',
          aggregateId: moment.id,
          eventType: 'moment.created',
          payload: {
            momentId: moment.id,
            title: moment.title,
            category: moment.category,
            capacity: moment.capacity,
            creatorId: data.creatorId,
            visibility: moment.visibility,
            status: moment.status,
          },
        },
      });

      return moment;
    });
  }

  /**
   * Update Moment (Creator only)
   */
  static async updateMoment(momentId: string, userId: string, data: UpdateMomentDTO) {
    return prisma.$transaction(async (tx) => {
      const moment = await tx.moment.findUnique({
        where: { id: momentId },
      });

      if (!moment) throw new Error('MOMENT_NOT_FOUND');
      if (moment.creatorId !== userId) throw new Error('FORBIDDEN_NOT_CREATOR');
      if (moment.status !== MomentStatus.LIVE) throw new Error('MOMENT_NOT_LIVE');

      const updateData: any = {};
      if (data.title) updateData.title = data.title.trim();
      if (data.description) updateData.description = data.description.trim();
      if (data.category) updateData.category = data.category;
      if (data.tags) updateData.tags = data.tags;
      if (data.visibility) updateData.visibility = data.visibility;
      if (data.capacity) {
        const newCap = Math.min(Math.max(data.capacity, 2), 50);
        if (newCap < moment.participantCount) {
          throw new Error('CAPACITY_LOWER_THAN_ACTIVE_PARTICIPANTS');
        }
        updateData.capacity = newCap;
      }

      const updated = await tx.moment.update({
        where: { id: momentId },
        data: updateData,
      });

      await tx.transactionalOutbox.create({
        data: {
          aggregateType: 'MOMENT',
          aggregateId: momentId,
          eventType: 'moment.updated',
          payload: {
            momentId,
            ...updateData,
          },
        },
      });

      return updated;
    });
  }

  /**
   * Cancel / Delete Moment (Creator or Moderator)
   */
  static async cancelMoment(momentId: string, userId: string) {
    return prisma.$transaction(async (tx) => {
      const moment = await tx.moment.findUnique({
        where: { id: momentId },
        include: { creator: true },
      });

      if (!moment) throw new Error('MOMENT_NOT_FOUND');
      if (moment.creatorId !== userId && moment.creator.role !== 'admin') {
        throw new Error('FORBIDDEN_NOT_CREATOR');
      }

      const cancelled = await tx.moment.update({
        where: { id: momentId },
        data: { status: MomentStatus.CANCELLED },
      });

      await tx.transactionalOutbox.create({
        data: {
          aggregateType: 'MOMENT',
          aggregateId: momentId,
          eventType: 'moment.cancelled',
          payload: { momentId, cancelledAt: new Date().toISOString() },
        },
      });

      return cancelled;
    });
  }

  /**
   * Join an active Moment (Atomic capacity validation with visibility enforcement)
   */
  static async joinMoment(momentId: string, userId: string, inviteToken?: string) {
    await this.checkAndExpireMoments();

    return prisma.$transaction(async (tx) => {
      const moment = await tx.moment.findUnique({
        where: { id: momentId },
      });

      if (!moment) throw new Error('MOMENT_NOT_FOUND');
      if (moment.status !== MomentStatus.LIVE) throw new Error('MOMENT_NOT_LIVE');

      // Check block between creator and user
      const isBlocked = await tx.userBlock.findFirst({
        where: {
          OR: [
            { blockerId: moment.creatorId, blockedId: userId },
            { blockerId: userId, blockedId: moment.creatorId },
          ],
        },
      });
      if (isBlocked) throw new Error('ACCESS_DENIED_USER_BLOCKED');

      // Check visibility constraints
      if (moment.visibility === MomentVisibility.PRIVATE_INVITE && moment.creatorId !== userId) {
        let authorizedByInvite = false;
        if (inviteToken) {
          const tHash = hashToken(inviteToken);
          const invite = await tx.momentInvite.findUnique({ where: { tokenHash: tHash } });
          if (invite && invite.momentId === momentId && invite.expiresAt > new Date() && invite.usageCount < invite.maxUses) {
            authorizedByInvite = true;
            await tx.momentInvite.update({
              where: { id: invite.id },
              data: { usageCount: { increment: 1 } },
            });
          }
        }
        if (!authorizedByInvite) {
          throw new Error('INVITE_REQUIRED_FOR_PRIVATE_MOMENT');
        }
      } else if (moment.visibility === MomentVisibility.FRIENDS_ONLY && moment.creatorId !== userId) {
        const isFriend = await tx.friendship.findFirst({
          where: {
            status: FriendshipStatus.ACCEPTED,
            OR: [
              { requesterId: moment.creatorId, addresseeId: userId },
              { requesterId: userId, addresseeId: moment.creatorId },
            ],
          },
        });
        if (!isFriend) throw new Error('FRIENDS_ONLY_MOMENT');
      }

      // Check existing participation
      const existing = await tx.momentParticipant.findUnique({
        where: { momentId_userId: { momentId, userId } },
      });

      if (existing && existing.status === ParticipantStatus.ACTIVE) {
        return moment;
      }

      // Atomic conditional update ensuring participantCount < capacity
      const affected = await tx.$executeRawUnsafe(
        `UPDATE "Moment"
         SET "participantCount" = "participantCount" + 1
         WHERE "id" = $1 AND "participantCount" < "capacity" AND "status" = 'LIVE'`,
        momentId
      );

      if (affected === 0) {
        throw new Error('MOMENT_CAPACITY_FULL');
      }

      if (existing) {
        await tx.momentParticipant.update({
          where: { id: existing.id },
          data: { status: ParticipantStatus.ACTIVE, joinedAt: new Date(), leftAt: null },
        });
      } else {
        await tx.momentParticipant.create({
          data: {
            momentId,
            userId,
            status: ParticipantStatus.ACTIVE,
          },
        });
      }

      // Award XP for joining a Moment (10 XP)
      const idempotencyKey = `moment_join_${momentId}_${userId}`;
      await tx.xpTransaction.upsert({
        where: { idempotencyKey },
        create: {
          userId,
          amount: 10,
          reason: `پیوستن به فعالیت: ${moment.title}`,
          sourceType: 'moment_join',
          sourceId: momentId,
          idempotencyKey,
        },
        update: {},
      });

      await tx.userXp.upsert({
        where: { userId },
        create: { userId, totalXp: 10, currentLevel: 1 },
        update: { totalXp: { increment: 10 } },
      });

      await tx.transactionalOutbox.create({
        data: {
          aggregateType: 'MOMENT',
          aggregateId: momentId,
          eventType: 'moment.joined',
          payload: {
            momentId,
            userId,
            joinedAt: new Date().toISOString(),
          },
        },
      });

      return tx.moment.findUniqueOrThrow({ where: { id: momentId } });
    });
  }

  /**
   * Leave a Moment
   */
  static async leaveMoment(momentId: string, userId: string) {
    return prisma.$transaction(async (tx) => {
      const participant = await tx.momentParticipant.findUnique({
        where: { momentId_userId: { momentId, userId } },
      });

      if (!participant || participant.status !== ParticipantStatus.ACTIVE) {
        return;
      }

      await tx.momentParticipant.update({
        where: { id: participant.id },
        data: { status: ParticipantStatus.LEFT, leftAt: new Date() },
      });

      await tx.moment.update({
        where: { id: momentId },
        data: { participantCount: { decrement: 1 } },
      });

      await tx.transactionalOutbox.create({
        data: {
          aggregateType: 'MOMENT',
          aggregateId: momentId,
          eventType: 'moment.left',
          payload: {
            momentId,
            userId,
            leftAt: new Date().toISOString(),
          },
        },
      });
    });
  }

  /**
   * Create an Invite Token for a Moment (Creator only)
   */
  static async createInvite(momentId: string, userId: string, maxUses = 10, durationHours = 24) {
    const moment = await prisma.moment.findUnique({ where: { id: momentId } });
    if (!moment) throw new Error('MOMENT_NOT_FOUND');
    if (moment.creatorId !== userId) throw new Error('FORBIDDEN_NOT_CREATOR');

    const rawToken = crypto.randomBytes(24).toString('hex');
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + durationHours * 3600000);

    const invite = await prisma.momentInvite.create({
      data: {
        momentId,
        inviterId: userId,
        tokenHash,
        maxUses,
        expiresAt,
      },
    });

    return {
      inviteId: invite.id,
      inviteToken: rawToken,
      expiresAt: invite.expiresAt,
      maxUses: invite.maxUses,
    };
  }

  /**
   * Report a Moment
   */
  static async reportMoment(momentId: string, reporterId: string, reason: string) {
    const text = reason.trim();
    if (!text || text.length < 5) throw new Error('REPORT_REASON_TOO_SHORT');

    const moment = await prisma.moment.findUnique({ where: { id: momentId } });
    if (!moment) throw new Error('MOMENT_NOT_FOUND');

    // Prevent duplicate report by same user
    const existing = await prisma.momentReport.findFirst({
      where: { momentId, reporterId, status: ReportStatus.PENDING },
    });
    if (existing) throw new Error('ALREADY_REPORTED');

    return prisma.momentReport.create({
      data: {
        momentId,
        reporterId,
        reason: text,
      },
    });
  }

  /**
   * Retrieve Single Moment with Privacy Enforcement
   */
  static async getMomentById(id: string, viewerId?: string) {
    await this.checkAndExpireMoments();
    const moment = await prisma.moment.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            username: true,
            avatarStyle: true,
            roleColor: true,
          },
        },
        participants: {
          where: { status: ParticipantStatus.ACTIVE },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                avatarStyle: true,
              },
            },
          },
        },
      },
    });

    if (!moment) return null;

    // Check block
    if (viewerId && viewerId !== moment.creatorId) {
      const isBlocked = await prisma.userBlock.findFirst({
        where: {
          OR: [
            { blockerId: moment.creatorId, blockedId: viewerId },
            { blockerId: viewerId, blockedId: moment.creatorId },
          ],
        },
      });
      if (isBlocked) return null;
    }

    // Check visibility
    if (moment.visibility === MomentVisibility.PRIVATE_INVITE && viewerId !== moment.creatorId) {
      const isPart = moment.participants.some((p) => p.userId === viewerId);
      if (!isPart) return null;
    } else if (moment.visibility === MomentVisibility.FRIENDS_ONLY && viewerId !== moment.creatorId) {
      if (!viewerId) return null;
      const isFriend = await prisma.friendship.findFirst({
        where: {
          status: FriendshipStatus.ACCEPTED,
          OR: [
            { requesterId: moment.creatorId, addresseeId: viewerId },
            { requesterId: viewerId, addresseeId: moment.creatorId },
          ],
        },
      });
      if (!isFriend) return null;
    }

    return moment;
  }

  /**
   * Discovery Engine with Deterministic Ranking & Privacy Guarantees
   */
  static async discoverMoments(query: DiscoveryQuery) {
    await this.checkAndExpireMoments();

    const limit = Math.min(Math.max(query.limit || 20, 1), 50);
    const viewerId = query.viewerId;

    // 1. Get blocked user IDs to completely exclude from feed
    let blockedUserIds: string[] = [];
    let viewerInterestSlugs: string[] = [];

    if (viewerId) {
      const blocks = await prisma.userBlock.findMany({
        where: {
          OR: [{ blockerId: viewerId }, { blockedId: viewerId }],
        },
      });
      blockedUserIds = blocks.map((b) => (b.blockerId === viewerId ? b.blockedId : b.blockerId));

      // Get viewer interests for recommendation score
      const userInterests = await prisma.userInterest.findMany({
        where: { userId: viewerId },
        include: { interest: true },
      });
      viewerInterestSlugs = userInterests.map((ui) => ui.interest.slug.toLowerCase());
    }

    // 2. Base filter: LIVE and strictly PUBLIC
    const where: any = {
      status: MomentStatus.LIVE,
      visibility: MomentVisibility.PUBLIC,
      expiresAt: { gt: new Date() },
    };

    if (blockedUserIds.length > 0) {
      where.creatorId = { notIn: blockedUserIds };
    }

    if (query.category && query.category !== 'ALL') {
      where.category = query.category;
    }

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    // Cursor pagination
    if (query.cursor) {
      where.id = { lt: query.cursor };
    }

    const rawMoments = await prisma.moment.findMany({
      where,
      take: limit + 1,
      orderBy: { createdAt: 'desc' },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            username: true,
            avatarStyle: true,
            roleColor: true,
          },
        },
        participants: {
          where: { status: ParticipantStatus.ACTIVE },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                avatarStyle: true,
              },
            },
          },
        },
      },
    });

    const hasMore = rawMoments.length > limit;
    const items = hasMore ? rawMoments.slice(0, limit) : rawMoments;
    const nextCursor = hasMore ? items[items.length - 1].id : null;

    // 3. Deterministic Ranking algorithm
    // Score = (Shared Interests * 30) + (Participant Fill Ratio * 20) + (Recency score up to 20)
    const scoredMoments = items.map((m) => {
      let score = 0;

      // Interest match: category or tags matching user interests
      const tags = m.tags.map((t) => t.toLowerCase());
      const cat = m.category.toLowerCase();
      const hasInterestMatch = viewerInterestSlugs.some(
        (slug) => slug === cat || tags.includes(slug)
      );
      if (hasInterestMatch) score += 30;

      // Participation fill ratio (encourage nearly-full active moments)
      const fillRatio = m.capacity > 0 ? m.participantCount / m.capacity : 0;
      score += Math.round(fillRatio * 20);

      // Recency bonus: younger moments get up to 20 points
      const ageHours = (Date.now() - m.createdAt.getTime()) / 3600000;
      score += Math.max(0, Math.round(20 - ageHours));

      return {
        ...m,
        discoveryScore: score,
      };
    });

    if (query.sort === 'recommended') {
      scoredMoments.sort((a, b) => b.discoveryScore - a.discoveryScore);
    } else if (query.sort === 'popular') {
      scoredMoments.sort((a, b) => b.participantCount - a.participantCount);
    }

    return {
      items: scoredMoments,
      nextCursor,
      hasMore,
    };
  }
}
