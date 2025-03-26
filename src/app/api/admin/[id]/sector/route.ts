import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma/client";

interface Props {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: Props) {
  try {
    const adminId = parseInt(params.id);

    if (isNaN(adminId)) {
      return NextResponse.json({ error: "Invalid admin ID" }, { status: 400 });
    }

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

    return NextResponse.json({ sector: adminSector.sector }, { status: 200 });
  } catch (error) {
    console.error("Error fetching admin sector:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin sector" },
      { status: 500 },
    );
  }
}
