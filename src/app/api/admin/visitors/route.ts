import type { NextApiResponse } from "next";
import type { NextRequest } from "next/server";
import { prisma } from "@/utils/prisma/client";

export async function POST(req: NextRequest, _: NextApiResponse) {
  const ip = req.headers.get("x-forwarded-for");
  const { msmeId } = (await req.json()) as { msmeId: string };
  const msmeIdToInt: number = parseInt(msmeId);

  if (!ip) {
    return Response.json({ error: "Could not determine IP" });
  }

  try {
    await prisma.visitor.upsert({
      where: {
        ip_msmeId: {
          ip,
          msmeId: msmeIdToInt,
        },
      },
      update: { lastVisited: new Date() },
      create: { ip, msmeId: msmeIdToInt, lastVisited: new Date() },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to save visitor data" });
  }
}

export async function GET() {
  try {
    const topMSMEs = await prisma.visitor.groupBy({
      by: ["msmeId"],
      _count: { msmeId: true },
      orderBy: {
        _count: { msmeId: "desc" },
      },
      take: 10,
    });

    const msmeData = await prisma.mSME.findMany({
      where: { id: { in: topMSMEs.map((msme) => msme.msmeId) } },
    });

    const results = topMSMEs.map((msme) => ({
      msmeId: msme.msmeId,
      visitCount: msme._count.msmeId,
      ...msmeData.find((m) => m.id === msme.msmeId),
    }));

    return Response.json({ results });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to fetch visitor data" });
  }
}
