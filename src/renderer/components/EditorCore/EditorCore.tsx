import React, { useEffect, useRef, useContext, useState } from 'react'

import * as VickyMD from 'vickymd/core'

import 'react-perfect-scrollbar/dist/css/styles.css'
import PerfectScrollbar from 'react-perfect-scrollbar'

import './EditorCore.css'
import { NoteProvider } from '../App'
import { Editor } from 'codemirror'
import { useStyles } from './style'
import { ThemeProvider, ThemeContext } from '../ThemeProvider/ThemeProvider'
import { useEmojiHint, useCommandHint } from './hints'

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

export const EditorCore = (): JSX.Element => {
  const [theme] = useContext(ThemeProvider) as ThemeContext
  const note = useContext(NoteProvider)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const [editor, setEditor] = useState<Editor | null>(null)

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
    editor?.setValue(note?.getCurrentFileContents() || "")

    const setValue = (instance: Editor): void => {
      note?.setBufferedContents(instance.getValue())
    }

    editor?.on('change', setValue)

    return (): void => {
      editor?.off('change', setValue)
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
