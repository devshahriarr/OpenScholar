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
  try {
    const { q, categoryId, year, page, limit, sort } = filters;
    const skip = (page - 1) * limit;

    // Build the Where clause
    const where: Prisma.PaperWhereInput = {
      isDeleted: false,
      status: "approved", // Only show approved papers
    };

    if (categoryId && categoryId > 0) {
      where.categoryId = categoryId;
    }

    if (q && q.trim()) {
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
    if (year && year > 0) {
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
            select: { name: true, id: true, university: true },
          },
          versions: {
            where: { isPublished: true },
            orderBy: { versionNumber: "desc" },
            take: 1,
            include: {
              authors: {
                select: { author: { select: { name: true } } },
              },
            },
          },
          metrics: {
            select: {
              viewCount: true,
              downloadCount: true,
            }
          },
        },
      }),
    ]);

    // Format the results for the frontend to match the Paper interface
    const results = papers
      .filter((paper) => paper.versions.length > 0) // Only include papers with published versions
      .map((paper) => {
        const latestVersion = paper.versions[0];
        return {
          id: paper.id,
          title: latestVersion?.title || "Untitled Paper",
          category: paper.category?.name || "Uncategorized",
          author: {
            name: paper.creator?.name || "Unknown Author",
            institution: paper.creator?.university?.name || "OpenScholar",
          },
          abstract: latestVersion?.abstract || "No abstract available.",
          tags: latestVersion?.keywords || [],
          views: paper.metrics?.viewCount || 0,
          downloads: paper.metrics?.downloadCount || 0,
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
  } catch (error: any) {
    console.error("[SEARCH_REPOSITORY_ERROR]", {
      message: error?.message,
      code: error?.code,
    });
    throw error; // Re-throw so the API handler can catch it
  }
}
