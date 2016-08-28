	var ctrlH,containerH,trackH, topLimit,bottomLimit,contentPercent;
	var sliderPos = 0;
	var sliderTop =0;
	var slidePercent = 0;
	var contentH = 0;
	var scrollDist=0;
$(document).ready(function(){
	$('#scroll-bar').on('mousedown',function(e){
		e.preventDefault();
		$(this).addClass('dragging');
		$('body').on('mousemove', function(e){
			sliderPos = e.pageY -ctrlH/2;
			if (sliderPos < topLimit)
				sliderPos = topLimit;
			if (sliderPos >= containerH+15)
				sliderPos = containerH+15;
			$('.dragging').offset({
				top:sliderPos
			});
			sliderTop = sliderPos-topLimit; //0-655
			slidePercent = ((sliderTop)/ (trackH-30)*contentPercent);
			scrollDist = Math.round(slidePercent * contentH); 
			if (scrollDist> (contentH - containerH)+30)
				scrollDist= contentH -containerH + 30;

			$('.content div').eq(0).css({top:-scrollDist});
		}).on('mouseup',function(){
			$('.dragging').removeClass('dragging');
			$(this).off('mousemove');
		}).on('mouseleave',function(){
			$('.dragging').removeClass('dragging');
			$(this).off('mousemove');
		});
	});	

	// MOUSEWHEEL SCROLL
	//IE, Opera, Safari

	$(document).on('wheel mousewheel', function (e) {
		var increment = 50;
		//SCROLL DOWN
		if(e.originalEvent.wheelDelta < 0 || e.originalEvent.deltaX > 0 || e.originalEvent.deltaY>0){
			if (sliderTop >=containerH-30-increment){ 
				sliderTop= sliderTop + (containerH -30- sliderTop); 
			}else {
				sliderTop = sliderTop + increment;
			}
			$('#scroll-bar').animate({top:sliderTop},50);
			slidePercent = (sliderTop / (trackH-30))*contentPercent;
			scrollDist = Math.round(slidePercent * contentH);
			if (scrollDist> (contentH - containerH)-0)
				scrollDist= contentH -containerH - 0;
			$('.content div').eq(0).animate({top:-scrollDist},50);	
		//SCROLL UP
		}else {
		
			if (sliderTop < increment){ 
				sliderTop = 0;
			}else {
				sliderTop = sliderTop - increment;
			}
			$('#scroll-bar').animate({top:sliderTop},50);
			slidePercent = (sliderTop / (trackH-30))*contentPercent;
			scrollDist = Math.round(slidePercent * contentH);
			$('.content div').eq(0).css({top:-scrollDist});
		}
		return false;
	});
	//MOBILE INTERACTIONS -- UNTESTED
	var touchStartY = 0;
	//var ctrl = document.getElementById('scroll-bar');
	document.addEventListener('touchstart',function(e){
		e.preventDefault();
		var touchStart = e.changedTouches[0];
		touchStartY = touchStart.pageY;
		//console.log(touchStartY);
		$('#scroll-bar').addClass('dragging');

	},false);
	document.addEventListener('touchmove',function(e){
		e.preventDefault();
		var touchMove = e.changedTouches[0];
		var touchEndY= touchMove.pageY;
		
		scrollDist= touchEndY - touchStartY;
		var upperStop = contentH - containerH;
		if (0+scrollDist< -upperStop){ // -1821 < -1893 - scrollDist(-73)
			scrollDist=-(upperStop + 0)
		}else if(0+scrollDist> 0){
			scrollDist=-0;
		}
		//console.log('scrollDist= '+ scrollDist);
		$('.content div').eq(0).css({top:0+scrollDist});
		var currentPos = ((Math.abs($('.content div').eq(0).position().top) /upperStop)*trackH+topLimit);
		//sliderPos = touchMove.pageY; 
		if (currentPos < topLimit)
			currentPos = topLimit;
		if (currentPos > bottomLimit)
			currentPos = bottomLimit;
		$('.dragging').offset({
			top:currentPos
		});
		 sliderTop = $('#scroll-bar').position().top;
		 slidePercent = (sliderTop / trackH);

		//$('#scroll-cta').delay(500).fadeOut(500);
	},false);

	document.addEventListener('touchend',function(e){
		$('#scroll-bar').removeClass('dragging');
		var touchMove = e.changedTouches[0];
		var touchEndY= touchMove.pageY;
	//	0 = $('.content div').eq(0).position().top;
	},false);
	updateScrollVars();
});
function updateScrollVars(){
	containerH = $('#pane').height();
	contentH = $('.content').outerHeight();
	contentPercent = (contentH - containerH)/contentH;
	$('#scroll').css({height:containerH});
	ctrlH = $('#scroll-bar').height();
	trackH = $("#scroll").height();
	topLimit = $('#scroll').offset().top;
	bottomLimit = trackH+topLimit;
}
$('.content iframe').load(function(){
	updateScrollVars();
})