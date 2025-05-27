"use server";

import { prisma } from "@/utils/prisma/client";

type MsmeInitialData = {
  cityMunicipalityAddress: string | null;
  yearEstablished: number | null;
  sectorid: number | null;
};

export async function fetchMsmeInitialData(
  msmeId: string | number,
): Promise<MsmeInitialData | null> {
  try {
    const id = typeof msmeId === "string" ? parseInt(msmeId, 10) : msmeId;

    const data = await prisma.mSME.findUnique({
      where: { id },
      select: {
        cityMunicipalityAddress: true,
        yearEstablished: true,
        sectorId: true, // Include sectorId for superadmin use
      },
    });

    if (!data) return null;

    return {
      cityMunicipalityAddress: data.cityMunicipalityAddress || null,
      yearEstablished: data.yearEstablished || null,
      sectorid: data.sectorId || null,
    };
  } catch (error) {
    console.error("Error fetching MSME initial data:", error);
    return null;
  }
}
