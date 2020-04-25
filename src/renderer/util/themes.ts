import { createMuiTheme } from "@material-ui/core/styles";
import { useMemo } from "react";

export function getTheme(darkMode: boolean) {
  return useMemo(() => createMuiTheme({
    palette: {
      type: darkMode ? 'dark' : 'light'
    }
  }), [darkMode])
}
