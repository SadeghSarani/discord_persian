import { prisma } from '../src/lib/db.ts';
import { SignalService } from '../src/modules/signals/services/signalService.ts';
import { SignalStatus } from '@prisma/client';

async function runSignalTests() {
  console.log('====================================================');
  console.log('🧪 NEXUS SIGNAL — INTENT FORMATION ENGINE TEST SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  // Setup test users
  const testId = `sig_${Date.now()}`;
  const userA = await prisma.user.create({
    data: {
      username: `sig_a_${testId}`,
      email: `siga_${testId}@nexus.test`,
      name: 'خلبان سیگنال ۱',
    },
  });

  const userB = await prisma.user.create({
    data: {
      username: `sig_b_${testId}`,
      email: `sigb_${testId}@nexus.test`,
      name: 'خلبان سیگنال ۲',
    },
  });

  const userC = await prisma.user.create({
    data: {
      username: `sig_c_${testId}`,
      email: `sigc_${testId}@nexus.test`,
      name: 'خلبان سیگنال ۳',
    },
  });

  try {
    console.log('--- 1. Testing Signal Creation & Rate Limiting ---');
    const signal = await SignalService.createSignal({
      creatorId: userA.id,
      activityCategory: 'gaming',
      targetInterest: 'cs2',
      description: 'لابی ۳ نفره پرمیر کانتر ۲ رنک ۱۵k+',
      targetCount: 3,
      minCount: 3,
      maxCapacity: 4,
      estimatedDuration: 30,
    });

    assert(signal.id !== undefined, 'Created new Signal in PostgreSQL');
    assert(signal.status === SignalStatus.BROADCASTING, 'Initial status is BROADCASTING');

    // Attempt second active signal should be rejected
    try {
      await SignalService.createSignal({
        creatorId: userA.id,
        activityCategory: 'casual',
        description: 'گپ دوستانه',
      });
      assert(false, 'Expected active signal limit exception');
    } catch (err) {
      assert(err.message === 'ACTIVE_SIGNAL_LIMIT_REACHED', 'Active signal limit enforced (1 per user)');
    }

    console.log('\n--- 2. Testing Signal Discovery & Matching ---');
    const discovered = await SignalService.discoverSignals({ category: 'gaming' });
    assert(discovered.length >= 1, 'Discover query returns active broadcasting signals');
    assert(discovered[0].participants.length === 1, 'Creator automatically included as participant #1');

    console.log('\n--- 3. Testing Participant Join & Threshold Formation ---');
    // User B joins
    const joinB = await SignalService.joinSignal(signal.id, userB.id);
    assert(joinB.status === 'JOINED', 'User B joined signal; status remains JOINED (2/3)');
    assert(joinB.participantCount === 2, 'Participant count incremented to 2');

    // User C joins (Threshold 3 reached -> Form Moment!)
    const joinC = await SignalService.joinSignal(signal.id, userC.id);
    assert(joinC.status === 'FORMED', 'User C joined; minCount reached and Moment formed atomically');
    assert(joinC.moment !== undefined, 'Associated Moment created in Moment Engine');
    assert(joinC.signal.status === SignalStatus.FORMED, 'Signal status updated to FORMED');
    assert(joinC.participants.length === 3, 'All 3 participants carried into formed Moment');

    console.log('\n--- 4. Testing Outbox Event Dispatch ---');
    const outboxEvents = await prisma.transactionalOutbox.findMany({
      where: {
        eventType: { in: ['signal.created', 'signal.participant_joined', 'signal.formed'] },
      },
      orderBy: { createdAt: 'desc' },
      take: 3,
    });
    assert(outboxEvents.some((e) => e.eventType === 'signal.formed'), 'signal.formed TransactionalOutbox event published for realtime gateway');

    console.log('\n--- 5. Testing Expiration Handling ---');
    // Create an expired signal manually for testing expiration worker
    const expiredSig = await prisma.signal.create({
      data: {
        creatorId: userB.id,
        activityCategory: 'tech',
        description: 'تست انقضا',
        expiresAt: new Date(Date.now() - 5000), // in the past
        status: SignalStatus.BROADCASTING,
      },
    });

    const expiredCount = await SignalService.checkAndExpireSignals();
    assert(expiredCount >= 1, `checkAndExpireSignals marked ${expiredCount} signals as EXPIRED`);

    const updatedExpired = await prisma.signal.findUnique({ where: { id: expiredSig.id } });
    assert(updatedExpired?.status === SignalStatus.EXPIRED, 'Expired signal transitioned to EXPIRED status');

  } finally {
    // Clean up test data
    console.log('\n🧹 Cleaning up test records from PostgreSQL...');
    await prisma.user.deleteMany({
      where: { id: { in: [userA.id, userB.id, userC.id] } },
    });
    console.log('Cleanup finished.');
  }

  console.log('\n====================================================');
  console.log(`📊 TEST RESULTS: ${passed}/${passed + failed} TESTS PASSED`);
  console.log('====================================================\n');

  if (failed > 0) process.exit(1);
}

runSignalTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
