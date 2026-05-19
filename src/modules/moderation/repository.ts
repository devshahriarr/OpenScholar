import { prisma } from "@/lib/db";
import { PaperStatus, ModerationAction } from "@prisma/client";
import { getSystemAnalytics } from "@/modules/analytics/repository";

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
  const [totalUsers, totalPapers, pendingPapers, categories, analytics] = await Promise.all([
    prisma.user.count(),
    prisma.paper.count({ where: { isDeleted: false } }),
    prisma.paper.count({ where: { status: PaperStatus.pending, isDeleted: false } }),
    prisma.category.findMany({
      include: {
        _count: {
          select: { papers: { where: { isDeleted: false } } }
        }
      }
    }),
    getSystemAnalytics()
  ]);

  const categoryDistribution = categories
    .filter(c => c._count.papers > 0)
    .map(c => ({
      name: c.name,
      value: c._count.papers,
    }));

  return {
    totalUsers,
    totalPapers,
    pendingPapers,
    totalViews: analytics.totalViews,
    totalDownloads: analytics.totalDownloads,
    activeToday: analytics.activeToday,
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
  const paper = await prisma.$transaction(async (tx) => {
    // 1. Update paper status
    const updated = await tx.paper.update({
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

    // 3. If approved, mark all versions as published
    if (action === ModerationAction.approved) {
      await tx.paperVersion.updateMany({
        where: { paperId },
        data: { isPublished: true }
      });
    }

    return updated;
  });

  // 4. Fire notification to the paper author (non-blocking)
  const { createNotification } = await import("@/modules/notification/repository");
  const isApproved = action === ModerationAction.approved;
  createNotification(
    paper.createdBy,
    isApproved ? "paper_approved" : "paper_rejected",
    isApproved
      ? "🎉 Your paper has been approved and is now live on OpenScholar!"
      : `Your paper was not approved.${reason ? ` Reason: ${reason}` : " Please review and resubmit."}`,
    paperId
  ).catch((err) => console.error("[NOTIFICATION_CREATE_ERROR]", err));

  return paper;
}

