import { prisma } from "@/utils/prisma/client";
import { NextResponse } from "next/server";

interface ISector {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ sectorName: string }> },
) {
  try {
    const { sectorName } = await params;

    const sectors: ISector[] = await prisma.sector.findMany();

    let normalizedSector = "";

    if (sectorName) {
      for (const sector of sectors) {
        const normalizedInput = sectorName.toLowerCase().replace(/[\s-_]/g, "");
        const normalizedSectorName = sector.name
          .toLowerCase()
          .replace(/[\s-_]/g, "");
        if (normalizedInput === normalizedSectorName) {
          normalizedSector = sector.name;
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
