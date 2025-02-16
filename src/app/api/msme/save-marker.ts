import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    try {
      const { lat, lng }: { lat: number; lng: number } = req.body as {
        lat: number;
        lng: number;
      };

      const marker = await prisma.marker.create({
        data: {
          latitude: lat,
          longitude: lng,
        },
      });

      res.status(200).json({ message: "Marker saved", marker });
    } catch (error) {
      res.status(500).json({ error: "Failed to save marker" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
