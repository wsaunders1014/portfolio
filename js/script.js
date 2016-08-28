var w,h;
$(document).ready(function(){
	w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

	$('body').fitText(1.5);
	var devPlanet = new Planet($('#dev'));
	var actorPlanet = new Planet($('#actor'));
	var writerPlanet = new Planet($('#writer'));

	//Initialization
	$('#intro').css({top:(h-$('#intro').height())/2});
	$('#rocket').css({left:(w - $('#rocket').width())/2});

	// LOWER MENU EVENTS
	$("#menu a").click(function(e){
		$('#intro').hide();
		resetPages();
		if(e.currentTarget.hash =='#developer'){
			setWaypoint(devPlanet.centerX,devPlanet.centerY,true);
		}else if(e.currentTarget.hash =='#writer'){
			setWaypoint(writerPlanet.centerX,writerPlanet.centerY,true);
		}else {
			setWaypoint(actorPlanet.centerX,actorPlanet.centerY,true);
		}
		e.preventDefault();

	});

	// ROCKET TRAVEL TO MOUSE
	var rocket = $('#rocket');
	var rocketW = rocket.width();
	var rocketOrigin = rocketW/2;
	var isLanding = false;
	var isLanded =false;
	var isFlying = false;
	var rocketY = Math.round(rocket.position().top);
	var rocketX = Math.round(rocket.position().left);
	var rocketCenter = {x:rocketX+5,y:rocketY+92.5};
	var mouseX;
	var mouseY;
	var waypointInterval=false;
	var flight =false;
	var rotate = false;
	var landing = false;
	var hasFlown = false;
	var i = 0;

	// $('#wrapper').click(function(e){ // Line debug / path illustrator.
	// 	$(this).append('<div class="waypoint id-'+i+'"></div');
	// 	$('.id-'+i).css({top:e.pageY-5,left:e.pageX-5});
	// 	if(i!=0){
	// 		var angle = -Math.degrees(Math.atan2((e.pageX-5)-$('.id-'+(i-1)).position().left,(e.pageY-5)-$('.id-'+(i-1)).position().top));
	// 		if(angle > 0){ // fixes angles so 0 is up, and positive is on right side to sync with css
	// 			angle = angle-180;
	// 		}else {
	// 			angle = angle+180;
	// 		}
	// 		distance = Math.sqrt((Math.pow(((e.pageX-5) - $('.id-'+(i-1)).position().left-5),2)) + (Math.pow(((e.pageY-5) - $('.id-'+(i-1)).position().top-5),2)));
	// 	$(this).append('<div class="line" style="transform-origin:left center;width:'+distance+'px;top:'+ ($('.id-'+(i-1)).position().top+5)+'px;left:'+ ($('.id-'+(i-1)).position().left+5)+'px;transform:rotate('+(angle-90)+'deg);"></div>');
	// 	}
	// 	i++;
	// });


	$('#wrapper').mousedown(function(e){
		 mouseX = e.pageX;
		 mouseY = e.pageY;
		 if(e.button ==0 ){ // only left clicks move Rocket.
		 	if(!isLanded && !isLanding){
				$('#intro').fadeOut(750);
				$('#wrapper').mousemove(function(e){
					mouseX = e.pageX;
					mouseY = e.pageY;
					if(!waypointInterval)
						waypointInterval = window.setInterval(function(){setWaypoint(mouseX,mouseY)},200);
				});	
			}
		}

	}).mouseup(function(e){
		if(e.button ==0 ){ // only left clicks move Rocket.
			$('#wrapper').off('mousemove');
			if(!isLanded && !isLanding){
				mouseX = e.pageX;
				mouseY = e.pageY;
				if(!waypointInterval){
					setWaypoint(e.pageX,e.pageY);
				}else {
					setWaypoint(e.pageX,e.pageY);
					window.clearInterval(waypointInterval);
					waypointInterval = false;
				}
				
			}else if(isLanded && !isLanding){ // then it needs to unland.

				// window.clearInterval(waypointInterval);
				// waypointInterval = false;
				// $('#pane').fadeOut(1000);
				// $('.content').css({top:0});
				// $('.info').fadeIn(1000);
				// isLanding = true;
				// isLanded = false;
				// var angle = Math.degrees(Math.atan2(mouseY-rocketY,mouseX-rocketX));
				// rotate = new TweenMax.to( rocket, 1.5, { directionalRotation:(angle+90)+'_short'});
				// landing = new TweenMax.to(rocket.children('#rocket-img'),2.5,{ scale:1, onComplete:function(){
				// 	 //Rising and Descending is considered landing.
				// 	isLanding = false;
				// }});
			}else if(isLanding && !isLanded){

				// window.clearInterval(waypointInterval);
				// waypointInterval = false;
				// landing.kill();
				// $('#pane').fadeOut(1000);
				// $('.content').css({top:0});
				// $('.info').fadeIn(1000);
				// isLanding = false;
				// var angle = Math.degrees(Math.atan2(mouseY-rocketY,mouseX-rocketX));
				// rotate = new TweenMax.to( rocket, 1.5, { directionalRotation:(angle+90)+'_short'});
				// landing = new TweenMax.to(rocket.children('#rocket-img'),2.5,{ scale:1, onComplete:function(){
				// 	 //Rising and Descending is considered landing.
					
				// }});
			}
		}
	}).mouseleave(function(e){
		//setWaypoint(e.pageX,e.pageY);
		if(e.button ==0  && !isLanding){
			//$('#wrapper').off('mousemove');
			//window.clearInterval(waypointInterval);
			//waypointInterval = false;
		}
	});
	
	$('#pane').on('click', '.backToSpace',function(){
		backToSpace();
	});
	$('#overlay').click(function(){
		console.log('test')
		backToSpace();
	});
	function backToSpace(){
			$('#overlay').fadeOut(1000);
			$('#pane').fadeOut(1000);
			$('.content').css({top:0});
			$('.info').fadeIn(1000);
			landing = new TweenMax.to(rocket.children('#rocket-img'),2.5,{ scale:1, onComplete:function(){
				isLanding = false;
				isLanded = false;
			}});
			if(isLanded && !isLanding){

			}else if(isLanding && !isLanded){

			}
	}
	//Planet Highlight 
	var swooshTo = false;
	var swoosh1 = TweenMax.to($('.glyph').eq(0),8,{rotation:360,repeat:-1,ease:'linear'});
	var swoosh2 = TweenMax.to($('.glyph').eq(1),8,{rotation:510,repeat:-1,ease:'linear'});
	var swoosh3 = TweenMax.to($('.glyph').eq(2),8,{rotation:-360,repeat:-1,ease:'linear'});
	$('.planet').on('mouseover', function(e){
		if($(this).is($('.planet').eq(0))) {
			swoosh1.pause();
			degrees=156;
		}else if($(this).is($('.planet').eq(1))){
			swoosh2.pause();
			degrees=334;
		}else {
			swoosh3.pause();
			degrees=157;
		}
		swooshTo = new TweenMax.to($(this).siblings('.glyph'),.3,{directionalRotation:degrees+'_short',ease:Power3.easeOut, onComplete:function(){
			$(this.target[0]).next().fadeIn(500);
		}});
		
	}).on('mouseleave', function(e){
		swooshTo.kill();
			$(this).siblings('.slide-out').fadeOut(500,function(){
				//swoosh = TweenMax.to($('.glyph'),8,{directionalRotation:360+'_cw',repeat:-1,ease:'linear'});
				if($(this).parent().index()== 0) {
						swoosh1.resume(3.4666, true);
				}else if($(this).parent().index() == 1){
						swoosh2.resume(4.08888, true);
				}else {
						swoosh3.resume(4.5666, true);
				}
			});
			
	});
	function setWaypoint(x,y,instant){
		if (instant){
			rocket.children('#rocket-img').toggleClass('glow');
			flight = TweenMax.to( rocket, 0, {top:y-rocketOrigin*2, left:x - rocketOrigin, ease:Power2.easeInOut,
				onUpdate:function(){
					rocketY = Math.round(rocket.position().top);
					rocketX = Math.round(rocket.position().left);
				},
				onComplete:function(){
					rocket.children('#rocket-img').toggleClass('glow');
					isFlying=false;
					if(checkCollision(x,y)){
						$('#overlay').fadeIn(1000);
						$('#pane').fadeIn(1000);
						//$('.slide-out').fadeOut(1000);
						isLanding = true;
						landing = new TweenMax.to(rocket.children('#rocket-img'),0,{scale:0, onComplete:function(){
							rocketY = Math.round(rocket.position().top);
							rocketX = Math.round(rocket.position().left);

							isLanded = true;	
							isLanding = false;
						}});
					}
				}});
		}else{
			var distance = Math.abs(Math.sqrt((Math.pow(x - (rocketX-50),2)) + (Math.pow(y - (rocketY-92.5),2))));
			var angle = -Math.degrees(Math.atan2(x-(rocketX + 50), y-(rocketY + 92.5)));
			if(angle > 0){ // fixes angles so 0 is up, and positive is on right side to sync with css
				angle = angle-180;
			}else {
				angle = angle+180;
			}
			//console.log('Angle: '+angle);
			//console.log(distance);
			rotate = new TweenMax.to( rocket, 0.5, {directionalRotation:(angle)+'_short'});
			if(!isFlying){
				rocket.children('#rocket-img').toggleClass('glow');
				isFlying = true;
				flight = TweenMax.to( rocket, (.5*(distance/125)), {top:y-rocketOrigin*2, left:x - rocketOrigin, ease:Power2.easeInOut,
				onUpdate:function(){
					rocketY = Math.round(rocket.position().top);
					rocketX = Math.round(rocket.position().left);
				},
				onComplete:function(){
					rocket.children('#rocket-img').toggleClass('glow');
					isFlying=false;
					
					var tr=$('#rocket').css('transform');
					var values = tr.split('(')[1];
					    values = values.split(')')[0];
					    values = values.split(',');
					var a = values[0];
					var b = values[1];
					var c = values[2];
					var d = values[3];
					var cAngle = Math.atan2(b, a) * (180/Math.PI);
					//console.log('Final Angle: '+cAngle);

					if(checkCollision(x,y)){
						$('#overlay').fadeIn(1000);
						$('#pane').fadeIn(1000,function(){
						//	updateScrollVars();
						});
						$('.slide-out').fadeOut(1000);

						isLanding = true;
						landing = new TweenMax.to(rocket.children('#rocket-img'),2.5,{scale:0, onComplete:function(){
							rocketY = Math.round(rocket.position().top);
							rocketX = Math.round(rocket.position().left);

							isLanded = true;	
							isLanding = false;
						}});
					}
				}});
			}else {
				isFlying = true;
				flight.kill();
				flight = TweenMax.to( rocket, (.5*(distance/125)), {top:y-rocketOrigin*2, left:x - rocketOrigin, ease:Power2.easeOut,
				onUpdate:function(){
					rocketY = Math.round(rocket.position().top);
					rocketX = Math.round(rocket.position().left);
				},
				onComplete:function(){
					rocket.children('#rocket-img').toggleClass('glow');
					isFlying=false;
					
					var tr=$('#rocket').css('transform');
					var values = tr.split('(')[1];
					    values = values.split(')')[0];
					    values = values.split(',');
					var a = values[0];
					var b = values[1];
					var c = values[2];
					var d = values[3];
					var cAngle = Math.atan2(b, a) * (180/Math.PI);
					console.log('Final Angle: '+cAngle);

					if(checkCollision(x,y)){
						$('#overlay').fadeIn(1000);
						$('#pane').fadeIn(1000,function(){
							updateScrollVars();
						});
					//	$('.info').fadeOut(1000);

						isLanding = true;
						landing = new TweenMax.to(rocket.children('#rocket-img'),2.5,{scale:0, onComplete:function(){
							rocketY = Math.round(rocket.position().top);
							rocketX = Math.round(rocket.position().left);

							isLanded = true;	
							isLanding = false;
						}});
					}
					// GSAP Bezier plugin.
					// var xDiff = ((x-rocketX)/2);
					// var cpX = rocketX;
					// var cpY = y+xDiff;
					// var fly = new TweenMax.to(rocket, 5, {bezier:{curviness:1.25, values:[{x:100, y:250}, {x:300, y:0}, {x:500, y:400}], autoRotate:true}, ease:Power1.easeInOut});
				}});
			}
		}
	}///End Function

	function checkCollision(x,y){
		var collided = false;
		if(x>devPlanet.left && x < devPlanet.right){
			if(y>devPlanet.top && y < devPlanet.bottom){
				collided='dev';
			}
		}else if(x>actorPlanet.left && x < actorPlanet.right){
			if(y>actorPlanet.top && y <actorPlanet.bottom){
				collided='actor';
			}		
		}else if(x>writerPlanet.left && x < writerPlanet.right){
			if(y>writerPlanet.top && y < writerPlanet.bottom){
				collided='writer';
			}
		}
		if(collided){
			$.get(collided+'.html', function(data){
				$('#pane .content').html(data);
				if(collided =='actor'){
					$('#reel iframe').attr('width',$('#reel .section-inner').width());
					$('#reel iframe').attr('height',$('#reel .section-inner').width()*0.5625);
				}else if (collided=='dev'){
					paddedW = $('#magnifier .section-inner').width();
					$('#magnifier iframe').attr('width',paddedW);
					$('#magnifier iframe').attr('height',paddedW*0.75);
				}else { //writer

				}
				//updateScrollVars();
			});
			return true;
		}else {
			return collided;
		}
	}
	function resetPages(){
		$('#scroll-bar').css({top:0});
		$('.content').css({top:0});
		//updateScrollVars();
	}
	////On Resize
	$(window).resize(function(){
		w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
		$('body').fitText(2);
		devPlanet = new Planet($('#dev'));
		actorPlanet = new Planet($('#actor'));
		writerPlanet = new Planet($('#writer'));
		$('body').fitText(1.5);
		$('#intro').css({top:(h-$('#intro').height())/2});
		if(!hasFlown){
			$('#rocket').css({left:(w - $('#rocket').width())/2});
		}
		paddedH = $('#magnifier .section-inner').height();
		paddedW = $('#magnifier .section-inner').width();
		$('#magnifier iframe').attr('width',paddedW);
		$('#magnifier iframe').attr('height',paddedW*0.75);
	});

}); //END READY
//helper function radians to degrees
Math.degrees = function(radians) {
  return radians * 180 / Math.PI;
};

//planet object
function Planet(obj) {
	this.top= obj.position().top;
	this.left=obj.position().left;
	this.height = obj.innerHeight();
	this.width = obj.innerWidth();
	this.bottom= this.top + this.height;
	this.right= this.left+this.width;
	this.centerX = this.left + this.width/2;
	this.centerY = this.top + this.height/2;
	this.name = obj.attr('id');
}

var flameTimer;

function Sprite(frames, obj, time){ //amount of frames, jQuery object, time in MS
	this.index = 0;
	this.isAnimating = false;
	this.width = obj.width();
	this.totalWidth = frames*this.width;
	this.timerVar;
	this.animate = function(){
		this.isAnimating = true;
		obj.show();
		var index = 0;
		var width = this.width;
		this.timerVar = setInterval(function(){
			if( index < frames){
				obj.css('background-position', -(index * width)+'px 0');
				index++;
			}else {
				index = 0;
				obj.css('background-position', -(index * width)+'px 0');
			}
		},time/12, this.index, width);

	}

	this.stopAnim = function(){
		this.isAnimating = false;
		window.clearInterval(this.timerVar);
		obj.hide();
	}
}