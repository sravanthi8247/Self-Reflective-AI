import { NextResponse } from "next/server";

import { parseDifficulty } from "@/lib/difficulty";
import { generateQuiz } from "@/lib/quiz-server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const finalExplanation =
    typeof body === "object" &&
    body !== null &&
    "finalExplanation" in body &&
    typeof (body as { finalExplanation: unknown }).finalExplanation ===
      "string"
      ? (body as { finalExplanation: string }).finalExplanation.trim()
      : "";

  if (!finalExplanation) {
    return NextResponse.json(
      { error: "Missing or empty finalExplanation" },
      { status: 400 },
    );
  }

  const difficulty = parseDifficulty(
    typeof body === "object" && body !== null && "difficulty" in body
      ? (body as { difficulty?: unknown }).difficulty
      : undefined,
  );

  try {
    const quiz = await generateQuiz(finalExplanation, difficulty);
    return NextResponse.json(quiz, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Quiz generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
