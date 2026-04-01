import { generateText } from "@/lib/gemini";
import {
  buildCriticPrompt,
  buildExplanationPrompt,
  buildImproverPrompt,
} from "@/lib/prompts/agent-prompts";
import { parseModelJson } from "@/lib/parse-json-response";
import type {
  CriticAgentOutput,
  DifficultyLevel,
  ExplanationAgentOutput,
  ImproverAgentOutput,
  IterationRecord,
} from "@/lib/types";

const ITERATIONS = 3;

function normalizeExplanation(
  data: Partial<ExplanationAgentOutput>,
): ExplanationAgentOutput {
  const explanation =
    typeof data.explanation === "string" ? data.explanation : "";
  const examples = Array.isArray(data.examples)
    ? data.examples.filter((e): e is string => typeof e === "string")
    : [];
  return { explanation, examples };
}

function normalizeCritic(data: Partial<CriticAgentOutput>): CriticAgentOutput {
  return {
    clarity: typeof data.clarity === "string" ? data.clarity : "",
    completeness:
      typeof data.completeness === "string" ? data.completeness : "",
    examples: typeof data.examples === "string" ? data.examples : "",
  };
}

function normalizeImprover(
  data: Partial<ImproverAgentOutput>,
): ImproverAgentOutput {
  return {
    improvedExplanation:
      typeof data.improvedExplanation === "string"
        ? data.improvedExplanation
        : "",
  };
}

/** Use improver output as the next round's explanation payload (examples inline). */
function improvedToExplanationPayload(
  improved: string,
): ExplanationAgentOutput {
  return { explanation: improved.trim(), examples: [] };
}

function mockIterations(
  topic: string,
  difficulty: DifficultyLevel,
): IterationRecord[] {
  const imp1 = [
    `**${topic} (after round 1)** · ${difficulty}`,
    "",
    "- Core idea in one line.",
    "- Why it matters.",
    "- Example: a short scenario.",
    "",
    "(Demo — set GEMINI_API_KEY for live iterative reasoning.)",
  ].join("\n");
  const imp2 = [
    `**${topic} (after round 2)** · ${difficulty}`,
    "",
    "- Refined structure and clearer scope.",
    "- Stronger example with specifics.",
  ].join("\n");
  const imp3 = [
    `**${topic} (after round 3)** · ${difficulty}`,
    "",
    "- Final pass: tight summary and memorable example.",
  ].join("\n");

  return [
    {
      iteration: 1,
      explanation: {
        explanation: `${topic} can be understood as a cluster of related ideas you can unpack in plain language.`,
        examples: [
          `Starter example for "${topic}": a familiar analogy.`,
          "A second example tied to everyday experience.",
        ],
      },
      feedback: {
        clarity:
          "Round 1: tighten definitions and remove ambiguity in one sentence.",
        completeness:
          "Round 1: add one boundary or contrast so scope is clear.",
        examples:
          "Round 1: add one concrete mini-scenario with specifics.",
      },
      improved: imp1,
    },
    {
      iteration: 2,
      explanation: improvedToExplanationPayload(imp1),
      feedback: {
        clarity: "Round 2: reduce repetition and sharpen the lead sentence.",
        completeness:
          "Round 2: name one limitation or common misconception.",
        examples: "Round 2: vary example type (not two similar anecdotes).",
      },
      improved: imp2,
    },
    {
      iteration: 3,
      explanation: improvedToExplanationPayload(imp2),
      feedback: {
        clarity: "Round 3: final polish on flow and signposting.",
        completeness: "Round 3: optional one-line ‘takeaway’ if missing.",
        examples: "Round 3: ensure the example matches the stated scope.",
      },
      improved: imp3,
    },
  ];
}

/**
 * Runs iterative reasoning: initial explanation → critic → improve, repeated 3 times.
 * Each cycle feeds the improved text back as the next explanation (structured for critic).
 */
export async function runIterativeReasoning(
  topic: string,
  difficulty: DifficultyLevel,
): Promise<{
  iterations: IterationRecord[];
  usedMock: boolean;
}> {
  const key = process.env.GEMINI_API_KEY;
  if (!key?.trim()) {
    return { iterations: mockIterations(topic, difficulty), usedMock: true };
  }

  const jsonOpts = { responseMimeType: "application/json" as const };
  const iterations: IterationRecord[] = [];

  try {
    const initialRaw = await generateText(
      buildExplanationPrompt(topic, difficulty),
      jsonOpts,
    );
    let current = normalizeExplanation(
      parseModelJson<Partial<ExplanationAgentOutput>>(initialRaw),
    );

    for (let i = 1; i <= ITERATIONS; i++) {
      const critRaw = await generateText(
        buildCriticPrompt(topic, current, difficulty),
        jsonOpts,
      );
      const feedback = normalizeCritic(
        parseModelJson<Partial<CriticAgentOutput>>(critRaw),
      );

      const impRaw = await generateText(
        buildImproverPrompt(topic, current, feedback, difficulty),
        jsonOpts,
      );
      const improver = normalizeImprover(
        parseModelJson<Partial<ImproverAgentOutput>>(impRaw),
      );
      const improved = improver.improvedExplanation;

      iterations.push({
        iteration: i,
        explanation: current,
        feedback,
        improved,
      });

      if (i < ITERATIONS) {
        current = improvedToExplanationPayload(improved);
      }
    }

    return { iterations, usedMock: false };
  } catch {
    return { iterations: mockIterations(topic, difficulty), usedMock: true };
  }
}
