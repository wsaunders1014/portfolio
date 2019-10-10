
document.createElement("article");
document.createElement("section");

var yPagePosition = 0, isScrolling = false, yStartScroll, yLastScroll;
var OVER_SCROLL_HANDLE = false, OVER_SCROLL_GUTTER = false, HANDLE_CURSOR_DIST = 0, SCROLLING = false, LAST_SCROLL_Y = 0, IS_ANIMATING = false;
var maxSteps = 10700, minSteps = 0;
var RUN_ARROWS = true, TO_ARROWS;
var MAX_INNER_HEIGHT = $(window).innerHeight();
var ACTIVE_DOWN_ARROW = false, ACTIVE_UP_ARROW = false, END_IS_REACHED = false, START_IS_REACHED = false;
var ORIGINAL_HEIGHT = 5000, CURRENT_HEIGHT = 5000, ORIGINAL_WIDTH = 1152, CURRENT_WIDTH = 1152, PERCENT_WIDTH = 1, PERCENT_HEIGHT = 1;
var original_animations = [];

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

    

    // mousewheel

    //Firefox
    $('#frame').bind('DOMMouseScroll', function (e) {
		$('#scroll-cta').delay(500).fadeOut(500);
		var sliderPercentage = yPagePosition/maxSteps;
		var newPos = trackH * sliderPercentage;
        //scroll down
        if (e.originalEvent.detail > 0) {
			animObject(null, 50);
			$('#slider-ctrl').stop().animate({top:newPos},200);
        //scroll up
       } else {
			animObject(null, -50);
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
		
			animObject(null, 35);
			
			$('#slider-ctrl').stop().animate({top:newPos},200);
		}
        //scroll up
        else {
			animObject(null, -35);
			$('#slider-ctrl').stop().animate({top:newPos},200);
		}
        return false;
    });

    /************* end vertical motion ********************/
   
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
var goDown = function() {
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
      
        yLastScroll = y;
        animate();
       
		
    }

			if(yPagePosition > 10680) {
				
				if($('#scrollToTop').length == 0){
					dwnArrow = $('#arrows .down').detach();
					$('#arrows').append('<div id="scrollToTop"><img src="images/arrow-to-top.png"/></div>');
				}
			}else if(yPagePosition <= 10680){
			
					$('#scrollToTop').remove();
					$('#arrows').append(dwnArrow);
				
				
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
	console.log(PERCENT_HEIGHT);
	console.log(PERCENT_WIDTH);
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
                if (value != 0 && value != 1) {
                    value = parseFloat(value * percent);
                    animations[obj].styles[style].values[n] = value;
                }
				else if(value ==1) {
				percent = 1;
				value = parseFloat(value * percent);
                animations[obj].styles[style].values[n] = value;
				}
            }

        }
    }

//    console.log(original_animations);
//    console.log(animations);
}

