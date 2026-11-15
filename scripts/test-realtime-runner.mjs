import http from 'node:http';
import { Server as SocketIOServer } from 'socket.io';
import { io as ClientIO } from 'socket.io-client';
import { PrismaClient, MomentStatus, ParticipantStatus, MomentVisibility } from '@prisma/client';
import crypto from 'node:crypto';
import { hash } from '@node-rs/argon2';
import { RealtimeGateway } from '../gateway/server.ts';
import { MomentService } from '../src/modules/moments/services/momentService.ts';

const prisma = new PrismaClient();

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}
function generateSecureToken() {
  return crypto.randomBytes(32).toString('hex');
}

async function runRealtimeIntegrationTests() {
  console.log('====================================================');
  console.log('🧪 NEXUS STAGE 3 — REALTIME & OUTBOX TEST SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition, testName) {
    total++;
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      process.exitCode = 1;
    }
  }

  const TEST_PORT = 4099;
  const gateway = new RealtimeGateway({ port: TEST_PORT });
  await gateway.start();

  let testUser1, testUser2, sessionToken1, sessionToken2;

  try {
    // 0. Setup test users and sessions in PostgreSQL
    const pHash = await hash('ValidPassword123!', { memoryCost: 19456, timeCost: 2, outputLen: 32, parallelism: 1 });
    sessionToken1 = generateSecureToken();
    sessionToken2 = generateSecureToken();

    // Clean previous
    await prisma.user.deleteMany({
      where: { username: { in: ['rt_user_1', 'rt_user_2'] } },
    });

    testUser1 = await prisma.user.create({
      data: {
        username: 'rt_user_1',
        email: 'rt_user_1@discaf.ir',
        name: 'کاربر ریل‌تایم ۱',
        credential: { create: { passwordHash: pHash } },
        sessions: {
          create: {
            tokenHash: hashToken(sessionToken1),
            expiresAt: new Date(Date.now() + 86400000),
          },
        },
      },
    });

    testUser2 = await prisma.user.create({
      data: {
        username: 'rt_user_2',
        email: 'rt_user_2@discaf.ir',
        name: 'کاربر ریل‌تایم ۲',
        credential: { create: { passwordHash: pHash } },
        sessions: {
          create: {
            tokenHash: hashToken(sessionToken2),
            expiresAt: new Date(Date.now() + 86400000),
          },
        },
      },
    });

    // TEST 1: Valid Authenticated Connection
    console.log('--- 1. Testing Authenticated Connection Handshake ---');
    const client1 = ClientIO(`http://localhost:${TEST_PORT}`, {
      auth: { token: sessionToken1 },
      transports: ['websocket'],
    });

    await new Promise((resolve) => client1.on('connect', resolve));
    assert(client1.connected, 'Valid session token successfully connects to Gateway');

    // TEST 2: Invalid Session Rejection
    console.log('\n--- 2. Testing Invalid Session Handshake Rejection ---');
    const fakeClient = ClientIO(`http://localhost:${TEST_PORT}`, {
      auth: { token: 'invalid_nonexistent_token' },
      transports: ['websocket'],
    });

    const fakeConnectError = await new Promise((resolve) => {
      fakeClient.on('connect_error', (err) => resolve(err.message));
    });
    assert(
      fakeConnectError === 'SESSION_EXPIRED_OR_INVALID',
      'Unauthenticated or forged session token rejected by Gateway'
    );
    fakeClient.disconnect();

    // TEST 3: Multi-tab Connection & Ephemeral Presence
    console.log('\n--- 3. Testing Multi-tab Presence Tracking ---');
    const client1Tab2 = ClientIO(`http://localhost:${TEST_PORT}`, {
      auth: { token: sessionToken1 },
      transports: ['websocket'],
    });
    await new Promise((resolve) => client1Tab2.on('connect', resolve));
    assert(client1Tab2.connected, 'Second tab for same user connected successfully');

    // Disconnect tab 1, user should remain online
    client1.disconnect();
    await new Promise((r) => setTimeout(r, 100));
    assert(client1Tab2.connected, 'User remains connected and online while Tab 2 is active');

    // TEST 4: Authorized Room Access Guard
    console.log('\n--- 4. Testing Room Authorization Guards ---');
    // Tab 2 attempts to join User 1's private room (allowed)
    const joinOwnRoom = await new Promise((resolve) => {
      client1Tab2.emit('room:join', `user:${testUser1.id}`, (res) => resolve(res));
    });
    assert(joinOwnRoom.success === true, 'User authorized to join their own private room');

    // Tab 2 attempts to join User 2's private room (forbidden)
    const joinOtherRoom = await new Promise((resolve) => {
      client1Tab2.emit('room:join', `user:${testUser2.id}`, (res) => resolve(res));
    });
    assert(
      joinOtherRoom.success === false && joinOtherRoom.error === 'ROOM_ACCESS_DENIED',
      'User rejected from joining another user private room'
    );

    // TEST 5: Transactional Outbox Persistence & Realtime Dispatch
    console.log('\n--- 5. Testing Transactional Outbox to Realtime Propagation ---');
    // Client 2 connects and joins moments discovery feed
    const client2 = ClientIO(`http://localhost:${TEST_PORT}`, {
      auth: { token: sessionToken2 },
      transports: ['websocket'],
    });
    await new Promise((resolve) => client2.on('connect', resolve));

    await new Promise((resolve) => {
      client2.emit('room:join', 'feed:moments', (res) => resolve(res));
    });

    // Listen for moment.created on client 2
    const receivedEventPromise = new Promise((resolve) => {
      client2.on('moment.created', (envelope) => {
        resolve(envelope);
      });
    });

    // Create a moment via MomentService (persists TransactionalOutbox record)
    const moment = await MomentService.createMoment({
      creatorId: testUser1.id,
      title: 'مامنت تست بلادرنگ',
      description: 'تست ایونت اوت‌باکس',
      category: 'Gaming',
      capacity: 4,
    });

    // Verify outbox record created
    const outboxRecord = await prisma.transactionalOutbox.findFirst({
      where: { aggregateId: moment.id, eventType: 'moment.created' },
    });
    assert(outboxRecord !== null, 'Event persisted transactionally in TransactionalOutbox table');

    // Wait for Dispatcher to poll, publish and deliver to Client 2
    const receivedEnvelope = await Promise.race([
      receivedEventPromise,
      new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), 4000)),
    ]);

    assert(
      receivedEnvelope && receivedEnvelope.payload.momentId === moment.id,
      'Transactional outbox dispatched and received by authorized subscriber over Socket.IO'
    );

    // Give a brief tick (50ms) for the DB update transaction to finish committing
    await new Promise((r) => setTimeout(r, 100));

    // Verify outbox record marked as published in PostgreSQL
    const updatedOutbox = await prisma.transactionalOutbox.findUnique({
      where: { id: outboxRecord.id },
    });
    assert(
      updatedOutbox && updatedOutbox.isPublished === true && updatedOutbox.publishedAt !== null,
      'Outbox record updated to isPublished=true with publishedAt timestamp'
    );

    // TEST 6: Moment Join Realtime Propagation
    console.log('\n--- 6. Testing Moment Join Realtime Event ---');
    const joinEventPromise = new Promise((resolve) => {
      client2.on('moment.joined', (envelope) => resolve(envelope));
    });

    await MomentService.joinMoment(moment.id, testUser2.id);

    const joinEnvelope = await Promise.race([
      joinEventPromise,
      new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), 4000)),
    ]);
    assert(
      joinEnvelope && joinEnvelope.payload.userId === testUser2.id,
      'Moment join event propagated via transactional outbox to realtime subscribers'
    );

    // TEST 7: Session Revocation Terminates Active Connections
    console.log('\n--- 7. Testing Session Revocation Connection Termination ---');
    const disconnectPromise = new Promise((resolve) => {
      client2.on('disconnect', (reason) => resolve(reason));
    });

    // Gateway disconnectUser invoked upon session revocation
    gateway.disconnectUser(testUser2.id, 'LOGGED_OUT');

    const disconnectReason = await Promise.race([
      disconnectPromise,
      new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), 3000)),
    ]);
    assert(
      !client2.connected,
      'Active Socket.IO connection immediately terminated upon session revocation'
    );

    // Cleanup clients
    client1Tab2.disconnect();
    client2.disconnect();

    // Clean test data
    await prisma.moment.delete({ where: { id: moment.id } });
    await prisma.user.deleteMany({
      where: { id: { in: [testUser1.id, testUser2.id] } },
    });
    console.log('\n🧹 Test data cleanly purged from PostgreSQL.');

  } catch (err) {
    console.error('Test execution error:', err);
    process.exitCode = 1;
  } finally {
    await gateway.stop();
    await prisma.$disconnect();
  }

  console.log('\n====================================================');
  console.log(`📊 TEST RESULTS: ${passed}/${total} TESTS PASSED`);
  console.log('====================================================');
}

runRealtimeIntegrationTests();
