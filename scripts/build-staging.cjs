const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'dist-new');
fs.rmSync(output, { recursive: true, force: true });
fs.cpSync(path.join(root, 'src'), output, { recursive: true, filter: source => path.basename(source) !== '.DS_Store' });
// Shared staging links must fetch their preview image from staging, while the
// canonical link still identifies the production portfolio.
for (const name of ['index.html', 'mobile-flight.html']) {
  const file = path.join(output, name);
  const html = fs.readFileSync(file, 'utf8').replace(
    /(<meta\b[^>]*\bcontent=")https:\/\/iamwillsaunders\.com\//g,
    '$1https://iamwillsaunders.com/new/'
  );
  fs.writeFileSync(file, html);
}
const { bundleLab } = require('./build-lab.cjs');
fs.writeFileSync(path.join(output, 'lab/app.js'), bundleLab().outputFiles[0].contents);
console.log('Active staging site and React component lab built in dist-new/');
