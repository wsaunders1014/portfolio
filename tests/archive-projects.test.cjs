const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

test('RPA demo paths work for directory URLs with or without a trailing slash', () => {
  const html = fs.readFileSync('src/projects/rpa/index.html', 'utf8');
  const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  for (const pathname of ['/projects/rpa', '/projects/rpa/', '/projects/rpa/index.html', '/new/projects/rpa']) {
    let base;
    vm.runInNewContext(script, {
      location: { pathname },
      document: { createElement: () => ({}), head: { append(element) { base = element.href; } } }
    });
    const page = `https://example.com${pathname}`;
    const url = new URL('civic/si_parallax/index.htm', new URL(base || page, page));
    assert.ok(url.pathname.endsWith('/projects/rpa/civic/si_parallax/index.htm'));
    if (pathname.startsWith('/new/')) assert.ok(url.pathname.startsWith('/new/'));
  }
});

function htmlFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? htmlFiles(file) : /\.html?$/.test(file) ? [file] : [];
  });
}

test('selected archive entry points have local image, style, and script dependencies', () => {
  for (const root of ['src/projects/nick', 'src/projects/rpa']) {
    for (const file of htmlFiles(root)) {
      const html = fs.readFileSync(file, 'utf8');
      for (const match of html.matchAll(/<(img|script|link)\b[^>]*>/gi)) {
        const attr = match[1].toLowerCase() === 'link' ? 'href' : 'src';
        const value = match[0].match(new RegExp(`\\b${attr}=["']([^"']*)["']`, 'i'))?.[1];
        if (!value || /^(?:#|https?:|\/\/|data:)/.test(value)) continue;
        assert.ok(fs.existsSync(path.resolve(path.dirname(file), value.split(/[?#]/)[0])), `${file}: ${value}`);
      }
    }
  }
});

test('both portfolio variants include the additional station in route order', () => {
  for (const name of ['index.html', 'mobile-flight.html']) {
    const html = fs.readFileSync(`src/${name}`, 'utf8');
    const stations = [...html.matchAll(/<section id="([^"]+)" class="station/g)].map(match => match[1]);
    const nav = html.match(/<nav aria-label="Portfolio sections">([\s\S]*?)<\/nav>/)[1];
    assert.deepEqual([...nav.matchAll(/href="#([^"]+)"/g)].map(match => match[1]), stations);
    assert.ok(stations.indexOf('more-projects') > stations.indexOf('fox'));
    assert.ok(stations.indexOf('contact') > stations.indexOf('more-projects'));
  }
});

test('RPA hash links restore the page and support changing pages and browser history', () => {
  const html = fs.readFileSync('src/projects/rpa/index.html', 'utf8').replace(/<!--[\s\S]*?-->/g, '');
  const options = [...html.matchAll(/<option data-page="([^"]+)" value="([^"]+)"/g)].map(([, page, value]) => ({
    value, dataset: {page, frameWidth: '982', frameHeight: '732'},
    parentElement: {label: 'Model'}, textContent: page
  }));
  assert.equal(new Set(options.map(option => option.dataset.page)).size, options.length);
  const events = {}, selectorEvents = {};
  const selector = {options, addEventListener: (name, callback) => selectorEvents[name] = callback};
  const context = {
    document: {querySelector: () => selector},
    location: {hash: '#civic-driving-experience'},
    window: {addEventListener: (name, callback) => events[name] = callback},
    iframe: {}, stage: {dataset: {}}, fitArchive() {}
  };
  const source = fs.readFileSync('src/js/archive-project.js', 'utf8');
  vm.runInNewContext(source.slice(source.indexOf('const selector =')), context);
  assert.equal(context.iframe.src, 'civic/p7_fun-to-drive.html');
  const exterior = options.find(option => option.dataset.page === 'civic-exterior');
  selector.selectedOptions = [exterior];
  selectorEvents.change();
  assert.equal(context.location.hash, 'civic-exterior'); // Browser adds the # prefix.
  context.location.hash = '#civic-exterior';
  events.hashchange();
  assert.equal(context.iframe.src, exterior.value);
  context.location.hash = '#civic-driving-experience';
  events.hashchange();
  assert.equal(selector.value, 'civic/p7_fun-to-drive.html');
  context.location.hash = '#https://untrusted.example/';
  events.hashchange();
  assert.equal(context.iframe.src, options[0].value);
});

test('Odyssey pages retain their original 1224 by 792 canvas', () => {
  const html = fs.readFileSync('src/projects/rpa/index.html', 'utf8');
  const entries = [...html.matchAll(/<option[^>]*value="odyssey\/[^" ]+"[^>]*>/g)];
  assert.ok(entries.length > 0);
  for (const [entry] of entries) {
    assert.match(entry, /data-frame-width="1224"/);
    assert.match(entry, /data-frame-height="792"/);
  }
});
