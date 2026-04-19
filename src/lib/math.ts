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

const SMALL_FRIENDS: Record<number, number> = { 1: 4, 2: 3, 3: 2, 4: 1 };
const BIG_FRIENDS: Record<number, number> = { 1: 9, 2: 8, 3: 7, 4: 6, 5: 5, 6: 4, 7: 3, 8: 2, 9: 1 };

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

/**
 * Level 1: Simple 1-digit addition/subtraction.
 * No carries, no partner rules.
 */
function generateLevel1(): Problem {
  const isAddition = Math.random() > 0.5;
  if (isAddition) {
    const a = Math.floor(Math.random() * 5) + 1; // 1-5
    const b = Math.floor(Math.random() * 4) + 1; // 1-4
    // Ensure no carry and sum feels "simple" for abacus (fits on one rod without rules)
    // Rule: sum <= 9 and individually fits?
    // Let's just keep it simple: sum <= 9
    return { question: `${a} + ${b}`, answer: a + b };
  } else {
    const a = Math.floor(Math.random() * 8) + 2; // 2-9
    const b = Math.floor(Math.random() * (a - 1)) + 1; // 1 to a-1
    return { question: `${a} - ${b}`, answer: a - b };
  }
}

/**
 * Level 2: Partner Rules (Small Friend / Big Friend)
 * Small Friends (sum to 5), Big Friends (sum to 10)
 */
function generateLevel2(): Problem {
  const ruleType = Math.random() > 0.5 ? 'small' : 'big';
  
  if (ruleType === 'small') {
    // Add something that requires a small friend
    // e.g. 4 + 1 -> 4 + (5-4)
    const b = Math.floor(Math.random() * 4) + 1; // 1-4
    const a = 5 - Math.floor(Math.random() * b) - 1; 
    // Wait, simpler:
    // To need a small friend for +X, we must have enough space for 5 but not for X.
    // Meaning current value < 5 and (current value + X) > 4
    const x = Math.floor(Math.random() * 4) + 1; // What we are adding
    const current = 5 - Math.floor(Math.random() * x) - 1; // If x=1, current must be 4. If x=2, current can be 3 or 4.
    
    return { 
      question: `${current} + ${x}`, 
      answer: current + x, 
      rule: `Small Friend: +${x} = +5 - ${SMALL_FRIENDS[x]}` 
    };
  } else {
    // Big Friend
    // current + x >= 10
    const x = Math.floor(Math.random() * 9) + 1; // 1-9
    const current = 10 - Math.floor(Math.random() * x) - 1;
    return { 
      question: `${current} + ${x}`, 
      answer: current + x, 
      rule: `Big Friend: +${x} = +10 - ${BIG_FRIENDS[x]}` 
    };
  }
}

/**
 * Level 3: 2-digit by 1-digit multiplication
 */
function generateLevel3(): Problem {
  const a = Math.floor(Math.random() * 90) + 10; // 10-99
  const b = Math.floor(Math.random() * 8) + 2; // 2-9
  return { question: `${a} × ${b}`, answer: a * b };
}
