import { prisma } from "@/utils/prisma/client";
import { NextResponse } from "next/server";
import type { MSME } from "@/types/MSME";

type MSMECreateInput = Omit<MSME, "longitude" | "latitude"> & {
  longitude: number;
  latitude: number;
};

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const ids = url.searchParams.get("ids");

    if (!ids) {
      return NextResponse.json({ error: "No IDs provided" }, { status: 400 });
    }

    const idArray = ids.split(",").map((id) => parseInt(id, 10));

    const msmes = await prisma.mSME.findMany({
      where: {
        id: {
          in: idArray,
        },
      },
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
  const body = (await request.json()) as MSMECreateInput;
  try {
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
