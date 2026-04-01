import type { ReactNode } from "react";

import { CopyButton } from "@/components/copy-button";
import type { IterationRecord } from "@/lib/types";

type MultiAgentOutputProps = {
  iterations: IterationRecord[] | null;
  loading: boolean;
};

function SectionCard({
  accent,
  title,
  icon,
  children,
}: {
  accent: "violet" | "amber" | "emerald" | "emeraldHighlight";
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  const accents = {
    violet:
      "border-violet-200 bg-violet-50/90 dark:border-violet-500/20 dark:bg-violet-950/20",
    amber:
      "border-amber-200 bg-amber-50/90 dark:border-amber-500/20 dark:bg-amber-950/20",
    emerald:
      "border-emerald-200 bg-emerald-50/80 dark:border-emerald-500/15 dark:bg-emerald-950/15",
    emeraldHighlight:
      "border-emerald-300 bg-gradient-to-br from-emerald-50 via-teal-50 to-slate-50 ring-1 ring-emerald-300/60 shadow-md shadow-emerald-200/50 dark:border-emerald-400/40 dark:from-emerald-950/50 dark:via-teal-950/30 dark:to-slate-950/80 dark:ring-emerald-400/30 dark:shadow-[0_0_40px_-8px_rgba(16,185,129,0.35)]",
  };

  return (
    <div className={`rounded-xl border p-4 ${accents[accent]}`}>
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm dark:bg-slate-900/80 dark:text-slate-300">
          {icon}
        </span>
        <h4 className="text-sm font-semibold tracking-wide text-slate-800 dark:text-slate-200">
          {title}
        </h4>
      </div>
      <div className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        {children}
      </div>
    </div>
  );
}

function Icons() {
  return {
    book: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-violet-600 dark:text-violet-400" aria-hidden>
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    chat: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-amber-600 dark:text-amber-400" aria-hidden>
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    bolt: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-emerald-600 dark:text-emerald-400" aria-hidden>
        <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  };
}

export function MultiAgentOutput({ iterations, loading }: MultiAgentOutputProps) {
  const icons = Icons();

  if (!iterations || iterations.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-16 text-center dark:border-slate-700/80 dark:bg-slate-900/30">
        {loading ? (
          <div className="mx-auto flex max-w-sm flex-col items-center gap-4">
            <div className="relative h-10 w-10">
              <span className="absolute inset-0 animate-spin rounded-full border-2 border-violet-200 border-t-violet-600 dark:border-slate-700 dark:border-t-violet-400" />
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Running 3 iterations — explain → critique → refine…
            </p>
          </div>
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-500">
            Enter a topic and hit{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-400 dark:hover:text-slate-300">
              Generate
            </span>{" "}
            to see iteration cards here.
          </p>
        )}
      </div>
    );
  }

  const lastIdx = iterations.length - 1;
  const finalImproved = iterations[lastIdx]?.improved ?? "";

  return (
    <div className="space-y-8">
      <ol className="space-y-6">
        {iterations.map((row, index) => {
          const isLast = index === lastIdx;
          return (
            <li
              key={row.iteration}
              className="animate-in"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white/80 shadow-xl shadow-slate-200/50 backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-violet-200/30 dark:border-slate-700/60 dark:bg-slate-900/40 dark:shadow-black/20 dark:hover:border-slate-600/70 dark:hover:bg-slate-900/50 dark:hover:shadow-violet-950/10">
                <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-5 py-3 dark:border-slate-700/50 dark:bg-slate-900/60">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-sm font-bold text-white shadow-lg shadow-violet-900/40">
                      {row.iteration}
                    </span>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-500">
                        Iteration
                      </p>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        Round {row.iteration} of {iterations.length}
                      </p>
                    </div>
                  </div>
                  {isLast ? (
                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                      Final round
                    </span>
                  ) : null}
                </div>

                <div className="space-y-4 p-5">
                  <SectionCard
                    accent="violet"
                    title="Explanation"
                    icon={icons.book}
                  >
                    <p className="whitespace-pre-wrap text-slate-800 dark:text-slate-200">
                      {row.explanation.explanation}
                    </p>
                    {row.explanation.examples.length > 0 && (
                      <ul className="mt-3 space-y-2 border-t border-slate-200 pt-3 dark:border-slate-700/50">
                        {row.explanation.examples.map((ex, i) => (
                          <li
                            key={i}
                            className="flex gap-2 text-slate-600 before:mt-2 before:h-1.5 before:w-1.5 before:shrink-0 before:rounded-full before:bg-violet-500 dark:text-slate-400 dark:before:bg-violet-500/80"
                          >
                            {ex}
                          </li>
                        ))}
                      </ul>
                    )}
                  </SectionCard>

                  <SectionCard
                    accent="amber"
                    title="Critic feedback"
                    icon={icons.chat}
                  >
                    <dl className="space-y-3">
                      {(
                        [
                          ["Clarity", row.feedback.clarity],
                          ["Completeness", row.feedback.completeness],
                          ["Examples", row.feedback.examples],
                        ] as const
                      ).map(([k, v]) => (
                        <div key={k}>
                          <dt className="text-xs font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-200/80">
                            {k}
                          </dt>
                          <dd className="mt-1 text-slate-700 dark:text-slate-300">
                            {v}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </SectionCard>

                  <SectionCard
                    accent={isLast ? "emeraldHighlight" : "emerald"}
                    title="Improved answer"
                    icon={icons.bolt}
                  >
                    <p
                      className={`whitespace-pre-wrap ${
                        isLast
                          ? "text-base text-slate-900 dark:text-slate-100"
                          : "text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {row.improved}
                    </p>
                    {isLast ? (
                      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-emerald-200 pt-4 dark:border-emerald-500/20">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                          <span className="text-emerald-600 dark:text-emerald-400">✓</span>{" "}
                          Final output for this iteration
                        </span>
                      </div>
                    ) : null}
                  </SectionCard>
                </div>
              </article>
            </li>
          );
        })}
      </ol>

      {finalImproved ? (
        <div className="animate-in relative overflow-hidden rounded-2xl border-2 border-emerald-400/60 bg-gradient-to-br from-emerald-50 via-white to-slate-50 p-1 shadow-[0_0_60px_-12px_rgba(16,185,129,0.35)] dark:border-emerald-400/50 dark:from-emerald-950/80 dark:via-slate-900 dark:to-slate-950 dark:shadow-[0_0_60px_-12px_rgba(16,185,129,0.45)]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(16,185,129,0.15),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(16,185,129,0.2),transparent)]" />
          <div className="relative rounded-xl bg-white/70 p-6 backdrop-blur-sm dark:bg-slate-950/40 sm:p-8">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-lg bg-emerald-500/20 px-2 py-0.5 text-xs font-bold uppercase tracking-widest text-emerald-800 dark:text-emerald-300">
                  Final answer
                </span>
                <span className="text-xs text-emerald-800/70 dark:text-emerald-200/60">
                  After {iterations.length} refinement loops
                </span>
              </div>
              <CopyButton text={finalImproved} label="Copy answer" />
            </div>
            <p className="whitespace-pre-wrap text-lg font-medium leading-relaxed text-slate-900 dark:text-slate-100 sm:text-xl">
              {finalImproved}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
