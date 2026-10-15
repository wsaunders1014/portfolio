const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'dist-new');
fs.rmSync(output, { recursive: true, force: true });
fs.cpSync(path.join(root, 'src'), output, { recursive: true, filter: source => path.basename(source) !== '.DS_Store' });
console.log('Active staging site built in dist-new/');
