"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/utils/prisma/client";
import { type Admin } from "@prisma/client";
import bcrypt from "bcryptjs";

// Schema for login data
const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

// Schema for signup data
const SignupSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(2, "Name must be at least 2 characters long"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  sectorId: z.string().min(1, "Sector is required"),
});

interface AuthResponse {
  user: Admin | null;
  error: string | null;
}

export async function handleLogin(formData: FormData): Promise<AuthResponse> {
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
    const user = await prisma.admin.findUnique({
      where: { email },
      include: {
        sectors: {
          include: {
            sector: true,
          },
        },
      },
    });

    if (!user) {
      return { user: null, error: "Invalid email or password" };
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return { user: null, error: "Invalid email or password" };
    }

    // Check if account is pending (skip for superadmin)
    if (!user.isSuperadmin && user.isPending) {
      return {
        user: null,
        error:
          "Your account is pending approval. Please wait for admin verification.",
      };
    }

    // Sign in with Supabase
    const supabase = await createClient();
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
        isSuperadmin: user.isSuperadmin,
        name: user.name,
        sectorId: user.sectors[0]?.sectorId,
      },
    });

    revalidatePath("/", "layout");
    return { user, error: null };
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
    const sector = await prisma.sector.findUnique({
      where: { id: sectorIdNumber },
    });

    if (!sector) {
      return { user: null, error: "Selected sector does not exist" };
    }

    // Check if email is already registered
    const existingUser = await prisma.admin.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { user: null, error: "Email is already registered" };
    }

    // Create Supabase auth user
    const supabase = await createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          sectorId: sectorIdNumber,
        },
      },
    });

    if (authError) {
      return { user: null, error: authError.message };
    }

    // Hash password and create admin in database
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.admin.create({
      data: {
        email,
        name,
        password: hashedPassword,
        isPending: true,
        sectors: {
          create: {
            sectorId: sectorIdNumber,
          },
        },
      },
      include: {
        sectors: {
          include: {
            sector: true,
          },
        },
      },
    });

    // Return success without redirecting
    return { user: null, error: null };
  } catch (error) {
    console.error("Signup error:", error);
    return {
      user: null,
      error:
        error instanceof Error ? error.message : "Failed to create account",
    };
  }
}

export async function handleLogout(): Promise<void> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    revalidatePath("/", "layout");
    redirect("/login");
  } catch (error) {
    console.error("Logout error:", error);
    redirect(
      `/error?message=${encodeURIComponent(
        error instanceof Error ? error.message : "An unexpected error occurred",
      )}`,
    );
  }
}
