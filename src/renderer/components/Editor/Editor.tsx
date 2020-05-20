import React, { useEffect, useRef, useContext, useState, useMemo } from "react"

import * as VickyMD from "vickymd/core"

import clsx from "clsx"

import "overlayscrollbars/css/OverlayScrollbars.css"
import { OverlayScrollbarsComponent } from "overlayscrollbars-react"

import { NoteProvider, EditorActions } from "../App"
import { Editor as CodeMirrorEditor } from "codemirror"
import { useStyles } from "./style"
import { ThemeProvider, ThemeContext } from "../ThemeProvider/ThemeProvider"
import { useEmojiHint, useCommandHint } from "./hints"
import { remote, MenuItemConstructorOptions } from "electron"
import { Box, Typography } from "@material-ui/core"
import { ContextMenuArea } from "../ContextMenuArea"

interface CursorPosition {
  ch: number
  line: number
}

const EDITOR_OPTIONS = {
  mode: {
    name: "hypermd",
    hashtag: true
  },
  hmdFold: {
    image: true,
    link: true,
    math: true,
    html: true,
    emoji: true,
    code: true
  }
}

interface EditorProps {
  setEditorActions: (editorActions: EditorActions) => void
}

export const Editor = (props: EditorProps): JSX.Element => {
  const [theme] = useContext(ThemeProvider) as ThemeContext
  const note = useContext(NoteProvider)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const scrollAreaRef = useRef<OverlayScrollbarsComponent>(null)
  const [loading, setLoading] = useState(true)
  const [editor, setEditor] = useState<CodeMirrorEditor | null>(null)
  const [cursorPosition, setCursorPosition] = useState<CursorPosition>({
    line: 0,
    ch: 0
  })

  const classes = useStyles()

  // Initilize Editor
  useEffect(() => {
    if (textAreaRef.current) {
      const editor = VickyMD.fromTextArea(textAreaRef.current, {
        mode: EDITOR_OPTIONS.mode,
        hmdFold: EDITOR_OPTIONS.hmdFold,
        showCursorWhenSelecting: true
      })
      editor.setOption("lineNumbers", false)
      editor.setOption("foldGutter", false)

      const onCursorActivity = (instance: CodeMirrorEditor): void => {
        const cursor = instance.getCursor()
        if (cursor) {
          setCursorPosition({
            line: cursor.line,
            ch: cursor.ch
          })
        }
      }

      editor.on("cursorActivity", onCursorActivity)

      setEditor(editor)

      // Small delay to ensure editor is fully loaded
      new Promise((resolve) => setTimeout(resolve, 500)).then(() => setLoading(false))

      return (): void => {
        editor.off("cursorActivity", onCursorActivity)
      }
    }
    return
  }, [])

  // Set editor actions for Menu
  const setEditorActions = props.setEditorActions
  useEffect(() => {
    if (editor) {
      setEditorActions({
        undo: editor.undo,
        redo: editor.redo,
        selectAll: () => editor.execCommand("selectAll")
      })
    }
  }, [editor, setEditorActions])

  const contextMenu = useMemo<Array<MenuItemConstructorOptions>>(
    () => [
      {
        label: "Undo",
        click: (): void => {
          editor?.undo()
        }
      },
      {
        label: "Redo",
        click: (): void => {
          editor?.redo()
        }
      },
      { type: "separator" },
      { role: "cut" },
      { role: "copy" },
      { role: "paste" },
      { role: "delete" },
      { type: "separator" },
      { role: "selectAll" },
      {
        label: "Select All",
        click: (): void => editor?.execCommand("selectAll")
      }
    ],
    [editor?.execCommand, editor?.redo, editor?.undo]
  )

  useEffect(() => {
    // Load note contents into editor
    editor?.setValue(note?.getCurrentFileContents() || "")

    // Clear the editors history to stop undoing to previous notes text
    editor?.clearHistory()

    // Focus editor
    editor?.focus()

    // Update notes contents for saving
    const setValue = (instance: CodeMirrorEditor): void => {
      note?.setBufferedContents(instance.getValue())
    }

    // Save note on window close
    const onClose = (): void => {
      note?.save()
    }

    editor?.on("change", setValue)

    const win = remote.getCurrentWindow()
    win.on("close", onClose)

    return (): void => {
      editor?.off("change", setValue)
      win.off("close", onClose)
    }
  }, [
    editor,
    editor?.clearHistory,
    editor?.focus,
    editor?.off,
    editor?.on,
    editor?.setValue,
    note,
    note?.getCurrentFileContents,
    note?.save,
    note?.setBufferedContents
  ])

  useEffect(() => {
    if (editor) {
      theme.themeEditor(editor)
    }
  }, [editor, theme])

  useCommandHint(editor)
  useEmojiHint(editor)

  return (
    <Box className={classes.editorPanel}>
      <ContextMenuArea menuTemplate={contextMenu} style={{ height: "100%" }}>
        <OverlayScrollbarsComponent
          className={theme.scrollTheme}
          options={{
            sizeAutoCapable: false,
            scrollbars: {
              autoHide: "scroll",
              autoHideDelay: 400
            }
          }}
          style={{ height: "100%" }}
          ref={scrollAreaRef}
        >
          <Box
            className={clsx(classes.editorWrapper, "os-host-flexbox")}
            style={{ visibility: loading ? "hidden" : undefined }}
          >
            <textarea className={classes.editor} ref={textAreaRef} />
          </Box>
        </OverlayScrollbarsComponent>
      </ContextMenuArea>
      <Box className={classes.bottomPanel}>
        <Box className={classes.row}>
          <Typography variant={"caption"} color={"textPrimary"}>
            {note?.name}
          </Typography>
        </Box>
        <Box className={classes.cursorPositionInfo}>
          <Typography variant={"caption"} color={"textPrimary"}>
            {`Ln ${cursorPosition.line + 1}, Col ${cursorPosition.ch}`}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
