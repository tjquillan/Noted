import React, { useEffect, useRef, useContext, useState } from 'react'

import * as VickyMD from 'vickymd/core'

import 'react-perfect-scrollbar/dist/css/styles.css'
import PerfectScrollbar from 'react-perfect-scrollbar'

import './Editor.css'
import { NoteProvider } from '../App'
import { Editor as CodeMirrorEditor } from 'codemirror'
import { useStyles } from './style'
import { ThemeProvider, ThemeContext } from '../ThemeProvider/ThemeProvider'
import { useEmojiHint, useCommandHint } from './hints'
import { remote } from 'electron'

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

export const Editor = (): JSX.Element => {
  const [theme] = useContext(ThemeProvider) as ThemeContext
  const note = useContext(NoteProvider)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const [editor, setEditor] = useState<CodeMirrorEditor | null>(null)

  const classes = useStyles()

  useEffect(() => {
    if (textAreaRef.current) {
      const editor = VickyMD.fromTextArea(textAreaRef.current, {
        mode: EDITOR_OPTIONS.mode,
        hmdFold: EDITOR_OPTIONS.hmdFold,
        showCursorWhenSelecting: true
      })
      editor.setOption("lineNumbers", false)
      editor.setOption("foldGutter", false)
      setEditor(editor)
    }
  }, [])

  useEffect(() => {
    // Clear history of previous note
    remote.getCurrentWebContents().clearHistory()
    editor?.clearHistory()

    // Load note contents into editor
    editor?.setValue(note?.getCurrentFileContents() || "")

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

    editor?.on('change', setValue)

    const win = remote.getCurrentWindow()
    win.on('close', onClose)

    return (): void => {
      editor?.off('change', setValue)
      win.off('close', onClose)
    }
  }, [editor, note])

  useEffect(() => {
    if (editor) {
      theme.themeEditor(editor)
    }
  }, [editor, theme])

  useCommandHint(editor)
  useEmojiHint(editor)

  return (
    <div className="EditorCore">
      <PerfectScrollbar>
        <div className={classes.editorWrapper}>
          <textarea className={classes.editor} ref={textAreaRef} />
        </div>
      </PerfectScrollbar>
    </div>
  )
}
