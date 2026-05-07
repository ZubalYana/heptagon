import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function verifyAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "No token provided." });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    next();
  } catch {
    res.status(403).json({ message: "Invalid or expired token." });
  }
}
