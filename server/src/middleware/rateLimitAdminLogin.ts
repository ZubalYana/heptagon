import type { Request, Response, NextFunction } from "express";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

const attempts = new Map<string, { count: number; resetAt: number }>();

export function rateLimitAdminLogin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const key = req.ip || req.socket.remoteAddress || "unknown";
  const now = Date.now();
  let entry = attempts.get(key);
  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + WINDOW_MS };
    attempts.set(key, entry);
  }
  entry.count += 1;
  if (entry.count > MAX_ATTEMPTS) {
    res.status(429).json({ error: "Too many login attempts. Try again later." });
    return;
  }
  next();
}
