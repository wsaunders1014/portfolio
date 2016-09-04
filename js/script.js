var w,h;
$(document).ready(function(){
	w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	wrapperW = $('#wrapper').width();
	wrapperH = $('#wrapper').height();
	$('body').fitText(1.5);
	var devPlanet = new Planet($('#dev'));
	var actorPlanet = new Planet($('#actor'));
	var writerPlanet = new Planet($('#writer'));
	
	//Initialization
	//$('#intro').css({top:(h-$('#intro').height())/2});
	$('#rocket').css({left:(wrapperW/2) -92.5,top:(wrapperH/2)-50});
	locateRocket();
	//GALAXY MOVE
	var hoverTimeout,hoverInterval;
	// $('.hover-bar').on("mouseover", function(e){
	// 	var dir = $(this).attr('id');
	// 	//console.log(dir);
	// 	if(!hoverTimeout){
	// 		hoverTimeout = window.setTimeout(function(){
	// 			hoverInterval = window.setInterval(function(){
	// 				if(dir=='top'){
	// 					$('#wrapper').animate({top:'+=100'},499,'linear');
	// 				}else if(dir=='left'){
	// 					$('#wrapper').animate({left:'+=100'},499,'linear');
	// 				}else if(dir=='right'){
	// 					$('#wrapper').animate({left:'-=100'},499,'linear');
	// 				}else {
	// 					$('#wrapper').animate({top:'-=100'},499,'linear');
	// 				}
	// 			},500);
	// 		},1000);
	// 	}
	// }).on('mouseleave', function(e){
	// 	clearTimeout(hoverTimeout);
	// 	hoverTimeout= false;
	// 	clearInterval(hoverInterval);
	// 	hoverInterval = false;
	// })

	$('#pane').on('click touchstart', '.backToSpace',function(){
		backToSpace();
	});
	$('#overlay').on('click touchstart',function(){
		backToSpace();
	});
	function backToSpace(){
		location.hash='';
		$('#overlay').fadeOut(1000);
		$('#pane').fadeOut(1000);
		$('.content').css({top:0});
		$('.info').fadeIn(1000);
		$('.glow').removeClass('glow');
		isLanding = true;
		isLanded = false;
		landing = new TweenMax.to(rocket.children('#rocket-img'),2.5,{ scale:1, onComplete:function(){
			isLanding = false;
		}});
	}
	//Planet Highlight 
	// var swooshTo = false;
	// var swoosh1 = TweenMax.to($('.glyph').eq(0),8,{rotation:360,repeat:-1,ease:'linear'});
	// var swoosh2 = TweenMax.to($('.glyph').eq(1),8,{rotation:510,repeat:-1,ease:'linear'});
	// var swoosh3 = TweenMax.to($('.glyph').eq(2),8,{rotation:-360,repeat:-1,ease:'linear'});
	// $('.planet').on('mouseover touhstart touchmove', function(e){
	// 	if($(this).is($('.planet').eq(0))) {
	// 		swoosh1.pause();
	// 		degrees=156;
	// 	}else if($(this).is($('.planet').eq(1))){
	// 		swoosh2.pause();
	// 		degrees=334;
	// 	}else {
	// 		swoosh3.pause();
	// 		degrees=157;
	// 	}
	// 	swooshTo = new TweenMax.to($(this).siblings('.glyph'),.3,{directionalRotation:degrees+'_short',ease:Power3.easeOut, onComplete:function(){
	// 		$(this.target[0]).next().fadeIn(500);
	// 	}});
		
	// }).on('mouseleave touchend', function(e){
	// 	swooshTo.kill();
	// 		$(this).siblings('.slide-out').fadeOut(500,function(){
	// 			//swoosh = TweenMax.to($('.glyph'),8,{directionalRotation:360+'_cw',repeat:-1,ease:'linear'});
	// 			if($(this).parent().index()== 0) {
	// 					swoosh1.resume(3.4666, true);
	// 			}else if($(this).parent().index() == 1){
	// 					swoosh2.resume(4.08888, true);
	// 			}else {
	// 					swoosh3.resume(4.5666, true);
	// 			}
	// 		});
	// });


	function checkCollision(x,y){
		var collided = false;
		if(x>devPlanet.left && x < devPlanet.right){
			if(y>devPlanet.top && y < devPlanet.bottom){
				collided='developer';
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
					TweenMax.from([$('.actor-container section'),$('.actor-container .header')],1,{width:0, onComplete:function(){
						$('#reel iframe').attr('width',$('#reel .section-inner').width());
						$('#reel iframe').attr('height',$('#reel .section-inner').width()*0.5625);
						updateScrollVars();
					}});
				
				}else if (collided=='developer'){
					TweenMax.from([$('.dev-container section'),$('.dev-container .header')],1,{width:0, onComplete:function(){
						paddedW = $('#magnifier .section-inner').width();
						$('#magnifier iframe').attr('width',paddedW);
						$('#magnifier iframe').attr('height',paddedW*0.75);
						updateScrollVars();

					}});
				}else { //writer
					TweenMax.from([$('.writer-container section'),$('.writer-container .header')],1,{width:0});
				}
				//updateScrollVars();
			});
			return collided;
		}else {
			return false;
		}
	}

	function resetPages(){
		$('#scroll-bar').css({top:0});
		$('.content').css({top:0});
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
		//$('#intro').css({top:(h-$('#intro').height())/2});
		
		paddedH = $('#magnifier .section-inner').height();
		paddedW = $('#magnifier .section-inner').width();
		$('#magnifier iframe').attr('width',paddedW);
		$('#magnifier iframe').attr('height',paddedW*0.75);
	});
	window.onhashchange = function(e){
		hashChange(location.hash);
	}
	function hashChange(hash){
		
		if(hash =='#!developer'){
			setWaypoint(devPlanet.centerX,devPlanet.centerY,true);
		}else if(hash == '#!writer') {
			setWaypoint(writerPlanet.centerX,writerPlanet.centerY,true);
		}else if(hash == '#!actor'){
			setWaypoint(actorPlanet.centerX,actorPlanet.centerY,true);
		}else {
			location.hash = '';
		}
	}
	hashChange(location.hash);
	// LOWER MENU TOUCH EVENTS
	$('#menu a').on('touchstart',function(e){
		location.hash= e.currentTarget.hash;
		setTimeout(function(){
			$('#menu').hide();
		},1000);
	});
	$('#nav-btn').on('touchstart',function(){
		$('#menu').show();
	});

	//portfolio iframe fix 
	$('body').on('click touchstart', '.mouse-intercept', function(){
		$(this).hide();
	});

}); //END READY

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