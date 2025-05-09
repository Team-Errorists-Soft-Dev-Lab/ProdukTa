import { prisma } from "@/utils/prisma/client";
import { type MSME } from "@/types/MSME";

export async function GET(
  req: Request,
  { params }: { params: { sectorName: string; page: number } },
) {
  try {
    const sector = params.sectorName;
    const page = params.page;
    console.log("Sector Name:", sector);
    if (!sector) {
      return Response.json({ error: "Sector is required" }, { status: 400 });
    }

    const pageSize = 15;
    const offset = (page - 1) * pageSize;

    const getSector = await prisma.sector.findFirst({
      where: {
        name: {
          equals: sector,
          mode: "insensitive",
        },
      },
    });

    // get all MSMEs from a specific sector
    const result = (await prisma.mSME.findMany({
      where: {
        sectorId: {
          equals: getSector?.id,
        },
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

    const totalMSMEs = await prisma.mSME.count({
      where: {
        sectorId: {
          equals: getSector?.id,
        },
      },
    });

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

    if (totalMSMEs === 0) {
      return Response.json({
        msmes: [],
        meta: {
          totalItems: 0,
          currentPage: 1,
          totalPages: 0,
          itemsPerPage: pageSize,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      });
    }

    if (offset >= totalMSMEs) {
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
    console.error(error);
    return Response.json({ error: "Failed to fetch visitor data" });
  }
}
