/*This code is very WIP
ROCKET by Will Saunders
8-20-16
*/
//var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

var time500 = 500;
var Rocket ={
	width:185,
	height:100,
	halfX:50,//these are reversed because 90deg is considered 0.
	halfY:92.5,
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
	angle:-90,
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
		this.angle = newDeg;
		this.isRotating = true;
	},
	fly: function(mouseX, mouseY){
		//console.log(mouseY,mouseX);
		
		var distance = Math.sqrt((Math.pow((mouseX - this.centerX),2)) + (Math.pow((mouseY-this.centerY),2)));
	//	console.log(distance);
		moveY = mouseY;
		moveX = mouseX;
	
	}
}
var mouseX;
var mouseY;
$('body').mousemove(function(e){
	mouseX = e.pageX;
	mouseY= e.pageY;
	$('#debug .mouse').html(mouseX+', '+mouseY);
	$('#debug .angle').html(Math.round(getAngle(mouseX,Rocket.left+Rocket.halfX,mouseY,Rocket.top+Rocket.halfY)));
	//start = false;
})
var fly;
var angle;
var distance;


$('#wrapper').on('click', function(e){
	mouseX = e.pageX;
	mouseY= e.pageY;
	Rocket.target.left = e.pageX;
	Rocket.target.top = e.pageY;
	//console.log('mouse: '+mouseX+', '+mouseY)
	var absAngle  = getAngle(mouseX,Rocket.centerX,mouseY,Rocket.centerY);
	var angleDistance = Math.sqrt((Math.pow((mouseX - (Rocket.left+Rocket.halfX)),2)) + (Math.pow((mouseY-(Rocket.top+Rocket.halfY)),2)));
	console.log('Angle: '+absAngle);

	//adj angle should be -90deg
	// -44 = 0

	/*
		-134+ -44
		30 +44
	*/
	//angle = (90 + Rocket.angle) + absAngle;
	//console.log('adjAngle: '+absAngle);


	//var cp2Angle = -90 +(absAngle*2);
	var cp2Angle = Rocket.angle +(absAngle*2);
	// -90 + (-30 * 2)
	// 28 + (-46 *2)
	console.log('cp2Angle: '+cp2Angle);
	//var invCP2Angle = 90+ absAngle;
	//console.log('Inv Angle: '+invCP2Angle);
	//console.log('angDist: '+angleDistance);
	// -90 = 0
	// 0 = .5
	var cp2Distance = Math.abs(angleDistance* (0.5 - ((absAngle/-90)/2)));
	//var cp2Distance = angleDistance*.5;
	//console.log(cp2Distance);
	var cp1X,cp1Y,cp2X,cp2Y;
	cp1X = Rocket.centerX + cp2Distance* (Math.cos(Math.radians(Rocket.angle)));
	cp1Y = Rocket.centerY + cp2Distance* (Math.sin(Math.radians(Rocket.angle)));
	cp2X = mouseX + cp2Distance*( Math.cos(Math.radians(cp2Angle)));
	cp2Y = mouseY+ cp2Distance*( Math.sin(Math.radians(cp2Angle)));
	//console.log(polarX,polarY);
	console.log(cp1X, cp1Y);
	


	var curve = new Bezier(Rocket.centerX,Rocket.centerY, cp1X,cp1Y,cp2X,cp2Y, mouseX,mouseY);
	var cDistance = curve.length();
	var curveP=curve.getLUT();

	
	//Red Line
	$(this).append('<div class="line" style="transform-origin:left center;width:'+(Math.round(angleDistance))+'px;top:'+(Rocket.centerY)+'px;left:'+(Rocket.centerX)+'px;transform:rotate('+(Math.round(absAngle))+'deg);"></div>');
	//Blue Line
	$(this).append('<div class="line" style="background:#0000FF;transform-origin:left center;width:'+Math.round(cp2Distance)+'px;top:'+(mouseY)+'px;left:'+(mouseX)+'px;transform:rotate('+(Math.round(cp2Angle))+'deg);"></div>');
	$(this).append('<div class="line" style="background:#0000FF;transform-origin:left center;width:'+(+cp2Distance)+'px;top:'+(Rocket.centerY)+'px;left:'+(Rocket.centerX)+'px;transform:rotate('+(Rocket.angle)+'deg);"></div>');
	
	//console.log(curve.getLUT());
	$('body').append('<div class="waypoint" style="background:#ff0000;top:'+(cp1Y-5) +'px;left:'+(cp1X-5)+'px;"></div>');
	//$('body').append('<div class="waypoint" style="background:#ff0000;top:'+(polarY-5) +'px;left:'+(polarX-5)+'px;"></div>');
	for(i=0;i<curveP.length;i+=4){
		$('body').append('<div class="waypoint" style="top:'+(curveP[i].y-5) +'px;left:'+(curveP[i].x-5)+'px;"></div>');
	}
	var start = false;
	var oldCoords = {x:Rocket.centerX,y:Rocket.centerY};
	function move(timestamp){
		if (!start) start = timestamp;
	 	var progress = timestamp-start;
		var time = (cDistance/100)*500;
		var t = progress/time;
		var coords = curve.get(t);
		var nextAngle = getAngle(coords.x,oldCoords.x,coords.y,oldCoords.y);
		//console.log(coords);
		Rocket.angle = nextAngle;
		Rocket.obj.css({left: coords.x-Rocket.halfY,top:coords.y-Rocket.halfX,transform:'rotate('+nextAngle+'deg)'});
		locateRocket(coords.x-92.5,coords.y-50);
		oldCoords = coords;
		if(progress < time)
			window.requestAnimationFrame(move);
		else {
			console.log('Final Angle: '+Rocket.angle);
		}

	}
	window.requestAnimationFrame(move);

});

////// HELPER FUNCTIONS ///////////
function locateRocket(left, top){
	Rocket.left = left || Rocket.obj.position().left;
	Rocket.top = top || Rocket.obj.position().top;
	if(left){
		Rocket.centerX = left + (Rocket.width/2);
		Rocket.centerY =  top + (Rocket.height/2);
	}else {
		Rocket.centerX =  Rocket.left + Rocket.halfX;
		Rocket.centerY = Rocket.top + Rocket.halfY;
	}
	//$('#wrapper').append('<div class="waypoint" style="left:'+(Rocket.centerX-5)+'px;top:'+(Rocket.centerY-5)+'px;"></div>')
	//console.log(Rocket.centerX,Rocket.centerY);
}
//helper function radians to degrees
function getAngle(x2,x1,y2,y1){
	var angle = Math.degrees(Math.atan2(y2-y1,x2-x1));
	return angle;
}
Math.degrees = function(radians) {
  return (radians * 180) / Math.PI;
};
function distance(x2,x1,y2,y1){
	return	Math.sqrt((Math.pow((x2 - x1),2)) + (Math.pow((y2-y1),2)));
}
function getSlope(x2,x1,y2,y1){
	return (y2-y1) / (x2-x1);
}
function getInvSlope(x2,x1,y2,y1){
	return (x2-x1) / (y2-y1);
}
Math.radians = function(angle){
	return angle * Math.PI/180;
}
var getPositionData = function(el) {
    return $.extend({
        width: el.outerWidth(false),
        height: el.outerHeight(false)
    }, el.offset());
};