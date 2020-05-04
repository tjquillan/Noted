/* VickyMD
 * Distributed under AGPL3
 *
 * Please include the following in your index.html file
 *
 *   <script src="https://cdn.jsdelivr.net/npm/yamljs@0.3.0/dist/yaml.min.js"></script>
 *   <script src="https://cdn.jsdelivr.net/npm/echarts-gl@1.1.1/dist/echarts-gl.min.js"></script>
 *
 */

import * as CodeMirror from "codemirror"
import { registerRenderer, CodeRenderer, getAddon as getFoldCode, convertNumberToString } from "vickymd/addon/fold-code"
import { getAddon as getFold } from "vickymd/addon/fold"
import * as YAML from "yamljs"
import * as echarts from "echarts"

export const EchartsRenderer: CodeRenderer = (code, info) => {
  const id = "_echarts_id_" + Math.round(1e9 * Math.random()).toString(36)

  const el = document.createElement("div")
  el.setAttribute("id", id)
  el.style.width = convertNumberToString(info.attributes["width"], "400px")
  el.style.height = convertNumberToString(info.attributes["height"], "400px")
  el.style.maxWidth = info.attributes["maxWidth"] || "100%"

  try {
    let option = {}
    if (code.trim()[0] !== "{") {
      option = YAML.parse(code)
    } else {
      option = JSON.parse(code)
    }
    const myChart = echarts.init(el)
    myChart.setOption(option)
    if (info.changed) {
      info.changed()
    }
  } catch (error) {
    el.innerText = error.toString()
  }
  return {
    element: el
  }
}

CodeMirror.defineOption("echarts", null, (cm: CodeMirror.Editor) => {
  getFoldCode(cm).clear("echarts")
  getFold(cm).startFold()
})

registerRenderer({
  name: "echarts",
  pattern: /^echarts(\s*$|\s+\{)/i,
  renderer: EchartsRenderer,
  suggested: true
})

/*

# Example

```echarts
 {
    "title": {
        "text": "ECharts entry example"
    },
    "tooltip": {},
    "legend": {
        "data":["Sales"]
    },
    "xAxis": {
        "data": ["shirt","cardign","chiffon shirt","pants","heels","socks"]
    },
    "yAxis": {},
    "series": [{
        "name": "Sales",
        "type": "bar",
        "data": [5, 20, 36, 10, 10, 20]
    }]
}
```
*/
