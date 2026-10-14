/**
  This code is based on a javascript Bezier curve library by Pomax.
  Based on http://pomax.github.io/bezierinfo
  This code is MIT licensed.

  All I've done is removed what I'm not using to save on kb's.

**/

  // math-inlining.
  var abs = Math.abs,
      min = Math.min,
      cos = Math.cos,
      sin = Math.sin,
      max = Math.max,
      acos = Math.acos,
      sqrt = Math.sqrt,
      pi = Math.PI,
      // a zero coordinate, which is surprisingly useful
      ZERO = {x:0,y:0,z:0},
      atan2 = Math.atan2,
      pow = Math.pow,
      // cube root function yielding real roots
      crt = function(v) { return (v<0) ? -pow(-v,1/3) : pow(v,1/3); },
      // trig constants
      tau = 2*pi,
      quart = pi/2,
      // float precision significant decimal
      epsilon = 0.000001;

  // quite needed
  //var utils = require('./utils.js');
  var utils = {
    // Legendre-Gauss abscissae with n=24 (x_i values, defined at i=n as the roots of the nth order Legendre polynomial Pn(x))
    Tvalues: [
      -0.0640568928626056260850430826247450385909,
       0.0640568928626056260850430826247450385909,
      -0.1911188674736163091586398207570696318404,
       0.1911188674736163091586398207570696318404,
      -0.3150426796961633743867932913198102407864,
       0.3150426796961633743867932913198102407864,
      -0.4337935076260451384870842319133497124524,
       0.4337935076260451384870842319133497124524,
      -0.5454214713888395356583756172183723700107,
       0.5454214713888395356583756172183723700107,
      -0.6480936519369755692524957869107476266696,
       0.6480936519369755692524957869107476266696,
      -0.7401241915785543642438281030999784255232,
       0.7401241915785543642438281030999784255232,
      -0.8200019859739029219539498726697452080761,
       0.8200019859739029219539498726697452080761,
      -0.8864155270044010342131543419821967550873,
       0.8864155270044010342131543419821967550873,
      -0.9382745520027327585236490017087214496548,
       0.9382745520027327585236490017087214496548,
      -0.9747285559713094981983919930081690617411,
       0.9747285559713094981983919930081690617411,
      -0.9951872199970213601799974097007368118745,
       0.9951872199970213601799974097007368118745
    ],

    // Legendre-Gauss weights with n=24 (w_i values, defined by a function linked to in the Bezier primer article)
    Cvalues: [
      0.1279381953467521569740561652246953718517,
      0.1279381953467521569740561652246953718517,
      0.1258374563468282961213753825111836887264,
      0.1258374563468282961213753825111836887264,
      0.1216704729278033912044631534762624256070,
      0.1216704729278033912044631534762624256070,
      0.1155056680537256013533444839067835598622,
      0.1155056680537256013533444839067835598622,
      0.1074442701159656347825773424466062227946,
      0.1074442701159656347825773424466062227946,
      0.0976186521041138882698806644642471544279,
      0.0976186521041138882698806644642471544279,
      0.0861901615319532759171852029837426671850,
      0.0861901615319532759171852029837426671850,
      0.0733464814110803057340336152531165181193,
      0.0733464814110803057340336152531165181193,
      0.0592985849154367807463677585001085845412,
      0.0592985849154367807463677585001085845412,
      0.0442774388174198061686027482113382288593,
      0.0442774388174198061686027482113382288593,
      0.0285313886289336631813078159518782864491,
      0.0285313886289336631813078159518782864491,
      0.0123412297999871995468056670700372915759,
      0.0123412297999871995468056670700372915759
    ],

    arcfn: function(t, derivativeFn) {
      var d = derivativeFn(t);
      var l = d.x*d.x + d.y*d.y;
      if(typeof d.z !== "undefined") {
        l += d.z*d.z;
      }
      return sqrt(l);
    },

    length: function(derivativeFn) {
      var z=0.5,sum=0,len=utils.Tvalues.length,i,t;
      for(i=0; i<len; i++) {
        t = z * utils.Tvalues[i] + z;
        sum += utils.Cvalues[i] * utils.arcfn(t,derivativeFn);
      }
      return z * sum;
    },

    angle: function(o,v1,v2) {
      var dx1 = v1.x - o.x,
          dy1 = v1.y - o.y,
          dx2 = v2.x - o.x,
          dy2 = v2.y - o.y,
          cross = dx1*dy2 - dy1*dx2,
          m1 = sqrt(dx1*dx1+dy1*dy1),
          m2 = sqrt(dx2*dx2+dy2*dy2),
          dot;
      dx1/=m1; dy1/=m1; dx2/=m2; dy2/=m2;
      dot = dx1*dx2 + dy1*dy2;
      return atan2(cross, dot);
    },

    dist: function(p1, p2) {
      var dx = p1.x - p2.x,
          dy = p1.y - p2.y;
      return sqrt(dx*dx+dy*dy);
    },

    align: function(points, line) {
      var tx = line.p1.x,
          ty = line.p1.y,
          a = -atan2(line.p2.y-ty, line.p2.x-tx),
          d = function(v) {
            return {
              x: (v.x-tx)*cos(a) - (v.y-ty)*sin(a),
              y: (v.x-tx)*sin(a) + (v.y-ty)*cos(a)
            };
          };
      return points.map(d);
    }
  };

  var Bezier = function(coords) {
    var args = (coords && coords.forEach) ? coords : [].slice.call(arguments);
    var coordlen = false;
    if(typeof args[0] === "object") {
      coordlen = args.length;
      var newargs = [];
      args.forEach(function(point) {
        ['x','y','z'].forEach(function(d) {
          if(typeof point[d] !== "undefined") {
            newargs.push(point[d]);
          }
        });
      });
      args = newargs;
    }
    var higher = false;
    var len = args.length;
    if (coordlen) {
      if(coordlen>4) {
        if (arguments.length !== 1) {
          throw new Error("Only new Bezier(point[]) is accepted for 4th and higher order curves");
        }
        higher = true;
      }
    } else {
      if(len!==6 && len!==8 && len!==9 && len!==12) {
        if (arguments.length !== 1) {
          throw new Error("Only new Bezier(point[]) is accepted for 4th and higher order curves");
        }
      }
    }
    var _3d = (!higher && (len === 9 || len === 12)) || (coords && coords[0] && typeof coords[0].z !== "undefined");
    this._3d = _3d;
    var points = [];
    for(var idx=0, step=(_3d ? 3 : 2); idx<len; idx+=step) {
      var point = {
        x: args[idx],
        y: args[idx+1]
      };
      if(_3d) { point.z = args[idx+2] };
      points.push(point);
    }
    this.order = points.length - 1;
    this.points = points;
    var dims = ['x','y'];
    if(_3d) dims.push('z');
    this.dims = dims;
    this.dimlen = dims.length;

    (function(curve) {
      var order = curve.order;
      var points = curve.points;
      var a = utils.align(points, {p1:points[0], p2:points[order]});
      for(var i=0; i<a.length; i++) {
        if(abs(a[i].y) > 0.0001) {
          curve._linear = false;
          return;
        }
      }
      curve._linear = true;
    }(this));

    this._t1 = 0;
    this._t2 = 1;
    this.update();
  };

  function getABC(n,S,B,E,t) {
    if(typeof t === "undefined") { t = 0.5; }
    var u = utils.projectionratio(t,n),
        um = 1-u,
        C = {
          x: u*S.x + um*E.x,
          y: u*S.y + um*E.y
        },
        s = utils.abcratio(t,n),
        A = {
          x: B.x + (B.x-C.x)/s,
          y: B.y + (B.y-C.y)/s
        };
    return { A:A, B:B, C:C };
  }

  Bezier.quadraticFromPoints = function(p1,p2,p3, t) {
    if(typeof t === "undefined") { t = 0.5; }
    // shortcuts, although they're really dumb
    if(t===0) { return new Bezier(p2,p2,p3); }
    if(t===1) { return new Bezier(p1,p2,p2); }
    // real fitting.
    var abc = getABC(2,p1,p2,p3,t);
    return new Bezier(p1, abc.A, p3);
  };

  Bezier.cubicFromPoints = function(S,B,E, t,d1) {
    if(typeof t === "undefined") { t = 0.5; }
    var abc = getABC(3,S,B,E,t);
    if(typeof d1 === "undefined") { d1 = utils.dist(B,abc.C); }
    var d2 = d1 * (1-t)/t;

    var selen = utils.dist(S,E),
        lx = (E.x-S.x)/selen,
        ly = (E.y-S.y)/selen,
        bx1 = d1 * lx,
        by1 = d1 * ly,
        bx2 = d2 * lx,
        by2 = d2 * ly;
    // derivation of new hull coordinates
    var e1  = { x: B.x - bx1, y: B.y - by1 },
        e2  = { x: B.x + bx2, y: B.y + by2 },
        A = abc.A,
        v1  = { x: A.x + (e1.x-A.x)/(1-t), y: A.y + (e1.y-A.y)/(1-t) },
        v2  = { x: A.x + (e2.x-A.x)/(t), y: A.y + (e2.y-A.y)/(t) },
        nc1 = { x: S.x + (v1.x-S.x)/(t), y: S.y + (v1.y-S.y)/(t) },
        nc2 = { x: E.x + (v2.x-E.x)/(1-t), y: E.y + (v2.y-E.y)/(1-t) };
    // ...done
    return new Bezier(S,nc1,nc2,E);
  };

  var getUtils = function() {
    return utils;
  };

  Bezier.getUtils = getUtils;

  Bezier.prototype = {
    getUtils: getUtils,
    valueOf: function() {
      return this.toString();
    },
    toString: function() {
      return utils.pointsToString(this.points);
    },
    update: function() {
      // one-time compute derivative coordinates
      this.dpoints = [];
      for(var p=this.points, d=p.length, c=d-1; d>1; d--, c--) {
        var list = [];
        for(var j=0, dpt; j<c; j++) {
          dpt = {
            x: c * (p[j+1].x - p[j].x),
            y: c * (p[j+1].y - p[j].y)
          };
          if(this._3d) {
            dpt.z = c * (p[j+1].z - p[j].z);
          }
          list.push(dpt);
        }
        this.dpoints.push(list);
        p = list;
      };
      this.computedirection();
    },
    computedirection: function() {
      var points = this.points;
      var angle = utils.angle(points[0], points[this.order], points[1]);
      this.clockwise = angle > 0;
    },
    length: function() {
      return utils.length(this.derivative.bind(this));
    },
    _lut: [],
    getLUT: function(steps) {
      steps = steps || 100;
      if (this._lut.length === steps) { return this._lut; }
      this._lut = [];
      for(var t=0; t<=steps; t++) {
        this._lut.push(this.compute(t/steps));
      }
      return this._lut;
    },
    on: function(point, error) {
      error = error || 5;
      var lut = this.getLUT(), hits = [], c, t=0;
      for(var i=0; i<lut.length; i++) {
        c = lut[i];
        if (utils.dist(c,point) < error) {
          hits.push(c)
          t += i / lut.length;
        }
      }
      if(!hits.length) return false;
      return t /= hits.length;
    },
    project: function(point) {
      // step 1: coarse check
      var LUT = this.getLUT(), l = LUT.length-1,
          closest = utils.closest(LUT, point),
          mdist = closest.mdist,
          mpos = closest.mpos;
      if (mpos===0 || mpos===l) {
        var t = mpos/l, pt = this.compute(t);
        pt.t = t;
        pt.d = mdist;
        return pt;
      }

      // step 2: fine check
      var ft, t, p, d,
          t1 = (mpos-1)/l,
          t2 = (mpos+1)/l,
          step = 0.1/l;
      mdist += 1;
      for(t=t1,ft=t; t<t2+step; t+=step) {
        p = this.compute(t);
        d = utils.dist(point, p);
        if (d<mdist) {
          mdist = d;
          ft = t;
        }
      }
      p = this.compute(ft);
      p.t = ft;
      p.d = mdist;
      return p;
    },
    get: function(t) {
      return this.compute(t);
    },
    point: function(idx) {
      return this.points[idx];
    },
    compute: function(t) {
      // shortcuts
      if(t===0) { return this.points[0]; }
      if(t===1) { return this.points[this.order]; }

      var p = this.points;
      var mt = 1-t;

      // linear?
      if(this.order===1) {
        ret = {
          x: mt*p[0].x + t*p[1].x,
          y: mt*p[0].y + t*p[1].y
        };
        if (this._3d) { ret.z = mt*p[0].z + t*p[1].z; }
        return ret;
      }

      // quadratic/cubic curve?
      if(this.order<4) {
        var mt2 = mt*mt,
            t2 = t*t,
            a,b,c,d = 0;
        if(this.order===2) {
          p = [p[0], p[1], p[2], ZERO];
          a = mt2;
          b = mt*t*2;
          c = t2;
        }
        else if(this.order===3) {
          a = mt2*mt;
          b = mt2*t*3;
          c = mt*t2*3;
          d = t*t2;
        }
        var ret = {
          x: a*p[0].x + b*p[1].x + c*p[2].x + d*p[3].x,
          y: a*p[0].y + b*p[1].y + c*p[2].y + d*p[3].y
        };
        if(this._3d) {
          ret.z = a*p[0].z + b*p[1].z + c*p[2].z + d*p[3].z;
        }
        return ret;
      }

      // higher order curves: use de Casteljau's computation
      var dCpts = JSON.parse(JSON.stringify(this.points));
      while(dCpts.length > 1) {
        for (var i=0; i<dCpts.length-1; i++) {
          dCpts[i] = {
            x: dCpts[i].x + (dCpts[i+1].x - dCpts[i].x) * t,
            y: dCpts[i].y + (dCpts[i+1].y - dCpts[i].y) * t
          };
          if (typeof dCpts[i].z !== "undefined") {
            dCpts[i] = dCpts[i].z + (dCpts[i+1].z - dCpts[i].z) * t
          }
        }
        dCpts.splice(dCpts.length-1, 1);
      }
      return dCpts[0];
    },
    raise: function() {
      var p = this.points, np = [p[0]], i, k=p.length, pi, pim;
      for (var i=1; i<k; i++) {
        pi = p[i];
        pim = p[i-1];
        np[i] = {
          x: (k-i)/k * pi.x + i/k * pim.x,
          y: (k-i)/k * pi.y + i/k * pim.y
        };
      }
      np[k] = p[k-1];
      return new Bezier(np);
    },
    derivative: function(t) {
      var mt = 1-t,
          a,b,c=0,
          p = this.dpoints[0];
      if(this.order===2) { p = [p[0], p[1], ZERO]; a = mt; b = t; }
      if(this.order===3) { a = mt*mt; b = mt*t*2; c = t*t; }
      var ret = {
        x: a*p[0].x + b*p[1].x + c*p[2].x,
        y: a*p[0].y + b*p[1].y + c*p[2].y
      };
      if(this._3d) {
        ret.z = a*p[0].z + b*p[1].z + c*p[2].z;
      }
      return ret;
    }
  };
