import { prisma } from "@/utils/prisma/client";
import { NextResponse } from "next/server";
export async function GET(
  req: Request,
  { params }: { params: { sectorName: string } },
) {
  try {
    const { sectorName } = params;

    const sectors = [
      "Bamboo",
      "Coffee",
      "Cacao",
      "Coconut",
      "Processed Foods",
      "IT - BPM",
      "Wearables and Homestyles",
    ];

    let normalizedSector = "";

    if (sectorName) {
      for (const sector of sectors) {
        const normalizedInput = sectorName.toLowerCase().replace(/[\s-_]/g, "");
        const normalizedSectorName = sector
          .toLowerCase()
          .replace(/[\s-_]/g, "");
        if (normalizedInput === normalizedSectorName) {
          normalizedSector = sector;
          break;
        }
      }
    }

    const sector = await prisma.sector.findFirst({
      where: {
        name: {
          equals: normalizedSector,
          mode: "insensitive",
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

    const exportCountsByMonth = await prisma.exportLog.groupBy({
      by: ["exportedAt"],
      _count: {
        id: true,
      },
      where: {
        MSME: {
          sectorId: sector.id,
        },
      },
      orderBy: {
        exportedAt: "asc",
      },
    });

    const monthlyExportCounts = exportCountsByMonth.reduce(
      (acc, log) => {
        const month = log.exportedAt.toISOString().slice(0, 7);
        acc[month] = (acc[month] || 0) + log._count.id;
        return acc;
      },
      {} as Record<string, number>,
    );

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
      monthlyExportCounts,
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
