import { prisma } from '../../../lib/db.ts';
import {
  SignalStatus,
  SignalVisibility,
  MomentVisibility,
  FriendshipStatus,
} from '@prisma/client';
import { MomentService } from '../../moments/services/momentService.ts';

export interface CreateSignalDTO {
  creatorId: string;
  activityCategory: string; // gaming, tech, casual, music, dev
  targetInterest?: string;
  description: string;
  targetCount?: number;
  minCount?: number;
  maxCapacity?: number;
  estimatedDuration?: number; // minutes
  visibility?: SignalVisibility;
}

export interface SignalDiscoveryQuery {
  viewerId?: string;
  category?: string;
  interest?: string;
  limit?: number;
}

export class SignalService {
  /**
   * 1. Express an Intention (Create a new Signal)
   * Before creation, discovers compatible live moments or signals.
   */
  static async createSignal(dto: CreateSignalDTO) {
    const creatorId = dto.creatorId;

    // Check user exists
    const user = await prisma.user.findUnique({
      where: { id: creatorId },
    });
    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }

    // Rate Limit: User cannot have more than 1 active BROADCASTING signal at the same time
    const activeSignal = await prisma.signal.findFirst({
      where: {
        creatorId,
        status: SignalStatus.BROADCASTING,
      },
    });
    if (activeSignal) {
      throw new Error('ACTIVE_SIGNAL_LIMIT_REACHED');
    }

    const minCount = Math.max(2, dto.minCount || 2);
    const targetCount = Math.max(minCount, dto.targetCount || 3);
    const maxCapacity = Math.max(targetCount, dto.maxCapacity || 4);
    const durationMinutes = dto.estimatedDuration || 20;

