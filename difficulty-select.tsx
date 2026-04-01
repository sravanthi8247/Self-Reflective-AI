"use client";

import { DIFFICULTY_OPTIONS } from "@/lib/difficulty";
import type { DifficultyLevel } from "@/lib/types";

type DifficultySelectProps = {
  value: DifficultyLevel;
  onChange: (v: DifficultyLevel) => void;
  disabled?: boolean;
};

export function DifficultySelect({
  value,
  onChange,
  disabled,
}: DifficultySelectProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-500">
        Difficulty
      </span>
      <div
        className="flex flex-wrap gap-1 rounded-xl border border-slate-200 bg-slate-100/80 p-1 dark:border-slate-700 dark:bg-slate-900/60"
        role="radiogroup"
        aria-label="Difficulty level"
      >
        {DIFFICULTY_OPTIONS.map((opt) => {
          const active = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={active}
              disabled={disabled}
              onClick={() => onChange(opt.value)}
              className={`min-w-[100px] flex-1 rounded-lg px-3 py-2 text-center text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm ${
                active
                  ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md shadow-violet-900/40 dark:shadow-violet-900/50"
                  : "text-slate-600 hover:bg-white/80 dark:text-slate-400 dark:hover:bg-slate-800/80"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
