"use server";

import { prisma } from "@/utils/prisma/client";

type MsmeInitialData = {
  cityMunicipalityAddress: string | null;
  yearEstablished: number | null;
};

/**
 * Fetches only city/municipality and year established from an MSME
 * for fast initial form load
 */
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
      },
    });

    if (!data) return null;

    return {
      cityMunicipalityAddress: data.cityMunicipalityAddress || null,
      yearEstablished: data.yearEstablished || null,
    };
  } catch (error) {
    console.error("Error fetching MSME initial data:", error);
    return null;
  }
}
