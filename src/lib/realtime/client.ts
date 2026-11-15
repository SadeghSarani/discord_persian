import { io, Socket } from 'socket.io-client';
import { REALTIME_EVENTS, RealtimeEventName } from '../../../gateway/contracts/events';

export interface RealtimeClientOptions {
  url?: string;
  token?: string;
  autoConnect?: boolean;
}

export class RealtimeClient {
  private socket: Socket | null = null;
  private url: string;
  private token?: string;
  private subscribedRooms: Set<string> = new Set();
  private eventHandlers: Map<string, Set<(data: any) => void>> = new Map();

  constructor(options: RealtimeClientOptions = {}) {
    this.url = options.url || (typeof window !== 'undefined' ? 'http://localhost:4001' : 'http://localhost:4001');
    this.token = options.token;

    if (options.autoConnect && typeof window !== 'undefined') {
      this.connect();
    }
  }

  connect(token?: string) {
    if (this.socket && this.socket.connected) return;

    if (token) this.token = token;

    this.socket = io(this.url, {
      withCredentials: true,
      auth: this.token ? { token: this.token } : {},
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    this.socket.on('connect', () => {
      // Re-join subscribed rooms after reconnection
      for (const room of this.subscribedRooms) {
        this.socket?.emit('room:join', room);
      }
    });

    this.socket.on(REALTIME_EVENTS.SESSION_REVOKED, () => {
      this.disconnect();
    });

    // Reattach registered event handlers
    for (const [event, handlers] of this.eventHandlers.entries()) {
      for (const handler of handlers) {
        this.socket.on(event, handler);
      }
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.subscribedRooms.clear();
  }

  joinRoom(room: string): Promise<boolean> {
    this.subscribedRooms.add(room);
    return new Promise((resolve) => {
      if (!this.socket || !this.socket.connected) {
        // Will join on connect
        resolve(true);
        return;
      }
      this.socket.emit('room:join', room, (res: { success: boolean; error?: string }) => {
        resolve(!!res?.success);
      });
    });
  }

  leaveRoom(room: string) {
    this.subscribedRooms.delete(room);
    if (this.socket && this.socket.connected) {
      this.socket.emit('room:leave', room);
    }
  }

  on(event: RealtimeEventName | string, handler: (data: any) => void) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)!.add(handler);

    if (this.socket) {
      this.socket.on(event, handler);
    }
  }

  off(event: RealtimeEventName | string, handler: (data: any) => void) {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.delete(handler);
    }
    if (this.socket) {
      this.socket.off(event, handler);
    }
  }

  sendSignaling(targetRoom: string, type: string, payload: any): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.socket || !this.socket.connected) {
        resolve(false);
        return;
      }
      this.socket.emit('signaling:send', { targetRoom, type, payload }, (res: { success: boolean }) => {
        resolve(!!res?.success);
      });
    });
  }

  isConnected(): boolean {
    return !!this.socket && this.socket.connected;
  }
}

export const realtimeClient = new RealtimeClient();
