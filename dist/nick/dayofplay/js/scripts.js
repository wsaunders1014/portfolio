var slideDiff;
var contH;
var slideH;
var topPos = 0;
var newTopPos;
var bottomBound = 0;
var topBound;
var fadeH;
var w = window.innerWidth
|| document.documentElement.clientWidth
|| document.body.clientWidth;
var h = window.innerHeight
|| document.documentElement.clientHeight
|| document.body.clientHeight;
var chosenStuff=[];
var chosenWhere=false;
var chosenPlayers=false;
var stuff = ['paper', 'broom', 'bucket', 'tennis-ball', 'ball', 'bouncy-ball', 'chalk', 'plastic-cups', 'tennis-rackets', 'water', 'towel', 'balloon', 'sticks', 'skateboard', 'empty-cans', 'basketball', 'foam-dart-blaster', 'foam-darts', 'none'];
var where = ['driveway','field','pool','backyard','sidewalk'];
var players = ['1','2','3','4','5','6-7','8-or-more'];
var featuredGameObj;
var gameObj;
var gameSlideOut = false;
var gameSlideOutTMNT = false;
var contentScrolled = false;
var divided = Math.floor(stuff.length/8);
var modulus = stuff.length%8;
var nextImg;
var coming,going;
var page=0;
var parallax;
var parallaxTMNT;
if (modulus > 0)
	divided++;
var starPlayerOpen = false;
var tmntOpen = false;
var galleryOpen = false;
var galleryArray;
var tmntArray;
var today = new Date();
var currGameID;
var galleryBtn = false;
var starPlayerBtn = false;
var tmntBtn = false;
var galleryLeft;
var starPlayerGalleryLeft = -83;
var contentLeft;
var isTouch;
var completeMessageTimeout;
var tablet = false;
var currentCat = null;

var currentBadgeGameId = 30;

var gameColumnWidth = 30;
var gameColumnWidthTMNT = 19;

var gameLimit = 6;
var tmntGameLimit = 6;

function date(timeStamp, callback) {
	var current = new Date();
	var expiry = new Date(timeStamp)

	if(current.getTime() > expiry.getTime()){
		callback();
	}
}

date("May 1, 2016 00:00:00", function() {
	gameLimit = 3;
});

date("June 1, 2016 00:00:00", function() {
	gameLimit = 0;
});



