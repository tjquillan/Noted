import React, { useState, createContext, useMemo, useCallback } from 'react';
import { Editor } from '../Editor';
import { Sidebar } from '../Sidebar';
import { Menu } from '../Menu';
import { Settings } from '../../util/Settings';
import { Notebook } from '../../util/Notebook';
import { Note } from '../../util/Note';
import { ThemeManager } from '../ThemeProvider/ThemeProvider';
import { createStyles, makeStyles, Box, CssBaseline } from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
    "@global": {
      '.CodeMirror': {
        height: '100% !important'
      }
    },
    mainPanel: {
      display: "flex",
      flexDirection: 'row',
      width: "100%",
      height: "100% "
    },
    editorPanel: {
      width: '100%',
      height: '100%'
    }
  }),
)

export const NotebookProvider = createContext<Notebook | null>(null)
export const NoteProvider = createContext<Note | null>(null)

export const App = (): JSX.Element => {
  const classes = useStyles()

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


  let mainView = null
  if (notebook) {
    mainView = (
      <Box className={classes.mainPanel}>
        <Sidebar setNote={setNote} />
        <div className={classes.editorPanel} hidden={!note}>
          <Editor />
        </div>
      </Box>
    )
  } else {
    mainView = (
      <text>Please Open A Notebook</text>
    )
  }

  return (
    <ThemeManager>
      <CssBaseline />
      <NotebookProvider.Provider value={notebook}>
        <NoteProvider.Provider value={note}>
          <Menu setNotebook={setNotebook} />
          {mainView}
        </NoteProvider.Provider>
      </NotebookProvider.Provider>
    </ThemeManager>
  )
}
