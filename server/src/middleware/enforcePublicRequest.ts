import type { Request, Response, NextFunction } from "express";

function isProduction() {
  return process.env.NODE_ENV === "production";
}

function allowedHosts(): Set<string> {
  const hosts = new Set(
    (process.env.ALLOWED_HOSTS || "")
      .split(",")
      .map((host) => host.trim().toLowerCase())
      .filter(Boolean)
  );

  if (!isProduction()) {
    const port = process.env.PORT || "5000";
    for (const name of ["localhost", "127.0.0.1", "[::1]"]) {
      hosts.add(name);
      hosts.add(`${name}:${port}`);
    }
  }

  return hosts;
}

function requestHost(req: Request): string {
  const raw = req.headers["x-forwarded-host"] || req.headers.host || "";
  return String(raw).split(",")[0].trim().toLowerCase();
}

function hostnameFromHeader(hostHeader: string): string {
  if (hostHeader.startsWith("[")) {
    const end = hostHeader.indexOf("]");
    return end === -1 ? hostHeader : hostHeader.slice(1, end);
  }
  const colon = hostHeader.lastIndexOf(":");
  if (colon !== -1 && /^\d+$/.test(hostHeader.slice(colon + 1))) {
    return hostHeader.slice(0, colon);
  }
  return hostHeader;
}

function hostAllowed(hostHeader: string, allow: Set<string>): boolean {
  if (!hostHeader) return false;
  const hostname = hostnameFromHeader(hostHeader);
  return (
    allow.has(hostHeader) ||
    allow.has(hostname) ||
    allow.has(`[${hostname}]`)
  );
}

export function assertPublicRequestConfig() {
  if (isProduction() && allowedHosts().size === 0) {
    throw new Error("ALLOWED_HOSTS is required in production");
  }
}

export function enforcePublicRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const allow = allowedHosts();
  if (isProduction() && allow.size === 0) {
    res.status(500).json({ error: "ALLOWED_HOSTS is required in production" });
    return;
  }
  if (allow.size > 0 && !hostAllowed(requestHost(req), allow)) {
    res.status(400).json({ error: "Invalid host" });
    return;
  }
  if (isProduction() && req.protocol !== "https") {
    res.status(403).json({ error: "HTTPS required" });
    return;
  }
  next();
}
