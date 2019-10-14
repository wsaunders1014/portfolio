/* JS */
/* Odyssey Vac Page */
var copyArray = [
"Big family? No problem. Carry up to 5 toddlers safely and secured with LATCH seating positions. <br/>(EX and above)",
'More space for passengers, or more room for two child seats in the second row in "wide mode."<br/>(EX and above)',
"Hauling lumber is a breeze when you fold down the 3rd-row Magic Seat and remove the second row altogether.",
"The versatile interior lets you move a ton of stuff. And bring two friends to help. <br/>(EX and above)",
"Stow the 3rd row and give yourself room for 4, plus a rollicking amount of cargo space.<br/> (EX and above)",
"It's game on for you and four friends with this handy seating configuration.<br/> (EX and above)",
"With 6 people, you can fold the armrest down for extra comfort in the 3rd row.<br/> (Touring models)",
"Enjoy the good fortune of seating 7 in one stylish ride.<br/> (EX and above)",
"Fit 8 adults comfortably in the ultimate carpool vehicle.<br/>(EX and above)"];
var audioArray = [
"Raise the Odyssey's already ample roof by using the touch-screen to blast music through the 12-speaker 5.1 surround sound system.<br/>(Touring Elite)",
'Stay connected with cloud-based access to news and information, Facebook and Twitter updates, and more. (EX and above)<sup>7</sup>',
"Whether your want to skip, pause or play the video in back, controlling the rear entertainment system is virtually effortless.<sup>6</sup> (Available on EX-L, standards on Touring models)",
"Plug in your USB drive or compatible MP3 player and the touch-screen makes it simple to play DJ on the road.<sup>5</sup>",
"Let your fingers find the way to your favorite personalized radio stations with standard Pandora compatibility.<sup>4</sup>",
"Enjoy better access to more stations and more information about artists and music with HD Radio.<sup>3</sup><br/> (Touring Elite)",
"Place or receive calls with your <i>Bluetooth</i><sup>&trade;</sup>-enabled mobile phone thanks to this standard feature.<sup>2</sup>",
"When you receive a text, you can display it, or better yet, have it read out loud.<sup>1</sup>",
"Personalize your rider with wallpaper images that will make every journey more fun."];
function newAnim(){
	// anim = new TimelineLite();
	
	// $(".comp").each(function(index){
	// 	//console.log($(this).attr("id"));
	// 	anim.to($(this),.3, {opacity:"1.0"},"-=0.3");
	// 	anim.add("end-"+index);
	// 	anim.to($(this),.3, {opacity:"0.0"}, "+=0.3");
	// });
	// anim.add("end");
	// //anim.to($("#family-overlay"),.3,{opacity:"0.0"}, "end-=0.3");
	// anim.to($("#vac-copy"),.3, {opacity:"1.0"}, "end-=0.3");
	// anim.to($("#cake"), 1, {opacity:"1.0"},"end-0-=1");
	// anim.to($("#crackers"),1,{opacity:"1.0"},"end-1+=1");
	// anim.to($("#popcorn"), 1, {opacity:"1.0"},"end-2+=1");
	// anim.play();
}

/* Seating Configuration */
$(document).ready(function(){
	$(".seat-btn").click(function(e){
		$('.seat-btn').removeClass('active');
		e.preventDefault();
		var id = $(this).attr("class");
		var classID = id.substr(9);
		var arrayID = id.substr(12);
		console.log(id);
		if($(this).hasClass('active'))
			$(this).removeClass("active");
		else
			$(this).addClass('active');
			
			
		
		if(id == "id-8") {
			TweenLite.to($('.seat-overlay'),.2, {opacity:'0.0'});
		}else {
			TweenLite.to($('.seat-overlay'),.2, {opacity:'0.0'});
			TweenLite.to($('#'+classID),.2, {opacity:'1.0'});
		}
		$("#seat-copy p").html(copyArray[arrayID]);
	});
});

