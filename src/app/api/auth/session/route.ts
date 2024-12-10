import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/utils/prisma/client";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user: supabaseUser },
    error,
  } = await supabase.auth.getUser();

  if (error?.name === "AuthSessionMissingError" || !supabaseUser?.email) {
    return Response.json({ user: null });
  }

  if (error) {
    console.error("Unexpected auth error:", error);
    return Response.json({ user: null });
  }

  try {
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
      return Response.json({ user: null });
    }

    return Response.json({
      user: {
        ...user,
        role: user.isSuperadmin ? "superadmin" : "admin",
      },
    });
  } catch (error) {
    console.error("Database error:", error);
    return Response.json({ user: null });
  }
}
