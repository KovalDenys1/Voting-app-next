import { NextApiRequest } from "next";
import jwt from "jsonwebtoken";
import { parse } from "cookie";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export function getUserIdFromRequest(req: NextApiRequest): string | null {
  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
  const token = cookies.token;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded.userId;
  } catch (err) {
    return null;
  }
}

export function getUserFromToken(): { email: string } | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwt.decode(token) as { email: string };
    return decoded;
  } catch (err) {
    return null;
  }
}