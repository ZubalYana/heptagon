import { google } from "googleapis";
import jwt from "jsonwebtoken";
import process from "node:process";

const LOGIN_SCOPES = ["openid", "email", "profile"];

function loginRedirectUri(): string {
  const uri = process.env.GOOGLE_LOGIN_REDIRECT_URI;
  if (!uri) {
    throw new Error("GOOGLE_LOGIN_REDIRECT_URI is required");
  }
  return uri;
}

function jwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is required");
  return secret;
}

function createClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    loginRedirectUri()
  );
}

export function getGoogleLoginUrl(): string {
  const state = jwt.sign({ type: "google_login" }, jwtSecret(), {
    expiresIn: "10m",
  });
  return createClient().generateAuthUrl({
    access_type: "online",
    prompt: "select_account",
    scope: LOGIN_SCOPES,
    state,
  });
}

export function verifyGoogleLoginState(state: string) {
  try {
    const decoded = jwt.verify(state, jwtSecret()) as { type?: string };
    if (decoded.type !== "google_login") {
      throw new Error("Invalid Google sign-in state");
    }
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw new Error("Google sign-in expired. Try again.");
    }
    throw new Error("Invalid Google sign-in state");
  }
}

export async function getGoogleProfile(code: string) {
  const client = createClient();
  const { tokens } = await client.getToken(code);
  client.setCredentials(tokens);

  const oauth2 = google.oauth2({ version: "v2", auth: client });
  const { data } = await oauth2.userinfo.get();

  if (!data.id || !data.email) {
    throw new Error("Google did not return an email address");
  }
  if (data.verified_email !== true) {
    throw new Error("Google email is not verified");
  }

  return {
    googleId: data.id,
    email: data.email,
    name: data.name || data.email.split("@")[0],
  };
}
