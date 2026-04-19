/**
 * ZenAbacus Mathematical Logic Engine
 */

export type DifficultyLevel = 1 | 2 | 3;

export interface Problem {
  question: string;
  answer: number;
  explanation?: string;
  rule?: string;
}

export interface HighScore {
  name: string;
  score: number;
  level: DifficultyLevel;
  date: string;
}

const SMALL_FRIENDS: Record<number, number> = { 1: 4, 2: 3, 3: 2, 4: 1 };
const BIG_FRIENDS: Record<number, number> = { 1: 9, 2: 8, 3: 7, 4: 6, 5: 5, 6: 4, 7: 3, 8: 2, 9: 1 };

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export function generateProblem(level: DifficultyLevel): Problem {
  switch (level) {
    case 1:
      return generateLevel1();
    case 2:
      return generateLevel2();
    case 3:
      return generateLevel3();
    default:
      return generateLevel1();
  }
}

function generateLevel1(): Problem {
  const isAddition = Math.random() > 0.5;
  if (isAddition) {
    const a = randomInt(1, 5);
    const b = randomInt(1, 9 - a);
    return { question: `${a} + ${b}`, answer: a + b };
  }

  const a = randomInt(2, 9);
  const b = randomInt(1, a - 1);
  return { question: `${a} - ${b}`, answer: a - b };
}

function generateLevel2(): Problem {
  const isAddition = Math.random() > 0.5;
  const useSmallFriend = Math.random() > 0.5;

  if (useSmallFriend) {
    if (isAddition) {
      const x = randomInt(2, 4);
      const partner = SMALL_FRIENDS[x];
      const current = randomInt(1, 5 - x);
      return {
        question: `${current} + ${x}`,
        answer: current + x,
        rule: `Small Friend: +${x} = +5 - ${partner}`,
      };
    }

    const x = randomInt(1, 4);
    const partner = SMALL_FRIENDS[x];
    const current = randomInt(5, 9);
    return {
      question: `${current} - ${x}`,
      answer: current - x,
      rule: `Small Friend: -${x} = -5 + ${partner}`,
    };
  }

  if (isAddition) {
    const x = randomInt(5, 9);
    const partner = BIG_FRIENDS[x];
    const current = randomInt(1, 10 - x);
    return {
      question: `${current} + ${x}`,
      answer: current + x,
      rule: `Big Friend: +${x} = +10 - ${partner}`,
    };
  }

  const x = randomInt(5, 9);
  const partner = BIG_FRIENDS[x];
  const current = randomInt(x, 18);
  return {
    question: `${current} - ${x}`,
    answer: current - x,
    rule: `Big Friend: -${x} = -10 + ${partner}`,
  };
}

function generateLevel3(): Problem {
  const a = randomInt(10, 99);
  const b = randomInt(2, 9);
  return {
    question: `${a} × ${b}`,
    answer: a * b,
    explanation: `Multiply ${a} by ${b} with a balanced technique.`,
  };
}
