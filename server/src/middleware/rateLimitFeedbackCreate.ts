import { rateLimit } from "./rateLimit";

export const rateLimitFeedbackCreate = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  keyFromRequest: (req) => req.user?.id || "unknown",
  message: "Too many messages. Please wait a few minutes before sending again.",
});
