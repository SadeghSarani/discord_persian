import { prisma } from '../../../lib/db.ts';

export interface SendMessageDTO {
  content: string;
  attachments?: {
    fileKey: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
  }[];
}

export class MessagingService {
  /**
   * Send message to channel with membership and block verification
   */
  static async sendMessage(channelId: string, userId: string, data: SendMessageDTO) {
    const content = data.content.trim();
    if (!content && (!data.attachments || data.attachments.length === 0)) {
      throw new Error('EMPTY_MESSAGE');
    }

    return prisma.$transaction(async (tx) => {
      // 1. Verify channel & community membership
      const channel = await tx.channel.findUnique({
        where: { id: channelId },
        include: { community: true },
      });
      if (!channel) throw new Error('CHANNEL_NOT_FOUND');

      const membership = await tx.communityMember.findUnique({
        where: { communityId_userId: { communityId: channel.communityId, userId } },
      });
      if (!membership) throw new Error('NOT_COMMUNITY_MEMBER');

      // 2. Persist Message
      const message = await tx.message.create({
        data: {
          channelId,
          userId,
          content,
          attachments: data.attachments && data.attachments.length > 0 ? {
            create: data.attachments.map((a) => ({
              fileKey: a.fileKey,
              fileName: a.fileName,
              fileSize: a.fileSize,
              mimeType: a.mimeType,
            })),
          } : undefined,
        },
        include: {
          user: { select: { id: true, name: true, username: true, avatarStyle: true, roleColor: true } },
          attachments: true,
          reactions: true,
        },
      });

      // 3. Outbox Event
      await tx.transactionalOutbox.create({
        data: {
          aggregateType: 'CHANNEL',
          aggregateId: channelId,
          eventType: 'message.created',
          payload: {
            messageId: message.id,
            channelId,
            userId,
            content: message.content,
            user: message.user,
            createdAt: message.createdAt.toISOString(),
          },
        },
      });

      return message;
    });
  }

