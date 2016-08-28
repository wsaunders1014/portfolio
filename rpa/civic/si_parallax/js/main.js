document.createElement("article");
document.createElement("section");

var yPagePosition = 0, isScrolling = false, yStartScroll, yLastScroll;
var OVER_SCROLL_HANDLE = false, OVER_SCROLL_GUTTER = false, HANDLE_CURSOR_DIST = 0, SCROLLING = false, LAST_SCROLL_Y = 0, IS_ANIMATING = false;
var maxSteps = 8600, minSteps = 0;
var RUN_ARROWS = true, TO_ARROWS;
var MAX_INNER_HEIGHT = $(window).innerHeight();
var ACTIVE_DOWN_ARROW = false, ACTIVE_UP_ARROW = false, END_IS_REACHED = false, START_IS_REACHED = false;
var ORIGINAL_HEIGHT = 4599, CURRENT_HEIGHT = 4599, ORIGINAL_WIDTH = 1152, CURRENT_WIDTH = 1152, PERCENT_WIDTH = 1, PERCENT_HEIGHT = 1;
var original_animations = [];
var IsUpArrowClicked = false;

$(document).ready(function () {

		var ctrlH = $('#slider-ctrl').outerHeight();
		var windowH = $(window).height();
		var trackH = $("#track").height();
		var topLimit = $('#slider').offset().top;
		
		$('#slider-ctrl').on('mousedown',function(event){
			event.preventDefault();
			$(this).addClass('dragging');


			$('body').on('mousemove', function(event){
				var bottomLimit = trackH+topLimit;

				sliderPos = event.pageY -ctrlH/2;
				if (sliderPos < topLimit)
					sliderPos = topLimit;
				if (sliderPos > bottomLimit)
					sliderPos = bottomLimit;
				$('.dragging').offset({
					top:sliderPos
				});
				var sliderTop = $('#slider-ctrl').position().top;
				$('#scroll-cta').delay(500).fadeOut(500);
				var slidePercent = (sliderTop / trackH);
				yPagePosition = slidePercent * maxSteps;
				animate();
				
			}).on('mouseup',function(){
				$('.dragging').removeClass('dragging');
				$(this).off('mousemove');
			}).on('mouseleave',function(){
				$('.dragging').removeClass('dragging');
				$(this).off('mousemove');
			});
			
		});
	//MOBILE SCROLL BAR
		document.addEventListener('touchmove',function(event){
			event.preventDefault();
		},false);
		var touchStartY = 0;

			
			document.addEventListener('touchstart',function(event){
				event.preventDefault();
				var touchStart = event.changedTouches[0];
				var touchStartY = touchStart.pageY;

				
				

			},false);
			document.addEventListener('touchmove',function(event){
				event.preventDefault();
				var touchMove = event.changedTouches[0];
				var touchEndY= touchMove.pageY;


				  sliderPos = touchMove.pageY;

				var bottomLimit = trackH+topLimit;
				if (sliderPos < topLimit)
					sliderPos = topLimit;
				if (sliderPos > bottomLimit)
					sliderPos = bottomLimit;
				$('#slider-ctrl').offset({
					top:sliderPos
				});
				var sliderTop = $('#slider-ctrl').position().top;
				$('#scroll-cta').delay(500).fadeOut(500);
				var slidePercent = (sliderTop / trackH);
				yPagePosition = slidePercent * maxSteps;
				animate();
			},false);
	
    
    setMaxInnerHeight();
    //maxSteps  = MAX_INNER_HEIGHT;
    /************* begin vertical motion ********************/
    $(window).scroll(function (e) {
	// console.log('scroll');
       e.preventDefault();
       return false;
    }).mouseup(function () {
        isScrolling = false;
        SCROLLING = false;
    }).mousemove(function (event) {

        // scroll using the scrollbar
        if (SCROLLING && !IS_ANIMATING) {
            IS_ANIMATING = true;
            var top = eval(event.pageY - HANDLE_CURSOR_DIST);
            var max_top = $(window).innerHeight() - $('#scrollBar .thumb').height();
            if (top < 0) top = 0;
            else if (top > max_top) top = max_top;
            $('#scrollBar .thumb').css('top', top + 'px');
            var ypos = (top / max_top) * maxSteps;
            animObject(null, ypos - LAST_SCROLL_Y);
            LAST_SCROLL_Y = ypos;
            IS_ANIMATING = false;
        }
    });

    // mouse click
    $('#frame').mousedown(function (event) {
        yLastScroll = event.pageY;
        if (!SCROLLING) isScrolling = true;
    }).mouseup(function (event) {
        isScrolling = false;
        yLastScroll = event.pageY;
    }).mousemove(function (event) {
        if (isScrolling) animObject(event);
    });

    

    // touch
    if (isTouch()) {
        document.addEventListener('touchstart', function (e) {
            e.preventDefault();
            isScrolling = true;
            var touch = e.touches[0];
            yLastScroll = touch.pageY;
        }, false);
        document.addEventListener('touchend', function (e) {
            e.preventDefault();
            isScrolling = false;
        }, false);
        document.addEventListener('touchmove', function (e) {
            e.preventDefault();
            var touch = e.touches[0];
            animObject(touch);
        }, false);
    }

    // mousewheel

    //Firefox
    $('#frame').bind('DOMMouseScroll', function (e) {
		$('#scroll-cta').delay(500).fadeOut(500);
		var sliderPercentage = yPagePosition/maxSteps;
		var newPos = trackH * sliderPercentage;
        //scroll down
        if (e.originalEvent.detail > 0) {
			animObject(null, 20);
			$('#slider-ctrl').stop().animate({top:newPos},200);
        //scroll up
       } else {
			animObject(null, -20);
			$('#slider-ctrl').stop().animate({top:newPos},200);
		}
        return false;
    });

    //IE, Opera, Safari
    $('#frame').bind('wheel mousewheel', function (e) {
		$('#scroll-cta').delay(500).fadeOut(500);
		var sliderPercentage = yPagePosition/maxSteps;
		var newPos = trackH * sliderPercentage;
		
        //scroll down
        if (e.originalEvent.wheelDelta < 0 || e.originalEvent.deltaX > 0){
		
			animObject(null, 50);
			
			$('#slider-ctrl').stop().animate({top:newPos},200);
		}
        //scroll up
        else {
			animObject(null, -50);
			$('#slider-ctrl').stop().animate({top:newPos},200);
		}
        return false;
    });

    /************* end vertical motion ********************/
   

    $('#arrows div.down').click(function () {
        IsUpArrowClicked = false;
        ACTIVE_DOWN_ARROW = true;
        goDown();
    }).mouseover(function (event) {
        if (!IsUpArrowClicked)
            ACTIVE_DOWN_ARROW = true;
        else
            ACTIVE_DOWN_ARROW = false;
        goDown();
    }).mouseout(function () {
        ACTIVE_DOWN_ARROW = false;
        clearTimeout(moveTO);
    });
    $('#arrows div.up').mouseover(function (event) {
        ACTIVE_UP_ARROW = true;
        goUp();
    }).mouseout(function () {
        ACTIVE_UP_ARROW = false;
        clearTimeout(moveTO);
    });
    
    CURRENT_WIDTH = $(document).width();
    CURRENT_HEIGHT = $('#verticalScrollArea').height();
    
    original_animations = deepCopy(animations);
    updateAnimationValues();

    $(window).resize(function () {
        updateAnimationValues();
		ctrlH = $('#slider-ctrl').outerHeight();
		windowH = $(window).height();
		trackH = $("#track").height();
		topLimit = $('#slider').offset().top;
		
		$('#slider-ctrl').css('top',0);
		yPagePosition = 0;
		$('#verticalScrollArea').removeAttr('style');
    });

});
var moveTO;
var goDown = function () {
    if (ACTIVE_DOWN_ARROW) {
        animObject(null, 6);
        moveTO = setTimeout(goDown, 1);
    }
};
var goUp = function() {
    if (ACTIVE_UP_ARROW) {
        animObject(null, -6);
        moveTO = setTimeout(goUp, 1);
    }
};

