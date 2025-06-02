import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const parties = await prisma.party.findMany();

  const voteCounts = await prisma.vote.groupBy({
    by: ["partyId"],
    _count: {
      partyId: true,
    },
  });

  const countMap = new Map(
    voteCounts.map((vc) => [vc.partyId, vc._count.partyId])
  );

  const results = parties
    .map((party) => ({
      party: { name: party.name },
      count: countMap.get(party.id) || 0,
    }))
    .sort((a, b) => b.count - a.count); // сортировка по убыванию

  res.status(200).json({ results });
}