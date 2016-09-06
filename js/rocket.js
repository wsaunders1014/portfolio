/*This code is very WIP
ROCKET by Will Saunders
8-20-16
*/
var wrapper = $('#wrapper');
var wOffset = wrapper.offset();
var mouseX,mouseY,anim,oldCoords;
var time500 = 500;
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
	target:{top:0,left:0},
	centerX: 0,
	centerY: 0,
	top:0,
	left:0,
	angle:-90,
	land: function(){
		if(!Rocket.isLanded){//land
			TweenMax.to(Rocket.obj,2,{scale:0,onStart:function(){
				Rocket.isLanding = true;
			},onComplete:function(){
				Rocket.isLanded = true;
				Rocket.isLanding = false;
				
			}});

		}else {//take off
			TweenMax.to(Rocket.obj,2,{scale:1,onStart:function(){
				Rocket.isLanding = true;
			},onComplete:function(){
				Rocket.isLanded = false;
				Rocket.isLanding = false;
			}});
		}
	},
	rotate: function(mouseX,mouseY){

	},
	locate: function(left, top){
		this.left = left || parseInt(this.obj.css('left').match(/\d+/g)[0]);
		this.top = top || parseInt(this.obj.css('top').match(/\d+/g)[0]);
		if(left){
			this.centerX = left + (this.width/2);
			this.centerY =  top + (this.height/2);
		}else {
			this.centerX =  this.left + 92.5;
			this.centerY = this.top + 50;
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
		var time = (cDistance/125)*500;
		var t = progress/time;
		if(curve){
			var coords = curve.get(t);
		}else {//straight line
			var coords = {x:oldCoords.x+((xDistance/100)),y:(oldCoords.y+(yDistance/100))}
		}
		//console.log(coords.y)
		if(t !=0){
			var nextAngle = getAngle(coords.x,oldCoords.x,coords.y,oldCoords.y);
			Rocket.angle = nextAngle;
		}
		Rocket.obj.css({left: coords.x-Rocket.halfX,top:coords.y-Rocket.halfY,transform:'rotate('+nextAngle+'deg)'});
		//MOVE WRAPPER
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
		var angle = getAngle(mouseX,Rocket.left+92.5,mouseY,Rocket.top+50);
		angle =angle - Rocket.angle;
		if(angle > 180)
			angle -=360;
		else if(angle<-180)
			angle +=360;
		$('#debug .mouse').html(mouseX+', '+mouseY);
		$('#debug .angle').html(Math.round(angle));
		//start = false;
	});

	wrapper.on('click', function(e){
		$('#waypoints').html('');
		$('#intro').fadeOut(750);
		mouseX = e.pageX-wOffset.left;
		mouseY= e.pageY-wOffset.top;
		Rocket.target.left = mouseX;
		Rocket.target.top = mouseY;
		flight(mouseX,mouseY);

	});
}); // END READY
function flight(x,y,instant){

	start = false;
	Rocket.isLanded = false;
	window.cancelAnimationFrame(anim);
	//console.log('mouse: '+mouseX+', '+mouseY)
	var distance = Math.sqrt(Math.pow(x-Rocket.centerX,2)+Math.pow(y-Rocket.centerY,2));
	absAngle  = getAngle(x,Rocket.centerX,y,Rocket.centerY);
	absAngle =absAngle - Rocket.angle;
	if(absAngle > 180)
		absAngle -=360;
	else if(absAngle<-180)
		absAngle +=360;
	oldCoords = {x:Rocket.centerX,y:Rocket.centerY};
	//Red Line
	// $(this).append('<div class="line" style="transform-origin:left center;width:'+(Math.round(angleDistance))+'px;top:'+(Rocket.centerY)+'px;left:'+(Rocket.centerX)+'px;transform:rotate('+(Math.round(absAngle)-90)+'deg);"></div>');
	// //Blue Line
	// $(this).append('<div class="line" style="background:#0000FF;transform-origin:left center;width:'+Math.round(cp2Distance)+'px;top:'+(mouseY)+'px;left:'+(mouseX)+'px;transform:rotate('+(Math.round(cp2Angle))+'deg);"></div>');
	//  $(this).append('<div class="line" style="background:#0000FF;transform-origin:left center;width:'+(+cp2Distance)+'px;top:'+(Rocket.centerY)+'px;left:'+(Rocket.centerX)+'px;transform:rotate('+(Rocket.angle)+'deg);"></div>');
	
	//console.log(curve.getLUT());
	// $('body').append('<div class="waypoint" style="background:#ff0000;top:'+(cp1Y-5) +'px;left:'+(cp1X-5)+'px;"></div>');
	//$('body').append('<div class="waypoint" style="background:#ff0000;top:'+(polarY-5) +'px;left:'+(polarX-5)+'px;"></div>');
	
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
		xDistance = x - Rocket.centerX;
		yDistance = y - Rocket.centerY;
		anim = window.requestAnimationFrame(Rocket.fly)
	}else {
		adjPath();
		curve = new Bezier(Rocket.centerX,Rocket.centerY, cp1X,cp1Y,cp2X,cp2Y, x,y);
		cDistance = curve.length();
		if(cDistance > 400 || Rocket.isMoving){
			// var curveP=curve.getLUT();
			// for(i=0;i<curveP.length;i+=4){
			// 	$('#waypoints').append('<div class="waypoint" style="top:'+(curveP[i].y-5) +'px;left:'+(curveP[i].x-5)+'px;"></div>');
			// }
			anim = window.requestAnimationFrame(Rocket.fly);
		}else if(cDistance<400 && !Rocket.isMoving) {
			//console.log(Rocket.angle+absAngle);
			TweenMax.to(Rocket.obj,.6,{directionalRotation:Rocket.angle+absAngle+'_short',onUpdate:function(){
				//set new Rocket Angle, every frame in case user clicks again.
				var matrix = Rocket.obj.css('transform');
				
				
				
				Rocket.angle = matrix2Angle(matrix);
			},onComplete:function(){
				adjPath();
				
				curve = new Bezier(Rocket.centerX,Rocket.centerY, cp1X,cp1Y,cp2X,cp2Y, x,y);
				var curveP=curve.getLUT();
				// for(i=0;i<curveP.length;i+=4){
				// 	$('#waypoints').append('<div class="waypoint" style="top:'+(curveP[i].y-5) +'px;left:'+(curveP[i].x-5)+'px;"></div>');
				// }
				cDistance = curve.length();
				anim = window.requestAnimationFrame(Rocket.fly);
			}});
		}
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
function adjPath(){
	absAngle  = getAngle(mouseX,Rocket.centerX,mouseY,Rocket.centerY);
	angleDistance = Math.sqrt((Math.pow((mouseX - (Rocket.left+92.5)),2)) + (Math.pow((mouseY-(Rocket.top+50)),2)));
	absAngle =absAngle - Rocket.angle;
	if(absAngle > 180)
		absAngle -=360;
	else if(absAngle<-180)
		absAngle +=360;
	//console.log('abs Distance: '+angleDistance);
	//console.log('Angle: '+absAngle);

	cp2Angle = (180 + Rocket.angle) +(absAngle*2);
	if(absAngle < -90 && absAngle >-150)
		cp2Angle+=90;
	if(absAngle > 90 && absAngle < 150)
		cp2Angle -=90;

	//var distRatio = Math.abs((Math.abs(Rocket.angle) - Math.abs(absAngle))/180);
	distRatio = Math.abs((absAngle/90)*0.5);
	
	 if(absAngle < -150 || absAngle > 150 ){
	 	distRatio=1.3;
	 	if(absAngle <0)
	 		cp2Angle+=115;
	 	else
	 		cp2Angle-=115;
	 }
	distRatio = Math.max(0.1,distRatio);
	//console.log('cp2Angle: '+cp2Angle);
	cp2Distance = angleDistance* distRatio;
	//console.log(distRatio);
	//console.log('cp2Distance: '+cp2Distance)
	
	cp1X = Rocket.centerX + cp2Distance* (Math.cos(Math.radians(Rocket.angle)));
	cp1Y = Rocket.centerY + cp2Distance* (Math.sin(Math.radians(Rocket.angle)));
	cp2X = mouseX + cp2Distance*( Math.cos(Math.radians(cp2Angle)));
	cp2Y = mouseY+ cp2Distance*( Math.sin(Math.radians(cp2Angle)));
}
