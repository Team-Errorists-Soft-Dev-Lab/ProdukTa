import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/utils/prisma/client";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user: supabaseUser },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error("Auth error:", error);
      return Response.json({ user: null });
    }

    if (!supabaseUser?.email) {
      return Response.json({ user: null });
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
      return Response.json({ user: null });
    }

    return Response.json({
      user: {
        ...user,
        role: user.isSuperadmin ? "superadmin" : "admin",
      },
    });
  } catch (error) {
    console.error("Auth error:", error);
    return Response.json({ user: null });
  }
}
