import { NextResponse } from "next/server";
import { moderatePaper } from "@/modules/moderation/repository";
import { getSessionUser } from "@/lib/auth";
import { ModerationAction } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    
    // Flexible role check: allow 'admin' or 'super_admin'
    const role = user?.role?.toLowerCase();
    if (!user || (role !== "admin" && role !== "super_admin")) {
      console.log(`[ADMIN_MODERATE] Unauthorized access attempt by ${user?.email} with role: ${user?.role}`);
      return NextResponse.json({ message: "Unauthorized: Admin access required" }, { status: 401 });
    }

    const { paperId, action, reason } = await request.json();

    if (!paperId || !action) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    if (!Object.values(ModerationAction).includes(action)) {
      return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    }

    await moderatePaper(paperId, user.sub, action as ModerationAction, reason);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ADMIN_MODERATE_POST]", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
