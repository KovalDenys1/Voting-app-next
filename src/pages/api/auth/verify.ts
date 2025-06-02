import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token } = req.query;

  if (!token || typeof token !== "string") {
    return res.status(400).json({ message: "Invalid token" });
  }

  const user = await prisma.user.findFirst({
    where: {
      verifyToken: token,
      verifyTokenExp: { gte: new Date() },
    },
  });

  if (!user) {
    return res.status(400).json({ message: "Token is invalid or expired" });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      verified: true,
      verifyToken: null,
      verifyTokenExp: null,
    },
  });

  return res.status(200).json({ message: "Email confirmed" });
}