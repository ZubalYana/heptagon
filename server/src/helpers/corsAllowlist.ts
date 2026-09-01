function parseOrigins(): string[] {
  const raw = [
    process.env.FRONTEND_URL,
    process.env.CORS_ORIGINS,
  ]
    .flatMap((value) => (value || "").split(","))
    .map((origin) => origin.trim().replace(/\/$/, ""))
    .filter(Boolean);

  if (process.env.NODE_ENV !== "production") {
    raw.push("http://localhost:5173", "http://127.0.0.1:5173");
  }

  return [...new Set(raw)];
}

export function isAllowedOrigin(origin: string | undefined): boolean {
  if (!origin) return true;
  return parseOrigins().includes(origin.replace(/\/$/, ""));
}
