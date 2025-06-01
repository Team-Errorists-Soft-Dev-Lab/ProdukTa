import { prisma } from "@/utils/prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const pendingAdmins = await prisma.admin.findMany({
      where: {
        isPending: true,
      },
      include: {
        sectors: {
          include: {
            sector: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    const formattedAdmins = pendingAdmins.map((admin) => ({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      sector: admin.sectors[0]?.sector.name ?? "Unknown",
      dateApplied: admin.createdAt.toLocaleDateString(),
      status: "pending" as const,
    }));

    return NextResponse.json({
      pendingAdmins: formattedAdmins,
      count: formattedAdmins.length,
    });
  } catch (error) {
    console.error("Error fetching pending admins:", error);
    return NextResponse.json(
      { error: "Failed to fetch pending admins" },
      { status: 500 },
    );
  }
}
