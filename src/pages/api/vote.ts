import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getUserIdFromRequest } from "@/utils/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  const userId = getUserIdFromRequest(req);

  const { partyId } = req.body;

  if (!userId || !partyId) {
    return res.status(400).json({ message: "Missing user or party" });
  }

  const existingVote = await prisma.vote.findFirst({ where: { userId } });

  if (existingVote) {
    return res.status(400).json({ message: "You have already voted" });
  }

  await prisma.vote.create({
    data: {
      userId,
      partyId,
    },
  });

  return res.status(200).json({ message: "Vote recorded" });
}