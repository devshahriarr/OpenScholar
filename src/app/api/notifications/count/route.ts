import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getUnreadCount } from "@/modules/notification/repository";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ count: 0 });
    }

    const count = await getUnreadCount(user.sub);
    return NextResponse.json({ count });
  } catch (error: any) {
    console.error("[NOTIFICATIONS_COUNT_GET]", error);
    return NextResponse.json({ count: 0 });
  }
}
