import crypto from "crypto";
import jwt from "jsonwebtoken";

const ACCESS_TTL = "30m";
const REFRESH_TTL = "30d";
export const REFRESH_TTL_MS = 30 * 24 * 60 * 60 * 1000;
export const MAX_REFRESH_SESSIONS = 10;

export type AccessPayload = { id: string; type: "access" };
export type RefreshPayload = { id: string; familyId: string; type: "refresh" };
export type AdminPayload = { role: "admin"; type: "admin" };

const ADMIN_TTL = "2h";

function envSecret(name: string): string {
  const secret = process.env[name];
  if (!secret) throw new Error(`${name} is required`);
  return secret;
}

function accessSecret(): string {
  return envSecret("JWT_SECRET");
}

function refreshSecret(): string {
  return envSecret("JWT_REFRESH_SECRET");
}

function adminSecret(): string {
  return envSecret("JWT_ADMIN_SECRET");
}

export function assertJwtSecrets(): void {
  const access = accessSecret();
  const refresh = refreshSecret();
  const admin = adminSecret();
  if (new Set([access, refresh, admin]).size !== 3) {
    throw new Error(
      "JWT_SECRET, JWT_REFRESH_SECRET, and JWT_ADMIN_SECRET must all be different"
    );
  }
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

export function signAdminToken(): string {
  return jwt.sign(
    { role: "admin", type: "admin" } satisfies AdminPayload,
    adminSecret(),
    { expiresIn: ADMIN_TTL }
  );
}

export function verifyAdminToken(token: string): AdminPayload {
  const decoded = jwt.verify(token, adminSecret()) as AdminPayload;
  if (decoded.type !== "admin" || decoded.role !== "admin") {
    throw new jwt.JsonWebTokenError("Invalid admin token");
  }
  return decoded;
}
