import crypto from 'node:crypto';
import { hash, verify } from '@node-rs/argon2';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Internal helpers replicating auth logic for direct execution test
function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}
function generateSecureToken() {
  return crypto.randomBytes(32).toString('hex');
}

async function runAuthTests() {
  console.log('====================================================');
  console.log('🧪 NEXUS STAGE 2 — AUTHENTICATION & SECURITY TEST SUITE');
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
    const testUsername = 'test_warrior';
    const testEmail = 'warrior@discaf.ir';

    // Cleanup previous test residue
    await prisma.user.deleteMany({
      where: {
        OR: [{ username: testUsername }, { email: testEmail }],
      },
    });

    // 1. Test Registration and Argon2id Hashing
    console.log('--- 1. Testing Registration & Argon2id Password Hashing ---');
    const rawPassword = 'SuperSecretPassword123!';
    const passwordHash = await hash(rawPassword, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });
    const sessionToken = generateSecureToken();
    const tokenHash = hashToken(sessionToken);
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const newUser = await prisma.$transaction(async (tx) => {
      return tx.user.create({
        data: {
          username: testUsername,
          email: testEmail,
          name: 'جنگجوی آزمایشی',
          avatarStyle: 'cyber_ninja',
          credential: {
            create: { passwordHash },
          },
          userXp: {
            create: { totalXp: 0, currentLevel: 1 },
          },
          sessions: {
            create: {
              tokenHash,
              expiresAt,
            },
          },
        },
        include: { credential: true, userXp: true, sessions: true },
      });
    });

    assert(
      newUser && newUser.username === testUsername,
      'User created in PostgreSQL with unique username and email'
    );
    assert(
      newUser.credential.passwordHash.startsWith('$argon2id$'),
      'Password hashed with modern Argon2id algorithm'
    );
    const isArgon2Valid = await verify(newUser.credential.passwordHash, rawPassword);
    assert(isArgon2Valid, 'Argon2id hash successfully verified with correct password');
    const isArgon2Fake = await verify(newUser.credential.passwordHash, 'WrongPassword!');
    assert(!isArgon2Fake, 'Argon2id verification fails with incorrect password');
    assert(
      newUser.userXp && newUser.userXp.totalXp === 0 && newUser.userXp.currentLevel === 1,
      'Initial UserXp profile created atomically with 0 XP, Level 1'
    );
    assert(
      newUser.sessions.length === 1 && newUser.sessions[0].tokenHash === tokenHash,
      'Session record persisted in PostgreSQL with SHA-256 tokenHash'
    );

    // 2. Test Duplicate Prevention
    console.log('\n--- 2. Testing Duplicate User / Email Prevention ---');
    let duplicateUsernameCaught = false;
    try {
      await prisma.user.create({
        data: {
          username: testUsername,
          name: 'دیگری',
          email: 'another@discaf.ir',
        },
      });
    } catch (e) {
      duplicateUsernameCaught = e.code === 'P2002';
    }
    assert(duplicateUsernameCaught, 'Database enforces UNIQUE constraint on username');

    let duplicateEmailCaught = false;
    try {
      await prisma.user.create({
        data: {
          username: 'unique_user_2',
          name: 'دیگری',
          email: testEmail,
        },
      });
    } catch (e) {
      duplicateEmailCaught = e.code === 'P2002';
    }
    assert(duplicateEmailCaught, 'Database enforces UNIQUE constraint on email');

    // 3. Test Session Token Lookup
    console.log('\n--- 3. Testing Session Token Lookup & Expiry Validation ---');
    const incomingTokenHash = hashToken(sessionToken);
    const activeSession = await prisma.session.findUnique({
      where: { tokenHash: incomingTokenHash },
      include: { user: true },
    });
    assert(
      activeSession && activeSession.expiresAt > new Date() && activeSession.user.id === newUser.id,
      'Session token resolved to authenticated user'
    );

    const forgedTokenHash = hashToken('forged_fake_token');
    const forgedSession = await prisma.session.findUnique({
      where: { tokenHash: forgedTokenHash },
    });
    assert(forgedSession === null, 'Forged or unissued session token rejected');

    // 4. Test Single Session Revocation (Logout)
    console.log('\n--- 4. Testing Single Session Revocation (Logout) ---');
    await prisma.session.delete({
      where: { tokenHash: incomingTokenHash },
    });
    const sessionAfterLogout = await prisma.session.findUnique({
      where: { tokenHash: incomingTokenHash },
    });
    assert(sessionAfterLogout === null, 'Session revoked and deleted from PostgreSQL');

    // 5. Test Multi-Device Sessions & Logout All
    console.log('\n--- 5. Testing Multi-Device Sessions & Global Logout ---');
    const deviceTokens = [generateSecureToken(), generateSecureToken(), generateSecureToken()];
    await prisma.session.createMany({
      data: deviceTokens.map((t) => ({
        userId: newUser.id,
        tokenHash: hashToken(t),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      })),
    });
    const deviceCount = await prisma.session.count({ where: { userId: newUser.id } });
    assert(deviceCount === 3, 'User holds 3 active concurrent sessions across devices');

    // Logout all
    const deletedCount = await prisma.session.deleteMany({
      where: { userId: newUser.id },
    });
    assert(deletedCount.count === 3, 'Logout-all revoked all 3 sessions simultaneously');
    const countAfterRevokeAll = await prisma.session.count({ where: { userId: newUser.id } });
    assert(countAfterRevokeAll === 0, 'No active sessions remain after global logout');

    // 6. Test Password Reset Workflow
    console.log('\n--- 6. Testing Password Reset Workflow ---');
    const resetToken = generateSecureToken();
    const resetTokenHash = hashToken(resetToken);
    const resetRecord = await prisma.passwordResetToken.create({
      data: {
        userId: newUser.id,
        tokenHash: resetTokenHash,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    });
    assert(resetRecord && resetRecord.tokenHash === resetTokenHash, 'Password reset token generated and stored as SHA-256 hash');

    // Perform Reset: update password, mark used, revoke all sessions
    const newPasswordRaw = 'BrandNewSafePassword999!';
    const newPasswordHash = await hash(newPasswordRaw, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    await prisma.$transaction(async (tx) => {
      await tx.passwordResetToken.update({
        where: { id: resetRecord.id },
        data: { usedAt: new Date() },
      });
      await tx.accountCredential.update({
        where: { userId: newUser.id },
        data: { passwordHash: newPasswordHash },
      });
      await tx.session.deleteMany({
        where: { userId: newUser.id },
      });
    });

    const updatedCred = await prisma.accountCredential.findUnique({
      where: { userId: newUser.id },
    });
    const newPassValid = await verify(updatedCred.passwordHash, newPasswordRaw);
    const oldPassInvalid = await verify(updatedCred.passwordHash, rawPassword);
    assert(newPassValid, 'New password verifies successfully');
    assert(!oldPassInvalid, 'Old password fails verification');

    // Clean up test records
    await prisma.user.delete({ where: { id: newUser.id } });
    console.log('\n🧹 Test records cleanly purged from PostgreSQL.');

  } catch (err) {
    console.error('Test execution failed:', err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }

  console.log('\n====================================================');
  console.log(`📊 TEST RESULTS: ${passed}/${total} TESTS PASSED`);
  console.log('====================================================');
}

runAuthTests();