$(document).ready(function(){
	//global.track('landing');

	if(pages.platform=='tablet'){
		tablet = true;
		isTouch = "touchend";
		$('body').addClass('tablet');
		$('html').addClass('tablet');
	}else {
		isTouch ='click';
	}
	$(document).on('touchmove',function(e){
	  ///web.archive.org/web/20161019151532/http://e.preventdefault/();
	});

	var scrolling = false;
	$('body').on('touchstart','.scrollable',function(e) {
	    // Only execute the below code once at a time
	    if (!scrolling) {
	        scrolling = true;
	        if (e.currentTarget.scrollTop === 0) {
	          e.currentTarget.scrollTop = 1;
	        } else if (e.currentTarget.scrollHeight === e.currentTarget.scrollTop + e.currentTarget.offsetHeight) {
	          e.currentTarget.scrollTop -= 1;
	        }
	        scrolling = false;
	    }
	});
	// Prevents preventDefault from being called on document if it sees a scrollable div
	$('body').on('touchmove','.scrollable',function(e) {
	  e.stopPropagation();
	});
	parallax = $("#content").parallax({scalarY: 0});
	parallaxTMNT = $("#parallax-tmnt").parallax({scalarY: 0});
	games = games['games'];
	gamesTMNT = gamesTMNT['games'];

	galleryArray = games.slice(0, games.length - gameLimit);
	tmntArray = gamesTMNT.slice(0, gamesTMNT.length - tmntGameLimit);

	newThisWeek();
	sortByNewest();
	setSize();
	TweenMax.set($('#games-list'), {left:'100%'});
	TweenMax.set($('#game-slide'), {right:'-80%'});
	checkScrolling();

	var $ansHeader 		= $("#answer-header");
	var $ansHolder 		= $("#answers");
	var $quizAnswers 	= $("#quiz-answers");
	var $quizItems 		= $(".quiz-item").on(isTouch, quizItemClicked);
	var $closeAnsBtn	= $("#answer-close-btn").on(isTouch, function(){
		if($(this).hasClass('blue')){
			$('.stuffSprite').removeClass('stopAnimation');
		}
		quizCloseAnswers();
		currentCat = null;
	});
	$ansHolder.on(isTouch, '.answer', function(){

		if(currentCat == 'stuff'){
			chosenStuff = [];
			chosenStuff.push($(this).attr('data-id'));
			quizCloseAnswers();
		}else if(currentCat=='players'){
			chosenPlayers = $(this).attr('data-id');
			$('#'+currentCat+' .image').addClass('active').html('<img src="img/players/'+chosenPlayers+'.png"/>');
			quizCloseAnswers();
			//enablePlayBtn();
		}else if(currentCat=='where'){
			chosenWhere = $(this).attr('data-id');
			$('#'+currentCat+' .image').addClass('active').html('<img src="img/where/'+chosenWhere+'.png"/>');
			quizCloseAnswers();
			//enablePlayBtn();
		}
		currentCat = null;
		$('#'+currentCat).addClass('stopAnimation');
	});

	$('#games-list').on(isTouch,'.view-btn',function(){
			var id = $(this).parent().parent().attr('data-game');
			showGameSlide(id);
	});

	$('#starplayer-gallery').on(isTouch,'.badge',function(){
			showGameSlide(currentBadgeGameId);
	});
	$('#tmnt-games-list').on(isTouch,'.tmnt-view-btn',function(){
			var id = $(this).parent().parent().attr('data-game');
			showTMNTGameSlide(id);
	});
	$('.games').on(isTouch,'.view-btn',function(){
			var id = $(this).parent().parent().attr('data-game');
			showGameSlide(id);
	});
	if(tablet){
		$('#games-list').on('click','.game',function(){
			var id = $(this).attr('data-game');
			showGameSlide(id);
		});
		$('#tmnt-games-list').on('click','.game',function(){
			var id = $(this).attr('data-game');
			showTMNTGameSlide(id);
		});
		$('.games').on('click','.game',function(){
			var id = $(this).attr('data-game');
			showGameSlide(id);
		});
	}
	if(!tablet){
		$('#starplayer-btn').hover(function(){
			if ($('body').hasClass('tablet') == false){
				if(starPlayerOpen ==false){
					$('#starplayer-gallery').stop(true,true).animate({left:'+=1%'},300);
				}
			}
		},function(){
			if ($('body').hasClass('tablet') == false){
				if(starPlayerOpen ==false){
					$('#starplayer-gallery').stop(true,true).animate({left:'-=1%'},300, function(){
						$('#starplayer-gallery').removeAttr('style');
					});
				}
			}
		});
		$('#tmnt-btn').hover(function(){
			if ($('body').hasClass('tablet') == false){
				if(tmntOpen ==false){
					//$('#tmnt-gallery').stop(true,true).animate({left:'+=1%'},300);
				}
			}
		},function(){
			if ($('body').hasClass('tablet') == false){
				if(tmntOpen ==false){
					// $('#tmnt-gallery').stop(true,true).animate({left:'-=1%'},300, function(){
					// 	$('#tmnt-gallery').removeAttr('style');
					// });
				}
			}
		});
		$('#gallery-btn').hover(function(){
			if ($('body').hasClass('tablet') == false && !$(this).hasClass('active') ){
				if(galleryOpen == false ){

					$('#gallery').stop(true,true).animate({left:'+=1%'},300);
				}
			}
		},function(){
			if ($('body').hasClass('tablet') == false && !$(this).hasClass('active') ){
				if(galleryOpen ==false ){
					$('#gallery').stop(true,true).animate({left:'-=1%'},300, function(){
						$('#gallery').removeAttr('style');
					});
				}
			}
		});
	}
	var isiPad = navigator.userAgent.match(/iPad/i) != null;

	$(window).resize(setResize);
	$(window).load(setResize);
	$(window).focus(setResize);

	function setResize() {
		if(isiPad) {
			$('html, body').css({
				'height' : window.innerHeight + 'px',

			});
			$(' #main').css({
				'height' : (window.innerHeight - 30) + 'px',

			});

		}
	}
	$(window).resize(function(){
		//console.log('resize');
		w = window.innerWidth
		|| document.documentElement.clientWidth
		|| document.body.clientWidth;
		h = window.innerHeight
		|| document.documentElement.clientHeight
		|| document.body.clientHeight;
		contH = $('#gallery').height();
	 	slideH = $('.inner').innerHeight();
	 	topBound = contH - slideH;
	 	bottomBound = 0;
	 	if(topBound >= 0 ) {
	 		topBound = 0;
	 	}
	 	setSize();
	 	var logoW = $('.logoSprite').width();
	 	$('.logoSprite').css({backgroundSize:logoW*17+'px',backgroundPosition:-(logoW*16)+'px 0px'});
	 	var quizItem = $('.quiz-item').width();
	 	$('.quiz-item').not('.play-btn').not('.reset-btn').css({backgroundSize:quizItem*12+'px', backgroundPosition:'0px 0px'});
	 	if($('.play-btn').hasClass("active")){
		 	$('.play-btn').css({backgroundSize:$('.play-btn').width() * 24+'px', backgroundPosition:'0px 0px'});
	 	}else{
		 	$('.play-btn').css({backgroundSize: '', backgroundPosition:''});
	 	}

	 	gamesListResize();
	});
	if(!tablet){
		$('.playersSprite').hover(
			function(){
				if($(this).hasClass('animated')==false && $(this).hasClass('stopAnimation')==false) {
					playSprite('playersSprite',12,1200);
					$('.playersSprite').addClass('animated');
				}
			}, function(){
				clearInterval(playersSpriteInterval);
				$('.playersSprite').removeClass('animated').css({backgroundPosition:'0 0'});
		});
		$('.stuffSprite').hover(
			function(){
				if($(this).hasClass('animated')==false && $(this).hasClass('stopAnimation')==false){
					playSprite('stuffSprite',12,600);
					$('.stuffSprite').addClass('animated');
				}
			}, function(){
				clearInterval(stuffSpriteInterval);
				$('.stuffSprite').removeClass('animated').css({backgroundPosition:'0 0'});
		});
		$('.whereSprite').hover(
			function(){
				if($(this).hasClass('animated')==false && $(this).hasClass('stopAnimation')==false){
					playSprite('whereSprite',12,1000);
					$('.whereSprite').addClass('animated');
				}
			}, function(){
				clearInterval(whereSpriteInterval);
				$('.whereSprite').removeClass('animated').css({backgroundPosition:'0 0'});
		});
		$('.playSprite').hover(
			function(){
				if($(this).hasClass('animated')==false && $(this).hasClass('active')==true ){
					playSprite('playSprite',24,1200);
					$('.playSprite').addClass('animated');
				}
			}, function(){
				clearInterval(playSpriteInterval);
				$('.playSprite').removeClass('animated').css({backgroundPosition:'0 0'});
		});
	}
	///////////////////// FILTERS //////////////////////////
	$('.sorter').on('click',function(){
		if($(this).hasClass('active')){
			$(this).removeClass('active');
		}else {
			$(this).addClass('active');
		}
	});

	$('.sort ul li').on('click',function(e){
		e.stopPropagation();
		var sort = $(this).attr('data-id');
		var playerTxt = $(this).html();
		$('.sort ul li').removeClass('selected');
		$(this).addClass('selected');

		$('.sort').removeClass('active');
		$('.sort span').html(playerTxt);
		if(sort=='alphabetical'){
			sortByABC();
		}
		if(sort=='minplayers'){
			sortByMinPlayers();
		}
		if(sort=='maxplayers'){
			sortByMaxPlayers();
		}
		if(sort=='newest'){
			//console.log('test');
			sortByNewest();
		}
		if(sort=='reset'){
			resetSort();
		}
	});
	////////////////////////////PRINT////////////////////////////
	$('#main').on(isTouch,'.hover .print-btn', function(){
		var id = $(this).parent().parent().attr('data-game');
		loadPrint(id);
		tracking.call('games/game'+formatID(id)+'/print');
	});
	$('#main').on(isTouch,'.overlay .tmnt-print-btn', function(){
		var id = $(this).parent().parent().attr('data-game');
		loadTMNTPrint(id);
		tracking.call('tmnt/game'+formatIDTMNT(id)+'/print');
	});
	$('#main').on(isTouch,'.overlay .print-btn', function(){
		var id = $(this).parent().parent().attr('data-game');
		loadPrint(id);
		tracking.call('games/game'+formatID(id)+'/print');
	});
	$('#main').on(isTouch,'#game-slide .print-btn', function(){
		var id = gameObj.gameID;
		loadPrint(id);
		tracking.call('games/game'+formatID(id)+'/print');
	});
	$('#main').on(isTouch,'#game-slide-tmnt .print-btn', function(){
		var id = gameObj.gameID;
		loadTMNTPrint(id);
		tracking.call('tmnt/game'+formatIDTMNT(id)+'/print');
	});
	$('#main').on(isTouch,'.print-btn',function(){
		//var id = $(this).parent().parent().attr('data-game');
		//loadPrint(id);
		setTimeout(function(){
			window.print();
		},1000);
	});
	$('#main').on(isTouch,'.tmnt-print-btn',function(){
		//var id = $(this).parent().parent().attr('data-game');
		//loadPrint(id);
		setTimeout(function(){
			window.print();
		},1000);
	});
	$('#get-game-btn').on(isTouch,function(){
			tracking.call('random/another');
			$('#random-game .scroll-inner').scrollTo(0,10);
			randomGame(true);
	});
	$('.reset-btn').on(isTouch,function(){

		tracking.call('landing/reset');

		chosenStuff='';
		chosenWhere='';
		chosenPlayers='';
		$('.play-btn').removeClass('active').removeAttr('style');
		$('.quiz-item').removeClass('stopAnimation');
		$('.quiz-item .image').removeClass('active').html('');
		$('.reset-btn').removeClass('active');
	});
	if(!tablet){
		$('#gallery-btn').on('mouseover',function(){
			if(!galleryBtn){
				playSprite('galleryBtn',20,1000,function(){
					galleryBtn = false;
				});
				galleryBtn = true;
			}
		});
		$('#starplayer-btn').on('mouseover',function(){
			if(!starPlayerBtn){
				// playSprite('starPlayerBtn',19,1000,function(){
				// 	randomBtn = false;
				// 	$('.starPlayerBtn').css({backgroundPosition:'0 0'});
				// });
				// starPlayerBtn = true;
			}
		});
		$('#tmnt-btn').on('mouseover',function(){
			if(!tmntBtn){
				// playSprite('tmntBtn',19,1000,function(){
				// 	tmntBtn = false;
				// 	$('.tmntBtn').css({backgroundPosition:'0 0'});
				// });
				// tmntBtn = true;
			}
		});
	}



$("#left").on(isTouch, quizStuffLeft);
$("#right").on(isTouch, quizStuffRight);

///////////////////////////////////// QUIZ /////////////////////////////////////

//Give the games list a margin based on width/height ratio
function gamesListResize(){
	if(w/h < 1.35) {
		var adjustedLeft = (1.35 - (w/h)) * 85;
		TweenMax.set($('#list-holder'), {left: adjustedLeft+'%', ease: bgEase});
		TweenMax.set($('.games-header-container'), {left: adjustedLeft+'%', ease: bgEase});
		TweenMax.set($('#btn-back-sky'), {left: adjustedLeft+'%', ease: bgEase});
	}
	else {
		TweenMax.set($('#list-holder'), {left:'0%', ease: bgEase});
		TweenMax.set($('.games-header-container'), {left:'0%', ease: bgEase});
		TweenMax.set($('#btn-back-sky'), {left:'0%', ease: bgEase});
	}
}

function quizItemClicked(){
	var index = $quizItems.index(this);
	currentCat = $(this).attr('data-cat');
	switch(index){
		case 0:
			quizShowStuff();
		break;
		case 1:
			quizShowPlayers();
		break;
		case 2:
			quizShowWhere();
		break;
		case 3:
			if($(this).hasClass('active')){
				scrollToResults();
			} else {
				playFinishQuiz();
			}
			return false;
		break;
		case 4:
		return false;
		break;
	}
	TweenMax.staggerTo($quizItems, 0.5, {scale: 0, ease: Back.easeIn}, 0.1);
	TweenMax.to($quizAnswers, 0.7, {scale: 1, ease: Back.easeOut, delay: 0.7});
}

// Shows the "please finish all questions" message for 2 sec
function playFinishQuiz()
{
	window.clearTimeout(completeMessageTimeout);
	$('.play-btn').css({backgroundPosition:'0px 100%'});
	completeMessageTimeout = window.setTimeout(function(){ $('.play-btn').css({backgroundPosition:'0px 0px'}); }, 2000);
}

// Show quiz stuff panel
function quizShowStuff(){
	tracking.call('what');
	$ansHolder.attr("class", "stuff");
	$ansHeader.attr("class", "head-stuff");
	$quizAnswers.addClass('blue');
	$closeAnsBtn.addClass('blue');
	$('#select-btn').show();
	$('#page-turner').show();
	if(coming){
		coming.kill();
		going.kill();
		//$('.image.active').html('').removeClass('active');
	}
	for(i=1;i<divided+1;i++){
		$ansHolder.append('<div class="page page-'+i+'"></div>');
	}

	for (i=0;i<stuff.length;i++){
		var div = Math.floor(i/8)+1;
		if(chosenStuff.indexOf(stuff[i])!=-1){//it is selected
			$('#answers .page.page-'+div).append('<div id="'+stuff[i]+'" class="answer selected" data-id="'+stuff[i]+'"><div class="icon"><img src="img/stuff/'+stuff[i]+'.png"/></div><div class="title">'+deDash(stuff[i])+'</div></div>');
		}else {
			$('#answers .page.page-'+div).append('<div id="'+stuff[i]+'" class="answer" data-id="'+stuff[i]+'"><div class="icon"><img src="img/stuff/'+stuff[i]+'.png"/></div><div class="title">'+deDash(stuff[i])+'</div></div>');
		}
	}

	$('.arrow#left').hide();
	$('.arrow#right').show();
}

// Show quiz players panel
function quizShowPlayers(){
	tracking.call('how');
	$quizAnswers.addClass('how');
	$ansHolder.attr("class", "players");
	$ansHeader.attr("class", "head-players");
	for (i=0; i<players.length; i++){
		$ansHolder.append('<div class="answer" data-id="'+players[i]+'"><div class="icon"><img src="img/players/'+players[i]+'.png"/></div></div>');
	}
}

// Show quiz where panel
function quizShowWhere(){
	tracking.call('where');
	$quizAnswers.addClass('where');
	$ansHolder.attr("class", "where");
	$ansHeader.attr("class", "head-where");
	for(i=0; i<where.length; i++){
		if(i == 3)
			$ansHolder.append('<div class="clear"></div>');
			$ansHolder.append('<div id="'+where[i]+'" class="answer" data-id="'+where[i]+'"><div class="icon"><img src="img/where/'+where[i]+'.png"/></div><div class="title">'+deDash(where[i])+'</div></div>');
	}
}
$('.arrow#left').hide();

$('#pages').html('<span>1</span> / ' + divided);
// Left arrow on quiz stuff window
function quizStuffLeft(){
	page--;
	if(page < 0) {
		page=divided-1;
		$('.arrow#right').hide();
		$('.arrow#left').show();
	} else if (page == 0){
		$('.arrow#right').show();
		$('.arrow#left').hide();
	} else {
		$('.arrow#left').show();
		$('.arrow#right').show();
	}
	var thisPage = $('.page').eq(page);
	TweenMax.to(thisPage.siblings(), 0.3, {left: "10%", opacity: 0, display: "none", ease: Power2.easeIn});
	TweenMax.set(thisPage, {left: "-10%", opacity: 0});
	TweenMax.to(thisPage, 0.3, {left: "0%", opacity: 1, display: "block", delay: 0.3});
	$('#pages span').html(page + 1);

}

// Right arrow on quiz stuff window
function quizStuffRight(){
	page++;
	if (page==divided){
		page=0;
		$('.arrow#left').hide();
		$('.arrow#right').show();
	} else if (page == divided-1){
		$('.arrow#left').show();
		$('.arrow#right').hide();
	} else {
		$('.arrow#left').show();
		$('.arrow#right').show();
	}
	var thisPage = $('.page').eq(page);
	TweenMax.to(thisPage.siblings(), 0.3, {left: "-10%", opacity: 0, display: "none", ease: Power2.easeIn});
	TweenMax.set(thisPage, {left: "10%", opacity: 0});
	TweenMax.to(thisPage, 0.3, {left: "0%", opacity: 1, display: "block", delay: 0.3});
	$('#pages span').html(page + 1);


}

// Hide answers and show questions
function quizCloseAnswers(){
	tracking.call('landing');
	TweenMax.staggerTo($quizItems, 0.5, {scale: 1}, 0.2);
	TweenMax.to($quizAnswers, 0.5, {scale: 0, ease: Back.easeIn, onComplete:function(){
		$ansHolder.html('');
		$quizAnswers.removeClass('blue where how');
		$closeAnsBtn.removeClass('blue');
		$('#select-btn').hide();
		$('#page-turner').hide().find('#pages span').html('1');
		page=0;
		if($(this).hasClass('blue')){
			$('.stuffSprite').removeClass('stopAnimation');
		}
	}});
	if(currentCat=='stuff'){
		if(chosenStuff.length !=0){
			$('#'+currentCat+' .image').addClass('active').html('<img class="centered" src="img/stuff/'+chosenStuff[0]+'.png"/>');
			for(i=1;i<chosenStuff.length;i++){
				$('#'+currentCat+' .image').append('<img src="img/stuff/'+chosenStuff[i]+'.png"/>');
			}
			if(chosenStuff.length>1){
				currentImg =-1;
				$('#stuff').addClass('stopAnimation');
				rotateImages();
			}
			//$('.play-btn').addClass('active');
		}else {
			$('#stuff').removeClass('stopAnimation').children('.image').html('').removeClass('active');
		}
	}
	if(chosenStuff !='' || chosenWhere !='' || chosenPlayers !=''){
		$('.reset-btn').addClass('active');
	}
	if(chosenStuff.length !=0 && chosenWhere !=false && chosenPlayers !=false){
		//console.log(chosenStuff.length);
		//console.log(chosenWhere);
		$('.play-btn').addClass('active');
	}
}
var currentImg =-1;
function rotateImages(){
	currentImg++;
	if(currentImg > chosenStuff.length-1){
		currentImg=0;
	}
	nextImg = currentImg+1;
	if(nextImg == chosenStuff.length){
		nextImg=0;
	}
	coming=	TweenMax.to($('.image img').eq(nextImg),0.6,{left:'0%',opacity:1, delay:1.5, ease:Power2.easeOut});
	going = TweenMax.to($('.image img').eq(currentImg),0.6,{left:'-82%',opacity:0, delay:1.2, ease:Power2.easeIn, onComplete:function(){
		$('.image img').eq(currentImg).removeClass('centered').removeAttr('style');
		rotateImages();
	}});
}
///////////////////////////////////// MAIN SECTIONS /////////////////////////////////////
$("#btn-back-sky").on(isTouch, function(){
	tracking.call('landing');
	scrollToQuiz();
});
$("#btn-back-slide").on(isTouch, closeGameSlide);
$("#btn-back-slide-tmnt").on(isTouch, closeTMNTGameSlide);
$("#btn-back-slide-starplayer").on(isTouch, function(){
	trackLanding();
	closeStarPlayer();
});
$("#logo").on(isTouch, returnToLanding);
$("#starplayer-btn").on(isTouch, showStarPlayer);
$("#random-btn").on(isTouch, function() {
	randomGame();
});
$("#close-starplayer").on(isTouch, function(){
	trackLanding();
	closeStarPlayer();
});
$("#tmnt-btn").on(isTouch, showTMNT);
$("#btn-back-tmnt").on(isTouch, function(){
	trackLanding();
	closeTMNT();
});
$("#gallery-btn").on(isTouch, showGallery);
$("#btn-back-games").on(isTouch, function(){
	trackLanding();
	closeGallery();
});

//Use this to track a return to landing where the play page might be open
function trackLanding() {
	if(contentScrolled) {
		tracking.call('play');
	}
	else if(currentCat == 'stuff') {
		tracking.call('what');
	}
	else if(currentCat == 'players') {
		tracking.call('how');
	}
	else if(currentCat == 'where') {
		tracking.call('where');
	}
	else {
		tracking.call('landing');
	}
}

var bgEase = Power2.easeInOut;

function scrollToResults(){
	contentScrolled = true;
	TweenMax.to($('#content'), 1, {left: w-contentW, ease: bgEase});

	TweenMax.to($('#games-list'), 1, {left:'47%', ease: bgEase});
	TweenMax.to($('#kids-jump'), 0.8, {left:'20%', ease: bgEase});

	if( tracking.platform == "tablet" ) {
		TweenMax.to($('#games-list'), 1, {left:'46%', ease: bgEase});
		// TweenMax.to($('#games-list .header'), 1, {left:'27%', ease: bgEase});
		TweenMax.to($('#kids-jump'), 0.8, {left:'18%', ease: bgEase});
	}

	TweenMax.to($('#quiz'), 1, {left:'-40%', ease: bgEase});
	TweenMax.to($('#kid-tube'), 1, {left:'36%', ease: bgEase});
	TweenMax.to($('#btn-back-sky'), 1, {top:'-26%', ease: bgEase});
	TweenMax.to($('#capri-co'), 1, {marginRight: "-34%", ease: bgEase});

	populateResults();
	gamesListResize();
}
function scrollToQuiz(){
	contentScrolled = false;
	TweenMax.to($('#content'), 1, {left:'18%', ease: bgEase});
	TweenMax.to($('#games-list'), 1, {left:'100%', ease: bgEase});
	TweenMax.to($('#quiz'), 1, {left:'2%', ease: bgEase});
	TweenMax.to($('#kid-tube'), 1, {left:'48%', ease: bgEase});
	TweenMax.to($('#kids-jump'), 1, {left:'44%', ease: bgEase});
	TweenMax.to($('#btn-back-sky'), 1, {top:'-55%', ease: bgEase});
	TweenMax.to($('#capri-co'), 1, {marginRight: "0%", ease: bgEase});
	TweenMax.to($('.header-choose'), 1, {left:'0%', ease: bgEase});
	TweenMax.to($('.header-more'), 1, {left: moreHeaderIndent+'%', ease: bgEase});
}

// Show/hide game detail slide
function showGameSlide(id, track){
	gameSlideOut = true;
	$('#gallery .scrollable').addClass('noscroll');
	currGameID = id;
	gameObj = games[id-1];
	if(!track) {
		tracking.call('games/game'+formatID(id));
	}

	$('#game-slide .needs .object').remove();
	$('#game-slide .instructions .instruct').remove();

	$('#game-slide .needs .inside').html("");
	$('#game-slide .title').html(gameObj.title);
	$('#game-slide .big-desc').html(gameObj.desc);
	for(i=0;i<gameObj['stuff'].length;i++){
		if(gameObj['stuffTxt'][i] == 'none') {
			continue;
		}
		$('#game-slide .needs .inside').append('<div class="object"><div class="icon"><img src="img/stuff/'+gameObj['stuffTxt'][i]+'.png"/></div><div class="text">'+deDash(gameObj["stuff"][i])+'</div></div>');
	}
	// for(i=0;i<gameObj['setup'].length;i++){
	// 	$('#game-slide .instructions .inside').eq(0).append('<div class="instruct"><div class="asterisk"></div><div class="text">'+gameObj["setup"][i]+'</div></div>');
	// }
	for(i=0;i<gameObj['instructions'].length;i++){
		$('#game-slide .instructions .inside').eq(1).append('<div class="instruct"><div class="text">'+gameObj["instructions"][i]+'</div></div>');
	}
	var playerString = parseInt(gameObj["players"]) > 1 ? ' players</div></div>' : ' player</div></div>';
	$('#game-slide .needs .inside').append('<div class="object"><div class="icon no-bg"><img src="img/featured/players.png"/></div><div class="text">'+gameObj["players"]+playerString);
	// Add where to play
	$('#game-slide .needs .inside').append("<div class='header-2'></div>");
	for(i=0; i<gameObj['where'].length; i++){
		$('#game-slide .needs .inside').append('<div class="object"><div class="icon no-bg"><img src="img/where/'+gameObj['where'][i]+'.png"/></div><div class="text">'+capFirst(gameObj["where"][i])+'</div></div>');
		if(i < gameObj['where'].length - 1){
			$('#game-slide .needs .inside').append('<div class="or-divider"></div>');
		}
	}

	TweenMax.to($('#game-slide'), 1, {right:'0%', ease: bgEase});
	loadPrint(id);
}
function closeGameSlide(){
	if(gameSlideOut){
		$('#gallery .scrollable').removeClass('noscroll');
		if(galleryOpen){
			tracking.call('games');
		}else if(starPlayerOpen) {
			tracking.call('star');
		}else if(contentScrolled) {
			tracking.call('play');
		}
		$('#no').trigger(isTouch);
		TweenMax.to($('#game-slide'), 1, {ease: bgEase, right:'-80%' ,onComplete:function(){
			$('#game-slide .needs .object').remove();
			$('#game-slide .instructions .instruct').remove();
			$('#get-game-btn').hide();
		}});

		gameSlideOut = false;
	}
}

// Show/hide game detail slide
function showTMNTGameSlide(id){
	gameSlideOutTMNT = true;
	$('#gallery .scrollable').addClass('noscroll');
	currGameID = id;
	gameObj = gamesTMNT[id-1];
	tracking.call('tmnt/game'+formatIDTMNT(id));

	$('#game-slide-tmnt .needs .inside').html("");
	$('#game-slide-tmnt .title').html(gameObj.title);
	$('#game-slide-tmnt .big-desc').html(gameObj.desc);
	for(i=0;i<gameObj['stuff'].length;i++){
		if(gameObj['stuffTxt'][i] == 'none') {
			continue;
		}
		$('#game-slide-tmnt .needs .inside').append('<div class="object"><div class="icon"><img src="img/stuff/'+gameObj['stuffTxt'][i]+'.png"/></div><div class="text">'+deDash(gameObj["stuff"][i])+'</div></div>');
	}
	// for(i=0;i<gameObj['setup'].length;i++){
	// 	$('#game-slide .instructions .inside').eq(0).append('<div class="instruct"><div class="asterisk"></div><div class="text">'+gameObj["setup"][i]+'</div></div>');
	// }
	for(i=0;i<gameObj['instructions'].length;i++){
		$('#game-slide-tmnt .instructions .inside').eq(1).append('<div class="instruct"><div class="text">'+gameObj["instructions"][i]+'</div></div>');
	}
	var playerString = parseInt(gameObj["players"]) > 1 ? ' players</div></div>' : ' player</div></div>';
	$('#game-slide-tmnt .needs .inside').append('<div class="object"><div class="icon no-bg"><img src="img/featured/players.png"/></div><div class="text">'+gameObj["players"]+playerString);
	// Add where to play
	$('#game-slide-tmnt .needs .inside').append("<div class='header-2'></div>");
	for(i=0; i<gameObj['where'].length; i++){
		$('#game-slide-tmnt .needs .inside').append('<div class="object"><div class="icon no-bg"><img src="img/where/'+gameObj['where'][i]+'.png"/></div><div class="text">'+capFirst(gameObj["where"][i])+'</div></div>');
		// if(i < gameObj['where'].length - 1){
		// 	$('#game-slide-tmnt .needs .inside').append('<div class="or-divider"></div>');
		// }
	}

	TweenMax.to($('#game-slide-tmnt'), 1, {right:'0%', ease: bgEase});
	loadTMNTPrint(id);
}
function closeTMNTGameSlide(){
	if(gameSlideOutTMNT){
		$('#gallery .scrollable').removeClass('noscroll');
		tracking.call('tmnt');
		$('#no').trigger(isTouch);
		TweenMax.to($('#game-slide-tmnt'), 1, {ease: bgEase, right:'-83%' ,onComplete:function(){
			$('#game-slide-tmnt .needs .object').remove();
			$('#game-slide-tmnt .instructions .instruct').remove();
			refreshTMNTPagination();
		}});
		gameSlideOutTMNT = false;
	}
}

// Show/hide Star Player game panel
function showStarPlayer(){
	if(starPlayerOpen){
		return;
	}
	tracking.call('star');
	tracking.pause();
	TweenMax.to($('#starplayer-gallery'), 1, {left:'0%', ease: bgEase});
	$(this).addClass('active');
	$('#starplayer-gallery .share-co').fadeIn(500);
	$('#starplayer-gallery .close-btn').fadeIn(500);
	starPlayerOpen = true;

	if(tmntOpen){
		closeTMNT();
	}
	if(galleryOpen){
		closeGallery();
	}
	if(gameSlideOut){
		closeGameSlide();
	}
	if(gameSlideOutTMNT){
		closeTMNTGameSlide();
	}
	tracking.unpause();
}
function closeStarPlayer(){
	TweenMax.to($('#starplayer-gallery'),1,{left:starPlayerGalleryLeft+'%', ease: bgEase, onComplete:function(){
	}});
	$('.share-co').fadeOut(500);
	$('#starplayer-btn').removeClass('active');
	starPlayerOpen = false;
		$('#no').trigger(isTouch);
}

// Show/hide tmnt gallery panel
function showTMNT(){
	if(tmntOpen){
		return;
	}
	tracking.call('tmnt');
	tracking.pause();

	populateTMNTGames();

	refreshTMNTPagination();

	TweenMax.to($('#tmnt-gallery'),1,{left:'0%', ease: bgEase});
	TweenMax.to($('#tmnt-btn .turtles'), 1, {top: "70%", ease: bgEase, onComplete: refreshTMNTPagination});
	$('#tmnt-btn .logo').addClass('active');
	$('#tmnt-gallery .share-co').fadeIn(500);
	$('#tmnt-gallery .close-btn').fadeIn(500);
	tmntOpen = true;

	if(galleryOpen){
		closeGallery();
	}
	if(starPlayerOpen){
		closeStarPlayer();
	}
	if(gameSlideOut){
		closeGameSlide();
	}
	if(gameSlideOutTMNT){
		closeTMNTGameSlide();
	}
	tracking.unpause();
}
function closeTMNT(){
	TweenMax.to($('#tmnt-gallery'), 1, {left: '-85%', ease: bgEase, onComplete:function(){
		$('#tmnt-gallery .scroll-inner').scrollTo(0,10);
	}});
	TweenMax.to($('#tmnt-btn .turtles'), 1, {top: "0%", ease: bgEase});
	$('#tmnt-btn .logo').removeClass('active');
	$('.share-co').fadeOut(500);

	tmntOpen = false;
}

// Show/hide game gallery panel
function showGallery(){
	if(galleryOpen){
		return;
	}
	tracking.call('games');
	tracking.pause();

	TweenMax.to($('#gallery'),1,{left:'0%', ease: bgEase});
	$(this).addClass('active');
	$('#gallery .share-co').fadeIn(500);
	$('#gallery .close-btn').fadeIn(500);
	galleryOpen = true;

	if(tmntOpen){
		closeTMNT();
	}
	if(starPlayerOpen){
		closeStarPlayer();
	}
	if(tmntOpen){
		closeTMNT();
	}
	if(gameSlideOut){
		closeGameSlide();
	}
	if(gameSlideOutTMNT){
		closeTMNTGameSlide();
	}
	tracking.unpause();
}
function closeGallery(){
	TweenMax.to($('#gallery'), 1, {left: galleryLeft+'%', ease: bgEase, onComplete:function(){
		$('#gallery .scroll-inner').scrollTo(0,10);
	}});
	$('#gallery-btn').removeClass('active');

	galleryOpen = false;

}

function returnToLanding(){
	tracking.pause();

	if(tmntOpen){
		closeTMNT();
	}
	if(gameSlideOut){
		closeGameSlide();
	}
	if(gameSlideOutTMNT){
		closeTMNTGameSlide();
	}
	if(contentScrolled){
		scrollToQuiz();
	}
	if(starPlayerOpen){
		closeStarPlayer();
	}
	if(galleryOpen){
		closeGallery();
	}

	tracking.unpause();

	trackLanding();
}

///////////////////////////////////// PAGINATION /////////////////////////////////////
var $listHolder = $("#list-holder");
var $btnPagPrev	= $("#pag-prev").on(isTouch, movePagPrev);
var $btnPagNext	= $("#pag-next").on(isTouch, movePagNext);
var $gameList;
var pagNo = 0;
var moreHeaderIndent = 27;

var $tmntListHolder = $("#tmnt-list-holder");
var $tmntGameList;
var $btnPagPrevTMNT	= $("#pag-prev-tmnt").on(isTouch, movePagPrevTMNT);
var $btnPagNextTMNT	= $("#pag-next-tmnt").on(isTouch, movePagNextTMNT);
var pagNoTMNT = 0;

function populateResults(){

	function descendingPlayers(playerA, playerB) {
		return parseInt(playerB.players) - parseInt(playerA.players);
	}

	var itemMatch = [];
	var exactMatch = [];
	var noMatch = [];
	for(i=0; i < games.length; i++) {
		if(games[i].stuffTxt.indexOf(chosenStuff[0])!=-1){
			if(games[i].players <= parseInt(chosenPlayers)) {
				exactMatch.push(games[i]);
			}
			else {
				itemMatch.push(games[i]);
			}
		}
		else {
			if(games[i].players <= parseInt(chosenPlayers)) {
				noMatch.push(games[i]);
			}
		}
	}
	if(exactMatch.length > 0) {
		exactMatch = exactMatch.sort(descendingPlayers);
	}
	if(itemMatch.length > 0) {
		itemMatch = itemMatch.sort(descendingPlayers);
	}
	itemMatch = exactMatch.concat(itemMatch);
	noMatch = noMatch.sort(descendingPlayers);

	moreHeaderIndent = (Math.ceil(itemMatch.length / 2) * gameColumnWidth);

	tracking.call('play');
	$listHolder.html('');

	appendGames(itemMatch, $listHolder, "game", 0);
	if(itemMatch.length % 2 != 0) {
		$("<div>",{
			class: "game",
			css: {display: "none"}
		}).appendTo($listHolder);
	}
	appendGames(noMatch, $listHolder, "game more-games", Math.ceil(itemMatch.length / 2));
	$('#games-list .header-more').css({left: moreHeaderIndent + "%"});

	$listHolder.find(".title").fitText(1.2);
	$listHolder.find(".desc").fitText(1.7);
	$gameList = $listHolder.find(".game");	// Re-assign contents of $gameList
	pagNo = 0;
	TweenMax.set($btnPagPrev, {scale:0});
	TweenMax.set($btnPagNext, {scale:1});

	if(itemMatch.length + noMatch.length > 6 ||
		(itemMatch.length + noMatch.length == 6 && itemMatch.length == 3)){
		$(".pagination").show();
	}else{
		$(".pagination").hide();
	}
}

function appendGames(gamesArray, $listHolder, classes, columnIndent) {
	for (var i = 0; i < gamesArray.length; i++){
		var content = '<div class="title">' + gamesArray[i].title + '</div>';
		content += '<div class="desc">'+gamesArray[i].desc+'</div>';
		content += '<div class="objects"></div><div class="players"><span>'+gamesArray[i].players+'+</span></div>';
		content += '<div class="overlay"><div class="view-btn"></div><div class="print-btn"></div></div>';

		// Construct game div
		var thisGame = $("<div>",{
			class: classes,
			'data-game':gamesArray[i].gameID,
			mouseenter: listMouseOn,
			mouseleave: listMouseOff,
			html: content,
			css: {top: (i % 2 * 50) + "%", left: ((columnIndent + Math.floor(i / 2)) * gameColumnWidth) + "%"}
		}).appendTo($listHolder);
		if(gamesArray[i]['stuff'].length >4){
			var length =4;
		}else {
			var length = gamesArray[i]['stuff'].length;
		}
		for(var j = 0; j < length; j++){
			thisGame.find(".objects").append('<div class="object"><img src="img/stuff/'+gamesArray[i]["stuffTxt"][j]+'.png" /><div class="text">'+deDash(gamesArray[i]["stuff"][j])+'</div></div>');
		}
	}
}

function populateTMNTGames() {
	var results = [];
	var nowTime = (new Date()).getTime();

	for(i=0; i < gamesTMNT.length; i++) {
		if(nowTime > Date.parse(gamesTMNT[i].date)) {
			if(!gamesTMNT[i].dateLimit || nowTime < Date.parse(gamesTMNT[i].dateLimit)) {
				results.push(gamesTMNT[i]);
			}
		}
	}

	$tmntListHolder;
	$tmntListHolder.html('');
	for (var i = 0; i < results.length; i++){
		if(results[i].imageTile) {
			var content = '<div class="tmnt-image-tile" style="background-image: url(' + results[i].imageTile + ')"></div>';
			content += '<div class="tmnt-image-frame"></div>';

			// Construct game div
			var thisGame = $("<div>",{
				class: "game",
				'data-game':results[i].gameID,
				html: content,
				css: {top: (i % 2 * 48) + "%", left: (Math.floor(i / 2) * gameColumnWidthTMNT) + "%", 'background-image': 'none'}
			}).appendTo($tmntListHolder);
		}
		else {
			var content = '<div class="title">' + results[i].title + '</div>';
			content += '<div class="desc">'+results[i].desc+'</div>';
			content += '<div class="players"><span>'+results[i].players+'+</span></div>';
			content += '<div class="overlay"><div class="tmnt-view-btn"></div><div class="tmnt-print-btn"></div></div>';

			// Construct game div
			var thisGame = $("<div>",{
				class: "game",
				'data-game':results[i].gameID,
				mouseenter: listMouseOn,
				mouseleave: listMouseOff,
				html: content,
				css: {top: (i % 2 * 48) + "%", left: (Math.floor(i / 2) * gameColumnWidthTMNT) + "%"}
			}).appendTo($tmntListHolder);
			if(results[i]['stuff'].length >4){
				var length =4;
			}else {
				var length = results[i]['stuff'].length;
			}
			for(var j = 0; j < length; j++){
				thisGame.find(".objects").append('<div class="object"><img src="img/stuff/'+results[i]["stuffTxt"][j]+'.png" /><div class="text">'+deDash(results[i]["stuff"][j])+'</div></div>');
			}
		}
	}
	$tmntListHolder.find(".title").fitText(1.2);
	$tmntListHolder.find(".desc").fitText(1.7);
	$tmntGameList = $tmntListHolder.find(".game");	// Re-assign contents of $gameList
	pagNoTMNT = 0;
	TweenMax.set($btnPagPrevTMNT, {scale:0});
	TweenMax.set($btnPagNextTMNT, {scale:1});
}

function numItemMatches(game)
{
	var match = 0;
	for(x=0;x<chosenStuff.length;x++){
		if(game.stuff.indexOf(chosenStuff[x])!=-1){
			match++;
		}
	}
	return match;
}

function sortGamesByPlayers(gameArray)
{
	var outputArray = [];

	// Find the exact number of players match
	for(i=0; i < gameArray.length; i++)
	{
		if(gameArray[i].players == parseInt(chosenPlayers))
		{
			outputArray.push(gameArray[i]);
		}
	}
	// Find players -1
	for(i=0; i < gameArray.length; i++)
	{
		if(gameArray[i].players == parseInt(chosenPlayers) - 1)
		{
			outputArray.push(gameArray[i]);
		}
	}
	// Find players +1
	for(i=0; i < gameArray.length; i++)
	{
		if(gameArray[i].players == parseInt(chosenPlayers) + 1)
		{
			outputArray.push(gameArray[i]);
		}
	}
	// Find players -2
	for(i=0; i < gameArray.length; i++)
	{
		if(gameArray[i].players == parseInt(chosenPlayers) - 2)
		{
			outputArray.push(gameArray[i]);
		}
	}
	// Find players +2
	for(i=0; i < gameArray.length; i++)
	{
		if(gameArray[i].players == parseInt(chosenPlayers) + 2)
		{
			outputArray.push(gameArray[i]);
		}
	}
	// Find any other number less than 2
	for(i=0; i < gameArray.length; i++)
	{
		if(gameArray[i].players < parseInt(chosenPlayers) - 2)
		{
			outputArray.push(gameArray[i]);
		}
	}

	return outputArray;
}

function listMouseOn(){
	TweenMax.to($(this).find(".overlay"), 0.3, {opacity: 1});
	TweenMax.to($(this).find(".view-btn"), 0.4, {width: "80%", ease: Power2.easeIn});
	TweenMax.to($(this).find(".tmnt-view-btn"), 0.4, {width: "41%", ease: Power2.easeIn});
	TweenMax.to($(this).find(".print-btn"), 0.5, {width: "80%", ease: Power2.easeIn});
	TweenMax.to($(this).find(".tmnt-print-btn"), 0.5, {width: "41%", ease: Power2.easeIn});
}

function listMouseOff(){
	TweenMax.to($(this).find(".overlay"), 0.5, {opacity: 0});
	TweenMax.to($(this).find(".view-btn"), 0.3, {width: "0%"});
	TweenMax.to($(this).find(".tmnt-view-btn"), 0.3, {width: "0%"});
	TweenMax.to($(this).find(".print-btn"), 0.2, {width: "0%"});
	TweenMax.to($(this).find(".tmnt-print-btn"), 0.2, {width: "0%"});
}

// Moves to previous page if not busy
function movePagPrev(){
	pagNo --;

	if(pagNo < 0){
		pagNo = 0;
		return;
	}else if(pagNo == 0){
		TweenMax.to($btnPagPrev, 0.3, {scale:0});
	}
	var adj = (pagNo * 2) + 7;

	TweenMax.to($('.header-choose'), 0.5, {
		left: (-1 * pagNo * gameColumnWidth) + "%",
		ease: Power2.easeInOut,
		delay: 0
	});
	TweenMax.to($('.header-more'), 0.5, {
		left: (moreHeaderIndent - (pagNo * gameColumnWidth)) + "%",
		ease: Power2.easeInOut,
		delay: 0
	});

	$gameList.each(function(index, object){
		TweenMax.to($(object), 0.5, {
			left: ((Math.floor(index / 2) - pagNo) * gameColumnWidth) + "%",
			ease: Power2.easeInOut,
			delay: (adj - index) / 40
		});
	});

	TweenMax.to($btnPagNext, 0.3, {scale:1});
}

// Moves to next page if not busy
function movePagNext(){
	pagNo ++;
	// You've reached the end when pagNo is half the length of $gameList
	if(pagNo > Math.floor($gameList.length / 2) - 1){
		pagNo = Math.floor($gameList.length / 2) - 1;
		return;
	}else if(pagNo == Math.floor($gameList.length / 2) - 1){
		TweenMax.to($btnPagNext, 0.3, {scale:0});
	}

	TweenMax.to($('.header-choose'), 0.5, {
		left: (-1 * pagNo * gameColumnWidth) + "%",
		ease: Power2.easeInOut,
		delay: 0
	});
	TweenMax.to($('.header-more'), 0.5, {
		left: (moreHeaderIndent - (pagNo * gameColumnWidth)) + "%",
		ease: Power2.easeInOut,
		delay: 0
	});

	$gameList.each(function(index, object){
		TweenMax.to($(object), 0.5, {
			left: ((Math.floor(index / 2) - pagNo) * gameColumnWidth) + "%",
			ease: Power2.easeInOut,
			delay: (index - (pagNo*2)) / 40
		});
	});
	TweenMax.to($btnPagPrev, 0.3, {scale:1});
}

// Moves to previous page if not busy
function movePagPrevTMNT(){
	pagNoTMNT --;

	if(pagNoTMNT < 0){
		pagNoTMNT = 0;
		return;
	}else if(pagNoTMNT == 0){
		TweenMax.to($btnPagPrevTMNT, 0.3, {scale:0});
	}
	var adj = (pagNoTMNT * 2) + 7;

	$tmntGameList.each(function(index, object){
		TweenMax.to($(object), 0.5, {
			left: ((Math.floor(index / 2) - pagNoTMNT) * gameColumnWidthTMNT) + "%",
			ease: Power2.easeInOut,
			delay: (adj - index) / 40,
			onComplete: refreshTMNTPagination
		});
	});

	TweenMax.to($btnPagNextTMNT, 0.3, {scale:1});
}

// Moves to next page if not busy
function movePagNextTMNT(){
	pagNoTMNT ++;
	// You've reached the end when pagNo is half the length of $gameList
	if(pagNoTMNT > Math.floor($tmntGameList.length / 2) - 1){
		pagNoTMNT = Math.floor($tmntGameList.length / 2) - 1;
		return;
	}else if(pagNoTMNT == Math.floor($tmntGameList.length / 2) - 1){
		TweenMax.to($btnPagNextTMNT, 0.3, {scale:0});
	}

	$tmntGameList.each(function(index, object){
		TweenMax.to($(object), 0.5, {
			left: ((Math.floor(index / 2) - pagNoTMNT) * gameColumnWidthTMNT) + "%",
			ease: Power2.easeInOut,
			delay: (index - (pagNoTMNT*2)) / 40
		});
	});
	TweenMax.to($btnPagPrevTMNT, 0.3, {scale:1});
}

///////////////////////////////////// STAF /////////////////////////////////////
var $sOpen		= $("#btn-staf").hover(openSTAFOn, openSTAFOff).on(isTouch, openSTAF);
var $sSend 		= $("#staf-send").hover(sendSTAFOn, sendSTAFOff).on(isTouch, sendSTAF).on("keypress", sendSTAFKey);
var $sX 		= $("#staf-x").hover(closeBtnOn, closeBtnOff).on(isTouch,closeSTAF);
var $sField1	= $("#staf-1").on("keyup", validateNameSTAF).on("keydown", removeSpecialChars);
var $sField2	= $("#staf-2").on("keyup", validateNameSTAF).on("keydown", removeSpecialChars);
var $sField3	= $("#staf-3").on("keyup", validateEmailSTAF).on("keydown", removeEmailSpecialChars);
var sVal1 		= "";
var sVal2 		= "";
var sVal3 		= "";
var stafOpen = false;

function openSTAFOn(){
	TweenMax.to($(this).find(".hover"), 0.5, {width: "100%", ease: bgEase});
}
function openSTAFOff(){
	if(!stafOpen){
		TweenMax.to($(this).find(".hover"), 0.5, {width: "0%", ease: bgEase});
	}
}

// Open STAF drawer
function openSTAF(){
	tracking.call('staf');
	if(!stafOpen){
		resetStaf();
		TweenMax.to($("#staf"), 1, {left: "15%", ease: bgEase});
		stafOpen = true;
	}
}

// Close STAF drawer
function closeSTAF(){
	//tracking.call('landing');
	TweenMax.to($sOpen.find(".hover"), 0.5, {width: "0%", ease: bgEase});
	TweenMax.to($("#staf"), 1, {left: "-30%", ease: bgEase});
	stafOpen = false;

}

// Send button event handlers
function sendSTAFOn(){
	if($(this).hasClass("active")){
		TweenMax.to($(this).find(".hover"), 0.5, {width: "100%", ease: bgEase});
	}
}
function sendSTAFOff(){
	TweenMax.to($(this).find(".hover"), 0.5, {width: "0%", ease: bgEase});
}
function sendSTAFKey(event){

	if(event.key == "Enter" || event.key == " "){

		sendSTAF();
	}
}
function sendSTAF(){
	$(document).scrollTo(0,0);

	if(sVal1 && sVal2 && sVal3){
		$(".field").hide();
		TweenMax.to($sSend, 0.5, {scale: 0, ease: bgEase});

		var params = {
			"your_first_name" : sVal1,
			"friend_first_name" : sVal2,
			"friend_email" : sVal3,
			"platform" : pages.platform
		};

		var sweepsPost = $.ajax({
			url: "https://web.archive.org/web/20161019151532/http://funnel.mtvnservices.com/api/v2/nick.com/collections/capri_sun_staf_2016/entries.json",
			type: "POST",
			data: params
		});

		// Success
		sweepsPost.done(function(jqXHR, textStatus){
			tracking.call('staf/complete');
			$("#share-result").show().addClass("success");
			if(pages.platform=='tablet'){
				$('body').addClass('tablet');
			}
			window.setTimeout(closeSTAF, 2000);
		});

		// Failure
		sweepsPost.fail(function(jqXHR, textStatus){
			$("#share-result").show().removeClass("success");
			console.log(jqXHR);
			console.log(textStatus);

			window.setTimeout(closeSTAF, 2000);
		});

		TweenMax.set($sSend, {scale: 1});
		TweenMax.set($sSend.find(".text"), {width: "0%"});

	}else{
		if(!sVal1){
			validateNameSTAF.call($sField1[0]);
		}
		if(!sVal2){
			validateNameSTAF.call($sField2[0]);
		}
		if(!sVal3){
			validateEmailSTAF.call($sField3[0]);
		}
		$sSend.removeClass("active");
	}
}

// Validates name (and tests button) on STAF form
function validateNameSTAF(){
	// Remove whitespaces, and non-alpha chars
	var entry = $(this).val().replace(/\s+/g, '');

	if(entry.length == 0){
		$(this).parent().addClass("error");
		switch(this.id){
			case "staf-1":
				$(this).attr("placeholder", "ENTER YOUR FIRST NAME");
				sVal1 = "";
			break;
			case "staf-2":
				$(this).attr("placeholder", "ENTER YOUR FRIEND'S NAME");
				sVal2 = "";
			break;
		}
	}else{
		$(this).parent().removeClass("error");
		switch(this.id){
			case "staf-1":
				$(this).attr("placeholder", "YOUR FIRST NAME");
				sVal1 = entry;
			break;
			case "staf-2":
				$(this).attr("placeholder", "YOUR FRIEND'S FIRST NAME");
				sVal2 = entry;
			break;
		}
	}

	enableSTAFSend();
}

// Validates email (and tests button) on STAF form
function validateEmailSTAF(event){
	var entry = $(this).val();
	var valid = emailRegex(entry);
	// $(this).val(entry);

	if(!valid){
		$(this).parent().addClass("error");
		$(this).attr("placeholder", "ENTER YOUR FRIEND'S EMAIL");
		sVal3 = "";
	}else{
		$(this).parent().removeClass("error");
		$(this).attr("placeholder", "YOUR FRIEND'S EMAIL");
		sVal3 = entry;
	}

	enableSTAFSend();
}

// Checks if sweepstakes Send button should be enabled
function enableSTAFSend(){
	if(sVal1 && sVal2 && sVal3){
		TweenMax.to($sSend.find(".text"), 0.5, {width: "100%", ease: bgEase});
		$sSend.addClass("active");
	}else{
		TweenMax.to($sSend.find(".text"), 0.5, {width: "0%", ease: bgEase});
		TweenMax.to($sSend.find(".hover"), 0.5, {width: "0%", ease: bgEase});
		$sSend.removeClass("active");
	}
}

function resetStaf(){
	TweenMax.set($sSend, {scale: 1});
	TweenMax.set($sSend.find(".text"), {width: "0%"});
	$sField1.val("").parent().show().removeClass("error");
	$sField2.val("").parent().show().removeClass("error");
	$sField3.val("").parent().show().removeClass("error");
	sVal1 = "";
	sVal2 = "";
	sVal3 = "";
	$("#share-result").hide();
}

///////////////////////////////////// FEATURED /////////////////////////////////////
$("#gallery .close-btn").hover(closeBtnOn, closeBtnOff);
$("#answer-close-btn").hover(closeBtnOn, closeBtnOff);
if(!isTouch) $(".back-btn").hover(paintBtnOn, paintBtnOff);

///////////////////////////////////// GALLERY /////////////////////////////////////
// Populates New This Week section in Games Gallery
var today;
var weekIndex;
function newThisWeek(){
	//today = new Date("2015-08-09").getTime(); 	// Arbitrary date for testing
	today = new Date().getTime(); 					// Today's date
	var weekStart;
	var weekEnd;
	weekIndex = 0;

	// Loop through weeks until today lands within week
	$.each(dates.weeks, function(index, week){
		weekStart = new Date(week.start).getTime();
		weekEnd = new Date(week.end).getTime();


		if(today >= weekStart && today <= weekEnd){
			weekIndex = index;
			return false;
		}
	});
	weekIndex = 15;

	// Loop through gameIDs in this week, and populate week section in gallery.
	if(dates.weeks[weekIndex].gameIDs != 0){
		$.each(dates.weeks[weekIndex].gameIDs, function(index, gameID){
			var gameIndex = gameID - 1;	// Because gameID is 1-based, and array is 0-based
			if(games[gameIndex]){
				$('.games#new').append('<div class="game" data-game="'+games[gameIndex].gameID+'"><div class="title">'+games[gameIndex].title+'</div><div class="desc">'+games[gameIndex].desc+'</div><div class="players"><span>'+games[gameIndex].players+'+</span></div><div class="category"><img src="img/gallery/cat-'+games[gameIndex].type+'.png"/></div><div class="drip"></div><div class="hover"><div class="bg"></div><div class="view-btn"></div><div class="print-btn"></div></div></div>');
			}
		});
		for(i=0;i<dates.weeks[weekIndex].gameIDs.length;i++){
			//var index = dates.weeks[weekIndex].gameIDs[i]
			//console.log(index);
			//galleryArray.splice(index,1);
		}
		$("#gallery .week-title").html(dates.weeks[weekIndex].title);
		$('.games#new').append('<div class="clear"></div>');
		$("#weekly").attr("class", "wk-" + weekIndex);
	}else {
		$('#gallery').addClass('hide-featured');
	}

}
function loadGallery(){
	$('.games#all').html('');
	for(i=0;i<galleryArray.length; i++){
		var where ='';
		for(x=0;x<galleryArray[i].where.length;x++){
			where+=galleryArray[i].where[x]+',';
		}

		if(dates.weeks[weekIndex].gameIDs.indexOf(galleryArray[i].gameID)==-1)
		$('.games#all').append('<div class="game" data-game="'+galleryArray[i].gameID+'" data-players="'+galleryArray[i].players+'" data-where="'+where+'"><div class="title">'+galleryArray[i].title+'</div><div class="desc">'+galleryArray[i].desc+'</div><div class="players"><span>'+galleryArray[i].players+'+</span></div><div class="category"><img src="img/gallery/cat-'+galleryArray[i].type+'.png"/></div><div class="hover"><div class="bg"></div><div class="view-btn"></div><div class="print-btn"></div></div></div>');
		//console.log(galleryArray[i].gameID);
	}
	$('.games#all').append('<div class="clear"></div>');
}
function sortByABC(){
	galleryArray.sort(function(a,b){
		 var x = a.title.toLowerCase();
	    var y = b.title.toLowerCase();
	    return x < y ? -1 : x > y ? 1 : 0;
	});
	loadGallery();
}
function sortByMinPlayers(){
	galleryArray.sort(function(a,b){
		 var x = a.players;
	    var y = b.players;
	    return x-y;
	});
	loadGallery();
}
function sortByMaxPlayers(){
	galleryArray.sort(function(a,b){
		var x = a.players;
	    var y = b.players;
	    return y-x;
	});
	loadGallery();
}
function sortByNewest(){
	galleryArray.sort(function(a,b){
		var x = a.gameID;
	    var y = b.gameID;
	    return y-x;
	});
	loadGallery();
}
function resetSort(){
	galleryArray = games.slice(0);
	loadGallery();
}
///////////////////////////////////// OTHER /////////////////////////////////////
function checkScrolling(){
	contH = $('#gallery').innerHeight();
 	slideH = $('.inner').innerHeight();
 	fadeH = $('#fade').height();
 	topBound = contH - slideH-fadeH;
 	if(topBound > 0 )
 		topBound = 0;
}
function checkScrolling2($div){
	contH = $div.innerHeight();
	//console.log($div.find('.instructions').position().top);
 	slideH = $div.find('.instructions').height()+ ($div.find('.instructions').position().top*2);
 	topBound = contH - slideH;
 	if(topBound > 0 )
 		topBound = 0;
}

var contentW;
function setSize(){
	if( Math.ceil((h-28)*2.03507462686567) > Math.ceil(w-w*0.14)){
		contentW = Math.ceil((h-28)*2.03507462686567);
	}else {
		contentW = Math.ceil(w-w*0.14);
	}
	if(!tablet) {
		$('#content').css({width:contentW});
		$('#tmnt-list-holder').css({width:contentW});
	} else {
		$('#content').css({width:1400});
		$('#tmnt-list-holder').css({width:1400});
	}

	refreshTMNTPagination();

	if(contentScrolled){
		$('#content').css({left:w-contentW});
	}
	$('#main').fitText(3.6);
	$('#left-bar .inside').css({height:h-28});
	// if(!starPlayerOpen)
	// 	starPlayerGalleryLeft = ($('#starplayer-gallery').position().left/w)*100;
	// if(!tmntOpen)
	// 	starPlayerGalleryLeft = ($('#tmnt-gallery').position().left/w)*100;
	if(!galleryOpen)
		galleryLeft= ($('#gallery').position().left/w)*100;
	if(!contentScrolled)
		contentLeft =($('#content').position().left/w)*100;
}

function refreshTMNTPagination() {
	var list = $('#tmnt-list-holder');
	var columns = list.width() * (gameColumnWidthTMNT * ($('#tmnt-games-list .game').length / 2)) / 100;
	var container = $(window).width() * 0.82;
	var leftEdge =  container > columns ? ((container - columns) / 2) + 'px' : '0%';
	list.css({left : leftEdge});

	var firstGame = $('#tmnt-games-list .game:first');
	var lastGame = $('#tmnt-games-list .game:last');
	if(firstGame.position() && lastGame.offset()) {
		var pagination = $('#tmnt-games-list .pagination');
		if(firstGame.position().left != 0 || lastGame.offset().left + lastGame.outerWidth() > $(window).width()) {
			pagination.fadeIn();
		}
		else {
			pagination.fadeOut();
		}
	}
}

var gameArray = [];

///////////////////////////////////// UTILITIES /////////////////////////////////////
// Generic X Button event handlers
function closeBtnOn(){
	TweenMax.to($(this).find(".hover-x"), 0.5, {scale: 1.1});
	TweenMax.fromTo($(this).find(".text-x"), 0.5,{scale: 1.5}, {scale: 1, ease: bgEase});
}
function closeBtnOff(){
	TweenMax.to($(this).find(".hover-x"), 0.5, {scale: 0, ease: bgEase});
}
// Generic horizontal paintbrush button hovers
function paintBtnOn(){
	TweenMax.to($(this).find(".hover-back"), 0.7, {width: "100%", ease: bgEase});
	// TweenMax.fromTo($(this).find(".text-x"), 0.7,{scale: 1.5}, {scale: 1, ease: bgEase});
}
function paintBtnOff(){
	TweenMax.to($(this).find(".hover-back"), 0.7, {width: "0%", ease: bgEase});
}

// Returns true if it follows a valid e-mail format
function emailRegex(email) {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}

// Only allows Alphabetic chars
function removeSpecialChars(e){
	if(!(e.keyCode >= 65 && e.keyCode <= 90) && e.keyCode != 8 && e.keyCode != 9 && e.keyCode != 37 && e.keyCode != 39) {
		return false;
	}
}

// Only allows Alphabetic chars
function removeEmailSpecialChars(e){
	if(e.keyCode == 32) {
		return false;
	}
}


///////////////////////////////////// Checking Android Focus Issue /////////////////////////////////////
var isAndroid = /(android)/i.test(navigator.userAgent);
var isAndroidSpecial = /(X11)/i.test(navigator.userAgent);

checkForFocusAndroid();
function checkForFocusAndroid() {

	var winHeight = $(window).height();
	var winWidth = $(window).width();
	var focused = false;


	if(isAndroidSpecial) {
		winHeight = 679;
		winWidth = 1280;
	}
	var top =  -300;



	$('input').on('focus', function() {
		focused = true;

		if(isAndroid || isAndroidSpecial && window.orientation == 0) {

			$('#expand, #nick-footer').hide();
			$('html, body, #main').css({
				width : winWidth + 'px',
				height: winHeight + 'px',
				top : top
			});



		}
	});
	$('input').on('focusout', function() {
		focused = false;

		if(isAndroid || isAndroidSpecial && window.orientation == 0) {

			$('#nick-footer').show();
			$('html, body, #main').css({
				width : winWidth + 'px',
				height: winHeight + 'px',
				top : 0
			});
		}
	});

	window.addEventListener("orientationchange", function() {

		if((window.orientation == '-90' || window.orientation == '90') && (isAndroid || isAndroidSpecial) && focused) {
			$('#rotate').show();
			$('html, body, #main').css({
				width : winWidth + 'px',
				height: winHeight + 'px',
				top : 0
			});
		} else if(((window.orientation == 0 || window.orientation == 180) && (isAndroid || isAndroidSpecial) && focused))  {
			$('#rotate').hide();
			$('body, html, #main').css({
				width : winWidth,
				height: winHeight,
				top : top
			});
		} else if((window.orientation == '-90' || window.orientation == '90') && (isAndroid || isAndroidSpecial) && !focused) {
			$('#rotate').show();
			$('html, body, #main').css({
				width : winWidth + 'px',
				height: winHeight + 'px',
				top : 0
			});
		} else if( (window.orientation == 0 || window.orientation == 180) && (isAndroid || isAndroidSpecial) && !focused) {
			$('#rotate').hide();
			$('html, body, #main').css({
				width : winWidth + 'px',
				height: winHeight + 'px',
				top : 0
			});
		}
	}, false);


}

///////////////////////////////////// OTHER /////////////////////////////////////

function formatID(id){
	if(id<10){
		id = '00'+id;
		return id;
	}else if(i<100){
		id = '0'+id;
		return id;
	}else {
		return id;
	}
}
function formatIDTMNT(id){
	if(gamesTMNT[id-1].trackingID) {
		id = gamesTMNT[id-1].trackingID;
	}
	if(id<10){
		id = '00'+id;
		return id;
	}else if(i<100){
		id = '0'+id;
		return id;
	}else {
		return id;
	}
}
function randomGame(_track){

	var randomNum = Math.floor(Math.random()*games.length);
	//console.log(randomNum);

	if(!_track) {
		tracking.call('random');
	}

	showGameSlide(randomNum+1, true);
	$('#get-game-btn').show();
}
});
///////////////// END READY /////////////////////////////
function loadPrint(gameID) {
	loadPrintObject(games[gameID-1]);
}
function loadTMNTPrint(gameID) {
	loadPrintObject(gamesTMNT[gameID-1]);
}
function loadPrintObject(printObj) {
	$('#print .inside').html('');
	$('#print .title').html(printObj.title);
	$('#print .big-desc').html(printObj.desc);
	for(i=0;i<printObj['stuff'].length;i++){
		$('#print .needs .inside').append('<div class="object"><div class="icon"><img src="img/stuff/'+printObj['stuffTxt'][i]+'.png"/></div><div class="text">'+deDash(printObj["stuff"][i])+'</div></div>');
	}
	// for(i=0;i<printObj['setup'].length;i++){
	// 	$('#print .instructions .inside').eq(0).append('<div class="instruct"><div class="asterisk"><img src="img/featured/asterisk.png" alt="" /></div><div class="text">'+printObj["setup"][i]+'</div></div>');
	// }
	for(i=0;i<printObj['instructions'].length;i++){
		$('#print .instructions .inside').eq(1).append('<div class="instruct"><div class="asterisk"><img src="img/featured/asterisk.png" alt="" /></div><div class="text">'+printObj["instructions"][i]+'</div></div>');
	}
	var playerString = parseInt(printObj["players"]) > 1 ? ' players</div></div>' : ' player</div></div>';
	$('#print .needs .inside').append('<div class="object"><div class="icon no-bg"><img src="img/featured/players.png"/></div><div class="text">'+printObj["players"]+playerString);
	// Add where to play
	$('#print .needs .inside').append('<div class="header-2"><img src="img/featured/where-to-play.png" alt="WHERE TO PLAY" /></div>');
	for(i=0; i<printObj['where'].length; i++){
		$('#print .needs .inside').append('<div class="object"><div class="icon no-bg"><img src="img/where/'+printObj['where'][i]+'.png"/></div><div class="text">'+capFirst(printObj["where"][i])+'</div></div>');
		if(i < printObj['where'].length - 1){
			$('#print .needs .inside').append('<div class="or-divider"><img src="img/featured/divider.png" alt="" /></div>');
		}
	}
}
var logoSpriteInterval;
var playersSpriteInterval;
var stuffSpriteInterval;
var whereSpriteInterval;
var playSpriteInterval;
var galleryBtnInterval;
var starPlayerBtnInterval;
var tmntBtnInterval;
function playSprite(div,frames,seconds,callback){
	var counter = 0;
	var divWidth = $('.'+div).width();
	$('.'+div).css({backgroundSize:divWidth*frames});
	eval(""+div+"Interval = setInterval(function(){if(counter == frames){eval('clearInterval('+div+'Interval)');if(callback){callback();}}else {$('.'+div).css({backgroundPosition:-(divWidth*counter)+'px 0px'});counter++;}},seconds/frames)");
}
function deDash(text){
	text = text.replace(/-/gi," ");
	text = text.replace(/And/gi," & ");
	return text;
}
// Capitalizes first letter
function capFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

