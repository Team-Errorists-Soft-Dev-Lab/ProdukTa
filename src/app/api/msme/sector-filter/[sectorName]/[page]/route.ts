import { prisma } from "@/utils/prisma/client";
import { type MSME } from "@/types/MSME";

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

    // Check for the optional "desc" query parameter
    const url = new URL(req.url);
    const isDescending = url.searchParams.get("desc") === "true";

    // Find the sector by name
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

    // Fetch MSMEs for the sector with sorting
    const result = (await prisma.mSME.findMany({
      where: {
        sectorId: {
          equals: getSector.id,
        },
      },
      orderBy: {
        companyName: isDescending ? "desc" : "asc", // Sort by companyName
      },
      take: pageSize,
      skip: offset,
    })) as MSME[];

    if (!result || result.length === 0) {
      return Response.json(
        { error: "No MSMEs found for this sector" },
        { status: 404 },
      );
    }

    // Count total MSMEs for the sector
    const totalMSMEs = await prisma.mSME.count({
      where: {
        sectorId: {
          equals: getSector.id,
        },
      },
    });

    const totalPages = Math.ceil(totalMSMEs / pageSize);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    // Handle cases where the page exceeds total pages
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
