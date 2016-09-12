/*This code is very WIP
ROCKET by Will Saunders
8-20-16
*/
var wrapper = $('#wrapper');
var wOffset = wrapper.offset();
var mouseX,mouseY,anim,oldCoords,xDistance,yDistance;
var Rocket ={
	width:185,
	height:100,
	halfY:50,
	halfX:92.5,
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
	currQuadX:1,
	currQuadY:1,
	target:{top:0,left:0},
	origin:{left:0,top:0},
	center:{x:0,y:0},
	pos:{left:0,top:0},
	angle:-90,
	isDead: false,
	land: function(){
		var landTween;
		if(!Rocket.isLanded && !Rocket.isLanding){//land
			landTween = TweenMax.to(Rocket.obj,2,{scale:0, overwrite:1, directionalRotation:Rocket.angle+'_short', onStart:function(){
				Rocket.isLanding = true;
			},onComplete:function(){
				Rocket.isLanded = true;
				Rocket.isLanding = false;
				
			}});
		}else if(Rocket.isLanded || Rocket.isLanding == true){//take off
			if(landTween)
				landTween.kill();
			landTween = new TweenMax.to(Rocket.obj,2,{scale:1,overwrite:1, directionalRotation:Rocket.angle+'_short', onStart:function(){
				Rocket.isLanding = true;
			},onComplete:function(){
				Rocket.isLanded = false;
				Rocket.isLanding = false;
			}});
		}
	},
	locate: function(left, top){
		this.pos.left = left || parseInt(this.obj.css('left').match(/\d+/g)[0]);
		this.pos.top = top || parseInt(this.obj.css('top').match(/\d+/g)[0]);
		if(left){
			this.center.x = left + (this.width/2);
			this.center.y =  top + (this.height/2);
		}else {
			this.center.x =  this.pos.left + 92.5;
			this.center.y = this.pos.top + 50;
		}
	},
	fly: function(timestamp){
		if(!Rocket.isMoving){
			Rocket.isMoving = true;
			Rocket.glow.animate({opacity:1},500);
		}
		if (!start) 
			start = timestamp;
	 	var progress = timestamp-start;
		var time = (cDistance/Rocket.speed)*500;
		var t = progress/time;
		if(curve){
			var coords = curve.get(t);
		}else {//straight line
			var coords = {x:Rocket.origin.left+(xDistance*t),y:Rocket.origin.top+(yDistance*t)}
		}
		if(!oldCoords)
			oldCoords = {x:Rocket.origin.left+Rocket.halfX,y:Rocket.origin.left+Rocket.halfY};
		if(t !=0 && curve){
			var nextAngle = getAngle(coords.x,oldCoords.x,coords.y,oldCoords.y);
			Rocket.angle = nextAngle;
			Rocket.obj.css({left: coords.x-Rocket.halfX,top:coords.y-Rocket.halfY,transform:'rotate('+nextAngle+'deg)'});
		}else {
			Rocket.obj.css({left: coords.x-Rocket.halfX,top:coords.y-Rocket.halfY});
		}
		
		deathCheck(coords.x, coords.y);
		//MOVE WRAPPER
		var wrapMoveX = wOffset.left - (coords.x-oldCoords.x);
		var wrapMoveY = wOffset.top - (coords.y-oldCoords.y);
		if(wrapMoveX > 0)
			wrapMoveX = 0;
		else if(wrapMoveX < -wrapperW + (wrapperW/3))
			wrapMoveX = -wrapperW - (wrapperW/3);
		else if (Rocket.center.x > w/2 && Rocket.center.x < wrapperW - w/2){
			wrapper.css({left: wrapMoveX});
			wOffset = wrapper.offset();
		}
		if(wrapMoveY > 0)
			wrapMoveY = 0;
		else if(wrapMoveY < -wrapperH + (wrapperH/3))
			wrapMoveX = -wrapperH - (wrapperH/3);
		else if (Rocket.center.y > h/2 && Rocket.center.y < wrapperH - h/2){
			wrapper.css({top: wrapMoveY});
			wOffset = wrapper.offset();
		}

		Rocket.locate(coords.x-92.5,coords.y-50);
		oldCoords = coords;
		
		if(progress <= time)
			anim = window.requestAnimationFrame(Rocket.fly);
		else {
			window.cancelAnimationFrame(anim);
			Rocket.glow.animate({opacity:0},500);
			Rocket.leftEngine.animate({opacity:0},300);
			Rocket.rightEngine.stop().animate({opacity:0},300);
			Rocket.isMoving = false;
			//console.log(Rocket.angle);
			$('#waypoint').remove();
			//console.log(checkCollision(coords.x,coords.y));
			checkCollision(coords.x,coords.y);
		//	console.log('Final Angle: '+Rocket.angle);
			//console.log(' ');
		}
	}
}
$(document).ready(function(){
	$('body').mousemove(function(e){
		mouseX = e.pageX-wOffset.left;
		mouseY= e.pageY-wOffset.top;
		var angle = getAngle(mouseX,Rocket.pos.left+92.5,mouseY,Rocket.pos.top+50);
		// angle =angle - Rocket.angle;
		// if(angle > 180)
		// 	angle -=360;
		// else if(angle<-180)
		// 	angle +=360;
		$('#debug .mouse').html(mouseX+', '+mouseY);
		$('#debug .angle').html(Math.round(angle));
		//start = false;
	});

}); // END READY
function flight(x,y,instant){
	$('#waypoint').remove();
	wrapper.append('<div id="waypoint" style="position:absolute; left:'+(x-66.5)+'px;top:'+(y-66.5)+'px;"><img src="img/waypoint.gif" alt="waypoint" draggable = "false"/></div>')
	start = false;
	
	//console.log('mouse: '+mouseX+', '+mouseY)
	var distance = Math.sqrt(Math.pow(x-Rocket.center.x,2)+Math.pow(y-Rocket.center.y,2));
	absAngle  = getAngle(x,Rocket.center.x,y,Rocket.center.y);
	absAngle =absAngle - Rocket.angle;
	if(absAngle > 180)
		absAngle -=360;
	else if(absAngle<-180)
		absAngle +=360;

	if(absAngle > 20){
		Rocket.rightEngine.stop().animate({opacity:0.5},300)
		Rocket.leftEngine.stop().animate({opacity:1},300);
	}else if(absAngle <-20) {
		Rocket.rightEngine.stop().animate({opacity:1},300);
		Rocket.leftEngine.stop().animate({opacity:0.5},300);
	}else {
		Rocket.leftEngine.stop().animate({opacity:1},300);
		Rocket.rightEngine.stop().animate({opacity:1},300);
	}
	if(absAngle <20 && absAngle >-20){
		curve = false;
		cDistance = getDistance(x,oldCoords.x,y,oldCoords.y);
		xDistance = x - Rocket.center.x;
		yDistance = y - Rocket.center.y;
		origAngle = Rocket.angle;

		
		var endAngle = getAngle(x,oldCoords.x,y,oldCoords.y);
		var angleDiff = Rocket.angle - endAngle;
		if(Rocket.angle > 90 && endAngle < -90 )
			endAngle+=360;
		else if(Rocket.angle <-90 && endAngle >90)
			endAngle-=360;
		$({angle:Rocket.angle}).stop().animate({angle:endAngle},{duration:((cDistance/125)*500)/2, step:function(now,fx){
			if(fx.pos > 0)
			Rocket.obj.css({transform:'rotate('+(now)+'deg)'});
			Rocket.angle = now;
		}});
		anim = window.requestAnimationFrame(Rocket.fly)
	}else {
		adjPath(x,y);
		curve = new Bezier(Rocket.center.x,Rocket.center.y, cp1X,cp1Y, cp2X,cp2Y, x,y);
		cDistance = curve.length();
		//if(cDistance > 400 || Rocket.isMoving){
		//	var curveP=curve.getLUT();
			// console.log(curveP);
			// for(i=0;i<curveP.length;i+=4){
			// 	$('#waypoints').append('<div class="waypoint" style="top:'+(curveP[i].y-5) +'px;left:'+(curveP[i].x-5)+'px;"></div>');
			// }
		anim = window.requestAnimationFrame(Rocket.fly);
	//	}
		// else if(cDistance<400 && !Rocket.isMoving) {
		// 	//console.log(Rocket.angle+absAngle);
		// 	TweenMax.to(Rocket.obj,.6,{directionalRotation:Rocket.angle+absAngle+'_short',onUpdate:function(){
		// 		//set new Rocket Angle, every frame in case user clicks again.
		// 		var matrix = Rocket.obj.css('transform');
		// 		Rocket.angle = matrix2Angle(matrix);
		// 	},onComplete:function(){
		// 		adjPath();
				
		// 		curve = new Bezier(Rocket.center.x,Rocket.center.y, cp1X,cp1Y,cp2X,cp2Y, x,y);
		// 		var curveP=curve.getLUT();
		// 		for(i=0;i<curveP.length;i+=4){
		// 			$('#waypoints').append('<div class="waypoint" style="top:'+(curveP[i].y-5) +'px;left:'+(curveP[i].x-5)+'px;"></div>');
		// 		}
		// 		cDistance = curve.length();
		// 		anim = window.requestAnimationFrame(Rocket.fly);
		// 	}});
		// }
	}
}
////// HELPER FUNCTIONS ///////////
function easeInOut(time, begValue, changeValue, duration) {
		if ((time/=duration/2) < 1) return changeValue/2*time*time*time + begValue;
		return changeValue/2*((time-=2)*time*time + 2) + begValue;
	}