var UA_RULES = [
  ['iPhone;', 'phone'],
  ['iPod;', 'phone'],
  ['iPad;', 'tablet'],
  ['Android.*Mobile Safari', 'phone'],
  ['Android.*Safari', 'tablet'],
  ['iemobile', 'phone'],
  ['Windows Phone', 'phone'],
  ['.*', 'desktop'],       // Fallback to desktop.
];


// Tracking
var tracking = {
  prefix: "kraft/caprisun/",       // Prepend to tracking call if it's from vanity URL
  sectionActive : '',     // Section currently timing
  sectionTime   : 0,      // Time spent in section
  siteTime		: 0,      // Time spent in whole site
  enabled		: true,

  // Sends tracking call to Nick's server
  call: function(label){
  	if(!this.enabled) return;

    label += (this.platform == "desktop") ? "" : "_" + this.platform;

    if(this.vanity){
      label = this.prefix + label;
    }

    if (typeof pageNameAppend == "function"){
      pageNameAppend(label);
    }

    console.log(label);
  },

  // Starts timer
  timerStart: function(section){
    this.call(section);
  },

  pause: function() {
  	this.enabled = false;
  },

  unpause: function() {
  	this.enabled = true;
  },

  // Stores desktop, tablet, or phone
  platform: (function(){
    var UA_RULES = [
      ['iPhone;', 'phone'],
      ['iPod;', 'phone'],
      ['iPad;', 'tablet'],
      ['Android.*Mobile Safari', 'phone'],
      ['Android.*Safari', 'tablet'],
      ['iemobile', 'phone'],
      ['Windows Phone', 'phone'],
      ['.*', 'desktop'],
    ];

    var ua = navigator.userAgent;
    for (var i = 0; i < UA_RULES.length; i++){
      var device = UA_RULES[i][1];
      var re = new RegExp(UA_RULES[i][0]);
      if (ua.match(re)){
        return device;
      }
    }
  })(),

  // True if site is hosted outside "ads.nick"
  vanity: (function(){
    if (window.location.href.indexOf("ads.nick") == -1){
      return true;
    }else{
      return false;
    }
  })()
};
/*
     FILE ARCHIVED ON 15:15:32 Oct 19, 2016 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 08:16:40 Oct 13, 2019.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  RedisCDXSource: 3.616
  exclusion.robots: 0.265
  captures_list: 101.443
  exclusion.robots.policy: 0.249
  LoadShardBlock: 75.412 (3)
  esindex: 0.016
  CDXLines.iter: 17.903 (3)
  PetaboxLoader3.datanode: 44.298 (4)
  PetaboxLoader3.resolve: 72.445 (2)
  load_resource: 73.212
*/
