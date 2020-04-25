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

import React, { useEffect, useRef } from 'react'

import * as VickyMD from 'vickymd'

import 'react-perfect-scrollbar/dist/css/styles.css'
import PerfectScrollbar from 'react-perfect-scrollbar'

import './EditorCore.css'
import './hyperMD.css'

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

interface EditorCoreProps {
    initialValue?: string
}

export const EditorCore = (props: EditorCoreProps) => {
    const textAreaRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        if (textAreaRef.current) {
            let editor = VickyMD.fromTextArea(textAreaRef.current, EDITOR_OPTIONS)
            editor.setSize(null, '100%')
            editor.setValue(props.initialValue || "")
        }
    }, [props.initialValue])

    return (
        <div className="EditorCore">
            <PerfectScrollbar>
              <div className='EditorCoreTextArea-wrapper'>
                  <textarea className="EditorCoreTextArea" ref={textAreaRef} />
              </div>
            </PerfectScrollbar>
        </div>
    )
}
