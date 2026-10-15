const link = document.querySelector('.portfolio-return');
if (link) {
  const root = new URL('../../../', location.href);
  const choice = new URLSearchParams(location.search).get('portfolio');
  let version = choice === 'mobile' || choice === 'standard' ? choice : null;
  try {
    if (!version && document.referrer) {
      const referrer = new URL(document.referrer);
      if (referrer.origin === root.origin && referrer.pathname === `${root.pathname}mobile-flight.html`) version = 'mobile';
      else if (referrer.origin === root.origin && [root.pathname, `${root.pathname}index.html`].includes(referrer.pathname)) version = 'standard';
    }
    if (version) sessionStorage.setItem('disney-portfolio-version', version);
    else version = sessionStorage.getItem('disney-portfolio-version');
  } catch { /* The default link still works when storage is unavailable. */ }
  link.href = new URL(version === 'mobile' ? 'mobile-flight.html#disney' : 'index.html#disney', root).href;
}
