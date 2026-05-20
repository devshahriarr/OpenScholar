import { prisma } from "@/lib/db";
import { ReactionType } from "@prisma/client";

export async function toggleReaction(userId: string, paperId: string, type: ReactionType) {
  const existing = await prisma.reaction.findUnique({
    where: {
      userId_paperId: { userId, paperId }
    }
  });

  if (existing) {
    // If same type, remove it (toggle off)
    if (existing.type === type) {
      return prisma.$transaction([
        prisma.reaction.delete({
          where: { userId_paperId: { userId, paperId } }
        }),
        prisma.paper.update({
          where: { id: paperId },
          data: { reactionCount: { decrement: 1 } }
        })
      ]);
    } else {
      // Change type
      return prisma.reaction.update({
        where: { userId_paperId: { userId, paperId } },
        data: { type }
      });
    }
  } else {
    // Create new
    return prisma.$transaction([
      prisma.reaction.create({
        data: { userId, paperId, type }
      }),
      prisma.paper.update({
        where: { id: paperId },
        data: { reactionCount: { increment: 1 } }
      })
    ]);
  }
}

export async function addComment(userId: string, paperId: string, content: string, parentId?: string) {
  return prisma.$transaction(async (tx) => {
    const comment = await tx.comment.create({
      data: {
        userId,
        paperId,
        content,
        parentId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profileImageUrl: true,
          }
        }
      }
    });

    await tx.paper.update({
      where: { id: paperId },
      data: { commentCount: { increment: 1 } }
    });

    return comment;
  });
}

export async function toggleSavePaper(userId: string, paperId: string) {
  const existing = await prisma.savedPaper.findUnique({
    where: {
      userId_paperId: { userId, paperId }
    }
  });

  if (existing) {
    return prisma.savedPaper.delete({
      where: { userId_paperId: { userId, paperId } }
    });
  } else {
    return prisma.savedPaper.create({
      data: { userId, paperId }
    });
  }
}

export async function toggleFollowUser(followerId: string, followingId: string) {
  console.log(`[DEBUG] Toggle Follow: ${followerId} -> ${followingId}`);
  
  const existing = await prisma.follower.findUnique({
    where: {
      followerId_followingId: { followerId, followingId }
    }
  });

  if (existing) {
    console.log("[DEBUG] Unfollowing...");
    return prisma.follower.delete({
      where: { followerId_followingId: { followerId, followingId } }
    });
  } else {
    console.log("[DEBUG] Following...");
    return prisma.follower.create({
      data: { followerId, followingId }
    });
  }
}

export async function getPaperComments(paperId: string) {
  return prisma.comment.findMany({
    where: { paperId, isDeleted: false, parentId: null },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          profileImageUrl: true,
        }
      },
      replies: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              profileImageUrl: true,
            }
          }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
}

export async function getUserInteractions(userId: string, paperId: string) {
  const [reaction, saved] = await Promise.all([
    prisma.reaction.findUnique({ where: { userId_paperId: { userId, paperId } } }),
    prisma.savedPaper.findUnique({ where: { userId_paperId: { userId, paperId } } })
  ]);

  return {
    isLiked: reaction?.type === "like",
    isSaved: !!saved,
  };
}

export async function getIsFollowing(followerId: string, followingId: string) {
  if (!followerId || !followingId) return false;
  
  const following = await prisma.follower.findUnique({
    where: { followerId_followingId: { followerId, followingId } }
  });
  return !!following;
}

export async function getSavedPapers(userId: string) {
  const saved = await prisma.savedPaper.findMany({
    where: { userId },
    include: {
      paper: {
        include: {
          category: true,
          creator: {
            include: { author: true }
          },
          versions: {
            orderBy: { versionNumber: "desc" },
            take: 1
          },
          metrics: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return saved.map(s => s.paper);
}

export async function getFollowingFeed(userId: string) {
  // Get IDs of users being followed
  const following = await prisma.follower.findMany({
    where: { followerId: userId },
    select: { followingId: true }
  });

  const followingIds = following.map(f => f.followingId);

  if (followingIds.length === 0) return [];

  return prisma.paper.findMany({
    where: {
      createdBy: { in: followingIds },
      isDeleted: false,
      status: "approved",
    },
    include: {
      category: true,
      creator: {
        select: { id: true, name: true, university: true }
      },
      versions: {
        where: { isPublished: true },
        orderBy: { versionNumber: "desc" },
        take: 1,
        include: { authors: true }
      },
      metrics: true
    },
    orderBy: { createdAt: "desc" }
  });
}

export async function getFollowingStats(userId: string) {
  const [followingCount, papersCount] = await Promise.all([
    prisma.follower.count({ where: { followerId: userId } }),
    prisma.paper.count({
      where: {
        createdBy: {
          in: (await prisma.follower.findMany({
            where: { followerId: userId },
            select: { followingId: true }
          })).map(f => f.followingId)
        },
        isDeleted: false,
      }
    })
  ]);

  return {
    totalFollowing: followingCount,
    newThesis: papersCount,
    thisWeek: 0 // Placeholder for now
  };
}

export async function getSuggestedResearchers(userId: string, limit: number = 5) {
  // Get some researchers that the user is not following
  const following = await prisma.follower.findMany({
    where: { followerId: userId },
    select: { followingId: true }
  });
  const followingIds = following.map(f => f.followingId);

  let suggestions = await prisma.user.findMany({
    where: {
      id: { notIn: [userId, ...followingIds] },
      author: { isNot: null } // Only authors first
    },
    include: {
      author: true,
      university: true,
      papers: {
        where: { isDeleted: false, status: "approved" },
        include: { metrics: true }
      },
      _count: {
        select: { papers: true }
      }
    },
    take: limit
  });

  // If not enough authors, get any users
  if (suggestions.length < limit) {
    const additional = await prisma.user.findMany({
      where: {
        id: { notIn: [userId, ...followingIds, ...suggestions.map(s => s.id)] },
      },
      include: {
        author: true,
        university: true,
        papers: {
          where: { isDeleted: false, status: "approved" },
          include: { metrics: true }
        },
        _count: {
          select: { papers: true }
        }
      },
      take: limit - suggestions.length
    });
    suggestions = [...suggestions, ...additional];
  }

  return suggestions.map(user => {
    let viewCount = 0;
    if (user.papers) {
      for (const p of user.papers) {
        if (p.metrics) {
          viewCount += p.metrics.viewCount || 0;
        }
      }
    }
    return {
      id: user.id,
      name: user.name,
      profileImageUrl: user.profileImageUrl,
      university: user.university,
      _count: user._count,
      viewCount
    };
  });
}
