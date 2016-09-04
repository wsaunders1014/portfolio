/*This code is very WIP
ROCKET by Will Saunders
8-20-16
*/
//var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;
var wrapper = $('#wrapper');
var wOffset = wrapper.offset();
//console.log(wOffset);
var time500 = 500;
var Rocket ={
	width:185,
	height:100,
	halfX:50,//these are reversed because 90deg is considered 0.
	halfY:92.5,
	speed:125,
	obj: $('#rocket'),
	glow:$('#glow'),
	leftEngine:$('#left-engine'),
	rightEngine:$('#right-engine'),
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
	mouseX = e.pageX-wOffset.left;
	mouseY= e.pageY-wOffset.top;
	var angle = getAngle(mouseX,Rocket.left+92.5,mouseY,Rocket.top+50);
	angle =angle - Rocket.angle;
	if(angle > 180)
		angle -=360;
	$('#debug .mouse').html(mouseX+', '+mouseY);
	$('#debug .angle').html(Math.round(angle));
	//start = false;
})
var fly;
var angle;
var distance;

var anim;

wrapper.on('click', function(e){
	mouseX = e.pageX-wOffset.left;
	mouseY= e.pageY-wOffset.top;
	
	Rocket.target.left = mouseX;
	Rocket.target.top = mouseY;
	window.cancelAnimationFrame(anim);
	//console.log('mouse: '+mouseX+', '+mouseY)
	var absAngle  = getAngle(mouseX,Rocket.centerX,mouseY,Rocket.centerY);
	var angleDistance = Math.sqrt((Math.pow((mouseX - (Rocket.left+92.5)),2)) + (Math.pow((mouseY-(Rocket.top+50)),2)));
	absAngle =absAngle - Rocket.angle;
	if(absAngle > 180)
		absAngle -=360;
	//console.log('abs Distance: '+angleDistance);
	//console.log('Angle: '+absAngle);

	var cp2Angle = (180 + Rocket.angle) +(absAngle*2);
	if(absAngle < -90)
		cp2Angle+=90;
	if(absAngle > 90)
		cp2Angle -=90;

	//var distRatio = Math.abs((Math.abs(Rocket.angle) - Math.abs(absAngle))/180);
	var distRatio = Math.abs((absAngle/90)*0.5);
	 if(absAngle < -150 || absAngle > 150 ){
	 	if(absAngle <0)
	 		cp2Angle+=90;
	 	else
	 		cp2Angle-=90;
	 }
	distRatio = Math.max(0.04,distRatio);
	console.log('cp2Angle: '+cp2Angle);
	var cp2Distance = angleDistance* distRatio;

	console.log('cp2Distance: '+cp2Distance)
	var cp1X,cp1Y,cp2X,cp2Y;
	cp1X = Rocket.centerX + cp2Distance* (Math.cos(Math.radians(Rocket.angle)));
	cp1Y = Rocket.centerY + cp2Distance* (Math.sin(Math.radians(Rocket.angle)));
	cp2X = mouseX + cp2Distance*( Math.cos(Math.radians(cp2Angle)));
	cp2Y = mouseY+ cp2Distance*( Math.sin(Math.radians(cp2Angle)));
	
	//Red Line
	// $(this).append('<div class="line" style="transform-origin:left center;width:'+(Math.round(angleDistance))+'px;top:'+(Rocket.centerY)+'px;left:'+(Rocket.centerX)+'px;transform:rotate('+(Math.round(absAngle)-90)+'deg);"></div>');
	// //Blue Line
	// $(this).append('<div class="line" style="background:#0000FF;transform-origin:left center;width:'+Math.round(cp2Distance)+'px;top:'+(mouseY)+'px;left:'+(mouseX)+'px;transform:rotate('+(Math.round(cp2Angle))+'deg);"></div>');
	//  $(this).append('<div class="line" style="background:#0000FF;transform-origin:left center;width:'+(+cp2Distance)+'px;top:'+(Rocket.centerY)+'px;left:'+(Rocket.centerX)+'px;transform:rotate('+(Rocket.angle)+'deg);"></div>');
	
	//console.log(curve.getLUT());
	// $('body').append('<div class="waypoint" style="background:#ff0000;top:'+(cp1Y-5) +'px;left:'+(cp1X-5)+'px;"></div>');
	//$('body').append('<div class="waypoint" style="background:#ff0000;top:'+(polarY-5) +'px;left:'+(polarX-5)+'px;"></div>');
	var curve = new Bezier(Rocket.centerX,Rocket.centerY, cp1X,cp1Y,cp2X,cp2Y, mouseX,mouseY);
	var cDistance = curve.length();
	var curveP=curve.getLUT();

	for(i=0;i<curveP.length;i+=4){
		$('#waypoints').append('<div class="waypoint" style="top:'+(curveP[i].y-5) +'px;left:'+(curveP[i].x-5)+'px;"></div>');
	}
	var start = false;
	var oldCoords = {x:Rocket.centerX,y:Rocket.centerY};
	//console.log(curveP);
	//if(absAngle > -90){
		Rocket.leftEngine.stop().animate({opacity:1},300);
	//}else {
		Rocket.rightEngine.stop().animate({opacity:1},300);
	//}
	function move(timestamp){
		if(!Rocket.isMoving){
			Rocket.isMoving = true;
			Rocket.glow.animate({opacity:1},500);
		}
		if (!start) start = timestamp;
	 	var progress = timestamp-start;
		var time = (cDistance/100)*500;
		var t = progress/time;
		var coords = curve.get(t);
		var nextAngle = getAngle(coords.x,oldCoords.x,coords.y,oldCoords.y);
		Rocket.angle = nextAngle;
		var wrapMoveX = wOffset.left - (coords.x-oldCoords.x);
		var wrapMoveY = wOffset.top - (coords.y-oldCoords.y);
		if(wrapMoveX > 0)
			wrapMoveX = 0;
		else if(wrapMoveX < -wrapperW + (wrapperW/3))
			wrapMoveX = -wrapperW - (wrapperW/3);
		else if (Rocket.centerX > w/2 && Rocket.centerX < wrapperW - w/2){
			wrapper.css({left: wrapMoveX});
			wOffset = wrapper.offset();
		}
		if(wrapMoveY > 0)
			wrapMoveY = 0;
		else if(wrapMoveY < -wrapperH + (wrapperH/3))
			wrapMoveX = -wrapperH - (wrapperH/3);
		else if (Rocket.centerY > h/2 && Rocket.centerY < wrapperH - h/2){
			wrapper.css({top: wrapMoveY});
			wOffset = wrapper.offset();
		}
		Rocket.obj.css({left: coords.x-Rocket.halfY,top:coords.y-Rocket.halfX,transform:'rotate('+nextAngle+'deg)'});
		locateRocket(coords.x-92.5,coords.y-50);
		oldCoords = coords;
		if(progress <= time)
			anim = window.requestAnimationFrame(move);
		else {
			Rocket.glow.animate({opacity:0},500);
			Rocket.leftEngine.animate({opacity:0},300);
			Rocket.rightEngine.stop().animate({opacity:0},300);
			Rocket.isMoving = false;
		//	console.log('Final Angle: '+Rocket.angle);
			console.log(' ');
		}

	}
	anim = window.requestAnimationFrame(move);

});

////// HELPER FUNCTIONS ///////////
function locateRocket(left, top){

	Rocket.left = left || parseInt(Rocket.obj.css('left').match(/\d+/g)[0]);
	Rocket.top = top || parseInt(Rocket.obj.css('top').match(/\d+/g)[0]);
	//console.log(parseInt(Rocket.obj.css('left').match(/\d+/g)[0]));
	if(left){
		Rocket.centerX = left + (Rocket.width/2);
		Rocket.centerY =  top + (Rocket.height/2);
	}else {
		Rocket.centerX =  Rocket.left + 92.5;
		Rocket.centerY = Rocket.top + 50;
	}
	//$('#wrapper').append('<div class="waypoint" style="left:'+(Rocket.centerX-5)+'px;top:'+(Rocket.centerY-5)+'px;"></div>')
//	console.log(Rocket.centerX,Rocket.centerY);
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