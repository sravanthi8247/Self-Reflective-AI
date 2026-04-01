import type { DifficultyLevel } from "@/lib/types";

export const DIFFICULTY_OPTIONS: { value: DifficultyLevel; label: string }[] = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const INSTRUCTIONS: Record<DifficultyLevel, string> = {
  beginner:
    "Difficulty: Beginner. Use very simple language, short sentences, avoid jargon. " +
    "Prefer everyday analogies. Assume no prior knowledge.",
  intermediate:
    "Difficulty: Intermediate. Use clear explanations with some domain terms briefly defined. " +
    "Balance intuition with light technical detail.",
  advanced:
    "Difficulty: Advanced. Include nuance, trade-offs, edge cases, and precise terminology where appropriate. " +
    "Assume an educated reader comfortable with abstraction.",
};

export function difficultyInstructions(level: DifficultyLevel): string {
  return INSTRUCTIONS[level];
}

export function parseDifficulty(value: unknown): DifficultyLevel {
  if (value === "beginner" || value === "intermediate" || value === "advanced") {
    return value;
  }
  return "intermediate";
}