;(function( $ ){
/*! FitText.js 1.2 http://sam.zoy.org/wtfpl/ */

  $.fn.fitText = function( kompressor, options ) {

    // Setup options
    var compressor = kompressor || 1,
        settings = $.extend({
          'minFontSize' : Number.NEGATIVE_INFINITY,
          'maxFontSize' : Number.POSITIVE_INFINITY
        }, options);

    return this.each(function(){

      // Store the object
      var $this = $(this);

      // Resizer() resizes items based on the object width divided by the compressor * 10
      var resizer = function () {
        $this.css('font-size', Math.max(Math.min($this.width() / (compressor*10), parseFloat(settings.maxFontSize)), parseFloat(settings.minFontSize)));
      };

      // Call once to set.
      resizer();

      // Call on resize. Opera debounces their resize by default.
      $(window).on('resize.fittext orientationchange.fittext', resizer);

    });

  };

})(jQuery);;// FORM PROCESSING
var fname;
var email;
var message;
    $('#message-link').on('click touchstart',function(e){
        e.preventDefault();
        $('#contact').children('.slide-out').children('.info').addClass('form-open');
        //$('#contact-form').show();
    });
    $('.close').on('click touchstart',function(){
        $('.form-open').removeClass('form-open');
    });

    $("#fname input").on("blur", function(){
        validateName();
    });

    $("#email input").on("blur", function(){
        validateEmail($(this));
    });
    $('#message textarea').on('blur', function(){
        validateText($(this));
    });
    $("#contact-form input").on("focus", function(){
        if($(this).hasClass("form-error")){
            $(this).removeClass("form-error");
        }
    });
     $("#contact-form textarea").on("focus", function(){
        if($(this).hasClass("form-error")){
            $(this).removeClass("form-error");
        }
    });
    $('#message textarea').focus(function(){
        enableSendButton();
    });
	$('form').submit(function(event) {
        $('input[type=submit').attr('disabled',true);
		var formData = {
            'fname'      :  $('input[name=fname]').val(),
            'email'      :  $('input[name=email]').val(),
            'message'    :  $('textarea[name=message]').val()
        };
        // process the form
        $.ajax({
            type        : 'POST', 
            url         : 'php/form-process.php', 
            data        : formData, 
            dataType    : 'json', 
            encode      : true
        }).done(function(data) {
            console.log(data); 
             if (!data.success) {
             	$('.form-errors').show();
             	 if (data.errors.fname) {
             	 	$('input[name=fname]').addClass('error');
             	 	$('.form-errors').append('<div>'+data.errors.fname+'</div');
             	 }
             	 if (data.errors.email) {
             	 	$('input[name=email]').addClass('error');
             	 	$('.form-errors').append('<div>'+data.errors.email+'</div');
             	 }
             	 if (data.errors.message) {
             	 	$('textarea[name=message]').addClass('error');
             	 	$('.form-errors').append('<div>'+data.errors.message+'</div');
             	 }
             }else {
                $('input').not('input[type=submit]').val('');
                $('textarea').val('');
             	$('.thank-you').show();
             	$('.form-open').removeClass('form-open');
             	window.setTimeout(function(){
             		$('.thank-you').hide();
             	},2500);
            }
        });
         event.preventDefault();
	});
