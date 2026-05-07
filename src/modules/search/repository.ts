import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

export interface SearchFilters {
  q?: string;
  categoryId?: number;
  year?: number;
  page: number;
  limit: number;
  sort?: "relevance" | "newest";
}

export interface SearchResponse {
  total: number;
  page: number;
  limit: number;
  results: any[];
}

export async function searchPapers(filters: SearchFilters): Promise<SearchResponse> {
  const { q, categoryId, year, page, limit, sort } = filters;
  const skip = (page - 1) * limit;

  // Build the Where clause
  const where: Prisma.PaperWhereInput = {
    isDeleted: false,
  };

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (q) {
    where.versions = {
      some: {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { abstract: { contains: q, mode: "insensitive" } },
          { keywords: { has: q } },
        ],
      },
    };
  }

  // Handle year filter if provided
  if (year) {
    const startDate = new Date(`${year}-01-01T00:00:00Z`);
    const endDate = new Date(`${year}-12-31T23:59:59Z`);
    where.createdAt = {
      gte: startDate,
      lte: endDate,
    };
  }

  // Handle Sorting
  let orderBy: Prisma.PaperOrderByWithRelationInput = { createdAt: "desc" };
  // If sort is relevance, Prisma lacks native TSVECTOR rank sorting without raw SQL,
  // so we default to newest. For MVP, this is sufficient.

  const [total, papers] = await Promise.all([
    prisma.paper.count({ where }),
    prisma.paper.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        category: true,
        creator: {
          select: { name: true, id: true },
        },
        versions: {
          orderBy: { versionNumber: "desc" },
          take: 1,
          include: {
            authors: true,
          },
        },
        metrics: true,
        tags: {
          include: { tag: true },
        },
      },
    }),
  ]);

  // Format the results for the frontend to match the Paper interface
  const results = papers.map((paper) => {
    const latestVersion = paper.versions[0];
    return {
      id: paper.id,
      title: latestVersion?.title || "Untitled Paper",
      category: paper.category?.name || "Uncategorized",
      author: {
        name: paper.creator?.name || "Unknown Author",
        institution: "OpenScholar University", // Or fetch from user profile if available
      },
      abstract: latestVersion?.abstract || "No abstract available.",
      tags: latestVersion?.keywords || paper.tags?.map(t => t.tag.name) || [],
      views: paper.metrics?.views || 0,
      comments: paper.commentCount || 0,
      publishedAt: paper.createdAt.toISOString(),
    };
  });

  return {
    total,
    page,
    limit,
    results,
  };
}
