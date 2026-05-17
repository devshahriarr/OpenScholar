import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { getUserProfile } from "@/modules/user/repository";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    let token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
    if (!token) {
      const cookieHeader = req.headers.get("Cookie") || "";
      const match = cookieHeader.match(/auth_token=([^;]+)/);
      if (match) token = match[1];
    }

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userToken = await verifyToken(token);
    if (!userToken) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const profile = await getUserProfile(userToken.sub);

    if (!profile) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error: any) {
    console.error("[USER_ME_GET_ERROR]", error);
    return NextResponse.json(
      { message: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