// Make sure name field is valid
function validateName(){    
    var entry = capitalize($.trim($("#fname input").val()));
    if(entry ===''){
        $("#fname input").addClass("form-error");
        $("#fname input").val("");
        $("#fname input").attr("placeholder", "Please Enter Your First Name");
        fname = "";
    }else{
        $("#fname").removeClass("form-error");
       fname = entry;
    }

    enableSendButton();
}

// Make sure e-mail field is valid
function validateEmail(thisField){
    var entry = $.trim(thisField.val());
    // If empty field
    if(entry === ''){
        thisField.val("");
        thisField.addClass("form-error");
        thisField.attr("placeholder", "Please Enter Your Email");
    }
    var valid = emailRegex(entry);
    
    // If invalid email
    if(!valid){
        thisField.addClass("form-error");
        email = '';
    }else{
        thisField.removeClass("form-error");
        email = entry;
    }

    enableSendButton();
}
function validateText(thisField){
    var entry = $.trim(thisField.val());
    if(entry === ''){
        thisField.val("");
        thisField.addClass("form-error");
        thisField.attr("placeholder", "Message required.");
    }else {
        $("#message input").removeClass("form-error");
        message = entry;
    }
    enableSendButton();
}
function enableSendButton(){
    if(fname && email && message){
        $(".submit").removeClass('disabled').addClass("active").removeAttr('disabled');
    }else{
        $(".submit").addClass('disabled').removeClass("active").attr('disabled',true);
    }
}
//////////////// UTILITY FUNCTIONS ////////////////
// Returns a string with a Capital first letter
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

