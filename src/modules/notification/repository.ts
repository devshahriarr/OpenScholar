import { prisma } from "@/lib/db";

export type NotificationType =
  | "paper_approved"
  | "paper_rejected"
  | "comment_reply"
  | "new_follower"
  | "system";

export async function createNotification(
  userId: string,
  type: NotificationType,
  message: string,
  referenceId?: string
) {
  return prisma.notification.create({
    data: {
      userId,
      type,
      message,
      referenceId: referenceId ?? null,
    },
  });
}

export async function getUserNotifications(
  userId: string,
  page: number = 1,
  limit: number = 20
) {
  const skip = (page - 1) * limit;

  const [total, results] = await Promise.all([
    prisma.notification.count({ where: { userId } }),
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
  ]);

  return { total, results };
}

export async function getUnreadCount(userId: string) {
  return prisma.notification.count({
    where: { userId, isRead: false },
  });
}

export async function markAsRead(notificationId: string, userId: string) {
  return prisma.notification.updateMany({
    where: { id: notificationId, userId },
    data: { isRead: true },
  });
}

export async function markAllAsRead(userId: string) {
  return prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
}
