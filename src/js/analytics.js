import { measurementId } from './analytics-config.js';

export function startAnalytics(id) {
  // Demo tags belong to clients. Only the portfolio's own production stream
  // belongs here; local previews and /new/ must never enter production reports.
  if (!/^G-[A-Z0-9]+$/.test(id)
    || location.hostname !== 'iamwillsaunders.com'
    || !['/', '/index.html', '/mobile-flight.html'].includes(location.pathname)
    || navigator.globalPrivacyControl || navigator.doNotTrack === '1') return;

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  const pageLocation = location.origin + location.pathname;
  gtag('js', new Date());
  gtag('config', id, { send_page_view: false, allow_google_signals: false,
    allow_ad_personalization_signals: false, page_location: pageLocation });
  const send = (name, params = {}) => gtag('event', name, {
    send_to: id, page_location: pageLocation, ...params
  });
  send('page_view', { page_title: document.title });
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.append(script);

  const sections = [...document.querySelectorAll('.station[id]')];
  let current = null;
  let candidate = null;
  let candidateSince = 0;
  let started = performance.now();
  let elapsed = 0;
  let engaged = document.visibilityState === 'visible' && document.hasFocus();
  let paused = false;
  const account = () => {
    const now = performance.now();
    if (current && engaged) elapsed += now - started;
    started = now;
  };
  const flush = () => {
    account();
    const duration = Math.floor(elapsed);
    if (current && duration > 0) {
      send('section_engagement', { section_id: current, duration_msec: duration });
      elapsed -= duration;
    }
  };
  function sample() {
    if (paused || document.visibilityState !== 'visible' || !document.hasFocus()) return;
    const mobile = matchMedia('(max-width: 800px)').matches;
    const point = mobile ? innerHeight * .35 : innerWidth / 2;
    const found = sections.find(section => {
      const r = section.getBoundingClientRect();
      return mobile ? r.top <= point && r.bottom > point : r.left <= point && r.right > point;
    })?.id || null;
    if (candidate !== found) { candidate = found; candidateSince = performance.now(); }
    // Stop assigning reading time immediately when flying away. A new view
    // requires a full second at the section, excluding brief warp flybys.
    if (current && current !== found) { flush(); current = null; elapsed = 0; }
    if (!current && found && performance.now() - candidateSince >= 1000) {
      current = found;
      started = performance.now();
      send('section_view', { section_id: current });
    }
  }
  setInterval(sample, 250);
  setInterval(flush, 15000);
  const visibility = () => {
    flush();
    engaged = !paused && document.visibilityState === 'visible' && document.hasFocus();
    candidate = null;
    candidateSince = performance.now();
  };
  document.addEventListener('visibilitychange', visibility);
  window.addEventListener('blur', visibility);
  window.addEventListener('focus', visibility);
  window.addEventListener('pagehide', () => { flush(); paused = true; engaged = false; });
  window.addEventListener('pageshow', () => { paused = false; visibility(); });

  function trackClick(element) {
    if (!element || element.disabled) return;
    const href = element.getAttribute('href');
    let destination;
    if (href) {
      const url = new URL(href, location.href);
      // No email addresses, query strings, or arbitrary form values in events.
      destination = ['http:', 'https:'].includes(url.protocol)
        ? url.origin + url.pathname + (/^#[a-z0-9-]+$/i.test(url.hash) ? url.hash : '')
        : url.protocol;
    }
    const label = element.getAttribute('aria-label') || element.getAttribute('title')
      || element.textContent.trim() || element.querySelector('img')?.alt || element.tagName;
    send('portfolio_click', {
      element_name: label.replace(/\s+/g, ' ').slice(0, 100),
      element_id: element.id || undefined,
      section_id: element.closest('.station')?.id || current || 'navigation',
      destination,
      ship_design: element.dataset.ship || undefined
    });
  }
  // Suppressed flight release-clicks never reach this bubble listener.
  document.addEventListener('click', event => trackClick(event.target.closest('a, button, summary')));
  // Flight menus deliberately stop click propagation in the capture phase.
  document.addEventListener('portfolio:navigate', event => trackClick(event.detail.link));
}

startAnalytics(measurementId);
