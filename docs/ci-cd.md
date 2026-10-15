# Branches and automatic deployment

- `master` is production: https://iamwillsaunders.com/.
- `dev` is staging: https://iamwillsaunders.com/new/.
- `v1.0.0` marks the initial production launch (`3e261bf9`).

A local commit does not deploy by itself. Push `dev` to GitHub to deploy staging.
After reviewing staging, merge `dev` into `master` and push to deploy production:

```sh
git switch dev
# Make changes, commit, then:
git push origin dev
# Review the staging site and successful Actions run before promotion.
git switch master
git merge --ff-only dev
git push origin master
git switch dev
```

Changes to the deployment workflow and server helper belong in code review too.
Updating `scripts/ci-deploy-server.py` in Git does not automatically replace the
installed helper; install it separately with an administrator connection after
review and tests. The CI keys cannot change that helper or open a shell.

## What GitHub Actions does

The workflow runs on pushes to `dev` and `master`, pull requests targeting them,
and manual workflow dispatch. Checks run TypeScript, all Node and deployment
tests, and a clean production build with an exact source-file inventory check.
Pull requests never deploy. A failed check prevents deployment.

The deployment job builds the correct environment, compares SHA-256 hashes with
Lightsail, and sends only changed files. It records overwritten/deleted managed
files outside the web root for rollback. Unrelated legacy paths and `/new/` are
preserved during production deployments. Removed files are deleted only if they
belong to the environment's prior deployment manifest.

The homepage is replaced after its supporting assets. Files are replaced
atomically, but the whole site is not switched as a single transaction. Each
environment queues deployment jobs; a server lock also prevents overlapping
filesystem changes. HTTP checks verify deployed content, indexing headers,
the lab, resume, archived demos, and production's legacy DreamWorks entry.
Failures restore the previous changed files unless a newer release is active.

Staging remains noindex. Production keeps HTML-first/PHP-fallback entry handling
and permits indexing while excluding `/new/` in robots.txt.

## Deployment credentials and server state

GitHub environments `staging` and `production` each have a separate
`DEPLOY_SSH_KEY` secret. Their branch policies allow only `dev` and `master`,
respectively. They deploy automatically without a manual approval gate.
The keys are restricted to the installed helper and their own environment;
they cannot request a general SSH shell, forwarding, or a different target.
The server's public host key is pinned in `config/deploy/known_hosts`.

The helper, manifests, and incremental rollback backups live under
`/home/bitnami/portfolio-ci/`, outside Apache's document root. The full original
production backups from the initial launch remain under
`/home/bitnami/portfolio-backups/`. Backup retention is manual for now; monitor
Lightsail disk space and remove old rollback folders only after releases have
been accepted.

For a manual rollback, use the administrator key to invoke the installed helper
with `SSH_ORIGINAL_COMMAND=rollback`, its environment argument, and a JSON
request containing the active release ID. The helper refuses to roll back a
release if a newer one is active. Revert the corresponding Git commit too, so
the next deployment does not reintroduce it.

Use GitHub's Actions tab to follow runs. Continue using `npm start` for local
development. Stop `npm run deploy:watch` when using this workflow: saved,
uncommitted changes should not replace the version deployed from `dev`.
