import { type Admin } from "@prisma/client";
import { z } from "zod";
import type { AuthError } from "@supabase/supabase-js";

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

export interface CustomAuthError {
  code:
    | "invalid_credentials"
    | "pending_approval"
    | "account_disabled"
    | "no_sectors"
    | "email_unverified";
  message: string;
}

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
    case "pending_approval":
      return { error: "Your account is pending approval" };
    case "account_disabled":
      return { error: "Your account has been deactivated" };
    case "no_sectors":
      return { error: "No sectors assigned to your account" };
    case "email_unverified":
      return { error: "Please verify your email before logging in" };
    default:
      return { error: "An unexpected error occurred" };
  }
};
