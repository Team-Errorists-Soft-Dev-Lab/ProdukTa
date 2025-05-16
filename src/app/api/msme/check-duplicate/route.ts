import { prisma } from "@/utils/prisma/client";
import { NextResponse } from "next/server";

interface CheckDuplicateRequest {
  companyName: string;
  dtiNumber: string;
  currentMsmeId?: number; // Optional ID to exclude from duplicate check
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CheckDuplicateRequest;
    const { companyName, dtiNumber, currentMsmeId } = body;

    // Check for duplicate company name
    const existingCompanyName = await prisma.mSME.findFirst({
      where: {
        companyName: {
          equals: companyName,
          mode: "insensitive", // Case-insensitive comparison
        },
        id: {
          not: currentMsmeId, // Exclude current MSME if ID is provided
        },
      },
    });

    // Check for duplicate DTI number
    const existingDTINumber = await prisma.mSME.findFirst({
      where: {
        dti_number: parseInt(dtiNumber, 10),
        id: {
          not: currentMsmeId, // Exclude current MSME if ID is provided
        },
      },
    });

    return NextResponse.json({
      isDuplicateCompanyName: !!existingCompanyName,
      isDuplicateDTINumber: !!existingDTINumber,
    });
  } catch (error) {
    console.error("Error checking duplicates:", error);
    return NextResponse.json(
      { error: "Failed to check for duplicates" },
      { status: 500 },
    );
  }
}
