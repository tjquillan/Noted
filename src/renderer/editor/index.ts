// Import VickyMD related modules
import "codemirror"
import "codemirror/lib/codemirror.css"
import "codemirror/addon/hint/show-hint.css"
import "codemirror/addon/dialog/dialog.css"
import "codemirror/mode/htmlmixed/htmlmixed" // for embedded HTML
import "codemirror/mode/markdown/markdown"
import "codemirror/mode/stex/stex" // for Math TeX Formular
import "codemirror/mode/yaml/yaml" // for Front Matters
import "codemirror/mode/javascript/javascript" // eg. javascript
import "codemirror/mode/python/python"
import "codemirror/addon/display/placeholder"
import "codemirror/addon/hint/show-hint"

import "vickymd"
import "./powerpack/fold-code-with-mermaid"
import "./powerpack/fold-code-with-echarts"
import "vickymd/powerpack/hover-with-marked"
import "./powerpack/fold-math-with-katex"
import "./powerpack/fold-emoji-with-joypixels"

// Set necessary window scope variables
// Gotten from: https://github.com/0xGG/crossnote/blob/32a4af1878b79bb8841f8a3d3f45ca50982455be/src/editor/index.ts#L41
// @ts-ignore
window["CodeMirror"] = require("codemirror")
