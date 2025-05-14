import { prisma } from "@/utils/prisma/client";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { page: string } },
) {
  try {
    // Validate the page parameter
    if (!params?.page || isNaN(parseInt(params.page))) {
      return NextResponse.json({ error: "Invalid page ID" }, { status: 400 });
    }

    const page = parseInt(params.page);
    const pageSize = 15;
    const offset = (page - 1) * pageSize;

    // Parse query parameters
    const url = new URL(request.url);
    const isDescending = url.searchParams.get("desc") === "true";
    const municipalitiesParams = url.searchParams.get("municipalities");
    const municipalitiesSelected = municipalitiesParams
      ?.split(",")
      .filter(Boolean);

    // Fetch MSMEs with sorting and municipality filtering
    const [msmes, totalMSMEs] = await Promise.all([
      prisma.mSME.findMany({
        where: {
          cityMunicipalityAddress: {
            in: municipalitiesSelected,
            mode: "insensitive",
          },
        },
        orderBy: {
          companyName: isDescending ? "desc" : "asc",
        },
        skip: offset,
        take: pageSize,
      }),
      prisma.mSME.count({
        where: {
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

    // Handle cases where the page exceeds total pages
    if (page > totalPages) {
      return NextResponse.json({
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

    // Handle cases where there are no MSMEs
    if (totalMSMEs === 0) {
      return NextResponse.json({
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

    return NextResponse.json({
      msmes,
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
    console.error("Error fetching MSMEs:", error);
    return NextResponse.json(
      { error: "Failed to fetch MSMEs" },
      { status: 400 },
    );
  }
}
