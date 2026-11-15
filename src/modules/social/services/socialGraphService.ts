import { prisma } from '../../../lib/db.ts';
import { FriendshipStatus } from '@prisma/client';

export class SocialGraphService {
  /**
   * Send friend request
   */
  static async sendFriendRequest(requesterId: string, addresseeId: string) {
    if (requesterId === addresseeId) throw new Error('CANNOT_FRIEND_SELF');

    return prisma.$transaction(async (tx) => {
      // 1. Check block between users
      const isBlocked = await tx.userBlock.findFirst({
        where: {
          OR: [
            { blockerId: requesterId, blockedId: addresseeId },
            { blockerId: addresseeId, blockedId: requesterId },
          ],
        },
      });
      if (isBlocked) throw new Error('USER_BLOCKED');

      // 2. Check reciprocal request (User B already sent request to User A -> automatically accept)
      const reciprocal = await tx.friendship.findUnique({
        where: {
          requesterId_addresseeId: {
            requesterId: addresseeId,
            addresseeId: requesterId,
          },
        },
      });

      if (reciprocal) {
        if (reciprocal.status === FriendshipStatus.PENDING) {
          const accepted = await tx.friendship.update({
            where: { id: reciprocal.id },
            data: { status: FriendshipStatus.ACCEPTED },
          });

          await tx.transactionalOutbox.create({
            data: {
              aggregateType: 'USER',
              aggregateId: requesterId,
              eventType: 'friendship.accepted',
              payload: { requesterId, addresseeId },
            },
          });

          return accepted;
        }
        if (reciprocal.status === FriendshipStatus.ACCEPTED) {
          return reciprocal;
        }
      }

      // 3. Create or update friend request
      const existing = await tx.friendship.findUnique({
        where: {
          requesterId_addresseeId: {
            requesterId,
            addresseeId,
          },
        },
      });

      if (existing) {
        if (existing.status === FriendshipStatus.ACCEPTED) return existing;
        if (existing.status === FriendshipStatus.PENDING) throw new Error('REQUEST_ALREADY_PENDING');
        return tx.friendship.update({
          where: { id: existing.id },
          data: { status: FriendshipStatus.PENDING },
        });
      }

      const request = await tx.friendship.create({
        data: {
          requesterId,
          addresseeId,
          status: FriendshipStatus.PENDING,
        },
      });

      await tx.transactionalOutbox.create({
        data: {
          aggregateType: 'USER',
          aggregateId: addresseeId,
          eventType: 'friendship.requested',
          payload: { requesterId, addresseeId },
        },
      });

      return request;
    });
  }

  /**
   * Accept friend request
   */
  static async acceptFriendRequest(userId: string, requesterId: string) {
    return prisma.$transaction(async (tx) => {
      const friendship = await tx.friendship.findUnique({
        where: {
          requesterId_addresseeId: {
            requesterId,
            addresseeId: userId,
          },
        },
      });

      if (!friendship || friendship.status !== FriendshipStatus.PENDING) {
        throw new Error('FRIEND_REQUEST_NOT_FOUND');
      }

      const accepted = await tx.friendship.update({
        where: { id: friendship.id },
        data: { status: FriendshipStatus.ACCEPTED },
      });

      await tx.transactionalOutbox.create({
        data: {
          aggregateType: 'USER',
          aggregateId: requesterId,
          eventType: 'friendship.accepted',
          payload: { requesterId, addresseeId: userId },
        },
      });

      return accepted;
    });
  }

  /**
   * Reject or remove friendship
   */
  static async removeFriendship(userAId: string, userBId: string) {
    return prisma.friendship.deleteMany({
      where: {
        OR: [
          { requesterId: userAId, addresseeId: userBId },
          { requesterId: userBId, addresseeId: userAId },
        ],
      },
    });
  }

  /**
   * List accepted friends
   */
  static async listFriends(userId: string) {
    const friendships = await prisma.friendship.findMany({
      where: {
        status: FriendshipStatus.ACCEPTED,
        OR: [{ requesterId: userId }, { addresseeId: userId }],
      },
      include: {
        requester: { select: { id: true, name: true, username: true, avatarStyle: true, roleColor: true } },
        addressee: { select: { id: true, name: true, username: true, avatarStyle: true, roleColor: true } },
      },
    });

    return friendships.map((f) => (f.requesterId === userId ? f.addressee : f.requester));
  }

  /**
   * List incoming pending friend requests
   */
  static async listIncomingRequests(userId: string) {
    return prisma.friendship.findMany({
      where: {
        addresseeId: userId,
        status: FriendshipStatus.PENDING,
      },
      include: {
        requester: { select: { id: true, name: true, username: true, avatarStyle: true } },
      },
    });
  }

  /**
   * Block user (terminates friendship, prevents future interactions)
   */
  static async blockUser(blockerId: string, blockedId: string) {
    if (blockerId === blockedId) throw new Error('CANNOT_BLOCK_SELF');

    return prisma.$transaction(async (tx) => {
      // Remove any friendship
      await tx.friendship.deleteMany({
        where: {
          OR: [
            { requesterId: blockerId, addresseeId: blockedId },
            { requesterId: blockedId, addresseeId: blockerId },
          ],
        },
      });

      return tx.userBlock.upsert({
        where: { blockerId_blockedId: { blockerId, blockedId } },
        create: { blockerId, blockedId },
        update: {},
      });
    });
  }

  /**
   * Unblock user
   */
  static async unblockUser(blockerId: string, blockedId: string) {
    return prisma.userBlock.deleteMany({
      where: { blockerId, blockedId },
    });
  }

  /**
   * Mute user
   */
  static async muteUser(muterId: string, mutedId: string, durationHours?: number) {
    if (muterId === mutedId) throw new Error('CANNOT_MUTE_SELF');
    const expiresAt = durationHours ? new Date(Date.now() + durationHours * 3600000) : null;

    return prisma.userMute.upsert({
      where: { muterId_mutedId: { muterId, mutedId } },
      create: { muterId, mutedId, expiresAt },
      update: { expiresAt },
    });
  }

  /**
   * Unmute user
   */
  static async unmuteUser(muterId: string, mutedId: string) {
    return prisma.userMute.deleteMany({
      where: { muterId, mutedId },
    });
  }
}
