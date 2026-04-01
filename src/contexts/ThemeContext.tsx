import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

type ThemeOption = "dark" | "light" | "system";
type FontOption = "inter" | "grotesk" | "mono";
type FontSizeOption = "small" | "medium" | "large";

interface ThemeContextType {
  theme: ThemeOption;
  font: FontOption;
  fontSize: FontSizeOption;
  compactMode: boolean;
  notifications: boolean;
  setTheme: (t: ThemeOption) => void;
  setFont: (f: FontOption) => void;
  setFontSize: (s: FontSizeOption) => void;
  setCompactMode: (v: boolean) => void;
  setNotifications: (v: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

const fontFamilies: Record<FontOption, string> = {
  inter: "'Inter', system-ui, sans-serif",
  grotesk: "'Space Grotesk', 'Inter', system-ui, sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', monospace",
};

const fontSizes: Record<FontSizeOption, string> = {
  small: "14px",
  medium: "16px",
  large: "18px",
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeOption>(() => (localStorage.getItem("slms_theme") as ThemeOption) || "dark");
  const [font, setFontState] = useState<FontOption>(() => (localStorage.getItem("slms_font") as FontOption) || "inter");
  const [fontSize, setFontSizeState] = useState<FontSizeOption>(() => (localStorage.getItem("slms_fontSize") as FontSizeOption) || "medium");
  const [compactMode, setCompactModeState] = useState(() => localStorage.getItem("slms_compact") === "true");
  const [notifications, setNotificationsState] = useState(() => localStorage.getItem("slms_notif") !== "false");

  const applyTheme = useCallback((t: ThemeOption) => {
    const root = document.documentElement;
    if (t === "dark" || (t === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
    }
  }, []);

  const applyFont = useCallback((f: FontOption) => {
    document.documentElement.style.fontFamily = fontFamilies[f];
  }, []);

  const applyFontSize = useCallback((s: FontSizeOption) => {
    document.documentElement.style.fontSize = fontSizes[s];
  }, []);

  const applyCompact = useCallback((v: boolean) => {
    if (v) {
      document.documentElement.classList.add("compact");
    } else {
      document.documentElement.classList.remove("compact");
    }
  }, []);

  useEffect(() => { applyTheme(theme); }, [theme, applyTheme]);
  useEffect(() => { applyFont(font); }, [font, applyFont]);
  useEffect(() => { applyFontSize(fontSize); }, [fontSize, applyFontSize]);
  useEffect(() => { applyCompact(compactMode); }, [compactMode, applyCompact]);

  const setTheme = (t: ThemeOption) => { setThemeState(t); localStorage.setItem("slms_theme", t); };
  const setFont = (f: FontOption) => { setFontState(f); localStorage.setItem("slms_font", f); };
  const setFontSize = (s: FontSizeOption) => { setFontSizeState(s); localStorage.setItem("slms_fontSize", s); };
  const setCompactMode = (v: boolean) => { setCompactModeState(v); localStorage.setItem("slms_compact", String(v)); };
  const setNotifications = (v: boolean) => { setNotificationsState(v); localStorage.setItem("slms_notif", String(v)); };

  return (
    <ThemeContext.Provider value={{ theme, font, fontSize, compactMode, notifications, setTheme, setFont, setFontSize, setCompactMode, setNotifications }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
