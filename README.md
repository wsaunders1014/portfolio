# Will Saunders portfolio

The creative space portfolio is the active site. It uses plain HTML, CSS and
JavaScript. Webpack serves it locally and copies it into a deployable static
site; it does not bundle or rewrite the shared browser scripts.

## Run locally

Use Node.js 22.15 or newer. With nvm:

```sh
nvm use
npm install
npm start
```

Open http://localhost:8080/. `npm start` opens the browser; `npm run dev` starts
the same server without opening it. Changes to source files reload the page.
Stop the server with Ctrl+C. Restart it after changing the Webpack configuration.
The creative site now lives at `/`, replacing the earlier `/old/` preview route.

## Where to edit

- `src/index.html`: space scene, navigation and initial page markup.
- `src/developer.html`, `src/writer.html`, `src/actor.html`: content panels loaded by the navigation scripts.
- `src/css/style.css`: the live site's authoritative stylesheet.
- `src/css/reset.css`: the original CSS reset.
- `src/js/script.js`: navigation, scene interactions and panel behavior.
- `src/js/rocket.js`: ship movement and flight paths.
- `src/js/preloader.js`: image loading and the loading screen.
- `src/js/form.js`, `src/js/fittext.js`, `src/js/bezier-shard.js`: supporting scripts.
- `src/img/`, `src/audio/`, `src/media/`: portfolio assets and resumes.
- `public/projects/`: preserved client demos, served at `/projects/`.

Keep the browser scripts in their existing order in `index.html`; they share
globals. The LESS source and unused experimental scripts are archived. Edit the
CSS directly until that older LESS source has been reconciled with the live CSS.

## Production build

```sh
npm run build
```

The build recreates `dist/` from `src/` and `public/`. Deploy the contents of
`dist/`. Source files and project demos are preserved without minification or
transformation. The live-reload script is added only during development.

`dist/` is generated and ignored by Git. Make changes in `src/` or `public/`;
changes made directly in `dist/` will be replaced on the next build.

The portfolio's old contact form and some archived demos rely on PHP or external
services. A static server does not execute PHP; those features need separate
backend work. The original contact-form backend is preserved in the archive.

## Recovery archive

Reference copies are preserved outside this checkout at:

`../portfolio-archive-2026-10-13/`

That archive contains the live download (`current/`), the former simpler site
(`src/`), the recovered creative site (`old/`), both previous build folders,
and the old build configuration. `archive-manifest.json` records file hashes.
The recovery checkpoint is Git commit `68580a14`.

The client demos were merged into `public/projects/` using this precedence,
from lowest to highest: `dist-bkup`, `dist`, `old`, then the live download
`current`. Original conflicting versions remain in the archive.
