import { prisma } from "@/utils/prisma/client";
import { NextResponse } from "next/server";
import type { MSME } from "@/types/MSME";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const body = (await request.json()) as MSME;
    const updatedMSME = await prisma.mSME.update({
      where: { id: Number(params.id) },
      data: {
        ...body,
        longitude: body.longitude ?? 0,
        latitude: body.latitude ?? 0,
      },
    });

    return NextResponse.json(updatedMSME);
  } catch (error) {
    console.error("Error updating MSME:", error);
    return NextResponse.json(
      { error: "Failed to update MSME" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    await prisma.mSME.delete({
      where: { id: Number(params.id) },
    });

    return NextResponse.json(null);
  } catch (error) {
    console.error("Error deleting MSME:", error);
    return NextResponse.json(
      { error: "Failed to delete MSME" },
      { status: 500 },
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const msme = await prisma.mSME.findUnique({
      where: { id: Number(params.id) },
      include: {
        sectors: true,
      },
    });

    if (!msme) {
      return NextResponse.json({ error: "MSME not found" }, { status: 404 });
    }

    const response = {
      ...msme,
      sectorName: msme.sectors.name,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching MSME:", error);
    return NextResponse.json(
      { error: "Failed to fetch MSME" },
      { status: 500 },
    );
  }
}
