import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const paperId = searchParams.get("paperId");

  if (!paperId) {
    return NextResponse.json({ error: "Missing paperId" }, { status: 400 });
  }

  const mockComments = [
    {
      id: "comment-1",
      user: {
        id: "user-1",
        name: "Michael Chen",
        avatarUrl: undefined,
      },
      content: "Excellent research on NLP applications. The transformer architecture analysis is particularly insightful.",
      createdAt: "2024-01-18T10:00:00Z",
    },
    {
      id: "comment-2",
      user: {
        id: "user-1",
        name: "Michael Chen",
        avatarUrl: undefined,
      },
      content: "Excellent research on NLP applications. The transformer architecture analysis is particularly insightful.",
      createdAt: "2024-01-18T11:00:00Z",
    }
  ];

  await new Promise(resolve => setTimeout(resolve, 400));
  
  return NextResponse.json({ comments: mockComments });
}
