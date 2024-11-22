"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/utils/prisma/client";
import { type Admin } from "@prisma/client";

// Schema for login data
const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

// Schema for signup data
const SignupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  name: z.string().min(2, "Name must be at least 2 characters long"),
  sectorId: z.string().min(1, "Sector is required"),
});

export interface AuthResponse {
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

    // Sign in with Supabase
    const supabase = await createClient();
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError) {
      return { user: null, error: authError.message };
    }

    // Get user from database
    const user = await prisma.admin.findUnique({
      where: { email },
      include: { sectors: true },
    });

    if (!user) {
      return { user: null, error: "User not found" };
    }

    // Update user metadata
    await supabase.auth.updateUser({
      data: {
        isSuperadmin: user.isSuperadmin,
        name: user.name,
      },
    });

    revalidatePath("/", "layout");
    return { user, error: null };
  } catch (error) {
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
      password: formData.get("password"),
      name: formData.get("name"),
      sectorId: formData.get("sectorId"),
    });

    if (!parseResult.success) {
      const errorMessage = parseResult.error.issues
        .map((issue) => issue.message)
        .join(", ");
      return { user: null, error: errorMessage };
    }

    const { email, password, name, sectorId } = parseResult.data;

    // Create Supabase auth user
    const supabase = await createClient();
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          isSuperadmin: false,
        },
      },
    });

    if (authError) {
      return { user: null, error: authError.message };
    }

    // Create user in database
    const user = await prisma.admin.create({
      data: {
        email,
        name,
        password: "", // We don't store the actual password
        sectors: {
          create: [{ sector: { connect: { id: parseInt(sectorId) } } }],
        },
      },
      include: { sectors: true },
    });

    revalidatePath("/", "layout");
    return { user, error: null };
  } catch (error) {
    return {
      user: null,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function handleLogout() {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    revalidatePath("/", "layout");
    redirect("/login");
  } catch (error) {
    redirect(
      `/error?message=${encodeURIComponent(
        error instanceof Error ? error.message : "An unexpected error occurred",
      )}`,
    );
  }
}
