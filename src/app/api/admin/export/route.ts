import type { NextApiResponse } from "next";
import type { NextRequest } from "next/server";
import { prisma } from "@/utils/prisma/client";

export async function POST(req: NextRequest, _: NextApiResponse) {
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
  const exportCount = await prisma.exportLog.count();
  return Response.json({ exportCount });
}
