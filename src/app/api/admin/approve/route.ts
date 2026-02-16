import { prisma } from "@/utils/prisma/client";
import { createClient } from "@/utils/supabase/server";
import { z } from "zod";
import nodemailer from "nodemailer";
// import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

const RequestSchema = z.object({
  adminId: z.string(),
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
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
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
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Admin Access Approved</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              border-bottom: 2px solid #4a5568;
              padding-bottom: 15px;
              margin-bottom: 20px;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              color: #2d3748;
            }
            .content {
              padding: 20px 0;
            }
            .footer {
              margin-top: 30px;
              padding-top: 15px;
              border-top: 1px solid #e2e8f0;
              font-size: 14px;
              color: #718096;
            }
            .button {
              display: inline-block;
              background-color: #4a5568;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 4px;
              font-weight: bold;
              margin: 20px 0;
            }
            .highlight {
              background-color: #f7fafc;
              border-left: 4px solid #4a5568;
              padding: 15px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          
          <div class="content">
            <h2>Administrative Access Approval</h2>
            
            <p>Dear ${admin.name},</p>
            
            <p>We are pleased to inform you that your request for administrative access has been formally approved and activated in our system.</p>
            
            <div class="highlight">
              <p><strong>Your administrative privileges are now active.</strong></p>
              <p>You may now access your administrative dashboard to manage your account and utilize the full range of administrative functions available to you.</p>
            </div>
            
            <p>To begin utilizing your administrative capabilities:</p>
            <ol>
              <li>Log in to your account using your credentials</li>
              <li>Navigate to the administrative dashboard</li>
              <li>Explore the various management tools and features now available to you</li>
            </ol>
            
            <p>Should you require any assistance or have inquiries regarding your administrative functions, please do not hesitate to contact our technical support team.</p>
          </div>
          
          <div class="footer">
            <p>With regards,</p>
            <p><strong>Produk'Ta Superadmin</strong></p>
            <p>This is an automated message. Please do not reply directly to this email.</p>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);

    await revalidatePath("/superadmin/admins", "page");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error approving admin:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Failed to approve admin" },
      { status: 500 },
    );
  }
}

async function revalidatePath(path: string, type: string) {
  try {
    console.log(`Revalidating ${type} at path: ${path}`);
  } catch (error) {
    console.error(`Failed to revalidate ${type} at path: ${path}`, error);
  }
}
