var w,h,devPlanet,actorPlanet,writerPlanet,oldHash=false;
var notHomepage = (location.hash.length>1) ? true:false;
	var moonPlayed = false, marchPlayed = false;
var audioPlaying = false;
var muted = false;
//hashChange(location.hash);
$(document).ready(function(){
	w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	wrapperW = $('#wrapper').width();
	wrapperH = $('#wrapper').height();
	$('body').fitText(1.5);
	devPlanet = new Planet($('#dev'),1,1);
	actorPlanet = new Planet($('#actor'),1,1);
	writerPlanet = new Planet($('#writer'),1,1);
	deathArray = [sun = new DeathObj($('#sun'),2,1,'Nice try, Icarus!'),deathStar = new DeathObj($('#death-star'),0,0,'Now you know the true power of the dark side.')];
	console.log(deathArray)

	//Initialization
	$('#rocket').css({left:(wrapperW/2) -92.5,top:(wrapperH/2)-50});
	Rocket.locate();

	//GALAXY MOVE
	var hoverTimeout,hoverInterval;
	var wrapperMoveAnim = false;
	var start2 = false;
	var centerPoint = {x:w/2,y:h/2};
	var inc = 10;
	var upperBound = 0;
	var bottomBound = -(wrapperH -h);
	var leftBound = 0;
	var rightBound = -(wrapperW-w);

	// GLYPH ANIMATIONS 
	var topLeft =$('#top-left-corner');
	var topRight = $('#top-right-corner');
	var bottomLeft = $('#bottom-left-corner');
	var bottomRight = $('#bottom-right-corner');
	var toCorners = new TimelineLite();
		toCorners.add('start',0);
		toCorners.to(topLeft,0.5,{left:-7,top:-13,scale:1});
		toCorners.to(topRight,0.5,{right:0-9,top:-13,scale:1},'start');
		toCorners.to(bottomLeft,0.5,{left:-11,bottom:-9,scale:1},'start');
		toCorners.to(bottomRight,0.5,{right:-4,bottom:-5,scale:1},'start');
		toCorners.pause();

	var intro = $('#intro');
	var introTop = intro.position().top;
	var introH = intro.innerHeight();
	var introLeft = intro.offset().left;
	// SET CORNERS TO INTRO.
	topLeft.css({
		top:introTop-13,
		left:introLeft-7
	});
	topRight.css({
		top:introTop-13, 
		right:introLeft-9
	});
	bottomLeft.css({
		bottom: h-(introTop+introH+9), 
		left:introLeft-11
	});
	bottomRight.css({
		bottom: h-(introTop+introH+9), 
		right:introLeft-4
	});
	/*  top: 282px;
    	left: 545px;
	    transform: scale(0.7);

	    top: 281px;
    	right: 549px;
	    transform: scale(0.7);

        bottom: 345px;
    	left: 540px;

    	bottom: 350px;
    	right: 554px;
	    transform: scale(0.7);
	*/
	$('#pane').on('click touchstart', '.backToSpace',function(){
		backToSpace();
	});
	$('#overlay').on('click touchstart',function(){
		backToSpace();
	});
	Rocket.obj.on('click',function(e){
		e.stopPropagation();
	//	console.log(Rocket.center.x,Rocket.center.y);
		if(!audioPlaying && !muted)
			$('#cantdo')[0].play();
	});
	$('audio').on('ended',function(){
		audioPlaying = false;
	});
	$('audio').on('play',function(){
		audioPlaying = true;
	});
	$('#audio-ctrl').on('click touchstart', function(){
		muted = (muted == false) ? true:false;
		$(this).toggleClass('muted');
		if(muted){
			$('audio').each(function(){
				this.volume = 0;
			});
		}else {
			$('audio').each(function(){
				this.volume =1;
			});
		}
	})
	function backToSpace(){
		location.hash='';
		$('#overlay').fadeOut(1000);
		$('#pane').fadeOut(1000);
		resetPages();
		if(!notHomepage)
			Rocket.land();
		notHomepage = false;
	}
	//Planet Highlight Circles 
	var swooshTo = false;
	// var swoosh1 = TweenMax.to($('.glyph').eq(0),8,{rotation:360,repeat:-1,ease:'linear'});
	// var swoosh2 = TweenMax.to($('.glyph').eq(1),8,{rotation:360,repeat:-1,ease:'linear'});
	// var swoosh3 = TweenMax.to($('.glyph').eq(2),8,{rotation:510,repeat:-1,ease:'linear'});
	// var swoosh4 = TweenMax.to($('.glyph').eq(3),8,{rotation:-360,repeat:-1,ease:'linear'});
	$('.glyph').each(function(){
		TweenMax.to($(this),8,{rotation:360,repeat:-1,ease:'linear'});
	})
	 
	var slideOut;
	$('.planet-holder').on('mouseover touchstart touchmove', function(e){
		var tween = TweenMax.getTweensOf($(this).find('.glyph'));
		tween[0].pause()
		var index = $('.planet-holder').index(this);
		console.log(index)
		 if(!slideOut){
		 	if(index == 1) {
				degrees=156;
			}else if(index == 2){
				degrees=334;
			}else if(index==3) {
		 		degrees=157;
			}else {
				degrees=334;
			}
		 	swooshTo = new TweenMax.to($(this).find('.glyph'),.3,{directionalRotation:degrees+'_short',ease:Power3.easeOut, onComplete:function(){
				$(this.target[0]).next().fadeIn(500);
		 	}});
		}
		slideOut =true;
	}).on('mouseleave touchend', function(e){
		swooshTo.kill();
		var tween = TweenMax.getTweensOf($(this).find('.glyph'));
		
		 $(this).children('.slide-out').fadeOut(500,function(){
		 		
		 		console.log(tween[0].target[0].className)
		 		if(tween[0].target[0].className =='glyph c2' || tween[0].target[0].className =='glyph c4'){
		 			tween[0].resume(7.5666, true);
		 		}else {
		 			tween[0].resume(3.4666,true);
		 		}
		 	slideOut = false;
		});
	});
	

	wrapper.on('click', function(e){
		$('#intro').fadeOut(750);
		mouseX = e.pageX-wOffset.left;
		mouseY= e.pageY-wOffset.top;
		Rocket.target.left = mouseX;
		Rocket.target.top = mouseY;
		Rocket.isLanded = false;
		toCorners.play();

		Rocket.currQuadX = Math.floor(mouseX/w);
		Rocket.currQuadY = Math.floor(mouseY/h);
		quadAction(Rocket.currQuadX,Rocket.currQuadY);
		//console.log(Rocket.currQuadX,Rocket.currQuadY);

		if(!Rocket.isDead && !Rocket.isLanded){
			window.cancelAnimationFrame(anim);
			oldCoords = {x:Rocket.center.x,y:Rocket.center.y};
			Rocket.origin= {left:Rocket.center.x,top:Rocket.center.y}
			flight(mouseX,mouseY);
		}

	});
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

	hashChange(location.hash);
	// LOWER MENU TOUCH EVENTS
	$('#menu a').on('click touchstart',function(e){
		var $this = this;
		goTo(e,$this);
	});
	$('.waypoint-btn').on('click touchstart',function(e){
		var $this = this;
		goTo(e,$this);
	});
	function goTo(e, $this){
		window.cancelAnimationFrame(anim);
		if(Rocket.isLanded)
			backToSpace();
		var hash = $($this).attr('href');
		oldCoords = {x:Rocket.center.x,y:Rocket.center.y};
		Rocket.origin= {left:Rocket.center.x,top:Rocket.center.y}
		if(hash =='developer'){
			flight(devPlanet.centerX,devPlanet.centerY);
		}else if(hash == 'writer') {
			flight(writerPlanet.centerX,writerPlanet.centerY);
		}else if(hash == 'actor'){
			flight(actorPlanet.centerX,actorPlanet.centerY);
		}
		hideIntro();
		notHomepage = false;
		e.stopPropagation();
		e.preventDefault();
	}

	$('#nav-btn').on('touchstart',function(){
		$('#menu').show();
	});

	//portfolio iframe fix 
	$('body').on('click touchstart', '.mouse-intercept', function(){
		$(this).hide();
	});
	function hideIntro(){
		intro.fadeOut(1000);
		toCorners.play();
	}
	intro.on('click', function(e){
		e.stopPropagation();
		hideIntro();
	});
	window.onhashchange = function(e){
		hashChange(location.hash);
	}
	function resetPages(){
		$('#scroll-bar').css({top:0});
		$('.content').css({top:0});

	}
	function hashChange(hash){
		var collided = hash.substr(2);

		if(collided){
			hideIntro();
			$('#pane').fadeIn(1000);
			$('#overlay').fadeIn(1000);
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
		}
	}
}); //END READY
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
		Rocket.land();
		location.hash = '#!'+collided;
		return collided;
	}else {
		return false;
	}
}
var dModal = $('#death-modal');
var deathLaser = false;
function deathCheck(x,y){
	var died = false;
	var i;
	var laser = false;
	for(i=0; i<deathArray.length; i++){
		if(x >deathArray[i].left)
			if(x<deathArray[i].right)
				if(y>deathArray[i].top)
					if(y<deathArray[i].bottom){
						died = deathArray[i];
						//console.log(died)
						window.cancelAnimationFrame(anim);
					}
	};
	if(died) {
		
		$('#waypoint').remove();
		if(died.name = 'death-star'){
			//console.log($('.laser').position().top+$('#death-star').offset().top);
			if(!deathLaser){
				deathLaser = true;
				$('#death-laser').animate({opacity:1},500,function(){
					var laserAngle = getAngle(Rocket.center.x,$('.laser').position().left-$('#death-star').offset().left,Rocket.center.y, $('.laser').position().top+$('#death-star').offset().top);
					var laserDistance = getDistance(Rocket.center.x, $('.laser').position().left+$('#death-star').offset().left, Rocket.center.y, $('.laser').position().top+$('#death-star').offset().top);
					//console.log(laserAngle)
					$('.laser').css({transform:'rotate('+laserAngle+'deg)'});
					$('.laser').stop(true).animate({width:laserDistance, ease:'linear'}, 50,function(){
						explode();
						deathMessage(died.message);
						$(this).delay(100).css({width:0});
						$('#death-laser').delay(100).css({opacity:0});
					});
				})
			}
		}else {
			explode();
			deathMessage(died.message);
		}
	}
}
var warp = new Sprite(19,$('#warp'),1583);
function quadAction(quadX,quadY){
	if(quadX == 0){
		if(quadY == 0){
			//Quad 1 = Death Star
			if(!moonPlayed){
				if(!muted){
					document.getElementById('moon').play();
					moonPlayed = true;
				}
			}
		}else if(quadY == 1){
			//Quad 4
		}else if(quadY == 2){
			//Quad 7
			if(!marchPlayed)
				$('#march')[0].play();
				marchPlayed = true;
			TweenMax.to($('#leia-ship'),40,{top:'100%',left:'-100%',scale:0.7,ease:Power0.easeIn,onComplete:function(){
				$('#leia-ship').remove();

			}});
			TweenMax.to($('#star-destroyer'),90,{top:'100%',left:'-150%',scale:1.5,ease:Power0.easeIn,onComplete:function(){
				$('#star-destroyer').remove();
				$('#march')[0].pause();
			}});
		}
	}else if(quadX == 1){
		if(quadY == 0){
			//Quad 2
			

			if(!warp.isAnimating){
				warp.play(true);
			}
		}else if(quadY == 1){

		}else if(quadY == 2){
			
		}
	}else if(quadX==2){
		if(quadY == 0){

		}else if(quadY == 1){

		}else if(quadY == 2){
			
		}
	}
}
function explode(){
	Rocket.isDead = true;
	Rocket.obj.addClass('exploding').children('#explosion').html('<img src="img/explosion.gif" alt="boom">');
	setTimeout(function(){Rocket.obj.children('#explosion').html('');},2400)
}
function deathMessage(message){
	dModal.children('#message').html(message);
	TweenMax.to(dModal,1,{top:(h/2)-20});
	$('#restart').one('click',restart);
}
function restart(){
	TweenMax.to(dModal,1,{top:'125%'});
	Rocket.obj.removeClass('exploding').css({left:(w+w/2)-Rocket.halfX,top:(h+h/2)-Rocket.halfY, transform:'rotate(-90deg)'});
	TweenMax.to(wrapper,2,{top:-h,left:-w, onComplete:function(){
		wOffset = wrapper.offset();
		Rocket.isDead = false;
		Rocket.locate();
		deathLaser = false;
		Rocket.angle = -90;
		Rocket.obj.children('#explosion').html('');
	}});
}	
//planet object
function Planet(obj,quadX,quadY) {
	this.top= (h*quadY)+obj.position().top;
	this.left=(w*quadX)+obj.position().left;
	this.height = obj.innerHeight();
	this.width = obj.innerWidth();
	this.bottom= this.top + this.height;
	this.right= this.left+this.width;
	this.centerX = this.left + this.width/2;
	this.centerY = this.top + this.height/2;
	this.name = obj.attr('id');
}
function DeathObj(obj,quadX,quadY,dthMsg){
	this.top = (h*quadY)+obj.position().top + obj.children('.hit-box').position().top;
	this.left = (w*quadX) + obj.position().left+ obj.children('.hit-box').position().left;
	this.height = obj.children('.hit-box').innerHeight();
	this.width = obj.children('.hit-box').innerWidth();
	this.bottom= this.top + this.height;
	this.right= this.left+this.width;
	this.centerX = this.left + this.width/2;
	this.centerY = this.top + this.height/2;
	this.name = obj.attr('id');
	this.message = dthMsg;
}
function Sprite(frames, obj, time){ //amount of frames, jQuery object, time in MS
	this.index = 0;
	this.isAnimating = false;
	this.width = obj.width();
	this.totalWidth = frames*this.width;
	this.timerVar;
	this.play = function(once){
		this.isAnimating = true;
		obj.show();
		var index = 0;
		var width = this.width;
		this.timerVar = setInterval(function(){
			if( index < frames){
				obj.css('background-position', -(index * width)+'px 0');
				index++;
			}else if(once == false){
				index = 0;
				obj.css('background-position', -(index * width)+'px 0');
			}
		},time/12, this.index, width);

	},
	this.stopAnim = function(){
		this.isAnimating = false;
		window.clearInterval(this.timerVar);
		obj.hide();
	}
}