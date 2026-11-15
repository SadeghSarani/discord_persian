import http from 'node:http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { socketAuthMiddleware, authorizeRoomJoin } from './security/auth.ts';
import { presenceManager } from './services/presence.ts';
import { OutboxDispatcher } from './services/outboxDispatcher.ts';
import { REALTIME_EVENTS, ROOM_PATTERNS } from './contracts/events.ts';
import { AuthService } from '../src/modules/auth/services/authService.ts';

export interface GatewayConfig {
  port?: number;
  corsOrigin?: string | string[];
}

export class RealtimeGateway {
  public server: http.Server;
  public io: SocketIOServer;
  public dispatcher: OutboxDispatcher;
  private port: number;

  constructor(config: GatewayConfig = {}) {
    this.port = config.port ?? 4001;

    this.server = http.createServer((req, res) => {
      if (req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', uptime: process.uptime() }));
        return;
      }
      res.writeHead(404);
      res.end();
    });

    this.io = new SocketIOServer(this.server, {
      cors: {
        origin: config.corsOrigin ?? ['http://localhost:3000', 'http://127.0.0.1:3000'],
        credentials: true,
      },
      pingTimeout: 20000,
      pingInterval: 10000,
    });

    this.dispatcher = new OutboxDispatcher(this.io);

    this.setupMiddleware();
    this.setupEventHandlers();
  }

  private setupMiddleware() {
    this.io.use(socketAuthMiddleware);
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket: Socket) => {
      const socketData = socket.data as any;
      const user = socketData.user;

      // 1. Auto-join user's private notification room
      const userPrivateRoom = ROOM_PATTERNS.user(user.id);
      socket.join(userPrivateRoom);

      // 2. Track Presence
      const becameOnline = presenceManager.addConnection(user.id, socket.id);
      if (becameOnline) {
        this.io.emit(REALTIME_EVENTS.PRESENCE_ONLINE, {
          userId: user.id,
          username: user.username,
          timestamp: new Date().toISOString(),
        });
      }

      // 3. Room Subscription Request with Authorization Guard
      socket.on('room:join', async (roomName: string, ack?: (res: { success: boolean; error?: string }) => void) => {
        try {
          if (!roomName || typeof roomName !== 'string') {
            if (ack) ack({ success: false, error: 'INVALID_ROOM_NAME' });
            return;
          }

          // Special discovery feeds (e.g. moments discovery feed) are accessible to all authenticated users
          if (roomName === 'feed:moments' || roomName === 'feed:discover') {
            socket.join(roomName);
            if (ack) ack({ success: true });
            return;
          }

          const isAuthorized = await authorizeRoomJoin(user, roomName);
          if (!isAuthorized) {
            if (ack) ack({ success: false, error: 'ROOM_ACCESS_DENIED' });
            return;
          }

          socket.join(roomName);
          if (ack) ack({ success: true });
        } catch (err: any) {
          if (ack) ack({ success: false, error: err.message || 'ROOM_JOIN_FAILED' });
        }
      });

      // 4. Room Leave Request
      socket.on('room:leave', (roomName: string, ack?: (res: { success: boolean }) => void) => {
        if (roomName && typeof roomName === 'string') {
          socket.leave(roomName);
        }
        if (ack) ack({ success: true });
      });

      // 5. WebRTC Signaling Relaying (Offer, Answer, ICE candidate) with Authorization
      socket.on('signaling:send', async (data: { targetRoom: string; type: string; payload: any }, ack?: (res: { success: boolean; error?: string }) => void) => {
        try {
          if (!data || !data.targetRoom) {
            if (ack) ack({ success: false, error: 'MISSING_TARGET_ROOM' });
            return;
          }

          // Must be authorized in target room to send signaling
          const isAuthorized = await authorizeRoomJoin(user, data.targetRoom);
          if (!isAuthorized) {
            if (ack) ack({ success: false, error: 'SIGNALING_DENIED' });
            return;
          }

          socket.to(data.targetRoom).emit('signaling:message', {
            fromUserId: user.id,
            fromSocketId: socket.id,
            type: data.type,
            payload: data.payload,
            timestamp: new Date().toISOString(),
          });

          if (ack) ack({ success: true });
        } catch (err: any) {
          if (ack) ack({ success: false, error: err.message });
        }
      });

      // 6. Explicit Session Disconnect on Revocation Notice
      socket.on('session:revoke_client', async () => {
        await AuthService.logout(socketData.sessionToken);
        socket.emit(REALTIME_EVENTS.SESSION_REVOKED, { message: 'LOGGED_OUT' });
        socket.disconnect(true);
      });

      // 7. Disconnection Cleanup
      socket.on('disconnect', (reason) => {
        const { becameOffline } = presenceManager.removeConnection(socket.id);
        if (becameOffline) {
          this.io.emit(REALTIME_EVENTS.PRESENCE_OFFLINE, {
            userId: user.id,
            username: user.username,
            lastSeenAt: new Date().toISOString(),
          });
        }
      });
    });
  }

  /**
   * Terminate all active socket connections for a given user (called upon logout or logoutAll)
   */
  disconnectUser(userId: string, reason = 'SESSION_REVOKED') {
    const socketIds = presenceManager.getUserSockets(userId);
    for (const sid of socketIds) {
      const socket = this.io.sockets.sockets.get(sid);
      if (socket) {
        socket.emit(REALTIME_EVENTS.SESSION_REVOKED, { reason });
        socket.disconnect(true);
      }
    }
  }

  async start(): Promise<void> {
    return new Promise((resolve) => {
      this.server.listen(this.port, () => {
        console.log(`[RealtimeGateway] Running on port ${this.port}`);
        this.dispatcher.start();
        resolve();
      });
    });
  }

  async stop(): Promise<void> {
    this.dispatcher.stop();
    return new Promise((resolve) => {
      this.io.close(() => {
        this.server.close(() => {
          console.log('[RealtimeGateway] Gracefully stopped');
          resolve();
        });
      });
    });
  }
}
