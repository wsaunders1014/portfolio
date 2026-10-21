// Local archive compatibility: campaign analytics are intentionally inactive.
var pages = { platform: /Mobi|Android|iPhone/i.test(navigator.userAgent) ? 'phone' : 'desktop', ua: navigator.userAgent.toLowerCase() };
var tracking = { call: function() {} };
var global = { track: function() {} };
function trackSectionTime() {}
function restartSectionTime() {}
