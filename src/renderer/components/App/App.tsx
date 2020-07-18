import React, { useState, createContext, useMemo, useCallback } from "react"
import { Editor } from "../Editor"
import { Sidebar } from "../Sidebar"
import { Menu } from "../Menu"
import { Cache } from "../../util/Cache"
import { Notebook } from "../../util/Notebook"
import { Note } from "../../util/Note"
import { ThemeManager } from "../ThemeProvider/ThemeProvider"
import { createStyles, makeStyles, Box, CssBaseline } from "@material-ui/core"

const useStyles = makeStyles(() =>
  createStyles({
    "@global": {
      ".CodeMirror": {
        height: "100% !important"
      }
    },
    mainPanel: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      height: "100% "
    },
    editorPanel: {
      width: "100%",
      height: "100%"
    }
  })
)

export const NotebookProvider = createContext<Notebook | null>(null)
export const NoteProvider = createContext<Note | null>(null)

export type EditorActions = {
  undo: () => void
  redo: () => void
  selectAll: () => void
}

export const App = (): JSX.Element => {
  const classes = useStyles()

  const cache = useMemo(() => Cache.getInstance(), [])

  const currentNotebook = cache.getCurrentNotebook()
  const [notebook, setNotebookState] = useState<Notebook | null>(currentNotebook ? new Notebook(currentNotebook) : null)

  const setNotebook = useCallback(
    (notebook: string) => {
      setNotebookState(new Notebook(notebook))
      cache.setCurrentNotebook(notebook)
    },
    [cache]
  )

  const currentNote = cache.getCurrentNote()
  const [note, setNoteState] = useState<Note | null>(currentNote && notebook ? notebook.getNote(currentNote) : null)

  const setNote = useCallback(
    (newNote: Note) => {
      note?.save()
      setNoteState(newNote)
      cache.setCurrentNote(newNote.name)
    },
    [cache, note]
  )

  const [editorActions, setEditorActions] = useState<EditorActions>({
    undo: () => {},
    redo: () => {},
    selectAll: () => {}
  })

  let mainView = null
  if (notebook) {
    mainView = (
      <Box className={classes.mainPanel}>
        <Sidebar setNote={setNote} />
        <div className={classes.editorPanel} hidden={!note}>
          <Editor setEditorActions={setEditorActions} />
        </div>
      </Box>
    )
  } else {
    mainView = <span>Please Open A Notebook</span>
  }

  return (
    <ThemeManager>
      <CssBaseline />
      <NotebookProvider.Provider value={notebook}>
        <NoteProvider.Provider value={note}>
          <Menu editorActions={editorActions} setNotebook={setNotebook} />
          {mainView}
        </NoteProvider.Provider>
      </NotebookProvider.Provider>
    </ThemeManager>
  )
}
