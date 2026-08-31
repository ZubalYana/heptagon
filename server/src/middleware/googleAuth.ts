import { google } from "googleapis";
import jwt from "jsonwebtoken";
import process from "node:process";
import User from "../features/users/userSchema";

const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];

function jwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is required");
  return secret;
}

export function signCalendarOAuthState(userId: string) {
  return jwt.sign({ type: "calendar_oauth", userId }, jwtSecret(), {
    expiresIn: "15m",
  });
}

export function verifyCalendarOAuthState(state: string): string {
  try {
    const decoded = jwt.verify(state, jwtSecret()) as {
      type?: string;
      userId?: string;
    };
    if (decoded.type !== "calendar_oauth" || !decoded.userId) {
      throw new Error("Invalid calendar connection");
    }
    return decoded.userId;
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw new Error("Calendar connection expired. Try again.");
    }
    if (err instanceof Error && err.message === "Invalid calendar connection") {
      throw err;
    }
    throw new Error("Invalid calendar connection");
  }
}

export async function getAuthClient(userId: string) {
  const user = await User.findById(userId);
  if (!user?.googleTokens?.access_token) return null;

  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
  oAuth2Client.setCredentials(user.googleTokens);

  oAuth2Client.on("tokens", async (newTokens) => {
    await User.findByIdAndUpdate(userId, {
      "googleTokens.access_token": newTokens.access_token,
      ...(newTokens.refresh_token && {
        "googleTokens.refresh_token": newTokens.refresh_token,
      }),
    });
  });

  return oAuth2Client;
}

export async function getAuthUrl(userId: string) {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
  return oAuth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
    state: signCalendarOAuthState(userId),
  });
}

export async function exchangeCodeForToken(code: string, userId: string) {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
  const { tokens } = await oAuth2Client.getToken(code);

  await User.findByIdAndUpdate(userId, { googleTokens: tokens });

  return oAuth2Client;
}
