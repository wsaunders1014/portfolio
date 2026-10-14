$(document).ready(function(){

$(window).resize(function(){
			$('#container').css({width:$(window).innerWidth()+'px',height:$(window).innerHeight()+"px"});
});
$('img').each(function(index){
				var src = $(this).attr('src');
				var newSrc = $(this).attr({'src':src+'?'+new Date().getTime()});
				this.draggable=false;
			});
	$("img").load(function(){
			$('.close-arrow').on('mousedown',function(e){
					
					$('.magnifier-overlay').css("display","none");
				}).on('mouseup',function(){
					
					$('.magnifier-overlay').css("display","none");
				});
			
			//width:$('#iframe').width()+'px',
		$('#container').css({width:$(window).innerWidth()+'px',height:$(window).innerHeight()+"px"});
		$('.magnifier-overlay').on('mousedown',function(e){
			e.preventDefault();		
			var hWidth = $(this).outerWidth();
			var hHeight = $(this).outerHeight();		
		
			var hPos = $(this).offset().left + hWidth - e.pageX;
			$(this).addClass("dragging").css("z-index","2");

			
			
			$('#drag-screen').css({width:$('.magnify').width()+"px",height:$('.magnify').height()+"px"});
			$('#drag-screen').on('mousemove', function(e){
				var handlePosition = e.pageX + hPos - hWidth;
				
				var leftLimit = $(this).offset().left;
				var handleWidth = $('.magnifier-overlay').width();
				var rightLimit = $(this).width() - handleWidth;
				//constrains movement inside container div.
				var snapToRight= rightLimit - 10;
				
				if(handlePosition >rightLimit || handlePosition > snapToRight)
					handlePosition =rightLimit;
				else if(handlePosition < leftLimit)
					handlePosition = leftLimit;
					
					$('.dragging').offset({
						left: handlePosition
					});
				
				$('.magnify').css("left",-handlePosition);
								
				var imgWidth = $(this).width();
				if(handlePosition >= 0 && handlePosition < imgWidth * .15){
					$("#bottom-text").html("<img src='img/delta-magnifier-text-1.png' />");
					$('#top-text').html("<img src='img/delta-magnifier-top-text-1.png' />");
				}
				else if(handlePosition > imgWidth * .15 && handlePosition <= imgWidth * .35) {
					$("#bottom-text").html("<img src='img/delta-magnifier-text-2.png' />");
					$('#top-text').html("<img src='img/delta-magnifier-top-text-2.png' />");
				}
				else if(handlePosition > imgWidth * .35 && handlePosition <= imgWidth * .55) {
					$("#bottom-text").html("<img src='img/delta-magnifier-text-3.png' />");
					$('#top-text').html("&nbsp;");
				}
				else if(handlePosition > imgWidth * .50 && handlePosition <= imgWidth * .70) {
					$("#bottom-text").html("<img src='img/delta-magnifier-text-4.png' />");
					$('#top-text').html("<img src='img/delta-magnifier-top-text-3.png' />");
				}
				else {
					$("#bottom-text").html("<img src='img/delta-magnifier-text-5.png' />");
					$('#top-text').html("&nbsp;");
				}
			}).on("mouseup", function(){
				$('.magnifier-overlay').removeClass('dragging').css('z-index','4');
				$('#drag-screen').off('mousemove');
				//$(this).css({width:'0px',height:'0px'});
		
		});
			
		}).on("mouseup", function(){
			$(this).removeClass('dragging');
			$('#drag-screen').off('mousemove');
			$(this).css("z-index","4");
			//$('#drag-screen').css({width:'0px',height:'0px'});
		});
		$('#explore-link').on('mousedown',function(){
			$('.magnifier-overlay').fadeIn(1000);
			
		});
		
	});

	//Mobile / Touch Enabled Code
	 document.body.addEventListener('touchmove', function(event) {
		event.preventDefault();
	 }, false); 
	
	var explore = document.getElementById('explore-link');
	explore.addEventListener('touchstart', function(event){
		event.preventDefault();
		$('.magnifier-overlay').fadeIn(1000);
		
		document.getElementById('close-arrow').addEventListener('touchmove', function(event){
			$('.magnify-overlay').hide();
		},false);
				 
		var ctrl = document.getElementById('magnifier-ctrl');
		var dragscrn = document.getElementById('drag-screen');
		
		dragscrn.addEventListener('touchmove', function(event) {
		$('.magnifier-overlay').addClass("dragging").css("z-index","2");
		$('#drag-screen').css({width:$('.magnify').width()+"px",height:$('.magnify').height()+"px", 'z-index':"5"});	
			var hWidth = $('#magnifier-ctrl').outerWidth();
			var imgWidth = $('#container').width();
			var touch1 = event.targetTouches[0];
			//console.log(touch1);
			var changedTouches = event.changedTouches
			//console.log("changed: "+ changedTouches[0]);
			var hPos = touch1.pageX + hWidth/2;
			var handlePosition = touch1.pageX - hWidth/2;
			var leftLimit = 0;
			var rightLimit = imgWidth - hWidth;
			
			if(handlePosition < leftLimit)
				handlePosition = leftLimit;
			if(handlePosition > rightLimit)
				handlePosition = rightLimit;
						
			$('.dragging').offset({
				left: handlePosition
			});
			
			$('.magnify').css("left",-handlePosition);
					
			if(handlePosition >= 0 && handlePosition < imgWidth * .15){
					$("#bottom-text").html("<img src='img/delta-magnifier-text-1.png' />");
					$('#top-text').html("<img src='img/delta-magnifier-top-text-1.png' />");
			}
			else if(handlePosition > imgWidth * .15 && handlePosition <= imgWidth * .35) {
				$("#bottom-text").html("<img src='img/delta-magnifier-text-2.png' />");
				$('#top-text').html("<img src='img/delta-magnifier-top-text-2.png' />");
			}
			else if(handlePosition > imgWidth * .35 && handlePosition <= imgWidth * .55) {
				$("#bottom-text").html("<img src='img/delta-magnifier-text-3.png' />");
				$('#top-text').html("&nbsp;");
			}
			else if(handlePosition > imgWidth * .50 && handlePosition <= imgWidth * .70) {
				$("#bottom-text").html("<img src='img/delta-magnifier-text-4.png' />");
				$('#top-text').html("<img src='img/delta-magnifier-top-text-3.png' />");
			}
			else {
				$("#bottom-text").html("<img src='img/delta-magnifier-text-5.png' />");
				$('#top-text').html("&nbsp;");
			}
	    }, false);
		dragscrn.addEventListener('touchend', function(event){
			$(this).css({top:'10%',height:'90%'}); //allows close button to be closed on mobile.
		},false);
	}, false);
	
	ctrl.addEventListener('touchend',function(event){
			//$('#drag-screen').remove();
		$(this).removeClass('dragging');		
		$(this).css("z-index","4");
	},false); 
	
	
});