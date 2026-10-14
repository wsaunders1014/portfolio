var film;
var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
$(document).ready(function(){
	$('.poster').on('click', function(e){
		e.preventDefault();e.stopPropagation();
		var id = $(this).attr('id');
		var index = $(this).index('.poster');
		console.log(index);
		film = id;
		$('header, .content').addClass('flipped');
		$('.home').fadeOut();
		$('.page.'+id).delay(0).fadeIn(400,function(){
			$(this).find('.landing').addClass('alwaysOn');
		});

		$('.'+film).find('.static').delay(1000).fadeIn()
		$('.film-menu').children().eq(index).addClass('active');
		$('.copyright').hide();
	});
	$('.film-menu > div').click(function(){
		if(!$(this).hasClass('active')){
			var id = $(this).text().toLowerCase();
			id=id.split(' ').join('-');
			film = id;
			console.log(id);
			$('.page').fadeOut();
			$('.on').removeClass('on');
			$('.current').removeClass('current');
			current = 1;
			$('.left.arrow').addClass('disabled');
			$('.right.arrow').removeClass('disabled')
			$('.slider').removeAttr('style')
			$('.page.'+id).delay().stop().fadeIn(400, function(){
				$('.page.'+id).find('.landing').addClass('alwaysOn')
			});
			$('.'+film).find('.static').delay(1000).fadeIn()
			$(this).addClass('active').siblings('.active').removeClass('active');
			$('.subpage').removeAttr('style');
		}
	})
	//Main Nav
	$('.nav > li').click(function(){
		if(!$(this).hasClass('current')){
			var subpage = $(this).find('span').text().toLowerCase();
			console.log(subpage);
			if(subpage != 'clips'){
			
				$('.'+film).find('.on').removeClass('on');
				$(this).addClass('current').siblings('.current').removeClass('current').children('.sub-nav').children().first().addClass('current');
			}else{
				$('.'+film).addClass('noscroll');
				$('.'+film).find('.on').removeClass('on');
			}
			if(subpage == 'filmmakers'){
				$('.'+film).find('.filmmakers').find('.right').children().hide().first().show();
				$('.'+film).find('.static').find('.current').find('.sub-nav').children().removeClass('current').first().addClass('current');
			}
			$('.'+film).find('.'+subpage).addClass('on');
			if(w<736) {
				$('.subpage').fadeOut();
				$('.subpage.'+subpage).stop().fadeIn(400);
			}
		}
	});
	//SUB NAV
	$('.sub-nav > li').click(function(){
		if(!$(this).hasClass('current')){
			var index = $(this).index();
			console.log(index);
			$(this).addClass('current').siblings('.current').removeClass('current');
			$('.'+film).find('.filmmakers').children().children().fadeOut();
			$('.'+film).find('.filmmakers').children().children().eq(index).fadeIn();	
		}
	});

	var current = 1;
	//PHOTO CONTROL
	$('.strip').on('click', '.slide', function(){
		var src = $(this).attr('src');
		$(this).parent().prev().find('img').attr('src',src);
		$(this).addClass('active').siblings().removeClass('active');
	})
	// $('.arrow').click(function(){
	// 	var slider = $(this).siblings('.slider');
	// 	var total = $(this).siblings('.slider').children('.slide').length;
		

	// 	console.log(total);
	// 	if($(this).hasClass('left')){
	// 		current--;
	// 		slider.animate({left:'+=100%'},600);
			
	// 		$(this).siblings('.disabled').removeClass('disabled');
	// 		if(current <= 1)
	// 			$(this).addClass('disabled')
	// 		else
	// 			$(this).removeClass('disabled')
	// 	}else{
	// 		current++
	// 		slider.animate({left:'-=100%'},600);
			
	// 		$(this).siblings('.disabled').removeClass('disabled');
	// 		if(current >= total)
	// 			$(this).addClass('disabled')
	// 		else
	// 			$(this).removeClass('disabled')
	// 	}
	// });

	$('.close-btn').click(function(){
		$(this).parent().removeClass('on');
		$('.current').removeClass('current');
		$('.'+film).removeClass('noscroll')
		stopMedia();
		if(w<736){
			$('.'+film).find('.landing').fadeIn();
			$('.'+film).find('.clips').stop().fadeOut();
		}
	})
});
function stopMedia(){
	//console.log($('.playing').length);
	$('video').each(function(){
		this.pause();
		this.currentTime = 0;
		this.load();
	});
	// if($('.playing').length != 0){
	// 	$('.playing').siblings('video')[0].pause();
	// 	$('.playing').siblings('video')[0].currentTime = 0;
	// 	$('.playing').siblings('video')[0].load();
	// 	$('.playing').siblings('img').fadeIn();
	// 	$('.playing').removeClass('playing').removeAttr('style');
	// }
}