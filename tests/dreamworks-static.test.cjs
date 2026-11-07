const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

test('legacy DreamWorks redirect preserves query/hash and the staging prefix', () => {
  const html = fs.readFileSync('src/dwa/index.html', 'utf8');
  const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  for (const prefix of ['', '/new']) {
    for (const entry of ['/', '/index.html']) {
      const page = new URL(`https://example.com${prefix}/dwa${entry}?portfolio=standard#bilby`);
      let destination;
      vm.runInNewContext(script, { URL, location: {
        href: page.href, search: page.search, hash: page.hash,
        replace: value => { destination = value; }
      } });
      assert.equal(destination, `https://example.com${prefix}/projects/dwa/?portfolio=standard#bilby`);
    }
  }
});

test('static DreamWorks renders all gallery photos with one initial selection per film', () => {
  const html = fs.readFileSync('src/projects/dwa/index.html', 'utf8');
  assert.ok(!html.includes('<?'));
  for (const [film, count] of [['bird-karma', 12], ['bilby', 11]]) {
    const slides = [...html.matchAll(new RegExp(`<div class='slide([^']*)' src='(img/${film}/photo-(\\d+)\\.jpg)'`, 'g'))];
    assert.equal(slides.length, count);
    assert.equal(slides.filter(([, classes]) => classes.includes('active')).length, 1);
    slides.forEach(([, classes, image, number], index) => {
      assert.equal(Number(number), index + 1);
      assert.ok(fs.existsSync(path.join('src/projects/dwa', image)), image);
    });
  }
  for (const file of ['index.html', 'mobile-flight.html']) {
    assert.match(fs.readFileSync('src/' + file, 'utf8'), /href="projects\/dwa\/"/);
  }
});

test('DreamWorks CSS dependencies exist and video URLs reuse existing static assets', () => {
  const css = fs.readFileSync('src/projects/dwa/css/style.css', 'utf8');
  for (const [, url] of css.matchAll(/url\(['"]?([^'"\)]+)/g)) {
    const name = url.split(/[?#]/)[0];
    assert.ok(fs.existsSync(path.resolve('src/projects/dwa/css', name)), name);
  }
  const html = fs.readFileSync('src/projects/dwa/index.html', 'utf8');
  const sources = [...html.matchAll(/<source src="([^"]+)"/g)];
  assert.equal(sources.length, 2);
  assert.ok(sources.every(([, url]) => url.startsWith('https://iamwillsaunders.com/dwa/video/')));
});

test('FOX keeps its static gallery/video helpers without PHP reward-unlocking calls', () => {
  const script = fs.readFileSync('src/projects/24/js/script.js', 'utf8');
  const visuals = fs.readFileSync('src/projects/24/js/visuals.min.js', 'utf8');
  assert.doesNotMatch(script + visuals, /php\/(?:code|video|fbaccess)\.php|function (?:enterCode|tryCode|unlockedToAccessing|accessingSuccess)\(/);
  assert.match(visuals, /function videoUnlocked\(/);
  assert.match(visuals, /function displayAllElements\(/);
});
