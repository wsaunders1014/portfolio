# Portfolio workflow

The active site is src/index.html with its supporting files in src. The backup
folder is reference material and must not be served, built, or deployed unless
selected files are deliberately copied into src.

The user authorized ongoing incremental uploads of completed active-site changes
to https://iamwillsaunders.com/new/. After checking src changes, use
npm run deploy:staging unless npm run deploy:watch is already handling them.
Do not upload the entire repository or backup folders. Do not overwrite the
existing site outside /opt/bitnami/apache2/htdocs/new until the user authorizes launch.
Never print or commit the SSH private key. Do not commit or push changes merely
because a staging deployment was requested.