function getAngle(x2,x1,y2,y1){
	var angle = Math.degrees(Math.atan2(y2-y1,x2-x1));
	return angle;
}
Math.degrees = function(radians) {
  return (radians * 180) / Math.PI;
};
function getDistance(x2,x1,y2,y1){
	return	Math.sqrt((Math.pow((x2 - x1),2)) + (Math.pow((y2-y1),2)));
}
Math.radians = function(angle){
	return angle * Math.PI/180;
}
function getSlope(x2,x1,y2,y1){
	return (y2-y1) / (x2-x1);
}
function matrix2Angle(matrix){
	var values = matrix.split('(')[1];
    values = values.split(')')[0];
    values = values.split(',');
	var a = values[0];
	var b = values[1];
	var c = values[2];
	var d = values[3];
	var angle = (Math.atan2(b, a) * 180)/Math.PI;
	return angle;
}
var getPositionData = function(el) {
    return $.extend({
        width: el.outerWidth(false),
        height: el.outerHeight(false)
    }, el.offset());
}
var start = false;

var curve,cDistance,absAngle,cp2Angle,angleDistance,distRatio,cp2Distance,cp1X,cp1Y,cp2X,cp2Y;
function adjPath(x,y){
	absAngle  = getAngle(x,Rocket.center.x,y,Rocket.center.y);
	angleDistance = Math.sqrt((Math.pow((x - (Rocket.pos.left+92.5)),2)) + (Math.pow((y-(Rocket.pos.top+50)),2)));
	absAngle =absAngle - Rocket.angle;
	if(absAngle > 180)
		absAngle -=360;
	else if(absAngle<-180)
		absAngle +=360;

	cp2Angle = (180 + Rocket.angle) +(absAngle*2);
	if(absAngle < -90 && absAngle >-150)
		cp2Angle+=90;
	if(absAngle > 90 && absAngle < 150)
		cp2Angle -=90;
	distRatio = Math.abs((absAngle/90)*0.5);
	
	 if(absAngle < -150 || absAngle > 150 ){
	 	distRatio=1.3;
	 	if(absAngle <0)
	 		cp2Angle+=115;
	 	else
	 		cp2Angle-=115;
	 }
	distRatio = Math.max(0.1,distRatio);
	cp2Distance = angleDistance* distRatio;
	
	cp1X = Rocket.center.x + cp2Distance* (Math.cos(Math.radians(Rocket.angle)));
	cp1Y = Rocket.center.y + cp2Distance* (Math.sin(Math.radians(Rocket.angle)));
	cp2X = x + cp2Distance*( Math.cos(Math.radians(cp2Angle)));
	cp2Y = y+ cp2Distance*( Math.sin(Math.radians(cp2Angle)));
}
