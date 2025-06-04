import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { sendVerificationEmail } from "@/utils/mail";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Log the received HTTP method for debugging
  console.log('Received method:', req.method);

  // Allow only POST requests
  if (req.method !== "POST") {
    // Set the Allow header to inform which methods are allowed
    return res.status(405).json({ message: "Only POST method is allowed" });
  }

  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  res.setHeader("Allow", ["POST"]);
  if (existingUser) {
    if (existingUser.verified) {
      // If user is already verified, return error
      return res.status(400).json({ message: "Email is already registered and verified." });
    } else {
      // If user is not verified, resend verification email
      await sendVerificationEmail(existingUser.email, existingUser.id);
      return res.status(200).json({
        message: "Verification link has been resent to your email.",
      });
    }
  }

  // Generate a verification token
  const token = crypto.randomBytes(32).toString("hex");

  // Send verification email to the new user
  await sendVerificationEmail(email, token);

  // Respond with success message
  return res.status(200).json({
    message: "Registration successful. Please check your email to verify your account.",
  });
}