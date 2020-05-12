import * as CodeMirror from "codemirror"
import { registerRenderer, CodeRenderer, getAddon as getFoldCode } from "vickymd/addon/fold-code"
import { getAddon as getFold } from "vickymd/addon/fold"
import Prism from "prismjs"

const loadTheme = (): void => require("prismjs/themes/prism-twilight.css")

loadTheme()

const PrismRenderer: CodeRenderer = (code, info) => {
  const mainElement = document.createElement("pre")
  const codeElement = document.createElement("code")

  codeElement.className = `language-${info.lang}`
  codeElement.innerHTML = Prism.highlight(code, Prism.languages[info.lang], info.lang)
  mainElement.appendChild(codeElement)

  return {
    element: mainElement
  }
}

for (const lang in Prism.languages) {
  CodeMirror.defineOption(lang, null, (cm: CodeMirror.Editor) => {
    getFoldCode(cm).clear(lang)
    getFold(cm).startFold()
  })

  registerRenderer({
    name: lang,
    pattern: new RegExp(`^${lang}$`, "i"),
    renderer: PrismRenderer,
    suggested: true
  })
}
