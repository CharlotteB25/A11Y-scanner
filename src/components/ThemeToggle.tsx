"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  // Load theme from localStorage or system preference
  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;

    if (stored) {
      setTheme(stored);
      document.documentElement.dataset.theme = stored;
    } else {
      const prefersLight = window.matchMedia(
        "(prefers-color-scheme: light)"
      ).matches;

      const initial = prefersLight ? "light" : "dark";
      setTheme(initial);
      document.documentElement.dataset.theme = initial;
    }

    setMounted(true);
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.dataset.theme = next;
  }

  // Avoid hydration mismatch
  if (!mounted) return null;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="button"
      aria-label="Toggle light/dark mode"
      title="Toggle light/dark mode"
      style={{
        padding: "8px 10px",
        fontSize: 12,
        opacity: 0.85,
      }}
    >
      {theme === "dark" ? "☀ Light" : "🌙 Dark"}
    </button>
  );
}
