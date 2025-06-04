import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { sendResetPasswordEmail } from "@/utils/mail";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Allow only POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  const { email } = req.body;

  // Find user by email
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    // ⚠️ Do not reveal if the email exists or not
    return res.status(200).json({ message: "If that email exists, a reset link has been sent." });
  }

  // Generate a reset token and expiration time (1 hour)
  const token = crypto.randomBytes(32).toString("hex");
  const tokenExp = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

  // Save the reset token and expiration to the user
  await prisma.user.update({
    where: { email },
    data: {
      resetToken: token,
      resetTokenExp: tokenExp,
    },
  });

  // Send the reset password email
  await sendResetPasswordEmail(email, token);

  // Always respond with the same message for security
  return res.status(200).json({ message: "If that email exists, a reset link has been sent." });
}