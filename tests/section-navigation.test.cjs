const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const modulePromise = import(`data:text/javascript,${encodeURIComponent(fs.readFileSync('src/js/section-navigation.js', 'utf8'))}`);

test('section progress replaces the share hash without losing path/query or history state', async () => {
  const { updateSectionHash } = await modulePromise;
  const location = { href: 'https://example.com/new/?preview=1#bodi' };
  const calls = [];
  const history = { state: { preserved: true }, replaceState(...args) { calls.push(args); location.href = args[2]; } };
  updateSectionHash('contact', { location, history });
  assert.equal(location.href, 'https://example.com/new/?preview=1#contact');
  assert.deepEqual(calls[0][0], { preserved: true });
  updateSectionHash('contact', { location, history });
  assert.equal(calls.length, 1);
});

test('desktop direct links explicitly restore the horizontal camera position', async () => {
  const { restoreSectionFromHash } = await modulePromise;
  let scroll;
  const route = { scrollTo(value) { scroll = value; } };
  const sections = [{ id: 'arrival', offsetLeft: 0 }, { id: 'bodi', offsetLeft: 2880 }];
  assert.equal(restoreSectionFromHash('#bodi', sections, { route, mobile: false, page: {} }), true);
  assert.deepEqual(scroll, { left: 2880, behavior: 'instant' });
  assert.equal(restoreSectionFromHash('#unknown', sections, { route, mobile: false, page: {} }), false);
  assert.deepEqual(scroll, { left: 2880, behavior: 'instant' });
});

test('mobile links account for the sticky header and clamp the final section', async () => {
  const { restoreSectionFromHash } = await modulePromise;
  let scroll;
  const page = { scrollY: 100, innerHeight: 800, document: { documentElement: { scrollHeight: 5000 } },
    scrollTo(value) { scroll = value; } };
  const sections = [{ id: 'bodi', getBoundingClientRect: () => ({ top: 1200 }) },
    { id: 'contact', getBoundingClientRect: () => ({ top: 4900 }) }];
  const options = { mobile: true, page, header: { getBoundingClientRect: () => ({ height: 100 }) } };
  restoreSectionFromHash('#bodi', sections, options);
  assert.deepEqual(scroll, { top: 1180, behavior: 'instant' });
  restoreSectionFromHash('#contact', sections, options);
  assert.deepEqual(scroll, { top: 4200, behavior: 'instant' });
});

test('explicit navigation updates immediately and keeps its destination while passing sections', async () => {
  const {selectSectionDestination, updateSectionHash, cancelSectionNavigation} = await modulePromise;
  const location = {href: 'https://example.com/new/#arrival'};
  const history = {state: null, replaceState(_state, _title, href) { location.href = href; }};
  const options = {location, history};
  selectSectionDestination('contact', options);
  assert.equal(new URL(location.href).hash, '#contact');
  updateSectionHash('bodi', options);
  assert.equal(new URL(location.href).hash, '#contact');
  updateSectionHash('contact', options);
  updateSectionHash('fox', options);
  assert.equal(new URL(location.href).hash, '#fox');
  selectSectionDestination('contact', options);
  cancelSectionNavigation();
  updateSectionHash('bodi', options);
  assert.equal(new URL(location.href).hash, '#bodi');
});
