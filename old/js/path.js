/*
 * jQuery css bezier animation support -- Jonah Fox
 * version 0.0.1
 * Released under the MIT license.
 */
/*
  var path = $.path.bezier({
    start: {x:10, y:10, angle: 20, length: 0.3},
    end:   {x:20, y:30, angle: -20, length: 0.2}
  })
  $("myobj").animate({path: path}, duration)
*/

;(function($){

  $.path = {};

  var V = {
    rotate: function(p, degrees) {
      var radians = degrees * Math.PI / 180,
        c = Math.cos(radians),
        s = Math.sin(radians);
      return [c*p[0] - s*p[1], s*p[0] + c*p[1]];
    },
    scale: function(p, n) {
      return [n*p[0], n*p[1]];
    },
    add: function(a, b) {
      return [a[0]+b[0], a[1]+b[1]];
    },
    minus: function(end, start) {
      return [end[0]-start[0], end[1]-start[1]];
    }
  };

  $.path.bezier = function( params, rotate ) {
    params.start = $.extend( {angle: 0, length: 0.3333}, params.start );
    params.end = $.extend( {angle: 0, length: 0.3333}, params.end );

    this.start = [params.start.x, params.start.y];//point1 start 
    this.end = [params.end.x, params.end.y];  //point4 start

    var v14 = V.minus( this.end, this.start ),
      v12 = V.scale( v14, params.start.length ),
      v41 = V.scale( v14, -1 ),
      v43 = V.scale( v41, params.end.length );

    v12 = V.rotate( v12, params.start.angle );
    this.p2 = V.add( this.start, v12 );
    console.log(this.p2);
    $('body').append('<div class="waypoint" style="top:'+this.p2[1] +'px;left:'+this.p2[0] +'px;background-color:red;"></div>');


    v43 = V.rotate(v43, params.end.angle );
    this.p3 = V.add( this.end, v43 );
    console.log(this.p3);
     $('body').append('<div class="waypoint" style="top:'+this.p3[1] +'px;left:'+this.p3[0] +'px;background-color:red;"></div>');

    this.f1 = function(t) { return (t*t*t); };
    this.f2 = function(t) { return (3*t*t*(1-t)); };
    this.f3 = function(t) { return (3*t*(1-t)*(1-t)); };
    this.f4 = function(t) { return ((1-t)*(1-t)*(1-t)); };

    /* p from 0 to 1 */
    this.css = function(p) {
      var f1 = this.f1(p), f2 = this.f2(p), f3 = this.f3(p), f4=this.f4(p), css = {};
      if (rotate) {
        css.prevX = this.x;
        css.prevY = this.y;
      }
      css.x = this.x = ( this.start[0]*f1 + this.p2[0]*f2 +this.p3[0]*f3 + this.end[0]*f4 +.5 ); //remove | 0 from end;
      css.y = this.y = ( this.start[1]*f1 + this.p2[1]*f2 +this.p3[1]*f3 + this.end[1]*f4 +.5 );  //remove | 0 from end;
      css.left = css.x + "px";
      css.top = css.y + "px";
      return css;
    };
  };
  $.path.quadBezier = function( params, rotate ) {
    params.start = $.extend( {angle: 0, length: 0.3333}, params.start );
    params.end = $.extend( {angle: 0, length: 0.3333}, params.end );

    this.start = [params.start.x, params.start.y];//point1 start 
    this.middle = [params.middle.x,params.middle.y];
    this.end = [params.end.x, params.end.y];  //point4 start

     $('body').append('<div class="waypoint" style="top:'+this.middle[1] +'px;left:'+this.middle[0] +'px;background-color:red;"></div>');

    this.f1 = function(t) { return (t*t); };
    this.f2 = function(t) { return (2*t*(1-t)); };
    this.f3 = function(t) { return ((1-t)*(1-t)); };

    /* p from 0 to 1 */
    this.css = function(p) {
      var f1 = this.f1(p), f2 = this.f2(p), f3 = this.f3(p), css = {};
      if (rotate) {
        css.prevX = this.x;
        css.prevY = this.y;
      }
      css.x = this.x = ( this.start[0]*f1 + this.middle[0]*f2  + this.end[0]*f3 +.5 ); //remove | 0 from end;
      css.y = this.y = ( this.start[1]*f1 + this.middle[1]*f2  + this.end[1]*f3 +.5 );  //remove | 0 from end;
      css.left = css.x + "px";
      css.top = css.y + "px";
      return css;
    };
  };

  // $.path.arc = function(params, rotate) {
  //   for ( var i in params ) {
  //     this[i] = params[i];
  //   }

  //   this.dir = this.dir || 1;

  //   while ( this.start > this.end && this.dir > 0 ) {
  //     this.start -= 360;
  //   }

  //   while ( this.start < this.end && this.dir < 0 ) {
  //     this.start += 360;
  //   }

  //   this.css = function(p) {
  //     var a = ( this.start * (p ) + this.end * (1-(p )) ) * Math.PI / 180,
  //       css = {};

  //     if (rotate) {
  //       css.prevX = this.x;
  //       css.prevY = this.y;
  //     }
  //     css.x = this.x = ( Math.sin(a) * this.radius + this.center[0] +.5 )|0;
  //     css.y = this.y = ( Math.cos(a) * this.radius + this.center[1] +.5 )|0;
  //     css.left = css.x + "px";
  //     css.top = css.y + "px";
  //     return css;
  //   };
  // };
var degrees;
  $.fx.step.path = function(fx) {
    var css = fx.end.css( 1 - fx.pos );
    if ( css.prevX != null ) {
     
      //This doesn't work. "Uncaught TypeError: Cannot read property 'set' of undefined."
      //$.cssHooks.transform.set( fx.elem, "rotate(" + Math.atan2(css.prevY - css.y, css.prevX - css.x) + ")" );
      //console.log(css);
      //Got it to work but there was a really bad stutter. If either x or y sum is 0, it makes the angle 90, and if both are 0, it makes it 0

      //if(css.x - css.prevX > 0 && css.y - css.prevY > 0){
        //this works for right turns facing N
      //   degrees = -Math.degrees(Math.atan2(css.prevX - css.x,css.prevY - css.y));

       //  fx.elem.style.transform= "rotate(" +  (degrees) + "deg)";
      if(css.prevX-css.x != 0) {
        if( css.prevY - css.y != 0){
          $('body').append('<div class="waypoint" style="top:'+(css.y+92.5) +'px;left:'+(css.x+50)+'px;"></div>');
        //this works for right turns facing N
        degrees = -Math.degrees(Math.atan2(css.prevX - css.x,css.prevY - css.y));
       // console.log(90-Math.abs(degrees));
        fx.elem.style.transform= "rotate(" +  (degrees) + "deg)";
        }
      }
     // console.log(degrees);
      Rocket.angle = degrees;
    }

    //the 
    fx.elem.style.top = (css.y)+'px';
    fx.elem.style.left = (css.x )+'px';
    Rocket.left = css.x;
    Rocket.top = css.y;
    Rocket.centerX = css.x-50;
    Rocket.centerY = css.y-92.5;
  
  };

})(jQuery);