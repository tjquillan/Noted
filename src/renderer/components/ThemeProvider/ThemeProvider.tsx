import React, { PropsWithChildren, createContext } from "react"
import { useTheme } from "../../theme/ThemeIndex"
import { Theme } from "../../theme/Theme"
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles"

export type ThemeContext = [Theme, (theme: Theme) => void]

export const ThemeProvider = createContext<ThemeContext | null>(null)

export const ThemeManager = (props: PropsWithChildren<{}>): JSX.Element => {
  const [theme, setTheme] = useTheme()

  return (
    <ThemeProvider.Provider value={[theme, setTheme]}>
      <MuiThemeProvider theme={theme.getMuiTheme()}>{props.children}</MuiThemeProvider>
    </ThemeProvider.Provider>
  )
}
