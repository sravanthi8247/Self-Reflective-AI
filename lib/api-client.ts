import type { DifficultyLevel, QuizResponse, ReasonResponse } from "@/lib/types";

export async function requestReasoning(
  topic: string,
  difficulty: DifficultyLevel,
): Promise<ReasonResponse> {
  const res = await fetch("/api/reason", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic, difficulty }),
  });

  const data = (await res.json()) as Partial<ReasonResponse> & {
    error?: string;
  };

  if (!res.ok) {
    throw new Error(data.error ?? `Request failed (${res.status})`);
  }

  if (!Array.isArray(data.iterations)) {
    throw new Error("Invalid response: missing iterations");
  }

  return {
    topic: data.topic ?? topic,
    usedMock: data.usedMock ?? false,
    iterations: data.iterations,
    difficulty: data.difficulty ?? difficulty,
  };
}

export async function requestQuiz(
  finalExplanation: string,
  difficulty: DifficultyLevel,
): Promise<QuizResponse> {
  const res = await fetch("/api/quiz", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ finalExplanation, difficulty }),
  });

  const data = (await res.json()) as Partial<QuizResponse> & { error?: string };

  if (!res.ok) {
    throw new Error(data.error ?? `Request failed (${res.status})`);
  }

  if (!Array.isArray(data.questions)) {
    throw new Error("Invalid response: missing questions");
  }

  return {
    questions: data.questions,
    usedMock: data.usedMock ?? false,
    difficulty: data.difficulty ?? difficulty,
  };
}
