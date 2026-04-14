import { google } from "googleapis";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];
const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");
const TOKEN_PATH = path.join(process.cwd(), "token.json");

async function loadCredentials() {
  const content = await fs.readFile(CREDENTIALS_PATH, "utf-8");
  const { installed, web } = JSON.parse(content);
  return installed ?? web;
}

export async function getAuthClient() {
  const { client_id, client_secret, redirect_uris } = await loadCredentials();
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  try {
    const token = await fs.readFile(TOKEN_PATH, "utf-8");
    oAuth2Client.setCredentials(JSON.parse(token));
    return oAuth2Client;
  } catch {
    return null;
  }
}

export async function getAuthUrl() {
  const { client_id, client_secret, redirect_uris } = await loadCredentials();
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );
  return oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
}

export async function exchangeCodeForToken(code: string) {
  const { client_id, client_secret, redirect_uris } = await loadCredentials();
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );
  const { tokens } = await oAuth2Client.getToken(code);
  await fs.writeFile(TOKEN_PATH, JSON.stringify(tokens));
  oAuth2Client.setCredentials(tokens);
  return oAuth2Client;
}