"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
type Theme = "dark" | "light";
const ThemeContext = createContext({
  theme: "dark" as Theme,
  toggle: () => {},
});
export const useTheme = () => useContext(ThemeContext);
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  useEffect(() => {
    setTheme(
      document.documentElement.dataset.theme === "light" ? "light" : "dark",
    );
    const sync = (event: StorageEvent) => {
      if (event.key === "fanous-theme") {
        const next = event.newValue === "light" ? "light" : "dark";
        applyTheme(next);
        setTheme(next);
      }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    applyTheme(next);
    setTheme(next);
    try {
      localStorage.setItem("fanous-theme", next);
    } catch {
      /* Session preference still works. */
    }
  }
  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", theme === "dark" ? "#0b1723" : "#f6f3ec");
}
