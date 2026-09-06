import { rateLimit } from "./rateLimit";

function clientIp(req: {
  ip?: string;
  get: (name: string) => string | undefined;
  socket: { remoteAddress?: string };
}) {
  const cf = req.get("cf-connecting-ip");
  if (cf) return cf.trim();
  const forwarded = req.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.ip || req.socket.remoteAddress || "unknown";
}

const tooMany = "Too many attempts. Try again later.";

export const rateLimitAuthLogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  keyFromRequest: clientIp,
  message: tooMany,
});

export const rateLimitAuthRegister = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  keyFromRequest: clientIp,
  message: tooMany,
});

export const rateLimitAuthRefresh = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  keyFromRequest: clientIp,
  message: tooMany,
});

export const rateLimitAuthPublic = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  keyFromRequest: clientIp,
  message: tooMany,
});
