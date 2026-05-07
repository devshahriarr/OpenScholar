import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { toggleSavePaper } from "@/modules/engagement/repository";

async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { paperId } = await request.json();
    if (!paperId) {
      return NextResponse.json({ message: "Paper ID is required" }, { status: 400 });
    }

    await toggleSavePaper(user.sub, paperId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ENGAGEMENT_SAVE]", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
