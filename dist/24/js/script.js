var href = location.href;
if(href.charAt(href.length-1)=="#"){
	href=href.slice(0,-2);
	location.href = href;
}
var dayIs;
var day;
var imgURL= `${href}img/rewards/24Moments_Share_${dayIs}.png`;
var tmblrImg = href+'/img/rewards/24M_Content_Day_'+dayIs+'.gif';
var shareTitle="I've unlocked another piece of the puzzle on 24 Moments";
var shareSummary="Someone has leaked top secret codes onto the 24 social channels – retrieve the codes embedded in these images for access to never-before-seen Jack Bauer footage!";
var twtURL = 'https://twitter.com/share?url='+href+'&text='+shareTitle+'&hashtags=jackisback,24MOMENTS,LAD,Day'+dayIs;
var tmbURL = encodeURIComponent('http://www.tumblr.com/share/photo?source='+imgURL+'&caption='+shareTitle+'&clickthru='+href);
$(document).ready(function() {
	var NastyBrowserSniffing = {

	  	ua: navigator.userAgent.toLowerCase(),

		init: function() {
		   var isAndroid = NastyBrowserSniffing.ua.indexOf("android") > -1;
		   if (isAndroid) {
		   	$("html").addClass("android");
		   }
		}
	};
	NastyBrowserSniffing.init();

	var loggedin=false;
	var siteURL = location.href;
	var videoOffset;
	var videoActive = false;
	var appID;
	var currDay;
	var justClicked=false;

	appID = 257451871119318; //Live Site
	//appID = 260371667494005; //localhost
	$.ajaxSetup({ cache: true });
	$.getScript('//connect.facebook.net/en_UK/all.js', function(){
	    FB.init({
	    	  appId      : appID,
	          cookie     : true,
	          xfbml      : true,
	          version    : 'v2.0'
	    });
  }); //END GET SCRIPTS


	$.post('php/fbaccess.php').done(function(data){
		var data = JSON.parse(data);
		var keys = Object.keys(data.htmlR);
		 for(var i=1;i <25;i++) {
		 	var $el = $('.col#day-'+i);
		 	if(winD == 'desktop' || winD == 'tablet'){
			 	if($.inArray('day-'+i, keys) != -1){
			 		$el.find('.day-internal').html(data.htmlR['day-'+i]);
			 		TweenMax.to($el.children('.loader'), 0.3, {autoAlpha:0, delay:i/11});
					TweenMax.set($el.find('.day-internal'), {left:'0%'});
					TweenMax.set($el.find(".reward"), {left: "-100%"});
					TweenMax.set($el.find(".share-off"), {right: "-25%"});
					TweenMax.set($el.find('.share'), {bottom:'-20%'});
					TweenMax.to($el.find(".reward"), 0.5, {left: "0%",delay:i/10});
					TweenMax.to($el.find(".share-off"), 0.3, {right: "0%",delay:i/10});
					TweenMax.to($el.find(".share"), 0.3, {bottom: "0%",delay:i/10});
			 	}else {
			 		TweenMax.to($el.children('.loader'), 0.3, {autoAlpha:0, delay:i/10});
			 		TweenMax.to($el.find('.day-internal'),0.5, {left:'0%', delay:i/10});
			 	}
			}else {
				if($.inArray('day-'+i, keys) != -1){
			 		TweenMax.set($el.children('.loader'), {autoAlpha:0, delay:i/15});
			 		$el.find('.day-internal').html(data.htmlR[keys[i]]);
					TweenMax.set($el.find('.day-internal'), {left:'0%', delay:i/15});
			 	}else {
			 		TweenMax.set($el.children('.loader'),  {autoAlpha:0, delay:i/15});
			 		TweenMax.set($el.find('.day-internal'), {left:'0%', delay:i/15});
			 	}
			}
		}
		if(data.daysUnlocked==24){
			$('#video-holder').load('php/video.php', function(){
				if(winO == 'landscape') {
					videoOffset = $('.wrapper').height() - $('#video-holder').offset().top;
				}
			});
		}
		$(".day-contents .share").fitText(1.2);

		// Mouseover animations for share reward
		$(".day-contents .share").on("mouseover", function(){
			TweenMax.to($(this).siblings(".share-off"), 0.3, {bottom: "0%", right: "-25%"});
			TweenMax.to($(this).siblings(".share-on"), 0.3, {bottom: "0%", right: "0%"});
		});
		$(".day-contents .share").on("mouseout", function(){
			TweenMax.to($(this).siblings(".share-on"), 0.3, {bottom: "-25%", right: "0%"});
			TweenMax.to($(this).siblings(".share-off"), 0.3, {bottom: "0%", right: "0%"});
		});

  });

	function modalMargin(eqN) {
		 var modalH = $('.modal-dialog').eq(eqN).innerHeight();
    	 var modalW = $('.modal-dialog').eq(eqN).width();
    	 var marginTop = (winH - modalH)/2;
    	 if (marginTop < 0) {
    	 	marginTop = 0;
    	 }
    	 $('.modal-dialog').eq(eqN).css({marginTop: marginTop});
	}

	function checkLoginState() {
	  FB.getLoginStatus(function(response) {
	     statusChangeCallback(response);
	  });
	}
	$('.share').on('click', function(e){
		e.preventDefault();
		console.log(e.currentTarget)
	})
  // $(".row").on("click", '.share', function(e){
  //   	e.preventDefault();
	// 		console.log(e)
  //   	var day = e.currentTarget.getAttribute('class');
  //   	dayIs = +day.split('-')[1];
	// 		console.log(dayIs)
  //   	shareFn(dayIs);
  //   	currDay = dayIs;
  //   	//$('.modal-body img').attr('src', 'img/rewards/24M_Content_Day_'+dayIs+'.gif');
  //   	$('#modal-img').css({backgroundImage:'url("img/rewards/24M_Content_Day_'+dayIs+'.gif")'});
	// 	$('#modal-sharing').modal('show');
	// 	dataLayer.push({'pageName':'Reward'+dayIs,'event':'pageView'});
	// 	modalMargin(1);
	// 	return false;
	// });
	$('.twitter-btn').click(function(e){
		e.preventDefault();
		dataLayer.push({'eventCategory':'Reward'+currDay,'eventAction':'click','eventLabel':'twitter','event':'siteEvent'});
		window.open(twtURL,"PosttoTwitter","width=600, height=550");
		return false;
	});
	$('.fb-btn').click(function(e){
		e.preventDefault();
		FB.ui({method: 'feed',
		    link:"http://bit.ly/24LADMoments",
		    caption: 'I’ve unlocked another piece of the puzzle on 24 Moments',
		    picture: imgURL,
		    description: 'Someone has leaked top secret codes onto the 24 social channels – retrieve the codes embedded in these images for access to never-before-seen Jack Bauer footage!',
		},function(response){
			dataLayer.push({'eventCategory':'Reward'+currDay,'eventAction':'click','eventLabel':'facebook','event':'siteEvent'});
		});
	});
	$('.tumblr-btn').click(function(e){
		e.preventDefault();
		dataLayer.push({'eventCategory':'Reward'+currDay,'eventAction':'click','eventLabel':'tumblr','event':'siteEvent'});
		window.open(tmbURL,"PosttoTumblr","width=600, height=520");
	});
	//Video Twitter Share
	$('#video-holder').on('click','.video-twit', function(e){
		e.preventDefault();
		dataLayer.push({'eventCategory':'exclusive_video','eventAction':'click','eventLabel':'twitter','event':'siteEvent'});
		window.open('https://twitter.com/share?url=http://bit.ly/24LADMoments&text=I unlocked an exclusive clip of Jack Bauer from 24: Live Another Day.&hashtags=jackisback,24,LAD,ALLDAYS',"PosttoTwitter","width=600, height=550");
	});
	//Video Facebook Share
	$('#video-holder').on('click','.video-face' ,function(e){
		e.preventDefault();
		FB.ui({method: 'feed',
		    link: "http://bit.ly/24LADMoments",
		    caption: 'I unlocked an exclusive clip of Jack Bauer from 24: Live Another Day.',
		    picture: siteURL+'img/video/video-grid-all.jpg',
		    description: 'Someone has leaked top secret codes onto the 24 social channels – retrieve the codes embedded in these images for access to never-before-seen Jack Bauer footage!',
		},function(response){
			dataLayer.push({'eventCategory':'exclusive_video','eventAction':'click','eventLabel':'facebook','event':'siteEvent'});
		});
	});
	//Video Tumblr Share
	$('#video-holder').on('click','.video-tumb' ,function(e){
		e.preventDefault();
		dataLayer.push({'eventCategory':'exclusive_video','eventAction':'click','eventLabel':'tumblr','event':'siteEvent'});
		var link = 'http://www.tumblr.com/share/photo?source='+encodeURIComponent(siteURL+'img/video/video-grid-all.jpg')+'&caption='+encodeURIComponent('I unlocked an exclusive clip of Jack Bauer from 24: Live Another Day.')+'&clickthru='+encodeURIComponent("http://bit.ly/24LADMoments");
		window.open(link,"PosttoTumblr","width=600, height=550");
	});
	$('#video-holder').on('click', '.video-play a', function(e){
		e.preventDefault();
		$("#ytplayer").css({opacity: 1});

	});
	$('#vid-box').mousemove(function(){
		$('.close-btn').animate({opacity:1},500);
	});
	$('#vid-box').on('touchmove', function(){
		$('.close-btn').animate({opacity:1},500);
	});
	//DEBUG
	$('#login-btn').click(function(e){
		e.preventDefault();
		if(loggedin == true){
			FB.logout(function(response){
				window.location.reload();
			});
		}else {
			FB.login(function(response){
				statusChangeCallback(response);
			});
		}

	});
	if('webkitBackgroundClip' in document.body.style){
		$('#modal-landing .modal-footer h2').addClass('clip');
	}

	/*$(document).on('scroll', function(e){
		$('.modal').modal('hide');
		var docScroll = $(this).scrollTop();
		if(winO != 'portrait') {
			if(docScroll > videoOffset){
				if (videoActive == false){
					videoUnlocked();
					videoActive = true;
				}
			}
		}else {
			if (videoActive == false){
				setTimeout(videoUnlocked,1000);
				//videoUnlocked();
				videoActive = true;
			}
		}
	});*/
	//TRACKING CALLS
	$('#modal-landing').find('.close').click(function(){
		dataLayer.push({'eventCategory':'intro','eventAction':'click','eventLabel':'close','event':'siteEvent'});
	});
	$('#modal-sharing').find('.close').click(function(){
		dataLayer.push({'eventCategory':'Reward'+currDay,'eventAction':'click','eventLabel':'close','event':'siteEvent'});
	});
	$('.enter').click(function(){
		var day = $(this).parents('.col').attr('id');
		day = day.split('-')[1];
		dataLayer.push({'eventCategory':'Enter Code','eventAction':'click','eventLabel':'code '+day,'event':'siteEvent'});
	})
	$('.find').click(function(){
		var day = $(this).parents('.col').attr('id');
		day = day.split('-')[1];
		dataLayer.push({'eventCategory':'Find Code','eventAction':'click','eventLabel':'code '+day,'event':'siteEvent'});
	});
	$('.fa-twitter').click(function(){
		dataLayer.push({'eventLabel':'https://twitter.com/24fox', 'event':'exitSite'});
	});
	$('.fa-facebook').click(function(){
		dataLayer.push({'eventLabel':'https://www.facebook.com/24fox', 'event':'exitSite'});
	});
	$('.fa-instagram').click(function(e){
		e.preventDefault();
		dataLayer.push({'eventLabel':'http://instagram.com/24onFOX', 'event':'exitSite'});

	});
	$('.fa-tumblr').click(function(e){
		e.preventDefault();
		dataLayer.push({'eventLabel':'http://liveanotherday.fox.com/', 'event':'exitSite'});
	});
	$('.pre-order').click(function(){
		dataLayer.push({'retailerName':'Amazon','event':'retailer'});
	});
	$('#link-privacy').click(function(){
		dataLayer.push({'eventLabel':'http://www.foxprivacy.com/us/privacy.html', 'event':'exitSite'});
	});
	$('#link-terms').click(function(){
		dataLayer.push({'eventLabel':'http://www.foxprivacy.com/us/terms.html', 'event':'exitSite'});
	});
	$('.dvd-boxes a').click(function(){
		dataLayer.push({'retailerName':'Amazon','event':'retailer'});
	});

}); //End DOCUMENT READY
//LOAD Animations
$(window).load(function(){
	$('#loader').remove();
	var loading = new TimelineLite();
	if( winD == 'desktop' || winD == 'tablet') {
		loading.to($('#container-title'), 1, {top:'0%'})
		//.to($('.row#days'),1, {left:'0%'},'-=1')
		.to($('#container-social'),1, {right:'0%'},'-=1')
		.to($('#fb-login'),1,{right:'94%'},'+=1')
		.to($('#container-footer'),1, {bottom:'-70px'}, '-=1')
		.to($('.subtitle'), 0.8, {top:'3%'}, '-=0.8')
		.to($('.subtitle'),0.8, {rotation:0},'-=0.8');
		if(winD == 'desktop'){
			for (var i=1;i < 25;i++){
				if ( i < 5 ){
					loading.from($('.col#day-'+i), 1, {left:'-120%'}, '-=1.8');
				}else if( i >= 5 && i <10){
					loading.from($('.col#day-'+i), 1, {left:'130%'}, '-=1.8');
				}else if(i >=10 && i <15){
					loading.from($('.col#day-'+i), 1, {left:'-120%'}, '-=1.8');
				}else if ( i >=15 && i <20) {
					loading.from($('.col#day-'+i), 1, {left:'130%'}, '-=1.8');
				}else {
					loading.from($('.col#day-'+i), 1, {left:'-120%'}, '-=1.8');
				}
			}
		}
		loading.play();
	}else {
		loading.set($('#container-title'), {top:'0%'});
		loading.play();
	}

});

