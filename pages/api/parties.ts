import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Fetch all parties from the database
  const parties = await prisma.party.findMany();

  // Respond with the list of parties
  res.status(200).json({ parties });
}