// Returns true if it follows a valid e-mail format
function emailRegex(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};var preload_pictures = function(picture_urls, callback) {
	var loaded  = 0;
	var errorCheck = 0;
	var percent= 0;
	var increment = Math.floor(100/picture_urls.length);
	for(var i = 0, j = picture_urls.length; i < j; i++) {
		var img = new Image();
		img.onerror = callback;
		img.onload  = function() {
	  	percent += increment;
	  	//console.log(percent);
	  	if( percent < 10){
	  		document.getElementById('percent').innerHTML = '0'+percent;
	  	}    
	  	else {
	  		document.getElementById('percent').innerHTML = percent;  
	  	}
	    if(++loaded == picture_urls.length && callback) {
	    	//console.log('all images loaded');
	     callback();
	    }
	 };
	 img.src = picture_urls[i];

	 }
};
document.addEventListener("DOMContentLoaded", function(event) {
	preload_pictures([
		'img/actor-planet.png',
		'img/dev-planet.png',
		'img/writer-planet.png',
		'img/glyph.png',
		'img/serenity.png',
		'img/star-bg.jpg',
		'img/slide-out.png',
		'img/will-saunders-resume.jpg',
		'img/willsaunders-commercial.jpg',
		'img/willsaunders-theatrical.jpg',
		'img/pushplay.jpg',
		'img/24lad.jpg',
		'img/blue-bg.png',
		'img/blue-bg2.png',
		'img/nav-btn.png',
		'img/top-bar.png',
		'img/bottom-left-glyph.png',
		'img/top-right-glyph.png',
		'img/top-left-glyph.png',
		'img/bottom-right-glyph.png',
		'img/restart-btn.png',
		'img/nav-btns.png',
		'img/nav-btn.png',
		'img/glow.png',
		'img/right-engine.png',
		'img/left-engine.png',
		'img/intro-text.png',
		'img/explore-btn.png',
		'img/social-btns.png',
		'img/waypoint.gif',
		'img/explosion.gif',
		'img/corp-logos.png'
	], removeLoader);
});
function removeLoader(){
	var el = document.getElementById('loader');
	if(typeof(el) != 'undefined' && el !== null){
		$('#loader').fadeOut(400);
	}else {
		window.setTimeout(function(){
			removeLoader();
		}, 1000);
	}
}
;/*This code is very WIP
ROCKET by Will Saunders
8-20-16
*/
var wrapper = $('#wrapper');
var wOffset = wrapper.offset();
var mouseX,mouseY,anim,oldCoords,xDistance,yDistance;
var Rocket ={
	width:$('#rocket').width(),
	height:$('#rocket').height(),
	halfY:50,
	halfX:92.5,
	speed:125,
	obj: $('#rocket'),
	glow:$('#glow'),
	leftEngine:$('#left-engine'),
	rightEngine:$('#right-engine'),
	isLanding:false,
	isLanded: false,
	isMoving: false,
	isRotating: false,
	isCoasting:false,
	isAccelerating: false,
	isDecelerating:false,
	currQuadX:1,
	currQuadY:1,
	target:{top:0,left:0},
	origin:{left:0,top:0},
	center:{x:0,y:0},
	pos:{left:0,top:0},
	angle:-90,
	isDead: false,
	land: function(){
		var landTween;
		if(!Rocket.isLanded && !Rocket.isLanding){//land
			landTween = TweenMax.to(Rocket.obj,2,{scale:0, overwrite:1, directionalRotation:Rocket.angle+'_short', onStart:function(){
				Rocket.isLanding = true;
			},onComplete:function(){
				Rocket.isLanded = true;
				Rocket.isLanding = false;
				
			}});
		}else if(Rocket.isLanded || Rocket.isLanding === true){//take off
			if(landTween)
				landTween.kill();
			landTween = new TweenMax.to(Rocket.obj,2,{scale:1,overwrite:1, directionalRotation:Rocket.angle+'_short', onStart:function(){
				Rocket.isLanding = true;
			},onComplete:function(){
				Rocket.isLanded = false;
				Rocket.isLanding = false;
			}});
		}
	},
	locate: function(left, top){
		this.pos.left = left || parseInt(this.obj.css('left').match(/\d+/g)[0]);
		this.pos.top = top || parseInt(this.obj.css('top').match(/\d+/g)[0]);
		if(left){
			this.center.x = left + (this.width/2);
			this.center.y =  top + (this.height/2);
		}else {
			this.center.x =  this.pos.left + 92.5;
			this.center.y = this.pos.top + 50;
		}
	},
	fly: function(timestamp){
		if(!Rocket.isMoving){
			Rocket.isMoving = true;
			Rocket.glow.animate({opacity:1},500);
		}
		if (!start) 
			start = timestamp;
	 	var progress = timestamp-start;
		var time = (cDistance/Rocket.speed)*500;
		var t = progress/time;
		var coords;
		if(curve){
			coords = curve.get(t);
		}else {//straight line
			coords = {x:Rocket.origin.left+(xDistance*t),y:Rocket.origin.top+(yDistance*t)};
		}
		if(!oldCoords)
			oldCoords = {x:Rocket.origin.left+Rocket.halfX,y:Rocket.origin.left+Rocket.halfY};
		if(t !==0 && curve){
			var nextAngle = getAngle(coords.x,oldCoords.x,coords.y,oldCoords.y);
			Rocket.angle = nextAngle;
			Rocket.obj.css({left: coords.x-Rocket.halfX,top:coords.y-Rocket.halfY,transform:'rotate('+nextAngle+'deg)'});
		}else {
			Rocket.obj.css({left: coords.x-Rocket.halfX,top:coords.y-Rocket.halfY});
		}
		
		deathCheck(coords.x, coords.y);
		//MOVE WRAPPER
		var wrapMoveX = wOffset.left - (coords.x-oldCoords.x);
		var wrapMoveY = wOffset.top - (coords.y-oldCoords.y);
		if(wrapMoveX > 0)
			wrapMoveX = 0;
		else if(wrapMoveX < -wrapperW + (wrapperW/3))
			wrapMoveX = -wrapperW - (wrapperW/3);
		else if (Rocket.center.x > w/2 && Rocket.center.x < wrapperW - w/2){
			wrapper.css({left: wrapMoveX});
			wOffset = wrapper.offset();
		}
		if(wrapMoveY > 0)
			wrapMoveY = 0;
		else if(wrapMoveY < -wrapperH + (wrapperH/3))
			wrapMoveX = -wrapperH - (wrapperH/3);
		else if (Rocket.center.y > h/2 && Rocket.center.y < wrapperH - h/2){
			wrapper.css({top: wrapMoveY});
			wOffset = wrapper.offset();
		}

		Rocket.locate(coords.x-92.5,coords.y-50);
		oldCoords = coords;
		
		if(progress <= time)
			anim = window.requestAnimationFrame(Rocket.fly);
		else {
			window.cancelAnimationFrame(anim);
			Rocket.glow.animate({opacity:0},500);
			Rocket.leftEngine.animate({opacity:0},300);
			Rocket.rightEngine.stop().animate({opacity:0},300);
			Rocket.isMoving = false;
			//console.log(Rocket.angle);
			$('#waypoint').remove();
			//console.log(checkCollision(coords.x,coords.y));
			checkCollision(coords.x,coords.y);
		//	console.log('Final Angle: '+Rocket.angle);
			//console.log(' ');
		}
	}
};
$(document).ready(function(){
	$('body').mousemove(function(e){
		mouseX = e.pageX-wOffset.left;
		mouseY= e.pageY-wOffset.top;
		var angle = getAngle(mouseX,Rocket.pos.left+92.5,mouseY,Rocket.pos.top+50);
		// angle =angle - Rocket.angle;
		// if(angle > 180)
		// 	angle -=360;
		// else if(angle<-180)
		// 	angle +=360;
		$('#debug .mouse').html(mouseX+', '+mouseY);
		$('#debug .angle').html(Math.round(angle));
		//start = false;
	});

}); // END READY
function flight(x,y,instant){
	$('#waypoint').remove();
	wrapper.append('<div id="waypoint" style="position:absolute; left:'+(x-66.5)+'px;top:'+(y-66.5)+'px;"><img src="img/waypoint.gif" alt="waypoint" draggable = "false"/></div>');
	start = false;
	
	//console.log('mouse: '+mouseX+', '+mouseY)
	var distance = Math.sqrt(Math.pow(x-Rocket.center.x,2)+Math.pow(y-Rocket.center.y,2));
	absAngle  = getAngle(x,Rocket.center.x,y,Rocket.center.y);
	absAngle =absAngle - Rocket.angle;
	if(absAngle > 180)
		absAngle -=360;
	else if(absAngle<-180)
		absAngle +=360;

	if(absAngle > 20){
		Rocket.rightEngine.stop().animate({opacity:0.5},300);
		Rocket.leftEngine.stop().animate({opacity:1},300);
	}else if(absAngle <-20) {
		Rocket.rightEngine.stop().animate({opacity:1},300);
		Rocket.leftEngine.stop().animate({opacity:0.5},300);
	}else {
		Rocket.leftEngine.stop().animate({opacity:1},300);
		Rocket.rightEngine.stop().animate({opacity:1},300);
	}
	if(absAngle <20 && absAngle >-20){
		curve = false;
		cDistance = getDistance(x,oldCoords.x,y,oldCoords.y);
		xDistance = x - Rocket.center.x;
		yDistance = y - Rocket.center.y;
		origAngle = Rocket.angle;

		
		var endAngle = getAngle(x,oldCoords.x,y,oldCoords.y);
		var angleDiff = Rocket.angle - endAngle;
		if(Rocket.angle > 90 && endAngle < -90 )
			endAngle+=360;
		else if(Rocket.angle <-90 && endAngle >90)
			endAngle-=360;
		$({angle:Rocket.angle}).stop().animate({angle:endAngle},{duration:((cDistance/125)*500)/2, step:function(now,fx){
			if(fx.pos > 0)
			Rocket.obj.css({transform:'rotate('+(now)+'deg)'});
			Rocket.angle = now;
		}});
		anim = window.requestAnimationFrame(Rocket.fly);
	}else {
		adjPath(x,y);
		curve = new Bezier(Rocket.center.x,Rocket.center.y, cp1X,cp1Y, cp2X,cp2Y, x,y);
		cDistance = curve.length();
		//if(cDistance > 400 || Rocket.isMoving){
		//	var curveP=curve.getLUT();
			// console.log(curveP);
			// for(i=0;i<curveP.length;i+=4){
			// 	$('#waypoints').append('<div class="waypoint" style="top:'+(curveP[i].y-5) +'px;left:'+(curveP[i].x-5)+'px;"></div>');
			// }
		anim = window.requestAnimationFrame(Rocket.fly);
	//	}
		// else if(cDistance<400 && !Rocket.isMoving) {
		// 	//console.log(Rocket.angle+absAngle);
		// 	TweenMax.to(Rocket.obj,.6,{directionalRotation:Rocket.angle+absAngle+'_short',onUpdate:function(){
		// 		//set new Rocket Angle, every frame in case user clicks again.
		// 		var matrix = Rocket.obj.css('transform');
		// 		Rocket.angle = matrix2Angle(matrix);
		// 	},onComplete:function(){
		// 		adjPath();
				
		// 		curve = new Bezier(Rocket.center.x,Rocket.center.y, cp1X,cp1Y,cp2X,cp2Y, x,y);
		// 		var curveP=curve.getLUT();
		// 		for(i=0;i<curveP.length;i+=4){
		// 			$('#waypoints').append('<div class="waypoint" style="top:'+(curveP[i].y-5) +'px;left:'+(curveP[i].x-5)+'px;"></div>');
		// 		}
		// 		cDistance = curve.length();
		// 		anim = window.requestAnimationFrame(Rocket.fly);
		// 	}});
		// }
	}
}
////// HELPER FUNCTIONS ///////////
function easeInOut(time, begValue, changeValue, duration) {
		if ((time/duration/2) < 1) return changeValue/2*time*time*time + begValue;
		return changeValue/2*((time-=2)*time*time + 2) + begValue;
	}
