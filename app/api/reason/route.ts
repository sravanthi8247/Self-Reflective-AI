import { NextResponse } from "next/server";

import { parseDifficulty } from "@/lib/difficulty";
import { runIterativeReasoning } from "@/lib/iterative-reasoning-controller";

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

  const topic =
    typeof body === "object" &&
    body !== null &&
    "topic" in body &&
    typeof (body as { topic: unknown }).topic === "string"
      ? (body as { topic: string }).topic.trim()
      : "";

  if (!topic) {
    return NextResponse.json(
      { error: "Missing or empty topic" },
      { status: 400 },
    );
  }

  const difficulty = parseDifficulty(
    typeof body === "object" && body !== null && "difficulty" in body
      ? (body as { difficulty?: unknown }).difficulty
      : undefined,
  );

  try {
    const { iterations, usedMock } = await runIterativeReasoning(
      topic,
      difficulty,
    );
    return NextResponse.json(
      { topic, difficulty, iterations, usedMock },
      { status: 200 },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Reasoning failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
