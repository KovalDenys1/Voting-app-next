import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { sendVerificationEmail } from "@/utils/mail";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("🟡 Received method:", req.method);

  if (req.method !== "POST") {
    console.warn("⚠️ Method not allowed:", req.method);
    return res.status(405).json({ message: "Only POST method is allowed" });
  }

  const { email, password } = req.body;

  console.log("📩 Email:", email);
  console.log("🔐 Password length:", password?.length);

  if (!email || !password) {
    console.warn("❌ Missing email or password");
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    console.log("🔍 Checking if user exists...");
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      console.log("👤 User found:", existingUser.email, "| Verified:", existingUser.verified);

      if (existingUser.verified) {
        return res.status(400).json({ message: "Email is already registered and verified." });
      } else {
        console.log("📨 Resending verification email...");
        await sendVerificationEmail(existingUser.email, existingUser.id);
        return res.status(200).json({
          message: "Verification link has been resent to your email.",
        });
      }
    }

    console.log("🧪 Generating token...");
    const token = crypto.randomBytes(32).toString("hex");

    console.log("📨 Sending verification email to new user...");
    await sendVerificationEmail(email, token);

    console.log("✅ Registration complete");
    return res.status(200).json({
      message: "Registration successful. Please check your email to verify your account.",
    });

  } catch (error: any) {
    console.error("💥 Registration error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error?.message || "Unknown error"
    });
  }
}