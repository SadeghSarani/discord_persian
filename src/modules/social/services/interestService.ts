import { prisma } from '../../../lib/db.ts';

export class InterestService {
  /**
   * List all available interests categorized
   */
  static async listTaxonomy() {
    const interests = await prisma.interest.findMany({
      orderBy: [{ category: 'asc' }, { nameFa: 'asc' }],
    });

    const categories: Record<string, typeof interests> = {};
    for (const item of interests) {
      if (!categories[item.category]) categories[item.category] = [];
      categories[item.category].push(item);
    }

    return {
      all: interests,
      categorized: categories,
    };
  }

  /**
   * Set user interests (Atomic replacement with validation)
   */
  static async setUserInterests(userId: string, interestSlugs: string[]) {
    const slugs = Array.from(new Set(interestSlugs.map((s) => s.trim().toLowerCase())));

    // Validate that all slugs exist in the Interest taxonomy
    const validInterests = await prisma.interest.findMany({
      where: { slug: { in: slugs } },
    });

    return prisma.$transaction(async (tx) => {
      // Clear existing
      await tx.userInterest.deleteMany({ where: { userId } });

      // Create new associations
      if (validInterests.length > 0) {
        await tx.userInterest.createMany({
          data: validInterests.map((interest) => ({
            userId,
            interestId: interest.id,
          })),
        });
      }

      await tx.transactionalOutbox.create({
        data: {
          aggregateType: 'USER',
          aggregateId: userId,
          eventType: 'user.interests_updated',
          payload: { userId, interestSlugs: validInterests.map((i) => i.slug) },
        },
      });

      return validInterests;
    });
  }

  /**
   * Search interests by keyword
   */
  static async searchInterests(query: string) {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return prisma.interest.findMany({
      where: {
        OR: [
          { nameFa: { contains: q, mode: 'insensitive' } },
          { slug: { contains: q, mode: 'insensitive' } },
          { category: { contains: q, mode: 'insensitive' } },
        ],
      },
      take: 20,
    });
  }
}
