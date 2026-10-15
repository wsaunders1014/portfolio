const esbuild = require('esbuild');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
function bundleLab(development = false) {
  return esbuild.buildSync({ absWorkingDir: root, entryPoints: ['src/lab/source/main.tsx'], bundle: true, minify: !development, write: false, outfile: 'lab/app.js', format: 'iife', target: ['es2022'], jsx: 'automatic', tsconfig: 'tsconfig.lab.json', metafile: true, define: { 'process.env.NODE_ENV': JSON.stringify(development ? 'development' : 'production') } });
}
module.exports = { bundleLab };
