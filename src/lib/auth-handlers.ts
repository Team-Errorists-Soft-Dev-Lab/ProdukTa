"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { type AuthResponse, LoginSchema, SignupSchema } from "@/types/auth";
import {
  findUserByEmail,
  verifyPassword,
  findSectorById,
  createAdmin,
  validateLoginAttempt,
} from "@/services/auth-service";

import { createClient } from "@/utils/supabase/server";

export async function handleLogin(formData: FormData): Promise<AuthResponse> {
  const supabase = await createClient();
  try {
    const parseResult = LoginSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!parseResult.success) {
      const errorMessage = parseResult.error.issues
        .map((issue) => issue.message)
        .join(", ");
      return { user: null, error: errorMessage };
    }

    const { email, password } = parseResult.data;

    // Get user from database
    const user = await findUserByEmail(email);

    // Validate login attempt (includes email verification check)
    const validationError = await validateLoginAttempt(user);
    if (validationError) {
      return {
        user: null,
        error: validationError.message,
        message:
          validationError.code === "email_unverified"
            ? "Please check your email for the verification link."
            : undefined,
      };
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user!.password);
    if (!isValidPassword) {
      return { user: null, error: "Invalid email or password" };
    }

    // Sign in with Supabase
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (authError) {
      return { user: null, error: authError.message };
    }

    // Update user metadata
    await supabase.auth.updateUser({
      data: {
        isSuperadmin: user!.isSuperadmin,
        name: user!.name,
        sectorId: user!.sectors[0]?.sectorId ?? 0,
      },
    });

    revalidatePath("/", "layout");
    return { user: user!, error: null };
  } catch (error) {
    console.error("Login error:", error);
    return {
      user: null,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function handleSignup(formData: FormData): Promise<AuthResponse> {
  const supabase = await createClient();
  try {
    const parseResult = SignupSchema.safeParse({
      email: formData.get("email"),
      name: formData.get("name"),
      password: formData.get("password"),
      sectorId: formData.get("sectorId"),
    });

    if (!parseResult.success) {
      const errorMessage = parseResult.error.issues
        .map((issue) => issue.message)
        .join(", ");
      return { user: null, error: errorMessage };
    }

    const { email, name, password, sectorId } = parseResult.data;
    const sectorIdNumber = parseInt(sectorId, 10);

    if (isNaN(sectorIdNumber)) {
      return { user: null, error: "Invalid sector ID" };
    }

    // Check if sector exists
    const sector = await findSectorById(sectorIdNumber);
    if (!sector) {
      return { user: null, error: "Selected sector does not exist" };
    }

    // Check if email is already registered
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return { user: null, error: "Email is already registered" };
    }

    // Create Supabase auth user with email confirmation required
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, sectorId: sectorIdNumber },
      },
    });

    if (error) {
      return { user: null, error: error.message };
    }

    // Create admin in database
    await createAdmin({
      email,
      name,
      password,
      sectorId: sectorIdNumber,
    });

    // Return success with message
    return {
      user: null,
      error: null,
      message:
        "Please check your email to verify your account before logging in.",
    };
  } catch (error) {
    console.error("Signup error:", error);
    return {
      user: null,
      error:
        error instanceof Error ? error.message : "Failed to create account",
    };
  }
}

export async function handleLogout(): Promise<AuthResponse> {
  const supabase = await createClient();
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Logout error:", error);
    return {
      user: null,
      error: "An unexpected error occurred",
    };
  } finally {
    revalidatePath("/", "layout");
    redirect("/login");
  }
}
