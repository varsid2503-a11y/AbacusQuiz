
export interface TutorialStep {
  title: string;
  content: string;
  example?: string;
}

export interface LevelTutorial {
  level: number;
  name: string;
  steps: TutorialStep[];
}

export const TUTORIALS: LevelTutorial[] = [
  {
    level: 1,
    name: "Apprentice: Foundations",
    steps: [
      {
        title: "The Abacus Rod",
        content: "On a standard abacus rod, the single bead at the top is worth 5. The four beads at the bottom are worth 1 each.",
        example: "Visualizing: Top bead down = 5. One bottom bead up = 1."
      },
      {
        title: "Mental Movement",
        content: "Imagine moving the beads with your thumb and index finger. Addition moves beads toward the center bar; subtraction moves them away.",
        example: "To add 2, flick two bottom beads up."
      },
      {
        title: "Simple Calculation",
        content: "At this level, operations don't require carries. You simply add or subtract digits within the 0-9 range per rod.",
        example: "4 + 5: Move 4 lower beads up, then move the 1 upper bead down."
      }
    ]
  },
  {
    level: 2,
    name: "Adept: Partner Rules",
    steps: [
      {
        title: "Running out of beads?",
        content: "When you don't have enough lower beads to add a number, we use 'Small Friends' (partners that sum to 5).",
        example: "To add 4 when you only have space for 1: Add 5, then subtract its small friend 1 (+4 = +5 - 1)."
      },
      {
        title: "Small Friends",
        content: "Partners: (1,4), (2,3). If adding X is impossible on the lower beads, use the 5-bead.",
        example: "+3 = +5 - 2. +2 = +5 - 3."
      },
      {
        title: "Big Friends",
        content: "When the rod is full (9 beads), use 'Big Friends' (sum to 10). Add 1 to the next left rod and subtract the partner.",
        example: "+9 = +10 - 1. +7 = +10 - 3."
      }
    ]
  },
  {
    level: 3,
    name: "Master: Temporal Expansion",
    steps: [
      {
        title: "2-Digit Visualization",
        content: "Mental multiplication requires holding two values in your 'mental scratchpad' simultaneously.",
        example: "24 x 3: Visualize the 2 and 4 separately."
      },
      {
        title: "The Distributive Method",
        content: "Multiply the tens first, then the ones. Sum them up in your mind.",
        example: "(20 x 3) = 60. (4 x 3) = 12."
      },
      {
        title: "Final Summation",
        content: "Carry the tens from the second product into the first result immediately.",
        example: "60 + 12 = 72. Hold '72' at the center of your focus."
      }
    ]
  }
];
