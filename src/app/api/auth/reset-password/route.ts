import { NextResponse } from "next/server";
import { resetUserPassword } from "@/modules/auth/repository";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, newPassword } = body;

    if (!token) {
      return NextResponse.json({ message: "Reset token is required." }, { status: 400 });
    }
    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ message: "Password must be at least 6 characters." }, { status: 400 });
    }

    const success = await resetUserPassword(token, newPassword);

    if (!success) {
      return NextResponse.json(
        { message: "Invalid or expired reset token." },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("[AUTH_RESET_PASSWORD]", error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
