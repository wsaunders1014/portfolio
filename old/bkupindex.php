<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8"/>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>I Am Will Saunders</title>
	<meta name="description" content="The Personal Website of Will Saunders: Developer, Writer, Actor">
    <meta name="keywords" content="Front End Developer, Screenwriter, Actor, Comedian">
    <meta name="author" content="Will Saunders">
    <meta property="og:image" content="http://iamwillsaunders.com/img/preview.jpg">
	<link href="https://fonts.googleapis.com/css?family=Orbitron|Open+Sans" rel="stylesheet">
	<style>
		@-webkit-keyframes uil-ring-anim {
		0% {
		    -ms-transform: rotate(0deg);
		    -moz-transform: rotate(0deg);
		    -webkit-transform: rotate(0deg);
		    -o-transform: rotate(0deg);
		    transform: rotate(0deg);
		}
		100% {
		    -ms-transform: rotate(360deg);
		    -moz-transform: rotate(360deg);
		    -webkit-transform: rotate(360deg);
		    -o-transform: rotate(360deg);
		    transform: rotate(360deg);
		  }
		}
		@-webkit-keyframes uil-ring-anim {
		  0% {
		    -ms-transform: rotate(0deg);
		    -moz-transform: rotate(0deg);
		    -webkit-transform: rotate(0deg);
		    -o-transform: rotate(0deg);
		    transform: rotate(0deg);
		  }
		  100% {
		    -ms-transform: rotate(360deg);
		    -moz-transform: rotate(360deg);
		    -webkit-transform: rotate(360deg);
		    -o-transform: rotate(360deg);
		    transform: rotate(360deg);
		  }
		}
		@-moz-keyframes uil-ring-anim {
		  0% {
		    -ms-transform: rotate(0deg);
		    -moz-transform: rotate(0deg);
		    -webkit-transform: rotate(0deg);
		    -o-transform: rotate(0deg);
		    transform: rotate(0deg);
		  }
		  100% {
		    -ms-transform: rotate(360deg);
		    -moz-transform: rotate(360deg);
		    -webkit-transform: rotate(360deg);
		    -o-transform: rotate(360deg);
		    transform: rotate(360deg);
		  }
		}
		@-ms-keyframes uil-ring-anim {
		  0% {
		    -ms-transform: rotate(0deg);
		    -moz-transform: rotate(0deg);
		    -webkit-transform: rotate(0deg);
		    -o-transform: rotate(0deg);
		    transform: rotate(0deg);
		  }
		  100% {
		    -ms-transform: rotate(360deg);
		    -moz-transform: rotate(360deg);
		    -webkit-transform: rotate(360deg);
		    -o-transform: rotate(360deg);
		    transform: rotate(360deg);
		  }
		}
		@-moz-keyframes uil-ring-anim {
		  0% {
		    -ms-transform: rotate(0deg);
		    -moz-transform: rotate(0deg);
		    -webkit-transform: rotate(0deg);
		    -o-transform: rotate(0deg);
		    transform: rotate(0deg);
		  }
		  100% {
		    -ms-transform: rotate(360deg);
		    -moz-transform: rotate(360deg);
		    -webkit-transform: rotate(360deg);
		    -o-transform: rotate(360deg);
		    transform: rotate(360deg);
		  }
		}
		@-webkit-keyframes uil-ring-anim {
		  0% {
		    -ms-transform: rotate(0deg);
		    -moz-transform: rotate(0deg);
		    -webkit-transform: rotate(0deg);
		    -o-transform: rotate(0deg);
		    transform: rotate(0deg);
		  }
		  100% {
		    -ms-transform: rotate(360deg);
		    -moz-transform: rotate(360deg);
		    -webkit-transform: rotate(360deg);
		    -o-transform: rotate(360deg);
		    transform: rotate(360deg);
		  }
		}
		@-o-keyframes uil-ring-anim {
		  0% {
		    -ms-transform: rotate(0deg);
		    -moz-transform: rotate(0deg);
		    -webkit-transform: rotate(0deg);
		    -o-transform: rotate(0deg);
		    transform: rotate(0deg);
		  }
		  100% {
		    -ms-transform: rotate(360deg);
		    -moz-transform: rotate(360deg);
		    -webkit-transform: rotate(360deg);
		    -o-transform: rotate(360deg);
		    transform: rotate(360deg);
		  }
		}
		@keyframes uil-ring-anim {
		  0% {
		    -ms-transform: rotate(0deg);
		    -moz-transform: rotate(0deg);
		    -webkit-transform: rotate(0deg);
		    -o-transform: rotate(0deg);
		    transform: rotate(0deg);
		  }
		  100% {
		    -ms-transform: rotate(360deg);
		    -moz-transform: rotate(360deg);
		    -webkit-transform: rotate(360deg);
		    -o-transform: rotate(360deg);
		    transform: rotate(360deg);
		  }
		}
		.uil-ring-css {
		  background: none;
		  position: relative;
		  width: 200px;
		  height: 200px;
		}
		.uil-ring-css > div {
		  position: absolute;
		  display: block;
		  width: 160px;
		  height: 160px;
		  top: 20px;
		  left: 20px;
		  border-radius: 80px;
		  box-shadow: 0 6px 0 0 #59ebff;
		  -ms-animation: uil-ring-anim 1s linear infinite;
		  -moz-animation: uil-ring-anim 1s linear infinite;
		  -webkit-animation: uil-ring-anim 1s linear infinite;
		  -o-animation: uil-ring-anim 1s linear infinite;
		  animation: uil-ring-anim 1s linear infinite;
		}
 	</style>

	<link rel="stylesheet" href="css/reset.css"/>
	<link rel="stylesheet" href="css/style.css"/>
	<script src="js/preloader.js"></script>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/1.19.0/TweenMax.min.js"></script>
	<script src="js/fittext.js"></script>

