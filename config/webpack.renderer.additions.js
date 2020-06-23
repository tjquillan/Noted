/* eslint-disable @typescript-eslint/explicit-function-return-type */
//@ts-check

"use strict"

const path = require("path")
const CopyPlugin = require("copy-webpack-plugin")

/**@type {(config: import('webpack').Configuration) => import('webpack').Configuration}*/
const config = (config) => {
  if (config.mode === "development") {
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: path.join(process.cwd(), "node_modules", "vickymd", "theme"),
            to: "styles/theme",
            globOptions: {
              ignore: ["*.js", "*.scss", "*.ts", "*.map"]
            }
          },
          {
            from: path.join(process.cwd(), "node_modules", "emoji-assets", "png"),
            to: "emoji"
          }
          // {
          //   from: path.join(process.cwd(), "node_modules", "prismjs", "components"),
          //   to: "prismjs"
          // }
        ]
      })
    )
  }

  return config
}

module.exports = config
