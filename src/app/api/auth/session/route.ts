import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/utils/prisma/client";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user: supabaseUser },
      error: supabaseError,
    } = await supabase.auth.getUser();

    if (
      supabaseError?.name === "AuthSessionMissingError" ||
      !supabaseUser?.email
    ) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    if (supabaseError) {
      console.error("Unexpected auth error:", supabaseError);
      return NextResponse.json(
        { error: "Authentication failed" },
        { status: 401 },
      );
    }

    const user = await prisma.admin.findUnique({
      where: { email: supabaseUser.email },
      include: {
        sectors: {
          include: {
            sector: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json(
      {
        user: {
          ...user,
          role: user.isSuperadmin ? "superadmin" : "admin",
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
