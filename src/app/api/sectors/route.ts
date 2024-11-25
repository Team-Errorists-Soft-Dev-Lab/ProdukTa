import { prisma } from "@/utils/prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sectors = await prisma.sector.findMany({
      include: {
        _count: {
          select: {
            MSMEs: true,
          },
        },
        admins: {
          where: {
            admin: {
              isPending: false,
            },
          },
        },
      },
    });

    const formattedSectors = sectors.map((sector) => ({
      id: sector.id,
      name: sector.name,
      adminCount: sector.admins.length,
      msmeCount: sector._count.MSMEs,
    }));

    return NextResponse.json({ sectors: formattedSectors });
  } catch (error) {
    console.error("Error fetching sectors:", error);
    return NextResponse.json(
      { error: "Failed to fetch sectors" },
      { status: 500 },
    );
  }
}
