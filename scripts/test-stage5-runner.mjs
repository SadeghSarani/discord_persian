import { PrismaClient } from '@prisma/client';
import { CommunityService } from '../src/modules/communities/services/communityService.ts';
import { MessagingService } from '../src/modules/messaging/services/messagingService.ts';
import { SocialGraphService } from '../src/modules/social/services/socialGraphService.ts';
import { hash } from '@node-rs/argon2';

const prisma = new PrismaClient();

async function runStage5Tests() {
  console.log('====================================================');
  console.log('🧪 NEXUS STAGE 5 — COMMUNITIES, MESSAGING & SOCIAL GRAPH TEST SUITE');
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
    const userLeader = await prisma.user.upsert({
      where: { username: 'c_leader' },
      create: { username: 'c_leader', email: 'c_leader@discaf.ir', name: 'رهبر سرور', credential: { create: { passwordHash: pHash } } },
      update: {},
    });
    const userMember1 = await prisma.user.upsert({
      where: { username: 'c_member1' },
      create: { username: 'c_member1', email: 'c_member1@discaf.ir', name: 'عضو اول', credential: { create: { passwordHash: pHash } } },
      update: {},
    });
    const userMember2 = await prisma.user.upsert({
      where: { username: 'c_member2' },
      create: { username: 'c_member2', email: 'c_member2@discaf.ir', name: 'عضو دوم', credential: { create: { passwordHash: pHash } } },
      update: {},
    });

    // 1. Community Creation & Auto-Provisioning
    console.log('--- 1. Testing Community Creation, Roles & Default Channels ---');
    const community = await CommunityService.createCommunity(userLeader.id, {
      name: 'کلن شیرهای پارسی',
      description: 'سرور گیمینگ و گپ و گفت',
      isPublic: true,
    });
    assert(community && community.id, 'Created new Community in PostgreSQL');
    assert(community.ownerId === userLeader.id, 'OwnerId correctly assigned to leader');

    const communityDetail = await CommunityService.getCommunityById(community.id, userLeader.id);
    assert(communityDetail.roles.length === 2, 'Default Owner and Member roles auto-provisioned');
    assert(communityDetail.categories.length === 1, 'Default General Category created');
    assert(communityDetail.categories[0].channels.length === 2, 'Default Text and Voice channels created');

    const defaultTextChannel = communityDetail.categories[0].channels.find((c) => c.type === 'TEXT');
    assert(defaultTextChannel !== undefined, 'Default text channel available for messaging');

    // 2. Joining & Leaving Community
    console.log('\n--- 2. Testing Community Membership Lifecycle ---');
    await CommunityService.joinCommunity(community.id, userMember1.id);
    const m1 = await prisma.communityMember.findUnique({
      where: { communityId_userId: { communityId: community.id, userId: userMember1.id } },
    });
    assert(m1 !== null, 'UserMember1 successfully joined Community');

    // Duplicate join is idempotent
    await CommunityService.joinCommunity(community.id, userMember1.id);
    const m1Count = await prisma.communityMember.count({
      where: { communityId: community.id, userId: userMember1.id },
    });
    assert(m1Count === 1, 'Duplicate join is idempotent');

    // Owner cannot leave community
    let ownerLeaveRejected = false;
    try {
      await CommunityService.leaveCommunity(community.id, userLeader.id);
    } catch (e) {
      ownerLeaveRejected = e.message === 'OWNER_CANNOT_LEAVE_COMMUNITY';
    }
    assert(ownerLeaveRejected, 'Owner prevented from abandoning community without transfer/delete');

    // 3. Member Banning & Ban Enforcement
    console.log('\n--- 3. Testing Community Ban Enforcement ---');
    await CommunityService.banMember(community.id, userLeader.id, userMember1.id, 'قوانین سرور رعایت نشد');
    const isMemberStill = await prisma.communityMember.findUnique({
      where: { communityId_userId: { communityId: community.id, userId: userMember1.id } },
    });
    assert(isMemberStill === null, 'Banned member stripped of community membership');

    let bannedJoinRejected = false;
    try {
      await CommunityService.joinCommunity(community.id, userMember1.id);
    } catch (e) {
      bannedJoinRejected = e.message === 'COMMUNITY_BANNED';
    }
    assert(bannedJoinRejected, 'Banned user rejected from rejoining with COMMUNITY_BANNED');

    // 4. Channel Messaging, Edits & Reactions
    console.log('\n--- 4. Testing Channel Messaging, Edits & Reactions ---');
    // Join Member 2
    await CommunityService.joinCommunity(community.id, userMember2.id);

    const msg = await MessagingService.sendMessage(defaultTextChannel.id, userLeader.id, {
      content: 'سلام به همه اعضای جدید کلن! خوش آمدید.',
    });
    assert(msg && msg.id && msg.content.includes('سلام'), 'Message persisted in PostgreSQL');

    // Non-member cannot send messages
    let nonMemberSendRejected = false;
    try {
      await MessagingService.sendMessage(defaultTextChannel.id, userMember1.id, { content: 'تلاش غیرمجاز' });
    } catch (e) {
      nonMemberSendRejected = e.message === 'NOT_COMMUNITY_MEMBER';
    }
    assert(nonMemberSendRejected, 'Non-member rejected from sending channel messages');

    // Author edits message
    const editedMsg = await MessagingService.editMessage(msg.id, userLeader.id, 'سلام به همه اعضای عزیز کلن! (ویرایش‌شده)');
    assert(editedMsg.isEdited === true, 'Message marked as isEdited=true');
    const editHistory = await prisma.messageEditHistory.count({ where: { messageId: msg.id } });
    assert(editHistory === 1, 'Previous message content archived in MessageEditHistory');

    // Non-author cannot edit message
    let nonAuthorEditRejected = false;
    try {
      await MessagingService.editMessage(msg.id, userMember2.id, 'تلاش هک پیام');
    } catch (e) {
      nonAuthorEditRejected = e.message === 'FORBIDDEN_NOT_AUTHOR';
    }
    assert(nonAuthorEditRejected, 'Non-author forbidden from editing message');

    // Add Reaction
    const reaction = await MessagingService.addReaction(msg.id, userMember2.id, '🔥');
    assert(reaction && reaction.emoji === '🔥', 'Reaction recorded for message');
    // Duplicate reaction is idempotent
    await MessagingService.addReaction(msg.id, userMember2.id, '🔥');
    const rCount = await prisma.messageReaction.count({ where: { messageId: msg.id, userId: userMember2.id, emoji: '🔥' } });
    assert(rCount === 1, 'Duplicate reaction is idempotent');

    // Retrieve Channel Messages with pagination
    const channelMsgs = await MessagingService.getChannelMessages(defaultTextChannel.id, userLeader.id);
    assert(channelMsgs.items.length >= 1, 'Channel messages successfully retrieved with user/reactions data');

    // 5. Direct Messaging (1-on-1)
    console.log('\n--- 5. Testing 1-on-1 Direct Messaging ---');
    const directConv = await MessagingService.getOrCreateDirectConversation(userLeader.id, userMember2.id);
    assert(directConv && directConv.id, '1-on-1 Direct Conversation established');

    const dm = await MessagingService.sendDirectMessage(directConv.id, userLeader.id, 'پیام محرمانه به شما');
    assert(dm && dm.id, 'Direct message stored in PostgreSQL');

    // Non-participant cannot read or send DMs
    let dmForbidden = false;
    try {
      await MessagingService.sendDirectMessage(directConv.id, userMember1.id, 'فضولی در چت دیگران');
    } catch (e) {
      dmForbidden = e.message === 'FORBIDDEN_NOT_PARTICIPANT';
    }
    assert(dmForbidden, 'Non-participant blocked from accessing private DM conversation');

    // 6. Social Graph: Friendships, Requests & Reciprocal Handling
    console.log('\n--- 6. Testing Friendships & Reciprocal Requests ---');
    const req1 = await SocialGraphService.sendFriendRequest(userLeader.id, userMember2.id);
    assert(req1 && req1.status === 'PENDING', 'Friend request sent with PENDING status');

    // Reciprocal request automatically completes friendship
    const reqReciprocal = await SocialGraphService.sendFriendRequest(userMember2.id, userLeader.id);
    assert(reqReciprocal && reqReciprocal.status === 'ACCEPTED', 'Reciprocal request auto-completes to ACCEPTED status');

    const friendsList = await SocialGraphService.listFriends(userLeader.id);
    assert(friendsList.some((f) => f.id === userMember2.id), 'UserMember2 listed in accepted friends');

    // 7. Blocking & Multi-Module Enforcement
    console.log('\n--- 7. Testing User Blocking & DM/Friendship Restriction ---');
    await SocialGraphService.blockUser(userLeader.id, userMember2.id);

    // Verify friendship severed
    const friendsAfterBlock = await SocialGraphService.listFriends(userLeader.id);
    assert(!friendsAfterBlock.some((f) => f.id === userMember2.id), 'Blocking user automatically severed friendship');

    // Verify DM sending blocked
    let dmBlocked = false;
    try {
      await MessagingService.sendDirectMessage(directConv.id, userMember2.id, 'هنوز بلاک نیستم؟');
    } catch (e) {
      dmBlocked = e.message === 'DM_BLOCKED_BY_USER';
    }
    assert(dmBlocked, 'Blocked user cannot send DM messages');

    // Clean up test data
    await prisma.userBlock.deleteMany({ where: { blockerId: userLeader.id } });
    await prisma.community.delete({ where: { id: community.id } });
    await prisma.conversation.delete({ where: { id: directConv.id } });
    await prisma.user.deleteMany({ where: { id: { in: [userLeader.id, userMember1.id, userMember2.id] } } });
    console.log('\n🧹 Test data cleanly purged from PostgreSQL.');

  } catch (err) {
    console.error('Fatal Stage 5 test error:', err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }

  console.log('\n====================================================');
  console.log(`📊 TEST RESULTS: ${passed}/${total} TESTS PASSED`);
  console.log('====================================================');
}

runStage5Tests();
