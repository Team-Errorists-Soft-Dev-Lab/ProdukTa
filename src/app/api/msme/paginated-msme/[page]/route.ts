import { prisma } from "@/utils/prisma/client";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { page: string } },
) {
  // get only the first 15 items per page
  try {
    if (!params?.page || isNaN(parseInt(params.page))) {
      return NextResponse.json({ error: "Invalid page ID" }, { status: 400 });
    }

    const page = parseInt(params.page);
    const pageSize = 15;
    const offset = (page - 1) * pageSize;
    const msmes = await prisma.mSME.findMany({
      orderBy: {
        createdAt: "desc",
      },
      skip: offset,
      take: pageSize,
    });

    const totalMSMEs = await prisma.mSME.count();
    const totalPages = Math.ceil(totalMSMEs / pageSize);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;
    const hasMore = hasNextPage || hasPreviousPage;
    const hasLess = totalMSMEs > pageSize && page < totalPages;

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

    if (offset >= totalMSMEs) {
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
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch MSMEs" },
      { status: 400 },
    );
  }
}
