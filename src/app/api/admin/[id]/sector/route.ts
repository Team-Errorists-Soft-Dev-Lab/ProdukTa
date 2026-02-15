import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma/client";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: idParam } = await params;

    if (!idParam || isNaN(parseInt(idParam))) {
      return NextResponse.json(
        { error: "Invalid or missing admin ID" },
        { status: 400 },
      );
    }

    const adminId = parseInt(idParam);

    const adminSector = await prisma.adminSectors.findFirst({
      where: {
        adminId: adminId,
      },
      include: {
        sector: true,
      },
    });

    console.log("admin sector: ", adminSector);

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
