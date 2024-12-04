import { type Admin } from "@prisma/client";
import { z } from "zod";
import { AuthError } from "@supabase/supabase-js";

export interface AuthResponse {
  user: Admin | null;
  error: string | null;
  message?: string; // For success/info messages
}

// Schema for login data
export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

// Schema for signup data
export const SignupSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(2, "Name must be at least 2 characters long"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  sectorId: z.string().min(1, "Sector is required"),
});

export type LoginData = z.infer<typeof LoginSchema>;
export type SignupData = z.infer<typeof SignupSchema>;

export type CustomAuthError = {
  code:
    | "invalid_credentials"
    | "email_not_confirmed"
    | "pending_approval"
    | "user_not_found"
    | "same_password"
    | "unexpected_error";
  message: string;
};

export const AuthErrorHandler = (error: AuthError | CustomAuthError) => {
  // Handle Supabase auth errors
  if ("status" in error) {
    if (error.status === 400) {
      return { error: "Invalid email or password" };
    }
    if (error.status === 422) {
      return { error: "Invalid input data" };
    }
    return { error: error.message || "An unexpected error occurred" };
  }

  // Handle our custom auth errors
  switch (error.code) {
    case "invalid_credentials":
      return { error: "Invalid email or password" };
    case "email_not_confirmed":
      return { error: "Please verify your email before logging in" };
    case "pending_approval":
      return { error: "Your account is pending approval" };
    case "user_not_found":
      return { error: "User not found" };
    case "same_password":
      return { error: "New password must be different from the old password" };
    default:
      return { error: "An unexpected error occurred" };
  }
};
