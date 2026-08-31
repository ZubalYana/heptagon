import crypto from "crypto";
import { hashToken } from "../../helpers/authTokens";

type PendingGoogleLogin = {
  token: string;
  refreshToken: string;
  user: unknown;
  expiresAt: number;
};

const TTL_MS = 2 * 60 * 1000;
const pending = new Map<string, PendingGoogleLogin>();

function prune() {
  const now = Date.now();
  for (const [key, entry] of pending) {
    if (entry.expiresAt <= now) pending.delete(key);
  }
}

export function storeGoogleLoginResult(session: {
  token: string;
  refreshToken: string;
  user: unknown;
}) {
  prune();
  const raw = crypto.randomBytes(32).toString("base64url");
  pending.set(hashToken(raw), {
    ...session,
    expiresAt: Date.now() + TTL_MS,
  });
  return raw;
}

export function takeGoogleLoginResult(raw: string) {
  if (!raw) {
    throw new Error("Google sign-in failed");
  }
  prune();
  const key = hashToken(raw);
  const entry = pending.get(key);
  pending.delete(key);
  if (!entry || entry.expiresAt <= Date.now()) {
    throw new Error("Google sign-in expired. Try again.");
  }
  return {
    token: entry.token,
    refreshToken: entry.refreshToken,
    user: entry.user,
  };
}
