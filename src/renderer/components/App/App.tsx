import React, { useState } from 'react';
import { EditorCore } from '../EditorCore';
import { Sidebar } from '../Sidebar';
import { Menu } from '../Menu';
import { ThemeProvider } from '@material-ui/core/styles';
import { getTheme } from '../../util/themes';
import CssBaseline from '@material-ui/core/CssBaseline';

export const App = (): JSX.Element => {
  const [darkTheme, setDarkTheme] = useState(true)

  return (
    <div className="App">
      <ThemeProvider theme={getTheme(darkTheme)}>
        <CssBaseline />
        <Menu setTheme={setDarkTheme}/>
        <Sidebar />
        <EditorCore />
      </ThemeProvider>
    </div>
  )
}
