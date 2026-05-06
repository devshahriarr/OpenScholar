import { prisma } from "@/lib/db";
import { PaperStatus, ModerationAction } from "@prisma/client";

export async function getPendingPapers(page: number = 1, limit: number = 10) {
  const skip = (page - 1) * limit;

  const [total, papers] = await Promise.all([
    prisma.paper.count({ where: { status: "pending", isDeleted: false } }),
    prisma.paper.findMany({
      where: { status: "pending", isDeleted: false },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        versions: {
          orderBy: { versionNumber: "desc" },
          take: 1,
        },
        category: true,
      },
    }),
  ]);

  return {
    total,
    page,
    limit,
    results: papers.map((p) => ({
      paperId: p.id,
      title: p.versions[0]?.title || "Untitled",
      submittedAt: p.createdAt,
      author: p.creator.name,
      category: p.category.name,
      pdfUrl: p.versions[0]?.pdfUrl,
    })),
  };
}

export async function approvePaper(paperId: string, adminId: string) {
  // Check if paper exists and is pending
  const paper = await prisma.paper.findUnique({
    where: { id: paperId },
    include: { versions: { orderBy: { versionNumber: "desc" }, take: 1 } },
  });

  if (!paper) throw new Error("Paper not found");
  if (paper.status !== "pending") throw new Error(`Cannot approve paper in status: ${paper.status}`);
  if (!paper.versions.length) throw new Error("No versions found for this paper");

  const latestVersionId = paper.versions[0].id;

  // Transaction for safety
  await prisma.$transaction(async (tx) => {
    // 1. Update paper status
    await tx.paper.update({
      where: { id: paperId },
      data: { status: "approved" },
    });

    // 2. Publish latest version
    await tx.paperVersion.update({
      where: { id: latestVersionId },
      data: { isPublished: true },
    });

    // 3. Log moderation action
    await tx.moderationLog.create({
      data: {
        paperId,
        adminId,
        action: "approved",
      },
    });

    // We can emit a notification here or handle it asynchronously
  });
}

export async function rejectPaper(paperId: string, adminId: string, reason: string) {
  if (!reason || reason.trim() === "") {
    throw new Error("Rejection reason is required");
  }

  const paper = await prisma.paper.findUnique({ where: { id: paperId } });

  if (!paper) throw new Error("Paper not found");
  if (paper.status !== "pending") throw new Error(`Cannot reject paper in status: ${paper.status}`);

  await prisma.$transaction(async (tx) => {
    await tx.paper.update({
      where: { id: paperId },
      data: { status: "rejected" },
    });

    await tx.moderationLog.create({
      data: {
        paperId,
        adminId,
        action: "rejected",
        reason,
      },
    });
  });
}

export async function getModerationLogs(paperId: string) {
  const logs = await prisma.moderationLog.findMany({
    where: { paperId },
    orderBy: { createdAt: "desc" },
    include: {
      admin: { select: { name: true, email: true } },
    },
  });

  return {
    logs: logs.map((log) => ({
      action: log.action,
      admin: log.admin.name,
      reason: log.reason,
      timestamp: log.createdAt,
    })),
  };
}
