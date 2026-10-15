#!/usr/bin/env python3
"""Installed on Lightsail as a forced SSH command; never served by Apache."""
import base64
import fcntl
import hashlib
import json
import os
import re
import shutil
import sys
import tempfile
from pathlib import Path


def digest(path):
    value = hashlib.sha256()
    with path.open('rb') as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b''):
            value.update(chunk)
    return value.hexdigest()


def fingerprint(value):
    return hashlib.sha256(json.dumps(value, sort_keys=True).encode()).hexdigest()


class Deployment:
    def __init__(self, root, state, backups, environment):
        self.root = Path(root)
        self.state = Path(state)
        self.backups = Path(backups)
        self.environment = environment
        assert self.root.resolve() == self.root, 'Deployment root must not be a symlink'

    def target(self, name, base=None):
        assert isinstance(name, str) and name and not name.startswith('/')
        assert '\\' not in name and all(p not in ('', '.', '..') for p in name.split('/'))
        assert name.split('/')[0] not in ('new', 'backup', 'reference', '.git', '.ssh', '_dev')
        assert not any(part.startswith('.portfolio-') for part in name.split('/'))
        base = self.root if base is None else Path(base)
        path = base / name
        assert os.path.commonpath([str(base.resolve()), str(path.resolve())]) == str(base.resolve()), 'Path escapes deployment root'
        assert not path.is_symlink(), 'Refusing symlink'
        return path

    def manifest(self, files):
        assert isinstance(files, dict) and 0 < len(files) <= 10000
        assert all(name in files for name in ('index.html', '.htaccess', 'robots.txt'))
        for name, value in files.items():
            self.target(name)
            assert re.fullmatch(r'[a-f0-9]{64}', value), 'Invalid file digest'

    def current(self):
        info = json.loads(self.state.read_text())
        self.manifest(info['files'])
        return info

    def hashes(self, files):
        return {name: digest(self.target(name)) for name in files if self.target(name).is_file()}

    @staticmethod
    def write_json(path, value):
        path.parent.mkdir(parents=True, exist_ok=True)
        fd, temporary = tempfile.mkstemp(dir=str(path.parent))
        try:
            with os.fdopen(fd, 'w') as output:
                json.dump(value, output, indent=2)
            os.chmod(temporary, 0o600)
            os.replace(temporary, path)
        finally:
            if os.path.exists(temporary): os.unlink(temporary)

    @staticmethod
    def replace(source, target):
        target.parent.mkdir(parents=True, exist_ok=True)
        fd, temporary = tempfile.mkstemp(prefix='.portfolio-upload-', dir=str(target.parent))
        os.close(fd)
        try:
            shutil.copy2(str(source), temporary)
            os.replace(temporary, target)
        finally:
            if os.path.exists(temporary): os.unlink(temporary)

    def inspect(self, request):
        self.manifest(request['files'])
        state = self.current()
        return {'state': fingerprint(state), 'hashes': self.hashes(request['files'])}

    def verify(self, files):
        assert self.hashes(files) == files, 'Deployed file hash mismatch'

    def restore(self, folder, record):
        for name in record['affected']:
            target = self.target(name)
            saved = self.target(name, folder / 'previous')
            if name in record['previous_hashes']:
                self.replace(saved, target)
                assert digest(target) == record['previous_hashes'][name]
            elif target.is_file():
                target.unlink()
        self.write_json(self.state, record['before'])
        record['status'] = 'rolled-back'
        self.write_json(folder / 'release.json', record)

    def apply(self, request):
        files = request['files']
        self.manifest(files)
        before = self.current()
        assert request['state'] == fingerprint(before), 'Deployment state changed; rerun the job'
        baseline = self.hashes(files)
        assert baseline == request['baseline'], 'Server files changed after inspection'
        changed = {name for name, value in files.items() if baseline.get(name) != value}
        assert set(request['changes']) == changed, 'Incomplete or unexpected delta'
        removed = set(before['files']) - set(files)
        affected = sorted(changed | removed, key=lambda name: (name == 'index.html', name))
        revision = request['revision']
        assert re.fullmatch(r'[a-f0-9]{40}', revision), 'Invalid commit'
        if not affected:
            self.verify(files)
            self.write_json(self.state, dict(before, revision=revision))
            return {'release': None, 'changed': 0, 'removed': 0}
        release_id = request['release']
        assert re.fullmatch(r'[a-zA-Z0-9-]{1,100}', release_id)
        folder = self.backups / release_id
        folder.mkdir(parents=True, mode=0o700)
        assert not (folder / 'release.json').exists(), 'Release ID already used'
        incoming = folder / 'incoming'
        previous = folder / 'previous'
        previous_hashes = {}
        for name in affected:
            target = self.target(name)
            assert not target.exists() or target.is_file(), 'File/directory conflict'
            if target.is_file():
                saved = self.target(name, previous)
                saved.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(str(target), str(saved))
                previous_hashes[name] = digest(saved)
        for name, encoded in request['changes'].items():
            contents = base64.b64decode(encoded, validate=True)
            assert hashlib.sha256(contents).hexdigest() == files[name], 'Corrupted upload'
            path = self.target(name, incoming)
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(contents)
            path.chmod(0o644)
        # Preserve production PHP fallbacks and staging's indexing protection.
        def release_bytes(name):
            return self.target(name, incoming).read_bytes() if name in changed else self.target(name).read_bytes()
        htaccess, robots = release_bytes('.htaccess'), release_bytes('robots.txt')
        if self.environment == 'production':
            assert b'noindex' not in htaccess.lower() and b'Disallow: /\n' not in robots
            assert b'DirectoryIndex index.html index.php' in htaccess
        else:
            assert b'noindex' in htaccess.lower() and b'Disallow: /\n' in robots
        record = {'before': before, 'files': files, 'revision': revision, 'affected': affected,
                  'previous_hashes': previous_hashes, 'status': 'activating'}
        self.write_json(folder / 'release.json', record)
        try:
            for name in sorted(changed, key=lambda name: (name == 'index.html', name)):
                self.replace(self.target(name, incoming), self.target(name))
            for name in removed:
                path = self.target(name)
                if path.is_file(): path.unlink()
            self.verify(files)
            self.write_json(self.state, {'files': files, 'revision': revision, 'release': release_id})
            record['status'] = 'active'
            self.write_json(folder / 'release.json', record)
        except Exception:
            self.restore(folder, record)
            raise
        return {'release': release_id, 'changed': len(changed), 'removed': len(removed)}

    def rollback(self, request):
        release_id = request['release']
        assert re.fullmatch(r'[a-zA-Z0-9-]{1,100}', release_id)
        assert self.current().get('release') == release_id, 'A newer deployment is active'
        folder = self.backups / release_id
        record = json.loads((folder / 'release.json').read_text())
        assert record['status'] == 'active'
        self.restore(folder, record)
        return {'status': 'rolled-back', 'release': release_id}


def main():
    environment = sys.argv[1]
    assert environment in ('staging', 'production')
    operation = os.environ.get('SSH_ORIGINAL_COMMAND', '')
    assert operation in ('inspect', 'apply', 'rollback'), 'Unsupported deployment operation'
    home = Path('/home/bitnami/portfolio-ci')
    root = Path('/opt/bitnami/apache/htdocs')
    if environment == 'staging': root = root / 'new'
    engine = Deployment(root, home / 'state' / (environment + '.json'), home / 'backups' / environment, environment)
    request = json.load(sys.stdin)
    # Both environments share a server lock because staging is inside htdocs.
    with (home / 'deploy.lock').open('a') as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        print(json.dumps(getattr(engine, operation)(request)))


if __name__ == '__main__':
    try:
        main()
    except Exception as error:
        print('Deployment rejected: ' + str(error), file=sys.stderr)
        sys.exit(1)
