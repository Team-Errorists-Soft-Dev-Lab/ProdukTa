import { prisma } from "@/utils/prisma/client";

export async function GET() {
  try {
    const admins = await prisma.admin.findMany({
      where: {
        isPending: false,
        isSuperadmin: false,
      },
      include: {
        sectors: {
          include: {
            sector: true,
          },
        },
      },
    });

    return Response.json({ admins });
  } catch (error) {
    console.error("Error fetching active admins:", error);
    return Response.json(
      { error: "Failed to fetch active admins" },
      { status: 500 },
    );
  }
}
