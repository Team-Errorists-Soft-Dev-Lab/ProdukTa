import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/utils/prisma/client";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error("Session error:", error);
      return Response.json({ user: null });
    }

    if (!session?.user?.email) {
      return Response.json({ user: null });
    }

    const user = await prisma.admin.findUnique({
      where: { email: session.user.email },
      include: { sectors: true },
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
    console.error("Session error:", error);
    return Response.json({ user: null });
  }
}
