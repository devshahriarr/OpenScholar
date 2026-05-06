import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const FROM = `"OpenScholar" <${process.env.SMTP_USER}>`;

/**
 * Sends an email verification link to the user.
 */
export async function sendVerificationEmail(email: string, token: string): Promise<void> {
  const link = `${APP_URL}/api/auth/verify?token=${token}`;

  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: "Verify your OpenScholar account",
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
        <h2>Welcome to OpenScholar!</h2>
        <p>Please verify your email address by clicking the button below.</p>
        <a href="${link}" style="
          display: inline-block;
          background: #4F46E5;
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: bold;
          margin: 16px 0;
        ">Verify Email</a>
        <p style="color: #666; font-size: 12px;">This link expires in 24 hours.</p>
        <p style="color: #666; font-size: 12px;">If you did not create an account, please ignore this email.</p>
      </div>
    `,
  });
}

/**
 * Sends a password reset link to the user.
 */
export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  const link = `${APP_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: "Reset your OpenScholar password",
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>Click the button below to reset your password. This link expires in 1 hour.</p>
        <a href="${link}" style="
          display: inline-block;
          background: #4F46E5;
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: bold;
          margin: 16px 0;
        ">Reset Password</a>
        <p style="color: #666; font-size: 12px;">If you did not request this, please ignore this email.</p>
      </div>
    `,
  });
}
