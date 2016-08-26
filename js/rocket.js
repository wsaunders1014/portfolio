/*This code is very WIP
ROCKET by Will Saunders
8-20-16
*/
//var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;
var Rocket ={
	width:200,
	height:200,
	speed:125,
	obj: $('#rocket'),
	isLanding:false,
	isLanded: false,
	isMoving: false,
	isRotating: false,
	isCoasting:false,
	isAccelerating: false,
	isDecelerating:false,
	turningRadius: 30,
	target:{top:0,left:0},
	tween: false,
	centerX: 0,
	centerY: 0,
	top:0,
	left:0,
	oldLeft:0,
	oldTop:0,
	angle:0,
	fltTimer:false,
	fltTween:false,
	land: function(){
		TweenMax.to(rocket,3,{width:'0px', onComplete:function(){
			rocketY = Math.round(rocket.position().top);
			rocketX = Math.round(rocket.position().left);	
		}});
	},
	rotate: function(mouseX,mouseY){
	// 	
		var newDeg = -Math.degrees(Math.atan2(mouseY-this.centerY,mouseX-this.centerX));

		// if(newDeg > 0){ // fixes angles so 0 is up, and positive is on right side to sync with css
		// 	newDeg = newDeg-180;
		// }else {
		// 	newDeg = newDeg+180;
		// }
		console.log(newDeg);
		this.angle = newDeg;
		this.isRotating = true;
		// this.tween = new TweenMax.to(this.obj, 0.5, {directionalRotation:newDeg+'_short', onComplete:function(){
		// 	this.isRotating = false;
		// 	//console.log('rotate ended');
		// }});
	},
	fly: function(mouseX, mouseY){
		//console.log(mouseY,mouseX);
		
		var distance = Math.sqrt((Math.pow((mouseX - this.centerX),2)) + (Math.pow((mouseY-this.centerY),2)));
	//	console.log(distance);
		moveY = mouseY;
		moveX = mouseX;
		// this.fltTween = new TweenMax.to(this.obj, .5*(distance/this.speed),{delay:0.5, top:mouseY-(this.height/2) ,left:(mouseX - (this.width/2)) , ease: Power2.easeIn, onComplete:function(){
		// 	locateRocket();
		// }});
	//	console.log(this.angle);
		// if(this.angle > -45 && this.angle < 45 ){// basically, up
		// 	console.log('up');
		// 	if(mouseY > this.top){
		// 		//console.log('test1');
		// 		moveY = mouseY-this.height;
		// 	}else {
		// 		moveY = mouseY;
		// 	}
		// 	//if(mouseX > this.left){
		// 		moveX = mouseX - (this.width/2);
		// }else if(this.angle < -45 && this.angle > -135){ //basically, left
		// 	console.log('left');
		// 	if(mouseY > this.top){
		// 		moveY = mouseY-this.width;
		// 	}else {
		// 		moveY = mouseY;
		// 	}
		// 	moveX = mouseX + (this.width/2);
		// }else if(this.angle > 135 || this.angle < -135){//basically, down
		// 	console.log('down');
		// 	if(mouseY > this.top){
		// 		moveY = mouseY-this.height;
		// 	}else {
		// 		moveY = mouseY;
		// 	}
		// 	moveX = mouseX - (this.width/2);
		// }else if (this.angle > 45 && this.angle < 135){
		// 	console.log('right');
		// 	if(mouseY > this.top){
		// 		moveY = mouseY-this.width;
		// 	}else {
		// 		moveY = mouseY;
		// 	}
		// 	moveX = (mouseX-this.height)+this.width/2;
		// }
		//}else {
		//	moveX = mouseX;
		//}
		// this.obj.animate({top: moveY,left:moveX}, {duration:500*(distance/this.speed), queue:false, step:function(now,fx){
		// 	locateRocket();

		// },complete:function(){
		// 	//console.log(Rocket.top,Rocket.left);
		// 	//console.log('Rocket Angle:'+ Rocket.angle);
		// }});

	}
}
var mouseX;
var mouseY;
$('body').mousemove(function(e){
	mouseX = e.pageX;
	mouseY= e.pageY;
	$('#debug').html(mouseX+', '+mouseY);
	//start = false;
})
var fly;
var angle;
var distance;


