import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { PaperStatus } from "@prisma/client";

export async function GET() {
  try {
    const papers = await prisma.paper.findMany({
      where: {
        status: PaperStatus.approved,
        isDeleted: false,
      },
      include: {
        versions: {
          orderBy: { versionNumber: "desc" },
          take: 1,
        },
        creator: {
          select: {
            name: true,
            university: { select: { name: true } },
          },
        },
        category: { select: { name: true } },
        metrics: { select: { viewCount: true, downloadCount: true } },
        _count: { select: { comments: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 6,
    });

    const data = papers.map((p) => {
      const v = p.versions[0];
      return {
        id: p.id,
        title: v?.title ?? "Untitled",
        abstract: v?.abstract ?? "No abstract available.",
        category: p.category?.name ?? "Uncategorized",
        tags: v?.keywords ?? [],
        views: p.metrics?.viewCount ?? 0,
        downloads: p.metrics?.downloadCount ?? 0,
        comments: p._count.comments,
        publishedAt: p.createdAt.toISOString(),
        author: {
          name: p.creator?.name ?? "Unknown",
          institution: p.creator?.university?.name ?? "OpenScholar",
        },
      };
    });

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error("[FEATURED_PAPERS_ERROR]", error);
    return NextResponse.json({ data: [] }, { status: 500 });
  }
}
