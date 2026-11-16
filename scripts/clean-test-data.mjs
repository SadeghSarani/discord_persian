import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Cleaning Test Data from DB ---');

  // Delete test moments
  const deletedMoments = await prisma.moment.deleteMany({});
  console.log('Deleted Moments:', deletedMoments.count);

  // Delete test communities
  const deletedChannels = await prisma.channel.deleteMany({});
  const deletedCategories = await prisma.channelCategory.deleteMany({});
  const deletedMembers = await prisma.communityMember.deleteMany({});
  const deletedRoles = await prisma.communityRole.deleteMany({});
  const deletedCommunities = await prisma.community.deleteMany({});
  console.log('Deleted Communities:', deletedCommunities.count);

  // Delete test users (rt_user_1, rt_user_2, arash) except admin/sadegh
  const deletedUsers = await prisma.user.deleteMany({
    where: {
      username: {
        in: ['rt_user_1', 'rt_user_2', 'arash']
      }
    }
  });
  console.log('Deleted Test Users:', deletedUsers.count);

  const remainingUsers = await prisma.user.findMany({
    select: { id: true, username: true, email: true, role: true }
  });
  console.log('Remaining Users in DB:', remainingUsers);
}

main()
  .catch((e) => {
    console.error('Error during cleanup:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
