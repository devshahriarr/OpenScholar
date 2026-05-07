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
      status: PaperStatus.pending, // Automatically pending for moderation after upload
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