</head>
<body>
	<div id="wrapper" style="left:-100%;top:-100%;">
		<div class="quadrant" id="quad1">
			<!-- <div class="banner">Nothing out here.</div> -->
			<div id="death-star">
				<div class="hit-box"></div>
				<div id="death-laser"></div>
				<div class="laser"></div>
			</div>
		</div>
		<div class="quadrant" id="quad2">
			<div id="warp"></div>
		</div>
		<div class="quadrant" id="quad3">
			<div id="lv246bg"></div>
			<div id="lv246" class="planet-holder">
				<div class="glyph c4"><img src="img/glyph.png" alt="glyph" draggable="false"></div>
				<div class="slide-out">
					<div class="info unselectable">
						<p class="title">Planet LV-246</p>
						<p class='details'>Warning: Local fauna extremely dangerous.</p>
					</div>
				</div>
				<div class="planet"></div>
			</div>
		</div>
		<div class="quadrant" id="quad4">
			<div class="banner">Are you lost?</div>
		</div>
		<div class="quadrant" id="main">
			<div id="dev" class="planet-holder">
				<div class="glyph c1"><img src="img/glyph.png" alt="glyph" draggable="false"></div>
				<div class="slide-out">
					<div class="info unselectable">
						<p class="title">Planet Developia</p>
						<p class='details'>Legends say the best web developer in the quadrant lives here...</p>
						<a href="developer" class="waypoint-btn"></a>
					</div>
				</div>
				<div class="planet"></div>
			</div>
			<div id="writer" class="planet-holder">
				<div class="glyph c2"><img src="img/glyph.png" alt="glyph" draggable="false"></div>
				<div class="slide-out">
					<div class="info unselectable">
						<p class="title">Planet Writerious</p>
						<p class='details'>This planet is known for its stories. Don't worry, we'll translate it into English for you.</p>
						<a href="writer" class="waypoint-btn"></a>
					</div>
				</div>
				<div class="planet"></div>
			</div>
			<div id="actor" class="planet-holder">
				<div class="glyph c3"><img src="img/glyph.png" alt="glyph" draggable="false"></div>
				<div class="slide-out">
					<div class="info unselectable">
						<p class="title">Planet Actorix</p>
						<p class='details'>If you're looking for an actor, try this planet.</p>
						<a href="actor" class="waypoint-btn"></a>
					</div>
				</div>
				<div class="planet"></div>
			</div>
			<div id="intro" class="bg">
				<h1>I Am Will Saunders. And this is my website. </h1>
				<div id="intro-text">
					<div id="explore-btn"></div>
				</div>
			</div>
		</div>
		<div class="quadrant" id="quad6">
			<!-- <div class="banner">Coming soon</div> -->
			<div id="sun"><div class="hit-box"></div></div>
		</div>
		<div class="quadrant" id="quad7">
			<!-- <div class="banner">Under construction.</div> -->
			<div id="star-destroyer"><img src="img/laser.gif" alt="Destroyer Laser"></div>
			<div id="leia-ship"></div>
		</div>
		<div class="quadrant" id="quad8">
			<div class="banner">To be continued.</div>
		</div>
		<div class="quadrant" id="quad9">
			<div class="banner">Where am I?</div>
		</div>
		<div id="rocket">
			<div id="rocket-img">
				<div id="glow"></div>
				<div id="left-engine"></div>
				<div id="right-engine"></div>
			</div>
			<div id="explosion"><!-- <img src='img/explosion.gif' alt="boom"/> --></div>
		</div>
		<div id='waypoints'></div>
	</div>
	<!-- END WRAPPER -->



	<div id="death-modal">
		<h3 id="message">You Died.</h3>
		<div id='restart'></div>
	</div>
	<div id="overlay"></div>
	<div id="pane">
		<div class="content">
		</div>
	</div>


	<div id="top-bar">
		<div id="nav">
			<div id="nav-btn">
			</div>
			<div id="menu">
				<div class="menu-btn" id="dev-btn">
					<a href="developer"></a>
				</div>
				<div class="menu-btn" id="writer-btn">
					<a href="writer"></a>
				</div>
				<div class="menu-btn" id="actor-btn">
					<a href="actor"></a>
				</div>
			</div>
		</div>
		<div id="social">
			<div class="social-btn" id="twitter"><a target="_blank" href="https://twitter.com/BillWaunders"></a></div>
			<div class="social-btn" id="instagram"><a target="_blank" href="https://www.instagram.com/billwaunders/"></a></div>
			<div class="social-btn" id="tumblr"><a target="_blank" href="http://thewriterwill.tumblr.com/"></a></div>
		</div>
		<div id="audio-ctrl"></div>
	</div>

	<div class="top-left-corner glyph-1 shift"></div>
	<div class="top-left-corner glyph-4 shift"></div>
	<div class="top-left-corner glyph-2 shift"></div>
	<div class="top-left-corner glyph-3 shift"></div>
	<div class="top-left-corner glyph-5 shift"></div>

	<div class="top-right-corner glyph-1 shift"></div>
	<div class="top-right-corner glyph-2 shift"></div>
	<div class="top-right-corner glyph-3 shift"></div>
	<div class="top-right-corner glyph-4 shift"></div>

	<div class="bottom-left-corner glyph-1 shift"></div>
	<div class="bottom-left-corner glyph-2 shift"></div>

	<div class="bottom-right-corner glyph-3 shift"></div>
	<div class="bottom-right-corner glyph-1 shift"></div>
	<div class="bottom-right-corner glyph-2 shift"></div>
	<div class="bottom-right-corner glyph-4 shift"></div>
<div id="loader">
	<div id="gif">
		<div class='uil-ring-css'>
			<div></div>
		</div>
		<div class="loading-text"><span id="percent">00</span>% LOADED</div>
	</div>
</div>
<!-- <div id="debug">
	<div class="mouse"></div>
	<div class="angle"></div>
</div> -->
<audio id='moon' preload='auto'>
	<source src="audio/thats-no-moon.mp3" type="audio/mpeg">
</audio>
<audio id='cantdo' preload='auto'>
	<source src="audio/cantdo.mp3" type="audio/mpeg">
</audio>
<audio id='march' preload='auto'>
	<source src="audio/imperial-march.mp3" loop type="audio/mpeg">
</audio>

	<script src="dist/js/main.js"></script>
	<!-- <script src="js/script.js"></script>
	<script src="js/form.js"></script>
	<script src="js/bezier-shard.js"></script>
	<script src="js/rocket.js"></script> -->
</body>
</html>
