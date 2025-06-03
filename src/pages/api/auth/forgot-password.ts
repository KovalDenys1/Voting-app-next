import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ message: "No user with that email" });

  // Generate a JWT token valid for 15 minutes
  const token = jwt.sign({ email }, process.env.JWT_SECRET!, { expiresIn: "15m" });

  // Build the reset password URL using BASE_URL from environment variables
  const resetUrl = `${process.env.BASE_URL}/reset-password?token=${token}`;

  // Configure the email transporter using Gmail
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Email options for sending the reset link
  const mailOptions = {
    from: `"Voting App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset your password",
    html: `
      <p>Hello,</p>
      <p>Click the link below to reset your password. This link is valid for 15 minutes:</p>
      <a href="${resetUrl}">${resetUrl}</a>
    `,
  };

  try {
    // Send the reset password email
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "Reset link sent" });
  } catch (error) {
    // Log and return error if email sending fails
    console.error("Email error:", error);
    return res.status(500).json({ message: "Failed to send email" });
  }
}