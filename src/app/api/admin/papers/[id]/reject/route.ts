import { NextResponse } from "next/server";
import { rejectPaper } from "@/modules/moderation/repository";
import { getAdminUser } from "@/lib/admin-auth";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const adminUser = await getAdminUser(req);
    if (!adminUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { reason } = body;

    if (!reason) {
      return NextResponse.json({ message: "Rejection reason is required" }, { status: 400 });
    }

    const { id } = await params;
    await rejectPaper(id, adminUser.sub, reason);

    return NextResponse.json({ message: "Paper rejected successfully" });
  } catch (error: any) {
    console.error("[ADMIN_REJECT_PAPER]", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" }, 
      { status: error.message === "Paper not found" ? 404 : 500 }
    );
  }
}
