var preload_pictures = function(picture_urls, callback) {
	var loaded  = 0;
	var errorCheck = 0;
	var percent= 0;
	var increment = Math.floor(100/picture_urls.length);
	for(var i = 0, j = picture_urls.length; i < j; i++) {
		var img = new Image();
		img.onerror = callback;
		img.onload  = function() {
	  	percent += increment;
	  	//console.log(percent);
	  	if( percent < 10){
	  		document.getElementById('percent').innerHTML = '0'+percent;
	  	}    
	  	else {
	  		document.getElementById('percent').innerHTML = percent;  
	  	}
	    if(++loaded == picture_urls.length && callback) {
	    	//console.log('all images loaded');
	     callback();
	    }
	 };
	 img.src = picture_urls[i];

	 }
};
document.addEventListener("DOMContentLoaded", function(event) {
	preload_pictures([
		'img/actor-planet.png',
		'img/dev-planet.png',
		'img/writer-planet.png',
		'img/glyph.png',
		'img/serenity.png',
		'img/star-bg.jpg',
		'img/slide-out.png',
		'img/will-saunders-resume.jpg',
		'img/willsaunders-commercial.jpg',
		'img/willsaunders-theatrical.jpg',
		'img/pushplay.jpg',
		'img/24lad.jpg',
		'img/blue-bg.png',
		'img/blue-bg2.png',
		'img/nav-btn.png',
		'img/top-bar.png',
		'img/bottom-left-glyph.png',
		'img/top-right-glyph.png',
		'img/top-left-glyph.png',
		'img/bottom-right-glyph.png',
		'img/restart-btn.png',
		'img/nav-btns.png',
		'img/nav-btn.png',
		'img/glow.png',
		'img/right-engine.png',
		'img/left-engine.png',
		'img/intro-text.png',
		'img/explore-btn.png',
		'img/social-btns.png',
		'img/waypoint.gif',
		'img/explosion.gif',
		'img/corp-logos.png'
	], removeLoader);
});
function removeLoader(){
	var el = document.getElementById('loader');
	if(typeof(el) != 'undefined' && el !== null){
		$('#loader').fadeOut(400);
	}else {
		window.setTimeout(function(){
			removeLoader();
		}, 1000);
	}
}