/*************************** ELEMENT ANIMATION SETTINGS *******************************************/
var animations = [
    {
        selector: '#verticalScrollArea',
        styles: [
            {
                name: 'top',
                points: [0,      600,    2900,  3200,  5000,  5500,  6600,  7100,  10000,  10400], // 1250, 2050, 2700, 5000, 5500],
                values: [0, -803,-803, -1606, -1606, -2409.5, -2409.5, -3213, -3213, -4018] //-753.317, -1558, -1558, -2475, -2475, -3351]
            }
        ]
    },
    {
        selector: 'div#thumbs-up',
        styles: [
            {
                name: 'margin-top',
                points: [400, 600],
                values: [0, 350]
            },
            {
                name: 'opacity',
                points: [1300, 1400],
                values: [1, 0]
            }
        ]
    },
    {
        selector: 'div#thumbs-up div.text',
        styles: [
            {
                name: 'opacity',
                points: [500, 900],
                values: [0, 1]
            }
        ]
    },
	{
        selector: 'div#disclaimer',
        styles: [
            {
                name: 'opacity',
                points: [500, 900,1300,1400],
                values: [0, 1,1,0]
            }
        ]
    },
	 {
        selector: 'div#black-overlay',
        styles: [
            {
                name: 'left',
                points: [1350, 1700],
                values: [-369, 2]
            }
        ]
    },
	{
        selector: 'img#screen1',
        styles: [
            {
                name: 'opacity',
                points: [1800, 1801],
                values: [0, 1]
            }
        ]
    },
	{
        selector: 'img#screen2',
        styles: [
            {
                name: 'opacity',
                points: [2100, 2101],
                values: [0, 1]
            }
        ]
    },
	{
        selector: 'img#screen3',
        styles: [
            {
                name: 'opacity',
                points: [2400, 2401],
                values: [0, 1]
            }
        ]
    },
	{
        selector: 'img#screen4',
        styles: [
            {
                name: 'opacity',
                points: [2700, 2701],
                values: [0, 1]
            }
        ]
    },
	{
       selector: 'div#distraction-free',
        styles: [
            {
                name: 'margin-right',
                points: [1350, 1700],
                values: [-220, 200]
           }
       ]
    },
	{
       selector: 'div#distraction-free div.text',
        styles: [
            {
                name: 'opacity',
                points: [1700, 1950],
                values: [0, 1]
           }
       ]
    },
	{
       selector: 'div#hello',
        styles: [
            {
                name: 'top',
                points: [3000, 3200],
                values: [314, 440]
           }
       ]
    },
	{
       selector: 'div#hello-list',
        styles: [
            {
                name: 'top',
                points: [4050, 5000],
                values: [-1314, 900]
           },
		    {
                name: 'opacity',
                points: [3850, 4100],
                values: [0, .2]
           }
       ]
    },
	{
       selector: 'div#hello div.text',
        styles: [
            {
                name: 'opacity',
                points: [3400, 3600],
                values: [0, 1]
           }
       ]
    },
	{
       selector: 'div#comfort-zone',
        styles: [
            {
                name: 'margin-top',
                points: [5250, 5500],
                values: [0, 400]
           }
       ]
    },
	{
       selector: 'div#comfort-zone div.text',
        styles: [
            {
                name: 'opacity',
                points: [5600, 5800],
                values: [0, 1]
           }
       ]
    },
	{
       selector: 'div#comfort div.text',
        styles: [
            {
                name: 'opacity',
                points: [7200, 7400],
                values: [0, 1]
           }
       ]
    },
	{
       selector: 'div#plus-sign',
        styles: [
            {
                name: 'opacity',
                points: [7600, 7800],
                values: [0, 1]
           }
       ]
    },
	{
       selector: 'div#convenience ',
        styles: [
            {
                name: 'opacity',
                points: [8000, 8200],
                values: [0, 1]
           }
       ]
    },
	{
       selector: 'div#convenience div.text',
        styles: [
            {
                name: 'opacity',
                points: [8400, 8600],
                values: [0, 1]
           }
       ]
    },
	{
       selector: 'img#seat1',
        styles: [
            {
                name: 'opacity',
                points: [8800, 8801],
                values: [0, 1]
           }
       ]
    },
	{
       selector: 'img#seat2',
        styles: [
            {
                name: 'opacity',
                points: [9000, 9001],
                values: [0, 1]
           }
       ]
    },
	{
       selector: 'img#seat3',
        styles: [
            {
                name: 'opacity',
                points: [9200, 9201],
                values: [0, 1]
           }
       ]
    },
	{
       selector: 'img#seat4',
        styles: [
            {
                name: 'opacity',
                points: [9400, 9401],
                values: [0, 1]
           }
       ]
    },
	{
       selector: 'img#seat5',
        styles: [
            {
                name: 'opacity',
                points: [9601, 9601],
                values: [0, 1]
           }
       ]
    },
	{
       selector: 'div#quick-easy ',
        styles: [
            {
                name: 'margin-top',
                points: [10300, 10400],
                values: [200, 500]
           }
       ]
    },
	{
       selector: 'div#quick-easy div.text',
        styles: [
            {
                name: 'opacity',
                points: [10500, 10700],
                values: [0, 1]
           }
       ]
    }
	
];