import type { NextRequest } from "next/server";
import { prisma } from "@/utils/prisma/client";

export async function POST(req: NextRequest) {
  // record each export from the admin dashboard
  const { msmeId } = (await req.json()) as { msmeId: string };
  const msmeIdToInt: number = parseInt(msmeId);

  await prisma.exportLog.create({
    data: {
      msmeId: msmeIdToInt,
    },
  });
  return Response.json({ message: "export counted successfully" });
}

export async function GET() {
  try {
    // Group export logs by month and count the number of exports
    const exportCountsByMonth = await prisma.exportLog.groupBy({
      by: ["exportedAt"],
      _count: {
        id: true,
      },
      orderBy: {
        exportedAt: "asc",
      },
    });

    const totalExports = await prisma.exportLog.count();

    // Transform the grouped data to return counts by month
    const monthlyExportCounts = exportCountsByMonth.reduce(
      (acc, log) => {
        const month = log.exportedAt.toISOString().slice(0, 7); // Extract YYYY-MM format
        acc[month] = (acc[month] || 0) + log._count.id;
        return acc;
      },
      {} as Record<string, number>,
    );

    return Response.json({ monthlyExportCounts, totalExports });
  } catch (error) {
    console.error("Error fetching export counts by month:", error);
    return Response.json(
      { error: "Failed to fetch export counts by month" },
      { status: 500 },
    );
  }
}
