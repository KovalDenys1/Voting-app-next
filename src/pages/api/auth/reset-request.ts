import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { sendResetPasswordEmail } from "@/utils/mail";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  const { email } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    // ⚠️ Не avslør at email ikke finnes
    return res.status(200).json({ message: "If that email exists, a reset link has been sent." });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const tokenExp = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

  await prisma.user.update({
    where: { email },
    data: {
      resetToken: token,
      resetTokenExp: tokenExp,
    },
  });

  await sendResetPasswordEmail(email, token);

  return res.status(200).json({ message: "If that email exists, a reset link has been sent." });
}