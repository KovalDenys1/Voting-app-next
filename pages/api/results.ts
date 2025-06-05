import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get all parties
    const parties = await prisma.party.findMany();

    // Get the number of votes for each party
    const voteCounts = await prisma.vote.groupBy({
      by: ["partyId"],
      _count: {
        partyId: true,
      },
    });

    // Create a map: partyId => number of votes
    const countMap = new Map<string, number>(
      voteCounts.map(vc => [vc.partyId, vc._count.partyId])
    );

    // Build the results array
    const results = parties
      .map(party => ({
        party: { name: party.name },
        count: countMap.get(party.id) || 0,
      }))
      .sort((a, b) => b.count - a.count); // sort by votes descending

    // Send the result
    return res.status(200).json({ results });

  } catch (error: unknown) {
    const err = error as Error;
    console.error("💥 Error in /api/results:", err);
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
}