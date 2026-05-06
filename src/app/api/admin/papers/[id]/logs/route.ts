import { NextResponse } from "next/server";
import { getModerationLogs } from "@/modules/moderation/repository";
import { getAdminUser } from "@/lib/admin-auth";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const adminUser = await getAdminUser(req);
    if (!adminUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const logs = await getModerationLogs(id);

    return NextResponse.json(logs);
  } catch (error: any) {
    console.error("[ADMIN_MODERATION_LOGS]", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" }, 
      { status: 500 }
    );
  }
}
