import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";

export type MemoryUser = {
  id: string;
  email: string;
  displayName: string;
  passwordHash: string;
  highScore: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  totalQuizzes: number;
  totalCorrect: number;
  totalQuestions: number;
};

export type MemoryQuizAttempt = {
  score: number;
  correct: number;
  total: number;
  operation: string;
  digits: number;
  timePerQuestionSec: number;
  avgResponseMs: number;
  createdAt: string;
};

const byId = new Map<string, MemoryUser>();
const byEmail = new Map<string, string>();
const attemptsByUser = new Map<string, MemoryQuizAttempt[]>();

export async function memoryRegister(
  email: string,
  password: string,
  displayName: string
): Promise<MemoryUser | null> {
  if (byEmail.has(email)) return null;
  const id = `mem_${randomUUID()}`;
  const user: MemoryUser = {
    id,
    email,
    displayName,
    passwordHash: await bcrypt.hash(password, 10),
    highScore: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: "",
    totalQuizzes: 0,
    totalCorrect: 0,
    totalQuestions: 0,
  };
  byId.set(id, user);
  byEmail.set(email, id);
  return user;
}

export async function memoryLogin(email: string, password: string): Promise<MemoryUser | null> {
  const id = byEmail.get(email);
  if (!id) return null;
  const u = byId.get(id);
  if (!u || !(await bcrypt.compare(password, u.passwordHash))) return null;
  return u;
}

export function memoryGetUser(id: string): MemoryUser | undefined {
  return byId.get(id);
}

export function memoryUpdateUser(id: string, patch: Partial<MemoryUser>): MemoryUser | undefined {
  const u = byId.get(id);
  if (!u) return undefined;
  const next = { ...u, ...patch };
  byId.set(id, next);
  return next;
}

export function memoryAddAttempt(userId: string, a: Omit<MemoryQuizAttempt, "createdAt">): void {
  const list = attemptsByUser.get(userId) ?? [];
  list.push({ ...a, createdAt: new Date().toISOString() });
  attemptsByUser.set(userId, list.slice(-200));
}

export function memoryListAttempts(userId: string, limit: number): MemoryQuizAttempt[] {
  return (attemptsByUser.get(userId) ?? []).slice(-limit).reverse();
}
