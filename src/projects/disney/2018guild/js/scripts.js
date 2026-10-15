// Static archive: responsive flags and routes require no PHP.
var isMobile = window.matchMedia('(max-width: 736px)').matches;
var isTablet = !isMobile && window.matchMedia('(pointer: coarse)').matches;
window.addEventListener('resize', function() {
  isMobile = window.matchMedia('(max-width: 736px)').matches;
  isTablet = !isMobile && window.matchMedia('(pointer: coarse)').matches;
});
function readDemoRoute() { return [''].concat(location.hash.replace(/^#\/?/, '').split('/')); }
function setDemoRoute(state) {
  var film = state.film || loaded;
  var page = filmInfo[film] && filmInfo[film].pageList.includes(state.page) ? state.page : 'consider';
  var hash = filmInfo[film] ? '#/' + filmInfo[film].url + '/' + page : '#/';
  var next = filmInfo[film] ? {film: film, page: page} : {film: 'home'};
  if (location.hash === hash) history.replaceState(next, '', hash);
  else history.pushState(next, '', hash);
}
function loadCancelForm() { loadHome(); }
// The former custom scrollbar is disabled; content uses its native scrolling.
function checkScroll() {}
/* CUSTOM HTML ELEMENT POLYFILL */
if (!Element.prototype.matches) {
    Element.prototype.matches = 
    Element.prototype.matchesSelector || 
    Element.prototype.mozMatchesSelector ||
    Element.prototype.msMatchesSelector || 
    Element.prototype.oMatchesSelector || 
    Element.prototype.webkitMatchesSelector ||
    function(s) {
        var matches = (this.document || this.ownerDocument).querySelectorAll(s),
            i = matches.length;
        while (--i >= 0 && matches.item(i) !== this) {}
        return i > -1;            
    };
}
var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
var headerHeight;
var loaded = null;
//var isMobile = (w<600) ? true:false;
var Orientation = (w >=h) ? 'landscape':'portrait';
var currPageIndex = 0;
var animating = false;
var movieIDIndex = ['bp','incredibles','mp','avengers','bao','ralph'];
var $loaded = null;
var anyVisible = false;

window.onpopstate = function() {
  var route = readDemoRoute();
  var film = Object.keys(filmInfo).find(function(key) { return filmInfo[key].url === route[1]; });
  if (film) loadFilmPage(film, route[2] || 'consider', true);
  else loadHome();
};

var initialState = {
	width:null,
	height:null,
	offset:null
}
var filmInfo = {
	"bp":{
		url:'black-panther',
		title:'Black Panther',
		page:'bp',
		pageList:['consider','synopsis','screenings','press','score','song','videos','accolades'],
		photos:0,
		pageLoaded:false,
		scoreLoaded:false,
		currentTrack:0,
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
		pageList:['consider','synopsis','screenings','press','score','accolades'],
		photos:0,
		pageLoaded:false,
		scoreLoaded:false,
		currentTrack:0,
		score:{
			titles:[
				"Episode 2",
				"Consider Yourselves Undermined!",
				"Movin' On Up",
				"A Matter of Perception",
				"Diggin' the New Digs",
				"This Ain't My Super-suit",
				"Elastigirl is Back",
				"Train of Taut (Part 1)",
				"Train of Taut (Part 2)",
				"Rocky vs. Jack-Jack",
				"Ambassador Ambush",
				"Hero Worship",
				"Searching for a Screenslaver",
				"Super Legal Again",
				"A Dash of Reality",
				"Hydrofoiled Again",
				"Elastigirl's Got a Plane to Catch",
				"Out and a Bout - Incredits 2"
			],
			files:[
				"01_Episode_2",
				"02_Consider_Yourselves_Undermined",
				"03_Movin_On_Up",
				"04_A_Matter_of_Perception",
				"05_Diggin_the_New_Digs",
				"06_This_Aint_My_Super-suit",
				"07_Elastigirl_is_Back",
				"08_Train_of_Taut_Part1",
				"09_Train_of_Taut_Part2",
				"10_Rocky_vs_Jack-Jack",
				"11_Ambassador_Ambush",
				"12_Hero_Worship",
				"13_Searching_for_a_Screenslaver",
				"14_Super_Legal_Again",
				"15_A_Dash_of_Reality",
				"16_Hydrofoiled_Again",
				"17_Elastigirls_Got_a_Plane_to_Catch",
				"18_Out_and_a_Bout_-_Incredits_2"
			]
		}
	},
	"mp":{
		url:'mary-poppins-returns',
		title:'Mary Poppins Returns',
		page:'mp',
		pageList:['consider','synopsis','screenings','score','songs','videos','accolades'],
		photos:0,
		pageLoaded:false,
		scoreLoaded:false,
		currentTrack:0,
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
	"avengers":{
		url:'avengers',
		title:'Avengers: Infinity War',
		page:'avengers',
		pageList:['consider','synopsis','screenings','press','accolades'],
		photos:0,
		pageLoaded:false,
	},
	"bao":{
		url:'bao',
		title:'Bao',
		page:'bao',
		pageList:['consider','synopsis','press'],
		photos:0,
		pageLoaded:false,
	},
	"ralph":{
		url:'ralph-breaks-the-internet',
		title:'Ralph Breaks The Internet',
		page:'ralph',
		pageList:['consider','synopsis','screenings','score','song','accolades'],
		photos:0,
		pageLoaded:false,
		scoreLoaded:false,
		currentTrack:0,
		songs:[
			{title:'A Place Called Slaughter Race', credits:'Sarah Silverman, Gal Gadot, and Cast', file:''},
			{title:'Zero',credits:'Imagine Dragons',file:''}
		],
		score:{
			titles:[
				"Friendship Montage",
				"Off-Piste",
				"Rooftop",
				"Going to the Internet",
				"A Whole New (Brave New) World",
				"Knowsmore Waltz",
				"Site Seeing",
				"Vehicular Cretiny",
				"Clickbait",
				"Don't Read the Comments",
				"Double-Dan on Bad Ideas",
				"Break-Up",
				"Replicate-It Ralph",
				"Everett's Many-Ralphs Interpretation",
				"Kling Kong",
				"We Need To Talk",
				"Long-Distance Relationship"
			],
			files:[
				"01_Friendship_Montage",
				"02_Off-Piste",
				"03_Rooftop",
				"04_Going_to_the_Internet",
				"05_A_Whole_New-Brave_New-World",
				"06_Knowsmore_Waltz",
				"07_Site_Seeing",
				"08_Vehicular_Cretiny",
				"09_Clickbait",
				"10_Dont_Read_the_Comments",
				"11_Double-Dan_on_Bad_Ideas",
				"12_Break-Up",
				"13_Replicate-It_Ralph",
				"14_Everetts_Many-Ralphs_Interpretation",
				"15_Kling_Kong",
				"16_We_Need_To_Talk",
				"17_Long-Distance_Relationship"
			]
		}
	}
}
var ajax = $.Deferred();
var path = readDemoRoute();
var currVideo = null;
console.log(path)
$(document).ready(function(){

	//POST LOAD video and mp3s
		//Black Panther
	$('#bp-page').find('.videos').find('.video-player').eq(0).html('<video controls controlsList="nodownload" poster="./img/bp/crushin.jpg"><source src="./media/video/WelcomeToWakanda.mp4"></video><div class="poster"><img src="./img/bp/featurette-poster.jpg"></div>');
	$('#bp-page').find('.videos').find('.video-player').eq(1).html('<iframe style="position:absolute;top:0;left:0;width: 100%;height:100%;" src="https://www.youtube.com/embed/tbEKRHR2JMQ" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>');

		//Mary Poppins Returns
	$('#mp-page').find('.videos').find('.video-player').eq(0).html('<video controls controlsList="nodownload" poster="./img/mp/qacover.jpg"><source src="https://disneystudiosawards.s3.amazonaws.com/videos/mpr-corden_qa.mp4"></video><div class="poster"><img src="./img/mp/qacover.jpg"></div>');
	$('#mp-page').find('.videos').find('.video-player').eq(1).html('<video controls controlsList="nodownload"><source src="https://disneystudiosawards.s3.amazonaws.com/videos/MPR-Making_The_Impossible.mp4"></video><div class="poster"><img src="./img/mp/cover-2.jpg"></div>');
	$('#mp-page').find('.songs').find('.video-player').eq(0).html('<video controls controlsList="nodownload" ><source src="https://disneystudiosawards.s3.amazonaws.com/videos/MPR_Lost_Things.mp4"></video><div class="poster"><img src="./img/mp/song-cover-1.jpg"><div class="play-btn"></div></div>');
	$('#mp-page').find('.songs').find('.video-player').eq(1).html('<video controls controlsList="nodownload"><source src="https://disneystudiosawards.s3.amazonaws.com/videos/MPR_Light_Fantastic.mp4"></video><div class="poster"><img src="./img/mp/song-cover-2.jpg"><div class="play-btn"></div></div>');
		//Ralph
	$('#ralph-page').find('.song').find('.audio-player').append('<audio controls controlsList="nodownload" autobuffer><source src="./media/toplay/ralph/songs/A_Place_Called_Slaughter_Race.mp3" type="audio/mp3"/></audio>');



	//INTRO ANIMATIONS
		if(typeof path[3] == 'undefined'){
			setTimeout(function(){
				$('.start').removeClass('start');
			},1000);
		}
	//window.onload = function(){
		if(path[1] != ''){
			if(location.pathname != '/' && location.pathname !='/guild/web/'){
				switch(path[1]){
					case 'black-panther':
						loaded = 'bp';
						break;
					case 'incredibles-2':
						loaded = 'incredibles'
						break;
					case 'mary-poppins-returns':
						loaded = 'mp';
						break;
					case 'avengers':
						loaded = 'avengers';
						break;
					case 'bao':
					 	loaded = 'bao';
					 	break;
					case 'ralph-breaks-the-internet':
						loaded = 'ralph';
					 	break;
					case 'cancelRSVP':
						loadCancelForm();
						break;
					default:
						//location.href= '/';
					break;
				}
				console.log(loaded)
				if(loaded !=null)
					loadFilmPage(loaded,(path[2]) ? path[2].toLowerCase().split(' ').join('-'):null,true);
				
			}
		}
	//}
	//},100);
	$('.fyc-banner a').click(function(e){
		e.preventDefault();
		loadHome();
	})
	//HOME PAGE BOX CLICK
	$('.film').on('click', function(e){
		var index = $(this).index();
		
		loaded = $(this).attr('id').split('-')[0]
		setDemoRoute({page:filmInfo[loaded].page});
		loadFilmPage(loaded);	

	});
	/********************* MENU EVENTS ************************/
	//////////// MOBILE MENU BTN ///////////////////
	$('#menu-btn').on('touchstart click', function(e){
		e.preventDefault();e.stopPropagation();
		$('#menu-btn').toggleClass('active');
		if(!$(this).hasClass('active'))
			$('#menu').css({left:'-100%'});
		else{
			$('.page').one('touchstart click', function(){
				$('#menu').css({left:'-100%'});
				$('#menu-btn').removeClass('active');
			})
			$('#menu').css({left:0}).find(' > .selected').addClass('open');
		}
	});
	//////////////////////////////////////////////////
	$('#menu').find('li').on('touchstart click', function(e){
		e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
		//console.log('li click');
		closeRSVP();	
	
		if(!$(this).hasClass('selected') && !$(this).hasClass('inactive')){
			var className = $(this)[0].className.split('-')[0];
			//prevent animation if already on page.
			// if(loaded !=null)
			// 	slideFilmPage(className,'consider')
			// else
			
				loadFilmPage(className,'consider')
		}
	}).hover(function(){
		$(this).addClass('open');
	},function(){
		$(this).removeClass('open');
	});
	//MENU ROOT CLICK
	//HEADER SUBMENU CLICK
	$('.page').on('click', '.nav-link', function(e){
		e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
		console.log('subclick')
		
		var elem = $(this);
		
		elem.trigger('mouseleave');
		if(!elem.hasClass('selected')){
			elem.siblings('.selected').removeClass('selected');
			elem.addClass('selected');
			closeRSVP();
			var page = elem.html().toLowerCase();

			

			page = page.split(' ').join('-');
			var index = elem.index();
			currPageIndex = index;
			
			//Load new page or subpage
			slideFilmPage(loaded,page);
		}		
	});
	$('body').on('click', '.pop-up-close', function(){
		$('.pop-up').fadeOut(400);
	})
	$('body').on('click','.guild-members-co', function(){
		$('.pop-up').fadeIn(400);
	})
	//SLIDER CLICK
	var clickTO;
	$('#page-holder').on('click','.arrow',function(){
		//$(this).children().stop(true);
		//clearTimeout(clickTO);
		console.log('test')
		clearInterval(autoTO);
		if(!imgAnimating){
			
			if($(this).attr('id')=='left-arrow')
				animateRight($(this).siblings('.slider'),600,false);
			else
				animateLeft(Date.now(),$(this).siblings('.slider'),600,false);

			if(loaded != 'bao'){
				autoTO = setInterval(function(){
					animateLeft(Date.now(), $('#'+loaded+'-page').find('.slider'),600,false);
				},4000);
			}
		}
		// clickTO = setTimeout(function(){animateLeft(12000,true)},2000);
	})
	
	/*********************************************************************/
	////////////////////////////// MEDIA EVENTS ///////////////////////////
	$('.page').on('click touchstart', '.track',function(e){
		e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
		var audioPlayer = $('#'+loaded+'-page').find('.score').find('.audio-player');
		
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
	$('.play-all').on('click',function(){
		$(this).parent().prev().find('.track').eq(0).trigger('click');
	})
	$('audio').contextmenu( function(e){
		console.log('test')
		e.preventDefault();
		return false;
	})
	$('video').contextmenu( function(e){
		console.log('test')
		e.preventDefault();
		return false;
	})
	// $('video').each(function(){
	// 	this.addEventListener('play', function(e){
	// 		console.log(e.target)
	// 		console.log('play')
	// 		$(e.target).next().addClass('playing').animate({opacity:0},300);
	// 		//dataLayer.push({event:this.src})
	// 	});
	// 	this.addEventListener('pause',function(e){
	// 		console.log('pause')
	// 		$(e.target).next().removeClass('playing').animate({opacity:1},300);
	// 	});
	// 	this.addEventListener('ended',function(e){
	// 		console.log('ended')
	// 		$(e.target).next().removeClass('playing').animate({opacity:1},300);
	// 		e.target.load();
	// 	})
	// });
	var currentVideo;
	$('body').on('touchstart click', '.video-play-btn',function(e){
		e.preventDefault(); e.stopImmediatePropagation();
		var video = $(this).siblings('video')[0];
		currentVideo = video;
		$(video).next('img').fadeOut();
		if($(this).hasClass('playing')){
			video.pause();
			//video.currentTime = 0;
			video.removeEventListener('ended',onEnd);
			$(this).removeClass('playing');
			//video.load();
			//$(this).animate({opacity:1},300);
		}else{
			stopAllMedia();
			video.play();
			video.addEventListener('ended', onEnd);
			$(this).addClass('playing');
			$(this).fadeOut();
		}
	});
	function onEnd(){
		console.log('video end')
		$(currentVideo).siblings().fadeIn();
		animateLeft(Date.now(), $('#'+loaded+'-page').find('.slider'),600,false);
		autoTO = setInterval(function(){
			animateLeft(Date.now(), $('#'+loaded+'-page').find('.slider'),600,false);
		},4000);
	}
	$('body').on('click touchstart','.poster', function(e){
		e.preventDefault();
		$(this).fadeOut();
		$(this).prev()[0].play();
	})
	$('.back-btn').on('click', loadHome);
	/////////////////////////////////////////////////////////
	//FILM MAKER NAMES EVENT
	$('body').on('click', '.name',function(){
		var index = $(this).index();
		console.log(index);
		$(this).siblings('.current').removeClass('current');
		$(this).addClass('current');
		$(this).parents('.content').find('.bio').fadeOut(300);
		$loaded.find('.bg.filmmakers').find('.bg').eq(index).css({zIndex:2,opacity:1});
		$loaded.find('.bg.filmmakers').find('.bg').not($loaded.find('.bg.filmmakers').find('.bg').eq(index)).css({zIndex:3}).animate({opacity:0},300, function(){
			$(this).css({zIndex:3});
		});
		$(this).parents('.content').find('.bio').eq(index).stop().delay(300).fadeIn(300, function(){
			var that= this;
			setTimeout(function(){checkScroll($(that).find('.scrollable'))},100);
		});
	});
	function openRSVP() { return false; }
	//////////////////////////////// RSVP FORM STUFF /////////////////////////////////
	$('body').on('click','.rsvp-btn',function(){
		var screeningId = parseInt($(this).attr('data-screening-id'));
		console.log(screeningId);
		//console.log(screeningId);
		// for(var i = 0;i<filmInfo[loaded].screenings.length;i++){
			
		// 	if(filmInfo[loaded].screenings[i].id == screeningId){
		// 		screeningId = i;
		// 	}
		// }
		
		var screeningInfo = filmInfo[loaded].screenings[screeningId];
		if(screeningInfo.status == 'open' && screeningInfo.official !=1){
			openRSVP(screeningInfo);
		}
			// console.log(screeningInfo);
			// $('#screening-id').val(screeningInfo.id);
			// var form = $('#rsvp-form');
			// if(screeningInfo.theater.metro=='London'){
			// 	form.find('.london').show();
			// 	form.find('.not-london').hide();
			// }else{
			// //LOAD DROPDOWNS
			// 	form.find('.london').hide();
			// 	form.find('.not-london').show();
			// 	form.find('.dropdown').html('');
			// 	for(var i=0;i<Number(screeningInfo.guests)+1;i++){
			// 		form.find('.guests').find('.dropdown').append('<div class="value">'+i+'</div>')
			// 	}
			// 	for(var i=0;i<screeningInfo.affil.length;i++){
			// 		form.find('.guilds').find('.dropdown').append('<div class="value">'+screeningInfo.affil[i]+'</div>')
			// 	}
			// 	if(screeningInfo.reception != false){
			// 		$('#rsvp-type').val(0);
			// 		form.find('.reception').show().find('.hasDropdown > span').html("SCREENING AND RECEPTION").next().html('<div class="selected value">SCREENING AND RECEPTION</div><div class="value">SCREENING ONLY</div><div class="value">RECEPTION ONLY</div>');
			// 	}
			// 	$('.guestname').remove();
				
			// 	if(screeningInfo.theater.requireNames == 1){

			// 		for(var i=0;i<Number(screeningInfo.guests);i++){
			// 			form.find('#rsvp-submit').before("<div style='display:none' class='input fullWidth guestname'><input type='text' name='guest_name"+(i+1)+"' placeholder='GUEST NAME'><div class='error'></div></div>");
			// 		}
			// 	}
			// }
			// form.find('.movie').html(filmInfo[loaded].title);
			// form.find('.date').html(parseDate(screeningInfo['date_time'],screeningInfo.theater.metro)+', ');
			// form.find('.theater').html(screeningInfo['theater'].name);
			// //form.find('.time').html(parseTime(screeningInfo['date_time']));
			// form.find('.rsvp-close-btn').one('touchstart click', closeRSVP)

			// form.show();
		//}
		if(screeningInfo.official ==1){
			window.open('http://www1.oscars.org/screenings/nominations/index.html#LA')
		}
	});
	function closeRSVP(){
		var form = $('#rsvp-form');
		form.hide();
		form.find('form').show()[0].reset();
		form.find('.guests').find('span').html('GUESTS');
		form.find('.guilds span').html('GUILD');
		$('#guests').val('');
		$('#guild').val('');
		$('.reception').hide();
		$('#rsvp-type').val(0);
		form.find('#rsvp-message').html('');
		path[3] = false;
	}
	$('body').on('click touchstart','.hasDropdown', function(e){
		e.stopPropagation();
		$('.dropdown').hide();
		if($(this).hasClass('guilds'))
			$('.guilds').removeClass('error').next('.error').html('');
		$(this).find('.dropdown').show().one('mouseleave', function(){
			$(this).hide();

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
	$('body').on('focus', 'input', function(){
		$(this).removeClass('error').next('.error').html('');
	})
	//RSVP SUBMIT
	var processing = false;
	$('body').on('click','#rsvp-submit', function(event) { event.preventDefault(); });

    ///////////////////////////////////////////////////////////////////////////////

	$('body').on('click touchend','.city', function(){
		if(!$(this).hasClass('current')){
			$(this).siblings('.current').removeClass('current');
			$(this).addClass('current');
			var city = $(this).html().toLowerCase().split(' ').join('-');
			$(this).parent().next().children().fadeOut(200);
			$(this).parent().next().find('.'+city+'-holder').stop().delay(200).fadeIn(400, function(){
				//checkScroll($(this).find('.scrollable'));
			});
		}
	})


	///OVERTURE
	$('.overture').click(function(e){
		e.preventDefault();
		var url = $(this).attr('href');
		$(this).next().find('.song-title').html($(this).attr('data-title'));
		$(this).next().find('audio').find('source').attr('src',url);
		$(this).next().find('audio')[0].load();
		$(this).next().find('audio')[0].play();
	})

	//HANDLE RESIZE
	$(window).resize(resize);

	//SCREENINGS RELOAD
	$('body').on('click','.reload', function(e){
		e.preventDefault();
		$(this).parents('.scrollable').html('<img class="loader" src="img/loader.gif">');
		getScreenings(loaded);
	})
});

function getScreenings(film) {
  if (!filmInfo[film]) return;
  filmInfo[film].screenings = [];
  $('#'+film+'-page .cities-list').empty();
  $('#'+film+'-page .screenings-holder').html('<h3>Archived screenings</h3><p>This 2018 campaign has ended. Screening schedules and registration are no longer available.</p>');
  ajax.resolve({status: true});
}
var months = ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];
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

function resize(){
	headerHeight = $('header').height();
	w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	Orientation = (w >= h) ? 'landscape':'portrait';

}
function loadHome(){

	console.log('loadHome');
	$('#page-holder').fadeOut(1000, function(){
		$(this).find('.page').removeAttr('style')
	});
	$('#nav').find('ul li').removeClass('selected');
	$('.subpages').children().children().removeAttr('style');
	$('#wrapper').delay(1000).fadeIn(600);
	$('.active-page').removeClass('active-page');
	$('.selected').removeClass('selected');
	setDemoRoute({film:'home'});
	loaded =null;
	$loaded = null;
	$('header').animate({top:'-100%'},500);
	$('video').each(function(){
		this.currentTime =0;
		this.load();
		$(this).next().removeAttr('style');
	});
}

function loadFilmPage(film,page,stat){
	clearInterval(autoTO);
	clearInterval(animateX);
	console.log('Load Page ',film,page);
	//already and active page
	if($('.active-page').length != 0){
		$('.active-page').find('.subpages').find('.limiter > div').removeAttr('style');
		$('.active-page').find('.nav-link').removeClass('selected')
		$('#menu').find('.selected').removeClass('selected')
		$('.active-page').animate({opacity:0}, 800, function(){
			$(this).hide().removeClass('active-page');
			$('#'+film+'-page').addClass('active-page').animate({opacity:1});
			// if(!filmInfo[film].pageLoaded) {
				
				// $.get('../php/'+film+'-page.php').done(function(data){
				// 	$('#'+film+'-page').html(data);
				// 	filmInfo[film].pageLoaded = true;
				// 	load(film,page,stat);
				// });
			// }else{
				
				 load(film,page,stat);
			//}
		})
	}else{
		
		$('#'+film+'-page').addClass('active-page');
		// if(!filmInfo[film].pageLoaded) {
			// $.get('../php/'+film+'-page.php').done(function(data){
				
			// 	$('#'+film+'-page').html(data);
			// 	filmInfo[film].pageLoaded = true;
			// 	load(film,page,stat);
			// });
		// }else{
			
			load(film,page,stat);
		//}
	}
	
}

var animateTO;
var currentImg = 2;
var imgAnimating = false;
var frame = 0;
var startTime;
var stopTime;
var startLeft;
function animateLeft(time,elem,speed,ease){
	clearTimeout(animateTO);
	//var once = 0;
	//console.log('test')
	stopVideo();
	if(!ease)
		ease = 'Quad.easeOut';
	var max = elem.children().length;
	
	 elem.children().each(function(index){
	 	if(index>0 && index<3){
			TweenLite.to(this,speed/1000,{x:(index-3)+'01%', ease:ease});
	 	}
		else if(index == 3)
			TweenLite.to(this,speed/1000,{x:(index-3)+'00%', ease:ease});
		else if(index > 3)
			TweenLite.to(this,speed/1000,{x:(index-3)+'01%', ease:ease});
	 })
	TweenLite.set( elem.children().first(),{x:(max-3)+'01%', ease:ease});
	var detach = elem.children().first().detach();
 	elem.append(detach)
}

function animateRight(elem,speed,ease){
	// clearTimeout(animateTO);
	stopVideo();
	 var max = elem.children().length;
	if(!ease)
		ease = 'Quad.easeOut';

	elem.children().each(function(index){
	 	if(index > 2 && index < max-1)
	 		TweenLite.to(this,speed/1000,{x:(index-1)+'01%', ease:ease});
	 	if(index==2)
	 		TweenLite.to(this,speed/1000,{x:(index-1)+'01%', ease:ease});
	 	if(index==1)
	 		TweenLite.to(this,speed/1000,{x:(index-1)+'00%', ease:ease});
	 	if(index==0)
	 		TweenLite.to(this,speed/1000,{x:(index-1)+'01%', ease:ease});

	})
	TweenLite.set( elem.children().last(),{x:'-201%'});
	var detach = elem.children().last().detach();
 	elem.prepend(detach);
}
function animateTo(to,speed){
	clearInterval(autoTO);
	clearInterval(animateX);

	// A zero-duration selection should jump directly to its hero image.
	// Rotating the children preserves the carousel's center at index two.
	if(speed === 0){
		var slider = $('#'+loaded+'-page').find('.slider');
		var children = slider.children();
		var targetIndex = children.filter('.'+to+'-hero').index();
		if(targetIndex < 0) return;
		stopVideo();
		TweenLite.killTweensOf(children.toArray());
		var offset = (targetIndex - 2 + children.length) % children.length;
		slider.append(children.slice(0, offset));
		slider.children().each(function(index){
			var position = index - 2;
			TweenLite.set(this, {x: position === 0 ? '0%' : (position * 100 + Math.sign(position))+'%'});
		});
		return;
	}
	
	var detach;
	
	console.log(to);

	var index = $('#'+loaded+'-page').find('.slider').find('.'+to+'-hero').index();
	//console.log('index:'+index);
	var imgs = $('#'+loaded+'-page').find('.slider').children();
	var max = imgs.length;
//	console.log('total images',max)
		//THIS WORKS BUT IS JANKY
	var x = 0;
	var y = imgs.length-index;
	var half = Math.floor((imgs.length) /2)+2;
	//console.log('half: ',half);
	 if(index >= half){
	 	var distance = max - index;
	 }else{
		var distance = index - 2;
	}
//	console.log('distance',distance);
	//2 - 3 = -1
	//
	if(distance < 0 ){
		animateRightXTimes($('#'+loaded+'-page').find('.slider'),Math.abs(distance),speed)
	}else if( index >= half){
		animateRightXTimes($('#'+loaded+'-page').find('.slider'),Math.abs(distance+2),speed)
	}else{
		animateLeftXTimes($('#'+loaded+'-page').find('.slider'),distance,speed)
	}
	// if(Math.abs(distance) < Math.floor((imgs.length-1) /2) ){
	// 	animateRightXTimes($('#'+loaded+'-page').find('.slider'),(imgs.length-index+2),speed)
	// }else{
	// 	animateLeftXTimes($('#'+loaded+'-page').find('.slider'),index-2,speed)
	
	// }
}
var animateX;
function animateLeftXTimes(elem,iterations,speed){
	clearInterval(animateX);
	//console.log('animateLeftXTimes',iterations)
	var x = 0;
	animateX = setInterval(function(){
		//console.log(x);
		
		if(x < Math.abs(iterations)){
			animateLeft(Date.now(),elem,speed,'Linear.easeNone');
			x++;
		}else{
			clearInterval(animateX);
		}
	},140)
}
function animateRightXTimes(elem,iterations,speed){
	//console.log('animateRightXTimes',iterations)
	clearInterval(animateX);
	var x = 0;
	animateX = setInterval(function(){
		//console.log(x);
		
		if(x < Math.abs(iterations)){
			animateRight(elem,speed,'Linear.easeNone');
			x++;
		}else{
			clearInterval(animateX);
		}
	},140)
}


var autoTO;
function load(film,page,stat){
	console.log('load')
	stopAllMedia();
	if($('.active-page'))
		headerHeight = $('header').height();
	if(!page || page==''){
		page = 'consider';

	}
	//LAZY LOAD SLIDER IMAGES SINCE THEY ARE SLOWING DOWN LOAD TIME
	switch(film){
		case 'bp':
		$('#'+film+'-page').find('.film-strip .slider').html('<img style="transform:translate(-201%,0)" src="./img/bp/crushin.jpg" draggable="false"/><img style="transform:translate(-101%,0)" src="./img/bp/BP_IMAGE_21.jpg" draggable="false"/><img style="transform:translate(0%,0)" class="consider-hero" src="./img/bp/ancestors.jpg" draggable="false"/><img style="transform:translate(101%,0)" src="./img/bp/last-battle.jpg" draggable="false"/><img style="transform:translate(201%,0)" class="synopsis-hero" src="./img/bp/back-to-back.jpg" draggable="false"/><img style="transform:translate(301%,0)" src="./img/bp/looking-at-camera.jpg" draggable="false"/><img style="transform:translate(401%,0)" src="./img/bp/new1.jpg" draggable="false"/><img style="transform:translate(501%,0)" class="screenings-hero" src="./img/bp/women-of-wakanda.jpg" draggable="false"/><img style="transform:translate(601%,0)" src="./img/bp/BP_IMAGE_13.jpg" draggable="false"/><img style="transform:translate(701%,0)" class="press-hero" src="./img/bp/challenge.jpg" draggable="false"/><img style="transform:translate(801%,0)" src="./img/bp/BP_IMAGE_14.jpg" draggable="false"/><img style="transform:translate(901%,0)" src="./img/bp/BP_IMAGE_17.jpg" class="score-hero" draggable="false"/><img style="transform:translate(1001%,0)" src="./img/bp/BP_IMAGE_24.jpg" draggable="false"/><img style="transform:translate(1101%,0)" src="./img/bp/BP_IMAGE_19.jpg" class="song-hero" draggable="false"/>');
			break;
		case 'incredibles':
			$('#'+film+'-page').find('.film-strip .slider').html('<img style="transform:translate(-201%,0)" src="./img/incredibles/slide-12.png" draggable="false"/><img style="transform:translate(-101%,0)" src="./img/incredibles/slide-8.jpg" draggable="false"/><img style="transform:translate(0%,0)" class="consider-hero" src="./img/incredibles/slide-4.jpg" draggable="false"/><img style="transform:translate(101%,0)" src="./img/incredibles/slide-5.jpg" draggable="false"/><img style="transform:translate(201%,0)" class="synopsis-hero"src="./img/incredibles/slide-2.jpg" draggable="false"/><img style="transform:translate(301%,0)" src="./img/incredibles/slide-6.png" draggable="false"/><img style="transform:translate(401%,0)" class="screenings-hero" src="./img/incredibles/slide-1.jpg" draggable="false"/><img style="transform:translate(501%,0)" src="./img/incredibles/slide-11.png" draggable="false"/><img style="transform:translate(601%,0)" class="press-hero" src="./img/incredibles/slide-9.jpg" draggable="false"/><img style="transform:translate(701%,0)" src="./img/incredibles/slide-7.jpg" draggable="false"/><img style="transform:translate(801%,0)" src="./img/incredibles/slide-10.png" class="score-hero" draggable="false"/><img style="transform:translate(901%,0)"  src="./img/incredibles/slide-13.jpg" draggable="false"/>');

			break;
		case 'mp':
			$('#'+film+'-page').find('.film-strip .slider').html('<img style="transform:translate(-201%,0)" src="./img/mp/slide-1.jpg" draggable="false"/><img style="transform:translate(-101%,0)" src="./img/mp/slide-2.jpg" draggable="false"/><img style="transform:translate(0%,0)" class="consider-hero" src="./img/mp/slide-7.jpg" draggable="false"/><img style="transform:translate(101%,0)" src="./img/mp/slide-6.jpg" draggable="false"/><img style="transform:translate(201%,0)" class="synopsis-hero" src="./img/mp/slide-10.jpg" draggable="false"/><img style="transform:translate(301%,0)" src="./img/mp/slide-3.jpg" draggable="false"/><img style="transform:translate(401%,0)"  class="screenings-hero" src="./img/mp/slide-9.jpg" draggable="false"/><img style="transform:translate(501%,0)" src="./img/mp/slide-5.jpg" draggable="false"/><img style="transform:translate(601%,0)" src="./img/mp/slide-12.jpg" draggable="false"/><img style="transform:translate(701%,0)" src="./img/mp/slide-15.jpg" draggable="false"/><img style="transform:translate(801%,0)" src="./img/mp/slide-16.jpg" draggable="false"/><img style="transform:translate(901%,0)" src="./img/mp/slide-17.jpg" draggable="false"/><img style="transform:translate(1001%,0)" src="./img/mp/slide-18.jpg" draggable="false"/><img style="transform:translate(1101%,0)" src="./img/mp/slide-19.jpg" draggable="false"/><img style="transform:translate(1201%,0)" src="./img/mp/slide-20.jpg" draggable="false"/>');
			break;
		case 'avengers':
			$('#'+film+'-page').find('.film-strip .slider').html('<img style="transform:translate(-201%,0)" src="./img/avengers/slide-11.jpg" draggable="false"/><img style="transform:translate(-101%,0)" src="./img/avengers/slide-3.jpg" draggable="false"/><img style="transform:translate(0%,0)" src="./img/avengers/slide-2.jpg" class="consider-hero" draggable="false"/><img style="transform:translate(101%,0)" src="./img/avengers/slide-4.jpg" draggable="false"/><img style="transform:translate(201%,0)" src="./img/avengers/slide-1.jpg" draggable="false"/><img style="transform:translate(301%,0)" src="./img/avengers/slide-10.jpg" draggable="false"/><img style="transform:translate(401%,0)" src="./img/avengers/slide-5.jpg" class="synopsis-hero" draggable="false"/><img style="transform:translate(501%,0)" src="./img/avengers/slide-6.jpg" draggable="false"/><img style="transform:translate(601%,0)" src="./img/avengers/slide-7.jpg" draggable="false"/><img style="transform:translate(701%,0)" src="./img/avengers/slide-8.jpg"  class="screenings-hero"  draggable="false"/><img style="transform:translate(801%,0)" src="./img/avengers/slide-9.jpg" draggable="false"/>');
			break;
		case 'bao':
			$('#'+film+'-page').find('.film-strip .slider').html('<img style="transform:translate(-201%,0)" src="./img/bao/slide-6.jpg" draggable="false"/><img style="transform:translate(-101%,0)" src="./img/bao/slide-1.jpg" draggable="false"/><div style="transform:translate(0%,0)" class=" video consider-hero"><video poster="./img/bao/bao-poster.jpg" controls><source src="./img/bao/bao-clip.mp4" type="video/mp4"></video><img src="./img/bao/bao-poster.jpg"><div class="video-play-btn"></div></div><img style="transform:translate(101%,0)" src="./img/bao/slide-3.jpg" draggable="false"/><img style="transform:translate(201%,0)" class="synopsis-hero" src="./img/bao/slide-5.jpg" draggable="false"/><img style="transform:translate(301%,0)" src="./img/bao/slide-3.jpg" draggable="false"/><img style="transform:translate(401%,0)" class="press-hero" src="./img/bao/slide-4.jpg" draggable="false"/>')
			break;
		case 'ralph':
			$('#'+film+'-page').find('.film-strip .slider').html('<img style="transform:translate(-201%,0)" class="screenings-hero" src="./img/ralph/slide-4.png" draggable="false"/><img style="transform:translate(-101%,0)" src="./img/ralph/slide-1.jpg" draggable="false"/><img style="transform:translate(0%,0)" class="consider-hero" src="./img/ralph/slide-2.png" draggable="false"/><img style="transform:translate(101%,0)" src="./img/ralph/slide-6.png" draggable="false"/><img style="transform:translate(201%,0)" class="synopsis-hero" src="./img/ralph/slide-5.png" draggable="false"/><img style="transform:translate(301%,0)" src="./img/ralph/slide-7.jpg" draggable="false"/><img style="transform:translate(401%,0)" class="score-hero" src="./img/ralph/slide-8.png" draggable="false"/><img style="transform:translate(501%,0)" class="songs-hero" src="./img/ralph/slide-9.png" draggable="false"/><img style="transform:translate(601%,0)" class="accolades-hero" src="./img/ralph/slide-10.png" draggable="false"/>');
			break;
		default:
		break;
	}


	//HIDE DIsney logo for BLACK PANTHER PAGES(So dumb)
	if(film=='bp')
		$('#logo').css({opacity:0});
	else{
		$('#logo').css({opacity:1});
	}
	//}else{
		//history.replaceState({page:film},filmInfo[film].title, '/');
	$('.'+film+'-btn').addClass('selected');
	setDemoRoute({film:film,page:page});
	//}
	//console.log('page:'+page);
	var pageIndex = filmInfo[film].pageList.indexOf(page);
	currPageIndex = pageIndex;
	$('.active-page').find('.nav-link').eq(pageIndex).addClass('selected');
	//$('#'+film+'-page').find('.film-strip').find('.slider').css({left:'-'+(pageIndex+1)+'00%'})
	loaded = film;
	$loaded = $('#'+film+'-page');
	$('header').animate({top:0},((stat)? 0:800));
	$('#wrapper').fadeOut(800);
	$('#page-holder').delay(800).fadeIn(600);
	$loaded.show();
	
	clearInterval(autoTO);
	//if(film != 'ralph'){
		//console.log('pageIndex: ',pageIndex)
		animateTo(page,0);
		if(film != 'bao'){
			autoTO = setInterval(function(){
				animateLeft(Date.now(),$('#'+loaded+'-page').find('.slider'),600,false);
			},4000);
		}
	//}
	
	if(page =='screenings'){
		getScreenings(film);
	}else if(page=='score'){
		loadScore(film);
	}else if(page=='photos'){
		loadPhotos(film);
	}else if(page=="music"){
		loadScore(film);
	}

	$loaded.find('.limiter > div').eq(pageIndex).fadeIn(400);
	if(path[3]){
		console.log(path[3])
			//SCREENING ID GIVEN
		
			$.when(ajax).done(function(){
				if(!isNaN(path[3])) {
					var screeningId = parseInt(path[3]);
					for(var i = 0;i<filmInfo[loaded].screenings.length;i++){
						
						if(filmInfo[loaded].screenings[i].id == screeningId){
							screeningId = i;
						}
					}
				
					 var screeningInfo = filmInfo[film].screenings[screeningId];
					if(screeningInfo.status == 'open' & screeningInfo.official != 1){
						console.log(screeningInfo);
						$('#screening-id').val(screeningInfo.id);
						var form = $('#rsvp-form');
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
							if(screeningInfo.reception != false){
								$('#rsvp-type').val(0);
								form.find('.reception').show().find('.hasDropdown > span').html("SCREENING AND RECEPTION").next().html('<div class="selected value">SCREENING AND RECEPTION</div><div class="value">SCREENING ONLY</div><div class="value">RECEPTION ONLY</div>');
							}
							$('.guestname').remove();
							
							if(screeningInfo.theater.requireNames == 1){

								for(var i=0;i<Number(screeningInfo.guests);i++){
									form.find('#rsvp-submit').before("<div style='display:none' class='input fullWidth guestname'><input type='text' name='guest_name"+(i+1)+"' placeholder='GUEST NAME'><div class='error'></div></div>");
								}
							}
						}
						form.find('.movie').html(filmInfo[loaded].title);
						form.find('.date').html(parseDate(screeningInfo['date_time'],screeningInfo.theater.metro)+', ');
						form.find('.theater').html(screeningInfo['theater'].name);
						//form.find('.time').html(parseTime(screeningInfo['date_time']));
						form.find('.rsvp-close-btn').one('touchstart click', function(){
							form.hide();
							form.find('form').show()[0].reset();
							form.find('#rsvp-message').html('');
						})

						form.show();
					}
				}else{
					setTimeout(function(){
						$('.city.'+path[3]).trigger('click');
					},1000)
				}
			});
	}
	function makeMenu(){

	}
	
	// $loaded.addClass((stat)?'stat':'').css({'transform':'scale(1)',left:0}).animate({},((stat)? 0:300), function(){
	//  	$(this).removeClass('animating')
	 	
	//   	headerHeight = $('header').height();

	  		
	//  	$('.page').css({'transform':'scale(1)'});
		
	// });
}
var interval;

function slideFilmPage(film, page){
	console.log('Slide Page',film,page,loaded)
	stopAllMedia();
	var pageIndex;
	//film == selected film
	// //loaded == old film
	// if(!filmInfo[film].pageLoaded) {
	// 	$.get('../php/'+film+'-page.php').done(function(data){
	// 		$('#'+film+'-page').html(data);
	// 		filmInfo[film].pageLoaded = true;
	// 		slide(film,page);
	// 	});
	// }else{
		slide(film, page);
	//}
}
function slide(film,page){
	
	setDemoRoute({film:film,page:page});
	if(!page){
		page = 'consider';
		pageIndex = 0;
		
	}else{
		pageIndex = filmInfo[film].pageList.indexOf(page);
		
	}
	$('.nav-link.selected').removeClass('selected');
	$('.active-page').find('.nav-link').eq(pageIndex).addClass('selected');


	//PAUSE ALL VIDEOS
	$('video').each(function(){
		if(!this.paused){
			this.pause();
			$(this).next().fadeIn();
		}
	});
	clearInterval(autoTO);
	animateTo(page,(w<736) ? 0:100);
	autoTO = setInterval(function(){
		animateLeft(Date.now(), $('#'+loaded+'-page').find('.slider'),600,false);
	},4000);
	
	//Adjust footer
	//$loaded = $('#'+film+'-page');
	
	if(page =='screenings'){
		getScreenings(film);
	}else if(page=='score'){
		loadScore(film);
	}else if(page=='photos'){
		loadPhotos(film);
	}else if(page=='music'){
		loadScore(film);
	}
	

	$('#'+film+'-page').find('.subpages').find('.limiter').children().fadeOut(400);
	$('#'+film+'-page').find('.'+page).stop(true).delay(400).fadeIn(400);
	

}
///play.php?sub='+film+'&file='+filmInfo[film].score.files[0]
function loadScore(film){
	console.log('loadScore')
	if(!filmInfo[film].scoreLoaded) {
		filmInfo[film].scoreLoaded = true;
		var audioPlayer = $('#'+film+'-page').find('.score').find('.audio-player');
		audioPlayer.find('.song-title').html(filmInfo[film].score.titles[0])
		audioPlayer.find('audio').find('source').attr('src', '');
		audioPlayer.find('audio')[0].load();

		for(var i = 0; i < filmInfo[film].score.titles.length; i ++){
			$('#'+film+'-page').find('.score').find('.track-list').find('.col.'+((i < filmInfo[film].score.titles.length/2) ? 'left':'right')).append('<div class="track"><div class="switcher"><div class="number">'+(i+1)+'.</div><div data-song="'+filmInfo[film].score.titles[i]+'" class="play-btn"></div></div><div class="track-info"><div class="track-name">'+filmInfo[film].score.titles[i]+'</div></div></div>')
		}
		$('#'+film+'-page').find('.score').find('.track-list').find('.col.right').append('<div class="play-all"><img src="./img/ui/small-play-btn.png">Play All</div>');
		$('#'+film+'-page').find('.score').find('.audio-player').find('audio')[0].addEventListener('ended', function(){
			playNextSong();
		})
		
			

		
	}
}

function playNextSong(){
	console.log('song ended');
	//console.log(filmInfo[film].score.titles.length)
	if(filmInfo[loaded].currentTrack < filmInfo[loaded].score.titles.length-1){
		filmInfo[loaded].currentTrack++;
		var audioPlayer = $('#'+loaded+'-page').find('.score').find('.audio-player');
		audioPlayer.find('.song-title').html(filmInfo[loaded].score.titles[filmInfo[loaded].currentTrack])
		audioPlayer.find('audio').find('source').attr('src', '');
		audioPlayer.find('audio')[0].load();
		audioPlayer.find('audio')[0].play();
		$('#'+loaded+'-page').find('.score').find('.track-list').find('.track').eq(filmInfo[loaded].currentTrack-1).removeClass('playing');
		$('#'+loaded+'-page').find('.score').find('.track-list').find('.track').eq(filmInfo[loaded].currentTrack).addClass('playing');
		//parent.removeClass('playing').siblings('.track').first().addClass('playing').find('audio')[0].play();
	}
		//parent.removeClass('playing').next('.track').addClass('playing').find('audio')[0].play();
}
function loadPhotos(film){
	console.log('load photos', film,filmInfo[film].photos)
	$('#'+film+'-page').find('.photos').find('.slider').html('');
	$('#'+film+'-page').find('.dots').html('');
	for(var i=1;i<filmInfo[film].photos+1;i++){
		$('#'+film+'-page').find('.photos').find('.slider').append('<div class="photo"><img src="./img/'+film+'/photos/'+i+'.jpg"/></div>')
		$('#'+film+'-page').find('.dots').append('<div class="dot"></div>');
		
	}
	$('#'+film+'-page').find('.photos').find('.photo').eq(0).addClass('viewing');
	$('#'+film+'-page').find('.dot').eq(0).addClass('active');
}
// function checkScroll(elem){
// 	if(!isMobile && !isTablet){
// 		if(elem != null){
// 			addScroller(elem);
// 		}else{
// 			$('.scrollable').each(function(){
// 				addScroller($(this));
// 			});
// 		}
// 	}
// }
// function addScroller(elem){
// 	var parent = elem.parent();
// 	var elemH = elem.innerHeight();
// 	var parentH = parent.height();
// 	var diff = parentH - elemH;
// 	//console.log(elemH,parentH)
// 	var trackH = parent.height();
// 	var ctrlSize = (parentH /elemH)*trackH;
// 	//console.log(elemH,parentH)
	
// 	parent.removeClass('scrollerActive').find('.scroller').remove();
// 	parent.off('wheel');
// 	elem.css({top:0})
// 	if(elemH > parentH){
// 		//console.log(elem,'Needs scroll')
// 		parent.prev('.scroll-down').show();
// 		ctrlSize = 40;
// 		parent.css({'overflow':'hidden'}).addClass('scrollerActive').append("<div class='scroller'><div class='scroll-track'></div><div class='scroll-ctrl' style='height:"+ctrlSize+"px;'></div></div>");
// 		parent.find('.scroll-ctrl').on('mousedown',function(e){
// 			var ctrl = $(this);
// 			var ctrlH = ctrl.height();
// 			var upperLimit = 0;
// 			var bottomLimit = parentH - ctrl.height();
// 			var scrollerOffset = ctrl.parent().offset().top;
			
			
			
// 			$('body').on('mousemove',function(e){
// 				var x = e.pageY;
// 				//console.log(e.pageY,scrollerOffset,x-scrollerOffset)
// 				var move = x - scrollerOffset-(ctrlH/2);
// 				if(move>bottomLimit)
// 					move = bottomLimit;
// 				else if(move < upperLimit)
// 					move = upperLimit;
// 				ctrl.css({top:move});
// 				elem.css({top:((move)/(trackH-ctrlH))*diff})
// 			}).on('mouseup',function(){
// 				$(this).off('mousemove')
// 			})
// 		}).on('mouseup', function(){

// 		});
// 		parent.styon('wheel', function(e){
// 			var ctrl = $(this).find('.scroll-ctrl');
// 			var ctrlH = ctrl.height();
// 			var upperLimit = 0;
// 			var bottomLimit = parentH - ctrl.height();
// 			var currTop = parseInt(ctrl.css('top'));
// 			parent.prev('.scroll-down').fadeOut();
// 			var move = e.originalEvent.deltaY+currTop;
// 			if(move>bottomLimit)
// 				move = bottomLimit;
// 			else if(move < upperLimit)
// 				move = upperLimit;
// 			ctrl.css({top:move});
// 			elem.css({top:((move)/(trackH-ctrlH))*diff})
// 		})
// 	}else{
// 		parent.find('.scroller').remove();
// 	}
// }
function stopVideo(){
	//console.log($('.playing').length);
	
	if($('.playing').length != 0){
		if( $('.playing').siblings('video').length > 0){
			$('.playing').siblings('video')[0].pause();
			$('.playing').siblings('video')[0].currentTime = 0;
			$('.playing').siblings('video')[0].load();
			$('.playing').siblings('img').fadeIn();
			$('.playing').removeClass('playing').removeAttr('style');
		}
	}
}

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
