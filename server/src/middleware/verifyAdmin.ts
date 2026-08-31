import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { verifyAdminToken } from "../helpers/authTokens";

export function verifyAdmin(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "No token provided." });
    return;
  }

  try {
    verifyAdminToken(token);
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        message: "Admin token expired.",
        code: "ADMIN_TOKEN_EXPIRED",
      });
      return;
    }
    res.status(403).json({ message: "Invalid or expired token." });
  }
}
