let selectedDestination = null;

export function cancelSectionNavigation() {
  selectedDestination = null;
}

export function selectSectionDestination(id, options) {
  selectedDestination = null;
  updateSectionHash(id, options);
  selectedDestination = id;
}

export function updateSectionHash(id, { location = window.location, history = window.history } = {}) {
  if (selectedDestination && selectedDestination !== id) return;
  selectedDestination = null;
  const url = new URL(location.href);
  if (url.hash === `#${id}`) return;
  url.hash = id;
  // Reading/flight progress must not add history entries or trigger an anchor
  // jump (which would interrupt the ship and camera animations).
  history.replaceState(history.state, '', url.href);
}

export function restoreSectionFromHash(hash, sections, { route, mobile, header, page = window }) {
  const section = sections.find(item => `#${item.id}` === hash);
  if (!section) return false;
  if (mobile) {
    const maximum = Math.max(0, page.document.documentElement.scrollHeight - page.innerHeight);
    const top = section.getBoundingClientRect().top + page.scrollY - header.getBoundingClientRect().height - 20;
    page.scrollTo({ top: Math.max(0, Math.min(maximum, top)), behavior: 'instant' });
  } else {
    route.scrollTo({ left: section.offsetLeft, behavior: 'instant' });
  }
  return true;
}
