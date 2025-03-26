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

    // Transform the response to flatten the sectors data
    const transformedAdmins = admins.map((admin) => ({
      ...admin,
      sectors: admin.sectors.map((s) => s.sector),
    }));

    return NextResponse.json({ admins: transformedAdmins });
  } catch (error) {
    console.error("Error fetching active admins:", error);
    return NextResponse.json(
      { error: "Failed to fetch active admins" },
      { status: 500 },
    );
  }
}
