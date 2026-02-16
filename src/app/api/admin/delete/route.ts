import { prisma } from "@/utils/prisma/client";
import { createClient } from "@/utils/supabase/server";
import { z } from "zod";
import { NextResponse } from "next/server";

const RequestSchema = z.object({
  adminId: z.string(),
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
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    // Delete admin from database
    await prisma.admin.delete({
      where: { id: adminId },
    });

    // Delete user from Supabase
    const supabase = await createClient();
    await supabase.auth.admin.deleteUser(admin.email);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting admin:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Failed to delete admin" },
      { status: 500 },
    );
  }
}
