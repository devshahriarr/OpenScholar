import { LoginCredentials, LoginResponse, RegisterCredentials, ApiResponse } from "@/types/auth";

const BASE_URL = "/api/auth";

export async function loginUser(credentials: LoginCredentials): Promise<LoginResponse> {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Login failed. Please check your credentials.");
  }

  return data;
}

export async function registerUser(credentials: RegisterCredentials): Promise<ApiResponse> {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Registration failed. Please try again.");
  }

  return data;
}
