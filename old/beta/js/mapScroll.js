//console.log(upperBound,leftBound,rightBound,bottomBound);
	//BUGGY
	//var hoverAngle;
	// $('.hover-bar').on("mouseover", function(e){
	// 	var dir = $(this).attr('id');
	// 	var tan;
	// 	hoverAngle = getAngle(e.pageX,centerPoint.x, e.pageY,centerPoint.y);
	// 	hoverBarActive = true;
	// 	$(this).on('mousemove',function(e){
	// 		hoverAngle = getAngle(e.pageX,centerPoint.x, e.pageY,centerPoint.y);
	// 		//console.log(hoverAngle);
	// 		tan = Math.tan(Math.radians(hoverAngle));
	// 		tan = Math.abs(tan);
	// 		if(tan >2)
	// 			tan = 2;
	// 		if(tan <0.5)
	// 			tan = Math.max(0.1,tan);
			
	// 	//	console.log('tan: '+tan)
	// 	});
	// 	//console.log('angle: '+hoverAngle);
	// 	//console.log('tan: '+Math.tan(Math.radians(hoverAngle)));

	// 	if(!wrapperMoveAnim) {
	// 		if(!hoverTimeout){
	// 			hoverTimeout = window.setTimeout(function(){
	// 				wrapperMoveAnim = window.requestAnimationFrame(wrapperMove);
	// 			},700);
	// 		}
	// 	}
		
	// }).on('mouseleave', function(e){
	// 	//console.log(e.toElement);
	// 	$(this).off('mousemove');
	// 	clearTimeout(hoverTimeout);
	// 	hoverTimeout= false;
	// 	 if(!$(e.toElement).hasClass('hover-bar')){
	// 	 	console.log()
	// 	 	start2 = false;
	// 		hoverBarActive = false;
	// 		window.cancelAnimationFrame(wrapperMoveAnim);
	// 		wrapperMoveAnim =false;
	// 		wOffset = wrapper.offset();
	// 	// 	clearInterval(hoverInterval);
	// 	// 	hoverInterval = false;
	// 	 }
	// });
	
	// function wrapperMove(timestamp){
	// 		if(!start2) start2 = timestamp;
	// 		var progress = timestamp - start2;
	// 		//LEFT OR RIGHT
	// 		console.log(hoverAngle)
	// 		if(hoverAngle > -90 && hoverAngle <90) //right
	// 			wrapper.css({left:Math.max(wOffset.left -10,rightBound)});
	// 		else //left
	// 			wrapper.css({left:Math.min((wOffset.left + 10),leftBound)});

	// 		//UP OR DOWN
	// 		if(hoverAngle>-180 && hoverAngle < 0) // up
	// 			wrapper.css({top:Math.min(wOffset.top + 10,upperBound)});
	// 		else { //down
	// 			wrapper.css({top:Math.max(wOffset.top -10,bottomBound)});
	// 		}
	// 		wOffset = wrapper.offset();
	// 		//wOffset = wrapper.offset();
	// 		// if(hoverAngle>-180 && hoverAngle <-90) // Top Left
	// 		// 	wrapper.css({top:wOffset.top+(inc*tan),left:wOffset.left+(1/tan)});
	// 		// else if(hoverAngle >=-90 && hoverAngle < 0) // Top Right
	// 		// 	wrapper.css({top:wOffset.top+(inc*tan),left:wOffset.left- (1/tan)});
	// 		// else if(hoverAngle >= 0 && hoverAngle < 90) // Bottom Right
	// 		// 	wrapper.css({top:wOffset.top-(inc*tan),left:wOffset.left- (1/tan)});
	// 		// else if(hoverAngle >= 90 && hoverAngle <180) //Bottom Left
	// 		// 	wrapper.css({top:wOffset.top-(inc*tan),left:wOffset.left+ (1/tan)});

			
	// 		wrapperMoveAnim =window.requestAnimationFrame(wrapperMove);
	// }