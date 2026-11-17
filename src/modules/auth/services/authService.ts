import { prisma } from '../../../lib/db.ts';
import {
  hashPassword,
  verifyPassword,
  generateSecureToken,
  hashToken,
} from '../utils/crypto.ts';
import type { User, Session } from '@prisma/client';

export interface RegisterDTO {
  username: string;
  email: string;
  name: string;
  password: string;
  avatarStyle?: string;
}

export interface LoginDTO {
  identifier: string; // username or email
  password: string;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export interface SafeUser {
  id: string;
  username: string;
  name: string;
  email: string;
  avatarStyle: string;
  bio: string | null;
  customStatus: string | null;
  gameActivity: string | null;
  role: string;
  roleColor: string;
  isVerified: boolean;
  createdAt: Date;
}

export function toSafeUser(user: User): SafeUser {
  return {
    id: user.id,
    username: user.username,
    name: user.name,
    email: user.email,
    avatarStyle: user.avatarStyle,
    bio: user.bio,
    customStatus: user.customStatus,
    gameActivity: user.gameActivity,
    role: user.role,
    roleColor: user.roleColor,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
  };
}

export const SESSION_DURATION_DAYS = 30;
export const RESET_TOKEN_DURATION_MINUTES = 15;

export class AuthService {
  /**
   * Register a new user with account credentials and initial XP profile.
   */
  static async register(dto: RegisterDTO, ipAddress?: string | null, userAgent?: string | null): Promise<{ user: SafeUser; sessionToken: string; expiresAt: Date }> {
    const username = dto.username.trim().toLowerCase();
    const email = dto.email.trim().toLowerCase();
    const name = dto.name.trim();

    // Reserved usernames protection
    const RESERVED_USERNAMES = ['admin', 'administrator', 'root', 'support', 'moderator', 'system', 'nexus'];
    if (RESERVED_USERNAMES.includes(username)) {
      throw new Error('USERNAME_RESERVED');
    }

    // Validation
    if (!/^[a-z0-9_]{3,32}$/.test(username)) {
      throw new Error('INVALID_USERNAME_FORMAT');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('INVALID_EMAIL_FORMAT');
    }
    if (!name || name.length > 64) {
      throw new Error('INVALID_NAME');
    }
    if (!dto.password || dto.password.length < 8) {
      throw new Error('PASSWORD_TOO_SHORT');
    }

    // Check existing
    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existing) {
      if (existing.username === username) {
        throw new Error('USERNAME_ALREADY_EXISTS');
      }
      throw new Error('EMAIL_ALREADY_EXISTS');
    }

    const passwordHash = await hashPassword(dto.password);
    const sessionToken = generateSecureToken();
    const tokenHash = hashToken(sessionToken);
    const expiresAt = new Date(Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000);

    // Atomic transaction for User + Credential + Session + UserXp
    const created = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          username,
          email,
          name,
          avatarStyle: dto.avatarStyle || 'golden_king',
          credential: {
            create: {
              passwordHash,
            },
          },
          userXp: {
            create: {
              totalXp: 0,
              currentLevel: 1,
            },
          },
          sessions: {
            create: {
              tokenHash,
              ipAddress: ipAddress ?? null,
              userAgent: userAgent ?? null,
              expiresAt,
            },
          },
        },
      });

      return newUser;
    });

    return {
      user: toSafeUser(created),
      sessionToken,
      expiresAt,
    };
  }

  /**
   * Log in user via username or email and create a session.
   */
  static async login(dto: LoginDTO): Promise<{ user: SafeUser; sessionToken: string; expiresAt: Date }> {
    const identifier = dto.identifier.trim().toLowerCase();

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: identifier },
          { email: identifier },
        ],
      },
      include: {
        credential: true,
      },
    });

    if (!user || !user.credential) {
      throw new Error('INVALID_CREDENTIALS');
    }

    if (user.isBanned) {
      throw new Error('USER_BANNED');
    }

    const isValid = await verifyPassword(dto.password, user.credential.passwordHash);
    if (!isValid) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const sessionToken = generateSecureToken();
    const tokenHash = hashToken(sessionToken);
    const expiresAt = new Date(Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000);

    await prisma.session.create({
      data: {
        userId: user.id,
        tokenHash,
        ipAddress: dto.ipAddress ?? null,
        userAgent: dto.userAgent ?? null,
        expiresAt,
      },
    });

    return {
      user: toSafeUser(user),
      sessionToken,
      expiresAt,
    };
  }

  /**
   * Validate session token from cookie/bearer header.
   */
  static async validateSession(sessionToken: string): Promise<{ user: SafeUser; session: Session } | null> {
    if (!sessionToken || sessionToken.length < 16) {
      return null;
    }

    const tokenHash = hashToken(sessionToken);
    const session = await prisma.session.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!session) {
      return null;
    }

    const now = new Date();
    if (session.expiresAt <= now) {
      // Clean up expired session asynchronously
      prisma.session.delete({ where: { id: session.id } }).catch(() => {});
      return null;
    }

    if (session.user.isBanned) {
      return null;
    }

    // Touch lastActiveAt every 5 minutes
    if (now.getTime() - session.lastActiveAt.getTime() > 5 * 60 * 1000) {
      prisma.session.update({
        where: { id: session.id },
        data: { lastActiveAt: now },
      }).catch(() => {});
    }

    return {
      user: toSafeUser(session.user),
      session,
    };
  }

  /**
   * Logout current session by raw session token.
   */
  static async logout(sessionToken: string): Promise<boolean> {
    if (!sessionToken) return false;
    const tokenHash = hashToken(sessionToken);
    try {
      await prisma.session.delete({
        where: { tokenHash },
      });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Revoke all active sessions for a user (logout from all devices).
   */
  static async logoutAll(userId: string): Promise<number> {
    const result = await prisma.session.deleteMany({
      where: { userId },
    });
    return result.count;
  }

  /**
   * Request password reset token.
   */
  static async requestPasswordReset(email: string): Promise<{ resetToken: string; expiresAt: Date } | null> {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return null;
    }

    const resetToken = generateSecureToken();
    const tokenHash = hashToken(resetToken);
    const expiresAt = new Date(Date.now() + RESET_TOKEN_DURATION_MINUTES * 60 * 1000);

    // Invalidate previous unexpired reset tokens for this user
    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    return {
      resetToken,
      expiresAt,
    };
  }

  /**
   * Reset password with reset token. Revokes all active sessions upon password reset.
   */
  static async resetPassword(token: string, newPassword: string): Promise<boolean> {
    if (!token || !newPassword || newPassword.length < 8) {
      throw new Error('INVALID_PASSWORD_OR_TOKEN');
    }

    const tokenHash = hashToken(token);
    const record = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!record || record.usedAt || record.expiresAt <= new Date()) {
      throw new Error('EXPIRED_OR_INVALID_TOKEN');
    }

    const newPasswordHash = await hashPassword(newPassword);

    await prisma.$transaction(async (tx) => {
      // Mark token used
      await tx.passwordResetToken.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      });

      // Update password hash
      await tx.accountCredential.upsert({
        where: { userId: record.userId },
        create: {
          userId: record.userId,
          passwordHash: newPasswordHash,
        },
        update: {
          passwordHash: newPasswordHash,
        },
      });

      // Revoke all existing sessions for security
      await tx.session.deleteMany({
        where: { userId: record.userId },
      });
    });

    return true;
  }
}
