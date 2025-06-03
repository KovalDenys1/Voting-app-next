import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getUserIdFromRequest } from "@/utils/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Allow only POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  // Get user ID from the request (from JWT)
  const userId = getUserIdFromRequest(req);

  const { partyId } = req.body;

  // Check if userId and partyId are provided
  if (!userId || !partyId) {
    return res.status(400).json({ message: "Missing user or party" });
  }

  // Check if the user has already voted
  const existingVote = await prisma.vote.findFirst({ where: { userId } });

  if (existingVote) {
    return res.status(400).json({ message: "You have already voted" });
  }

  // Create a new vote
  await prisma.vote.create({
    data: {
      userId,
      partyId,
    },
  });

  // Respond with success message
  return res.status(200).json({ message: "Vote recorded" });
}