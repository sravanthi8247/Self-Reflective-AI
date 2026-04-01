"use client";

import { useEffect, useState } from "react";

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    setDark(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="group inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-amber-500 shadow-sm transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600 dark:border-slate-700 dark:bg-slate-900 dark:text-amber-300 dark:hover:border-violet-500/40 dark:hover:bg-slate-800 dark:hover:text-violet-300"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span className="transition group-hover:scale-110">
        {dark ? <SunIcon /> : <MoonIcon />}
      </span>
    </button>
  );
}
