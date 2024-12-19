import { prisma } from "@/utils/prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const msmes = await prisma.mSME.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedMSMEs = msmes.map((msme) => ({
      id: msme.id,
      companyName: msme.companyName,
      companyDescription: msme.companyDescription,
      companyLogo: msme.companyLogo,
      contactPerson: msme.contactPerson,
      contactNumber: msme.contactNumber,
      email: msme.email,
      provinceAddress: msme.provinceAddress,
      cityMunicipalityAddress: msme.cityMunicipalityAddress,
      barangayAddress: msme.barangayAddress,
      yearEstablished: msme.yearEstablished,
      dti_number: msme.dti_number,
      sectorId: msme.sectorId,
      createdAt: msme.createdAt,
    }));

    return NextResponse.json({ msmes: formattedMSMEs });
  } catch (error) {
    console.error("Error fetching MSMEs:", error);
    return NextResponse.json(
      { error: "Failed to fetch MSMEs" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newMSME = await prisma.mSME.create({
      data: body,
    });

    return NextResponse.json(newMSME, { status: 201 });
  } catch (error) {
    console.error("Error creating MSME:", error);
    return NextResponse.json(
      { error: "Failed to create MSME" },
      { status: 500 },
    );
  }
}
