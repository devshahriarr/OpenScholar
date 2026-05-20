import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function getUserProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      university: { select: { name: true } },
      department: { select: { name: true } },
      _count: {
        select: {
          papers: { where: { isDeleted: false, status: "approved" } },
          followers: true,
          following: true,
        }
      }
    }
  });

  console.log("[getUserProfile] User for ID", userId, ":", user ? user.name : "Not found in DB");

  if (!user || user.status !== "active") return null;

  // Let's also fetch total views for this user's papers
  const papers = await prisma.paper.findMany({
    where: { createdBy: userId, isDeleted: false, status: "approved" },
    include: { metrics: true }
  });

  let totalViews = 0;
  let totalDownloads = 0;
  let totalLikes = 0;

  for (const p of papers) {
    totalLikes += p.reactionCount || 0;
    if (p.metrics) {
      totalViews += p.metrics.viewCount || 0;
      totalDownloads += p.metrics.downloadCount || 0;
    }
  }

  return {
    id: user.id,
    name: user.name,
    bio: user.bio,
    avatarUrl: user.profileImageUrl,
    university: user.university?.name,
    department: user.department?.name,
    stats: {
      followers: user._count.followers, // people following this user
      following: user._count.following, // people this user is following
      papers: user._count.papers,
      views: totalViews,
      downloads: totalDownloads,
      likes: totalLikes
    },
    joinedAt: user.createdAt
  };
}

export async function updateUserSettings(userId: string, data: { name?: string; bio?: string; universityId?: number; departmentId?: number; profileImageUrl?: string }) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.bio !== undefined && { bio: data.bio }),
      ...(data.universityId !== undefined && { universityId: data.universityId }),
      ...(data.departmentId !== undefined && { departmentId: data.departmentId }),
      ...(data.profileImageUrl !== undefined && { profileImageUrl: data.profileImageUrl })
    }
  });
}
