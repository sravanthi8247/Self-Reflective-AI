/**
 * Reusable building blocks for multi-agent prompts.
 * Compose with build* functions so roles and schemas stay consistent.
 */

import { difficultyInstructions } from "@/lib/difficulty";
import type { DifficultyLevel } from "@/lib/types";

export const JSON_ONLY_RULE =
  "Respond with valid JSON only. No markdown code fences or commentary outside the JSON object.";

export const AGENT_ROLES = {
  explanation:
    "You are the Explanation Agent. Audience: curious readers without domain expertise.",
  critic:
    "You are the Critic Agent. You evaluate explanations fairly and give constructive, specific feedback.",
  improver:
    "You are the Improver Agent. You revise explanations using feedback while preserving accuracy.",
} as const;

export const EXPLANATION_SCHEMA = {
  explanation: "string — plain-language explanation of the topic",
  examples: "string[] — 2–4 short concrete examples illustrating the idea",
} as const;

export const CRITIC_SCHEMA = {
  clarity:
    "string — specific feedback on how clear the explanation is and what to fix",
  completeness:
    "string — specific feedback on coverage of the topic and gaps to address",
  examples:
    "string — specific feedback on quality, relevance, and quantity of examples",
} as const;

export const IMPROVER_SCHEMA = {
  improvedExplanation:
    "string — revised explanation: structured (short intro, key points, examples), clearer than the original",
} as const;

export function buildExplanationPrompt(
  topic: string,
  difficulty: DifficultyLevel,
): string {
  return [
    AGENT_ROLES.explanation,
    difficultyInstructions(difficulty),
    "Task:",
    "- Explain the topic in simple terms (adjusted to the difficulty level above).",
    "- Include concrete examples ordinary readers can relate to.",
    "",
    JSON_ONLY_RULE,
    `JSON shape: { "explanation": ${EXPLANATION_SCHEMA.explanation}, "examples": ${EXPLANATION_SCHEMA.examples} }`,
    "",
    `Topic: ${topic}`,
  ].join("\n");
}

export function buildCriticPrompt(
  topic: string,
  explanationPayload: { explanation: string; examples: string[] },
  difficulty: DifficultyLevel,
): string {
  const payload = JSON.stringify(explanationPayload, null, 2);
  return [
    AGENT_ROLES.critic,
    difficultyInstructions(difficulty),
    "Task:",
    "- Evaluate the explanation on: Clarity, Completeness, Examples.",
    "- For each dimension, give specific, actionable feedback (not generic praise).",
    "- Calibrate expectations to the stated difficulty level.",
    "",
    JSON_ONLY_RULE,
    `JSON shape: { "clarity": ${CRITIC_SCHEMA.clarity}, "completeness": ${CRITIC_SCHEMA.completeness}, "examples": ${CRITIC_SCHEMA.examples} }`,
    "",
    `Topic: ${topic}`,
    "",
    "Explanation to evaluate (JSON):",
    payload,
  ].join("\n");
}

export function buildImproverPrompt(
  topic: string,
  explanationPayload: { explanation: string; examples: string[] },
  criticPayload: { clarity: string; completeness: string; examples: string },
  difficulty: DifficultyLevel,
): string {
  return [
    AGENT_ROLES.improver,
    difficultyInstructions(difficulty),
    "Task:",
    "- Improve the explanation using the critic's feedback.",
    "- Match depth and vocabulary to the difficulty level.",
    "- Make the result more structured and clear (headings optional in plain text; use short paragraphs or bullet-style lines).",
    "- Keep tone consistent with the difficulty; weave in or refine examples as needed.",
    "",
    JSON_ONLY_RULE,
    `JSON shape: { "improvedExplanation": ${IMPROVER_SCHEMA.improvedExplanation} }`,
    "",
    `Topic: ${topic}`,
    "",
    "Original explanation (JSON):",
    JSON.stringify(explanationPayload, null, 2),
    "",
    "Critic feedback (JSON):",
    JSON.stringify(criticPayload, null, 2),
  ].join("\n");
}
