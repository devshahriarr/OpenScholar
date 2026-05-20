import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const [totalPapers, universities, researchers, downloadsAggregate] = await Promise.all([
      prisma.paper.count({
        where: {
          status: "approved",
          isDeleted: false,
        },
      }),
      prisma.university.count(),
      prisma.user.count({
        where: {
          status: "active",
        },
      }),
      prisma.paperMetrics.aggregate({
        _sum: {
          downloadCount: true,
        },
      }),
    ]);

    const downloads = downloadsAggregate._sum.downloadCount ?? 0;

    return NextResponse.json({
      success: true,
      data: {
        totalPapers,
        universities,
        researchers,
        downloads,
      },
      message: "Analytics global stats fetched successfully",
    });
  } catch (error: any) {
    console.error("[GLOBAL_STATS_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        data: {
          totalPapers: 0,
          universities: 0,
          researchers: 0,
          downloads: 0,
        },
        message: "Failed to fetch global stats analytics",
      },
      { status: 500 }
    );
  }
}
