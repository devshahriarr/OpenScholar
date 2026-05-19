import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { markAsRead } from "@/modules/notification/repository";

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { notificationId } = await req.json();
    if (!notificationId) {
      return NextResponse.json({ message: "Missing notificationId" }, { status: 400 });
    }

    await markAsRead(notificationId, user.sub);
    return NextResponse.json({ message: "Notification marked as read" });
  } catch (error: any) {
    console.error("[NOTIFICATIONS_READ_POST]", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