  /**
   * List messages in channel with cursor pagination
   */
  static async getChannelMessages(channelId: string, userId: string, cursor?: string, limit = 50) {
    const channel = await prisma.channel.findUnique({ where: { id: channelId } });
    if (!channel) throw new Error('CHANNEL_NOT_FOUND');

    const membership = await prisma.communityMember.findUnique({
      where: { communityId_userId: { communityId: channel.communityId, userId } },
    });
    if (!membership) throw new Error('NOT_COMMUNITY_MEMBER');

    const take = Math.min(Math.max(limit, 1), 100);
    const where: any = { channelId };
    if (cursor) {
      where.id = { lt: cursor };
    }

    const messages = await prisma.message.findMany({
      where,
      take: take + 1,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, username: true, avatarStyle: true, roleColor: true } },
        attachments: true,
        reactions: true,
      },
    });

    const hasMore = messages.length > take;
    const items = hasMore ? messages.slice(0, take) : messages;
    const nextCursor = hasMore ? items[items.length - 1].id : null;

    return {
      items: items.reverse(), // chronologically ordered for client view
      nextCursor,
      hasMore,
    };
  }

  /**
   * Edit own message
   */
  static async editMessage(messageId: string, userId: string, newContent: string) {
    const content = newContent.trim();
    if (!content) throw new Error('EMPTY_MESSAGE');

    return prisma.$transaction(async (tx) => {
      const msg = await tx.message.findUnique({ where: { id: messageId } });
      if (!msg) throw new Error('MESSAGE_NOT_FOUND');
      if (msg.userId !== userId) throw new Error('FORBIDDEN_NOT_AUTHOR');

      // Record edit history
      await tx.messageEditHistory.create({
        data: {
          messageId,
          previousContent: msg.content,
        },
      });

      const updated = await tx.message.update({
        where: { id: messageId },
        data: {
          content,
          isEdited: true,
        },
        include: {
          user: { select: { id: true, name: true, username: true, avatarStyle: true } },
          attachments: true,
          reactions: true,
        },
      });

      await tx.transactionalOutbox.create({
        data: {
          aggregateType: 'CHANNEL',
          aggregateId: msg.channelId,
          eventType: 'message.updated',
          payload: {
            messageId,
            channelId: msg.channelId,
            content: updated.content,
            isEdited: true,
          },
        },
      });

      return updated;
    });
  }

  /**
   * Delete message (Author or Admin)
   */
  static async deleteMessage(messageId: string, userId: string) {
    return prisma.$transaction(async (tx) => {
      const msg = await tx.message.findUnique({
        where: { id: messageId },
        include: { channel: { include: { community: true } } },
      });
      if (!msg) throw new Error('MESSAGE_NOT_FOUND');

      const isAuthor = msg.userId === userId;
      const isOwner = msg.channel.community.ownerId === userId;
      if (!isAuthor && !isOwner) throw new Error('FORBIDDEN');

      await tx.message.delete({ where: { id: messageId } });

      await tx.transactionalOutbox.create({
        data: {
          aggregateType: 'CHANNEL',
          aggregateId: msg.channelId,
          eventType: 'message.deleted',
          payload: { messageId, channelId: msg.channelId },
        },
      });
    });
  }

  /**
   * Add reaction (Idempotent per user & emoji)
   */
  static async addReaction(messageId: string, userId: string, emoji: string) {
    return prisma.$transaction(async (tx) => {
      const msg = await tx.message.findUnique({ where: { id: messageId } });
      if (!msg) throw new Error('MESSAGE_NOT_FOUND');

      const reaction = await tx.messageReaction.upsert({
        where: {
          messageId_userId_emoji: {
            messageId,
            userId,
            emoji,
          },
        },
        create: {
          messageId,
          userId,
          emoji,
        },
        update: {},
      });

      await tx.transactionalOutbox.create({
        data: {
          aggregateType: 'CHANNEL',
          aggregateId: msg.channelId,
          eventType: 'message.reaction_added',
          payload: { messageId, channelId: msg.channelId, userId, emoji },
        },
      });

      return reaction;
    });
  }

  /**
   * Remove reaction
   */
  static async removeReaction(messageId: string, userId: string, emoji: string) {
    return prisma.$transaction(async (tx) => {
      const msg = await tx.message.findUnique({ where: { id: messageId } });
      if (!msg) throw new Error('MESSAGE_NOT_FOUND');

      await tx.messageReaction.deleteMany({
        where: { messageId, userId, emoji },
      });

      await tx.transactionalOutbox.create({
        data: {
          aggregateType: 'CHANNEL',
          aggregateId: msg.channelId,
          eventType: 'message.reaction_removed',
          payload: { messageId, channelId: msg.channelId, userId, emoji },
        },
      });
    });
  }

  // ==========================================
  // DIRECT MESSAGING (1-ON-1 & GROUP)
  // ==========================================

  /**
   * Get or create Direct Message conversation between two users
   */
  static async getOrCreateDirectConversation(userAId: string, userBId: string) {
    if (userAId === userBId) throw new Error('CANNOT_DM_SELF');

    // Check block
    const isBlocked = await prisma.userBlock.findFirst({
      where: {
        OR: [
          { blockerId: userAId, blockedId: userBId },
          { blockerId: userBId, blockedId: userAId },
        ],
      },
    });
    if (isBlocked) throw new Error('DM_BLOCKED_BY_USER');

    return prisma.$transaction(async (tx) => {
      // Find existing 1-on-1 DIRECT conversation
      const existing = await tx.conversation.findFirst({
        where: {
          type: 'DIRECT',
          AND: [
            { participants: { some: { userId: userAId } } },
            { participants: { some: { userId: userBId } } },
          ],
        },
        include: {
          participants: {
            include: {
              user: { select: { id: true, name: true, username: true, avatarStyle: true } },
            },
          },
        },
      });

      if (existing) return existing;

      // Create new conversation
      const conv = await tx.conversation.create({
        data: {
          type: 'DIRECT',
          participants: {
            create: [
              { userId: userAId },
              { userId: userBId },
            ],
          },
        },
        include: {
          participants: {
            include: {
              user: { select: { id: true, name: true, username: true, avatarStyle: true } },
            },
          },
        },
      });

      return conv;
    });
  }

  /**
   * Send Direct Message in Conversation
   */
  static async sendDirectMessage(conversationId: string, senderId: string, content: string) {
    const text = content.trim();
    if (!text) throw new Error('EMPTY_MESSAGE');

    return prisma.$transaction(async (tx) => {
      const conv = await tx.conversation.findUnique({
        where: { id: conversationId },
        include: { participants: true },
      });
      if (!conv) throw new Error('CONVERSATION_NOT_FOUND');

      const isParticipant = conv.participants.some((p) => p.userId === senderId);
      if (!isParticipant) throw new Error('FORBIDDEN_NOT_PARTICIPANT');

      // Check block between participants in direct conversation
      if (conv.type === 'DIRECT') {
        const otherParticipant = conv.participants.find((p) => p.userId !== senderId);
        if (otherParticipant) {
          const isBlocked = await tx.userBlock.findFirst({
            where: {
              OR: [
                { blockerId: senderId, blockedId: otherParticipant.userId },
                { blockerId: otherParticipant.userId, blockedId: senderId },
              ],
            },
          });
          if (isBlocked) throw new Error('DM_BLOCKED_BY_USER');
        }
      }

      const msg = await tx.directMessage.create({
        data: {
          conversationId,
          senderId,
          content: text,
        },
        include: {
          sender: { select: { id: true, name: true, username: true, avatarStyle: true } },
        },
      });

      // Update conversation updatedAt
      await tx.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
      });

      // Outbox Event
      await tx.transactionalOutbox.create({
        data: {
          aggregateType: 'CONVERSATION',
          aggregateId: conversationId,
          eventType: 'dm.message.created',
          payload: {
            messageId: msg.id,
            conversationId,
            senderId,
            content: msg.content,
            sender: msg.sender,
            createdAt: msg.createdAt.toISOString(),
          },
        },
      });

      return msg;
    });
  }

  /**
   * Retrieve Direct Messages history
   */
  static async getDirectMessages(conversationId: string, viewerId: string, limit = 50) {
    const conv = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { participants: true },
    });
    if (!conv) throw new Error('CONVERSATION_NOT_FOUND');

    const isPart = conv.participants.some((p) => p.userId === viewerId);
    if (!isPart) throw new Error('FORBIDDEN_NOT_PARTICIPANT');

    return prisma.directMessage.findMany({
      where: { conversationId },
      take: limit,
      orderBy: { createdAt: 'asc' },
      include: {
        sender: { select: { id: true, name: true, username: true, avatarStyle: true } },
      },
    });
  }
}
