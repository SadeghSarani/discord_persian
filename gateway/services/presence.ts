import { EventEmitter } from 'node:events';

export interface PresenceInfo {
  userId: string;
  username: string;
  status: 'online' | 'offline';
  connectionsCount: number;
  lastSeenAt: Date;
}

/**
 * Ephemeral In-Memory Presence Tracker
 * Tracks multi-tab and multi-device connections per user without hammering PostgreSQL.
 */
export class PresenceManager extends EventEmitter {
  // Map of userId -> Set of socket IDs
  private userSockets: Map<string, Set<string>> = new Map();
  // Map of socketId -> userId
  private socketToUser: Map<string, string> = new Map();

  /**
   * Register a new connection for a user
   * Returns true if user just transitioned from offline to online.
   */
  addConnection(userId: string, socketId: string): boolean {
    let sockets = this.userSockets.get(userId);
    const wasOffline = !sockets || sockets.size === 0;

    if (!sockets) {
      sockets = new Set<string>();
      this.userSockets.set(userId, sockets);
    }

    sockets.add(socketId);
    this.socketToUser.set(socketId, userId);

    if (wasOffline) {
      this.emit('status_change', {
        userId,
        status: 'online',
        connectionsCount: 1,
      });
    }

    return wasOffline;
  }

  /**
   * Remove a connection for a socket
   * Returns true if user has no more active connections and transitioned to offline.
   */
  removeConnection(socketId: string): { userId?: string; becameOffline: boolean } {
    const userId = this.socketToUser.get(socketId);
    if (!userId) {
      return { becameOffline: false };
    }

    this.socketToUser.delete(socketId);
    const sockets = this.userSockets.get(userId);

    if (!sockets) {
      return { userId, becameOffline: false };
    }

    sockets.delete(socketId);

    if (sockets.size === 0) {
      this.userSockets.delete(userId);
      this.emit('status_change', {
        userId,
        status: 'offline',
        connectionsCount: 0,
      });
      return { userId, becameOffline: true };
    }

    return { userId, becameOffline: false };
  }

  /**
   * Check if user is currently online
   */
  isUserOnline(userId: string): boolean {
    const sockets = this.userSockets.get(userId);
    return !!sockets && sockets.size > 0;
  }

  /**
   * Get active connection count for a user
   */
  getConnectionCount(userId: string): number {
    return this.userSockets.get(userId)?.size ?? 0;
  }

  /**
   * Get all active socket IDs for a user (useful for session revocation disconnect)
   */
  getUserSockets(userId: string): string[] {
    const sockets = this.userSockets.get(userId);
    return sockets ? Array.from(sockets) : [];
  }
}

export const presenceManager = new PresenceManager();
