import React, { useState, createContext, useMemo, useCallback } from 'react';
import { EditorCore } from '../EditorCore';
import { Sidebar } from '../Sidebar';
import { Menu } from '../Menu';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Settings } from '../../util/Settings';
import { Notebook } from '../../util/Notebook';
import { Note } from '../../util/Note';
import { ThemeManager } from '../ThemeProvider/ThemeProvider';

export const NotebookProvider = createContext<Notebook | null>(null)
export const NoteProvider = createContext<Note | null>(null)

export const App = (): JSX.Element => {
  const settings = useMemo(() => Settings.getInstance(), [])

  const currentNotebook = settings.getCurrentNotebook()
  const [notebook, setNotebookState] = useState<Notebook | null>(currentNotebook ? new Notebook(currentNotebook) : null)

  const setNotebook = useCallback((notebook: string) => {
    setNotebookState(new Notebook(notebook))
    settings.setCurrentNotebook(notebook)
  }, [settings])

  const [note, setNoteState] = useState<Note | null>(null)

  const setNote = useCallback((newNote: Note) => {
    note?.save()
    setNoteState(newNote)
  }, [note])

  const mainView = useMemo(() => {
    if (notebook) {
      return (
        <NoteProvider.Provider value={note}>
          <Sidebar setNote={setNote} />
          <EditorCore />
        </NoteProvider.Provider>
      )
    } else {
      return (
        <text>Please Open A Notebook</text>
      )
    }
  }, [notebook, note, setNote])

  return (
    <ThemeManager>
      <div className="App">
        <CssBaseline />
        <NotebookProvider.Provider value={notebook}>
          <Menu setNotebook={setNotebook} />
          {mainView}
        </NotebookProvider.Provider>
      </div>
    </ThemeManager>
  )
}
