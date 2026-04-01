const GEMINI_MODEL = "gemini-1.5-flash";
const GENERATE_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

type GeminiGenerateResponse = {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
  }>;
  error?: { message?: string; code?: number };
};

export type GenerateTextOptions = {
  /** When set, Gemini returns JSON-shaped text (still returned as a string). */
  responseMimeType?: "application/json";
};

/**
 * Calls Google Gemini and returns only the generated text.
 * Uses GEMINI_API_KEY from the environment.
 */
export async function generateText(
  prompt: string,
  options?: GenerateTextOptions,
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey?.trim()) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const url = `${GENERATE_URL}?key=${encodeURIComponent(apiKey)}`;
  const body: Record<string, unknown> = {
    contents: [{ parts: [{ text: prompt }] }],
  };
  if (options?.responseMimeType) {
    body.generationConfig = { responseMimeType: options.responseMimeType };
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = (await res.json()) as GeminiGenerateResponse;

  if (!res.ok) {
    const msg =
      data.error?.message ?? `Gemini request failed (${res.status})`;
    throw new Error(msg);
  }

  const text =
    data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ??
    "";

  return text.trim();
}
