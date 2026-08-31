import { rateLimit } from "./rateLimit";

export const rateLimitAdminLogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  keyFromRequest: (req) => req.ip || req.socket.remoteAddress || "unknown",
  message: "Too many login attempts. Try again later.",
});
