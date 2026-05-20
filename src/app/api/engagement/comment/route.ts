import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { addComment } from "@/modules/engagement/repository";

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

    const { paperId, content, parentId } = await request.json();
    if (!paperId || !content) {
      return NextResponse.json({ message: "Paper ID and content are required" }, { status: 400 });
    }

    const comment = await addComment(user.sub, paperId, content, parentId);
    const formattedComment = {
      id: comment.id,
      user: {
        id: comment.user.id,
        name: comment.user.name,
        avatarUrl: comment.user.profileImageUrl || undefined,
      },
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
    };
    return NextResponse.json(formattedComment);
  } catch (error) {
    console.error("[ENGAGEMENT_COMMENT]", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
