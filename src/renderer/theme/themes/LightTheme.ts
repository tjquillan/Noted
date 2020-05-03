import { Theme } from "../Theme"
import { blue, orange } from "@material-ui/core/colors"

export const LightTheme = new Theme(
  "Light",
  "light",
  {
    palette: {
      primary: blue,
      secondary: orange
    }
  },
  "os-theme-dark"
)
