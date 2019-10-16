var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
var path = location.pathname.split('/');
path.shift();
console.log(path)
var menuMode = false;
var movieIDIndex = ['bk','tully','pf','be','mary','basis','ek','neighbor'];
var loaded = null;
var filmInfo = {
	"bk":{
		url:'blackkklansman',
		title:'BlacKkKlansman',
		page:'bk'
	},
	"tully":{
		url:'tully',
		title:'Tully',
		page:'tully'
	},
	"pf":{
		url:'Pope_Francis',
		title:'Pope Francis: A Man of His Word',
		page:'pf'
	},
	"be":{
		url:'Boy_Erased',
		title:'Boy Erased',
		page:'be'
	},
	"mary":{
		url:'mary_queen_of_scots',
		title:'Mary, Queen of Scots',
		page:'mary'
	},
	"basis":{
		url:'on_the_basis_of_sex',
		title:'On The Basis Of Sex',
		page:'basis'
	},
	"ek":{
		url:'Everybody_Knows',
		title:'Everybody Knows',
		page:'ek'
	},
	"neighbor":{
		url:'Wont_You_Be_My_Neighbor',
		title:'Won\'T You Be My Neighbor',
		page:'neighbor'
	}
}

var timeout;
var pageList = ['consider','synopsis','screenings'];
var filmLoaded = false;
var ajax = $.Deferred();
if(history.state){
	switch(history.state.film) {
		case 'bk':
			loaded = 'bk';
			history.replaceState({film:'bk'},'BlacKkKlansman', '');
			break;
		case 'pf':
			loaded = 'pf';
			history.replaceState({film:'pf'},'Pope Francis', '');
			break;
		case 'tully':
			loaded = 'tully';
			history.replaceState({film:'tully'},'Tully', '');
			break;
		case 'neighbor':
			loaded = 'neighbor';
			history.replaceState({film:'neighbor'},'Neighbor', '');
			break;
		case 'be':
			loaded = 'be';
			history.replaceState({film:'be'},'Boy Erased', '');
			break;
		case 'mary':
			loaded = 'mary';
			history.replaceState({film:'mary'},'Mary Queen of Scots', '');
			break;
		case 'basis':
			loaded = 'basis';
			history.replaceState({film:'basis'},'On the Basis of Sex', '');
			break;
		default:
		break;
	}
}
var form;
window.onpopstate = function(e){

	if(e.state !== null){
		if(e.state.film == 'home')
			loadHome();
		else{

			if(e.state.film == loaded){
				if(!isMobile || isTablet){
					$('#'+e.state.film).find('.content > div').fadeOut(400);
					//history.pushState({film:loaded},filmInfo[loaded].title,'/'+filmInfo[loaded].url+'/'+page);
					$('#'+e.state.film).find('.content > div').eq(pageList.indexOf(e.state.page)).stop().delay(400).fadeIn(400,function(){
						setTimeout(function(){checkScroll($('#'+loaded).find('.content').find('.screenings').find('.Los_Angeles-holder .scrollable'))},0);
					});
				}else{
					var index = pageList.indexOf(e.state.page)

					$('#overlay').find('.content').animate({marginLeft:'-'+(index*100)+'%'});
				}
			}else{
				loadFilmPage(e.state.film,e.state.page);
			}

		}
	}else{
		loadHome();
	}

}
var scroll = 0;
function animateIntro(){
	if(isMobile && w>h && loaded != null && w<737 && h < 414){

	}else{
		$('#header').css({top:'1.3vw',opacity:1});
		$('.bar').css({'transform':'translateX(0%)',opacity:1});
		$('.text').css({'transform':'translateX(0%)',opacity:1});
	}

	$('#bg').css('transform','scale(1)');
	$('.film').addClass('home');
	setTimeout(getDim,2000);
}
function getDim(){

	w = $('body').width();
	h = $('body').height();
	isMobile = (w<737) ? true:false;
	isPortrait = (h>w) ? true:false;
}
window.onload = animateIntro();
//////////////////////////////////////////////////////////////////////
////////////////////////// DOCUMENT READY ////////////////////////////
/////////////////////////////////////////////////////////////////////
var isMobile = (w<737) ? true:false;
var isPortrait = (h<w) ? true:false;
$(document).ready(function(){
	$('#isMobile').html(isMobile);
	$('#orientation').html(window.orientation);
	form = $('#rsvp-form');
	$(window).scroll(function(e){
		if(isMobile && h > w){
		scroll = $(window).scrollTop();

			if(scroll > 30){

				$('.fade').removeClass('headroom--pinned').addClass('headroom headroom--unpinned');
			}else{
				$('.fade').removeClass('headroom--unpinned').addClass('headroom--pinned');
			}
		}
	})
	window.onload = function(){

		if(path[1] != ''){
			if(location.pathname != '/focus/' && location.pathname !='/ampas/web/'){
				switch(path[1]){
					case 'blackkklansman':
						loaded = 'bk';
						break;
					case 'pf':
						loaded = 'bk';

						break;
					case 'tully':
						loaded = 'tully';

						break;
					case 'neighbor':
						loaded = 'neighbor';

						break;
					case 'be':
						loaded = 'be';

						break;
					case 'mary':
						loaded = 'mary';

						break;
					case 'basis':
						loaded = 'basis';

						break;
					case 'cancelRSVP':
						loadCancelForm();
						break;

					default:
						//location.href= '/';
						history.pushState({film:'home'},'Focus Features AMPAS FYC 2017', '/focus/')
					break;
				}
				if(loaded != null)
					loadFilmPage(loaded,(path[2]) ? path[2].toLowerCase().split(' ').join('-'):null,true);
			}
		}
	}
	$('.film').on('click', function(){
		var film = $(this).attr('id');
		if(!$(this).hasClass('active'))
			loadFilmPage(film);
	});
	var dropdownOpen = false;
	//DROPDOWN FUNCTIONALITY
	$('.hasDropdown').on('click', function(e){
		e.stopPropagation();
		//$(this).find('.dropdown').hide();

		var that = this;
		var $this = $(this);
		var isGuilds = $this.hasClass('guilds');
		if(!dropdownOpen){

			openDropdown($this,isGuilds);
		}else if(dropdownOpen && that == e.target){
			closeDropdown();
		}



	});
	function openDropdown(el,isGuilds){

		dropdownOpen = true;
		if(isGuilds)
			$('.guilds').removeClass('error').next('.error').html('');
		el.find('.active').removeClass('active');
		//el.find('.value').eq(0).addClass('active');
		el.find('.dropdown').show();
		el.find('.dropdown').parent().one('mouseleave', function(e){
			e.preventDefault();e.stopPropagation();
			closeDropdown();
		});
		el.find(".dropdown").find('.value').one('click', function(e){
			e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
			if(!isGuilds){
				$('#guests').val($(this).html());
				$(this).parents('.hasDropdown').find('span').html('Guests: '+$(this).html());
				// if(Number(el.html()) > 0){
				// 	$('.guestname').hide();
				// 	for(var i=0;i<Number(el.html());i++){
				// 		$('input[name="guest_name'+(i+1)+'"]').parent().show();
				// 	}
				// }
			}else{
				$('#guild').val($(this).html());
				$(this).parents('.hasDropdown').find('span').html($(this).html());

			}

			$('.dropdown').hide();
			dropdownOpen = false;
		});
		$('body').on('keyup', function(e){
			//UP Arrow
			var dropdown = (isGuilds) ? $('.guilds.hasDropdown').find(".dropdown"):$('.guests.hasDropdown').find(".dropdown");
			var activeIndex = dropdown.find('.active').index();
			var total = dropdown.find('.value').length;

			if(e.which == 38){

				if(activeIndex != 0){
					dropdown.find('.active').removeClass('active').prev().addClass('active');
					//dropdown.find('.value').eq(activeIndex-1).addClass('active');
				}
			//Down Arrow
			}else if(e.which == 40){

				if(activeIndex<total-1){
					dropdown.find('.active').removeClass('active').next().addClass('active');
					//dropdown.find('.value').eq(activeIndex+1).addClass('active');
				}

			//TAB
			}else if(e.which==9){
				if(!isGuilds){
					closeDropdown();
					openDropdown($('.guilds.hasDropdown'),true);
				}
			//ENTER
			}else if(e.which == 13){
				closeDropdown();
				if(isGuilds){
					$('#guild').val(dropdown.find('.active').html());
					dropdown.prev().html(''+dropdown.find('.active').html());
				}else{

					$('#guests').val(dropdown.find('.active').html());
					dropdown.prev().html('Guests: '+dropdown.find('.active').html());
				}
			}
		})
	}
	function closeDropdown(){

		$('.dropdown').hide();
		dropdownOpen = false;
		$('body').off('keyup');
	}
	$('#back-btn').on('click', function(){
		loadHome();
	});
	$('#header').on('click',function(e){
		e.preventDefault();
		loadHome();
	})
	$('body').on('click','.rsvp-btn',function(e){
		e.stopImmediatePropagation();
		var screeningId = $(this).attr('data-screening-id');

		var screeningInfo = filmInfo[loaded].screenings[screeningId];

		if(screeningInfo.status=='open' && screeningInfo.official !=='1') {

			$('#screening-id').val(screeningInfo.id);
			var form = $('#rsvp-form');
			form.find('.movie').html(filmInfo[loaded].title);
			form.find('.date').html(parseDate(screeningInfo['date_time']));
			form.find('.theater').html(screeningInfo['theater'].name);
			if(screeningInfo.theater.city=='London'){
				form.find('.london').show();
				form.find('.not-london').hide();
			}else{
			//LOAD DROPDOWNS
				form.find('.london').hide();
				form.find('.not-london').show();
				form.find('.dropdown').html('');
				for(var i=0;i<Number(screeningInfo.guests)+1;i++){
					form.find('.guests').find('.dropdown').append('<div class="value">'+i+'</div>');
				}
				for(var i=0;i<screeningInfo.affil.length;i++){
					form.find('.guilds').find('.dropdown').append('<div class="value">'+screeningInfo.affil[i]+'</div>');
				}
			}


			form.show();
		}

	});
	$('body').on('click','.rsvp-close-btn', closeRSVP)
	//RSVP SUBMIT
	$('body').on('focus','input', function(){
		$(this).removeClass('error').next('.error').html('');
		if($(this).children('input').attr('id')=='email'){
			$('body').on('keyup',function(e){
				if(e.which==9){
					$(this).off('keyup');
					$('.guests.hasDropdown')[0].focus();
					openDropdown($('.guests.hasDropdown'),false);
					$(this).off('keyup');
				}
			});
		}
	});
	var processing = false;
	$('#rsvp-submit').on('click',function(){
		if(!processing){
			processing = true;
			var form = $('#rsvp-form');
			var error = false;
			if($('#first_name').val()==''){
				$('#first_name').addClass('error').next('.error').html('Field Required');
				error = true;
				processing = false;
			}
			console.log("first name error:",error)
			if($('#last_name').val()==''){
				$('#last_name').addClass('error').next('.error').html('Field Required');
				error=true;
				processing = false;
			}
			console.log("last name error:",error)
			if(!$('#email').val().match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)){
				$('#email').addClass('error').next('.error').html('Invalid Email');
				error = true;
				processing = false;
			}
			console.log("email error:",error)
			if($('#guild').val()==''){
				$('.guilds').addClass('error').prev('.error').html('Please choose a guild affiliation');
				error = true;
				processing = false;
			}
			console.log("guild error:",error)
			if($('#guests').val()==''){
				$('#guests').val('0');
			}else{
				// for(var i = 0;i<Number($('#guests').val());i++) {
				// 	if($('.guestname').eq(i).find('input').val()==''){
				// 		error = true;
				// 		processing = false;
				// 		$('.guestname').eq(i).find('input').addClass('error').next('.error').html('Field Required.');
				// 	}
				// }
			}
			console.log("guest error:",error)
			if(!error){
				var url = 'focus-ampas';

				if(location.host=='focusfeaturesawards2018.com' || location.host=='www.focusfeaturesawards2018.com')
					url ='https://focusfeaturesawards2018.com';
				var data = form.find('form').serialize();
				$.post('/admin/attendees/register', data).done(function(data){

					processing = false;
					form.find('form').hide().next().show().html(data.message);
					if(data.err!='true'){
						form.find('form')[0].reset();
						form.find('.guests').find('span').html('GUESTS');
						form.find('.guilds').find('span').html('GUILD');
					}

		          	addtocalendar.load();
				}).fail(function(data){


					alert("There was an error. Please try again.");
					processing = false;
				});
			}else{
				processing=false;
			}
		}
	});
	//CITY CLICK
	$('body').on('click touchend','.city',function(e){
		e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();

		if(!$(this).hasClass('current')){
			$(this).siblings('.current').removeClass('current');
			$(this).addClass('current');
			var city = $(this).html();


			$('.film.active').find('.city-holder').fadeOut(200);
			$('.film.active').find('.'+city.split(' ').join('_')+'-holder').stop().delay(200).fadeIn(200,function(){
				checkScroll($('#'+loaded).find('.'+city.split(' ').join('_')+'-holder').find('.scrollable'));
			});
		}
	});
	$('.nav > div').on('click', function(e){
		e.preventDefault();
		e.stopPropagation();
		$(this).parent().find('.selected').removeClass('selected');
		$(this).addClass('selected');
		var index = $(this).index();
		var page = $(this).html().toLowerCase();

		closeRSVP();


		$(this).parents('.film').find('.content > div').fadeOut(400);
		history.pushState({film:loaded, page:page},filmInfo[loaded].title,'/'+filmInfo[loaded].url+'/'+page);

		$(this).parents('.film').find('.content > div').eq(index).stop().delay(400).fadeIn(400,function(){

			setTimeout(function(){
				checkScroll($('#'+loaded).find('.content').find('.screenings').find('.Los_Angeles-holder .scrollable'))

			},0);

		});
	});
	 resized = false;
	$(window).resize(function(){
		w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
		adjustMenu();
		isMobile = (w<737) ? true:false;
		isPortrait = (h>w) ? true:false;
		if(w/h < 1.1){
			//$('#isMobile').html(isMobile);

			if(menuMode){

				$('#back-btn').css({opacity:1});
				$//('.menu-mode').show();
			}
		}else{
			if(!isPortrait || !menuMode)
				$('#back-btn').css({opacity:0});
			else
				$('#back-btn').css({opacity:1});
			//if(menuMode)
				//$('.menu-mode').hide();
			checkScroll()
		}

	});
	$(window).on('orientationchange', function(e){
		$('#orientation').html(window.orientation);
		//portrait
		if(window.orientation != 90 && window.orientation !=-90){
			if(menuMode){
				$('#header').css({top:'1.3vw',opacity:1});
				$('.bar').css({'transform':'translateX(0%)',opacity:1});
				$('.text').css({'transform':'translateX(0%)',opacity:1});
				$('.menu-mode').hide();
			}else{
				$('#header').css({top:'1.3vw',opacity:1});
				$('.bar').css({'transform':'translateX(0%)',opacity:1});
				$('.text').css({'transform':'translateX(0%)',opacity:1});
				$('.menu-mode').hide();
			}
		}else{ ///LANDSCAPE
			if(menuMode){
				$('#header').css({top:'1.3vw',opacity:0});
				$('.bar').css({'transform':'translateX(0%)',opacity:0});
				$('.text').css({'transform':'translateX(0%)',opacity:0});
				$('.menu-mode').show();
			}else{
				$('#header').css({top:'1.3vw',opacity:1});
				$('.bar').css({'transform':'translateX(0%)',opacity:1});
				$('.text').css({'transform':'translateX(0%)',opacity:1});
				$('.menu-mode').hide();
			}
		}
		$('body')[0].offsetHeight;
	})
});