// detect touch events
function isTouch() {
    return 'ontouchstart' in window;
}
function deepCopy(obj) {
    if (Object.prototype.toString.call(obj) === '[object Array]') {
        var out = [], i = 0, len = obj.length;
        for (; i < len; i++) {
            out[i] = arguments.callee(obj[i]);
        }
        return out;
    }
    if (typeof obj === 'object') {
        var out = {}, i;
        for (i in obj) {
            out[i] = arguments.callee(obj[i]);
        }
        return out;
    }
    return obj;
}
var dwnArrow='';
/***************** set object animation ***************/
function animObject(event, yStep, usingBar) {

    var y = (event) ? event.pageY : ((yStep) ? yStep : 0);
    var minLimit = 0, maxLimit = $(window).height() - 50;
    var moveSteps = (yStep) ? yStep : eval(y - yLastScroll);
    
    if ((yPagePosition + moveSteps) < maxSteps && (yPagePosition + moveSteps) > minSteps) {
            
        yPagePosition += moveSteps;
        //$('body').scrollTop(Math.abs(yPagePosition));
        yLastScroll = y;
        animate();
        
    }
	if(yPagePosition > 8470) {
				
				if($('#scrollToTop').length == 0){
					dwnArrow = $('#arrows .down').detach();
					$('#arrows').append('<div id="scrollToTop"><img src="images/arrow-to-top.png"/></div>');
					ACTIVE_DOWN_ARROW = false;
				}
			}else if(yPagePosition <= 8470){
				
				
					$('#scrollToTop').remove();
					$('#arrows').append(dwnArrow);
					
					ACTIVE_DOWN_ARROW = true;
				
			}
    // move scrollbar handle
    if (!usingBar) {
        
    }


}

