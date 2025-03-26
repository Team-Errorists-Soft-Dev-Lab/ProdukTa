import { type NextRequest } from "next/server";
import { prisma } from "@/utils/prisma/client";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.admin.findUnique({
      where: { email },
      include: {
        sectors: {
          include: {
            sector: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
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
    console.error("User fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
