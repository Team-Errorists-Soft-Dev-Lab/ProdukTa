import { prisma } from "@/utils/prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // fetch the total count of MSMEs per sector
    const msmes = await prisma.mSME.groupBy({
      by: ["sectorId"],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
    });

    // format the response to include sector names
    const msmesWithSectorName = await Promise.all(
      msmes.map(async (msme) => {
        const sector = await prisma.sector.findUnique({
          where: { id: msme.sectorId },
        });
        return {
          sectorId: msme.sectorId,
          count: msme._count.id,
          sectorName: sector?.name || "Unknown",
        };
      }),
    );

    // fetch the top 5 msmes per sector
    const topMSMEs = await Promise.all(
      msmesWithSectorName.map(async (msme) => {
        const topMSMEs = await prisma.mSME.findMany({
          where: { sectorId: msme.sectorId },
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
        });
        return {
          ...msme,
          topMSMEs,
        };
      }),
    );
    // format the response
    const formattedMSMEs = topMSMEs.map((msme) => ({
      sectorId: msme.sectorId,
      count: msme.count,
      sectorName: msme.sectorName,
      topMSMEs: msme.topMSMEs.map((topMSME) => ({
        id: topMSME.id,
        name: topMSME.companyName,
        address: topMSME.cityMunicipalityAddress,
        createdAt: topMSME.createdAt,
      })),
    }));

    return NextResponse.json({ formattedMSMEs });
  } catch (error) {
    console.error("Error fetching MSMEs:", error);
    return NextResponse.json(
      { error: "Failed to fetch MSMEs" },
      { status: 500 },
    );
  }
}
