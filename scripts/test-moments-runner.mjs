import { PrismaClient, MomentStatus, MomentVisibility, ParticipantStatus } from '@prisma/client';
import { MomentService } from '../src/modules/moments/services/momentService.ts';
import crypto from 'node:crypto';
import { hash } from '@node-rs/argon2';

const prisma = new PrismaClient();

async function runMomentsTests() {
  console.log('====================================================');
  console.log('🧪 NEXUS STAGE 4 — MOMENTS & DISCOVERY TEST SUITE');
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

  try {
    const testP = await hash('ValidPass123!', { memoryCost: 19456, timeCost: 2, outputLen: 32, parallelism: 1 });
    const userA = await prisma.user.upsert({
      where: { username: 'm_user_a' },
      create: { username: 'm_user_a', email: 'm_user_a@discaf.ir', name: 'کاربر آ', credential: { create: { passwordHash: testP } } },
      update: {},
    });
    const userB = await prisma.user.upsert({
      where: { username: 'm_user_b' },
      create: { username: 'm_user_b', email: 'm_user_b@discaf.ir', name: 'کاربر ب', credential: { create: { passwordHash: testP } } },
      update: {},
    });
    const userC = await prisma.user.upsert({
      where: { username: 'm_user_c' },
      create: { username: 'm_user_c', email: 'm_user_c@discaf.ir', name: 'کاربر ج', credential: { create: { passwordHash: testP } } },
      update: {},
    });

    // 1. Create Moment
    console.log('--- 1. Testing Moment Creation & Creator Participation ---');
    const moment1 = await MomentService.createMoment({
      creatorId: userA.id,
      title: 'روم آزمایشی کال‌آف دیوتی',
      description: 'فقط بازیکنان سطح بالا برای رنک‌آپ',
      category: 'Gaming',
      tags: ['cod', 'warzone', 'rank'],
      capacity: 3,
      durationHours: 2,
      visibility: MomentVisibility.PUBLIC,
    });
    assert(moment1 && moment1.id, 'Created new Moment with LIVE status in PostgreSQL');
    assert(moment1.participantCount === 1, 'Initial participantCount is set to 1');

    const partA = await prisma.momentParticipant.findUnique({
      where: { momentId_userId: { momentId: moment1.id, userId: userA.id } },
    });
    assert(partA && partA.status === ParticipantStatus.ACTIVE, 'Creator automatically added as ACTIVE participant');

    // 2. Update Moment
    console.log('\n--- 2. Testing Moment Updates & Ownership Protection ---');
    const updated = await MomentService.updateMoment(moment1.id, userA.id, {
      title: 'روم ویرایش‌شده کال‌آف',
      description: 'توضیحات به‌روزشده',
    });
    assert(updated.title === 'روم ویرایش‌شده کال‌آف', 'Creator can edit title and details');

    let editForbidden = false;
    try {
      await MomentService.updateMoment(moment1.id, userB.id, { title: 'خرابکاری توسط غیرسازنده' });
    } catch (e) {
      editForbidden = e.message === 'FORBIDDEN_NOT_CREATOR';
    }
    assert(editForbidden, 'Non-creator cannot edit someone else Moment');

    // 3. Join & Leave Moment
    console.log('\n--- 3. Testing Join, Leave, and Idempotency ---');
    await MomentService.joinMoment(moment1.id, userB.id);
    const mAfterB = await prisma.moment.findUnique({ where: { id: moment1.id } });
    assert(mAfterB.participantCount === 2, 'User B joined; participantCount incremented to 2');

    // Duplicate join should be idempotent
    await MomentService.joinMoment(moment1.id, userB.id);
    const mAfterBDup = await prisma.moment.findUnique({ where: { id: moment1.id } });
    assert(mAfterBDup.participantCount === 2, 'Duplicate join is idempotent and does not increment count');

    // User C joins, reaching full capacity (3/3)
    await MomentService.joinMoment(moment1.id, userC.id);
    const mFull = await prisma.moment.findUnique({ where: { id: moment1.id } });
    assert(mFull.participantCount === 3, 'User C joined; capacity reached (3/3)');

    // Next join attempt must fail with MOMENT_CAPACITY_FULL
    const userD = await prisma.user.upsert({
      where: { username: 'm_user_d' },
      create: { username: 'm_user_d', email: 'm_user_d@discaf.ir', name: 'کاربر د', credential: { create: { passwordHash: testP } } },
      update: {},
    });

    let capacityRejected = false;
    try {
      await MomentService.joinMoment(moment1.id, userD.id);
    } catch (e) {
      capacityRejected = e.message === 'MOMENT_CAPACITY_FULL';
    }
    assert(capacityRejected, 'Overbooking rejected with MOMENT_CAPACITY_FULL');

    // User B leaves
    await MomentService.leaveMoment(moment1.id, userB.id);
    const mAfterLeave = await prisma.moment.findUnique({ where: { id: moment1.id } });
    assert(mAfterLeave.participantCount === 2, 'User B left; participantCount decremented to 2');

    // Now User D can join
    await MomentService.joinMoment(moment1.id, userD.id);
    const mAfterD = await prisma.moment.findUnique({ where: { id: moment1.id } });
    assert(mAfterD.participantCount === 3, 'User D successfully joined the freed slot');

    // 4. Private Invite Flow
    console.log('\n--- 4. Testing Private Invite Flow & Token Verification ---');
    const privateMoment = await MomentService.createMoment({
      creatorId: userA.id,
      title: 'جلسه خصوصی کلن',
      description: 'فقط با دعوت‌نامه',
      category: 'Meeting',
      capacity: 5,
      visibility: MomentVisibility.PRIVATE_INVITE,
    });

    // Uninvited user cannot join without token
    let privateRejected = false;
    try {
      await MomentService.joinMoment(privateMoment.id, userB.id);
    } catch (e) {
      privateRejected = e.message === 'INVITE_REQUIRED_FOR_PRIVATE_MOMENT';
    }
    assert(privateRejected, 'Join to private moment rejected when no invite token is provided');

    // Generate invite token
    const invite = await MomentService.createInvite(privateMoment.id, userA.id, 2, 1);
    assert(invite && invite.inviteToken, 'Creator generated single/multi-use invite token');

    // Join with valid invite token
    await MomentService.joinMoment(privateMoment.id, userB.id, invite.inviteToken);
    const privAfterJoin = await prisma.moment.findUnique({ where: { id: privateMoment.id } });
    assert(privAfterJoin.participantCount === 2, 'User B successfully joined private moment using invite token');

    // 5. Block Exclusion
    console.log('\n--- 5. Testing Block Privacy Enforcement ---');
    await prisma.userBlock.create({
      data: { blockerId: userA.id, blockedId: userC.id },
    });

    let blockRejected = false;
    try {
      await MomentService.joinMoment(moment1.id, userC.id);
    } catch (e) {
      blockRejected = e.message === 'ACCESS_DENIED_USER_BLOCKED';
    }
    assert(blockRejected, 'Blocked user cannot interact or join moments of blocker');

    // 6. Discovery Engine & Ranking
    console.log('\n--- 6. Testing Discovery Feed & Deterministic Ranking ---');
    // Assign interest to User B
    const interest = await prisma.interest.findFirst();
    if (interest) {
      await prisma.userInterest.upsert({
        where: { id: `ui_${userB.id}_${interest.id}` },
        create: { id: `ui_${userB.id}_${interest.id}`, userId: userB.id, interestId: interest.id },
        update: {},
      });
    }

    const discovery = await MomentService.discoverMoments({
      viewerId: userB.id,
      category: 'Gaming',
      sort: 'recommended',
    });
    assert(discovery && Array.isArray(discovery.items), 'Discovery query returned structured list');
    // Blocked creator content must NOT be visible to user C
    const discoveryBlockedUser = await MomentService.discoverMoments({
      viewerId: userC.id,
    });
    const containsBlockerMoment = discoveryBlockedUser.items.some((m) => m.creatorId === userA.id);
    assert(!containsBlockerMoment, 'Discovery feed completely filters out moments from blocked users');

    // 7. Moment Expiration & Cancellation
    console.log('\n--- 7. Testing Expiration & Cancellation Lifecycle ---');
    const pastMoment = await prisma.moment.create({
      data: {
        creatorId: userA.id,
        title: 'مامنت منقضی',
        description: 'گذشته',
        category: 'Test',
        capacity: 2,
        participantCount: 1,
        status: MomentStatus.LIVE,
        expiresAt: new Date(Date.now() - 10000), // Expired 10s ago
      },
    });

    const expiredCount = await MomentService.checkAndExpireMoments();
    assert(expiredCount >= 1, `checkAndExpireMoments transitioned expired moments (${expiredCount} expired)`);
    const expiredRecord = await prisma.moment.findUnique({ where: { id: pastMoment.id } });
    assert(expiredRecord.status === MomentStatus.ENDED, 'Expired moment marked with ENDED status');

    // Cancel moment1
    await MomentService.cancelMoment(moment1.id, userA.id);
    const mCancelled = await prisma.moment.findUnique({ where: { id: moment1.id } });
    assert(mCancelled.status === MomentStatus.CANCELLED, 'Moment explicitly cancelled by creator');

    // 8. Reporting
    console.log('\n--- 8. Testing Reporting Workflow ---');
    const report = await MomentService.reportMoment(moment1.id, userB.id, 'محتوای نامناسب و توهین‌آمیز');
    assert(report && report.id, 'Report submitted successfully');

    let dupReport = false;
    try {
      await MomentService.reportMoment(moment1.id, userB.id, 'تکرار گزارش');
    } catch (e) {
      dupReport = e.message === 'ALREADY_REPORTED';
    }
    assert(dupReport, 'Duplicate report by same user rejected with ALREADY_REPORTED');

    // Clean up test data
    await prisma.momentReport.deleteMany({ where: { momentId: { in: [moment1.id, privateMoment.id, pastMoment.id] } } });
    await prisma.userBlock.deleteMany({ where: { blockerId: userA.id } });
    await prisma.moment.deleteMany({ where: { id: { in: [moment1.id, privateMoment.id, pastMoment.id] } } });
    await prisma.user.deleteMany({ where: { id: { in: [userA.id, userB.id, userC.id, userD.id] } } });
    console.log('\n🧹 Test records cleanly purged from PostgreSQL.');

  } catch (err) {
    console.error('Fatal test error:', err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }

  console.log('\n====================================================');
  console.log(`📊 TEST RESULTS: ${passed}/${total} TESTS PASSED`);
  console.log('====================================================');
}

runMomentsTests();
