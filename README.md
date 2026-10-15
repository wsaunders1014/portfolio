# Will Saunders portfolio

The new spaceship portfolio lives in `src/`. It is a static HTML/CSS/JavaScript
site. Webpack serves it locally and copies active source files for production.

## Local development

Use Node.js 22.15 or newer (`nvm use`), install dependencies with `npm install`,
then run `npm start` or `npm run dev`. Open http://localhost:8080/.
For testing on another device on your Wi-Fi, run:

```sh
npm run dev -- --host 0.0.0.0
```

Hold the mouse button on open space to fly continuously. Moving the pointer
steers the ship; releasing cuts thrust and coasts. Mobile uses vertical reading.

## Active files

- `src/index.html`: page, navigation and case-study content.
- `src/css/flight.css`: active layout and ship visuals.
- `src/js/flight.js`: input, ship/camera movement and navigation.
- `src/js/flight-path.js`: turning geometry and tangent orientation.
- `src/img/serenity.png`, `src/img/24lad.jpg`: currently used artwork.
- `src/.htaccess`, `src/robots.txt`: staging caching and indexing settings.

The project map and redevelopment plan are in `docs/portfolio-redevelopment.md`.

## Backups

`backup/legacy-site/` contains the previous portfolio source, content panels,
styles, scripts, resumes and assets. `backup/public/` contains the archived
client demos. Backups are not served locally or copied into builds. Copy selected
files into `src/` when they become part of the new site. The old unused large
videos remain local and ignored by Git.

The earlier recovery snapshots remain in `../portfolio-archive-2026-10-13/`.

## Builds

`npm run build` writes `dist/`. `npm run build:staging` writes `dist-new/`.
Both contain only active source files; generated directories are ignored by Git.

## Incremental Lightsail deployment

Staging lives at https://iamwillsaunders.com/new/ with `index.html` as its entry.
The existing public site outside `/new` must remain untouched until launch.

```sh
npm run deploy:staging
```

This builds the active site, compares SHA-256 hashes with files on the server,
and uploads only changed files by SFTP. Files are uploaded under temporary names
and renamed into place. A remote manifest tracks deployed files so removed active
files can be removed from staging without touching unrelated server files. A
second deployment with no source changes sends no files.

For automatic updates when source files are saved:

```sh
npm run deploy:watch
```

The watcher deploys after a 1.5-second debounce. Keep that terminal, your Mac and
its internet connection running; Ctrl+C stops watching. Run the local development
server separately. Source file changes are what trigger updates, not backup edits.

Deployment uses `23.21.42.189:22`, user `bitnami`, and the existing key at
`~/Downloads/LightsailDefaultKey-us-east-1.pem`. No private key is copied into the
site or repository. The deployment target is fixed to
`/opt/bitnami/apache2/htdocs/new`; symlinks escaping that target are rejected.
