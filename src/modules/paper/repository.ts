import { prisma } from "@/lib/db";
import { PaperStatus } from "@prisma/client";

export async function getOrCreateCategory(name: string): Promise<number> {
  let category = await prisma.category.findFirst({
    where: { name: { equals: name, mode: "insensitive" } },
  });

  if (!category) {
    category = await prisma.category.create({
      data: { name },
    });
  }
  return category.id;
}

export async function createPaperDraft(data: {
  title: string;
  abstract: string;
  keywords: string[];
  pdfUrl: string;
  categoryId: number;
  userId: string;
}) {
  return prisma.paper.create({
    data: {
      categoryId: data.categoryId,
      createdBy: data.userId,
      status: PaperStatus.draft, // Created as draft initially
      versions: {
        create: {
          versionNumber: 1,
          title: data.title,
          abstract: data.abstract,
          keywords: data.keywords,
          pdfUrl: data.pdfUrl,
          isPublished: false,
        },
      },
    },
    include: {
      versions: true,
    },
  });
}

export async function updatePaperDraft(id: string, userId: string, data: {
  title?: string;
  abstract?: string;
  keywords?: string[];
  categoryId?: number;
}) {
  const paper = await prisma.paper.findUnique({
    where: { id, createdBy: userId },
    include: { versions: { orderBy: { versionNumber: 'desc' }, take: 1 } }
  });

  if (!paper || paper.status !== PaperStatus.draft) {
    throw new Error("Only draft papers can be updated");
  }

  const latestVersion = paper.versions[0];

  return prisma.$transaction([
    ...(data.categoryId ? [prisma.paper.update({
      where: { id },
      data: { categoryId: data.categoryId }
    })] : []),
    prisma.paperVersion.update({
      where: { id: latestVersion.id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.abstract && { abstract: data.abstract }),
        ...(data.keywords && { keywords: data.keywords })
      }
    })
  ]);
}

export async function submitPaper(id: string, userId: string) {
  const paper = await prisma.paper.findUnique({
    where: { id, createdBy: userId }
  });

  if (!paper || paper.status !== PaperStatus.draft) {
    throw new Error("Only draft papers can be submitted");
  }

  return prisma.paper.update({
    where: { id },
    data: { status: PaperStatus.pending }
  });
}
export async function getPapersByUserId(userId: string) {
  return prisma.paper.findMany({
    where: { createdBy: userId, isDeleted: false },
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      versions: {
        orderBy: { versionNumber: "desc" },
        take: 1,
      },
      metrics: true,
    },
  });
}
export async function getAllCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
  });
}

export async function getPaperById(id: string) {
  try {
    return await prisma.paper.findUnique({
      where: { id, isDeleted: false },
      include: {
        category: true,
        creator: {
          include: {
            author: true,
          },
        },
        versions: {
          orderBy: { versionNumber: "desc" },
        },
        metrics: true,
      },
    });
  } catch (error) {
    console.error(`[REPOSITORY_ERROR] Failed to fetch paper ${id}:`, error);
    return null;
  }
}

export async function getRelatedPapers(id: string, categoryId: number, limit: number = 3) {
  return prisma.paper.findMany({
    where: {
      categoryId,
      id: { not: id },
      isDeleted: false,
    },
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      creator: {
        select: { name: true },
      },
      versions: {
        orderBy: { versionNumber: "desc" },
        take: 1,
      },
      metrics: true,
    },
  });
}