function closeRSVP(){

	var form = $('#rsvp-form');
	form.hide();
	form.find('form').show()[0].reset();
	form.find('input').removeClass('error').next('.error').html('');
	$('.hasDropdown').removeClass('error');
	$('#guild').val('');
	$('#guests').val('');
	$('.guests').find('span').html('Guests');
	$('.guilds').find('span').html('GUILD')
	form.find('.guests span').html('GUESTS');
	form.find('#rsvp-message').html('');
	//history.pushState({},'Focus Features AMPAS FYC 2017', '/');
	path[3]=false;
}

function loadFilmPage(film,page){
	filmLoaded= true;
	loaded = film;

	//Set default page if none given.
	if(!page){
		if(film == 'bk' || film =='tully')
			page = 'screenings';
		else
			page = 'synopsis';
	}
	var pageIndex = pageList.indexOf(page);

	//If Tablet
	//if(!isMobile || isTablet){

		if(!$('#'+film).hasClass('active')){
			var that = $('#'+film);
			if(!menuMode){
				if(!isMobile){
					$('.film').removeClass('home').not(that).addClass('menu-mode');

					if(w/h <1.1){

						$('#back-btn').css({opacity:1});
					}
				}else{
					//Mobile Portrait
					if(window.orientation != 90 && window.orientation != -90){
						$('.film').removeClass('home').not(that).addClass('menu-mode').removeClass('active');
						$('.fade').css({opacity:1});
					//Mobile Landscape
					}else{
						$('.film').not(that).addClass('menu-mode').removeClass('active');
						adjustMenu();
						$('.fade').css({opacity:0});
					}

					$('#back-btn').css({opacity:1});
				}
				adjustMenu();
				that.addClass('active');
				menuMode = true;
				$('.nav').hide();

			}else{
				$('.film').find('.content').children('div').stop(true,true).fadeOut(400);
				$('.nav').stop(true,true).fadeOut(400);
				if(window.orientation == 90 || window.orientation == -90)
					$('.fade').css({opacity:0});
				else{
					$('.fade').css({opacity:1});
				}
				setTimeout(function(){
					$('.film').addClass('menu-mode').removeClass('active');
					that.removeClass('menu-mode').addClass('active');

					if(!isMobile)
						adjustMenu();
					else{
						if(w>h)
							adjustMenu();
					}
				},400)

			}
			clearTimeout(timeout);

			timeOut = setTimeout(function(){
				that.find('.nav').stop(true).fadeIn().find('> div').removeClass('selected').eq(pageIndex).addClass('selected');
				that.find('.cities-list .city').first().addClass('current');
				that.find('.content').fadeIn(400).find('.'+page).stop(true).css({display:'block',opacity:0}).animate({opacity:1},400, function(){
					checkScroll();
					$(window).scrollTop(0);
					menuMode = true;

					//	$('#back-btn').css({opacity:1});
				});
			},600);
			history.pushState({film:film,page:page},'Focus Features AMPAS FYC 2018', '/'+filmInfo[film].url+'/'+page);
		}

		getScreenings(film);

	//if explicit screening is given
	if(path[3]){
		$.when(ajax).done(function(){
			var screeningId = path[3];
			var screeningInfo = filmInfo[film].screenings.find(function(currValue){
				return currValue.id==screeningId;
			})
			if(screeningInfo.status == 'open'){

				$('#screening-id').val(screeningInfo.id);

				if(screeningInfo.theater.metro=='London'){
					form.find('.london').show();
					form.find('.not-london').hide();
				}else{
				//LOAD DROPDOWNS
					form.find('.london').hide();
					form.find('.not-london').show();
					form.find('.dropdown').html('');
					for(var i=0;i<Number(screeningInfo.guests)+1;i++){
						form.find('.guests').find('.dropdown').append('<div class="value">'+i+'</div>')
					}
					for(var i=0;i<screeningInfo.affil.length;i++){
						form.find('.guilds').find('.dropdown').append('<div class="value">'+screeningInfo.affil[i]+'</div>')
					}

				}
				form.find('.movie').html(filmInfo[loaded].title);
				form.find('.date').html(parseDate(screeningInfo['date_time'])+', ');
				form.find('.theater').html(screeningInfo['theater'].name);
				//form.find('.time').html(parseTime(screeningInfo['date_time']));
				form.find('.rsvp-close-btn').one('touchstart click', function(){
					form.hide();
					form.find('form').show()[0].reset();
					form.find('#rsvp-message').html('');
				})

				form.show();
			}
			//checkScroll();
		});
	}

}
function loadHome(){

		$('.nav').hide();
		$('.content').hide();
		$('.active').removeClass('active');
		$('#back-btn').css({opacity:0});
		if(isMobile){

			//$('.menu-mode').fadeIn(400, function(){
			//	$(this).removeClass('menu-mode').removeAttr('style').addClass('home');
				$('.film').removeAttr('style').removeClass('active menu-mode').addClass('home');
			//});
			if(w>h){
				$('#header').css({top:'1.3vw',opacity:1});
				$('.bar').css({'transform':'translateX(0%)',opacity:1});
				$('.text').css({'transform':'translateX(0%)',opacity:1});
			}
		}else{
			$('.film').removeAttr('style').removeClass('active menu-mode').addClass('home');
		}
		menuMode = false;

		//history.replaceState({film:'home'},'Focus Features AMPAS FYC 2017', '/')
		history.pushState({film:'home'},'Focus Features AMPAS FYC 2017', '/')
}
var percentages = [.04,0.019,.033,.014,.034,.05,.0305]
function adjustMenu(){
	var bodyWidth = $('body').width();
	var factor = (h > 1000) ? 0.75:1;
	var pageHeight = $('body').height()*factor;

	var height = []
	var heightTotal = 0;

	var scale = (menuMode) ? 1:2;
	$('.menu-mode').each(function(){
	 	height.push(percentages[$(this).index('.film')]*bodyWidth);
	 	heightTotal +=percentages[$(this).index('.film')]*bodyWidth;
	});

	var div = (pageHeight*0.9-heightTotal)/6;

	var topAlign = div;//(boxesWidth-widthTotal-(div*3));
	var topMargin = pageHeight*((h>1000) ? 0.15:0);
	//
	$('.menu-mode').eq(0).css({top: topAlign+topMargin});
	$('.menu-mode').eq(1).css({top: topAlign+height[0]+div+topMargin});
	$('.menu-mode').eq(2).css({top: topAlign+height[0]+height[1]+(div*2)+topMargin});
	$('.menu-mode').eq(3).css({top: topAlign+height[0]+height[1]+height[2]+(div*3)+topMargin});
	$('.menu-mode').eq(4).css({top: topAlign+height[0]+height[1]+height[2]+height[3]+(div*4)+topMargin});
	$('.menu-mode').eq(5).css({top: topAlign+height[0]+height[1]+height[2]+height[3]+height[4]+(div*5)+topMargin});
}
var test = {};
var userID =  (location.search.indexOf('?') >= 0) ? location.search.split('=')[1]:'';
var cancelScreeningID = 0;
function loadCancelForm(){
	$.post('/admin/ajax/getRSVP', {id:userID}).done(function(data){
		data = JSON.parse(data);
		if(!data.message)
			form.show().find('form').hide().next().show().html('<h4>You are registered to attend '+filmInfo[movieIDIndex[Number(data.screening.movie_id)-1]].title+' on '+parseDate(data.screening.date_time)+' at '+data.theater.name+'. </h4><div class="submit-btn" id="cancelBtn">CANCEL RSVP</div>');
		else{
			form.show().find('form').hide().next().show().html('<h4>RSVP not found.</h4>');
			history.replaceState({},'Focus Features AMPAS FYC 2017', '/');
		}

	});
	$('body').one('click', '#cancelBtn', function(){
		$.post('/admin/ajax/cancelRSVP',{id:userID}).done(function(data){

			form.show().find('form').hide().next().show().html('<h4>Your RSVP has been cancelled.</h4>');
			history.pushState({},'Focus Features AMPAS FYC 2017', '/');
		})
	})
}
function getScreenings(film){

	$.get('/screenings.php?movie_id='+(movieIDIndex.indexOf(film)+1)).done(function(data){
		data = JSON.parse(data);

		//data.sort(function(a,b){return a.date_time-b.date_time})
		filmInfo[film].screenings = data;
		if(data !=false) {

			$('#'+film).find('.city-holder .scrollable').html('');
			for (var key in data) {
				var city = data[key].theater.city;
				//if City Holder doesn't exist
				if($('#'+film).find('.'+city.split(' ').join('_')+'-holder').length == 0){
					$('#'+film).find('.cities-list').append('<div class="city">'+city+'</div>')
					$('#'+film).find('.screenings').children('.abs-reset').append("<div class='city-holder "+city.split(' ').join('_')+"-holder'><div class='scrollable'></div></div>")
				}
				$('#'+film).find('.'+city.split(' ').join('_')+'-holder').find('.scrollable').append('<div class="screening"><div class="date">'+parseDate(data[key].date_time)+'</div><div class="theater">'+data[key].theater.name+'</div><div class="address">'+data[key].theater.address+'<a href="https://maps.google.com/?q='+data[key].theater.address+','+data[key].theater.address_2+'" target="_blank"></a></div>'+((data[key].notes) ? '<div class="notes">'+data[key].notes+'</div>':'') +'</div>');

				if(data[key].status=='closed'){
					$('#'+film).find('.'+city.split(' ').join('_')+'-holder').find('.scrollable').find('.screening').last().append('<div class="btn" data-screening-id="'+key+'">COMING SOON</div>');
				}else if(parseInt(data[key].rsvps) >= parseInt(data[key].capacity)){
					$('#'+film).find('.'+city.split(' ').join('_')+'-holder').find('.scrollable').find('.screening').last().append('<div class=" btn full" data-screening-id="'+key+'">Screening Full</div>');
				}else{
					$('#'+film).find('.'+city.split(' ').join('_')+'-holder').find('.scrollable').find('.screening').last().append('<div class="rsvp-btn btn" data-screening-id="'+key+'">RSVP</div>');
				}

			}

		}

			$('#'+film).find(".screenings").find('.abs-reset').each(function(){
				if($(this).find('.city-holder').length == 0){
					$(this).html('<h2>No screenings currently available.</h2>');
				}
			})
			$.when(ajax).done(function(){
				checkScroll($('#'+film).find('.Los_Angeles-holder .scrollable'));
			})

		//}
		ajax.resolve({status:true});
	}).fail(function(data){
		console.log('get screenings failed')

		$('#'+film).find(".screenings").find('.scrollable').each(function(){
			if($(this).find('.screening').length == 0){
				$(this).html('<h2>There was an error retrieving screenings! Click <span class="reload">here</span> to try again.</h2>');
			}
		});

	});
}
var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
function parseDate(timestamp){

	var date_time = timestamp.split(' ');
	var fixedDate = date_time[0].split('-').join('/');
	timestamp = fixedDate +' '+date_time[1];

	var date = new Date(timestamp);


	var month = months[date.getMonth()]
	var day = date.getDate();
	var hours = parseInt(date.getHours());


	var ampPM = (hours>=12) ? 'PM':'AM';
	//if(hours > 12)
		//hours = hours -12;
	if(hours < 0){
		day -=1;
		hours +=24;
	}
	var minutes = date.getMinutes();
	var time = [hours,(minutes < 10) ? '0'+minutes:minutes];

	//return;
	if (time[0] > 12)
		time[0] -= 12;
	return  month +' '+day+', '+time[0]+':'+time[1]+' '+ampPM;
}
function checkScroll(elem){

	if(!isMobile && !isTablet){
		if(elem != null){
			addScroller(elem);
		}else{
			$('.scrollable').each(function(){
				addScroller($(this));
			});
		}
	}
}
function addScroller(elem){
	var parent = elem.parent();
	var elemH = elem.innerHeight();
	var parentH = parent.innerHeight();
	var diff = parentH - elemH;

	var trackH = parent.height();
	var ctrlSize = (parentH /elemH)*trackH;


	parent.find('.scroller').remove();
	parent.off('wheel');


	if(elemH-10 > parentH){
		elem.css({top:0,position:'absolute'})
		parent.prev('.scroll-down').show();
		ctrlSize = 40;
		parent.css({'overflow':'hidden'}).append("<div class='scroller'><div class='scroll-track'></div><div class='scroll-ctrl' style='height:"+ctrlSize+"px;'></div></div>");
		parent.find('.scroll-ctrl').on('mousedown',function(e){
			var ctrl = $(this);
			var ctrlH = ctrl.height();
			var upperLimit = 0;
			var bottomLimit = parentH - ctrl.height();
			var scrollerOffset = ctrl.parent().offset().top;

			$('body').on('mousemove',function(e){
				var x = e.pageY;

				var move = x - scrollerOffset-(ctrlH/2);
				if(move>bottomLimit)
					move = bottomLimit;
				else if(move < upperLimit)
					move = upperLimit;
				ctrl.css({top:move});
				elem.css({top:((move)/(trackH-ctrlH))*diff})
			}).on('mouseup',function(){
				$(this).off('mousemove')
			})
		}).on('mouseup', function(){

		});
		parent.on('wheel', function(e){
			var ctrl = $(this).find('.scroll-ctrl');
			var ctrlH = ctrl.height();
			var upperLimit = 0;
			var bottomLimit = parentH - ctrl.height();
			var currTop = parseInt(ctrl.css('top'));
			parent.prev('.scroll-down').fadeOut();
			var move = e.originalEvent.deltaY+currTop;
			if(move>bottomLimit)
				move = bottomLimit;
			else if(move < upperLimit)
				move = upperLimit;
			ctrl.css({top:move});
			elem.css({top:((move)/(trackH-ctrlH))*diff})
		})
	}else{
		parent.find('.scroller').remove();
	}
}
