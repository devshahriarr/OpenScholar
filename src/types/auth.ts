export type UserRole = "student" | "admin";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthUser {
  id: string;
  name: string;
  role: UserRole;
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

export interface ApiResponse<T = null> {
  success: boolean;
  data?: T;
  message: string;
}

export interface AuthFormState {
  isLoading: boolean;
  error: string | null;
  success: string | null;
}