function animate() {
    for (var x = 0; x < animations.length; x++) {

        var anim = animations[x];
        var obj = $(anim.selector);
        for (var s = 0; s < anim.styles.length; s++) {

            var style = anim.styles[s];
            var closest = getClosestValues(style.points, yPagePosition);
            var active = (typeof closest[0] != 'undefined' && typeof closest[1] != 'undefined');

            var currentVal = parseInt($(obj).css(style.name).replace('px', ''));
            if (active) {
                $(obj).css(style.name, propertyValue(anim.selector, closest[0], closest[1], style.values[closest[2]], style.values[closest[3]], (style.name == 'opacity')));
            } else {
                $(obj).css(style.name, lastPropertyValue(anim.selector, closest[0], closest[1], style.values[closest[2]], style.values[closest[3]]));         
            }	
	
        }
    }
}

// returns nearest integers in an array (above and below the number provided) 
// and also returns the indices of those array items
var getClosestValues = function(a, x) {
    var lo = -1, hi = a.length;
    var hindex = -1, lindex = -1;
    while (hi - lo > 1) {
        var mid = Math.round((lo + hi)/2);
        if (a[mid] <= x) {
            lo = mid;
        } else {
            hi = mid;
        }
    }
    if (a[lo] == x) hi = lo;
    return [a[lo], a[hi], lo, hi];
}

function lastPropertyValue(name, startPos, endPos, startVal, endVal) {
    if (typeof endPos != 'undefined') return endVal;
    else if (typeof startPos != 'undefined') return startVal;

}

function propertyValue(name, startPos, endPos, startVal, endVal, usePercent) {
    var percent = ((endPos - startPos) - (endPos - yPagePosition)) / (endPos-startPos); // ((yPagePosition - startPos) / endPos);
    var distance = (endVal - startVal);
    var value = (distance * percent) + startVal;
    if (usePercent) {
        if (startVal < endVal) value = startVal + ((endVal - startVal) * percent);
        else value = startVal - ((startVal - endVal) * percent);
    }
    return value;
}



function setMaxInnerHeight() {
    MAX_INNER_HEIGHT = $('#verticalScrollArea').prop('scrollHeight') - document.body.clientHeight- 500; // 500 is the total vertical adjustments in anim process
    
}

function updateAnimationValues() {
	CURRENT_WIDTH = $(document).width();
    CURRENT_HEIGHT = $('#verticalScrollArea').height();
    PERCENT_HEIGHT = (CURRENT_HEIGHT / ORIGINAL_HEIGHT);
    PERCENT_WIDTH = (CURRENT_WIDTH / ORIGINAL_WIDTH);
    for (var obj in original_animations) {

        for (var style in original_animations[obj].styles) {
            var name = style.name;
            if (name == 'opacity') continue;

            var percent = PERCENT_WIDTH;
            switch (name) {
                case 'top':
                case 'margin-top':
                case 'padding-top':
                case 'bottom':
                    percent = PERCENT_HEIGHT;
                    break;
            }

    for (var n = 0; n < original_animations[obj].styles[style].values.length; n++) {
        var value = original_animations[obj].styles[style].values[n];
                if (value != 0 && value!=1) {
                    value = parseFloat(value * percent);
                    animations[obj].styles[style].values[n] = value;
                }
				else if(value ==1){
					percent =1;
					 value = parseFloat(value * percent);
                    animations[obj].styles[style].values[n] = value;
				}
            }

        }
    }

  //  console.log(original_animations);
	//console.log(animations);
}

