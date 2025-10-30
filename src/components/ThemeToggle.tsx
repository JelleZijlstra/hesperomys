import React from "react";

function getSystemPrefersDark(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function getStoredTheme(): "dark" | "light" | null {
  try {
    const v = localStorage.getItem("theme");
    if (v === "dark" || v === "light") return v;
  } catch {}
  return null;
}

function applyTheme(theme: "dark" | "light" | null) {
  const root = document.documentElement;
  if (!theme) {
    root.removeAttribute("data-theme");
    return;
  }
  root.setAttribute("data-theme", theme);
}

export default function ThemeToggle() {
  const [theme, setTheme] = React.useState<"dark" | "light" | null>(null);

  React.useEffect(() => {
    const stored = getStoredTheme();
    if (stored) {
      setTheme(stored);
      applyTheme(stored);
    } else {
      // Follow system by default (no explicit data-theme), but set state for label.
      const systemDark = getSystemPrefersDark();
      setTheme(systemDark ? "dark" : "light");
      // Do not set attribute to allow media query to apply automatically
    }
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      localStorage.setItem("theme", next);
    } catch {}
    applyTheme(next);
  }

  const label = theme === "dark" ? "Light" : "Dark";

  return (
    <button
      onClick={toggle}
      title={`Switch to ${label.toLowerCase()} mode`}
      style={{
        marginLeft: "0.5rem",
        padding: "0.25rem 0.5rem",
        borderRadius: 6,
        border: "1px solid rgba(255,255,255,0.2)",
        background: "rgba(255,255,255,0.08)",
        color: "inherit",
        cursor: "pointer",
      }}
    >
      {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}
