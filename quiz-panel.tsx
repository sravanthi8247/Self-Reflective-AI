"use client";

import { useCallback, useMemo, useState } from "react";

import { CopyButton } from "@/components/copy-button";
import { requestQuiz } from "@/lib/api-client";
import type { DifficultyLevel, QuizQuestion } from "@/lib/types";

type QuizPanelProps = {
  finalExplanation: string;
  difficulty: DifficultyLevel;
};

export function QuizPanel({ finalExplanation, difficulty }: QuizPanelProps) {
  const [quiz, setQuiz] = useState<QuizQuestion[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usedMock, setUsedMock] = useState<boolean | null>(null);
  const [selected, setSelected] = useState<Record<number, number | null>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  const quizText = useMemo(() => {
    if (!quiz?.length) return "";
    return quiz
      .map((q, i) => {
        const opts = q.options.map((o, j) => `${String.fromCharCode(65 + j)}. ${o}`).join("\n");
        return `Q${i + 1}: ${q.question}\n${opts}\nAnswer: ${String.fromCharCode(65 + q.correctIndex)}`;
      })
      .join("\n\n");
  }, [quiz]);

  const generate = useCallback(async () => {
    setLoading(true);
    setError(null);
    setQuiz(null);
    setSelected({});
    setRevealed({});
    try {
      const res = await requestQuiz(finalExplanation, difficulty);
      setQuiz(res.questions);
      setUsedMock(res.usedMock);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [finalExplanation, difficulty]);

  const toggleReveal = (index: number) => {
    setRevealed((r) => ({ ...r, [index]: !r[index] }));
  };

  if (!finalExplanation.trim()) return null;

  return (
    <div className="animate-in relative overflow-hidden rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/50 dark:shadow-black/20">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-fuchsia-500/5 dark:from-violet-500/10" />
      <div className="relative">
        <div className="mb-2 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Quiz
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Multiple choice from your final explanation — same difficulty
              level.
            </p>
          </div>
          <button
            type="button"
            onClick={generate}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-900/30 transition hover:from-violet-500 hover:to-fuchsia-500 disabled:cursor-not-allowed disabled:opacity-50 sm:shrink-0"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Building…
              </>
            ) : (
              <>
                <Sparkles />
                Generate quiz
              </>
            )}
          </button>
        </div>

        {usedMock === true && quiz && (
          <p className="mb-4 text-xs text-amber-700 dark:text-amber-200/90">
            Demo quiz — add GEMINI_API_KEY for AI-generated questions.
          </p>
        )}

        {error && (
          <div
            className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200"
            role="alert"
          >
            {error}
          </div>
        )}

        {quiz && quiz.length > 0 && (
          <div className="mb-4 flex justify-end">
            <CopyButton text={quizText} label="Copy quiz" />
          </div>
        )}

        {quiz && (
          <ol className="space-y-6">
            {quiz.map((q, qi) => (
              <li
                key={qi}
                className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-950/40"
              >
                <p className="font-medium text-slate-900 dark:text-slate-100">
                  <span className="mr-2 text-violet-600 dark:text-violet-400">
                    {qi + 1}.
                  </span>
                  {q.question}
                </p>
                <ul className="mt-3 space-y-2">
                  {q.options.map((opt, oi) => {
                    const isSel = selected[qi] === oi;
                    const show = revealed[qi];
                    const isCorrect = oi === q.correctIndex;
                    let state =
                      "border-slate-200 bg-white hover:border-violet-300 dark:border-slate-600 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300";
                    if (show) {
                      if (isCorrect) {
                        state =
                          "border-emerald-500 bg-emerald-50 text-emerald-900 dark:border-emerald-500/60 dark:bg-emerald-950/30 dark:text-emerald-200";
                      } else if (isSel && !isCorrect) {
                        state =
                          "border-red-400 bg-red-50 text-red-900 dark:border-red-500/50 dark:bg-red-950/30 dark:text-red-200";
                      }
                    } else if (isSel) {
                      state =
                        "border-violet-500 bg-violet-50 dark:border-violet-500/60 dark:bg-violet-950/20";
                    }
                    return (
                      <li key={oi}>
                        <button
                          type="button"
                          disabled={show}
                          onClick={() =>
                            setSelected((s) => ({ ...s, [qi]: oi }))
                          }
                          className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${state}`}
                        >
                          <span className="font-semibold text-slate-400 dark:text-slate-500">
                            {String.fromCharCode(65 + oi)}.
                          </span>{" "}
                          {opt}
                        </button>
                      </li>
                    );
                  })}
                </ul>
                <button
                  type="button"
                  onClick={() => toggleReveal(qi)}
                  className="mt-3 text-xs font-semibold text-violet-600 hover:text-violet-500 dark:text-violet-400"
                >
                  {revealed[qi] ? "Hide answer" : "Reveal answer"}
                </button>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}

function Sparkles() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2l1.2 6.6L20 10l-6.8 1.4L12 18l-1.2-6.6L4 10l6.8-1.4L12 2z" />
    </svg>
  );
}
