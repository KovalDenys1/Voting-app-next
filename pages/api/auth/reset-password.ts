import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Allow only POST requests
  if (req.method !== "POST") return res.status(405).end();

  const { token, password, confirmPassword } = req.body;

  // Check if all required fields are provided
  if (!token || !password || !confirmPassword) {
    return res.status(400).json({ message: "Missing fields" });
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    // Verify the reset token and extract the email
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { email: string };
    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password in the database
    await prisma.user.update({
      where: { email: decoded.email },
      data: { password: hashedPassword },
    });

    // Respond with success message
    return res.status(200).json({ message: "Password updated successfully" });
  } catch {
    // Handle invalid or expired token
    return res.status(400).json({ message: "Invalid or expired token" });
  }
}