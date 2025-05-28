import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const results = await prisma.party.findMany({
    include: {
      _count: {
        select: { votes: true },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  const formatted = results.map((party) => ({
    id: party.id,
    name: party.name,
    votes: party._count.votes,
  }));

  res.status(200).json({ results: formatted });
}
