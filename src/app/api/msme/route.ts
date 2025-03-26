import { prisma } from "@/utils/prisma/client";
import { NextResponse } from "next/server";
import type { MSME } from "@/types/MSME";

export async function GET() {
  try {
    const msmes = await prisma.mSME.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ msmes });
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
    const body = (await request.json()) as MSME;
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
