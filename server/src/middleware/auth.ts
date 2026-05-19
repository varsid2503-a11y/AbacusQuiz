import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { UserDoc } from "../models/User.js";
import { User } from "../models/User.js";
import * as mem from "../memoryStore.js";

export type AuthedRequest = Request & { userId?: string; user?: UserDoc | null };

export function optionalAuth(secret: string) {
  return async (req: AuthedRequest, _res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.replace(/^Bearer /, "");
    if (!token) {
      next();
      return;
    }
    try {
      const { sub } = jwt.verify(token, secret) as { sub: string };
      req.userId = sub;
      if (!sub.startsWith("mem_")) {
        req.user = (await User.findById(sub).lean()) as UserDoc | null;
      }
      next();
    } catch {
      next();
    }
  };
}

export function authMiddleware(secret: string) {
  return async (req: AuthedRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.replace(/^Bearer /, "");
    if (!token) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    try {
      const { sub } = jwt.verify(token, secret) as { sub: string };
      req.userId = sub;
      if (sub.startsWith("mem_")) {
        if (!mem.memoryGetUser(sub)) {
          res.status(401).json({ error: "User not found" });
          return;
        }
        next();
        return;
      }
      req.user = (await User.findById(sub).lean()) as UserDoc | null;
      if (!req.user) {
        res.status(401).json({ error: "User not found" });
        return;
      }
      next();
    } catch {
      res.status(401).json({ error: "Invalid token" });
    }
  };
}
