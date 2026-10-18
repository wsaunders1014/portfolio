const fs = require('node:fs');
const path = require('node:path');
const esbuild = require('esbuild');

function minifyAsset(content, filename) {
  const extension = path.extname(filename).toLowerCase();
  if (!['.js', '.css'].includes(extension)) return content;
  // No format or bundling: classic-script globals and module imports retain
  // their existing scope and paths, including the archived client demos.
  const result = esbuild.transformSync(content.toString(), {
    loader: extension === '.css' ? 'css' : 'js',
    minify: true,
    legalComments: 'inline',
    sourcefile: filename
  });
  return Buffer.from(result.code);
}

function minifyDirectory(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) minifyDirectory(filename);
    else if (/\.(js|css)$/i.test(entry.name)) {
      fs.writeFileSync(filename, minifyAsset(fs.readFileSync(filename), filename));
    }
  }
}

module.exports = { minifyAsset, minifyDirectory };
