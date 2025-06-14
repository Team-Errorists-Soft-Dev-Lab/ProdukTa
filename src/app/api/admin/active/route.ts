import { prisma } from "@/utils/prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const admins = await prisma.admin.findMany({
      where: {
        isPending: false,
        isSuperadmin: false,
      },
      include: {
        sectors: {
          include: {
            sector: true,
          },
        },
      },
    });

    if (!admins || admins.length === 0) {
      console.error("No active admins found");
      return NextResponse.json(
        { error: "No active admins found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ admins });
  } catch (error) {
    console.error("Error fetching active admins:", error);
    return NextResponse.json(
      { error: "Failed to fetch active admins" },
      { status: 500 },
    );
  }
}
