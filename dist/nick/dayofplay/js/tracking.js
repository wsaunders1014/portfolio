var UA_RULES = [
  ['iPhone;', 'phone'],
  ['iPod;', 'phone'],
  ['iPad;', 'tablet'],
  ['Android.*Mobile Safari', 'phone'],  
  ['Android.*Safari', 'tablet'], 
  ['iemobile', 'phone'], 
  ['Windows Phone', 'phone'], 
  ['.*', 'desktop'],       // Fallback to desktop.
];
function detectDevice() {
    var ua = navigator.userAgent;
    for (var i = 0; i < UA_RULES.length; i++) {
        var device = UA_RULES[i][1];
        var re = new RegExp(UA_RULES[i][0]);
        if (ua.match(re)) {
            return device;
        }
    }
    var isKindle = /Kindle/i.test(ua) || /Silk/i.test(ua) || /KFTT/i.test(ua) || /KFOT/i.test(ua) || /KFJWA/i.test(ua) || /KFJWI/i.test(ua) || /KFSOWI/i.test(ua) || /KFTHWA/i.test(ua) || /KFTHWI/i.test(ua) || /KFAPWA/i.test(ua) || /KFAPWI/i.test(ua);
    if(isKindle) { 
    //Your code here
      device = 'tablet';
      return device;
    }
}
var currentSection = '';
var sectionTime = 0;
var pages = {
    platform: detectDevice(),
    ua: navigator.userAgent.toLowerCase()
};
var global = {

	track: function(label, isEvent, isTimer) {
    var platform = (pages.platform == "desktop") ? "" : "_" + pages.platform;
		// If not desktop, platform = '_phone' or '_tablet'
    // trackSectionTime();
    // currentSection = label.split('/')[0];
    // restartSectionTime(section);
    if(isEvent==true){
      label = label+platform;
      if (typeof pageNameAppend == 'function') { 
        // pageNameAppend is in Nick's server
        pageNameAppend(label);
      // console.log("track: " + label);
      } 
    }else { //if tracking call is not an event
      if(isTimer == true){
        label = label+platform;
        if (typeof pageNameAppend == 'function') { 
          // pageNameAppend is in Nick's server
          pageNameAppend(label);
       //   console.log("track: " + label);
        } 
      }else {
        label = label+platform;
        if (typeof pageNameAppend == 'function') { 
          // pageNameAppend is in Nick's server
          pageNameAppend(label);
          //console.log("track: " + label);
        } 
        //trackSectionTime();
        currentSection = label;
        //restartSectionTime(currentSection);
      }
    }
		
	}
};

// Timer scripts


function restartSectionTime(section) {
    var d = new Date();
    sectionTime = d.getTime();

    currentSection = section;
}

function getSectionTime() {
    var d = new Date();
    var unixMS = d.getTime();

    var timeDiff = unixMS - sectionTime;
    return timeDiff / 1000;
}

function trackSectionTime() {
    if(currentSection != '') {
        global.track(currentSection + '/viewtime_' + getSectionTime() + 's', false, true);
    }
}