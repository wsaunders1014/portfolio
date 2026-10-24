# Portfolio analytics

The active portfolio loads `src/js/analytics.js` on both entry pages. Set the
portfolio's **GA4 web-stream Measurement ID** in `src/js/analytics-config.js`.
It is a public identifier, not an API secret. An empty ID disables everything.
No client demo tracking IDs are reused.

## Google Analytics setup

1. In Google Analytics, select/create the portfolio property and a web stream
   for `https://iamwillsaunders.com`. Copy its `G-...` Measurement ID into the config.
2. Under that stream's Enhanced Measurement settings, disable page changes based
   on browser history events. This site's URL hash changes during flight; those
   are not separate pageviews. The integration sends one initial pageview and
   separate section events. Do not install a second GA tag through GTM.
3. Add event-scoped custom dimensions for `section_id`, `element_name`,
   `element_id`, `destination`, and `ship_design` if needed in reports.
4. Add an event-scoped custom metric for `duration_msec`, unit **Milliseconds**.
   Sum it by `section_id`, filtering event name to `section_engagement`, to see
   time spent per section. These durations are incremental, not cumulative.
5. Verify live collection in Realtime after an authorized production release.
   Normal reports/custom definitions may take time to populate. Historical
   traffic from before installation cannot be recovered by this integration.

## What is measured

| Event / report | Meaning |
| --- | --- |
| GA users / sessions / traffic acquisition | Visitors, visits, and where visitors came from |
| GA average engagement time | Time with the site in focus, collected by Google's tag |
| `section_view` | A station occupies the reading position for at least one second |
| `section_engagement` | Focused time spent in a settled station; incremental `duration_msec` |
| `portfolio_click` | Intentional link/button/summary clicks, with label and containing section |

Section views use actual element positions on both desktop and mobile, rather
than the navigation's selected destination. Brief warp flybys aren't views.
Reading time flushes on section changes, blur, visibility changes, page exit,
and every 15 seconds. Departed/hidden time is excluded; final delivery remains
best-effort if a browser is killed or blocks requests.

Clicks include resume, contact, archived demo, gallery and navigation links,
plus ship choice buttons. Suppressed flight release-clicks are ignored. Mouse
movement, firing, and animation frames are not sent as events.

Collection is limited to the production hostname and the three portfolio entry
paths (`/`, `/index.html`, `/mobile-flight.html`). Localhost, `/new/`, project
demos, and browsers requesting Do Not Track or Global Privacy Control send no
requests. Link destinations omit query strings and email addresses. Google
signals and advertising personalization are disabled. This integration does
not implement a consent banner; if consent controls are added, initialize the
tag only under the chosen consent policy.

Analytics measures visitor behavior. Google Search Console is the separate tool
for search impressions, queries, clicks from Google, and indexing coverage.
