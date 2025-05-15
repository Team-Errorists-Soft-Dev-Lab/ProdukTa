import { prisma } from "@/utils/prisma/client";

export async function GET(
  req: Request,
  { params }: { params: { sectorName: string; page: number } },
) {
  try {
    const sector = params.sectorName;
    const page = parseInt(params.page as unknown as string, 10);

    if (!sector) {
      return Response.json({ error: "Sector is required" }, { status: 400 });
    }

    if (isNaN(page) || page < 1) {
      return Response.json({ error: "Invalid page number" }, { status: 400 });
    }

    const pageSize = 15;
    const offset = (page - 1) * pageSize;

    const url = new URL(req.url);
    const isDescending = url.searchParams.get("desc") === "true";
    const municipalitiesParams = url.searchParams.get("municipalities");
    const municipalitiesSelected = municipalitiesParams
      ?.split(",")
      .filter(Boolean);

    const getSector = await prisma.sector.findFirst({
      where: {
        name: {
          equals: sector,
          mode: "insensitive",
        },
      },
    });

    if (!getSector) {
      return Response.json({ error: "Sector not found" }, { status: 404 });
    }

    const [result, totalMSMEs] = await Promise.all([
      prisma.mSME.findMany({
        where: {
          sectorId: { equals: getSector.id },
          cityMunicipalityAddress: {
            in: municipalitiesSelected,
            mode: "insensitive",
          },
        },
        orderBy: { companyName: isDescending ? "desc" : "asc" },
        take: pageSize,
        skip: offset,
      }),
      prisma.mSME.count({
        where: {
          sectorId: { equals: getSector.id },
          cityMunicipalityAddress: {
            in: municipalitiesSelected,
            mode: "insensitive",
          },
        },
      }),
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
