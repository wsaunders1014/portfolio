# Portfolio workflow

The active site is src/index.html with its supporting files in src. The backup
folder is reference material and must not be served, built, or deployed unless
selected files are deliberately copied into src.

Production launched on 2026-10-15. The user requested branch-based CI/CD:
pushes to dev deploy staging at https://iamwillsaunders.com/new/; pushes to master
deploy production at https://iamwillsaunders.com/. See docs/ci-cd.md.
Use dev for ongoing development and promote reviewed changes to master. A push
to master is a live deployment, so do not push there without authorization.
Let GitHub Actions deploy committed changes; do not run deploy:watch or direct
uploads alongside CI unless the user explicitly asks for the manual fallback.
Never upload the repository or backup folders. Preserve legacy demo paths and
the other environment. Deployment helper changes require separate server installation.
Never print or commit the SSH private key. Do not commit or push changes merely
because a staging deployment was requested.
