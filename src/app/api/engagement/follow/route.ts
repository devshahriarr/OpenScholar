import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { toggleFollowUser } from "@/modules/engagement/repository";

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

    const { targetUserId } = await request.json();
    if (!targetUserId) {
      return NextResponse.json({ message: "Target user ID is required" }, { status: 400 });
    }

    if (user.sub === targetUserId) {
      return NextResponse.json({ message: "You cannot follow yourself" }, { status: 400 });
    }

    await toggleFollowUser(user.sub, targetUserId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ENGAGEMENT_FOLLOW]", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
