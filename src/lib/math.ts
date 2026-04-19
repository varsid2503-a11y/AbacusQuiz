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
 * Addition and Subtraction logic for partners.
 */
function generateLevel2(): Problem {
  const isAddition = Math.random() > 0.5;
  const ruleType = Math.random() > 0.5 ? 'small' : 'big';
  
  if (ruleType === 'small') {
    if (isAddition) {
      // Small Friend Addition: +x = +5 - partner
      const x = Math.floor(Math.random() * 4) + 1; // 1-4
      const partner = SMALL_FRIENDS[x];
      // Current beads must have 5-bead available and fewer than x 1-beads.
      // E.g. for +1, current must be 4.
      const current = 5 - Math.floor(Math.random() * x) - 1; 
      return { 
        question: `${current} + ${x}`, 
        answer: current + x, 
        rule: `Small Friend: +${x} = +5 - ${partner}` 
      };
    } else {
      // Small Friend Subtraction: -x = -5 + partner
      const x = Math.floor(Math.random() * 4) + 1; // 1-4
      const partner = SMALL_FRIENDS[x];
      // Current beads must have 5-bead down and not enough 1-beads to subtract x.
      // E.g. for -1, current must be 5, 6, 7, 8 or 9? 
      // Wait, if current is 5, -1 needs rule. (5 is just the top bead).
      // If current is 6 (5+1), -2 needs rule (-2 = -5 + 3).
      // Condition: current is in [5, 5 + x - 1]
      const current = 5 + Math.floor(Math.random() * x);
      return {
        question: `${current} - ${x}`,
        answer: current - x,
        rule: `Small Friend: -${x} = -5 + ${partner}`
      };
    }
  } else {
    if (isAddition) {
      // Big Friend Addition: +x = +10 - partner
      const x = Math.floor(Math.random() * 9) + 1; // 1-9
      const partner = BIG_FRIENDS[x];
      const current = 10 - Math.floor(Math.random() * x) - 1;
      return { 
        question: `${current} + ${x}`, 
        answer: current + x, 
        rule: `Big Friend: +${x} = +10 - ${partner}` 
      };
    } else {
      // Big Friend Subtraction: -x = -10 + partner
      const x = Math.floor(Math.random() * 9) + 1; // 1-9
      const partner = BIG_FRIENDS[x];
      // Current must be numeric logic: current - x < 0 on this rod? 
      // Let's simplify: 10 to (10 + x - 1)
      const current = 10 + Math.floor(Math.random() * x);
      // We limit to 1-digit results or small 2-digit for abacus clarity
      return {
        question: `${current} - ${x}`,
        answer: current - x,
        rule: `Big Friend: -${x} = -10 + ${partner}`
      };
    }
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
