var preload_pictures = function(picture_urls, callback) {
var loaded  = 0;
var errorCheck = 0;
var percent= 100;
var increment = Math.floor(100/picture_urls.length);
 for(var i = 0, j = picture_urls.length; i < j; i++) {
  var img = new Image();
  img.onerror = function() {
  	errorCheck++;
  	console.log(img.src);
  	callback();
  }
  img.onload  = function() {
  	percent = percent - increment;
  	//console.log(percent);
  	// if( percent < 10){
  	// 	document.getElementById('percent').innerHTML = '00'+percent;
  	// }    
  	// else {
  	// 	document.getElementById('percent').innerHTML = '0'+percent;  
  	// }
    if(++loaded == picture_urls.length && callback) {
    	console.log('all images loaded');
     callback();
    }
  } //end onload statement
 img.src = picture_urls[i];

 }
}
document.addEventListener("DOMContentLoaded", function(event) {
	preload_pictures([
		'img/actor-planet.png',
		'img/dev-planet.png',
		'img/writer-planet.png',
		'img/glyph.png',
		'img/satellite.png',
		'img/serenity.png',
		'img/star-bg.jpg',
		'img/slide-out.png',
		'img/will-saunders-resume.jpg',
		'img/willsaunders-commercial.jpg',
		'img/willsaunders-theatrical.jpg',
		'img/pushplay.jpg',
		'img/24lad.jpg',
		'img/blue-bg.png'
	],
	function(){
		removeLoader();
	});
});

function removeLoader(){
	var el = document.getElementById('loader');
	if(typeof(el) != 'undefined' && el != null){
		$('#loader').fadeOut(400);
	}else {
		window.setTimeout(function(){
			removeLoader();
		}, 1000);
	}
}
