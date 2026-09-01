import { rateLimit } from "./rateLimit";

function clientIp(req: { ip?: string; socket: { remoteAddress?: string } }) {
  return req.ip || req.socket.remoteAddress || "unknown";
}

const tooMany = "Too many attempts. Try again later.";

export const rateLimitAuthLogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  keyFromRequest: clientIp,
  message: tooMany,
});

export const rateLimitAuthRegister = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
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
