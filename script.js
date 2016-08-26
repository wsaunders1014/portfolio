$(document).ready(function(){

	var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

	var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

	//console.log(w+', '+h);

	$('body').fitText(1.5);

	var devPlanet = new Planet($('#dev'));

	var actorPlanet = new Planet($('#actor'));

	var writerPlanet = new Planet($('#writer'));

	var flames = new Sprite(24,$('#flames'),2000);

	

	//var planets = [devPlanet,actorPlanet,writerPlanet];

	//console.log(planets);



	//center intro 

	$('#intro').css({top:(h-$('#intro').height())/2});



	//SCROLL FUNCTION 

	var pos = 0;

	$('#pane').on('wheel', function(e){

		//console.log(e);

		var contentH = $('.content').height();

		var paneH = $('#pane').height();

		//console.log(contentH+', '+paneH);

		var diff = paneH - contentH;

		//console.log(diff);

		var scroll = 50;

		if (diff < 0){

			if(e.originalEvent.deltaY > 0){

				//scroll down

				if((pos - scroll) < diff){

					pos = diff;

				}else {

					pos = pos-scroll;

				}

				$('.content').stop(true,true).animate({top:pos},500,'linear');

			}else {

				//scroll up

				if(pos+scroll > 0){

					pos = 0;

				}else {

					pos = pos + scroll;

				}

				$('.content').stop(true, true).animate({top:pos},500, 'linear');

			}

		}

	});

	// ROCKET TRAVEL TO MOUSE

	var rocket = $('#rocket');

	var rocketW = rocket.width();

	var rocketOrigin = rocketW/2;

	var isLanding = false;

	var rocketY = Math.round(rocket.position().top);

	var rocketX = Math.round(rocket.position().left);

	var mouseX;

	var mouseY;

	var waypointInterval;



	var flight =false;

	var rotate = false;



	$('#message-link').click(function(e){

		e.preventDefault();

		$('#contact').children('.info').addClass('form-open');

		//$('#contact-form').show();

	});

	$('.close').click(function(){

		$('.form-open').removeClass('form-open');

	});

	$('#wrapper').mousedown(function(e){

		if(e.button ==0 && !isLanding ){

			

			mouseX = e.pageX;

			mouseY = e.pageY;

			$('#intro').fadeOut(750);

			$('.info').fadeIn(750);

			$('#wrapper').mousemove(function(e){

				mouseX = e.pageX;

				mouseY = e.pageY;

			});	

			 waypointInterval = window.setInterval(function(){setWaypoint(mouseX,mouseY)},200);

		}else if(isLanding){

			mouseX = e.pageX;

			mouseY = e.pageY;

			$('#pane').fadeOut(1000);

			$('.content').css({top:0});

			$('.info').fadeIn(1000);

			rocket.show();

			var angle = Math.degrees(Math.atan2(mouseY-rocketY,mouseX-rocketX));

			rotate = new TweenMax.to( rocket, 1.5, {delay:1, directionalRotation:(angle+90)+'_short'});

			TweenMax.to(rocket,3,{delay:1, width:'100px', onComplete:function(){

				isLanding = false;

			}});

		}

	}).mouseup(function(e){

		if(e.button ==0  && !isLanding){

			setWaypoint(e.pageX,e.pageY);

			$('#wrapper').off('mousemove');

			window.clearInterval(waypointInterval);

		}

	}).mouseleave(function(e){

		//setWaypoint(e.pageX,e.pageY);

		if(e.button ==0  && !isLanding){

			$('#wrapper').off('mousemove');

			window.clearInterval(waypointInterval);

		}

	});

	// $('.planet').hover(function(){

	// 	$(this).children('.info').show();

	// }, function(){

	// 	$(this).children('.info').hide();

	// });

	

	// FORM PROCESSING

	var errors = 3;

	$('input').not('.submit').blur(function(){

		if($(this).val()==''){

			$(this).addClass('error');

			if (errors <3){

				errors++;

			}

		}else {

			$(this).removeClass('error');

			errors--;

		}

		if(errors == 0){

			$('.submit').removeAttr('disabled');

		}

	});

	$('textarea').blur(function(){

		if($(this).val()==''){

			$(this).addClass('error');

			if (errors <3){

				errors++;

			}

		}else {

			$(this).removeClass('error');

			errors--;

		}

		if(errors == 0){

			$('.submit').removeAttr('disabled');

			errors--;

		}

	});



	$('form').submit(function(event) {

		var formData = {

            'fname'      :  $('input[name=fname]').val(),

            'email'      :  $('input[name=email]').val(),

            'message'    :  $('textarea[name=message]').val()

        };

        // process the form

        $.ajax({

            type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)

            url         : 'form-process.php', // the url where we want to POST

            data        : formData, // our data object

            dataType    : 'json', // what type of data do we expect back from the server

            encode      : true

        }).done(function(data) {

            console.log(data); 

        

             if (!data.success) {

             	$('.form-errors').show();

             	 if (data.errors.fname) {

             	 	$('input[name=fname]').addClass('error');

             	 	$('.form-errors').append('<div>'+data.errors.fname+'</div');

             	 }

             	 if (data.errors.email) {

             	 	$('input[name=email]').addClass('error');

             	 	$('.form-errors').append('<div>'+data.errors.email+'</div');

             	 }

             	 if (data.errors.message) {

             	 	$('textarea[name=message]').addClass('error');

             	 	$('.form-errors').append('<div>'+data.errors.message+'</div');

             	 }

             }else {

             	$('.thank-you').show();

             	$('.form-open').removeClass('form-open');

             	window.setTimeout(function(){

             		$('.thank-you').hide();

             		



             	},2500);

            }

        });

         event.preventDefault();

	});



	var distance =0; //Math.sqrt((Math.pow((x2 -x1),2)) + (Math.pow((y2-y1),2)))

	var coords  = [];

	function setWaypoint(x,y){	

		if(typeof flight.kill == 'function'){

			flight.kill();

			rotate.kill();

			rocketY = Math.round(rocket.position().top);

			rocketX = Math.round(rocket.position().left);

		}

		var angle = Math.degrees(Math.atan2(y-rocketY,x-rocketX));

		if(flames.isAnimating == false){

			//flames.animate();

		}

		rotate = new TweenMax.to( rocket, 0.5, {directionalRotation:(angle+90)+'_short'});

		flight = new TweenMax.to( rocket, 2, {top:y, left:x - rocketOrigin, onComplete:function(){

			//$('#flames').hide();

			

			flames.stopAnim();

			if(checkCollision(x,y)){

				$('#pane').fadeIn(1000);

				$('.info').fadeOut(1000);

				isLanding = true;

				TweenMax.to(rocket,3,{width:'0px', onComplete:function(){

					rocketY = Math.round(rocket.position().top);

					rocketX = Math.round(rocket.position().left);	

				}});



			}else {

				

				

			}

		}});

	}

	function checkCollision(x,y){

		var collided = false;

		if(x>devPlanet.leftBound && x < devPlanet.rightBound){

			if(y>devPlanet.topBound && y < devPlanet.bottomBound){

				collided='dev';

			}

		}else if(x>actorPlanet.leftBound && x < actorPlanet.rightBound){

			if(y>actorPlanet.topBound && y <actorPlanet.bottomBound){

				collided='actor';

			}

			

		}else if(x>writerPlanet.leftBound && x < writerPlanet.rightBound){

			if(y>writerPlanet.topBound && y < writerPlanet.bottomBound){

				collided='writer';

			}

		}

		if(collided){

			$.get(collided+'.html', function(data){

				$('#pane .content').html(data);



			});

			return true;

		}else {

			return collided;

		}

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

	});

}); //END READY





//helper function radians to degrees

Math.degrees = function(radians) {

  return radians * 180 / Math.PI;

};



//planet object

function Planet(obj) {

	this.topBound= obj.position().top;

	this.leftBound=obj.position().left;

	this.bottomBound=this.topBound + obj.innerHeight();

	this.rightBound=obj.position().left+obj.width();

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