const path = require("path")
const rimraf = require("rimraf")

exports.default = function (buildResult) {
  if (process.env.GITHUB_ACTIONS) {
    rimraf.sync(path.join(buildResult.outDir, "mac"))
    rimraf.sync(path.join(buildResult.outDir, "linux-unpacked"))
    rimraf.sync(path.join(buildResult.outDir, "win-unpacked"))
  }

  return []
}
