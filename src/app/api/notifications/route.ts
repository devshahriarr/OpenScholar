import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getUserNotifications } from "@/modules/notification/repository";

export async function GET(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "20", 10));

    const { total, results } = await getUserNotifications(user.sub, page, limit);

    return NextResponse.json({ total, results });
  } catch (error: any) {
    console.error("[NOTIFICATIONS_GET]", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
