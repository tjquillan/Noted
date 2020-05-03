import { ThemeName } from 'vickymd/theme';
import Store from 'electron-store'


const SCHEMA = {
  theme: {
    type: "string" as "string"
  }
}

export class Settings {
  private static instance: Settings
  private readonly store: Store


  private constructor() {
    this.store = new Store({
      name: 'settings',
      schema: SCHEMA
    })
  }

  public static getInstance(): Settings {
    if (!this.instance) {
      this.instance = new Settings()
    }

    return this.instance
  }

  public getTheme(): ThemeName {
    return this.store.get('theme', 'one-dark')
  }

  public setTheme(theme: ThemeName): void {
    this.store.set('theme', theme)
  }
}
