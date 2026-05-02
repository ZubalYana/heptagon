import { google } from "googleapis";
import process from "node:process";
import User from "../models/User";

const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];

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
    state: userId,
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