function getAngle(x2,x1,y2,y1){
	var angle = Math.degrees(Math.atan2(y2-y1,x2-x1));
	return angle;
}
Math.degrees = function(radians) {
  return (radians * 180) / Math.PI;
};
function getDistance(x2,x1,y2,y1){
	return	Math.sqrt((Math.pow((x2 - x1),2)) + (Math.pow((y2-y1),2)));
}
Math.radians = function(angle){
	return angle * Math.PI/180;
};
function getSlope(x2,x1,y2,y1){
	return (y2-y1) / (x2-x1);
}
function matrix2Angle(matrix){
	var values = matrix.split('(')[1];
    values = values.split(')')[0];
    values = values.split(',');
	var a = values[0];
	var b = values[1];
	var c = values[2];
	var d = values[3];
	var angle = (Math.atan2(b, a) * 180)/Math.PI;
	return angle;
}
var getPositionData = function(el) {
    return $.extend({
        width: el.outerWidth(false),
        height: el.outerHeight(false)
    }, el.offset());
};
var start = false;

var curve,cDistance,absAngle,cp2Angle,angleDistance,distRatio,cp2Distance,cp1X,cp1Y,cp2X,cp2Y;
function adjPath(x,y){
	absAngle  = getAngle(x,Rocket.center.x,y,Rocket.center.y);
	angleDistance = Math.sqrt((Math.pow((x - (Rocket.pos.left+92.5)),2)) + (Math.pow((y-(Rocket.pos.top+50)),2)));
	absAngle =absAngle - Rocket.angle;
	if(absAngle > 180)
		absAngle -=360;
	else if(absAngle<-180)
		absAngle +=360;

	cp2Angle = (180 + Rocket.angle) +(absAngle*2);
	if(absAngle < -90 && absAngle >-150)
		cp2Angle+=90;
	if(absAngle > 90 && absAngle < 150)
		cp2Angle -=90;
	distRatio = Math.abs((absAngle/90)*0.5);
	
	 if(absAngle < -150 || absAngle > 150 ){
	 	distRatio=1.3;
	 	if(absAngle <0)
	 		cp2Angle+=115;
	 	else
	 		cp2Angle-=115;
	 }
	distRatio = Math.max(0.1,distRatio);
	cp2Distance = angleDistance* distRatio;
	
	cp1X = Rocket.center.x + cp2Distance* (Math.cos(Math.radians(Rocket.angle)));
	cp1Y = Rocket.center.y + cp2Distance* (Math.sin(Math.radians(Rocket.angle)));
	cp2X = x + cp2Distance*( Math.cos(Math.radians(cp2Angle)));
	cp2Y = y+ cp2Distance*( Math.sin(Math.radians(cp2Angle)));
}
;var w,h,devPlanet,actorPlanet,writerPlanet,oldHash=location.hash;
var notHomepage = (location.hash.length>1) ? true:false;
var moonPlayed = false, marchPlayed = false;
var audioPlaying = false;
var muted = false;
var url = location.origin +location.pathname;
var introOn = (!oldHash) ? true:false;
$(document).ready(function(){
	w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	wrapperW = $('#wrapper').width();
	wrapperH = $('#wrapper').height();
	var intro = $('#intro');
	$('body').fitText(1.5);
	devPlanet = new Planet($('#dev'),1,1);
	actorPlanet = new Planet($('#actor'),1,1);
	writerPlanet = new Planet($('#writer'),1,1);
	deathArray = [sun = new DeathObj($('#sun'),2,1,'Nice try, Icarus!'),deathStar = new DeathObj($('#death-star'),0,0,'Now you know the true power of the dark side.')];
	console.log(deathArray);
	//Initialization
	$('#rocket').css({left:(wrapperW/2) -92.5,top:(wrapperH/2)-50});
	Rocket.locate();
	

	//GALAXY MOVE
	var hoverTimeout,hoverInterval;
	var wrapperMoveAnim = false;
	var start2 = false;
	var centerPoint = {x:w/2,y:h/2};
	var inc = 10;
	var upperBound = 0;
	var bottomBound = -(wrapperH -h);
	var leftBound = 0;
	var rightBound = -(wrapperW-w);

	// GLYPH ANIMATIONS 
	var topLeft =$('.top-left-corner');
	var topRight = $('.top-right-corner');
	var bottomLeft = $('.bottom-left-corner');
	var bottomRight = $('.bottom-right-corner');

	var toCorners = new TimelineLite({paused:true});
		toCorners.add('start',0)
		.staggerTo(topLeft,0.5,{left:-7,top:-13,scale:1},0.2,'start')
		.staggerTo(topRight,0.5,{right:-9,top:-13,scale:1},0.25,'start')
		.staggerTo(bottomLeft,0.5,{left:-11,bottom:-9,scale:1},0.5,'start')
		.staggerTo(bottomRight,0.5,{right:-9,bottom:-8,scale:1},0.25,'start');

	var paneLeft = $('#pane').position().left;
	var paneTop = $('#pane').position().top;
	var paneH = $('#pane').outerHeight();
	console.log(paneH)
	var toPane = new TimelineLite({paused:true});
		toPane.add('start',0);
		toPane.staggerTo(topLeft,0.5,{left:paneLeft-17,top:paneTop-16,scale:1},0.2,'start');
		toPane.staggerTo(topRight,0.5,{right:paneLeft-19,top:paneTop-16,scale:1},0.25,'start');
		toPane.staggerTo(bottomLeft,0.5,{left:paneLeft-11,bottom:h-(paneTop+paneH)-15,scale:1},0.5,'start');
		toPane.staggerTo(bottomRight,0.5,{right:paneLeft-14,bottom:h-(paneTop+paneH)-15,scale:1},0.25,'start');


	
	if(introOn){
		loadIntro();
	}else {
		intro.hide();
	}
	
	$(window).resize(function(){
		w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
		$('body').fitText(2);
		devPlanet = new Planet($('#dev'));
		actorPlanet = new Planet($('#actor'));
		writerPlanet = new Planet($('#writer'));
		$('body').fitText(1.5);
		//$('#intro').css({top:(h-$('#intro').height())/2});
	});

	// SET CORNERS TO INTRO.
	// topLeft.css({
	// 	top:introTop-13,
	// 	left:introLeft-7
	// });
	// topRight.css({
	// 	top:introTop-13, 
	// 	right:introLeft-9
	// });
	// bottomLeft.css({
	// 	bottom: h-(introTop+introH+9), 
	// 	left:introLeft-11
	// });
	// bottomRight.css({
	// 	bottom: h-(introTop+introH+9), 
	// 	right:introLeft-10
	// });
	$('#pane').on('click touchstart', '.backToSpace',function(){
		backToSpace();
	});
	$('#overlay').on('click touchstart',function(e){
		e.stopPropagation();
		backToSpace();
	});
	Rocket.obj.on('click',function(e){
		e.stopPropagation();
		if(!audioPlaying && !muted)
			$('#cantdo')[0].play();
	});

	// AUDIO CONTROLS / EVENTS
	$('audio').on('ended',function(){
		audioPlaying = false;
	});
	$('audio').on('play',function(){
		audioPlaying = true;
	});
	$('#audio-ctrl').on('click touchstart', function(){
		muted = (muted === false) ? true:false;
		$(this).toggleClass('muted');
		if(muted){
			$('audio').each(function(){
				this.volume = 0;
			});
		}else {
			$('audio').each(function(){
				this.volume =1;
			});
		}
	});

	//Planet Highlight Circles 
	var swooshTo = false;
	// var swoosh1 = TweenMax.to($('.glyph').eq(0),8,{rotation:360,repeat:-1,ease:'linear'});
	// var swoosh2 = TweenMax.to($('.glyph').eq(1),8,{rotation:360,repeat:-1,ease:'linear'});
	// var swoosh3 = TweenMax.to($('.glyph').eq(2),8,{rotation:510,repeat:-1,ease:'linear'});
	// var swoosh4 = TweenMax.to($('.glyph').eq(3),8,{rotation:-360,repeat:-1,ease:'linear'});
	$('.glyph').each(function(){
		TweenMax.to($(this),8,{rotation:360,repeat:-1,ease:'linear'});
	});
	 
	var slideOut;
	$('.planet-holder').on('mouseover touchstart touchmove', function(e){
		var tween = TweenMax.getTweensOf($(this).find('.glyph'));
		tween[0].pause();
		var index = $('.planet-holder').index(this);
		 if(!slideOut){
		 	if(index === 1) {
				degrees=156;
			}else if(index === 2){
				degrees=334;
			}else if(index===3) {
		 		degrees=157;
			}else {
				degrees=331;
			}
		 	swooshTo = new TweenMax.to($(this).find('.glyph'),0.3,{directionalRotation:degrees+'_short',ease:Power3.easeOut, onComplete:function(){
				$(this.target[0]).next().fadeIn(500);
		 	}});
		}
		slideOut =true;
	}).on('mouseleave touchend', function(e){
		swooshTo.kill();
		var tween = TweenMax.getTweensOf($(this).find('.glyph'));
		 $(this).children('.slide-out').fadeOut(500,function(){
		 		if(tween[0].target[0].className =='glyph c2' || tween[0].target[0].className =='glyph c4'){
		 			tween[0].resume(7.5666, true);
		 		}else {
		 			tween[0].resume(3.4666,true);
		 		}
		 	slideOut = false;
		});
	});
	
	//EVENT HANDLERS
	wrapper.on('click', function(e){
		mouseX = e.pageX-wOffset.left;
		mouseY= e.pageY-wOffset.top;
		Rocket.target.left = mouseX;
		Rocket.target.top = mouseY;
		Rocket.isLanded = false;
		if(introOn){
			toCorners.play();
			introOn = false;
		}

		Rocket.currQuadX = Math.floor(mouseX/w);
		Rocket.currQuadY = Math.floor(mouseY/h);
		quadAction(Rocket.currQuadX,Rocket.currQuadY);
		//console.log(Rocket.currQuadX,Rocket.currQuadY);

		if(!Rocket.isDead && !Rocket.isLanded){
			window.cancelAnimationFrame(anim);
			oldCoords = {x:Rocket.center.x,y:Rocket.center.y};
			Rocket.origin= {left:Rocket.center.x,top:Rocket.center.y};
			flight(mouseX,mouseY);
		}

	});
	$('#menu a').on('click touchstart',function(e){
		var $this = this;
		goTo(e,$this);
	});
	$('.waypoint-btn').on('click touchstart',function(e){
		var $this = this;
		goTo(e,$this);
	});
	$('#nav-btn').on('touchstart',function(){
		$('#menu').show();
	});
	intro.on('click', function(e){
		e.stopPropagation();
		hideIntro();
	});
	var currSlide = 0;
	var flipped = false;
	var isFlipping = false;
	$('#pane').on('click touchstart', '.num', function(){
		if(!$(this).hasClass('active')){
			
			if(!isFlipping){
				isFlipping = true;
				var index = $(this).index();
				$('.active').removeClass('active');
				$(this).addClass('active');
				var newHtml = $('.slide').eq(index).html();
				if(!flipped)	
					$('#screen-back').html(newHtml);
				else 
					$('#screen-front').html(newHtml);

				TweenMax.to($('#screen'),0.5, {rotationY:'+=180', onComplete:function(){
					flipped = (!flipped) ? true:false;
					isFlipping = false;
				}});
			}
		}
	});

	function loadIntro(){
		var introTop = intro.position().top;
		var introH = intro.innerHeight();
		var introLeft = intro.offset().left;
		var toIntro = new TimelineLite();
		toIntro.add('start',0)
		.staggerTo(topLeft,0.5,{left:introLeft-7,top:introTop-13,scale:0.7},0.2,'start')
		.staggerTo(topRight,0.5,{right:introLeft-9,top:introTop-13,scale:0.7},0.25,'start')
		.staggerTo(bottomLeft,0.5,{left:introLeft-11,bottom: h-(introTop+introH+9),scale:0.7},0.5,'start')
		.staggerTo(bottomRight,0.5,{right:introLeft-13,bottom: h-(introTop+introH+9),scale:0.7},0.25,'start');
	}
	function backToSpace(){
		location.hash='';
		$('#overlay').fadeOut(1000);
		$('.content').fadeOut(1000,function(){
			$('#pane').removeClass('front');
		});
		toCorner = new TimelineLite();
		toCorner.add('start',0)
		.staggerTo(topLeft,0.5,{left:-7,top:-13,scale:1},0.2,'start')
		.staggerTo(topRight,0.5,{right:0-9,top:-13,scale:1},0.25,'start')
		.staggerTo(bottomLeft,0.5,{left:-11,bottom:-9,scale:1},0.5,'start')
		.staggerTo(bottomRight,0.5,{right:-4,bottom:-5,scale:1},0.25,'start');
		if(!notHomepage)
			Rocket.land();
		notHomepage = false;
	}
	function hideIntro(){
		intro.fadeOut(400);
		toCorners.play();
	}
	function goTo(e, $this){
		window.cancelAnimationFrame(anim);
		if(Rocket.isLanded)
			backToSpace();
		var hash = $($this).attr('href');
		oldCoords = {x:Rocket.center.x,y:Rocket.center.y};
		Rocket.origin= {left:Rocket.center.x,top:Rocket.center.y};
		if(hash =='developer'){
			flight(devPlanet.centerX,devPlanet.centerY);
		}else if(hash == 'writer') {
			flight(writerPlanet.centerX,writerPlanet.centerY);
		}else if(hash == 'actor'){
			flight(actorPlanet.centerX,actorPlanet.centerY);
		}
		hideIntro();
		notHomepage = false;
		e.stopPropagation();
		e.preventDefault();
	}
	window.onhashchange = function(e){
		hashChange(location.hash);
	};
	function resetPages(){
		$('#scroll-bar').css({top:0});
		$('.content').css({top:0});
	}
	function hashChange(hash){
		var collided = hash.substr(2);
		console.log('oldhash: '+oldHash);
		oldHash = hash;
		if(collided){
			if(!introOn)
				intro.hide();
			$('#pane').addClass('front');
			$('.content').fadeIn(1000);
			$('#overlay').fadeIn(1000);
			
			$.get(collided+'.html', function(data){
				$('#pane .content').html(data);
				if(collided =='actor'){
					TweenMax.from([$('.actor-container section'),$('.actor-container .header')],1,{width:0, onComplete:function(){
					//	$('#reel iframe').attr('width',$('#reel .section-inner').width()/2);
						//$('#reel iframe').attr('height',($('#reel .section-inner').width()/2)*0.5625);
					}});
					$('.actor-container img').each(function(){
						this.onload = function(){
							paneH = $('.actor-container').innerHeight();
							var toPane = new TimelineLite({paused:true});
							toPane.add('start',0);
							toPane.staggerTo(topLeft,0.5,{left:paneLeft-17,top:paneTop-16,scale:1},0.2,'start');
							toPane.staggerTo(topRight,0.5,{right:paneLeft-19,top:paneTop-16,scale:1},0.25,'start');
							toPane.staggerTo(bottomLeft,0.5,{left:paneLeft-11,bottom:h-(paneTop+paneH)-15,scale:1},0.5,'start');
							toPane.staggerTo(bottomRight,0.5,{right:paneLeft-14,bottom:h-(paneTop+paneH)-15,scale:1},0.25,'start');
							toPane.play('start');
						}
					});
				}else if (collided=='developer'){
					$('.window').fitText(7.4);
					paneH = $('.content > div').outerHeight(true);
					var toPane = new TimelineLite({paused:true});
					toPane.add('start',0);
					toPane.staggerTo(topLeft,0.5,{left:paneLeft-17,top:paneTop-16,scale:1},0.2,'start');
					toPane.staggerTo(topRight,0.5,{right:paneLeft-19,top:paneTop-16,scale:1},0.25,'start');
					toPane.staggerTo(bottomLeft,0.5,{left:paneLeft-11,bottom:h-(paneTop+paneH)-15,scale:1},0.5,'start');
					toPane.staggerTo(bottomRight,0.5,{right:paneLeft-14,bottom:h-(paneTop+paneH)-15,scale:1},0.25,'start');
					toPane.play('start');
				}else { //writer
					TweenMax.from([$('.writer-container section'),$('.writer-container .header')],1,{width:0, onComplete:function(){
						paneH = $('.writer-container').innerHeight();
						console.log(paneH)
						var toPane = new TimelineLite({paused:true});
						toPane.add('start',0);
						toPane.staggerTo(topLeft,0.5,{left:paneLeft-17,top:paneTop-16,scale:1},0.2,'start');
						toPane.staggerTo(topRight,0.5,{right:paneLeft-19,top:paneTop-16,scale:1},0.25,'start');
						toPane.staggerTo(bottomLeft,0.5,{left:paneLeft-11,bottom:h-(paneTop+paneH)-15,scale:1},0.5,'start');
						toPane.staggerTo(bottomRight,0.5,{right:paneLeft-14,bottom:h-(paneTop+paneH)-15,scale:1},0.25,'start');
						toPane.play('start');
					}});
					
				}
			});
		}
	}

	hashChange(location.hash);
}); //END READY
function checkCollision(x,y){
	var collided = false;
	if(x>devPlanet.left && x < devPlanet.right){
		if(y>devPlanet.top && y < devPlanet.bottom){
			collided='developer';
		}
	}else if(x>actorPlanet.left && x < actorPlanet.right){
		if(y>actorPlanet.top && y <actorPlanet.bottom){
			collided='actor';
		}		
	}else if(x>writerPlanet.left && x < writerPlanet.right){
		if(y>writerPlanet.top && y < writerPlanet.bottom){
			collided='writer';
		}
	}
	if(collided){
		Rocket.land();
		location.hash = '#!'+collided;
		return collided;
	}else {
		return false;
	}
}
var dModal = $('#death-modal');
var deathLaser = false;
function deathCheck(x,y){
	var died = false;
	var i;
	var laser = false;
	for(i=0; i<deathArray.length; i++){
		if(x >deathArray[i].left)
			if(x<deathArray[i].right)
				if(y>deathArray[i].top)
					if(y<deathArray[i].bottom){
						died = deathArray[i];
						//console.log(died)
						window.cancelAnimationFrame(anim);
					}
	}
	if(died) {
		
		$('#waypoint').remove();
		if(died.name == 'death-star'){
			if(!deathLaser){
				deathLaser = true;
				$('#death-laser').animate({opacity:1},500,function(){
					var laserAngle = getAngle(Rocket.center.x,$('.laser').position().left-$('#death-star').offset().left,Rocket.center.y, $('.laser').position().top+$('#death-star').offset().top);
					var laserDistance = getDistance(Rocket.center.x, $('.laser').position().left+$('#death-star').offset().left, Rocket.center.y, $('.laser').position().top+$('#death-star').offset().top);
					//console.log(laserAngle)
					$('.laser').css({transform:'rotate('+laserAngle+'deg)'});
					$('.laser').stop(true).animate({width:laserDistance, ease:'linear'}, 50,function(){
						explode();
						deathMessage(died.message);
						$(this).delay(100).css({width:0});
						$('#death-laser').delay(100).css({opacity:0});
					});
				});
			}
		}else {
			explode();
			deathMessage(died.message);
		}
	}
}
var warp = new Sprite(19,$('#warp'),1583);
function quadAction(quadX,quadY){
	if(quadX === 0){
		if(quadY === 0){
			//Quad 1 = Death Star
			if(!moonPlayed){
				if(!muted){
					document.getElementById('moon').play();
					moonPlayed = true;
				}
			}
		}else if(quadY === 1){
			//Quad 4
		}else if(quadY === 2){
			//Quad 7
			if(!marchPlayed)
				$('#march')[0].play();
				marchPlayed = true;
			TweenMax.to($('#leia-ship'),40,{top:'100%',left:'-100%',scale:0.7,ease:Power0.easeIn,onComplete:function(){
				$('#leia-ship').remove();

			}});
			TweenMax.to($('#star-destroyer'),90,{top:'100%',left:'-150%',scale:1.5,ease:Power0.easeIn,onComplete:function(){
				$('#star-destroyer').remove();
				$('#march')[0].pause();
			}});
		}
	}else if(quadX === 1){
		if(quadY === 0){
			//Quad 2
			

			if(!warp.isAnimating){
				warp.play(true);
			}
		}else if(quadY === 1){

		}else if(quadY === 2){
			
		}
	}else if(quadX===2){
		if(quadY === 0){

		}else if(quadY === 1){

		}else if(quadY === 2){
			
		}
	}
}
function explode(){
	Rocket.isDead = true;
	Rocket.obj.addClass('exploding').children('#explosion').html('<img src="img/explosion.gif" alt="boom">');
	setTimeout(function(){Rocket.obj.children('#explosion').html('');},2400);
}
function deathMessage(message){
	dModal.children('#message').html(message);
	TweenMax.to(dModal,1,{top:(h/2)-20});
	$('#restart').one('click',restart);
}
function restart(){
	TweenMax.to(dModal,1,{top:'125%'});
	Rocket.obj.removeClass('exploding').css({left:(w+w/2)-Rocket.halfX,top:(h+h/2)-Rocket.halfY, transform:'rotate(-90deg)'});
	TweenMax.to(wrapper,2,{top:-h,left:-w, onComplete:function(){
		wOffset = wrapper.offset();
		Rocket.isDead = false;
		Rocket.locate();
		deathLaser = false;
		Rocket.angle = -90;
		Rocket.obj.children('#explosion').html('');
	}});
}	
//planet object
function Planet(obj,quadX,quadY) {
	this.top= (h*quadY)+obj.position().top;
	this.left=(w*quadX)+obj.position().left;
	this.height = obj.innerHeight();
	this.width = obj.innerWidth();
	this.bottom= this.top + this.height;
	this.right= this.left+this.width;
	this.centerX = this.left + this.width/2;
	this.centerY = this.top + this.height/2;
	this.name = obj.attr('id');
}
function DeathObj(obj,quadX,quadY,dthMsg){
	this.top = (h*quadY)+obj.position().top + obj.children('.hit-box').position().top;
	this.left = (w*quadX) + obj.position().left+ obj.children('.hit-box').position().left;
	this.height = obj.children('.hit-box').innerHeight();
	this.width = obj.children('.hit-box').innerWidth();
	this.bottom= this.top + this.height;
	this.right= this.left+this.width;
	this.centerX = this.left + this.width/2;
	this.centerY = this.top + this.height/2;
	this.name = obj.attr('id');
	this.message = dthMsg;
}
function Sprite(frames, obj, time){ //amount of frames, jQuery object, time in MS
	this.index = 0;
	this.isAnimating = false;
	this.width = obj.width();
	this.totalWidth = frames*this.width;
	this.timerVar =false;
	this.play = function(once){
		this.isAnimating = true;
		obj.show();
		var index = 0;
		var width = this.width;
		this.timerVar = setInterval(function(){
			if( index < frames){
				obj.css('background-position', -(index * width)+'px 0');
				index++;
			}else if(once === false){
				index = 0;
				obj.css('background-position', -(index * width)+'px 0');
			}
		},time/12, this.index, width);

	},
	this.stopAnim = function(){
		this.isAnimating = false;
		window.clearInterval(this.timerVar);
		obj.hide();
	};
};	var ctrlH,containerH,trackH, topLimit,bottomLimit,contentPercent;
	var sliderPos = 0;
	var sliderTop =0;
	var slidePercent = 0;
	var contentH = 0;
	var scrollDist=0;
	var contentsTop =0;
