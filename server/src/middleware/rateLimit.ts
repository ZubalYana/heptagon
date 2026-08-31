import type { Request, Response, NextFunction } from "express";

interface RateLimitOptions {
  windowMs: number;
  max: number;
  keyFromRequest: (req: Request) => string;
  message: string;
}

export function rateLimit({
  windowMs,
  max,
  keyFromRequest,
  message,
}: RateLimitOptions) {
  const attempts = new Map<string, { count: number; resetAt: number }>();

  return (req: Request, res: Response, next: NextFunction) => {
    const key = keyFromRequest(req);
    const now = Date.now();
    let entry = attempts.get(key);
    if (!entry || now > entry.resetAt) {
      entry = { count: 0, resetAt: now + windowMs };
      attempts.set(key, entry);
    }
    entry.count += 1;
    if (entry.count > max) {
      res.status(429).json({ error: message });
      return;
    }
    next();
  };
}
