"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { DifficultySelect } from "@/components/difficulty-select";
import { MultiAgentOutput } from "@/components/multi-agent-output";
import { QuizPanel } from "@/components/quiz-panel";
import { ThemeToggle } from "@/components/theme-toggle";
import { TopicForm } from "@/components/topic-form";
import { requestReasoning } from "@/lib/api-client";
import type { DifficultyLevel, IterationRecord } from "@/lib/types";

export default function HomePage() {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("intermediate");
  const [iterations, setIterations] = useState<IterationRecord[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usedMock, setUsedMock] = useState<boolean | null>(null);
  const [progress, setProgress] = useState<{ current: number; total: number }>(
    { current: 0, total: 3 },
  );

  const finalExplanation = useMemo(() => {
    if (!iterations?.length) return "";
    return iterations[iterations.length - 1]?.improved ?? "";
  }, [iterations]);

  const progressLabel = useMemo(() => {
    if (!loading || progress.current <= 0) return null;
    return `Iteration ${progress.current} → ${progress.total}`;
  }, [loading, progress]);

  useEffect(() => {
    if (!loading) {
      setProgress({ current: 0, total: 3 });
      return;
    }

    setProgress({ current: 1, total: 3 });
    const t1 = window.setTimeout(
      () => setProgress((p) => ({ ...p, current: Math.max(p.current, 2) })),
      1200,
    );
    const t2 = window.setTimeout(
      () => setProgress((p) => ({ ...p, current: Math.max(p.current, 3) })),
      2400,
    );
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [loading]);

  const handleReason = useCallback(async () => {
    const t = topic.trim();
    if (!t) return;

    setLoading(true);
    setError(null);
    setUsedMock(null);
    setIterations(null);

    try {
      const res = await requestReasoning(t, difficulty);
      setIterations(res.iterations);
      setUsedMock(res.usedMock);
    } catch (e) {
      setIterations(null);
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [topic, difficulty]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_50%_-30%,rgba(139,92,246,0.22),transparent)] dark:bg-[radial-gradient(ellipse_100%_80%_at_50%_-30%,rgba(139,92,246,0.22),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(248,250,252,0.95))] dark:bg-[linear-gradient(to_bottom,transparent,rgba(3,7,18,0.9))]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-grid-slate bg-grid opacity-30 [mask-image:linear-gradient(to_bottom,white,transparent)] dark:opacity-40"
        aria-hidden
      />

      <main className="relative z-10 mx-auto max-w-4xl px-4 pb-20 pt-14 sm:px-6 sm:pt-20">
        <div className="mb-6 flex justify-end">
          <ThemeToggle />
        </div>

        <header className="animate-in mb-10 text-center sm:mb-14">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-800 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-200">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Multi-agent · iterative reasoning
          </div>
          <h1 className="text-balance text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Self-reflective{" "}
            <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent dark:from-violet-400 dark:to-fuchsia-400">
              AI
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-base text-slate-600 dark:text-slate-400 sm:text-lg">
            Explain → critique → improve, three times. Pick difficulty, then get
            your best answer highlighted — plus an optional quiz.
          </p>
        </header>

        <section className="animate-in mb-10 space-y-4 sm:mb-12">
          <DifficultySelect
            value={difficulty}
            onChange={setDifficulty}
            disabled={loading}
          />
          <TopicForm
            topic={topic}
            onTopicChange={setTopic}
            onSubmit={handleReason}
            disabled={loading}
          />

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 px-1">
            <p className="text-xs text-slate-500 dark:text-slate-500">
              Tip: press{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-400">
                Enter
              </span>{" "}
              to generate
            </p>
            {progressLabel ? (
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  {progressLabel}
                </span>
                <div className="h-1.5 w-40 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800/70">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-[width] duration-500 ease-out"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(
                          0,
                          (progress.current / progress.total) * 100,
                        ),
                      )}%`,
                    }}
                  />
                </div>
              </div>
            ) : (
              <span className="text-xs text-slate-400 dark:text-slate-600">
                Iteration 1 → 3
              </span>
            )}
          </div>
        </section>

        {error && (
          <div
            className="animate-in mb-8 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 backdrop-blur-sm dark:border-red-500/30 dark:bg-red-950/50 dark:text-red-200"
            role="alert"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span>{error}</span>
              <button
                type="button"
                onClick={handleReason}
                disabled={loading || !topic.trim()}
                className="inline-flex items-center justify-center rounded-lg border border-red-300 bg-white px-3 py-1.5 text-xs font-semibold text-red-800 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-100 dark:hover:bg-red-500/15"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {usedMock === true && (
          <div className="mb-8 flex flex-wrap items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-900 backdrop-blur-sm dark:border-amber-500/20 dark:bg-amber-950/30 dark:text-amber-100/90">
            <span className="font-medium text-amber-800 dark:text-amber-200">
              Demo mode
            </span>
            <span className="text-amber-800/80 dark:text-amber-100/70">
              — add{" "}
              <code className="rounded-md bg-amber-200/90 px-1.5 py-0.5 font-mono text-xs text-amber-900 dark:bg-amber-500/20 dark:text-amber-200">
                GEMINI_API_KEY
              </code>{" "}
              in{" "}
              <code className="rounded-md bg-amber-200/90 px-1.5 py-0.5 font-mono text-xs text-amber-900 dark:bg-amber-500/20 dark:text-amber-200">
                .env.local
              </code>{" "}
              for live generation.
            </span>
          </div>
        )}

        <section className="animate-in-slow">
          <div className="mb-6 flex items-end justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-800/80">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white sm:text-xl">
                Iteration cards
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-500">
                Explanation, critic feedback, and improved answer per round.
              </p>
            </div>
          </div>
          <MultiAgentOutput iterations={iterations} loading={loading} />
        </section>

        {finalExplanation ? (
          <section className="animate-in-slow mt-10">
            <QuizPanel
              key={finalExplanation.slice(0, 120)}
              finalExplanation={finalExplanation}
              difficulty={difficulty}
            />
          </section>
        ) : null}
      </main>
    </div>
  );
}
