$(document).ready(function(){
	var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	//console.log(w+', '+h);
	$('body').fitText(1.5);
	var devPlanet = new Planet($('#dev'));
	var actorPlanet = new Planet($('#actor'));
	var writerPlanet = new Planet($('#writer'));
	
	
	locateRocket();

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
	// var rocket = $('#rocket');
	// var rocketW = rocket.width();
	// var rocketOrigin = rocketW/2;
	// var isLanding = false;
	// var rocketY = Math.round(rocket.position().top);
	// var rocketX = Math.round(rocket.position().left);
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
	
	// $('.planet').hover(function(){
	// 	$(this).children('.info').show();
	// }, function(){
	// 	$(this).children('.info').hide();
	// });
	


	
	var coords  = [];
	
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




//planet object
function Planet(obj) {
	this.topBound= obj.position().top;
	this.leftBound=obj.position().left;
	this.bottomBound=this.topBound + obj.innerHeight();
	this.rightBound=obj.position().left+obj.width();
	this.name = obj.attr('id');
}

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