import { prisma } from "@/utils/prisma/client";

interface ISector {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function GET(
  req: Request,
  { params }: { params: { sectorName: string } },
) {
  try {
    const { sectorName } = params;

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
      select: { id: true },
    });

    if (!sector) {
      return Response.json({ error: "Sector not found" }, { status: 404 });
    }

    const msmesInSector = await prisma.mSME.findMany({
      where: { sectorId: sector.id },
      select: { id: true },
    });

    const msmeIds = msmesInSector.map((msme) => msme.id);

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
      msmeData: {
        ...msmeData.find((m) => m.id === msme.msmeId),
      },
    }));

    return Response.json({ results });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to fetch visitor data" });
  }
}
