import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { updateUserSettings } from "@/modules/user/repository";

export async function PUT(req: Request) {
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

    const body = await req.json();
    
    // Only allow updating specific fields
    const { name, bio, universityId, departmentId, profileImageUrl } = body;
    
    const updatedUser = await updateUserSettings(userToken.sub, {
      name,
      bio,
      universityId: universityId ? parseInt(universityId, 10) : undefined,
      departmentId: departmentId ? parseInt(departmentId, 10) : undefined,
      profileImageUrl
    });

    return NextResponse.json({ message: "Settings updated successfully", user: { name: updatedUser.name } });
  } catch (error: any) {
    console.error("[USER_SETTINGS_PUT_ERROR]", error);
    return NextResponse.json(
      { message: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
