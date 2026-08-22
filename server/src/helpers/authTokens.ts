import crypto from "crypto";
import jwt from "jsonwebtoken";

const ACCESS_TTL = "30m";
const REFRESH_TTL = "30d";
export const REFRESH_TTL_MS = 30 * 24 * 60 * 60 * 1000;
export const MAX_REFRESH_SESSIONS = 10;

export type AccessPayload = { id: string; type: "access" };
export type RefreshPayload = { id: string; familyId: string; type: "refresh" };

function accessSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is required");
  return secret;
}

function refreshSecret(): string {
  return process.env.JWT_REFRESH_SECRET || accessSecret();
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function hashesMatch(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

export function newFamilyId(): string {
  return crypto.randomUUID();
}

export function signAccessToken(userId: string): string {
  return jwt.sign({ id: userId, type: "access" } satisfies AccessPayload, accessSecret(), {
    expiresIn: ACCESS_TTL,
  });
}

export function signRefreshToken(userId: string, familyId: string): string {
  return jwt.sign(
    { id: userId, familyId, type: "refresh" } satisfies RefreshPayload,
    refreshSecret(),
    { expiresIn: REFRESH_TTL }
  );
}

export function verifyAccessToken(token: string): AccessPayload {
  const decoded = jwt.verify(token, accessSecret()) as AccessPayload;
  if (decoded.type !== "access" || !decoded.id) {
    throw new jwt.JsonWebTokenError("Invalid token");
  }
  return decoded;
}

export function verifyRefreshToken(token: string): RefreshPayload {
  const decoded = jwt.verify(token, refreshSecret()) as RefreshPayload;
  if (decoded.type !== "refresh" || !decoded.id || !decoded.familyId) {
    throw new jwt.JsonWebTokenError("Invalid refresh token");
  }
  return decoded;
}

export function refreshExpiryDate(): Date {
  return new Date(Date.now() + REFRESH_TTL_MS);
}
