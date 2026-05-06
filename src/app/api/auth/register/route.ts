import { NextResponse } from "next/server";
import {
  findUserByEmail,
  createUser,
} from "@/modules/auth/repository";
import { sendVerificationEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, role } = body;

    // Validate inputs
    if (!name?.trim() || name.trim().length < 2) {
      return NextResponse.json({ message: "Full name must be at least 2 characters." }, { status: 400 });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ message: "A valid email is required." }, { status: 400 });
    }
    if (!password || password.length < 6) {
      return NextResponse.json({ message: "Password must be at least 6 characters." }, { status: 400 });
    }
    if (!["student", "admin"].includes(role)) {
      return NextResponse.json({ message: "Invalid role." }, { status: 400 });
    }

    // Check for existing user
    const existing = await findUserByEmail(email);
    if (existing) {
      return NextResponse.json({ message: "An account with this email already exists." }, { status: 409 });
    }

    // Create user
    const user = await createUser({ name: name.trim(), email, password, roleName: role });

    // Send verification email (non-blocking)
    if (user.verificationToken) {
      sendVerificationEmail(email, user.verificationToken).catch((err) => {
        console.error("[EMAIL_SEND_ERROR]", err);
      });
    }

    return NextResponse.json(
      { message: "Account created. Please check your email to verify your account." },
      { status: 201 }
    );
  } catch (error) {
    console.error("[AUTH_REGISTER]", error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
