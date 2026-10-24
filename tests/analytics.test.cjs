const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const source = fs.readFileSync('src/js/analytics.js', 'utf8')
  .replace("import { measurementId } from './analytics-config.js';", "const measurementId = '';")
  .replace('export function', 'function');
function setup({host = 'iamwillsaunders.com', path = '/', dnt, gpc} = {}) {
  let now = 0, position = 'arrival', focused = true;
  const listeners = {}, intervals = [], scripts = [];
  const sections = ['arrival', 'bodi', 'disney'].map(id => ({id,
    getBoundingClientRect: () => id === position
      ? {left: 0, right: 1200, top: 0, bottom: 900}
      : {left: 2000, right: 3200, top: 2000, bottom: 2900}}));
  const document = {title: 'Portfolio', visibilityState: 'visible', hasFocus: () => focused,
    querySelectorAll: () => sections, createElement: () => ({}), head: {append: s => scripts.push(s)},
    addEventListener: (type, fn) => {listeners[type] = fn;}};
  const window = {addEventListener: (type, fn) => {listeners[type] = fn;}};
  const context = vm.createContext({window, document, navigator: {doNotTrack: dnt, globalPrivacyControl: gpc},
    location: {hostname: host, pathname: path, origin: 'https://' + host, href: 'https://' + host + path},
    performance: {now: () => now}, matchMedia: () => ({matches: false}),
    innerWidth: 1200, innerHeight: 900, URL, setInterval: (fn, ms) => intervals.push({fn, ms})});
  vm.runInContext(source, context);
  const start = (id = 'G-TEST123') => vm.runInContext(`startAnalytics(${JSON.stringify(id)})`, context);
  const events = name => (window.dataLayer || []).filter(a => a[0] === 'event' && a[1] === name);
  const tick = ms => {now += ms; intervals.find(i => i.ms === 250)?.fn();};
  return {start, events, scripts, listeners, document, tick,
    move: p => {position = p;}, focus: v => {focused = v; listeners[v ? 'focus' : 'blur']();},
    heartbeat: () => intervals.find(i => i.ms === 15000).fn()};
}
test('no Google requests on staging, local, missing ID, or privacy opt-out', () => {
  for (const opts of [{path:'/new/'}, {path:'/projects/test/'}, {host:'localhost'}, {dnt:'1'}, {gpc:true}]) {
    const s = setup(opts); s.start(); assert.equal(s.scripts.length, 0);
  }
  const s = setup(); s.start(''); assert.equal(s.scripts.length, 0);
});
test('one pageview and only settled section views, excluding warp flybys', () => {
  const s = setup(); s.start();
  assert.equal(s.scripts.length, 1); assert.equal(s.events('page_view').length, 1);
  s.tick(0); s.tick(1000);
  assert.equal(s.events('section_view')[0][2].section_id, 'arrival');
  s.tick(2000); s.move('bodi'); s.tick(100); s.move('disney'); s.tick(200); s.tick(1000);
  assert.deepEqual(Array.from(s.events('section_view'), e => e[2].section_id), ['arrival', 'disney']);
  assert.equal(s.events('section_engagement')[0][2].duration_msec, 2100);
});
test('reading time excludes unfocused/hidden time and is not double counted', () => {
  const s = setup(); s.start(); s.tick(0); s.tick(1000); s.tick(3000); s.focus(false);
  assert.equal(s.events('section_engagement')[0][2].duration_msec, 3000);
  s.tick(60000); s.heartbeat(); assert.equal(s.events('section_engagement').length, 1);
  s.focus(true); s.tick(2000); s.heartbeat();
  assert.equal(s.events('section_engagement')[1][2].duration_msec, 2000);
  s.listeners.pagehide(); s.tick(60000); s.heartbeat();
  assert.equal(s.events('section_engagement').length, 2);
});
test('custom navigation clicks are counted and destinations remove email addresses and queries', () => {
  const s = setup(); s.start();
  const element = {disabled: false, id: 'demo', tagName: 'A', textContent: 'View demo', dataset: {},
    getAttribute: name => name === 'href' ? 'https://example.com/demo?private=value' : null,
    closest: () => ({id:'disney'})};
  const target = {closest: () => element};
  s.listeners.click({target, defaultPrevented: true});
  assert.equal(s.events('portfolio_click').length, 1);
  assert.equal(s.events('portfolio_click')[0][2].destination, 'https://example.com/demo');
  element.getAttribute = name => name === 'href' ? 'mailto:private@example.com' : null;
  s.listeners.click({target});
  assert.equal(s.events('portfolio_click')[1][2].destination, 'mailto:');
});
