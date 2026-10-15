const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const target = '/opt/bitnami/apache/htdocs/new';
const host = 'bitnami@23.21.42.189';
const key = path.join(os.homedir(), 'Downloads/LightsailDefaultKey-us-east-1.pem');
const options = ['-i', key, '-o', 'IdentitiesOnly=yes', '-o', 'BatchMode=yes', '-o', 'ConnectTimeout=15'];
const shellQuote = value => "'" + value.replace(/'/g, "'\\''") + "'";
const sftpQuote = value => '"' + value.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
const manifestName = '.portfolio-deploy.json';
const remoteScript = String.raw`
import os,sys,json,hashlib
root='/opt/bitnami/apache/htdocs/new'
data=json.load(sys.stdin)
if os.path.realpath(root)!=root: raise RuntimeError('Staging path is a symlink; refusing deployment')
def safe(name):
 if not name or name.startswith('/') or any(p in ('','..','.') for p in name.split('/')): raise RuntimeError('Unsafe deployment path')
 result=os.path.join(root,name)
 if os.path.commonpath([root,os.path.realpath(result)])!=root: raise RuntimeError('Path escapes staging directory')
 return result
def digest(file):
 with open(file,'rb') as f: return hashlib.file_digest(f,'sha256').hexdigest() if hasattr(hashlib,'file_digest') else hashlib.sha256(f.read()).hexdigest()
manifest=safe('.portfolio-deploy.json')
previous=json.load(open(manifest)) if os.path.isfile(manifest) else {'files':{}}
if previous.get('version') not in (None,1): raise RuntimeError('Unknown staging manifest')
files=data['files']
for name in files: safe(name)
removed=[name for name in previous.get('files',{}) if name not in files]
for name in removed: safe(name)
if data['operation']=='inspect':
 print(json.dumps({'hashes':{name:digest(safe(name)) for name in files if os.path.isfile(safe(name))},'removed':removed}))
elif data['operation']=='prepare':
 os.makedirs(root,exist_ok=True)
 for name in data['changed']: os.makedirs(os.path.dirname(safe(name)),exist_ok=True)
elif data['operation']=='verify':
 for name,expected in files.items():
  if digest(safe(name))!=expected: raise RuntimeError('Upload verification failed: '+name)
 for name in removed:
  file=safe(name)
  if os.path.isfile(file): os.unlink(file)
 print('All active file hashes verified; managed obsolete files removed.')
`;
function remote(operation, files, extra = {}) {
  return execFileSync('ssh', [...options, host, 'python3 -c ' + shellQuote(remoteScript)], {
    input: JSON.stringify({ operation, files, ...extra }), encoding: 'utf8', timeout: 120000
  });
}
function inventory(directory, prefix = '') {
  const result = {};
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const relative = prefix + entry.name;
    if (entry.isDirectory()) Object.assign(result, inventory(path.join(directory, entry.name), relative + '/'));
    else if (entry.isFile()) result[relative] = crypto.createHash('sha256').update(fs.readFileSync(path.join(directory, entry.name))).digest('hex');
    else throw new Error('Symlinks are not allowed in the staging package');
  }
  return result;
}
function transfer(commands) {
  execFileSync('sftp', [...options, '-b', '-', host], { input: commands.join('\n') + '\n', stdio: ['pipe', 'inherit', 'inherit'], timeout: 600000 });
}
function deploy() {
  execFileSync(process.execPath, [path.join(__dirname, 'build-staging.cjs')], { stdio: 'inherit' });
  const directory = path.join(root, 'dist-new');
  const files = inventory(directory);
  const current = JSON.parse(remote('inspect', files));
  const changed = Object.keys(files).filter(name => current.hashes[name] !== files[name]);
  if (!changed.length && !current.removed.length) { console.log('No changes to upload.'); return; }
  const bytes = changed.reduce((sum, name) => sum + fs.statSync(path.join(directory, name)).size, 0);
  console.log(`Uploading ${changed.length} changed files (${(bytes / 1024).toFixed(1)} KiB) to /new only.`);
  remote('prepare', files, { changed });
  const nonce = crypto.randomBytes(8).toString('hex');
  const commands = [];
  for (const name of changed) {
    const final = target + '/' + name;
    const temporary = final + '.upload-' + nonce;
    commands.push(`put ${sftpQuote(path.join(directory, name))} ${sftpQuote(temporary)}`, `rename ${sftpQuote(temporary)} ${sftpQuote(final)}`);
  }
  if (commands.length) transfer(commands);
  console.log(remote('verify', files).trim());
  const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-deploy-'));
  try {
    const manifest = path.join(scratch, manifestName);
    fs.writeFileSync(manifest, JSON.stringify({ version: 1, files }, null, 2));
    transfer([`put ${sftpQuote(manifest)} ${sftpQuote(target + '/' + manifestName + '.upload-' + nonce)}`, `rename ${sftpQuote(target + '/' + manifestName + '.upload-' + nonce)} ${sftpQuote(target + '/' + manifestName)}`]);
  } finally { fs.rmSync(scratch, { recursive: true, force: true }); }
  console.log('Staging updated: https://iamwillsaunders.com/new/');
}
function run() {
  try { deploy(); } catch (error) { console.error('Staging deployment failed:', error.message); return false; }
  return true;
}
if (process.argv.includes('--watch')) {
  console.log('Watching src/; saved changes deploy to /new after a short debounce.');
  let timer;
  fs.watch(path.join(root, 'src'), { recursive: true }, (_event, file) => {
    if (file && path.basename(file) === '.DS_Store') return;
    clearTimeout(timer);
    timer = setTimeout(run, 1500);
  });
  run();
} else if (!run()) process.exitCode = 1;
