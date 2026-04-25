"use client";

import * as React from "react";

export type Theme = "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children, defaultTheme = "light" }: { children: React.ReactNode; defaultTheme?: Theme }) {
  const [theme, setTheme] = React.useState<Theme>(defaultTheme);
  
  const toggleTheme = React.useCallback(() => {
    // Light mode only - no-op
  }, []);
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (!context) {
    // Return default values if not in provider (for storybook)
    return {
      theme: "light" as Theme,
      toggleTheme: () => {},
    };
  }
  return context;
}