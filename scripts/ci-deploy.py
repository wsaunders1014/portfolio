#!/usr/bin/env python3
"""Send only changed build files through the environment's restricted SSH key."""
import base64
import hashlib
import json
import os
import subprocess
import sys
import time
import urllib.request
from pathlib import Path


def main():
    environment = sys.argv[1]
    assert environment in ('staging', 'production')
    branch = 'master' if environment == 'production' else 'dev'
    assert os.environ.get('GITHUB_REF') == 'refs/heads/' + branch, 'Wrong branch for target'
    root = Path(__file__).resolve().parent.parent
    output = root / ('dist' if environment == 'production' else 'dist-new')
    files, paths = {}, {}
    for path in output.rglob('*'):
        assert not path.is_symlink(), 'Symlinks cannot be deployed'
        if path.is_file():
            name = path.relative_to(output).as_posix()
            files[name] = hashlib.sha256(path.read_bytes()).hexdigest()
            paths[name] = path
    source = {p.relative_to(root / 'src').as_posix() for p in (root / 'src').rglob('*') if p.is_file() and p.name != '.DS_Store'}
    assert set(files) == source | {'lab/app.js'}, 'Build contains missing or unexpected files'
    ssh = ['ssh', '-i', os.environ['PORTFOLIO_SSH_KEY'], '-o', 'IdentitiesOnly=yes',
           '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=yes', '-o', 'ConnectTimeout=20',
           '-o', 'UserKnownHostsFile=' + str(root / 'config/deploy/known_hosts'), 'bitnami@23.21.42.189']

    def remote(operation, payload):
        result = subprocess.run(ssh + [operation], input=json.dumps(payload), text=True, capture_output=True, timeout=600)
        if result.returncode:
            raise RuntimeError(result.stderr.strip() or 'SSH deployment failed')
        return json.loads(result.stdout)

    current = remote('inspect', {'files': files})
    changed = {name: base64.b64encode(paths[name].read_bytes()).decode()
               for name, value in files.items() if current['hashes'].get(name) != value}
    size = sum(paths[name].stat().st_size for name in changed)
    revision = os.environ['GITHUB_SHA']
    release = os.environ['GITHUB_RUN_ID'] + '-' + os.environ['GITHUB_RUN_ATTEMPT'] + '-' + revision[:8]
    print('Uploading {} changed files ({:.1f} KiB) to {}.'.format(len(changed), size / 1024, environment), flush=True)
    result = remote('apply', {'files': files, 'state': current['state'], 'baseline': current['hashes'],
                              'changes': changed, 'revision': revision, 'release': release})
    base = 'https://iamwillsaunders.com/' + ('new/' if environment == 'staging' else '')

    def smoke():
        checks = {'': 'index.html', 'css/flight.css': 'css/flight.css', 'js/flight.js': 'js/flight.js',
                  'js/starfield.js': 'js/starfield.js', 'lab/': 'lab/index.html', 'lab/app.js': 'lab/app.js',
                  'robots.txt': 'robots.txt', 'media/Will_Saunders_Resume_Updated.pdf': 'media/Will_Saunders_Resume_Updated.pdf'}
        for url, name in checks.items():
            with urllib.request.urlopen(base + url, timeout=25) as response:
                assert response.status == 200
                assert hashlib.sha256(response.read()).hexdigest() == files[name], 'HTTP content mismatch: ' + url
                noindex = 'noindex' in (response.headers.get('X-Robots-Tag') or '')
                assert noindex == (environment == 'staging'), 'Wrong indexing headers'
        for url in ['projects/disney/2018guild/', 'projects/disney/2018ampas/', 'projects/24/']:
            with urllib.request.urlopen(base + url, timeout=25) as response:
                assert response.status == 200 and b'<title>Index of' not in response.read()
        if environment == 'production':
            with urllib.request.urlopen(base + 'dwa/', timeout=25) as response:
                assert response.status == 200 and b'<title>Index of' not in response.read(), 'Legacy PHP entry failed'

    try:
        for attempt in range(3):
            try:
                smoke()
                break
            except Exception:
                if attempt == 2: raise
                time.sleep(2)
    except Exception:
        if result['release']:
            remote('rollback', {'release': result['release']})
            print('Live checks failed; previous deployment restored.', file=sys.stderr)
        raise
    print('Deployment verified: ' + base, flush=True)


if __name__ == '__main__':
    try:
        main()
    except Exception as error:
        print('Deployment failed: ' + str(error), file=sys.stderr)
        sys.exit(1)
