const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const name = process.argv[2];
assert.ok(['dist', 'dist-new'].includes(name));
function inventory(directory, prefix = '') {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const relative = prefix + entry.name;
    assert.ok(!entry.isSymbolicLink(), `Symlink in build: ${relative}`);
    if (entry.name === '.DS_Store') return [];
    return entry.isDirectory() ? inventory(path.join(directory, entry.name), relative + '/') : [relative];
  });
}
assert.deepEqual(inventory(path.join(root, name)).sort(), [...inventory(path.join(root, 'src')), 'lab/app.js'].sort());
const htaccess = fs.readFileSync(path.join(root, name, '.htaccess'), 'utf8');
const robots = fs.readFileSync(path.join(root, name, 'robots.txt'), 'utf8');
if (name === 'dist') {
  assert.ok(htaccess.includes('DirectoryIndex index.html index.php'));
  assert.ok(!htaccess.includes('noindex'));
  assert.ok(!robots.includes('Disallow: /\n'));
} else {
  assert.ok(htaccess.includes('noindex'));
  assert.ok(robots.includes('Disallow: /\n'));
}
console.log(`${name}: exact source inventory plus compiled lab; indexing settings verified.`);
