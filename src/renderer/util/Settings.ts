import { ThemeName } from "vickymd/theme"
import Store from "electron-store"

export class Settings {
  private static instance: Settings
  private readonly store: Store<Record<string, string>>

  private constructor() {
    this.store = new Store({
      name: "settings"
    })
  }

  public static getInstance(): Settings {
    if (!this.instance) {
      this.instance = new Settings()
    }

    return this.instance
  }

  public getTheme(): ThemeName {
    return this.store.get("theme", "one-dark") as ThemeName
  }

  public setTheme(theme: ThemeName): void {
    this.store.set("theme", theme)
  }
}
