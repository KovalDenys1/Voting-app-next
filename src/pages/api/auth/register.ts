import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { sendVerificationEmail } from "@/utils/mail";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST method is allowed" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return res.status(400).json({ message: "Email is already registered" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const token = crypto.randomBytes(32).toString("hex");
  const tokenExpiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      verifyToken: token,
      verifyTokenExp: tokenExpiry,
    },
  });

  await sendVerificationEmail(email, token);

  return res.status(200).json({
    message: "Registration successful. Please check your email to verify your account.",
  });
}