import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Fetch all parties from the database
  const parties = await prisma.party.findMany();

  // Group votes by partyId and count them
  const voteCounts = await prisma.vote.groupBy({
    by: ["partyId"],
    _count: {
      partyId: true,
    },
  });

  // Create a map of partyId to vote count
  const countMap = new Map(
    voteCounts.map((vc) => [vc.partyId, vc._count.partyId])
  );

  // Build the results array with party name and vote count, sorted by count descending
  const results = parties
    .map((party) => ({
      party: { name: party.name },
      count: countMap.get(party.id) || 0,
    }))
    .sort((a, b) => b.count - a.count); // Sort by descending vote count

  // Respond with the results
  res.status(200).json({ results });
}