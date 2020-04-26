import React, { useState, createContext } from 'react';
import { EditorCore } from '../EditorCore';
import { Sidebar } from '../Sidebar';
import { Menu } from '../Menu';
import { ThemeProvider } from '@material-ui/core/styles';
import { getTheme } from '../../util/themes';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Theme } from '../../types';
import { Settings } from '../../util/Settings';
import { Notebook } from '../../util/Notebook';

export const NotebookProvider = createContext<Notebook | null>(null)

export const App = (): JSX.Element => {
  const settings = Settings.getInstance()
  const [theme, setThemeState] = useState<Theme>(settings.getTheme())

  const currentNotebook = settings.getCurrentNotebook()
  const [ notebook, setNotebook ] = useState<Notebook | null>(currentNotebook ? new Notebook(currentNotebook) : null)

  function setTheme(theme: Theme): void {
    setThemeState(theme)
    settings.setTheme(theme)
  }

  function renderMainView(): JSX.Element {
    if (notebook) {
      return (
        <>
          <Sidebar />
          <EditorCore />
        </>
      )
    } else {
      return (
        <text>Please Open A Notebook</text>
      )
    }
  }

  return (
    <div className="App">
      <ThemeProvider theme={getTheme(theme)}>
        <CssBaseline />
        <NotebookProvider.Provider value={notebook}>
          <Menu setNotebook={setNotebook} theme={theme} setTheme={setTheme}/>
          {renderMainView()}
        </NotebookProvider.Provider>
      </ThemeProvider>
    </div>
  )
}
