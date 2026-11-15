import { Server as SocketIOServer } from 'socket.io';
import { prisma } from '../../src/lib/db.ts';
import { REALTIME_EVENTS, ROOM_PATTERNS } from '../contracts/events.ts';

export interface DispatcherOptions {
  pollIntervalMs?: number;
  batchSize?: number;
  maxRetries?: number;
}

/**
 * Transactional Outbox Dispatcher
 * Polls unconsumed outbox events with atomic state transitions and broadcasts to Socket.IO.
 */
export class OutboxDispatcher {
  private io: SocketIOServer;
  private pollIntervalMs: number;
  private batchSize: number;
  private maxRetries: number;
  private isRunning: boolean = false;
  private timer: NodeJS.Timeout | null = null;

  constructor(io: SocketIOServer, options: DispatcherOptions = {}) {
    this.io = io;
    this.pollIntervalMs = options.pollIntervalMs ?? 500;
    this.batchSize = options.batchSize ?? 50;
    this.maxRetries = options.maxRetries ?? 5;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.scheduleNextPoll(0);
  }

  stop() {
    this.isRunning = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  private scheduleNextPoll(delayMs: number) {
    if (!this.isRunning) return;
    this.timer = setTimeout(async () => {
      try {
        await this.processPendingEvents();
      } catch (err) {
        console.error('[OutboxDispatcher] Error processing batch:', err);
      } finally {
        this.scheduleNextPoll(this.pollIntervalMs);
      }
    }, delayMs);
  }

  /**
   * Process a batch of unpublished outbox records
   */
  async processPendingEvents(): Promise<number> {
    // Claim unconsumed records using atomic lock or status flag
    const records = await prisma.transactionalOutbox.findMany({
      where: {
        isPublished: false,
        retryCount: { lt: this.maxRetries },
      },
      orderBy: { createdAt: 'asc' },
      take: this.batchSize,
    });

    if (records.length === 0) {
      return 0;
    }

    let processedCount = 0;

    for (const record of records) {
      try {
        this.dispatchEvent(record);

        // Mark published atomically
        await prisma.transactionalOutbox.update({
          where: { id: record.id },
          data: {
            isPublished: true,
            publishedAt: new Date(),
          },
        });

        processedCount++;
      } catch (err: any) {
        console.error(`[OutboxDispatcher] Failed to dispatch event ${record.id}:`, err);

        await prisma.transactionalOutbox.update({
          where: { id: record.id },
          data: {
            retryCount: { increment: 1 },
            lastError: err.message || 'DISPATCH_ERROR',
          },
        });
      }
    }

    return processedCount;
  }

  /**
   * Route event to appropriate Socket.IO room
   */
  private dispatchEvent(record: {
    id: string;
    aggregateType: string;
    aggregateId: string;
    eventType: string;
    payload: any;
    createdAt: Date;
  }) {
    const { aggregateType, aggregateId, eventType, payload, createdAt } = record;

    const envelope = {
      eventId: record.id,
      eventType,
      aggregateType,
      aggregateId,
      payload,
      timestamp: createdAt.toISOString(),
    };

    switch (aggregateType.toUpperCase()) {
      case 'MOMENT': {
        const room = ROOM_PATTERNS.moment(aggregateId);
        this.io.to(room).emit(eventType, envelope);
        // Also broadcast to general moments feed room for discovery
        this.io.to('feed:moments').emit(eventType, envelope);
        break;
      }

      case 'CHANNEL': {
        const room = ROOM_PATTERNS.channel(aggregateId);
        this.io.to(room).emit(eventType, envelope);
        break;
      }

      case 'COMMUNITY': {
        const room = ROOM_PATTERNS.community(aggregateId);
        this.io.to(room).emit(eventType, envelope);
        break;
      }

      case 'USER': {
        const room = ROOM_PATTERNS.user(aggregateId);
        this.io.to(room).emit(eventType, envelope);
        break;
      }

      case 'CONVERSATION': {
        const room = ROOM_PATTERNS.conversation(aggregateId);
        this.io.to(room).emit(eventType, envelope);
        break;
      }

      case 'PLAYGROUND': {
        const room = ROOM_PATTERNS.playground(aggregateId);
        this.io.to(room).emit(eventType, envelope);
        break;
      }

      default: {
        // Fallback broadcast to targeted room if matching aggregateId
        this.io.to(aggregateId).emit(eventType, envelope);
        break;
      }
    }
  }
}