/* Audio Console */
$(document).ready(function(){
	$(".audio-btn").click(function(e){
		$('.audio-btn').removeClass('active');
		e.preventDefault();
		var id = $(this).attr("class");
		var classID = id.substr(10);
		var arrayID = id.substr(13);
		console.log(arrayID);
		if($(this).hasClass('active'))
			$(this).removeClass("active");
		else
			$(this).addClass('active');
			
			
		
		if(id == "id-8") {
			TweenLite.to($('.audio-overlay'),.2, {opacity:'0.0'});
		}else {
			TweenLite.to($('.audio-overlay'),.2, {opacity:'0.0'});
			TweenLite.to($('#'+classID),.2, {opacity:'1.0'});
		}
		if( arrayID >=6) {
		//	TweenLite.to($('#top-line'),.2, {opacity:'1.0'});
			TweenLite.to($('.bottom-line'),.2, {width:'0px',height:'0px'});
			
			var topLine = new TimelineLite();
			topLine.to($('.top-line'),.1, {width:'0px',height:'0px'});
			topLine.to($('#top-lines-1'),.3, {width:'55px',height:'14px'});
			
			topLine.to($('#top-lines-2'),.3, {height:'136px',width:'1px'},"-=.2");
			topLine.to($('#top-lines-3'),.3, {width:'344px',height:'14px'},"-=.2");
		}else {
			TweenLite.to($('.top-line'),.2, {width:'0px',height:'0px'});
			var bottomLine = new TimelineLite();
			bottomLine.to($('.bottom-line'),0, {width:'0px',height:'0px'});
			bottomLine.to($('#bottom-line-2'),.3, {width:'55px',height:'14px'});
			
			bottomLine.to($('#bottom-line-1'),.3, {height:'354px',width:'1px'},"-=.2");
			bottomLine.to($('#bottom-line-3'),.3, {width:'70px',height:'14px'},"-=.2");
		} 
		
		$("#audio-copy p").html(audioArray[arrayID]);
	});
});
/* end Audio Console */

/* Space */
$(document).ready(function(){
	var space = new TimelineLite();
	for(i=1;i<10;i++){
	space.to($("#screen-"+i),.2, {opacity:'1.0'});
	}
	space.play();
});
/* Space */
/*AM PM */
$(document).ready(function(){
	if($('body').hasClass('ampm')) {
	$(".sun").draggable({ axis: "x" ,containment: "parent", refreshPositions: true }); 
	var arch = new TimelineLite();
	arch.to($(".sun"), 530, {bezier:{type:"quadratic",values:[{left:0, top:100}, {left:260, top:-105}, {left:530, top:100}]}, ease:Linear.easeNone});
	
	var morningSun = new TimelineLite();
	morningSun.add("start",0);
	morningSun.to($("#morning-sun"),265, {opacity:"0.0"},"start");
	//morningSun.to($("#sun-overlay"),165, {opacity:"0.0"},"start");
	//morningSun.to($("#text1"),265, {opacity:"0.0"},"start");		
	morningSun.add("end",530);
	
	var noonSun = new TimelineLite();
	noonSun.add("start",0);
	noonSun.to($("#noon-sun"),265, {opacity:"1.0"},"start");
	//noonSun.to($("#noon"),265, {opacity:"1.0"},"start");
	morningSun.to($("#text1"),265, {opacity:"0.0"},"start");	
	noonSun.add("middle");
	noonSun.to($("#noon-sun"),265, {opacity:"0.0"},"middle");
	noonSun.add("end",530);
	
	var eveningMoon = new TimelineLite();
	eveningMoon.add("start",0);
	eveningMoon.add("middle",265);
	eveningMoon.to($("#evening-moon"),265, {opacity:"1.0"}, "middle");
	//eveningMoon.to($("#pm"),265, {opacity:"1.0"}, "middle");
	eveningMoon.to($("#text2"),265, {opacity:"1.0"}, "middle");
	eveningMoon.to($("#moon-overlay"),165, {opacity:"1.0"}, "middle+=100");
	
	$(".sun").on( "drag", function( event, ui ) {
		
		curX = ui.position.left;
		
		arch.seek(curX);
		morningSun.seek(curX);
		noonSun.seek(curX);
		eveningMoon.seek(curX);
		
	} ); 
	arch.pause();
	}
});
	/*AM PM */
	
	/* Safety */
$(document).ready(function(){
	$('.link').click(function(e){
		e.preventDefault();
		TweenLite.to($('.blk-overlay'),.7, {opacity:'1.0'});
		TweenLite.to($('#pop-up'), .7, {opacity:'1.0'});

		var ID = $(this).attr('id');
		TweenLite.to($('.'+ID),.7,{opacity:'1.0'});
	});
	$('.close-popup').click(function(e) {
		e.preventDefault();
		TweenLite.to($('.blk-overlay'),.7, {opacity:'0.0'});
		TweenLite.to($('#pop-up'), .7, {opacity:'0.0'});
		TweenLite.to($('#pop-up div'), .7, {opacity:'0.0'});
	});
	$('.blk-overlay').click(function(e){
		TweenLite.to($('.blk-overlay'),.7, {opacity:'0.0'});
		TweenLite.to($('#pop-up'), .7, {opacity:'0.0'});
		TweenLite.to($('#pop-up div'), .7, {opacity:'0.0'});
	});
});
	
	
	/* Safety */
