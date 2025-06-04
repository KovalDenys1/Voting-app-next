import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Allow only POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  const { token, newPassword } = req.body;

  // Check if token and new password are provided
  if (!token || !newPassword) {
    return res.status(400).json({ message: "Missing token or password" });
  }

  // Find user by reset token and check if token is still valid
  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExp: { gte: new Date() },
    },
  });

  if (!user) {
    return res.status(400).json({ message: "Token is invalid or expired" });
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update user's password and clear reset token fields
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExp: null,
    },
  });

  // Respond with success message
  return res.status(200).json({ message: "Password has been reset successfully" });
}