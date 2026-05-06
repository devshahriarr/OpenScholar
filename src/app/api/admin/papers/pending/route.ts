import { NextResponse } from "next/server";
import { getPendingPapers } from "@/modules/moderation/repository";
import { getAdminUser } from "@/lib/admin-auth";

export async function GET(req: Request) {
  try {
    const adminUser = await getAdminUser(req);
    if (!adminUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const pendingPapers = await getPendingPapers(
      isNaN(page) || page < 1 ? 1 : page,
      isNaN(limit) || limit < 1 ? 10 : limit
    );

    return NextResponse.json(pendingPapers);
  } catch (error) {
    console.error("[ADMIN_PENDING_PAPERS]", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
