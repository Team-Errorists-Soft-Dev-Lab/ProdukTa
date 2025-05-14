import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma/client";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    if (!params?.id || isNaN(parseInt(params.id))) {
      return NextResponse.json(
        { error: "Invalid or missing admin ID" },
        { status: 400 },
      );
    }

    const adminId = parseInt(params.id);

    const adminSector = await prisma.adminSectors.findFirst({
      where: {
        adminId: adminId,
      },
      include: {
        sector: true,
      },
    });

    if (!adminSector) {
      return NextResponse.json(
        { error: "No sector found for this admin" },
        { status: 404 },
      );
    }

    return NextResponse.json({ sector: adminSector.sector });
  } catch (error) {
    console.error("Error fetching admin sector:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin sector" },
      { status: 500 },
    );
  }
}
