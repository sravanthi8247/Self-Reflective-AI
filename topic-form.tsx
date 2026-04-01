"use client";

type TopicFormProps = {
  topic: string;
  onTopicChange: (value: string) => void;
  onSubmit: () => void;
  disabled: boolean;
};

function SparkIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M19 15L19.5 17.5L22 18L19.5 18.5L19 21L18.5 18.5L16 18L18.5 17.5L19 15Z"
        fill="currentColor"
        opacity="0.7"
      />
    </svg>
  );
}

export function TopicForm({
  topic,
  onTopicChange,
  onSubmit,
  disabled,
}: TopicFormProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-1 shadow-2xl shadow-slate-200/40 backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-900/40 dark:shadow-violet-950/20">
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-stretch sm:gap-3">
        <label className="group flex min-h-[52px] flex-1 flex-col justify-center gap-1.5 sm:px-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-500">
            Topic
          </span>
          <input
            type="text"
            value={topic}
            onChange={(e) => onTopicChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && topic.trim() && !disabled) onSubmit();
            }}
            placeholder="What should we reason about?"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 shadow-inner outline-none ring-0 transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)] disabled:opacity-60 dark:border-slate-600/80 dark:bg-slate-950/80 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-violet-500/70 dark:focus:bg-slate-950 dark:focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)]"
            disabled={disabled}
          />
        </label>
        <div className="flex items-end sm:pb-0.5">
          <button
            type="button"
            onClick={onSubmit}
            disabled={disabled || !topic.trim()}
            className="inline-flex h-[52px] w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 text-sm font-semibold text-white shadow-lg shadow-violet-900/25 transition hover:from-violet-500 hover:to-fuchsia-500 hover:shadow-violet-800/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-40 dark:shadow-violet-900/40 dark:focus-visible:ring-offset-slate-950 sm:w-auto sm:min-w-[160px]"
          >
            {disabled ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Generating
              </>
            ) : (
              <>
                <SparkIcon className="opacity-90" />
                Generate
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
