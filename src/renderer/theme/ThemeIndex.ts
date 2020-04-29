import { Theme } from "./Theme"
import { ThemeName } from "vickymd/theme"
import { OneDarkTheme } from "./themes/OneDarkTheme"
import { LightTheme } from "./themes/LightTheme"
import { DarkTheme } from "./themes/DarkTheme"
import { useState, useMemo, useCallback } from "react"
import { Settings } from "../util/Settings"

interface Themes {
  [name: string]: Theme
}

export class ThemeIndex {
  private static instance: ThemeIndex | null = null

  private themes: Themes = {}

  private constructor() {
    this.addTheme(LightTheme)
    this.addTheme(DarkTheme)
    this.addTheme(OneDarkTheme)
  }

  public static getInstance(): ThemeIndex {
    if (this.instance === null) {
      this.instance = new ThemeIndex()
    }

    return this.instance
  }

  public addTheme(theme: Theme): void {
    this.themes[theme.id] = theme
  }

  public getThemes(): Array<Theme> {
    return Object.values(this.themes)
  }

  public getTheme(id: ThemeName): Theme {
    return this.themes[id]
  }
}

export function useTheme(): [Theme, (theme: Theme) => void] {
  const themeIndex = useMemo(() => ThemeIndex.getInstance(), [])
  const settings = useMemo(() => Settings.getInstance(), [])
  const [theme, setThemeState] = useState(themeIndex.getTheme(settings.getTheme()))
  const setTheme = useCallback((theme: Theme) => {
    settings.setTheme(theme.id)
    setThemeState(theme)
  }, [settings])

  return [theme, setTheme]
}
