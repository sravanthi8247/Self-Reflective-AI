import { generateText } from "@/lib/gemini";
import { buildQuizPrompt } from "@/lib/prompts/quiz-prompts";
import { parseModelJson } from "@/lib/parse-json-response";
import type { DifficultyLevel, QuizQuestion, QuizResponse } from "@/lib/types";

function fourOptions(raw: string[]): [string, string, string, string] {
  const o = raw.filter(Boolean);
  while (o.length < 4) {
    o.push(`Option ${o.length + 1}`);
  }
  return [o[0], o[1], o[2], o[3]];
}

function normalizeQuestions(raw: unknown): QuizQuestion[] {
  if (!Array.isArray(raw)) return [];
  const out: QuizQuestion[] = [];
  for (const item of raw) {
    const q = item as Record<string, unknown>;
    const question = typeof q.question === "string" ? q.question : "";
    const opts = Array.isArray(q.options) ? q.options : [];
    const filtered = opts.filter((x): x is string => typeof x === "string");
    const options = fourOptions(filtered);
    const correctIndex =
      typeof q.correctIndex === "number" &&
      q.correctIndex >= 0 &&
      q.correctIndex <= 3
        ? q.correctIndex
        : 0;
    if (question.trim()) {
      out.push({ question, options, correctIndex });
    }
    if (out.length >= 5) break;
  }
  return out;
}

function mockQuiz(difficulty: DifficultyLevel): QuizQuestion[] {
  return [
    {
      question: "What is the main idea described in the passage?",
      options: [
        "A placeholder idea tied to the topic",
        "An unrelated historical fact",
        "A random definition from another field",
        "None of the above",
      ],
      correctIndex: 0,
    },
    {
      question: "Which statement is best supported by the passage?",
      options: [
        "The passage emphasizes clarity and examples",
        "The passage rejects all examples",
        "The passage is only about formatting",
        "The passage has no takeaway",
      ],
      correctIndex: 0,
    },
    {
      question: "Why might examples matter in this explanation?",
      options: [
        "They help readers connect abstract ideas to concrete situations",
        "They replace the need for definitions",
        "They always use numbers",
        "They are optional and discouraged",
      ],
      correctIndex: 0,
    },
    {
      question: "What should a reader watch for when evaluating completeness?",
      options: [
        "Whether key boundaries and gaps are addressed",
        "Whether the font is serif",
        "Whether the text is short",
        "Whether there are exactly three paragraphs",
      ],
      correctIndex: 0,
    },
    {
      question: `At ${difficulty} level, what is a reasonable expectation?`,
      options: [
        "Feedback should be specific, not generic praise",
        "Feedback should avoid mentioning clarity",
        "Feedback should only praise",
        "Feedback should be written as JSON",
      ],
      correctIndex: 0,
    },
  ];
}

export async function generateQuiz(
  finalExplanation: string,
  difficulty: DifficultyLevel,
): Promise<QuizResponse> {
  const key = process.env.GEMINI_API_KEY;
  if (!key?.trim() || !finalExplanation.trim()) {
    return {
      questions: mockQuiz(difficulty),
      usedMock: true,
      difficulty,
    };
  }

  try {
    const raw = await generateText(
      buildQuizPrompt(finalExplanation, difficulty),
      { responseMimeType: "application/json" },
    );
    const parsed = parseModelJson<{ questions?: unknown }>(raw);
    const questions = normalizeQuestions(parsed.questions);
    if (questions.length === 0) {
      return {
        questions: mockQuiz(difficulty),
        usedMock: true,
        difficulty,
      };
    }
    return { questions, usedMock: false, difficulty };
  } catch {
    return {
      questions: mockQuiz(difficulty),
      usedMock: true,
      difficulty,
    };
  }
}
