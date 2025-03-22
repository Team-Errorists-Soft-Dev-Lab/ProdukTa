import { prisma } from "@/utils/prisma/client";

export async function GET(
  req: Request,
  { params }: { params: { sectorId: string } },
) {
  try {
    const msmeSector = parseInt(params.sectorId);
    // Fetch MSMEs that belong to the specified sector
    const msmesInSector = await prisma.mSME.findMany({
      where: { sectorId: msmeSector },
      select: { id: true },
    });

    const msmeIds = msmesInSector.map((msme) => msme.id);

    // Group visitors by MSME ID and filter by the specified sector
    const topMSMEs = await prisma.visitor.groupBy({
      by: ["msmeId"],
      where: { msmeId: { in: msmeIds } },
      _count: { msmeId: true },
      orderBy: {
        _count: { msmeId: "desc" },
      },
      take: 10,
    });

    const msmeData = await prisma.mSME.findMany({
      where: { id: { in: topMSMEs.map((msme) => msme.msmeId) } },
    });

    const results = topMSMEs.map((msme) => ({
      msmeId: msme.msmeId,
      visitCount: msme._count.msmeId,
      ...msmeData.find((m) => m.id === msme.msmeId),
    }));

    return Response.json({ results });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to fetch visitor data" });
  }
}
