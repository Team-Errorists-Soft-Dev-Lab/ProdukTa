import { prisma } from "@/utils/prisma/client";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ msmeName: string }> },
) {
  try {
    const { msmeName } = await params;

    // Input validation
    if (!msmeName || typeof msmeName !== "string") {
      return NextResponse.json(
        { error: "Invalid search parameter" },
        { status: 400 },
      );
    }

    // Sanitize the search term
    const searchTerm = decodeURIComponent(msmeName.trim());
    if (searchTerm.length < 2) {
      return NextResponse.json(
        { error: "Search term must be at least 2 characters long" },
        { status: 400 },
      );
    }

    // Search by company name
    const msme = await prisma.mSME.findMany({
      where: {
        companyName: {
          contains: searchTerm,
          mode: "insensitive", // Case-insensitive search
        },
      },
      orderBy: {
        companyName: "asc",
      },
      take: 20, // Limit results for performance
    });

    return NextResponse.json(msme);
  } catch (error) {
    console.error("Error searching MSMEs:", error);
    return NextResponse.json(
      {
        error: "Failed to search MSMEs",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
