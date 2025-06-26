"use client"

import React, { createContext, useContext, useEffect, useState, useMemo } from "react"

type Theme = "light" | "dark" | "system"

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: "light" | "dark"
}

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(
  undefined
)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "ui-theme",
  ...props
}: {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
  attribute?: string
  enableSystem?: boolean
}) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") {
      return defaultTheme
    }
    return (localStorage.getItem(storageKey) as Theme) || defaultTheme
  })
  
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const root = window.document.documentElement
    
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const systemTheme = mediaQuery.matches ? "dark" : "light"
    const currentTheme = theme === "system" ? systemTheme : theme

    setResolvedTheme(currentTheme);
    root.classList.remove("light", "dark")
    root.classList.add(currentTheme)
    localStorage.setItem(storageKey, theme)

    const handleChange = (e: MediaQueryListEvent) => {
        const newSystemTheme = e.matches ? "dark" : "light";
        if (theme === 'system') {
            setResolvedTheme(newSystemTheme);
            root.classList.remove("light", "dark");
            root.classList.add(newSystemTheme);
        }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);

  }, [theme, storageKey])

  const value = useMemo(() => ({
    theme,
    setTheme,
    resolvedTheme
  }), [theme, resolvedTheme]);

  return (
    <ThemeProviderContext.Provider value={value} {...props}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
