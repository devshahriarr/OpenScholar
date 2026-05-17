import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { submitPaper } from "@/modules/paper/repository";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const authHeader = request.headers.get("Authorization");
    let token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
    if (!token) {
      const cookieHeader = request.headers.get("Cookie") || "";
      const match = cookieHeader.match(/auth_token=([^;]+)/);
      if (match) token = match[1];
    }

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    await submitPaper(id, user.sub);

    return NextResponse.json({ message: "Paper submitted successfully for moderation" });
  } catch (error: any) {
    console.error("[SUBMIT_PAPER_ERROR]", error);
    return NextResponse.json(
      { message: error?.message || "Internal server error" },
      { status: error?.message?.includes("Only draft") ? 400 : 500 }
    );
  }
}
