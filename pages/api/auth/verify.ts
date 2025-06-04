import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Get token from query parameters
  const { token } = req.query;

  // Check if token is provided and is a string
  if (!token || typeof token !== "string") {
    return res.status(400).json({ message: "Invalid token" });
  }

  // Find user by verification token and check if token is still valid
  const user = await prisma.user.findFirst({
    where: {
      verifyToken: token,
      verifyTokenExp: { gte: new Date() },
    },
  });

  // If user not found or token expired, return error
  if (!user) {
    return res.status(400).json({ message: "Token is invalid or expired" });
  }

  // Update user: set verified to true and clear verification token fields
  await prisma.user.update({
    where: { id: user.id },
    data: {
      verified: true,
      verifyToken: null,
      verifyTokenExp: null,
    },
  });

  // Respond with success message
  return res.status(200).json({ message: "Email confirmed" });
}