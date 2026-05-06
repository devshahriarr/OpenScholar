import { NextResponse } from "next/server";
import { verifyUserEmail } from "@/modules/auth/repository";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ message: "Verification token is required." }, { status: 400 });
    }

    const success = await verifyUserEmail(token);

    if (!success) {
      return NextResponse.json(
        { message: "Invalid or expired verification token." },
        { status: 400 }
      );
    }

    // Redirect to login with success message
    return NextResponse.redirect(new URL("/login?verified=true", req.url));
  } catch (error) {
    console.error("[AUTH_VERIFY]", error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
