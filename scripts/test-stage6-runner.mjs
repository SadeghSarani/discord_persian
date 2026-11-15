import { PrismaClient } from '@prisma/client';
import { ProfileService } from '../src/modules/social/services/profileService.ts';
import { InterestService } from '../src/modules/social/services/interestService.ts';
import { SocialGraphService } from '../src/modules/social/services/socialGraphService.ts';
import { hash } from '@node-rs/argon2';

const prisma = new PrismaClient();

async function runStage6Tests() {
  console.log('====================================================');
  console.log('🧪 NEXUS STAGE 6 — SOCIAL IDENTITY, PROFILES & INTERESTS TEST SUITE');
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
    const pHash = await hash('SecurePass123!', { memoryCost: 19456, timeCost: 2, outputLen: 32, parallelism: 1 });
    const user1 = await prisma.user.upsert({
      where: { username: 'p_user_1' },
      create: { username: 'p_user_1', email: 'p_user_1@discaf.ir', name: 'کاربر پروفایل ۱', credential: { create: { passwordHash: pHash } } },
      update: {},
    });
    const user2 = await prisma.user.upsert({
      where: { username: 'p_user_2' },
      create: { username: 'p_user_2', email: 'p_user_2@discaf.ir', name: 'کاربر پروفایل ۲', credential: { create: { passwordHash: pHash } } },
      update: {},
    });

    // 1. Retrieve Own Profile
    console.log('--- 1. Testing Profile Retrieval & Customization ---');
    const myProfile = await ProfileService.getMyProfile(user1.id);
    assert(myProfile && myProfile.id === user1.id, 'Retrieve own full authenticated profile');

    // Update Profile (name, bio, customStatus, gameActivity, banner)
    const updatedUser = await ProfileService.updateProfile(user1.id, {
      name: 'شاهین استریمر',
      bio: 'استریمر بازی‌های ورلد آف وارکرفت و رینبو سیکس',
      customStatus: 'در حال استریم 🔴',
      gameActivity: 'Rainbow Six Siege',
      avatarStyle: 'cyber_ninja',
    });
    assert(updatedUser.name === 'شاهین استریمر', 'Profile display name successfully updated');
    assert(updatedUser.bio.includes('استریمر'), 'Profile biography updated');
    assert(updatedUser.gameActivity === 'Rainbow Six Siege', 'Game activity updated');

    // 2. Username Validation & Reserved Checks
    console.log('\n--- 2. Testing Username Validation & Reserved Protection ---');
    let reservedCaught = false;
    try {
      await ProfileService.updateProfile(user1.id, { username: 'admin' });
    } catch (e) {
      reservedCaught = e.message === 'RESERVED_USERNAME';
    }
    assert(reservedCaught, 'Reserved username (admin) rejected');

    let invalidFormatCaught = false;
    try {
      await ProfileService.updateProfile(user1.id, { username: 'a!' });
    } catch (e) {
      invalidFormatCaught = e.message === 'INVALID_USERNAME_FORMAT';
    }
    assert(invalidFormatCaught, 'Invalid username format rejected');

    // 3. Public Profile & Privacy Settings
    console.log('\n--- 3. Testing Public Profile & Privacy Filtering ---');
    const publicP = await ProfileService.getPublicProfile('p_user_1', user2.id);
    assert(publicP && publicP.name === 'شاهین استریمر', 'Public profile accessible to other users');
    assert(publicP.email === undefined, 'Sensitive email excluded from public profile DTO');

    // Set profile visibility to private
    await ProfileService.updatePrivacySettings(user1.id, {
      profileVisibility: 'private',
    });
    const privateP = await ProfileService.getPublicProfile('p_user_1', user2.id);
    assert(privateP && privateP.isPrivate === true, 'Private profile hides personal details from non-owners');

    // Reset to public
    await ProfileService.updatePrivacySettings(user1.id, { profileVisibility: 'public' });

    // 4. Block Privacy Enforcement on Profiles
    console.log('\n--- 4. Testing Block Enforcement on Profiles ---');
    await SocialGraphService.blockUser(user1.id, user2.id);
    const blockedP = await ProfileService.getPublicProfile('p_user_1', user2.id);
    assert(blockedP === null, 'Blocked user completely denied access to blocker profile');

    await SocialGraphService.unblockUser(user1.id, user2.id);

    // 5. User Preferences
    console.log('\n--- 5. Testing Persistent User Preferences ---');
    const prefs = await ProfileService.updatePreferences(user1.id, {
      theme: 'dracula',
      soundEffects: false,
    });
    assert(prefs && prefs.theme === 'dracula' && prefs.soundEffects === false, 'User preferences saved in PostgreSQL');

    // 6. Social Links & Protocol Security
    console.log('\n--- 6. Testing Social Links Management & Security ---');
    const link = await ProfileService.setSocialLink(user1.id, 'twitch', 'https://twitch.tv/shahin_gamer');
    assert(link && link.platform === 'twitch', 'Safe https social link added');

    let badProtocolRejected = false;
    try {
      await ProfileService.setSocialLink(user1.id, 'twitch', 'javascript:alert(1)');
    } catch (e) {
      badProtocolRejected = e.message === 'UNSAFE_URL_PROTOCOL' || e.message === 'INVALID_URL';
    }
    assert(badProtocolRejected, 'Unsafe javascript: protocol rejected');

    await ProfileService.removeSocialLink(user1.id, 'twitch');
    const userWithNoLink = await ProfileService.getMyProfile(user1.id);
    assert(userWithNoLink.socialLinks.length === 0, 'Social link removed');

    // 7. Interests Taxonomy & User Assignment
    console.log('\n--- 7. Testing Interests Taxonomy & Selection ---');
    const taxonomy = await InterestService.listTaxonomy();
    assert(taxonomy.all.length > 0, 'Interests taxonomy retrieved from PostgreSQL');

    const firstInterest = taxonomy.all[0];
    const assigned = await InterestService.setUserInterests(user1.id, [firstInterest.slug]);
    assert(assigned.length === 1 && assigned[0].slug === firstInterest.slug, 'Interest assigned to user profile');

    const searchRes = await InterestService.searchInterests(firstInterest.nameFa.slice(0, 2));
    assert(searchRes.length > 0, 'Interest search returns matching records');

    // Clean up test data
    await prisma.userInterest.deleteMany({ where: { userId: user1.id } });
    await prisma.user.deleteMany({ where: { id: { in: [user1.id, user2.id] } } });
    console.log('\n🧹 Test data cleanly purged from PostgreSQL.');

  } catch (err) {
    console.error('Fatal Stage 6 test error:', err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }

  console.log('\n====================================================');
  console.log(`📊 TEST RESULTS: ${passed}/${total} TESTS PASSED`);
  console.log('====================================================');
}

runStage6Tests();
