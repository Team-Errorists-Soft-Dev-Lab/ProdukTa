import { prisma } from "@/utils/prisma/client";
import { createClient } from "@/utils/supabase/server";
import { z } from "zod";

const RequestSchema = z.object({
  adminId: z.number(),
});

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown;
    const { adminId } = RequestSchema.parse(body);

    // Update admin in database
    const admin = await prisma.admin.update({
      where: { id: adminId },
      data: { isPending: false },
    });

    if (!admin) {
      return Response.json({ error: "Admin not found" }, { status: 404 });
    }

    // Update Supabase user metadata
    const supabase = await createClient();
    await supabase.auth.admin.updateUserById(admin.email, {
      user_metadata: { isApproved: true },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error approving admin:", error);
    if (error instanceof z.ZodError) {
      return Response.json({ error: "Invalid request data" }, { status: 400 });
    }
    return Response.json({ error: "Failed to approve admin" }, { status: 500 });
  }
}
