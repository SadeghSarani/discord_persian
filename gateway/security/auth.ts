import { prisma } from '../../src/lib/db.ts';
import { AuthService } from '../../src/modules/auth/services/authService.ts';
import { parseCookie } from 'cookie';
import { SESSION_COOKIE_NAME } from '../../src/modules/auth/utils/crypto.ts';
import type { Socket } from 'socket.io';

export interface AuthenticatedUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
  roleColor: string;
}

export interface AuthenticatedSocketData {
  user: AuthenticatedUser;
  sessionId: string;
  sessionToken: string;
}

/**
 * Socket.IO Handshake Authentication Middleware
 * Validates session token from cookie or handshake.auth.token
 */
export async function socketAuthMiddleware(
  socket: Socket,
  next: (err?: Error) => void
) {
  try {
    let token: string | undefined = socket.handshake.auth?.token;

    if (!token && socket.handshake.headers.cookie) {
      const cookies = parseCookie(socket.handshake.headers.cookie);
      token =
        cookies[SESSION_COOKIE_NAME] ||
        cookies['__Host-nexus_session'] ||
        cookies['nexus_session'];
    }

    if (!token && socket.handshake.headers.authorization) {
      const authHeader = socket.handshake.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7).trim();
      }
    }

    if (!token) {
      return next(new Error('AUTHENTICATION_REQUIRED'));
    }

    const authResult = await AuthService.validateSession(token);
    if (!authResult) {
      return next(new Error('SESSION_EXPIRED_OR_INVALID'));
    }

    socket.data = {
      user: {
        id: authResult.user.id,
        username: authResult.user.username,
        name: authResult.user.name,
        email: authResult.user.email,
        role: authResult.user.role,
        roleColor: authResult.user.roleColor,
      },
      sessionId: authResult.session.id,
      sessionToken: token,
    } as AuthenticatedSocketData;

    next();
  } catch (err: any) {
    next(new Error('AUTHENTICATION_FAILED'));
  }
}

/**
 * Authorization Guard for joining Rooms
 * Room prefixes: user:, community:, channel:, moment:, dm:, playground:, signaling:
 */
export async function authorizeRoomJoin(
  user: AuthenticatedUser,
  room: string
): Promise<boolean> {
  const [category, targetId] = room.split(':');
  if (!category || !targetId) return false;

  switch (category) {
    case 'user':
      // Users can only join their own personal room
      return user.id === targetId;

    case 'moment': {
      // Moments: public LIVE moments or moments user is participant of
      const moment = await prisma.moment.findUnique({
        where: { id: targetId },
        include: { participants: true },
      });
      if (!moment) return false;
      if (moment.visibility === 'PUBLIC') return true;
      return (
        moment.creatorId === user.id ||
        moment.participants.some((p) => p.userId === user.id)
      );
    }

    case 'channel': {
      // Channel: user must be member of the channel's community
      const channel = await prisma.channel.findUnique({
        where: { id: targetId },
        include: { community: { include: { members: true } } },
      });
      if (!channel) return false;
      return channel.community.members.some((m) => m.userId === user.id);
    }

    case 'community': {
      const member = await prisma.communityMember.findUnique({
        where: {
          communityId_userId: {
            communityId: targetId,
            userId: user.id,
          },
        },
      });
      return !!member;
    }

    case 'dm': {
      // Direct Message / conversation room
      const conv = await prisma.conversation.findUnique({
        where: { id: targetId },
        include: { participants: true },
      });
      if (!conv) return false;
      return conv.participants.some((p) => p.userId === user.id);
    }

    case 'signaling': {
      // Signaling room follows channel membership or moment participation
      const channel = await prisma.channel.findUnique({
        where: { id: targetId },
        include: { community: { include: { members: true } } },
      });
      if (channel) {
        return channel.community.members.some((m) => m.userId === user.id);
      }
      const moment = await prisma.moment.findUnique({
        where: { id: targetId },
        include: { participants: true },
      });
      if (moment) {
        return (
          moment.creatorId === user.id ||
          moment.participants.some((p) => p.userId === user.id)
        );
      }
      return false;
    }

    case 'playground':
      // Playground sessions
      return true;

    default:
      return false;
  }
}
