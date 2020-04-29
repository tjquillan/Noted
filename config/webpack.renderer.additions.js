//@ts-check

'use strict';

const path = require('path');
const themePath = path.join(process.cwd(), 'node_modules','vickymd', 'theme', '**', '*.css')
const CopyPlugin = require('copy-webpack-plugin');

/**@type {import('webpack').Configuration}*/
const config = {
  plugins: [
    new CopyPlugin([
      { from: themePath,
        to: 'styles',
        transformPath: (targetPath, absolutePath) => {
          console.log(targetPath)
          return targetPath.substr(0, 7) + targetPath.substr(34)
        }
      },
    ]),
  ]
}

module.exports = config
