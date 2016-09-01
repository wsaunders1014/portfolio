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
	var angle  = getAngle(mouseX,Rocket.centerX,mouseY,Rocket.centerY);
	var angleDistance = Math.sqrt((Math.pow((mouseX - (Rocket.left+Rocket.halfX)),2)) + (Math.pow((mouseY-(Rocket.top+Rocket.halfY)),2)));
	//console.log(angleDistance)
	//Closer angle gets to 0, greater distance between control points.
	//Control Points should be 90 of Angle.

	/*
	At 0 deg, CP should be -90deg.
	At -45 deg, CP should be -180deg
	At -90deg, CP should be -270deg
	-90 + (angle*2)
	*/
	var cp2Angle = -90 +(angle*2);
	// -45 - (-90 + (-45*2))
	console.log(cp2Angle);
	var tanCP = Math.tan(Math.radians(cp2Angle));
	console.log(tanCP);
	/*
	Distance CP is from end Point
	At 0 deg, CP should be distance/0.5;
	At -45 deg, CP should distance/0.25
	At  -90 deg, CP should be 0;
	0.5- ((angle/-90)/2)
	*/
	var cp2Distance = angleDistance* (0.5 - ((angle/-90)/2));
	console.log(cp2Distance);
	var cp1X,cp1Y,cp2X,cp2Y;
	cp2X = -cp2Distance;
	cp2Y = -cp2Distance * tanCP;
	endX = 1000;
	endY = 800;// 750+50
	var curve = new Bezier(Rocket.centerX,Rocket.centerY, Rocket.centerX,500, cp2X,cp2Y, mouseX,mouseY+50);
	var cDistance = curve.length();
	var curveP=curve.getLUT();
	//console.log(distance);
	//console.log(angle);
	
	//$(this).append('<div class="line" style="transform-origin:left center;width:'+angleDistance+'px;top:'+(Rocket.top+Rocket.halfY)+'px;left:'+(Rocket.left+Rocket.halfX)+'px;transform:rotate('+(angle)+'deg);"></div>');
	//$(this).append('<div class="line" style="transform-origin:left center;width:'+cp2Distance+'px;top:'+(mouseY)+'px;left:'+(mouseX)+'px;transform:rotate('+(cp2Angle)+'deg);"></div>');
	//console.log(curve.getLUT());
	$('body').append('<div class="waypoint" style="background:#ff0000;top:'+(500) +'px;left:'+(Rocket.left+50)+'px;"></div>');
	$('body').append('<div class="waypoint" style="background:#ff0000;top:'+(cp2Y) +'px;left:'+(cp2X)+'px;"></div>');
	for(i=0;i<curveP.length;i+=2){
		$('body').append('<div class="waypoint" style="top:'+(curveP[i].y) +'px;left:'+(curveP[i].x)+'px;"></div>');
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
		Rocket.obj.css({left: coords.x-92.5,top:coords.y-50,transform:'rotate('+nextAngle+'deg)'});
		oldCoords = coords;
		if(progress < time)
			window.requestAnimationFrame(move);

	}
	window.requestAnimationFrame(move);

});

////// HELPER FUNCTIONS ///////////
function locateRocket(){
	Rocket.left = Rocket.obj.position().left;
	Rocket.top = Rocket.obj.position().top;
	Rocket.centerX = Rocket.left + (Rocket.height/2);
	Rocket.centerY = Rocket.top + (Rocket.width/2);
	//console.log(Rocket.left,Rocket.top);
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