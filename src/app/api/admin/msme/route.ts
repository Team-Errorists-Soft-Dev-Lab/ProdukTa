import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/utils/prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user: supabaseUser },
    error,
  } = await supabase.auth.getUser();

  if (error?.name === "AuthSessionMissingError" || !supabaseUser?.email) {
    return Response.json({ user: null });
  }

  if (error) {
    console.error("Unexpected auth error:", error);
    return Response.json({ user: null });
  }

  try {
    const msmes = await prisma.admin.findUnique({
      where: { email: supabaseUser.email },
      include: {
        sectors: {
          include: {
            sector: {
              include: {
                MSMEs: true,
              },
            },
          },
        },
      },
    });

    if (!msmes) {
      return Response.json({ msme: null });
    }

    const formattedMSMEs = msmes.sectors.flatMap((sector) =>
      sector.sector.MSMEs.map((msme: any) => ({
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
      })),
    );
    return NextResponse.json({ msmes: formattedMSMEs });
  } catch (error) {
    console.error("Error fetching MSMEs:", error);
    return NextResponse.json(
      { error: "Failed to fetch MSMEs" },
      { status: 500 },
    );
  }
}
