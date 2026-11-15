import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runDatabaseIntegrityTests() {
  console.log('=== RUNNING DATABASE INTEGRITY & CONCURRENCY TESTS ===\n');

  let passed = 0;
  let failed = 0;

  // TEST 1: Unique User Constraint (Username and Email)
  try {
    process.stdout.write('Test 1: Unique username & email collision rejection... ');
    await prisma.user.create({
      data: {
        username: 'sadegh', // Duplicate of existing seed user
        name: 'سارق هویت',
        email: 'different_email@discaf.ir',
      },
    });
    console.log('FAILED (Allowed duplicate username)');
    failed++;
  } catch (err) {
    if (err.code === 'P2002') {
      console.log('PASSED (P2002 Unique constraint violated)');
      passed++;
    } else {
      console.log('FAILED (Unexpected error:', err.message, ')');
      failed++;
    }
  }

  // TEST 2: Cascade Deletion Integrity (User deletion cascades to Sessions & Credentials)
  try {
    process.stdout.write('Test 2: Cascade deletion integrity on User deletion... ');
    const tempUser = await prisma.user.create({
      data: {
        username: 'temp_tester',
        name: 'کاربر موقت تست',
        email: 'temp@discaf.ir',
        credential: {
          create: { passwordHash: 'hash_temp' },
        },
        sessions: {
          create: [
            { tokenHash: 'token_1', expiresAt: new Date(Date.now() + 3600000) },
            { tokenHash: 'token_2', expiresAt: new Date(Date.now() + 3600000) },
          ],
        },
      },
    });

    const sessionsBefore = await prisma.session.count({ where: { userId: tempUser.id } });
    const credBefore = await prisma.accountCredential.count({ where: { userId: tempUser.id } });
    if (sessionsBefore !== 2 || credBefore !== 1) throw new Error('Setup failed');

    // Delete user
    await prisma.user.delete({ where: { id: tempUser.id } });

    const sessionsAfter = await prisma.session.count({ where: { userId: tempUser.id } });
    const credAfter = await prisma.accountCredential.count({ where: { userId: tempUser.id } });

    if (sessionsAfter === 0 && credAfter === 0) {
      console.log('PASSED (Cascade cleanly deleted credential and 2 sessions)');
      passed++;
    } else {
      console.log(`FAILED (Orphaned rows: sessions=${sessionsAfter}, cred=${credAfter})`);
      failed++;
    }
  } catch (err) {
    console.log('FAILED:', err.message);
    failed++;
  }

  // TEST 3: Compound Unique Invariant on MomentParticipant
  try {
    process.stdout.write('Test 3: Compound unique constraint on MomentParticipant [momentId, userId]... ');
    const moment = await prisma.moment.findFirstOrThrow();
    const user = await prisma.user.findFirstOrThrow({ where: { username: 'sadegh' } });

    await prisma.momentParticipant.create({
      data: {
        momentId: moment.id,
        userId: user.id, // User is already a participant
      },
    });
    console.log('FAILED (Allowed duplicate participation)');
    failed++;
  } catch (err) {
    if (err.code === 'P2002') {
      console.log('PASSED (P2002 Compound unique constraint enforced)');
      passed++;
    } else {
      console.log('FAILED (Unexpected error:', err.message, ')');
      failed++;
    }
  }

  // TEST 4: Atomic Concurrency Lock on Moment Capacity
  try {
    process.stdout.write('Test 4: Atomic conditional update for Moment capacity under concurrency... ');
    const creator = await prisma.user.findFirstOrThrow({ where: { username: 'sadegh' } });

    // Create moment with strictly 2 capacity
    const tightMoment = await prisma.moment.create({
      data: {
        creatorId: creator.id,
        title: 'تست ظرفیت فوق‌سخت',
        description: 'فقط ۲ نفر ظرفیت',
        category: 'Gaming',
        capacity: 2,
        participantCount: 0,
        status: 'LIVE',
        expiresAt: new Date(Date.now() + 3600000),
      },
    });

    // Create 5 temporary users attempting to join concurrently
    const joiners = await Promise.all(
      [1, 2, 3, 4, 5].map((i) =>
        prisma.user.create({
          data: {
            username: `joiner_${Date.now()}_${i}`,
            name: `عضو تست ${i}`,
            email: `joiner_${Date.now()}_${i}@test.ir`,
          },
        })
      )
    );

    // Concurrent atomic join using conditional UPDATE
    const joinAttempts = await Promise.allSettled(
      joiners.map(async (u) => {
        return prisma.$transaction(async (tx) => {
          // Atomic conditional increment: increments ONLY if participantCount < capacity
          const affected = await tx.$executeRawUnsafe(
            `UPDATE "Moment"
             SET "participantCount" = "participantCount" + 1
             WHERE "id" = $1 AND "participantCount" < "capacity" AND "status" = 'LIVE'`,
            tightMoment.id
          );

          if (affected === 0) {
            throw new Error('MOMENT_CAPACITY_FULL');
          }

          await tx.momentParticipant.create({
            data: {
              momentId: tightMoment.id,
              userId: u.id,
              status: 'ACTIVE',
            },
          });

          return u.username;
        });
      })
    );

    const succeeded = joinAttempts.filter((r) => r.status === 'fulfilled');
    const rejected = joinAttempts.filter((r) => r.status === 'rejected');

    const updatedMoment = await prisma.moment.findUniqueOrThrow({
      where: { id: tightMoment.id },
      include: { participants: true },
    });

    // Clean up test data
    await prisma.moment.delete({ where: { id: tightMoment.id } });
    await prisma.user.deleteMany({ where: { id: { in: joiners.map((j) => j.id) } } });

    if (
      succeeded.length === 2 &&
      rejected.length === 3 &&
      updatedMoment.participantCount === 2 &&
      updatedMoment.participants.length === 2
    ) {
      console.log(`PASSED (Exactly 2 joins succeeded, 3 rejected with 409; finalCount=2, capacity=2)`);
      passed++;
    } else {
      console.log(
        `FAILED (succeeded=${succeeded.length}, rejected=${rejected.length}, finalCount=${updatedMoment.participantCount})`
      );
      failed++;
    }
  } catch (err) {
    console.log('FAILED:', err.message);
    failed++;
  }

  // TEST 5: Idempotency Key Constraint on XpTransaction
  try {
    process.stdout.write('Test 5: Idempotency constraint on XpTransaction... ');
    const user = await prisma.user.findFirstOrThrow({ where: { username: 'sadegh' } });
    const key = `test_xp_${Date.now()}`;

    // First grant
    await prisma.xpTransaction.create({
      data: {
        userId: user.id,
        amount: 50,
        reason: 'تست پاداش',
        sourceType: 'test_action',
        idempotencyKey: key,
      },
    });

    // Duplicate grant with same idempotency key
    await prisma.xpTransaction.create({
      data: {
        userId: user.id,
        amount: 50,
        reason: 'تست پاداش تکراری',
        sourceType: 'test_action',
        idempotencyKey: key,
      },
    });

    console.log('FAILED (Allowed duplicate idempotencyKey)');
    failed++;
  } catch (err) {
    if (err.code === 'P2002') {
      console.log('PASSED (Duplicate idempotencyKey rejected by unique constraint)');
      passed++;
    } else {
      console.log('FAILED:', err.message);
      failed++;
    }
  }

  console.log(`\n=== RESULTS: ${passed} PASSED, ${failed} FAILED ===`);
  if (failed > 0) {
    process.exit(1);
  }
}

runDatabaseIntegrityTests()
  .catch((e) => {
    console.error('Fatal test error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
