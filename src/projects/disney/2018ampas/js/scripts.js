// Static archive: navigation stays inside this demo without server rewrites.
var isMobile = window.matchMedia('(max-width: 736px)').matches;
var isTablet = !isMobile && window.matchMedia('(pointer: coarse)').matches;
window.addEventListener('resize', function() {
  isMobile = window.matchMedia('(max-width: 736px)').matches;
  isTablet = !isMobile && window.matchMedia('(pointer: coarse)').matches;
});
function readDemoRoute() {
  return [''].concat(location.hash.replace(/^#\/?/, '').split('/'));
}
function setDemoRoute(state) {
  var film = state.film;
  var page = state.page || 'consider';
  var hash = filmInfo[film] ? '#/' + filmInfo[film].url + '/' + page : '#/';
  var next = filmInfo[film] ? {film: film, page: page} : {film: 'home'};
  if (location.hash === hash) history.replaceState(next, '', hash);
  else history.pushState(next, '', hash);
}
var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
var menuMode = false;
var movieIDIndex = ['bp','incredibles','mp','avengers','bao','ralph','','','solo','robin'];
var loaded = null;
var audioPlayer=false;
var filmInfo = {
	"bp":{
		url:'black-panther',
		title:'Black Panther',
		page:'bp',
		scoreLoaded:false,
		currentTrack:0,
		pageList: ['consider','synopsis','score','song','screenings'],
		score:{
			titles:[
				"Wakanda Origins",
				"Njobu",
				"Royal Talon Fighter",
				"Wakanda",
				"Warrior Falls",
				"Mbaku",
				"Waterfall Fight",
				"Ancestral Plane",
				"Killmonger",
				"Flight to Lab",
				"Casino Brawl",
				"Busan Car Chase",
				"Questioning Claw",
				"Outsider",
				"Is This Wakanda",
				"Killmonger's Challenge",
				"Killmonger vs T'Challa",
				"Loyal to the Throne",
				"Killmonger's Dream",
				"Stealing the Herb",
				"Entering Jabariland",
				"Wake Up T'Challa",
				"The Battle on Great Mound",
				"Glory to Bast",
				"The Return of Mbaku",
				"King Slayer",
				"A New Day",
				"Spaceship Bugatti"
			],
			files:[
				"01_Wakanda_Origins",
				"02_Njobu",
				"03_Royal_Talon_Fighter",
				"04_Wakanda",
				"05_Warrior_Falls",
				"06_Mbaku",
				"07_Waterfall_Fight",
				"08_Ancestral_Plane",
				"09_Killmonger",
				"10_Flight_to_Lab",
				"11_Casino_Brawl",
				"12_Busan_Car_Chase",
				"13_Questioning_Claw",
				"14_Outsider",
				"15_Is_This_Wakanda",
				"16_Killmongers_Challenge",
				"17_Killmonger_vs_TChalla",
				"18_Loyal_to_the_Throne",
				"19_Killmongers_Dream",
				"20_Stealing_the_Herb",
				"21_Entering_Jabariland",
				"22_Wake_Up_TChalla",
				"23_The_Battle_on_Great_Mound",
				"24_Glory_to_Bast",
				"25_The_Return_of_Mbaku",
				"26_King_Slayer",
				"27_A_New_Day",
				"28_Spaceship_Bugatti"
			]
		}
	},
	"incredibles":{
		url:'incredibles-2',
		title:'Incredibles 2',
		page:'incredibles',
		pageList: ['consider','synopsis','screenings'],
	},
	"avengers":{
		url:'avengers',
		title:'Avengers: Infinity War',
		page:'avengers',
		pageList: ['consider','synopsis','screenings'],
	},
	"ralph":{
		url:'ralph-breaks-the-internet',
		title:'Ralph Breaks The Internet',
		page:'ralph',
		pageList: ['consider','synopsis','screenings'],
	},
	'mp':{
		url:'mary-poppins-returns',
		title:'Mary Poppins Returns',
		page:'mp',
		scoreLoaded:false,
		currentTrack:0,
		pageList: ['consider','synopsis','score','song','screenings'],
		songs:[
			{title:'The Place Where Lost Things Go', credits:'Emily Blunt', file:''},
			{title:'Trip A Little Light Fantastic',credits:'Lin-Manuel Miranda with Emily Blunt and Cast',file:''}
		],
		score:{
			titles:[
				"Money Woes",
				"To The Park",
				"Out With The Trash",
				"Kite Chase",
				"Kite Chase (Reprise)",
				"Mary Takes Charge",
				"Mary Takes Charge (Reprise)",
				"Up The Bannister",
				"Up The Bannister (Reprise)",
				"Magic Papers",
				"Magic Papers (Reprise)",
				"Jane To Wilkins",
				"Two Faced Wilkins (Reprise)",
				"Nursery Plans",
				"Bowl Spin Into The Bowl",
				"Outside The Tent",
				"Royal Doulton Chase",
				"Off To Topsy's",
				"Off To Topsy's (Reprise)",
				"Kids Sneak Off",
				"Kids Burst In Chase",
				"Lost In A Fog",
				"When Did You All Get So Clever",
				"GoodBye Old Friend",
				"Race To Big Ben",
				"Missing Signatures",
				"Cherry Tree Lane",
				"Mary Exits",
				"Underneath The Lovely London Sky (Reprise)"
			],
			files:[
				"01_MoneyWoes",
				"02_ToThePark",
				"03_OutWithTheTrash",
				"04_KiteChase_pt1",
				"05_KiteChase_pt2",
				"06_MaryTakesCharge_pt1_",
				"07_MaryTakesCharge_pt2",
				"08_UpTheBannister_pt1",
				"09_UpTheBannister_pt2",
				"10_MagicPapers_pt1",
				"11_MagicPapers_pt2",
				"12_JaneToWilkins",
				"13_TwoFacedWilkins_pt2",
				"14_NurseryPlans",
				"15_19_BowlSpinIntoTheBowl",
				"16_OutsideTheTent",
				"17_RoyalDoultonChase",
				"18_OffToTopsys_pt1",
				"19_OffToTopsys_pt2",
				"20_KidsSneakOff",
				"21_KidsBurstIn_Chase",
				"22_LostInAFog",
				"23_WhenDidYouAlGetSoClever",
				"24_GoodByeOldFriend",
				"25_RaceToBigBen",
				"26_MissingSignatures",
				"27_CherryTreeLane",
				"28_MaryExits",
				"29_UnderneathTheLovelyLondonSky_pt2",
			]
		}
	},
	'bao':{
		url:'bao',
		title:'Bao',
		page:'bao',
		pageList: ['consider','synopsis','screenings'],
	},
	'solo':{
		url:'solo',
		title:'Solo',
		page:'solo',
		pageList: ['consider','synopsis','screenings'],
	},
	'robin':{
		url:'christopher-robin',
		title:'Christopher Robin',
		page:'christopher-robin',
		pageList: ['consider','synopsis','screenings'],
	}
}
var filmLoaded = false;

window.onpopstate = function() {
  var route = readDemoRoute();
  var film = Object.keys(filmInfo).find(function(key) { return filmInfo[key].url === route[1]; });
  if (film) loadFilmPage(film, route[2] || 'consider');
  else loadHome();
};
var ajax = $.Deferred();
var path = readDemoRoute();
$(document).ready(function(){
	if(path[1] == ''){
		$('.box').find('.logo').css({opacity:1});
	}
	$('.box.active').find('.synopsis').css({marginTop:$('.box.active').find('.logo img').height() + (w*0.012)})
	$('.box.active').find('.screenings').css({marginTop:$('.box.active').find('.logo img').height() + (w*0.012)})
	window.onload = function(){
		
		if(path[1] != ''){
			if(location.pathname != '/' && location.pathname !='/ampas/web/'){
				switch(path[1]){
					case 'black-panther':
						loaded = 'bp';
						break;
					case 'incredibles-2':
						loaded = 'incredibles';
						break;
					case 'avengers':
						loaded = 'avengers';
						break;
					case 'ralph-breaks-the-internet':
						loaded= 'ralph';
						break;
					case 'mary-poppins-returns':
						loaded = 'mp';
						break;
					case 'solo':
						loaded = "solo";
						break;
					case 'bao':
						loaded = "bao";
						break;
					case "christopher-robin":
						loaded = 'robin';
						break;
					case 'cancelRSVP':
						$('.box').find('.logo').css({opacity:1});
						loadCancelForm();
						break;
					default:
						//location.href= '/';
						$('.box').find('.logo').css({opacity:1});
						setDemoRoute({film:'home'})
					break;
				}
				if(loaded !=null)
					loadFilmPage(loaded,(path[2]) ? path[2].toLowerCase().split(' ').join('-'):null,true);
				
			}else{

			}
		}
	}
	$('.fyc-banner a').on('click', function(e){
		e.preventDefault();
		loadHome();
	})
	$('.box').on('click', function(e){
		closeRSVP();
		if(!$(this).hasClass('active')){
			var film = $(this).attr('id').split('-')[0];
			
			//history.pushState({film:film,page:'consider'},filmInfo[film].title,'/'+filmInfo[film].url+'/consider');
			
			loadFilmPage(film,'consider');
		}
	});
	$('#film-menu').children().click(function(){
		if(!$(this).hasClass('back-btn')){
			film = $(this).attr('class');
			$(this).hide().siblings().show();
			//loadHome();
			
			loadFilmPage(film,'consider');
		}else{
			loadHome();
		}
	});
	$('.nav').on('click', function(e){
		e.stopPropagation();
	})
	
	//FILM SUB MENU
	$('.nav > .nav-btn').on('click', function(e){
		e.preventDefault();
		e.stopPropagation();
		stopAllMedia();
		if(!$(this).hasClass('selected')){
			$(this).parent().find('.selected').removeClass('selected');
			$(this).addClass('selected');
		
			var index = $(this).index();
			var page = $(this).html().toLowerCase();
			console.log(page);
			closeRSVP();
			var film = $(this).parents('.box').attr('id').split('-')[0];
			if(page=='synopsis'){
				$(this).parents('.box').find('.synopsis').css({marginTop:$(this).parents('.box').find('.logo img').height()+(w*0.012)});
			} 
			if(page=='screenings'){
				$('.screenings-nav').css({display:'flex'});
				$('.disclaimer').fadeIn();
				$('.nom').fadeIn();
				$(this).parents('.box').find('.screenings').css({marginTop:$(this).parents('.box').find('.logo img').height()+(w*0.012)});
				$(this).next().animate({opacity:1});
				if(w<=736)
					$('.box.active').find('.screenings-nav').css({display:'flex'})

				if(loaded=='ralph' || loaded=='mp'){
					$('.guild-members-co').show();
				}
			}else{
				$('.disclaimer').fadeOut();
				$('.nom').fadeOut();
				$('.guild-members-co').hide();
				$('.screenings-nav').hide();
				$(this).parent().find('.screenings-nav').animate({opacity:0});
				$('.box.active').find('.screenings-nav').removeAttr('style');
			}
			if(page=='score'){
				loadScore(film);
			}
			if(!loaded){
				loadFilmPage(film,page);
			}else{
				$(this).parents('.box').find('.content > div').animate({opacity:0},600,function(){
					$(this).hide();
					setDemoRoute({film:loaded,page:page});
					$(this).parents('.box').find('.content > div').eq(index).stop().delay(400).show().animate({opacity:1},400);
				});
				
				
			}
		}
	});
	$('.screenings-nav').on('click','.city', function(e){
		console.log('test');
		if(!$(this).hasClass('current')){
			$(this).siblings('.current').removeClass('current');
			$(this).addClass('current');
			var city = $(this).html();
			//console.log(city);
			
			$('.box.active').find('.city-holder').fadeOut(200);
			$('.box.active').find('.'+city.toLowerCase().split(' ').join('-')+'-holder').stop().delay(200).fadeIn(200);
		}
	});
	$('#menu').find('li').on('touchstart click', function(e){
		e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
		//console.log('li click');
		closeRSVP();	
		$('.pop-up').fadeOut(400);
		if(!$(this).hasClass('selected') && !$(this).hasClass('inactive')){
			var className = $(this)[0].className.split('-')[0];
			//prevent animation if already on page.
			// if(loaded !=null)
			// 	slideFilmPage(className,'consider')
			// else
			
				loadFilmPage(className,'consider')
		}
	});


	$('body').on('click','.reload', function(e){
		e.preventDefault();
		$(this).parents('.scrollable').html('<img class="loader" src="img/loader.gif">');
		getScreenings(loaded);
	});
	$('body').on('click', '.pop-up-close', function(){
		$('.pop-up').fadeOut(400);
	})
	$('body').on('click','.guild-members-co', function(){

		$('.pop-up.'+loaded).fadeIn(400);
	})
	//DROPDOWN FUNCTIONALITY
	$('.hasDropdown').on('click touchstart', function(e){
		e.stopPropagation();
		$('.dropdown').hide();
		if($(this).hasClass('guilds'))
			$('.guilds').removeClass('error').next('.error').html('');
		$(this).find('.dropdown').show().parent().one('mouseleave', function(){
			$(this).find('.dropdown').hide();

		});
		$(this).find(".dropdown").find('.value').on('click', function(e){
			e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
			if($(this).parents('.hasDropdown').hasClass('guests')){
				$('#guests').val($(this).html());
				$('.guestname').hide();
				if(Number($(this).html()) > 0){
					$('.guestname').hide();
					for(var i=0;i<Number($(this).html());i++){
						$('input[name="guest_name'+(i+1)+'"]').parent().show();
					}
				}
			}else if($(this).parents('.hasDropdown').hasClass('guilds')){
				$('#guild').val($(this).html());
			
			}else if($(this).parents('.input').hasClass('reception')){
				$('#rsvp-type').val($(this).index());
			}
			$(this).parents('.hasDropdown').find('span').html($(this).html());
			$('.dropdown').hide();
		});
	});
	//RSVP BUTTON
	$('body').on('click touchend','.rsvp-btn',function(e){
		e.stopImmediatePropagation();
		var screeningId = parseInt($(this).attr('data-screening-id'));
		//console.log(screeningId);
		// for(var i = 0;i<filmInfo[loaded].screenings.length;i++){
			
		// 	if(filmInfo[loaded].screenings[i].id == screeningId){
		// 		screeningId = i;
		// 	}
		// }
		
		var screeningInfo = filmInfo[loaded].screenings[screeningId];
		
		if(screeningInfo.status=='open' && screeningInfo.official !=1) {
			openRSVP(screeningInfo);
		}
		if(screeningInfo.official ==1){
			window.open('http://www1.oscars.org/screenings/nominations/index.html#LA')
		}
	});
	
	//RSVP SUBMIT
	$('body').on('focus','input', function(){
		$(this).removeClass('error').next('.error').html('');
	})
	var processing = false;
	$('#rsvp-submit').on('click', function(event) { event.preventDefault(); });
	//CITY CLICK
	// $('body').on('click touchend','.city',function(e){
	// 	e.preventDefault();e.stopPropagation()
		
	// 	if(!$(this).hasClass('current')){
	// 		$(this).siblings('.current').removeClass('current');
	// 		$(this).addClass('current');
	// 		var city = $(this).html();
	// 		console.log(city);
			
	// 		$('.box.active').find('.city-holder').fadeOut(200);
	// 		$('.box.active').find('.'+city.split(' ').join('_')+'-holder').stop().delay(200).fadeIn(200,function(){
	// 			//checkScroll($('#'+loaded+'-box').find('.'+city.split(' ').join('_')+'-holder').find('.scrollable'));
				
	// 		});
			
			

	// 	}
	// });
	var resizeTimer;
	$(window).resize(function(){
		
		w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
		$('.box.active').find('.synopsis').css({marginTop:$('.box.active').find('.logo img').height() + (w*0.012)})
		$('.box.active').find('.screenings').css({marginTop:$('.box.active').find('.logo img').height() + (w*0.012)})
		if(menuMode){
			//resizeMenu();
		}
		if(w>736 && filmLoaded){
			$('.home').animate({opacity:0});
			$('header').animate({top:'0%'})
		}
		//clearTimeout(resizeTimer);
		resizeTimer = null;
		//resizeTimer = setTimeout(checkScroll,100);
		//checkScroll();
	});

	$('.box').on('click touchstart', '.track',function(e){
		e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
		//var audioPlayer = $('#'+loaded+'-box').find('.score').find('.audio-player');
		
		var index = $(this).index('.track');
		filmInfo[loaded].currentTrack= index;
		console.log(index);
		if($(this).hasClass('playing')){
			audioPlayer.find('audio')[0].pause();
			audioPlayer.find('audio')[0].currentTime = 0;
			$(this).removeClass('playing');
		}else{
			stopAllMedia();
			audioPlayer.find('.song-title').html(filmInfo[loaded].score.titles[index]);
			audioPlayer.find('audio').find('source').attr('src', '');
			audioPlayer.find('audio')[0].load();
			audioPlayer.find('audio')[0].play();
			//$('.play-btn').removeClass('playing');
			$(this).addClass('playing');
			
		}
	});
	$('audio').on('play',function(){
		console.log('test');

		$(this).next('.track-list').find('.track').eq(filmInfo[loaded].currentTrack).addClass('playing');
	});
	$('audio').on('pause',function(){
		console.log('test');
		$('.playing').removeClass('playing');
	});
	$('.play').on('click', function(){
		var index = $(this).attr('data-id');
		
		// console.log(filmInfo[loaded].songs[index].file);
		var audioPlayer = $('#'+loaded+'-page').find('.songs').find('.audio-player');
		audioPlayer.find('.song-title').html(filmInfo[loaded].songs[index].title);
		audioPlayer.find('.song-credit').html(filmInfo[loaded].songs[index].credits);
		audioPlayer.find('source').attr('src',filmInfo[loaded].songs[index].file);
		audioPlayer.find('audio')[0].load();
		audioPlayer.find('audio')[0].play();
	})
	$('.score').on('click','.play-all',function(){
		console.log('test')
		$(this).parent().prev().find('.track').eq(0).trigger('click');
	})
	$('audio').contextmenu( function(e){
		console.log('test')
		e.preventDefault();
		return false;
	})
	
});
function stopAllMedia(){
	$('.audio-player').each(function(){
		$(this).find("audio")[0].pause();
	});
	if($('.playing').length != 0){
		if( $('.playing').siblings('video').length > 0){
			$('.playing').siblings('video')[0].pause();
			$('.playing').siblings('video')[0].currentTime = 0;
			$('.playing').siblings('video')[0].load();
			$('.playing').siblings('img').fadeIn();
			$('.playing').removeClass('playing').removeAttr('style');
		}
		if($('.playing').find('audio').length > 0){
			$('.playing').find('audio')[0].pause();
			$('.playing').find('audio')[0].currentTime = 0;
			$('.playing').find('audio')[0].load();
			$('.playing').removeClass('playing').removeAttr('style');
		}
	}
	$('.playing').removeClass('playing');
}
var percentages=[0.078,0.092,0.1,0.14,0.1,0.16,];
function resizeMenu() {
	var boxesWidth = $('.limiter').width();
	var width = []
	var widthTotal = 0;
	var scale = (menuMode) ? 1:2;
	$('.menu-mode').each(function(){
		
	 	width.push(percentages[$(this).index('.box')]*boxesWidth);
	 
	 	widthTotal +=percentages[$(this).index('.box')]*boxesWidth;
	 	
	});
	
	var div = (boxesWidth-widthTotal)/6;
	
	var leftAlign = div;//(boxesWidth-widthTotal-(div*3));

	$('.menu-mode').eq(0).css({left:leftAlign});
	$('.menu-mode').eq(1).css({left:leftAlign+width[0]+div});
	$('.menu-mode').eq(2).css({left:leftAlign+width[0]+width[1]+(div*2)});
	$('.menu-mode').eq(3).css({left:leftAlign+width[0]+width[1]+width[2]+(div*3)});
	$('.menu-mode').eq(4).css({left:leftAlign+width[0]+width[1]+width[2]+width[3]+(div*4)});
	//$('.menu-mode').eq(4).css({left:leftAlign+width[0]+width[1]+width[2]+width[3]+200});
	menuMode = true;
	//$('.limiter').css({height:h - $('.fyc-banner').height()-50})
}
function getScreenings(film) {
  if (!filmInfo[film]) return;
  filmInfo[film].screenings = [];
  $('#'+film+'-box .cities-list').empty();
  $('#'+film+'-box .screenings').html('<h3>Archived screenings</h3><p>This 2018 campaign has ended. Screening schedules and registration are no longer available.</p>');
  ajax.resolve({status: true});
}
//var months = ['Jan','Feb','Mar','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec'];
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
function isDST(t) { //t is the date object to check, returns true if daylight saving time is in effect.
    var jan = new Date(t.getFullYear(),0,1).getTimezoneOffset();
    var jul = new Date(t.getFullYear(),6,1).getTimezoneOffset();
    if(Math.max(jan,jul) == t.getTimezoneOffset())
    	return 1;
    else
    	return 0;
}
function loadHome(){
	$('.nav').animate({opacity:0},400);
	filmLoaded = false;
	$('#film-menu').animate({opacity:0},400).children().not('.back-btn').hide();
	var stop = false;
	$('header').animate({top:'-100%'});
	$('.home').animate({opacity:1});
	$('.nom').fadeOut();
	$('.box').find('.logo').css({opacity:1});
	$('.content > div').animate({opacity:0},300,function(){
		console.log('test2')
		$(this).hide();
		if(!stop){
			stop = true;
			setTimeout(function(){
				$('.active').removeClass('active');
				$('.menu-mode').removeClass('menu-mode');
				menuMode= false;
				$('.box').animate({opacity:1},400, function(){
					
					
				});
				
			},100)
		}
	});
	setDemoRoute({film:'home'});
}
var timeout;
//var pageList = ['consider','synopsis','screenings','score','song'];
function loadFilmPage(film,page){
	audioPlayer = $('#'+film+'-box').find('.score').find('.audio-player');
	stopAllMedia();
	filmLoaded= true;
	loaded = film;
	$('#'+film+'-box').find('.logo').css({opacity:1});
	if(w>736){
		$('.home').animate({opacity:0});
		$('header').animate({top:'0%'})
	}

	$('#footer div').fadeOut(400);
	if(!page)
		page = 'consider';
	$('#menu').find('.selected').removeClass('selected')
	$('.'+film+'-btn').addClass('selected');
	var pageIndex = filmInfo[film].pageList.indexOf(page);
	console.log(film,page);
	if(page != 'screenings'){
		$('.screenings-nav').css({opacity:0});
		$('.screenings-nav').hide();
		$('.guild-members-co').fadeOut();
		$('.disclaimer').fadeOut();
		$('.nom').fadeOut();
	}
	else{
		$('.screenings-nav').css({opacity:1});
		$('.screenings-nav').css({display:'flex'})
		$('.disclaimer').fadeIn();
		$('.nom').delay(1000).fadeIn();
		if(film=='ralph' || film=='mp'){
			$('.guild-members-co').show();
		}
	}
	if(page=='score'){
		loadScore(film);
	}
	if(!$('#'+film+'-box').hasClass('active')){
		var that = $('#'+film+'-box');
		if(!menuMode){
			$('.box').not(that).animate({opacity:0},400, function(){
				
				setTimeout(function(){
					$('.box').addClass('menu-mode').removeClass('active');
					that.removeClass('menu-mode').addClass('active').removeAttr('style');
				},400)
				
				
			});
						
			menuMode = true;
		}else{
			$('.box.active').animate({opacity:0},400,function(){
				$(this).removeClass('active').addClass('menu-mode').find('.content > div').removeAttr('style');
				$('#'+film+'-box').removeClass('menu-mode').addClass('active').animate({opacity:1},400);
			})
		}
		clearTimeout(timeout);
		
		timeOut = setTimeout(function(){
			if(page=='synopsis'){
				$('.box.active').find('.synopsis').css({marginTop:$('.box.active').find('.logo img').height() + (w*0.012)})
			}else if(page=='screenings'){
				$('.box.active').find('.screenings').css({marginTop:$('.box.active').find('.logo img').height() + (w*0.012)});
				$('.box.active').find('.screenings-nav').animate({opacity:1});
			}
			$('#film-menu').find('.'+film).hide();
			$('#film-menu').animate({opacity:1},400);
			if(w>736){
				$('#film-menu').children().not('.'+film).show();
			}
			that.find('.nav').stop(true).animate({opacity:1}).find('> div').removeClass('selected').eq(pageIndex).addClass('selected');
			that.find('.content').find('.'+page).stop(true).css({display:'block',opacity:0}).delay(400).animate({opacity:1},400, function(){
				
				if(page=='synopsis'){
					$('.box.active').find('.synopsis').css({marginTop:$('.box.active').find('.logo img').height() + (w*0.012)});
					$('.box.active').find('.screenings-nav').removeAttr('style');
				}else if(page=='screenings'){
					$('.box.active').find('.screenings').css({marginTop:$('.box.active').find('.logo img').height() + (w*0.012)});
					if(w<=736)
						$('.box.active').find('.screenings-nav').css({display:'flex'})
				}else{
					$('.box.active').find('.screenings-nav').removeAttr('style');
				}
			});
		},800);
		setDemoRoute({film:film,page:page});
	}
	//DEEP LINKING
	getScreenings(film);
	
	if(path[3]) {
		$.when(ajax).done(function(){
			//SCREENING ID GIVEN

			if(!isNaN(path[3])) {
		
				console.log(loaded)
				var screeningInfo = filmInfo[loaded].screenings.find(function(value){
					console.log(value.id,parseInt(path[3]));
					return value.id == parseInt(path[3]);
				})
				console.log(screeningInfo);
				
				if(typeof screeningInfo != 'undefined'){
					//screeningInfo = filmInfo[film].screenings[screeningId];
					console.log(screeningInfo)
					if(screeningInfo.status == 'open' && screeningInfo.official != 1){
						console.log(screeningInfo.capacity,parseInt(screeningInfo.rsvps))
						if( parseInt(screeningInfo.rsvps) < screeningInfo.capacity){
							openRSVP(screeningInfo)
						}else{
							var form = $('#rsvp-form');
							form.find('form').hide()
							form.find('#rsvp-message').html('<h4>Sorry, the screening is now full.</h4').show();
							form.show();
							form.find('.rsvp-close-btn').one('click', closeRSVP)
						}
					}
				}
				//checkScroll();
		
			}else{//CITY GIVEN
				setTimeout(function(){
					$('.city.'+path[3]).trigger('click');
				},1000)
			}
		});
	}
	
}
var userID =  (location.search.indexOf('?') >= 0) ? location.search.split('=')[1]:'';
var cancelScreeningID = 0;
function loadCancelForm() { loadHome(); }
function openRSVP() { return false; }
function loadScore(film){
	console.log('loadScore',filmInfo[film])

	if(!filmInfo[film].scoreLoaded) {
		filmInfo[film].scoreLoaded = true;
		var audioPlayer = $('#'+film+'-box').find('.score').find('.audio-player');
		
		audioPlayer.find('.song-title').html(filmInfo[film].score.titles[0])
		audioPlayer.find('audio').find('source').attr('src', '');
		audioPlayer.find('audio')[0].load();

		for(var i = 0; i < filmInfo[film].score.titles.length; i ++){
			$('#'+film+'-box').find('.score').find('.track-list').find('.col.'+((i < filmInfo[film].score.titles.length/2) ? 'left':'right')).append('<div class="track"><div class="switcher"><div class="number">'+(i+1)+'.</div><div data-song="'+filmInfo[film].score.titles[i]+'" class="play-btn"></div></div><div class="track-info"><div class="track-name">'+filmInfo[film].score.titles[i]+'</div></div></div>')
		}
		$('#'+film+'-box').find('.score').find('.track-list').find('.col.right').append('<div class="play-all"><img src="./img/ui/small-play-btn.png">Play All</div>');
		$('#'+film+'-box').find('.score').find('.audio-player').find('audio')[0].addEventListener('ended', function(){
			playNextSong();
		})
		
			

		
	}
}
function playNextSong(){
	console.log('song ended');
	//console.log(filmInfo[film].score.titles.length)
	if(filmInfo[loaded].currentTrack < filmInfo[loaded].score.titles.length-1){
		filmInfo[loaded].currentTrack++;
		//var audioPlayer = $('#'+loaded+'-box').find('.score').find('.audio-player');
		audioPlayer.find('.song-title').html(filmInfo[loaded].score.titles[filmInfo[loaded].currentTrack])
		audioPlayer.find('audio').find('source').attr('src', '');
		audioPlayer.find('audio')[0].load();
		audioPlayer.find('audio')[0].play();
		$('#'+loaded+'-box').find('.score').find('.track-list').find('.track').eq(filmInfo[loaded].currentTrack-1).removeClass('playing');
		$('#'+loaded+'-box').find('.score').find('.track-list').find('.track').eq(filmInfo[loaded].currentTrack).addClass('playing');
		//parent.removeClass('playing').siblings('.track').first().addClass('playing').find('audio')[0].play();
	}
}

function closeRSVP(){
		
		var form = $('#rsvp-form');
		form.hide();
		form.find('form').show()[0].reset();
		form.find('.guests span').html('GUESTS');
		form.find('.guilds span').html('GUILD');
		$('#guests').val('');
		$('#guild').val('');
		$('.reception').hide();
		$('#rsvp-type').val(0);
		form.find('#rsvp-message').html('');
		path[3]=false;
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
	elem.css({top:0})
	
	if(elemH > parentH){
		
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
