import { NextResponse } from "next/server";
import { trackEvent } from "@/modules/analytics/repository";
import { AnalyticsEventType } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { paperId, eventType } = body;

    if (!paperId || !eventType) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    if (eventType !== AnalyticsEventType.view && eventType !== AnalyticsEventType.download) {
      return NextResponse.json({ message: "Invalid event type" }, { status: 400 });
    }

    // Try to extract user session if available
    const authHeader = req.headers.get("Authorization");
    let token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
    if (!token) {
      const cookieHeader = req.headers.get("Cookie") || "";
      const match = cookieHeader.match(/auth_token=([^;]+)/);
      if (match) token = match[1];
    }

    let userId: string | undefined = undefined;
    if (token) {
      try {
        const { verifyToken } = await import("@/lib/auth");
        const user = await verifyToken(token);
        if (user) userId = user.sub;
      } catch (e) {
        // Ignore token errors, just treat as guest
      }
    }

    await trackEvent(paperId, eventType as AnalyticsEventType, userId);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[ANALYTICS_TRACK_ERROR]", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
