import { prisma } from "@/lib/db";
import { PaperStatus, ModerationAction } from "@prisma/client";

export async function getPapersByStatus(status?: PaperStatus, limit: number = 10) {
  return prisma.paper.findMany({
    where: {
      status: status,
      isDeleted: false,
    },
    include: {
      category: true,
      creator: {
        select: {
          name: true,
          id: true,
          university: {
            select: {
              name: true,
            }
          }
        }
      },
      versions: {
        orderBy: { versionNumber: "desc" },
        take: 1
      }
    },
    take: limit,
    orderBy: { createdAt: "desc" }
  });
}

export async function getAdminDashboardStats() {
  const [totalUsers, totalPapers, pendingPapers, categories] = await Promise.all([
    prisma.user.count(),
    prisma.paper.count({ where: { isDeleted: false } }),
    prisma.paper.count({ where: { status: PaperStatus.pending, isDeleted: false } }),
    prisma.category.findMany({
      include: {
        _count: {
          select: { papers: { where: { isDeleted: false } } }
        }
      }
    })
  ]);

  const categoryDistribution = categories
    .filter(c => c._count.papers > 0)
    .map(c => ({
      name: c.name,
      value: c._count.papers,
      // Assign some colors or let frontend handle it
    }));

  return {
    totalUsers,
    totalPapers,
    pendingPapers,
    categoryDistribution
  };
}

export async function getModerationStats() {
  const [pending, approved, rejected] = await Promise.all([
    prisma.paper.count({ where: { status: PaperStatus.pending, isDeleted: false } }),
    prisma.paper.count({ where: { status: PaperStatus.approved, isDeleted: false } }),
    prisma.paper.count({ where: { status: PaperStatus.rejected, isDeleted: false } }),
  ]);

  return {
    pending,
    approved,
    rejected
  };
}

export async function moderatePaper(
  paperId: string, 
  adminId: string, 
  action: ModerationAction, 
  reason?: string
) {
  return prisma.$transaction(async (tx) => {
    // 1. Update paper status
    const paper = await tx.paper.update({
      where: { id: paperId },
      data: {
        status: action === ModerationAction.approved ? PaperStatus.approved : PaperStatus.rejected
      }
    });

    // 2. Log the action
    await tx.moderationLog.create({
      data: {
        paperId,
        adminId,
        action,
        reason
      }
    });

    // 3. If approved, make sure the version is marked as published if it's the first one
    if (action === ModerationAction.approved) {
      await tx.paperVersion.updateMany({
        where: { paperId },
        data: { isPublished: true }
      });
    }

    return paper;
  });
}
