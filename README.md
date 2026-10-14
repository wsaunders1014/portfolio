# portfolio

## Local development

Use Node.js 22.15 or newer. If you use nvm, run `nvm use`
to select the version in `.nvmrc`.

```sh
npm install
npm start
```

The development server opens http://localhost:8080 and reloads when source
files change. Stop it with Ctrl+C. To start without opening a browser, use
`npm start -- --no-open`.

The older interactive portfolio is served at http://localhost:8080/old/.
Restart the server after changing `webpack.config.js`. Its HTML and scripts
are in `old/`, and its restored CSS is in `old/css/`. The original LESS source
is in `old/less/`; this legacy stylesheet is not compiled by the current build.
The legacy contact form requires PHP and cannot submit through the Webpack server.

- `npm run build` generates production files in `dist/`.
- `npm run dev` watches and rebuilds development files in `dist/`, without a server.

Edit `src/index.html` for page content, `src/js/projects.js` for portfolio entries,
`src/js/main.js` for interactions, and `src/sass/` for styles. Webpack 5 bundles
the site and Dart Sass compiles the styles; no OpenSSL workaround is needed.

The existing `dist/` directory also holds archived projects. The build does not
clear it, so those files are preserved. Avoid deleting it when deploying.

## Original project notes

Creating a new portfolio site to showcase my whole persona, not just as a developer but also as Comedian, Movie Lover, and Screenwriter.

V.2
I introduced a better pathing system for the ship to give it a more interesting/ slightly more realistic feel. Also added more "space", content coming soon.
