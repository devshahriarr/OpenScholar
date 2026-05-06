import { NextResponse } from "next/server";
import { createPasswordResetToken } from "@/modules/auth/repository";
import { sendPasswordResetEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ message: "Email is required." }, { status: 400 });
    }

    // Generate token — always return 200 to prevent email enumeration
    const token = await createPasswordResetToken(email);
    if (token) {
      sendPasswordResetEmail(email, token).catch((err) => {
        console.error("[RESET_EMAIL_ERROR]", err);
      });
    }

    return NextResponse.json(
      { message: "If an account exists with this email, a password reset link has been sent." },
      { status: 200 }
    );
  } catch (error) {
    console.error("[AUTH_FORGOT_PASSWORD]", error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
