import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { markAllAsRead } from "@/modules/notification/repository";

export async function POST() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await markAllAsRead(user.sub);
    return NextResponse.json({ message: "All notifications marked as read" });
  } catch (error: any) {
    console.error("[NOTIFICATIONS_READ_ALL_POST]", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
