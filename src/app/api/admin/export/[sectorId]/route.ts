import { prisma } from "@/utils/prisma/client";

export async function GET(
  req: Request,
  { params }: { params: { sectorId: string } },
) {
  try {
    const totalExports = await prisma.exportLog.count({
      where: {
        MSME: {
          sectorId: parseInt(params.sectorId),
        },
      },
    });

    const sectorId = parseInt(params.sectorId);
    const mostExportedMSME = await prisma.exportLog.groupBy({
      by: ["msmeId"],
      _count: { msmeId: true },
      where: {
        MSME: {
          sectorId: sectorId,
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
      return { message: "No exports found for this sector." };
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
