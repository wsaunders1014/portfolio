# Spaceship portfolio redevelopment

## Legacy project map

The files below now live under `backup/legacy-site/` and `backup/public/`.
The active site has only index.html, flight.css, flight.js, flight-path.js and its
currently used images in src; backups are excluded from serving and deployment.

| Area | Source | Responsibility and constraints |
| --- | --- | --- |
| Scene and HUD | `src/index.html`, `src/css/style.css` | A two-dimensional world of nine quadrants, planet destinations, ship, overlay, loading screen and decorative controls. Much of the UI is image based. |
| Flight | `src/js/rocket.js` | Global `Rocket` object, requestAnimationFrame flight, GSAP rotation and landing, Bezier paths, camera movement, collision callbacks. Camera and ship coordinates depend on initial viewport measurements. |
| Navigation and effects | `src/js/script.js` | Initializes planets and hazards; connects clicks, hashes, flight, collisions, AJAX panels, sprites and easter eggs. Shares state with rocket.js. Resize rebuilds objects, including the absent actor planet. |
| Content | `src/developer.html`, `writer.html`, `actor.html` | AJAX-loaded fragments. Developer content has duplicated biography/skills and dated technology lists; old external project URLs and embedded archived demos. |
| Loading | `src/js/preloader.js` | Loads images before revealing the scene. An individual error can invoke the completion callback early; rounded progress increments do not consistently reach 100. |
| Contact | `src/js/form.js` | Posts to a PHP endpoint absent from the static deployment. Replace with a working contact link initially. |
| Preserved client examples | `public/projects/` | Independent legacy demos. Keep their styles/scripts isolated from the new portfolio. PHP and external services need individual review before featuring. |
| Build | `webpack.config.js`, `scripts/dev-client.js` | Static copying plus local development server; classic scripts on the old home page. No framework required for the replacement. |

## Proposed experience

Remove planets as the organizing metaphor. Visitors travel along a horizontal route,
passing project stations with legible HTML case studies. Keep the ship, atmosphere,
discovery and humor. Navigation should work before someone learns the flight controls.

Desktop: hold the mouse button on the space background to fly continuously; move
the pointer while holding to adjust the course, and release to coast. The ship
starts along its current heading and follows a curved path, making a forward-moving
turn when the destination is behind it. Its nose follows the curve tangent rather
than mirroring. The camera follows its horizontal position; near the route edges,
the camera stops and the ship can move off center. Previous/next buttons and a
persistent route map provide direct navigation.
Content panels can scroll vertically when needed. Do not require collision detection
to unlock a case study. No mandatory intro or loading screen.

Mobile: stack the same content vertically. Keep a small ship and route progress;
use normal touch scrolling and section links. Avoid forcing sideways reading or
precise steering. A future optional flight mode can be separate from reading.

Accessibility: semantic headings and links, visible focus, skip navigation, normal
text selection, keyboard navigation, and reduced-motion support. Content remains
available without JavaScript. Animation should respond to navigation rather than
run continuously while people read.

## Content route

1. Introduction: front-end development for marketing, commerce and interactive experiences.
2. BODi: five years of landing pages; Cloudinary CMS → Builder.io → Shopify;
   custom HTML/CSS/JS/Liquid; React/TypeScript collaboration; Optimizely → Amplitude;
   Google Tag Manager. Describe responsibilities and process using known facts.
3. Disney: recovered Guild and AMPAS examples. Add accurate personal ownership,
   implementation decisions, and selected screenshots after confirming the scope.
4. FOX / 24: archived campaign example and existing screenshots; confirm which work
   belongs to employment at FOX versus agency/client work before writing a career timeline.
5. About/contact: creative interests and a direct email link. Refresh the resume
   separately before presenting the old PDF as current.

Use a case-study structure: context → contribution → technical decisions → result
or lesson. No invented conversion lifts, scale, dates, or ownership. BODi can be a
process case study even without surviving live pages. Team contributions need attribution.

## Incremental delivery

- **1: Route prototype (implemented at `/`).** Plain HTML/CSS/JS, horizontal
  desktop route, vertical mobile layout, original ship asset, navigation and an
  optional ship transmission. The existing home page remains available.
- **2: Content.** Confirm project ownership, select three strong examples, replace
  draft summaries with detailed case studies, and capture approved local demo images.
- **3: Flight feel.** Refine acceleration and camera easing, original station art,
  parallax and transitions. Decide if manual steering adds value beyond route controls.
- **4: Discovery.** Add optional satellites, messages and small original interactive
  experiments between stations. Essential information stays on the main route.
- **5: Launch.** Test touch, keyboard, resize, motion preferences, deep links and slow
  connections; audit client demos and metadata; promote the new page to index.html
  and retire old globals from the primary experience.

## First-pass limits

The prototype is a navigation and reading experiment, not the final art direction
or free-flight simulation. Case-study copy is based on the conversation and the
existing developer panel. Resume, screenshots, metrics and detailed project scope
still need editorial work. Links open preserved demos, whose independent bugs or
missing media are not fixed by this prototype.

## Click-to-fly increment

The flight model preserves the forward departure and curved approach of the original
`rocket.js`, implemented in `src/js/flight-path.js` without the shared legacy globals.
Circular turns join a straight approach at a shared tangent, avoiding cusps from
the original Bezier handles. Arc distance gives consistent speed and orientation. Acceleration and arrival braking use elapsed frame time. New
clicks replan from the current position, speed and heading without resetting the
frame clock or restarting the animation loop. Turn speed changes use gradual
acceleration/braking rather than an immediate speed clamp. Turns respect vertical limits, choose the side with room, and slow during the arc.

`src/js/flight.js` captures a pointer press starting on the space background and
recomputes its world target every animation frame, including when the camera moves
under a stationary pointer. Moving the pointer steers without restarting the loop.
Releasing removes thrust and brakes gradually along the current course. Presses
inside case-study cards and drags used to select text do not start flight. Ship rotation is continuous;
there is no horizontal mirroring or keyboard steering. Escape, tab blur, hidden
tabs, resize and direct navigation stop flight. Reduced motion removes decorative
parallax and glow. Mobile keeps ordinary vertical reading.