$('#wrapper').on('click', function(e){
	mouseX = e.pageX;
	mouseY= e.pageY;
	//$('#wrapper').append('<div class="waypoint" style="top:'+(e.pageY-5)+'px;left:'+(e.pageX-5)+'px;"></div>')
//	$('#intro').fadeOut(500);
	Rocket.target = {left:e.pageX,top:e.pageY};
	console.log(Rocket.target);
	Rocket.oldLeft = Rocket.left;
	Rocket.oldTop = Rocket.top;
	//console.log(Rocket.target);

	//Need to factor in current Angle
	angle = -Math.degrees(Math.atan2(mouseX-Rocket.centerX,mouseY-Rocket.centerY));
	

	distance = Math.sqrt((Math.pow((mouseX - Rocket.centerX),2)) + (Math.pow((mouseY-Rocket.centerY),2)));
	if(angle > 0){ // fixes angles so 0 is up, and positive is on right side to sync with css
		angle = angle-180;
	}else {
		angle = angle+180;
	}
	//console.log(Rocket.angle);
	//console.log(-(angle - Rocket.angle));

//	console.log('Distance: '+Math.round(distance));
	//console.log('Angle: '+Math.round(angle));
//	var center = {x:mouseX,y:mouseY+(Rocket.centerY -mouseY)};
	//console.log(center);
	//draw triangle
	//$(this).append('<div class="line" style="transform-origin:left center;width:'+distance+'px;top:'+Rocket.centerY+'px;left:'+Rocket.centerX+'px;transform:rotate('+(angle-90)+'deg);"></div>');
	//$(this).append('<div class="line" style="width:'+3+'px;height:'+(Rocket.centerY -mouseY)+'px;top:'+mouseY+'px;left:'+mouseX+'px;"></div>');
	//Rocket.rotate(e.pageX,e.pageY);
	//Rocket.fly(e.pageX,e.pageY);
	//console.log(e);
/*
Whatever current angle is "North", and ship can only go North. 
Let's say turn radius is 25deg, anything more and we activate curve.

the direction the nose is facing must always be considered 0?
*/
//So this works so far
	console.log('Angle1: '+angle);
    if(Rocket.angle >= 0){
    	angle =angle - Rocket.angle;
    }else if (Rocket.angle <=0){
    	//angle = angle + Rocket.angle;
    }

	if( angle < Rocket.turningRadius && angle > -Rocket.turningRadius){//infront of ship
			bezierStartAngle=0;
			bezierStartLength= 0;
			bezierEndAngle=10;
			bezierEndLength= 0.3;
			bezierEnd = {x:Rocket.target.left  ,y:Rocket.target.top};
	}else if ( angle >= Rocket.turningRadius) {
		
		if(angle < 90){

			bezierStartAngle=270+angle;
			bezierStartLength= 0.5;
			bezierEndAngle=0;
			bezierEndLength= 0;
			bezierEnd = {x:Rocket.target.left, y:Rocket.target.top};
			//bezier_params.end.y=Rocket.target.top-Rocket.width;
		}else {
			bezierStartAngle=270;
			bezierStartLength= 1.5;
			bezierEndAngle=0;
			bezierEndLength= 0;
			bezierEnd = {x:Rocket.target.left,y:Rocket.target.top};
		}
	}else if (angle <= -Rocket.turningRadius){
		if (angle > -90){ //left turn
			bezierStartAngle=60;
			bezierStartLength= 0.49;
			bezierEndAngle=330;
			bezierEndLength= 0.3;
			bezierEnd = {x:Rocket.target.left,y:Rocket.target.top};
		//	bezier_params.end.y=Rocket.target.top-Rocket.width;
		}else {
			bezierStartAngle=90;
			bezierStartLength= 1.5;
			bezierEndAngle=0;
			bezierEndLength= 0;
			bezierEnd = {x:Rocket.target.left,y:Rocket.target.top};
		}
	}
	var bezier_params = {
	    start: {
	      x: Rocket.left,
	      y: Rocket.top,
	      angle: bezierStartAngle,
	      length:bezierStartLength
	    },
	    end: {
	      x:bezierEnd.x,
	      y:bezierEnd.y,
	      angle: bezierEndAngle,
	      length:bezierEndLength
	    }
    }
//console.log(bezier_params);
console.log('Angle2: '+angle);
Rocket.obj.animate({path : new $.path.bezier(bezier_params, true)},{
	duration:1000,
	step:function(now, fx){
	//	locateRocket();
		//console.log(now);
		//adjDeg = -Math.degrees(Math.atan2((Rocket.target.left-Rocket.width/2)-Rocket.centerX, (Rocket.target.top-Rocket.height/2)-Rocket.centerY));
		//console.log(angle*fx.pos);
		//console.log(Rocket.centerX,Rocket.centerY);

		// adjDeg = -Math.degrees(Math.atan2(Rocket.target.left-Rocket.centerX, Rocket.target.top - Rocket.centerY));
		// if(adjDeg > 0){ // fixes angles so 0 is up, and positive is on right side to sync with css
		// 	adjDeg = adjDeg-180;
		// }else {
		// 	adjDeg = adjDeg+180;
		// }
		//console.log(adjDeg);
	//	console.log(Rocket.centerX, Rocket.target.left);
	
		//Rocket.obj.css({transform:'rotate('+(angle*fx.pos)+'deg)'});
		
	
	}});

});
$('#control input').blur(function(){
	var bezier_params = {
	    start: {
	      x: Rocket.left,
	      y: Rocket.top,
	      angle: $('#cp1-angle').val(),
	      length:$('#cp1-length').val()
	    },
	    end: {
	      x:Rocket.target.left-Rocket.width/2,
	      y:Rocket.target.top-Rocket.height/2,
	      angle: $('#cp2-angle').val(),
	      length: $('#cp2-length').val()
	    }
	 }
Rocket.obj.animate({path : new $.path.bezier(bezier_params)},1000);

});


////// HELPER FUNCTIONS ///////////
function locateRocket(){
	Rocket.left = Rocket.obj.position().left;
	Rocket.top = Rocket.obj.position().top;
	Rocket.centerX = Rocket.left + (Rocket.width/2);
	Rocket.centerY = Rocket.top + (Rocket.height/2);
}
//helper function radians to degrees
Math.degrees = function(radians) {
  return (radians * 180) / Math.PI;
};
function distance(x2,x1,y2,y1){
	return	Math.sqrt((Math.pow((x2 - x1),2)) + (Math.pow((y2-y1),2)));
}
var getPositionData = function(el) {
    return $.extend({
        width: el.outerWidth(false),
        height: el.outerHeight(false)
    }, el.offset());
};