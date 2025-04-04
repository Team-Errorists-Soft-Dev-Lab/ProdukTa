import { prisma } from "@/utils/prisma/client";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { sectorName: string } },
) {
  try {
    const { sectorName } = params;

    // Find the sector by name
    const sector = await prisma.sector.findFirst({
      where: {
        name: {
          equals: sectorName,
          mode: "insensitive", // Case insensitive search
        },
      },
    });

    if (!sector) {
      return NextResponse.json(
        { message: "Sector not found" },
        { status: 404 },
      );
    }

    const totalExports = await prisma.exportLog.count({
      where: {
        MSME: {
          sectorId: sector.id,
        },
      },
    });

    const mostExportedMSME = await prisma.exportLog.groupBy({
      by: ["msmeId"],
      _count: { msmeId: true },
      where: {
        MSME: {
          sectorId: sector.id,
        },
      },
      orderBy: {
        _count: {
          msmeId: "desc",
        },
      },
      take: 1,
    });

    if (mostExportedMSME.length === 0 || mostExportedMSME[0] === undefined) {
      return new NextResponse(JSON.stringify({ message: "No MSME found" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Fetch detailed MSME data
    const msmeDetails = await prisma.mSME.findUnique({
      where: {
        id: mostExportedMSME[0].msmeId,
      },
    });

    const result = {
      msmeDetails,
      exportCount: mostExportedMSME[0]._count.msmeId,
      totalExports,
    };

    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch visitor data" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
