/* eslint-disable @typescript-eslint/explicit-function-return-type */
//@ts-check

'use strict';

const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

/**@type {(config: import('webpack').Configuration) => import('webpack').Configuration}*/
const config = (config) => {
  if (config.mode === 'development') {
    config.plugins.push(
      new CopyPlugin([
        {
          from: path.join(process.cwd(), 'node_modules','vickymd', 'theme', '**', '*.css'),
          to: 'styles/theme',
          transformPath: (targetPath,) => {
            return targetPath.substr(0, 13) + targetPath.substr(40)
          }
        },
        {
          from: path.join(process.cwd(), 'node_modules', 'emoji-assets', 'png', '**', '*.png'),
          to: 'emoji',
          transformPath: (targetPath,) => {
            return targetPath.substr(0,6) + targetPath.substr(36)
          }
        }
      ])
    )
  }

  return config
}

module.exports = config
