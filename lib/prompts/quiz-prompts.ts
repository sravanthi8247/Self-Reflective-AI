import { difficultyInstructions } from "@/lib/difficulty";
import type { DifficultyLevel } from "@/lib/types";

import { JSON_ONLY_RULE } from "./agent-prompts";

export function buildQuizPrompt(
  finalExplanation: string,
  difficulty: DifficultyLevel,
): string {
  const depth =
    difficulty === "beginner"
      ? "Keep questions concrete and vocabulary simple. Avoid trick questions."
      : difficulty === "intermediate"
        ? "Mix recall with light application; include one question that connects two ideas."
        : "Include at least one question about trade-offs, edge cases, or precise definitions.";

  return [
    "You are an expert educator. Create a multiple-choice quiz based ONLY on the passage below.",
    "Do not introduce facts that are not supported by the passage.",
    difficultyInstructions(difficulty),
    depth,
    "",
    JSON_ONLY_RULE,
    'JSON shape: { "questions": [ { "question": string, "options": string[], "correctIndex": number } ] }',
    "Rules:",
    "- Exactly 5 questions.",
    "- Each question has exactly 4 options (strings).",
    "- correctIndex is 0, 1, 2, or 3 (the index of the correct option).",
    "- Distractors should be plausible but clearly wrong when the passage is understood.",
    "",
    "Passage:",
    finalExplanation.trim(),
  ].join("\n");
}
