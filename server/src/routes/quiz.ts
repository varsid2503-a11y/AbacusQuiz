import { randomUUID } from "node:crypto";
import { Router, type Response } from "express";
import { z } from "zod";
import type { AuthedRequest } from "../middleware/auth.js";
import { generateQuestion } from "../quizEngine.js";
import { QuizAttempt } from "../models/QuizAttempt.js";
import { User } from "../models/User.js";
import { isDbConnected } from "../db.js";
import * as mem from "../memoryStore.js";

const StartSchema = z.object({
  operation: z.enum(["add", "sub", "mixed"]),
  digits: z.union([z.literal(1), z.literal(2)]),
  timePerQuestionSec: z.number().int().min(5).max(300),
  questionCount: z.number().int().min(3).max(30).optional().default(10),
});

type Q = ReturnType<typeof generateQuestion>;
type Session = {
  userId: string | null;
  questions: Q[];
  answers: (boolean | null)[];
  responseMs: number[];
  createdAt: number;
  operation: string;
  digits: number;
  timePerQuestionSec: number;
};

const sessions = new Map<string, Session>();

function utcDateString(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

function nextStreak(last: string, current: number, longest: number) {
  const today = utcDateString();
  if (!last) return { current: 1, longest: Math.max(1, longest) };
  if (last === today) return { current, longest };
  const y = new Date(last + "T12:00:00Z");
  const t = new Date(today + "T12:00:00Z");
  if (Math.round((t.getTime() - y.getTime()) / 86400000) === 1) {
    const nc = current + 1;
    return { current: nc, longest: Math.max(longest, nc) };
  }
  return { current: 1, longest };
}

async function persistResult(
  userId: string,
  session: Session,
  correctCount: number,
  scorePct: number,
  avgResponseMs: number
) {
  const total = session.questions.length;
  if (userId.startsWith("mem_")) {
    const u = mem.memoryGetUser(userId);
    if (!u) return;
    mem.memoryAddAttempt(userId, {
      score: scorePct,
      correct: correctCount,
      total,
      operation: session.operation,
      digits: session.digits,
      timePerQuestionSec: session.timePerQuestionSec,
      avgResponseMs,
    });
    const { current, longest } = nextStreak(u.lastActiveDate, u.currentStreak, u.longestStreak);
    mem.memoryUpdateUser(userId, {
      totalQuizzes: u.totalQuizzes + 1,
      totalCorrect: u.totalCorrect + correctCount,
      totalQuestions: u.totalQuestions + total,
      highScore: Math.max(u.highScore, scorePct),
      currentStreak: current,
      longestStreak: longest,
      lastActiveDate: utcDateString(),
    });
    return;
  }
  if (!isDbConnected()) return;
  await QuizAttempt.create({
    userId,
    score: scorePct,
    correct: correctCount,
    total,
    operation: session.operation,
    digits: session.digits,
    timePerQuestionSec: session.timePerQuestionSec,
    avgResponseMs,
  });
  const user = await User.findById(userId);
  if (!user) return;
  user.totalQuizzes += 1;
  user.totalCorrect += correctCount;
  user.totalQuestions += total;
  user.highScore = Math.max(user.highScore, scorePct);
  const { current, longest } = nextStreak(user.lastActiveDate, user.currentStreak, user.longestStreak);
  user.currentStreak = current;
  user.longestStreak = longest;
  user.lastActiveDate = utcDateString();
  await user.save();
}

export function createQuizRouter() {
  const r = Router();

  r.post("/sessions", (req: AuthedRequest, res: Response) => {
    const parsed = StartSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }
    const { operation, digits, timePerQuestionSec, questionCount } = parsed.data;
    const questions = Array.from({ length: questionCount }, () => generateQuestion(operation, digits));
    const id = randomUUID();
    sessions.set(id, {
      userId: req.userId ?? null,
      questions,
      answers: Array(questionCount).fill(null),
      responseMs: Array(questionCount).fill(0),
      createdAt: Date.now(),
      operation,
      digits,
      timePerQuestionSec,
    });
    res.json({
      sessionId: id,
      question: { index: 0, total: questionCount, expression: questions[0]!.expression, timePerQuestionSec },
    });
  });

  r.post("/sessions/:id/answer", async (req: AuthedRequest, res: Response) => {
    const parsed = z
      .object({
        index: z.number().int().min(0),
        answer: z.number().int(),
        responseMs: z.number().int().min(0).max(600_000),
      })
      .safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }
    const sessionId = String(req.params.id);
    const session = sessions.get(sessionId);
    if (!session) {
      res.status(404).json({ error: "Session not found" });
      return;
    }
    const { index, answer, responseMs } = parsed.data;
    if (index >= session.questions.length) {
      res.status(400).json({ error: "Invalid index" });
      return;
    }
    const q = session.questions[index]!;
    const correct = answer === q.answer;
    session.answers[index] = correct;
    session.responseMs[index] = responseMs;

    if (index < session.questions.length - 1) {
      const nq = session.questions[index + 1]!;
      res.json({
        correct,
        completed: false,
        next: { index: index + 1, total: session.questions.length, expression: nq.expression, timePerQuestionSec: session.timePerQuestionSec },
      });
      return;
    }

    const total = session.questions.length;
    const correctCount = session.answers.filter((a) => a === true).length;
    const scorePct = Math.round((correctCount / total) * 100);
    const avgResponseMs = Math.round(session.responseMs.reduce((a, b) => a + b, 0) / total);
    const userId = req.userId ?? session.userId;
    if (userId) await persistResult(userId, session, correctCount, scorePct, avgResponseMs);
    sessions.delete(sessionId);
    res.json({ correct, completed: true, summary: { scorePct, correct: correctCount, total, avgResponseMs } });
  });

  return r;
}
