# Disney Guild Awards 2018 static demo

Open `/projects/disney/2018guild/` using the portfolio development server.
The six film panels are inlined in `index.html`; no PHP runtime is required.

Edit `css/style.css` and `js/scripts.js` for the original layout and interactions.
`css/layout.css` adjusts the header, logo, image strip and spacing for screen
height, keeping shorter sections above the fold while longer sections scroll.
Film routes use URL hashes, so refreshes work on static hosting. Artwork, local
fonts, score tracks, photo galleries and digital books are preserved.

Screening schedules and RSVP registration are retired. The screenings panels
show an archive message, and event registration controls are disabled. Some
original videos and audio highlights are hosted externally and depend on those
services remaining available. Local scores are served directly, replacing the
former `play.php` endpoint. `viewer.html` opens the supplied Black Panther reader.

The original PHP site is preserved outside this checkout in
`../portfolio-archive-2026-10-13/disney-2018guild-original/` relative to the
portfolio repository.
