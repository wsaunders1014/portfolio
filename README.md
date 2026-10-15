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

Push `dev` to deploy staging at https://iamwillsaunders.com/new/.
Push `master` to deploy production at https://iamwillsaunders.com/.
GitHub Actions runs checks first, then transfers only changed files and verifies
the result. See [CI/CD setup and promotion](docs/ci-cd.md) for the branch workflow,
credentials, server helper, and rollback behavior. Local commits alone do not deploy.

The following direct-upload commands remain available as a manual fallback.
Do not run the save watcher alongside CI: it could replace committed staging
with uncommitted local changes.

```sh
npm run deploy:staging
```

This builds the active site, compares SHA-256 hashes with files on the server,
and uploads only changed files by SFTP. Files are uploaded under temporary names
and renamed into place. A remote manifest tracks deployed files so removed active
files can be removed from staging without touching unrelated server files. A
second deployment with no source changes sends no files.

For explicitly requested automatic updates when source files are saved:

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

## React / TypeScript component lab

`src/lab/` contains two standalone portfolio recreations: conditional content and
coordinated carousel/video. Links from the BODi section open the appropriate demo.
The original sibling repositories are never modified by the demo builds.

- React/TypeScript implementation: `src/lab/source/`.
- Preserved original excerpts: `src/lab/source/original-snippets.ts`.
- Complete local reference snapshots and integrity manifest:
  `reference/bodi-components/` (outside src, excluded from builds and deployment).
- Original procedural media: `src/lab/media/`. Regenerate the small silent clips
  with `node scripts/generate-lab-media.cjs` if needed.
- `npm run check:lab` checks strict TypeScript.
- `npm run test:lab` checks rule edge cases and original-code preservation.

Both webpack and `build:staging` compile the lab with esbuild. Its React bundle
is generated into the build output, rather than committing a generated app.js.
Only the selected, labeled source excerpts are public; the full reference
snapshots are not part of the served site. The examples use fictional data and
no company APIs, authentication, experiment services, or external video hosts.

## Desktop flight and reading

Serenity is the default on desktop and mobile. The original Explorer artwork is preserved in `backup/ships/desktop-ship.svg`.
Click or hold over content and background to fly, with links, buttons, forms, media
controls and details summaries reserved for their usual interactions. Desktop menu
and route-button trips over long distances use a 2,100 px/s cruise limit versus 675 px/s for manual
flight, with acceleration and arrival braking. Desktop warp trails stay horizontal and begin only after the ship finishes its
turn and moves toward the selected station.
On desktop, text and gallery columns scroll independently while the browser
viewport, navigation, ship and controls stay fixed. Left/right arrow keys activate
the footer navigation. Footer arrows visit the next center in their direction,
including the current station if its center has not been reached. Short centering
trips use normal flight without warp trails. Mobile keeps native page scrolling, with flight arrows
for section trips and held cruising.

## Ship choices

The Ship button in the footer opens a chooser: Eagle 5 (the space Winnebago),
Serenity (the default), Millennium Falcon, and Enterprise. `src/js/ship-picker.js`
saves explicit choices in localStorage. Reset to Serenity clears that preference.
Saved Explorer selections now choose Eagle 5; old Pixel selections choose Enterprise.
Every design shares the flight controls and ship transmission. Ship assets are under `src/img/`.

## Production release

See [the launch checklist](docs/production-launch.md) before replacing the live site.
`npm run build` prepares `dist/` with production settings from `config/production/`.
Production permits indexing; `/new/` remains excluded. Development and staging
keep the noindex headers and robots rules in `src/`. Building never uploads files.
