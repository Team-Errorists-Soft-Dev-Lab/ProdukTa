import { type NextRequest } from "next/server";
import { prisma } from "@/utils/prisma/client";

interface RequestBody {
  email: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RequestBody;

    if (!body.email) {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.admin.findUnique({
      where: { email: body.email },
      include: { sectors: true },
    });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({
      user: {
        ...user,
        role: user.isSuperadmin ? "superadmin" : "admin",
      },
    });
  } catch (error) {
    console.error("User fetch error:", error);
    return Response.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}
