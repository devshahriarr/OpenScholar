import { verifyToken } from "@/lib/auth";

export async function getAdminUser(req: Request) {
  const authHeader = req.headers.get("Authorization");
  let token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
  
  if (!token) {
    const cookieHeader = req.headers.get("Cookie") || "";
    const match = cookieHeader.match(/auth_token=([^;]+)/);
    if (match) token = match[1];
  }

  if (!token) return null;

  const user = await verifyToken(token);
  // Assuming role '1' or 'admin' is the admin role. 
  // Adjust this based on your exact Role table setup.
  if (!user || (user.role !== "admin" && user.role !== "SUPER_ADMIN" && user.role !== "1")) {
    return null;
  }

  return user;
}
