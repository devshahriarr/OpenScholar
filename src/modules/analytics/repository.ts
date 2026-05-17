import { prisma } from "@/lib/db";
import { AnalyticsEventType } from "@prisma/client";

export async function trackEvent(paperId: string, eventType: AnalyticsEventType, userId?: string) {
  return prisma.$transaction(async (tx) => {
    // 1. Log the event
    await tx.analyticsEvent.create({
      data: {
        paperId,
        eventType,
        userId: userId || null
      }
    });

    // 2. Upsert the aggregated metrics
    const incrementData = eventType === AnalyticsEventType.view 
      ? { viewCount: { increment: 1 } }
      : { downloadCount: { increment: 1 } };

    const initialData = eventType === AnalyticsEventType.view
      ? { viewCount: 1, downloadCount: 0 }
      : { viewCount: 0, downloadCount: 1 };

    await tx.paperMetrics.upsert({
      where: { paperId },
      update: {
        ...incrementData,
        updatedAt: new Date()
      },
      create: {
        paperId,
        ...initialData,
        updatedAt: new Date()
      }
    });
  });
}

export async function getSystemAnalytics() {
  const [totalViews, totalDownloads, activeTodayEvents] = await Promise.all([
    prisma.paperMetrics.aggregate({
      _sum: { viewCount: true }
    }),
    prisma.paperMetrics.aggregate({
      _sum: { downloadCount: true }
    }),
    prisma.analyticsEvent.count({
      where: {
        createdAt: {
          gte: new Date(new Date().getTime() - 24 * 60 * 60 * 1000) // Last 24 hours
        }
      }
    })
  ]);

  return {
    totalViews: totalViews._sum.viewCount || 0,
    totalDownloads: totalDownloads._sum.downloadCount || 0,
    activeToday: activeTodayEvents
  };
}
