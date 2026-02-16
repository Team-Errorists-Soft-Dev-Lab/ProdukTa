import { prisma } from "@/utils/prisma/client";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const page = Number(url.searchParams.get("page"));

    if (isNaN(page) || page < 1) {
      return Response.json({ error: "Invalid page number" }, { status: 400 });
    }
    const pageSize = 15;
    const offset = (page - 1) * pageSize;

    const isDescending = url.searchParams.get("desc") === "true";
    const municipalitiesParams = url.searchParams.get("municipalities");
    const municipalitiesSelected = municipalitiesParams
      ?.split(",")
      .filter(Boolean);

    // NEW: Get sectors param as comma-separated string
    const sectorsParam = url.searchParams.get("sectors");
    const selectedSectors = sectorsParam
      ? sectorsParam.split(",").filter(Boolean)
      : [];

    // Find all matching sector IDs (case-insensitive)
    let sectorIds: number[] = [];
    if (selectedSectors.length > 0) {
      // Fetch all sectors and do case-insensitive matching
      const allSectors = await prisma.sector.findMany({
        select: { id: true, name: true },
      });

      const selectedSectorsLower = selectedSectors.map((s) => s.toLowerCase());
      const sectorRecords = allSectors.filter((s) =>
        selectedSectorsLower.includes(s.name.toLowerCase()),
      );
      sectorIds = sectorRecords.map((s) => s.id);

      if (sectorIds.length === 0) {
        return Response.json({
          msmes: [],
          meta: {
            totalItems: 0,
            currentPage: page,
            totalPages: 0,
            itemsPerPage: pageSize,
            hasNextPage: false,
            hasPreviousPage: false,
          },
        });
      }
    }

    // Build where clause
    const where: {
      sectorId?: { in: number[] };
      cityMunicipalityAddress?: { in: string[]; mode: "insensitive" };
    } = {};
    if (sectorIds.length > 0) where.sectorId = { in: sectorIds };
    if (municipalitiesSelected && municipalitiesSelected.length > 0) {
      where.cityMunicipalityAddress = {
        in: municipalitiesSelected,
        mode: "insensitive",
      };
    }

    const [result, totalMSMEs] = await Promise.all([
      prisma.mSME.findMany({
        where: {
          ...where,
        },
        orderBy: { companyName: isDescending ? "desc" : "asc" },
        take: pageSize,
        skip: offset,
      }),
      prisma.mSME.count({ where }),
    ]);

    const totalPages = Math.ceil(totalMSMEs / pageSize);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    if (page > totalPages) {
      return Response.json({
        msmes: [],
        meta: {
          totalItems: totalMSMEs,
          currentPage: page,
          totalPages,
          itemsPerPage: pageSize,
          hasNextPage: false,
          hasPreviousPage: page > 1,
        },
      });
    }

    return Response.json({
      msmes: result,
      meta: {
        totalItems: totalMSMEs,
        currentPage: page,
        totalPages,
        itemsPerPage: pageSize,
        hasNextPage,
        hasPreviousPage,
      },
    });
  } catch (error) {
    console.error("Error fetching MSMEs by sector:", error);
    return Response.json(
      { error: "Failed to fetch MSMEs by sector" },
      { status: 500 },
    );
  }
}
