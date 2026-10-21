// The original publication activated each widget as it entered a page. These
// standalone archive frames activate locally and never contact the publisher.
var com = { zmags: { api: { widgets: { Iframe: {
  IFRAME_WIDGET_ACTIVATE: 'activate',
  IFRAME_WIDGET_DEACTIVATE: 'deactivate',
  addEventListener: function(type, callback) {
    if (type !== 'activate') return;
    if (document.readyState === 'complete') setTimeout(callback, 0);
    else window.addEventListener('load', callback, { once: true });
  },
  getViewerAPI: function() { return { gotoPage: function(number) {
    var pages = { 4: 'p4_magnifier.html', 6: 'si_parallax/index.htm', 7: 'p7_fun-to-drive.html', 8: 'sedan_parallax/index.htm', 9: 'p9_interior-static.html', 10: 'p10_audio-screen.html', 11: 'p11_hondalink.html', 13: 'p13_altfuels.html', 14: 'p14_lanewatch.html', 15: 'p15_safety-static.html', 16: 'p16_safety-numbers.html', 17: 'p17_accessories.html', 18: 'p18_specifications.html', 19: 'p19_shoptools.html' };
    if (pages[number]) setTimeout(function() { location.href = pages[number]; }, 0);
  } }; }
} } } } };
