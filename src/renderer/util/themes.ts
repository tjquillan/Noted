import { createMuiTheme, Theme } from '@material-ui/core/styles';
import { useMemo } from "react";

export function getTheme(darkMode: boolean): Theme {
  return useMemo(() => createMuiTheme({
    palette: {
      type: darkMode ? 'dark' : 'light'
    }
  }), [darkMode])
}
