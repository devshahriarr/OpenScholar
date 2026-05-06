import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

const SALT_ROUNDS = 10;

/**
 * Finds a user by their email address.
 */
export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

/**
 * Finds a user by their verification token.
 */
export async function findUserByVerificationToken(token: string) {
  return prisma.user.findFirst({ where: { verificationToken: token } });
}

/**
 * Finds a user by their password reset token.
 */
export async function findUserByResetToken(token: string) {
  return prisma.user.findFirst({ where: { resetToken: token } });
}

/**
 * Creates a new user with a hashed password and assigns a role.
 */
export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  roleName: string;
}) {
  const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);
  const verificationToken = uuidv4();
  const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

  // Upsert role to ensure it exists
  const role = await prisma.role.upsert({
    where: { name: data.roleName },
    update: {},
    create: { name: data.roleName },
  });

  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash,
      roleId: role.id,
      isVerified: false,
      verificationToken,
      verificationTokenExpiry,
    },
  });
}

/**
 * Verifies a user's email using the provided token.
 * Returns false if token is invalid or expired.
 */
export async function verifyUserEmail(token: string): Promise<boolean> {
  const user = await findUserByVerificationToken(token);

  if (!user || !user.verificationTokenExpiry) return false;
  if (new Date() > user.verificationTokenExpiry) return false;

  await prisma.user.update({
    where: { id: user.id },
    data: {
      isVerified: true,
      verificationToken: null,
      verificationTokenExpiry: null,
    },
  });

  return true;
}

/**
 * Validates login credentials.
 * Returns user if valid, null otherwise.
 */
export async function validateCredentials(email: string, password: string) {
  const user = await findUserByEmail(email);
  if (!user) return null;

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) return null;

  return user;
}

/**
 * Generates and stores a password reset token for the given email.
 * Returns the token, or null if user not found.
 */
export async function createPasswordResetToken(email: string): Promise<string | null> {
  const user = await findUserByEmail(email);
  if (!user) return null;

  const resetToken = uuidv4();
  const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1h

  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken, resetTokenExpiry },
  });

  return resetToken;
}

/**
 * Resets a user's password using a valid reset token.
 * Returns false if token is invalid or expired.
 */
export async function resetUserPassword(token: string, newPassword: string): Promise<boolean> {
  const user = await findUserByResetToken(token);

  if (!user || !user.resetTokenExpiry) return false;
  if (new Date() > user.resetTokenExpiry) return false;

  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  return true;
}
