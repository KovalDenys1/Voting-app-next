import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Clear the token cookie by setting it to an empty value and an expired date
  res.setHeader(
    "Set-Cookie",
    serialize("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      expires: new Date(0), // Expire the cookie immediately
    })
  );

  // Respond with a success message
  res.status(200).json({ message: "Logged out" });
}