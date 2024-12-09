import { prisma } from "@/utils/prisma/client";
import { createClient } from "@/utils/supabase/server";
import { z } from "zod";

const RequestSchema = z.object({
  adminId: z.number(),
});

export async function DELETE(request: Request) {
  try {
    const body = (await request.json()) as unknown;
    const { adminId } = RequestSchema.parse(body);

    // Get admin details before deletion for Supabase cleanup
    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!admin) {
      return Response.json({ error: "Admin not found" }, { status: 404 });
    }

    // Delete admin from database
    await prisma.admin.delete({
      where: { id: adminId },
    });

    // Delete user from Supabase
    const supabase = await createClient();
    await supabase.auth.admin.deleteUser(admin.email);

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting admin:", error);
    if (error instanceof z.ZodError) {
      return Response.json({ error: "Invalid request data" }, { status: 400 });
    }
    return Response.json({ error: "Failed to delete admin" }, { status: 500 });
  }
}
