import { NextApiRequest } from "next";
import jwt from "jsonwebtoken";
import { parse } from "cookie";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

// Extract user ID from the request's JWT cookie (server-side)
export function getUserIdFromRequest(req: NextApiRequest): string | null {
  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
  const token = cookies.token;

  if (!token) return null;

  try {
    // Verify and decode the JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded.userId;
  } catch {
    // Return null if token is invalid or expired
    return null;
  }
}

// Extract user email from JWT token in localStorage (client-side)
export function getUserFromToken(): { email: string } | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    // Decode the JWT token (no verification)
    const decoded = jwt.decode(token) as { email: string };
    return decoded;
  } catch {
    // Return null if decoding fails
    return null;
  }
}