$(document).ready(function(){
	$('#scroll-bar').on('mousedown',function(e){
		e.preventDefault();
		$(this).addClass('dragging');
		$('body').on('mousemove', function(e){
			sliderPos = e.pageY -ctrlH/2;
			if (sliderPos < topLimit)
				sliderPos = topLimit;
			if (sliderPos >= containerH+15)
				sliderPos = containerH+15;
			$('.dragging').offset({
				top:sliderPos
			});
			sliderTop = sliderPos-topLimit; //0-655
			slidePercent = ((sliderTop)/ (trackH-30)*contentPercent);
			scrollDist = Math.round(slidePercent * contentH); 
			if (scrollDist> (contentH - containerH)+30)
				scrollDist= contentH -containerH + 30;

			$('.content div').eq(0).css({top:-scrollDist});
		}).on('mouseup',function(){
			$('.dragging').removeClass('dragging');
			$(this).off('mousemove');
		}).on('mouseleave',function(){
			$('.dragging').removeClass('dragging');
			$(this).off('mousemove');
		});
	});	

	// MOUSEWHEEL SCROLL
	//IE, Opera, Safari

	$(document).on('wheel mousewheel', function (e) {
		var increment = 50;
		//SCROLL DOWN
		if(e.originalEvent.wheelDelta < 0 || e.originalEvent.deltaX > 0 || e.originalEvent.deltaY>0){
			if (sliderTop >=containerH-30-increment){ 
				sliderTop= sliderTop + (containerH -30- sliderTop); 
			}else {
				sliderTop = sliderTop + increment;
			}
			$('#scroll-bar').animate({top:sliderTop},100);
			slidePercent = (sliderTop / (trackH-30))*contentPercent;
			scrollDist = Math.round(slidePercent * contentH);
			if (scrollDist> (contentH - containerH)-0)
				scrollDist= contentH -containerH - 0;
			$('.content div').eq(0).animate({top:-scrollDist},100);	
		//SCROLL UP
		}else {
		
			if (sliderTop < increment){ 
				sliderTop = 0;
			}else {
				sliderTop = sliderTop - increment;
			}
			$('#scroll-bar').animate({top:sliderTop},100);
			slidePercent = (sliderTop / (trackH-30))*contentPercent;
			scrollDist = Math.round(slidePercent * contentH);
			$('.content div').eq(0).animate({top:-scrollDist},100);
		}
		return false;
	});
	//MOBILE INTERACTIONS 
	var touchStartY = 0;
	document.addEventListener('touchstart',function(e){
		e.preventDefault();
		var touchStart = e.changedTouches[0];
		touchStartY = touchStart.pageY;
		
	},false);
	document.addEventListener('touchmove',function(e){
		e.preventDefault();
		var touchMove = e.changedTouches[0];
		var touchEndY= touchMove.pageY;
		
		scrollDist= touchEndY - touchStartY;
		var upperStop = contentH - containerH;

		if (contentsTop+scrollDist< -upperStop){ // 0 + -321 = -321 < -3768
			scrollDist=-(upperStop + contentsTop); 
		}else if(contentsTop+scrollDist> 0){ //0+ -321 > 0
			scrollDist=-contentsTop;
		}
		$('.content').css({top:contentsTop+scrollDist}); //-321
	},false);

	document.addEventListener('touchend',function(e){
		//$('#scroll-bar').removeClass('dragging');
		var touchMove = e.changedTouches[0];
		var touchEndY= touchMove.pageY;
		contentsTop = $('.content').position().top;
	},false);
	updateScrollVars();
});
function resizeIframes(){
	$('#magnifier iframe').attr('width', $('#magnifier .section-inner').width());
	$('#magnifier iframe').attr('height', $('#magnifier .section-inner').width()*0.75);
	$('#reel iframe').attr('width',$('#reel .section-inner').width());
	$('#reel iframe').attr('height',$('#reel .section-inner').width()*0.5625);
	updateScrollVars();
}
function updateScrollVars(){
	containerH = $('#pane').height();
	contentH = $('.content').outerHeight();
	contentPercent = (contentH - containerH)/contentH;
	$('#scroll').css({height:containerH});
	ctrlH = $('#scroll-bar').height();
	trackH = $("#scroll").height();
	topLimit = $('#scroll').offset().top;
	bottomLimit = trackH+topLimit;
}
$('.content iframe').load(function(){
	resizeIframes();
	updateScrollVars();
});