function shareFn(day){
	imgURL=`img/rewards/share/24M_Content_Day_${day}.png`;
	tmblrImg = `img/rewards/24M_Content_Day_${day}.gif`;
	shareTitle="I've unlocked another piece of the puzzle on 24 Moments";
	twtURL = eval("'https://twitter.com/share?url=http://bit.ly/24LADMoments&text='+shareTitle+'&hashtags=jackisback,24Moments,LAD,Day'+day");
	tmbURL = eval("'https://www.tumblr.com/share/photo?source='+encodeURIComponent(tmblrImg)+'&caption='+encodeURIComponent(shareTitle)+'&clickthru='+encodeURIComponent('http://bit.ly/24LADMoments')");
}
// Cleans up code after it has been entered
function tryCode(dayContents){
	var code = dayContents.find('input').val();
	var day = dayContents.parents('.col').prop('id');

	if(code ==""){
		dayContents.find('input').attr('placeholder','no code entered').parent('.form-group').addClass('has-error');
	}else {
		code = code.toLowerCase();
		enterCode(code,day);
	}
}

// Checks code with the database
function enterCode(code,day){
	$.post('php/code.php', {code:code, day:day}).done(function(data){
		var data = JSON.parse(data);

		if(data.test =="failed"){
			$('.col#'+day).children('.day-contents').children('.day-internal').children('.form-group').addClass('has-error').children('input').val("").attr("placeholder",data.message);
		}else {
			accessingSuccess(data);
			dayIs = data.day;
		}
	});
}
