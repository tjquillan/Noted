import { ThemeOptions, Theme as MuiTheme, createMuiTheme } from "@material-ui/core/styles";
import { ThemeName, setTheme } from "vickymd/theme";
import { Editor } from "codemirror";
import { getResourceHome } from "../util/paths";

export class Theme {
  private muiTheme: () => MuiTheme

  constructor(public readonly name: string, public id: ThemeName, themeOptions: ThemeOptions) {
    this.muiTheme = (): MuiTheme => createMuiTheme(themeOptions)
  }

  public getMuiTheme(): MuiTheme {
    return this.muiTheme()
  }

  public themeEditor(editor: Editor): void {
    setTheme({
      editor,
      themeName: this.id,
      baseUri: `${getResourceHome("styles", "theme")}/`
    })
  }
}
