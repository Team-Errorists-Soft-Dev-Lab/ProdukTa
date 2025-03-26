import { prisma } from "@/utils/prisma/client";
import { createClient } from "@/utils/supabase/server";
import { z } from "zod";
import nodemailer from "nodemailer";
import { revalidatePath } from "next/cache";

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

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: admin.email,
      subject: "Your Admin Access Has Been Approved 🎉",
      html: `
    <h1>Dear ${admin.name},</h1>
    <p>We’re pleased to inform you that your request for admin access has been approved! You can now log in and manage your account with full administrative privileges.</p>
    <p>To get started, log in to your account and explore the available features.</p>
    <p>If you have any questions or need assistance, feel free to reach out.</p>
    <p>Best regards,</p>
    <p><strong>The Produkta Team</strong></p>
  `,
    };

    await transporter.sendMail(mailOptions);

    revalidatePath("/superadmin/admins", "page");

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error approving admin:", error);
    if (error instanceof z.ZodError) {
      return Response.json({ error: "Invalid request data" }, { status: 400 });
    }
    return Response.json({ error: "Failed to approve admin" }, { status: 500 });
  }
}
