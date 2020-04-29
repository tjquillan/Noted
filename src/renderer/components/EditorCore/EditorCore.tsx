import 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/htmlmixed/htmlmixed'
import 'codemirror/mode/stex/stex'
import 'codemirror/mode/yaml/yaml'

import 'vickymd'
import 'vickymd/powerpack/fold-math-with-katex'
import 'vickymd/powerpack/fold-code-with-mermaid'
import 'vickymd/powerpack/fold-code-with-plantuml'
import 'vickymd/powerpack/fold-code-with-echarts'
import 'vickymd/powerpack/fold-code-with-wavedrom'
import 'vickymd/powerpack/hover-with-marked'
import './powerpack/fold-emoji-with-joypixels'

import React, { useEffect, useRef, useContext, useState, useCallback } from 'react'

import * as VickyMD from 'vickymd/core'

import 'react-perfect-scrollbar/dist/css/styles.css'
import PerfectScrollbar from 'react-perfect-scrollbar'

import './EditorCore.css'
import { NoteProvider } from '../App'
import { Editor } from 'codemirror'
import { useStyles } from './style'
import { ThemeProvider, ThemeContext } from '../ThemeProvider/ThemeProvider'

// Set necessary window scope variables
// Gotten from: https://github.com/0xGG/crossnote/blob/32a4af1878b79bb8841f8a3d3f45ca50982455be/src/editor/index.ts#L41
// @ts-ignore
window["CodeMirror"] = require("codemirror");

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
  },
  hmdFoldCode: {
    flowchart: true,
    mermaid: true,
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
      const editor = VickyMD.fromTextArea(textAreaRef.current, EDITOR_OPTIONS)
      editor.setSize(null, '100%')
      editor.setOption("lineNumbers", false)
      editor.setOption("foldGutter", false)
      setEditor(editor)
    }
  }, [])

  const setValue = useCallback((instance: Editor) => {
    note?.setBufferedContents(instance.getValue())
  }, [note])

  useEffect(() => {
    editor?.setValue(note?.getCurrentFileContents() || "")
    editor?.on('change', setValue)
  }, [editor, note, setValue])

  useEffect(() => {
    if (editor) {
      theme.themeEditor(editor)
    }
  }, [editor, theme])

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
