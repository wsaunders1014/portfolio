# Disney AMPAS FYC 2018 static demo

Open `/projects/disney/2018ampas/` using the portfolio development server.
No PHP runtime, database or admin application is needed.

- `index.html` contains the eight film panels formerly assembled by PHP includes.
- `css/style.css` and `js/scripts.js` are the active styles and interactions.
- Film navigation uses hash URLs, so bookmarks and refreshes work on static hosting.
- Artwork, local fonts, scores and songs are preserved.
- Screening schedules and RSVP registration are retired; the screenings view
  displays an archive message. Event-page registration controls are disabled.
- The ancillary music pages and the coming-soon, ILM/Skywalker and Marvel event
  pages are available as HTML.

The original PHP site, including its admin system, templates and 2017 snapshot,
is preserved outside this checkout in
`../portfolio-archive-2026-10-13/disney-2018ampas-original/` relative to the
portfolio repository. No backend requests are made by the active demo script.
