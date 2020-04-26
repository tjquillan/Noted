import { createMuiTheme, Theme } from '@material-ui/core/styles';
import { useMemo } from "react";

export function getTheme(theme: 'light' | 'dark'): Theme {
  return useMemo(() => createMuiTheme({
    palette: {
      type: theme
    }
  }), [theme])
}
