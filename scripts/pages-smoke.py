#!/usr/bin/env python3
"""Live checks for the GitHub Pages deploy.

Usage: pages-smoke.py BASE_URL SITE_DIR

BASE_URL is the published site (e.g. https://iamwillsaunders.com/) and SITE_DIR is
the exact folder that was uploaded to Pages, with production at its root and
staging in new/. Each check fetches a URL and compares it with the uploaded file.
GitHub's CDN can serve the previous version for a few minutes after a deploy, so
every request carries a cache-busting query string and the whole run is retried.
"""
import hashlib
import os
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

ATTEMPTS = 10
WAIT_SECONDS = 30

# URL (relative to an environment root) -> file it must match exactly.
CONTENT = {
    '': 'index.html',
    'css/flight.css': 'css/flight.css',
    'js/flight.js': 'js/flight.js',
    'js/starfield.js': 'js/starfield.js',
    'lab/': 'lab/index.html',
    'lab/app.js': 'lab/app.js',
    'projects/dwa/': 'projects/dwa/index.html',
    'dwa/': 'dwa/index.html',
    'media/Will-Saunders-FrontEnd-Engineer-Resume.pdf': 'media/Will-Saunders-FrontEnd-Engineer-Resume.pdf',
}
# Folders that must serve a page (GitHub Pages returns 404 for a folder with no index).
FOLDERS = ['projects/disney/2018guild/', 'projects/disney/2018ampas/', 'projects/24/']
# Old PHP-era URLs: they must reach the 404 page, whose script redirects them.
LEGACY = ['index.php', 'dwa/index.php', 'projects/dwa/index.php']

NOINDEX = b'<meta name="robots" content="noindex'


def fetch(url):
    request = urllib.request.Request(url, headers={'Cache-Control': 'no-cache'})
    try:
        with urllib.request.urlopen(request, timeout=25) as response:
            return response.status, response.read()
    except urllib.error.HTTPError as error:
        return error.code, error.read()


def digest(data):
    return hashlib.sha256(data).hexdigest()


def run(base, site, token):
    failures = []
    not_found = digest((site / '404.html').read_bytes())
    for prefix, folder in [('', site), ('new/', site / 'new')]:
        def url(path):
            return '{}{}{}?v={}'.format(base, prefix, path, token)

        for path, name in CONTENT.items():
            status, body = fetch(url(path))
            if status != 200:
                failures.append('/{}{} -> HTTP {}'.format(prefix, path, status))
            elif digest(body) != digest((folder / name).read_bytes()):
                failures.append('/{}{} -> content does not match the deployed build'.format(prefix, path))
        for path in FOLDERS:
            status, _ = fetch(url(path))
            if status != 200:
                failures.append('/{}{} -> HTTP {}'.format(prefix, path, status))
        for path in LEGACY:
            status, body = fetch(url(path))
            if status != 404 or digest(body) != not_found:
                failures.append('/{}{} -> expected the redirecting 404 page, got HTTP {}'.format(prefix, path, status))

    _, home = fetch('{}?v={}'.format(base, token))
    if NOINDEX in home:
        failures.append('/ -> production home page is marked noindex')
    _, staging = fetch('{}new/?v={}'.format(base, token))
    if NOINDEX not in staging:
        failures.append('/new/ -> staging home page is missing its noindex tag')
    return failures


def main():
    base, site = sys.argv[1], Path(sys.argv[2])
    base = base if base.endswith('/') else base + '/'
    token = os.environ.get('GITHUB_SHA', str(int(time.time())))[:12]
    for attempt in range(1, ATTEMPTS + 1):
        failures = run(base, site, token)
        if not failures:
            print('Live checks passed: {} and {}new/'.format(base, base))
            return 0
        print('Attempt {}/{}: {} check(s) failing (the CDN may still be updating).'.format(
            attempt, ATTEMPTS, len(failures)), flush=True)
        if attempt < ATTEMPTS:
            time.sleep(WAIT_SECONDS)
    print('Live checks failed on {}:\n  {}'.format(base, '\n  '.join(failures)), file=sys.stderr)
    print('The new version is live but has problems. GitHub Pages has no automatic rollback: fix the '
          'problem, or undo the change with "git revert <commit>", and push again to redeploy.', file=sys.stderr)
    return 1


if __name__ == '__main__':
    sys.exit(main())
