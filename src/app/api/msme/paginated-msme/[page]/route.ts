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

    // Check for the optional "desc" query parameter
    const url = new URL(request.url);
    const isDescending = url.searchParams.get("desc") === "true";

    // Fetch MSMEs with sorting based on the "desc" parameter
    const msmes = await prisma.mSME.findMany({
      orderBy: {
        companyName: isDescending ? "desc" : "asc", // Sort by companyName
      },
      skip: offset,
      take: pageSize,
    });

    const totalMSMEs = await prisma.mSME.count();
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
