import { Router, type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { User } from "../models/User.js";
import { isDbConnected } from "../db.js";
import * as mem from "../memoryStore.js";

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  displayName: z.string().max(64).optional(),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

function signToken(secret: string, userId: string): string {
  return jwt.sign({ sub: userId }, secret, { expiresIn: "30d" });
}

function userPayload(u: { id: string; email: string; displayName: string; highScore: number; currentStreak: number }) {
  return { id: u.id, email: u.email, displayName: u.displayName, highScore: u.highScore, currentStreak: u.currentStreak };
}

export function createAuthRouter(jwtSecret: string) {
  const r = Router();

  r.post("/register", async (req: Request, res: Response) => {
    const parsed = RegisterSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }
    const { email, password, displayName } = parsed.data;
    const name = displayName ?? "Learner";

    if (isDbConnected()) {
      if (await User.findOne({ email })) {
        res.status(409).json({ error: "Email already registered" });
        return;
      }
      const passwordHash = await bcrypt.hash(password, 10);
      const user = await User.create({ email, passwordHash, displayName: name });
      res.json({ token: signToken(jwtSecret, String(user._id)), user: userPayload({ id: String(user._id), email: user.email, displayName: user.displayName, highScore: 0, currentStreak: 0 }) });
      return;
    }

    const created = await mem.memoryRegister(email, password, name);
    if (!created) {
      res.status(409).json({ error: "Email already registered" });
      return;
    }
    res.json({ token: signToken(jwtSecret, created.id), user: userPayload(created) });
  });

  r.post("/login", async (req: Request, res: Response) => {
    const parsed = LoginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }
    const { email, password } = parsed.data;

    if (isDbConnected()) {
      const user = await User.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }
      res.json({
        token: signToken(jwtSecret, String(user._id)),
        user: userPayload({ id: String(user._id), email: user.email, displayName: user.displayName, highScore: user.highScore, currentStreak: user.currentStreak }),
      });
      return;
    }

    const m = await mem.memoryLogin(email, password);
    if (!m) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    res.json({ token: signToken(jwtSecret, m.id), user: userPayload(m) });
  });

  return r;
}
