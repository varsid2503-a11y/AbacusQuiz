type OperationMode = "add" | "sub" | "mixed";
type Op = "+" | "-";

export type GeneratedQuestion = {
  nums: number[];
  ops: Op[];
  answer: number;
  expression: string;
};

function evalChain(nums: number[], ops: Op[]): number {
  let acc = nums[0]!;
  for (let i = 0; i < ops.length; i++) {
    acc = ops[i] === "+" ? acc + nums[i + 1]! : acc - nums[i + 1]!;
  }
  return acc;
}

function prefixNonNegative(nums: number[], ops: Op[]): boolean {
  let acc = nums[0]!;
  for (let i = 0; i < ops.length; i++) {
    acc = ops[i] === "+" ? acc + nums[i + 1]! : acc - nums[i + 1]!;
    if (acc < 0) return false;
  }
  return true;
}

function formatExpression(nums: number[], ops: Op[]): string {
  const parts = [String(nums[0])];
  for (let i = 0; i < ops.length; i++) parts.push(ops[i]!, String(nums[i + 1]!));
  return parts.join(" ");
}

function randomOperand(digits: 1 | 2): number {
  const lo = digits === 1 ? 1 : 10;
  const hi = digits === 1 ? 9 : 99;
  return lo + Math.floor(Math.random() * (hi - lo + 1));
}

export function generateQuestion(operation: OperationMode, digits: 1 | 2): GeneratedQuestion {
  const operandCount = Math.random() < 0.45 ? 3 : 2;
  for (let attempt = 0; attempt < 80; attempt++) {
    const nums = Array.from({ length: operandCount }, () => randomOperand(digits));
    const ops: Op[] = [];
    for (let i = 0; i < operandCount - 1; i++) {
      if (operation === "add") ops.push("+");
      else if (operation === "sub") ops.push("-");
      else ops.push(Math.random() < 0.5 ? "+" : "-");
    }
    const answer = evalChain(nums, ops);
    if (answer < 0 || answer > 9999 || !prefixNonNegative(nums, ops)) continue;
    return { nums, ops, answer, expression: formatExpression(nums, ops) };
  }
  const a = randomOperand(digits);
  const b = randomOperand(digits);
  const nums = [a, b];
  const ops: Op[] = [operation === "sub" ? "-" : "+"];
  return { nums, ops, answer: evalChain(nums, ops), expression: formatExpression(nums, ops) };
}
