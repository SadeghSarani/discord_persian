import { AuthService } from '../src/modules/auth/services/authService.ts';
import { prisma } from '../src/lib/db.ts';
import { verifyPassword } from '../src/modules/auth/utils/crypto.ts';

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
    // Clean up test user if exists
    const testUsername = 'test_warrior';
    const testEmail = 'warrior@discaf.ir';
    await prisma.user.deleteMany({
      where: {
        OR: [{ username: testUsername }, { email: testEmail }],
      },
    });

    // 1. Test Registration
    console.log('\n--- 1. Testing Registration & Argon2id Password Hashing ---');
    const regResult = await AuthService.register({
      username: testUsername,
      email: testEmail,
      name: 'جنگجوی آزمایشی',
      password: 'SuperSecretPassword123!',
      avatarStyle: 'cyber_ninja',
    });

    assert(
      regResult && regResult.user && regResult.user.username === testUsername,
      'User registered successfully and returned safe user profile'
    );
    assert(
      regResult.sessionToken && regResult.sessionToken.length === 64,
      'Generated 64-character hex session token'
    );

    const userInDb = await prisma.user.findUnique({
      where: { username: testUsername },
      include: { credential: true, userXp: true, sessions: true },
    });
    assert(
      userInDb && userInDb.credential && userInDb.credential.passwordHash.startsWith('$argon2id$'),
      'Password hashed with Argon2id ($argon2id$...)'
    );
    assert(
      userInDb.userXp && userInDb.userXp.totalXp === 0 && userInDb.userXp.currentLevel === 1,
      'Initial UserXp profile created with 0 XP, Level 1'
    );
    assert(
      userInDb.sessions.length === 1,
      'Session record persisted with hashed token in PostgreSQL'
    );

    // 2. Test Duplicate Registration Rejection
    console.log('\n--- 2. Testing Duplicate User / Email Prevention ---');
    let duplicateRejected = false;
    try {
      await AuthService.register({
        username: testUsername,
        email: 'other@discaf.ir',
        name: 'دیگری',
        password: 'Pass12345678!',
      });
    } catch (e) {
      duplicateRejected = e.message === 'USERNAME_ALREADY_EXISTS';
    }
    assert(duplicateRejected, 'Rejected duplicate username registration with USERNAME_ALREADY_EXISTS');

    let duplicateEmailRejected = false;
    try {
      await AuthService.register({
        username: 'other_name',
        email: testEmail,
        name: 'دیگری',
        password: 'Pass12345678!',
      });
    } catch (e) {
      duplicateEmailRejected = e.message === 'EMAIL_ALREADY_EXISTS';
    }
    assert(duplicateEmailRejected, 'Rejected duplicate email registration with EMAIL_ALREADY_EXISTS');

    // 3. Test Session Validation
    console.log('\n--- 3. Testing Session Validation & Token Hashing ---');
    const validated = await AuthService.validateSession(regResult.sessionToken);
    assert(
      validated && validated.user.username === testUsername && validated.session.userId === userInDb.id,
      'Session validated successfully from raw session token'
    );

    const invalidSession = await AuthService.validateSession('totally_invalid_or_forged_session_token');
    assert(invalidSession === null, 'Invalid or forged token rejected (returns null)');

    // 4. Test Login via Username & Email
    console.log('\n--- 4. Testing Login via Identifier (Username / Email) ---');
    const loginByUsername = await AuthService.login({
      identifier: testUsername,
      password: 'SuperSecretPassword123!',
    });
    assert(
      loginByUsername && loginByUsername.user.id === userInDb.id,
      'Successful login using username'
    );

    const loginByEmail = await AuthService.login({
      identifier: testEmail,
      password: 'SuperSecretPassword123!',
    });
    assert(
      loginByEmail && loginByEmail.user.id === userInDb.id,
      'Successful login using email'
    );

    let wrongPasswordFailed = false;
    try {
      await AuthService.login({
        identifier: testUsername,
        password: 'WrongPassword!',
      });
    } catch (e) {
      wrongPasswordFailed = e.message === 'INVALID_CREDENTIALS';
    }
    assert(wrongPasswordFailed, 'Login with incorrect password rejected with INVALID_CREDENTIALS');

    // 5. Test Single Session Logout
    console.log('\n--- 5. Testing Session Revocation (Logout) ---');
    const logoutSuccess = await AuthService.logout(loginByUsername.sessionToken);
    assert(logoutSuccess, 'Logout revoked single session token');

    const checkRevoked = await AuthService.validateSession(loginByUsername.sessionToken);
    assert(checkRevoked === null, 'Revoked session is no longer valid');

    // 6. Test Logout All (Multi-device Session Revocation)
    console.log('\n--- 6. Testing Global Revocation (Logout All Devices) ---');
    const revokedCount = await AuthService.logoutAll(userInDb.id);
    assert(revokedCount >= 2, `Revoked all remaining active sessions (${revokedCount} revoked)`);

    const checkOtherRevoked = await AuthService.validateSession(loginByEmail.sessionToken);
    assert(checkOtherRevoked === null, 'All previous sessions successfully invalidated');

    // 7. Test Password Reset Workflow
    console.log('\n--- 7. Testing Password Reset Workflow ---');
    const resetReq = await AuthService.requestPasswordReset(testEmail);
    assert(
      resetReq && resetReq.resetToken && resetReq.resetToken.length === 64,
      'Generated secure password reset token'
    );

    const resetSuccess = await AuthService.resetPassword(
      resetReq.resetToken,
      'BrandNewSecurePassword999!'
    );
    assert(resetSuccess, 'Password reset succeeded');

    // Verify login with new password works and old password fails
    const loginWithNewPass = await AuthService.login({
      identifier: testUsername,
      password: 'BrandNewSecurePassword999!',
    });
    assert(loginWithNewPass && loginWithNewPass.user.id === userInDb.id, 'Login with new password succeeded');

    let oldPassFailed = false;
    try {
      await AuthService.login({
        identifier: testUsername,
        password: 'SuperSecretPassword123!',
      });
    } catch (e) {
      oldPassFailed = e.message === 'INVALID_CREDENTIALS';
    }
    assert(oldPassFailed, 'Old password no longer valid');

    // Clean up test records
    await prisma.user.delete({ where: { id: userInDb.id } });
    console.log('\n🧹 Test records cleanly removed from database.');

  } catch (error) {
    console.error('Unexpected test error:', error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }

  console.log('\n====================================================');
  console.log(`📊 TEST RESULTS: ${passed}/${total} TESTS PASSED`);
  console.log('====================================================');
}

runAuthTests();