    // Default expiration: 30 minutes from now
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    return await prisma.$transaction(async (tx) => {
      const signal = await tx.signal.create({
        data: {
          creatorId,
          activityCategory: dto.activityCategory,
          targetInterest: dto.targetInterest || null,
          description: dto.description.trim(),
          targetCount,
          minCount,
          maxCapacity,
          estimatedDuration: durationMinutes,
          visibility: dto.visibility || SignalVisibility.PUBLIC,
          status: SignalStatus.BROADCASTING,
          expiresAt,
        },
      });

      // Creator automatically added as the first participant
      await tx.signalParticipant.create({
        data: {
          signalId: signal.id,
          userId: creatorId,
        },
      });

      // Transactional Outbox Event for real-time radar broadcasting
      await tx.transactionalOutbox.create({
        data: {
          aggregateType: 'SIGNAL',
          aggregateId: signal.id,
          eventType: 'signal.created',
          payload: {
            signalId: signal.id,
            creatorId,
            category: signal.activityCategory,
            targetCount: signal.targetCount,
            minCount: signal.minCount,
            description: signal.description,
          },
        },
      });

      return signal;
    });
  }

  /**
   * 2. Join a Signal (Express participation interest)
   * Concurrency-safe: atomically increments and triggers Moment formation when minCount is reached.
   */
  static async joinSignal(signalId: string, userId: string) {
    // Check if blocked by creator or blocking creator
    const signal = await prisma.signal.findUnique({
      where: { id: signalId },
      include: {
        participants: true,
        creator: true,
      },
    });

    if (!signal) {
      throw new Error('SIGNAL_NOT_FOUND');
    }

    if (signal.status !== SignalStatus.BROADCASTING) {
      throw new Error('SIGNAL_NOT_ACTIVE');
    }

    if (new Date() > signal.expiresAt) {
      await prisma.signal.update({
        where: { id: signalId },
        data: { status: SignalStatus.EXPIRED },
      });
      throw new Error('SIGNAL_EXPIRED');
    }

    // Check blocking relations
    const blockExists = await prisma.userBlock.findFirst({
      where: {
        OR: [
          { blockerId: signal.creatorId, blockedId: userId },
          { blockerId: userId, blockedId: signal.creatorId },
        ],
      },
    });
    if (blockExists) {
      throw new Error('USER_BLOCKED');
    }

    // Check visibility if FRIENDS_ONLY
    if (signal.visibility === SignalVisibility.FRIENDS_ONLY && signal.creatorId !== userId) {
      const isFriend = await prisma.friendship.findFirst({
        where: {
          status: FriendshipStatus.ACCEPTED,
          OR: [
            { requesterId: signal.creatorId, addresseeId: userId },
            { requesterId: userId, addresseeId: signal.creatorId },
          ],
        },
      });
      if (!isFriend) {
        throw new Error('FRIENDS_ONLY_SIGNAL');
      }
    }

    // Check capacity
    if (signal.participants.length >= signal.maxCapacity) {
      throw new Error('SIGNAL_CAPACITY_FULL');
    }

    return await prisma.$transaction(async (tx) => {
      // Idempotent join or create
      const existing = await tx.signalParticipant.findUnique({
        where: {
          signalId_userId: { signalId, userId },
        },
      });

      if (!existing) {
        await tx.signalParticipant.create({
          data: {
            signalId,
            userId,
          },
        });
      }

      // Re-fetch total participants inside the transaction
      const currentParticipants = await tx.signalParticipant.findMany({
        where: { signalId },
        include: { user: true },
      });

      const participantCount = currentParticipants.length;

      // Check if threshold reached to Form a Moment!
      if (participantCount >= signal.minCount && signal.status === SignalStatus.BROADCASTING) {
        // 1. Create a full Moment using existing Moment Engine architecture
        const formedMoment = await tx.moment.create({
          data: {
            creatorId: signal.creatorId,
            title: `نکسوس سیگنال: ${signal.description.slice(0, 40)}`,
            description: signal.description,
            category: signal.activityCategory,
            capacity: signal.maxCapacity,
            participantCount: participantCount,
            visibility: signal.visibility === SignalVisibility.FRIENDS_ONLY ? MomentVisibility.FRIENDS_ONLY : MomentVisibility.PUBLIC,
            expiresAt: new Date(Date.now() + signal.estimatedDuration * 60 * 1000),
          },
        });

        // 2. Add all signal participants to the newly formed Moment
        for (const p of currentParticipants) {
          await tx.momentParticipant.create({
            data: {
              momentId: formedMoment.id,
              userId: p.userId,
            },
          });
        }

        // 3. Mark Signal as FORMED and link to the Moment
        const updatedSignal = await tx.signal.update({
          where: { id: signalId },
          data: {
            status: SignalStatus.FORMED,
            formedMomentId: formedMoment.id,
          },
        });

        // 4. Notify all participants via Transactional Outbox
        await tx.transactionalOutbox.create({
          data: {
            aggregateType: 'SIGNAL',
            aggregateId: signalId,
            eventType: 'signal.formed',
            payload: {
              signalId,
              momentId: formedMoment.id,
              participantIds: currentParticipants.map((p) => p.userId),
              title: formedMoment.title,
            },
          },
        });

        return {
          status: 'FORMED',
          signal: updatedSignal,
          moment: formedMoment,
          participants: currentParticipants,
        };
      }

      // If not formed yet, publish participant joined event
      await tx.transactionalOutbox.create({
        data: {
          aggregateType: 'SIGNAL',
          aggregateId: signalId,
          eventType: 'signal.participant_joined',
          payload: {
            signalId,
            userId,
            currentCount: participantCount,
            minCount: signal.minCount,
          },
        },
      });

      return {
        status: 'JOINED',
        signal,
        participantCount,
      };
    });
  }

  /**
   * 3. Leave or Withdraw from a Signal
   */
  static async leaveSignal(signalId: string, userId: string) {
    const signal = await prisma.signal.findUnique({
      where: { id: signalId },
      include: { participants: true },
    });

    if (!signal) {
      throw new Error('SIGNAL_NOT_FOUND');
    }

    if (signal.status !== SignalStatus.BROADCASTING) {
      throw new Error('CANNOT_LEAVE_FORMED_OR_ENDED_SIGNAL');
    }

    return await prisma.$transaction(async (tx) => {
      // If creator leaves, the signal is cancelled
      if (signal.creatorId === userId) {
        return await tx.signal.update({
          where: { id: signalId },
          data: { status: SignalStatus.CANCELLED },
        });
      }

      await tx.signalParticipant.deleteMany({
        where: {
          signalId,
          userId,
        },
      });

      return { success: true };
    });
  }

  /**
   * 4. Discover eligible public signals
   */
  static async discoverSignals(query: SignalDiscoveryQuery = {}) {
    const now = new Date();
    const limit = Math.min(query.limit || 20, 50);

    // Exclude signals from blocked users if viewerId is given
    let blockedUserIds: string[] = [];
    if (query.viewerId) {
      const blocks = await prisma.userBlock.findMany({
        where: {
          OR: [
            { blockerId: query.viewerId },
            { blockedId: query.viewerId },
          ],
        },
      });
      blockedUserIds = blocks.map((b) => (b.blockerId === query.viewerId ? b.blockedId : b.blockerId));
    }

    return await prisma.signal.findMany({
      where: {
        status: SignalStatus.BROADCASTING,
        visibility: SignalVisibility.PUBLIC,
        expiresAt: { gt: now },
        ...(query.category ? { activityCategory: query.category } : {}),
        ...(query.interest ? { targetInterest: query.interest } : {}),
        ...(blockedUserIds.length > 0 ? { creatorId: { notIn: blockedUserIds } } : {}),
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            username: true,
            avatarStyle: true,
            role: true,
            roleColor: true,
          },
        },
        participants: {
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
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  /**
   * 5. Expiration Worker
   */
  static async checkAndExpireSignals(): Promise<number> {
    const now = new Date();
    const expired = await prisma.signal.updateMany({
      where: {
        status: SignalStatus.BROADCASTING,
        expiresAt: { lt: now },
      },
      data: {
        status: SignalStatus.EXPIRED,
      },
    });
    return expired.count;
  }
}
