import { NextResponse } from "next/server";
import { validateCredentials, findUserByEmail } from "@/modules/auth/repository";
import { signToken } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required." }, { status: 400 });
    }

    // Validate credentials
    const user = await validateCredentials(email, password);
    if (!user) {
      return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
    }

    // Enforce email verification
    if (!user.isVerified) {
      return NextResponse.json({ message: "Please verify your email before logging in." }, { status: 403 });
    }

    // Fetch role name for JWT payload
    const role = await prisma.role.findUnique({ where: { id: user.roleId } });

    // Sign JWT
    const token = await signToken({
      sub: user.id,
      email: user.email,
      role: role?.name ?? "student",
    });

    // Set token in httpOnly cookie (secure)
    const response = NextResponse.json({
      message: "Login successful.",
      user: { id: user.id, name: user.name, email: user.email, role: role?.name },
    });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[AUTH_LOGIN]", error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
