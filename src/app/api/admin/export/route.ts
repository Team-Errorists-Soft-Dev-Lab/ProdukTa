import { NextApiResponse } from "next";
import { NextRequest } from "next/server";
import { prisma } from "@/utils/prisma/client";

export async function POST(req: NextRequest, res: NextApiResponse) {
  // record each export from the admin dashboard
  const { msmeId } = await req.json();
  const msmeIdToInt = parseInt(msmeId);

  await prisma.exportLog.create({
    data: {
      msmeId: msmeIdToInt,
    },
  });
  return Response.json({ message: "export counted successfully" });
}

export async function GET(req: NextRequest, res: NextApiResponse) {
  const exportCount = await prisma.exportLog.count();
  return Response.json({ exportCount });
}