/*************************** ELEMENT ANIMATION SETTINGS *******************************************/
var animations = [
    {
        selector: '#verticalScrollArea',
        styles: [
            {
                name: 'top',
                points: [0,      404,      1000,  1250,  2050,  2700,  6800, 7200],
                values: [0, -803, -803, -1608, -1608, -2409, -2409, -3213]
            }
        ]
    },
    {
        selector: 'div#dial',
        styles: [
            {
                name: 'opacity',
                points: [0, 121, 404],
                values: [0.2, 1, 0.1]
            },
            {
                name: 'margin-top',
                points: [0, 300],
                values: [-356.467, 100]
            }
        ]
    },
	{
        selector: 'div#shifter',
        styles: [
            
            {
                name: 'bottom',
                points: [200, 300],
                values: [-100, 0]
            }
        ]
    },
    {
        selector: 'div#gratification',
        styles: [
            {
                name: 'margin-top',
                points: [200, 400, 1000, 1250],
                values: [0, 350, 350, 815]
            },
            {
                name: 'opacity',
                points: [300, 504],
                values: [0, 1]
            }
        ]
    },
    {
        selector: 'div#gratification div.text',
        styles: [
            {
                name: 'opacity',
                points: [500, 600],
                values: [0, 1]
            }
        ]
    },
    {
        selector: '#section3 div#meter',
        styles: [
            {
                name: 'bottom',
                points: [1050, 1250],
                values: [1000, 60]
            },
            {
                name: 'opacity',
                points: [1050, 1250],
                values: [0, 1]
            }
        ]
    },
    {
        selector: '#section3 div#dots',
        styles: [
            {
                name: 'width',
                points: [0, 1499, 1500, 1599, 1600, 1699, 1700, 1799, 1800, 1899, 1900, 1999, 2000],
                values: [0, 0, 86, 86, 172, 172, 258, 258, 344, 344, 430, 430, 516]
            }
        ]
    },
    {
        selector: '#section3 div#meter img',
        styles: [
            {
                name: 'opacity',
                points: [1350, 1650],
                values: [0, 1]
            }
        ]
    },
    {
        selector: '#section4 div#power',
        styles: [
            {
                name: 'margin-top',
                points: [2400, 2600],
                values: [-158, 100]
            }
        ]
    },
    {
        selector: '#section4 div#power img',
        styles: [
            {
                name: 'opacity',
                points: [2800, 3000],
                values: [0, 1]
            },
          
        ]
    },
    {
        selector: '#section4 div#inner',
        styles: [
            {
                name: 'left',
                points: [			     2999,                3400,               3401,              3800,              3801,			   4200,			  4201,				 4600,              4601,              5000,               5001,              5400, 5401,5800],
                values: [  -360.798469,  -360.798469, -300.998724,-300.998724,-241.19898,-241.19898,-181.19898,-181.19898,-120.19898,-120.19898, 
				-61.19898,-61.19898,0,0]
            } //55.79974489795918 = 3 bars
        ]
    },
    
    {
        selector: '#section5 div#pedal',
        styles: [
            {
                name: 'margin-top',
                points: [7000, 7200],
                values: [-190, 480]
            },
        ]
    },
    {
        selector: '#section5 div#pedal img',
        styles: [
            {
                name: 'opacity',
                points: [7200, 7400],
                values: [0, 1]
            }
        ]
    },
    {
        selector: '#section5 div#pedaldots1',
        styles: [
            {
                name: 'opacity',
                points: [7200, 7400, 7600, 7800],
                values: [0, 1, 1, 0]
            }
        ]
    },
    {
        selector: '#section5 div#pedaldots2',
        styles: [
            {
                name: 'opacity',
                points: [7600, 7800, 8000, 8200],
                values: [0, 1, 1, 0]
            }
        ]
    },
    {
        selector: '#section5 div#pedaldots3',
        styles: [
            {
                name: 'opacity',
                points: [8000, 8200, 8400, 8600],
                values: [0, 1, 1, 0]
            }
        ]
    }
];