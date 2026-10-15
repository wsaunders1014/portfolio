# Production launch

The release artifact is `dist/`, produced by `npm run build`. The staging
artifact is `dist-new/`, produced by `npm run build:staging`. Both contain only
active `src/` files plus the compiled React lab; neither includes `backup/`,
`reference/`, repository files, or the SSH key.

## Verified server baseline (2026-10-15)

A read-only check resolved the document root to `/opt/bitnami/apache/htdocs`.
Its current entry is `index.html`; there is no root `.htaccess`. The current
index SHA-256 is `5cef3e645ce147052845662f5b0668e564b519cb4ec4da476ef75f4b86411285`.
Recheck these facts at launch; no production file was changed during preparation.

## Before launch

- Run `npm run check:lab`, `node --test tests/*.test.cjs`, and `npm run build`.
- Review https://iamwillsaunders.com/new/ on desktop and a real phone. Check
  held steering, waypoint braking, reverse turns, menu travel, ship selection,
  independently scrolling content, the resume, contact links, and demo returns.
- Confirm the intended release commit is pushed and the working tree is clean.
- Obtain the user's explicit authorization to replace production. Preparing a
  release or updating staging does not authorize this step.

## Deploy after authorization

1. Inspect the Apache virtual host and document root on Lightsail. The current
   staging target is `/opt/bitnami/apache/htdocs/new`; `apache2` is an alias.
   Confirm the production index selection and any existing root `.htaccess`
   rules before changing them.
2. Save a timestamped copy of the current production files and root configuration
   outside the web-served document root. Preserve permissions and record the
   original index file and hashes. Exclude `/new/` from the backup copy.
3. Upload only the reviewed `dist/` files to a temporary release folder outside
   the document root and verify their SHA-256 hashes before activation.
4. Deploy the release to the production document root, preserving `/new/` and
   unrelated legacy paths. Reconcile existing Apache rules deliberately; do not
   overwrite redirects or security rules blindly. The release sets `DirectoryIndex index.html`, which ensures an old `index.php` cannot take priority. Do not use the
   staging deploy command for production; it is intentionally fixed to `/new/`.
5. Verify HTTPS at the root, CSS/JS/image responses and MIME types, desktop and
   mobile navigation, the lab, archived demos, resume, and return links. Check
   that production has no `X-Robots-Tag: noindex` or noindex meta tag, and that
   root `robots.txt` permits the portfolio while excluding `/new/`.
6. Keep the rollback copy until the user has accepted the live release. If
   verification fails, restore the previous index and configuration first, then
   restore any overwritten assets from the saved copy. Remove only files known
   to have been added by this release; preserve unrelated content and `/new/`.

The ship images, historical campaign examples, and embedded third-party videos
are part of the current portfolio. External video availability depends on the
original host. The removed campaign audio files must not be restored.
