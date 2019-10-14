var devPlanet,actorPlanet,writerPlanet,degrees=0,oldHash=location.hash;
export var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
var notHomepage = (location.hash.length>1) ? true:false;
var moonPlayed = false, marchPlayed = false;
var audioPlaying = false;
var muted = false;
var url = location.origin +location.pathname;
var introOn = (!oldHash) ? true:false;
var wrapperW =0;
var wrapperH = 0;
var deathArray = [];
var sun = {};
var deathStar = {};

var toCorner = {};
var mouseX,mouseY,anim,oldCoords,xDistance,yDistance,origAngle;
