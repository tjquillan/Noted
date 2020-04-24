const fs = require('fs')
const path = require('path')

function rmdir(dirPath) {
  if (fs.existsSync(dirPath)) {
    var list = fs.readdirSync(dirPath);
    for (var i = 0; i < list.length; i++) {
        var filename = path.join(dirPath, list[i]);
        var stat = fs.statSync(filename);

        if (filename == "." || filename == "..") {
            // do nothing for current and parent dir
        } else if (stat.isDirectory()) {
            rmdir(filename);
        } else {
            fs.unlinkSync(filename);
        }
    }

    fs.rmdirSync(dirPath);
  }
}

exports.default = function (buildResult) {
  rmdir(path.join(buildResult.outDir, "mac"))
  rmdir(path.join(buildResult.outDir, "linux-unpacked"))
  rmdir(path.join(buildResult.outDir, "windows-unpacked"))

  return []
}
