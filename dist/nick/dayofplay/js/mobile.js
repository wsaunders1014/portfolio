var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
var chosenStuff = [];
var chosenWhere = false;
var chosenPlayers = false;
var currentCat = null;
var stuff = ['baseball-glove', 'baseball', 'blindfold', 'cardboard-box', 'chair', 'cooler', 'garbage-lid', 'masking-tape', 'mittens', 'music', 'plastic-bat', 'protective-gear', 'rope', 'sled', 'small-items', 'snow', 'soccer-ball', 'spoon', 'stuffed-animal', 'toy-hoops', 'watch', 'paper', 'broom', 'bucket', 'tennis-ball', 'ball', 'bouncy-ball', 'chalk', 'plastic-cups', 'tennis-rackets', 'water', 'towel', 'balloon', 'sticks', 'skateboard', 'empty-cans', 'basketball', 'foam-dart-blaster', 'foam-darts', 'none'];
var where = ['driveway', 'field', 'pool', 'backyard', 'sidewalk'];
var players = ['1', '2', '3', '4', '5', '6-7', '8-or-more'];
var featured = "BUCKET CATCH N’ TOSS";
var featuredGameObj;
var gameObj;
var divided = Math.floor(stuff.length / 6);
var modulus = stuff.length % 6;
if (modulus > 0)
    divided++;
var gameW;
var gameResults = false;
var galleryOut = false;
var starplayerOut = false;
var tmntOut = false;
var slideOut = false;
var galleryArray;
var tmntArray;
var completeMessageTimeout;

var gameLimit = 6;

var currentBadgeGameId = 30;

function date(timeStamp, callback) {
    var current = new Date();
    var expiry = new Date(timeStamp)

    if (current.getTime() > expiry.getTime()) {
        callback();
    }
}

date("May 1, 2016 00:00:00", function() {
    gameLimit = 3;
});

date("June 1, 2016 00:00:00", function() {
    gameLimit = 0;
});

$(document).ready(function() {
    tracking.call('landing');
    $('#main').css({
        height: h + $('#bottom').innerHeight() - 28
    });
    games = games['games'];
    galleryArray = games.slice(0, games.length - gameLimit);
    gamesTMNT = gamesTMNT['games'];
    tmntArray = gamesTMNT.slice(0, gamesTMNT.length - gameLimit);
    newThisWeek();
    sortByNewest();
    // loadGalleryTMNT();
    $(document).on('touchmove', function(e) {
        e.preventDefault();
    });
    var scrolling = false;
    $('body').on('touchstart', '.scrollable', function(e) {
        // Only execute the below code once at a time
        // console.log(e);
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
    $('body').on('touchmove', '.scrollable', function(e) {
        e.stopPropagation();
    });
    var touchStart;
    var touchEnd;
    $('.game-gallery').on('touchstart touchmove', function(e) {
        e.stopPropagation();
    });
    $('.scrollable').on('touchstart', function(e) {
        //console.log(e);
        touchStart = e.originalEvent.changedTouches[0].pageY;
    }).on('touchmove', function(e) {
        touchEnd = e.originalEvent.changedTouches[0].pageY;
        //console.log(touchEnd);
        if (touchEnd > touchStart && $(this).hasClass('scrolled') == false) {
            e.preventDefault();
            //console.log('down');
        } else {
            $(this).addClass('scrolled');
        }
    });
    $('.quiz-item').click(function() {
        var index = $(this).index() + 1;
        var cat = $(this).attr('data-cat');
        currentCat = cat;
        $('.quiz-frame').removeClass('where how blue');
        if (index != 4) {
            $('.quiz-frame .text').attr('src', 'img/quiz/' + currentCat + '-header.png');
            $('#answers').removeClass().addClass(cat);
            if (index == 1) {
                tracking.call('what');
                $('.quiz-frame').addClass('blue');
                $('#answer-close-btn').addClass('blue');
                $('#game-quiz .arrow.right').show();

                for (i = 1; i < divided + 1; i++) {
                    $('#answers').append('<div class="page page-' + i + '"></div>');
                }

                for (i = 0; i < stuff.length; i++) {
                    var div = Math.floor(i / 6);
                    div++;
                    if (chosenStuff.indexOf(stuff[i]) != -1) {
                        //it is selected
                        totalStuff++;
                        $('#answers .page.page-' + div).append('<div id="' + stuff[i] + '" class="answer selected" style="opacity: 0;" data-id="' + stuff[i] + '"><img class="icon" src="../img/stuff/' + stuff[i] + '.png"/><div class="title">' + deDash(stuff[i]) + '</div></div>');
                    } else {
                        $('#answers .page.page-' + div).append('<div id="' + stuff[i] + '" class="answer" style="opacity: 0;" data-id="' + stuff[i] + '"><img class="icon" src="../img/stuff/' + stuff[i] + '.png"/><div class="title">' + deDash(stuff[i]) + '</div></div>');
                    }
                    if (i == stuff.length - 1) {
                        var images = $(".answer img");
                        var loadedImgNum = 0;
                        images.on('load', function() {
                            loadedImgNum += 1;
                            if (loadedImgNum == images.length) {
                                $('.answer').animate({
                                    opacity: 1
                                }, 200);
                            }
                        });
                    }
                }
            } else if (index == 2) {
                tracking.call('how');
                $('.quiz-frame').addClass('how');
                for (i = 0; i < players.length; i++) {
                    $('#answers').append('<div class="answer" style="opacity: 0;" data-id="' + players[i] + '"><img class="icon" src="../img/players/' + players[i] + '.png"/></div>');
                    if (i == players.length - 1) {
                        var images = $(".answer img");
                        var loadedImgNum = 0;
                        images.on('load', function() {
                            loadedImgNum += 1;
                            if (loadedImgNum == images.length) {
                                $('.answer').animate({
                                    opacity: 1
                                }, 200);
                            }
                        });
                    }
                }
            } else {
                tracking.call('where');
                $('.quiz-frame').addClass('where');
                for (i = 0; i < where.length; i++) {
                    if (i == 3)
                        $('#answers').append('<div class="clear"></div>');
                    $('#answers').append('<div id="' + where[i] + '" class="answer" style="opacity: 0;" data-id="' + where[i] + '"><img class="icon" src="../img/where/' + where[i] + '.png"/><div class="title">' + deDash(where[i]) + '</div></div>');
                    if (i == where.length - 1) {
                        var images = $(".answer img");
                        var loadedImgNum = 0;
                        images.on('load', function() {
                            loadedImgNum += 1;
                            if (loadedImgNum == images.length) {
                                $('.answer').animate({
                                    opacity: 1
                                }, 200);
                            }
                        });
                    }
                }
            }
            $('.quiz-frame').delay(400).fadeIn(400);
            $('#quiz-questions').fadeOut(300);
        } else {
            //random game
            randomGame();
        }
    });
    var page = 0;
    $('#game-quiz ').on('click', '.arrow', function() {
        if ($(this).hasClass('left')) {
            $('.arrow.right').show();
            $('.page').eq(page).fadeOut(300);
            page--;
            if (page == 0)
                $('.arrow.left').hide();
            $('.page').eq(page).delay(200).fadeIn(300);
        } else {
            $('.page').eq(page).fadeOut(300);
            $('.arrow.left').show();
            page++;
            if (page == divided - 1) {
                $('.arrow.right').hide();
            }
            $('.page').eq(page).delay(200).fadeIn(300);
        }
    });
    var totalStuff = 0;
    $('#answers').on('click tap', '.answer', function() {
        if (currentCat == 'stuff') {

            chosenStuff = [];
            chosenStuff.push($(this).attr('data-id'));
            if (chosenStuff.length > 0) {
                $('#' + currentCat + ' .image').addClass('active').html('<img src="../img/stuff/' + chosenStuff[0] + '.png"/>');
                enablePlayBtn();
            } else {
                $('#stuff').children('.image').html('').removeClass('active');
            }
            $('.quiz-frame').fadeOut(300, function() {
                $('#answers').html('');
                $('.quiz-frame').removeClass('blue');
                $('#answer-close-btn').removeClass('blue');
                $('#game-quiz .arrow').hide();
            });
            $('#quiz-questions').fadeIn(300);
            page = 0;

        } else if (currentCat == 'players') {
            $('.quiz-frame').removeClass('how');
            chosenPlayers = $(this).attr('data-id');
            $('#' + currentCat + ' .image').addClass('active').html('<img src="../img/players/' + chosenPlayers + '.png"/>');
            $('.quiz-frame').fadeOut(300, function() {
                $('#answers').html('');
                $('.quiz-frame').removeClass('blue');
            });
            $('#quiz-questions').fadeIn(300);
            enablePlayBtn();
        } else if (currentCat == 'where') {
            chosenWhere = $(this).attr('data-id');
            $('.quiz-frame').removeClass('where');
            $('#' + currentCat + ' .image').addClass('active').html('<img src="../img/where/' + chosenWhere + '.png"/>');
            $('.quiz-frame').fadeOut(300, function() {
                $('#answers').html('');
                $('.quiz-frame').removeClass('blue');
            });
            $('#quiz-questions').fadeIn(300);
            enablePlayBtn();
        }
        currentCat = null;
        tracking.call('landing');
    });
    $('#answer-close-btn').click(function() {
        tracking.call('landing');
        totalStuff = 0;
        if (chosenStuff.length == 0) {
            $('#stuff').children('.image').html('').removeClass('active');
        }
        $('.quiz-frame').fadeOut(300, function() {
            $('#answers').html('');
            $('.quiz-frame').removeClass('blue');
            $('#game-quiz .arrow').hide();
        });
        $('#quiz-questions').fadeIn(300);
        page = 0;
        currentCat = 'landing';
    });
    $('.play-btn').click(function() {

        if ($(this).hasClass('active')) {
            tracking.call('play');
            gameResults = true;
            hideBottomMenu();
            TweenMax.to($('#game-quiz'), 0.7, {
                top: '100%',
                display: 'none'
            });
            TweenMax.set($('#game-container'), {
                display: 'block'
            })
            TweenMax.to($('#game-container'), 0.7, {
                top: '21%'
            });
            loadGames();
            TweenMax.to($('#back-btn'), 0.5, {
                left: '1%',
                delay: 0.3
            });
        } else {
            window.clearTimeout(completeMessageTimeout);
            $('#main #game-quiz .play-btn').css({
                backgroundPosition: '0 100%'
            });
            completeMessageTimeout = window.setTimeout(function() {
                $('#main #game-quiz .play-btn').css({
                    backgroundPosition: '0 50%'
                });
            }, 2000);
        }
    });
    ///////////// BACK BUTTON ////////////////////
    $("#back-btn").click(function() {
        //back button for game results
        if (slideOut == true) {
            //if game slide is out
            $('.padding-clear').scrollTo(0, 0);
            TweenMax.to($('#game-slide'), 1, {
                bottom: '-144%',
                delay: 0
            });
            slideOut = false;
            tracking.call('play');
        } else {
            gameResults = false;
            activeGame = 0;

            tracking.call('landing');
            $('#game-scroller').css({
                left: 0
            });
            TweenMax.to($('#game-quiz'), 0.7, {
                top: '0%'
            });
            TweenMax.to($('#game-container'), 0.7, {
                top: '100%',
                onComplete: function() {
                    $('#game-scroller').html('');
                    $('.arrow').fadeOut(300);
                    $('#game-quiz').fadeIn(300);
                    $('#game-container').fadeOut(300);
                }
            });
            animateGameHeader(-1);
            resetBottomMenu();
            TweenMax.to($('#back-btn'), 0.5, {
                left: '-40%',
                delay: 0.3
            });
        }
    });
    $('.back-btn').click(function() {
        //back button for slides
        $('.padding-clear').scrollTo(0, 0);
        $('.scrolled').removeClass('scrolled');
        if (slideOut == true) {
            //if game slide is out
            slideOut = false;
            TweenMax.to($('#game-slide'), 1, {
                bottom: '-144%',
                delay: 0
            });
            if (starplayerOut == true) {
                tracking.call('star');
            } else if (galleryOut == true) {
                //if game gallery
                TweenMax.to($('.game-gallery'), 0.5, {
                    bottom: '0%'
                });

                tracking.call('games');
            } else {
                tracking.call('play');
            }
            if ($("#game-slide .back-btn").is(":visible")) {
                $("#game-slide .back-btn").fadeOut();
            }
        } else {
            $(".game-gallery .back-btn").fadeOut(300);
            if ($(".star-player-gallery .back-btn").is(":visible")) {
                $(".star-player-gallery .back-btn").fadeOut();
                starplayerOut = false;
            }
            if (galleryOut == true) {
                galleryOut = false;
            } else {
                //if random game
                $('#featured-scroll').scrollTo(0, 0);
            }
            trackLanding();
            TweenMax.to($(this).parent(), 1, {
                bottom: '-63%',
                delay: 0
            });
            if (gameResults == true) {
                $("#game-container").show();
            } else {
                $('#game-quiz').show();
            }
            if (slideOut == false) {
                resetBottomMenu();
            } else {
                slideOut = false;
            }
            $('#random-game .share-co').fadeOut(300);
        }
    });
    $('.back-btn-tmnt').click(function() {
        if ($('#tmnt-page-game').is(':visible')) {
            $('#tmnt-page-gallery').fadeIn();
            $('#tmnt-page-game').fadeOut();
            tracking.call('tmnt');
        } else {
            tmntOut = false;
            $('.padding-clear').scrollTo(0, 0);
            $('.back-btn-tmnt').fadeOut();
            $('.scrolled').removeClass('scrolled');
            if (slideOut == true) {
                //if game slide is out
                slideOut = false;
                TweenMax.to($(this).parent(), 1, {
                    bottom: '-144%',
                    delay: 0
                });
                if (galleryOut == true) {
                    //if game gallery
                    TweenMax.to($('.game-gallery'), 0.5, {
                        bottom: '0%'
                    });

                    tracking.call('games');
                } else {
                    tracking.call('play');
                }
            } else {
                if (galleryOut == true) {
                    galleryOut = false;
                } else {
                    //if random game
                    $('#featured-scroll').scrollTo(0, 0);
                }
                trackLanding();
                TweenMax.to($('.tmnt-gallery'), 1, {
                    bottom: '-63%',
                    delay: 0
                });
                if (gameResults == true) {
                    $("#game-container").show();
                } else {
                    $('#game-quiz').show();
                }
                if (slideOut == false) {
                    resetBottomMenu();
                } else {
                    slideOut = false;
                }
            }
        }
    });
    /////////////////////////////////////////////
    $('#random-game-btn').click(function() {
        tracking.call('random');
        $('#game-container').hide();
        randomGame();
        TweenMax.to($('#random-game'), 1, {
            bottom: '-3%'
        });
        TweenMax.to($('#bottom'), 1, {
            bottom: '-22%'
        });
        //TweenMax.to($('.game-gallery'),1,{bottom:'-100%'});
        $('.share-co').fadeIn(500);
        $('#game-quiz').fadeOut(300);
    });
    $('#game-gallery-btn').click(function() {

        tracking.call('games');
        galleryOut = true;
        $('#game-container').hide();
        TweenMax.to($('.tmnt-gallery'), 1, {
            bottom: '-100%'
        });
        //-64
        TweenMax.to($('.game-gallery'), 1, {
            bottom: '0%'
        });
        //-64
        TweenMax.to($('#random-game'), 1, {
            bottom: '-100%'
        });
        //-65.4
        TweenMax.to($('.star-player-gallery'), 1, {
            bottom: '-100%'
        });
        //-64
        TweenMax.to($('#bottom'), 1, {
            bottom: '-22%'
        });
        //0helppme
        TweenMax.to($('#back-btn'), 0.5, {
            left: '1%',
            delay: 0.8
        });
        //-40
        TweenMax.to($('.gallery-header'), 0.5, {
            right: '-50%',
            delay: 0.9
        });
        $('#game-quiz').fadeOut(300);
        $(".game-gallery .back-btn").fadeIn(300);
    });
    $('#star-player-btn').click(function() {

        tracking.call('star');
        starplayerOut = true;
        $('#game-container').hide();
        TweenMax.to($('.tmnt-gallery'), 1, {
            bottom: '-100%'
        });
        //-64
        TweenMax.to($('.star-player-gallery'), 1, {
            bottom: '0%'
        });
        //-64
        TweenMax.to($('.game-gallery'), 1, {
            bottom: '-100%'
        });
        //-64
        TweenMax.to($('#bottom'), 1, {
            bottom: '-22%'
        });
        //0helppme
        // TweenMax.to($('#back-btn'),0.5,{left:'1%', delay:0.8});//-40
        // TweenMax.to($('.gallery-header'),0.5,{right:'-50%',delay:0.9});
        $('#game-quiz').fadeOut(300);
        $(".star-player-gallery .back-btn").fadeIn(300);
    });
    var activeGame = 0;
    $('#game-container .arrow').click(function() {
        //gameW = $('#game-container .inside').width();
        if ($(this).attr('id') == 'left') {//TweenMax.to($('#game-scroller'),0.8,{left:'+='+(gameW+15)});
        //activeGame--;

        } else {//TweenMax.to($('#game-scroller'),0.8,{left:'-='+(gameW+15)});
        //activeGame++;
        }
        arrowFix2(activeGame);
        //TweenMax.to($('.game'),0.8,{width:'23%',margin:'2% 5.2% 0'});
        //TweenMax.to($('.game.active'),0.8,{width:'26%',margin:'1% 3.1% 0 3.9%'});

    });

    $('#game-scroller').on('click', '.game', function() {
        var id = $(this).attr('data-game');
        loadGameSlide(id, true);
    });
    $('.star-player-gallery').on('click', '#badge', function() {
        loadGameSlide(currentBadgeGameId, false);
    });
    $('#tmnt-list').on('click', '.game', function() {
        var id = $(this).attr('data-game');
        loadTMNTSlide(id);
    });
    $('#new-game-scroller').on('click', '.game', function() {
        var id = $(this).attr('data-game');
        loadGameSlide(id);
    });
    $('#gallery-list').on('click', '.game', function() {
        var id = $(this).attr('data-game');
        loadGameSlide(id);
        TweenMax.to($('.game-gallery'), 0.5, {
            bottom: '-30%'
        });
    });
    //////////////// SWIPE ////////////////////////
    var currGame = 0;
    $('.game-gallery .arrow').click(function() {
        if ($(this).attr('id') == 'left') {
            currGame--;
            if (currGame < 0) {
                currGame++;
            }
            $('#new-game-container').scrollTo($('.game').eq(currGame), 500, {
                margin: true
            });
            $('.arrow#left').show();
        } else {
            currGame++;
            if (currGame > $('#new-game-scroller .game').length - 1) {
                currGame--;
            }
            $('#new-game-container').scrollTo($('.game').eq(currGame), 500, {
                margin: true
            });

        }
        arrowFix(currGame);
    });
    var threshold = 50;
    $('#new-game-scroller').on('touchstart', '.game', function(e) {
        var startPt = e.originalEvent.changedTouches[0].pageX;
        $('#new-game-container').on('touchmove', function(e) {
            e.preventDefault();
            movePt = e.originalEvent.changedTouches[0].pageX;
        }).on('touchend', function(e) {
            endPt = e.originalEvent.changedTouches[0].pageX;
            if (Math.abs(endPt - startPt) > threshold) {
                if (movePt - startPt <= 0) {
                    currGame++;
                    if (currGame > $('#new-game-scroller .game').length - 1)
                        currGame--;
                } else {
                    currGame--;
                    if (currGame < 0)
                        currGame++;
                }
                $('#new-game-container').scrollTo($('.game').eq(currGame), 500, {
                    margin: true
                });
                arrowFix(currGame);
            }
            $('#new-game-container').off('touchmove touchend');
        });
    });
    var currGame2 = 0;
    $('#game-container').on('touchstart', '.game', function(e) {
        var startPt = e.originalEvent.changedTouches[0].pageX;
        $('#game-container').on('touchmove', function(e) {
            movePt = e.originalEvent.changedTouches[0].pageX;
        }).on('touchend', function(e) {
            endPt = e.originalEvent.changedTouches[0].pageX;
            if (Math.abs(endPt - startPt) > threshold) {
                if (movePt - startPt <= 0) {
                    activeGame++;
                    if (activeGame > $('#game-container .game').length - 1)
                        activeGame--;
                } else {
                    activeGame--;
                    if (activeGame < 0)
                        activeGame++;
                }
                animateGameHeader(activeGame);
                $('#game-scroller').animate({
                    left: -(activeGame * (gameW + 16))
                }, 600);
                //if(results.length>1){
                arrowFix2(activeGame);
                //}
            }
            $('#game-container').off('touchmove touchend');
        });
    });
    $('.sorter').click(function() {
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            $('.arrow#right').hide();
            TweenMax.to($('.carot'), 0.2, {
                rotation: 0,
                top: '38%'
            });
        } else {
            $(this).addClass('active');
            $('.arrow#right').hide();
            TweenMax.to($('.carot'), 0.2, {
                rotation: 180,
                top: '36%'
            });
        }
    });
    $('.sort ul li').click(function(e) {
        var sort = $(this).attr('data-id');
        var playerTxt = $(this).html();
        $(this).addClass('selected').siblings().removeClass('selected');
        if ($('body').hasClass('tablet')) {
            $('.sort').hide();
        } else {
            $('.sort').removeClass('active');
            e.stopPropagation();
        }
        $('.sort span').html(playerTxt);
        if (sort == 'alphabetical') {
            sortByABC();
        }
        if (sort == 'minplayers') {
            sortByMinPlayers();
        }
        if (sort == 'maxplayers') {
            sortByMaxPlayers();
        }
        if (sort == 'newest') {
            sortByNewest();
        }
        if (sort == 'reset') {
            resetSort();
        }
    });
    $('.print-btn').click(function() {
        var id = $('#print').attr('data-game');

        tracking.call('games/game' + formatID(id) + '/print');
        window.print();
    });
    $('#get-game-btn').click(function() {
        tracking.call('random/another', true);
        randomGame();
        $('#featured-scroll').scrollTo(0, 0);
    });
    $('.print-btn-tmnt').click(function() {
        var id = $('#print').attr('data-game');

        tracking.call('tmnt/game' + formatIDTMNT(id) + '/print');
        window.print();
    });
    $('.arrow#right').click(function() {
        activeGame++;
        if (activeGame > $('#game-container .game').length - 1) {
            activeGame--;
        }
        animateGameHeader(activeGame);
        $('#game-scroller').animate({
            left: -(activeGame * (gameW + 16))
        }, 600);

        arrowFix2(activeGame);
    });
    $('.arrow#left').click(function() {
        activeGame--;
        if (activeGame < 0) {
            activeGame++;
        }
        animateGameHeader(activeGame);
        $('#game-scroller').animate({
            left: -(activeGame * (gameW + 16))
        }, 600);

        arrowFix2(activeGame);
    });

});
/////////////////////// END READY ///////////////////////////
function closeVote() {
    $('#overlay').fadeOut(700);
    $('#vote-window').fadeOut(700, function() {
        $('#vote-window').removeClass('finished').addClass('confirm');
    });
}
function trackLanding() {
    if (currentCat == 'stuff') {
        tracking.call('what');
    } else if (currentCat == 'players') {
        tracking.call('how');
    } else if (currentCat == 'where') {
        tracking.call('where');
    } else {
        tracking.call('landing');
    }
}
function arrowFix(num) {
    if (num == 0) {
        $('.content .arrow#left').hide();
    } else if (num == $('#new-game-scroller .game').length - 1) {
        $('.content .arrow#right').hide();
    } else {
        $('.content .arrow').show();
    }
}
function arrowFix2(num) {
    if (num == 0) {
        $('#game-container .arrow#left').hide();
        $('#game-container .arrow#right').show();
    } else if (num == $('#game-scroller .game').length - 1) {
        $('#game-container .arrow#right').hide();
        $('#game-container .arrow#left').show();
    } else {
        $('#game-container .arrow').show();
    }
}
var results;
function loadGames() {

    function descendingPlayers(playerA, playerB) {
        return parseInt(playerB.players) - parseInt(playerA.players);
    }

    var itemMatch = [];
    var exactMatch = [];
    var noMatch = [];
    for (i = 0; i < games.length; i++) {
        if (games[i].stuffTxt.indexOf(chosenStuff[0]) != -1) {
            if (games[i].players <= parseInt(chosenPlayers)) {
                exactMatch.push(games[i]);
            } else {
                itemMatch.push(games[i]);
            }
        } else {
            if (games[i].players <= parseInt(chosenPlayers)) {
                noMatch.push(games[i]);
            }
        }
    }
    if (exactMatch.length > 0) {
        exactMatch = exactMatch.sort(descendingPlayers);
    }
    if (itemMatch.length > 0) {
        itemMatch = itemMatch.sort(descendingPlayers);
    }
    itemMatch = exactMatch.concat(itemMatch);
    noMatch = noMatch.sort(descendingPlayers);

    appendGames(itemMatch, $('#game-scroller'), "game");
    appendGames(noMatch, $('#game-scroller'), "game more-games");

    var results = itemMatch.concat(noMatch);

    gameW = $('#game-container .inside').width();
    $('#game-scroller').css({
        width: (results.length * gameW) + (25 * results.length)
    });

    $('#game-scroller .game').css({
        width: gameW
    });
    $('#game-scroller .game .title').fitText(1.4);

    if (results.length < 2) {
        $('#game-container .arrow').hide();
    } else {
        $('#game-container .arrow#right').fadeIn(300);
    }
}

function appendGames(gamesArray, $listHolder, classes) {
    for (var i = 0; i < gamesArray.length; i++) {
        var content = '<div class="padding-clear">';
        content += '<div class="title">' + gamesArray[i].title + '</div>';
        content += '<div class="desc">' + gamesArray[i].desc + '</div>';
        content += '<div class="objects"></div><div class="players"><span>' + gamesArray[i].players + '+</span></div>';
        content += '<div class="view-btn"></div><div class="hover"></div>';
        content += '</div>';

        // Construct game div
        var thisGame = $("<div>", {
            class: classes,
            'data-game': gamesArray[i].gameID,
            html: content
        }).appendTo($listHolder);
        if (gamesArray[i]['stuff'].length > 4) {
            var length = 4;
        } else {
            var length = gamesArray[i]['stuff'].length;
        }
        for (var j = 0; j < length; j++) {
            thisGame.find(".objects").append('<div class="object"><img src="../img/stuff/' + gamesArray[i]["stuffTxt"][j] + '.png" /><div class="text">' + deDash(gamesArray[i]["stuff"][j]) + '</div></div>');
        }
    }
}

var isChooseYourGame = true;
var gameHeaderAnimTime = 0.5;
function animateGameHeader(index) {
    var $header = $("#game-header");
    var $more = $("#more-games-header");
    var $game = $('#game-container .game:eq(' + index + ')');

    if (index == -1) {
        TweenMax.to($header, gameHeaderAnimTime, {
            right: '0%'
        });
        TweenMax.to($more, gameHeaderAnimTime, {
            right: '-69%'
        });
        isChooseYourGame = true;
        return;
    }

    if (isChooseYourGame && $game.hasClass("more-games")) {
        TweenMax.to($header, gameHeaderAnimTime, {
            right: '-69%'
        });
        TweenMax.to($more, gameHeaderAnimTime, {
            right: '0%'
        });
        isChooseYourGame = false;
    } else if (!isChooseYourGame && !$game.hasClass("more-games")) {
        TweenMax.to($header, gameHeaderAnimTime, {
            right: '0%'
        });
        TweenMax.to($more, gameHeaderAnimTime, {
            right: '-69%'
        });
        isChooseYourGame = true;
    }
}

var today;
var weekIndex;
function newThisWeek() {
    //today = new Date("2015-06-01").getTime(); 	// Arbitrary date for testing
    today = new Date().getTime();
    // Today's date
    var weekStart;
    var weekEnd;
    weekIndex = 0;

    // Loop through weeks until today lands within week
    $.each(dates.weeks, function(index, week) {
        weekStart = new Date(week.start).getTime();
        weekEnd = new Date(week.end).getTime();

        if (today >= weekStart && today <= weekEnd) {
            weekIndex = index;
            return false;
        }
    });

    weekIndex = 15;

    // Loop through gameIDs in this week, and populate week section in gallery.
    if (dates.weeks[weekIndex].gameIDs != 0) {
        $.each(dates.weeks[weekIndex].gameIDs, function(index, gameID) {
            var gameIndex = gameID - 1;
            // Because gameID is 1-based, and array is 0-based
            if (games[gameIndex]) {
                $('#new-game-scroller').append('<div class="game" data-game="' + galleryArray[gameIndex].gameID + '"><div class="title">' + galleryArray[gameIndex].title + '</div><div class="desc">' + galleryArray[gameIndex].desc + '</div><div class="players"><span>' + galleryArray[gameIndex].players + '+</span></div><div class="drip"></div><div class="category"><img src="../img/gallery/cat-' + galleryArray[gameIndex].type + '.png"/></div></div>');
            }
        });
        $('#new-game-scroller').delay(400).css({
            width: (dates.weeks[weekIndex].gameIDs.length * 93.3333333333) + '%'
        }).children('.game').css({
            width: w * 0.85,
            marginLeft: w * 0.05
        });
        //$(".game-gallery .week-title").html(dates.weeks[weekIndex].title);
        $('#new-game-scroller').append('<div class="clear"></div>');
        $("#weekly").attr("class", "wk-" + weekIndex);
    } else {
        $('.game-gallery').addClass('hide-featured');
    }

}
function loadGallery() {
    $('#gallery-list').html('');
    for (i = 0; i < galleryArray.length; i++) {

        //console.log(galleryArray[i]);

        var where = '';
        for (x = 0; x < galleryArray[i].where.length; x++) {
            where += galleryArray[i].where[x] + ',';
        }

        if (dates.weeks[weekIndex].gameIDs.indexOf(galleryArray[i].gameID) == -1) {
            $('#gallery-list').append('<div class="game" data-game="' + galleryArray[i].gameID + '" data-players="' + galleryArray[i].players + '" data-where="' + where + '"><div class="title">' + galleryArray[i].title + '</div><div class="desc">' + galleryArray[i].desc + '</div><div class="players"><span>' + galleryArray[i].players + '+</span></div><div class="category"><img src="../img/gallery/cat-' + galleryArray[i].type + '.png"/></div></div>');
        }

    }
}
function loadGalleryTMNT() {
    var results = [];
    var nowTime = (new Date()).getTime();

    for (i = 0; i < gamesTMNT.length; i++) {
        if (nowTime > Date.parse(gamesTMNT[i].date)) {
            results.push(gamesTMNT[i]);
        }
    }

    $('#tmnt-list').html('');
    for (i = 0; i < results.length; i++) {
        var content = '';
        if (results[i].imageTile1 && results[i].imageTile2) {
            content += '<div class="image-tile-pair" data-game="' + results[i].gameID + '">';
            content += '<div class="tile1" style="background-image: url(' + results[i].imageTile1 + ')"></div>';
            content += '<div class="tile1-frame"></div>';
            content += '<div class="tile2" style="background-image: url(' + results[i].imageTile2 + ')"></div>';
            content += '<div class="tile2-frame"></div>';
            content += '</div>';
        } else {
            content += '<div class="game" data-game="' + results[i].gameID + '" data-players="' + results[i].players + '">';
            content += '<div class="title">' + results[i].title + '</div>';
            content += '<div class="desc">' + results[i].desc + '</div>';
            content += '<div class="players"><span>' + results[i].players + '+</span></div>';
            content += '</div>';
        }
        $('#tmnt-list').append(content);
    }
    // $('#tmnt-list .title').fitText(1.4);
    // $('#tmnt-list .desc').fitText(2.5);
}
function loadFeaturedGame(id) {
    var gameID = id;
    featuredGameObj = games[id - 1];
    loadPrint(gameID - 1);
    $('#random-game .inside').html('');
    $('#random-game .title').html(featuredGameObj.title);
    $('#random-game .big-desc').html(featuredGameObj.desc);
    // Add needed objects
    for (i = 0; i < featuredGameObj['stuff'].length; i++) {
        if (featuredGameObj['stuffTxt'][i] == 'none') {
            continue;
        }
        $('#random-game .needs .inside').append('<div class="object"><div class="icon"><img src="../img/stuff/' + featuredGameObj['stuffTxt'][i] + '.png"/></div><div class="text">' + deDash(featuredGameObj["stuff"][i]) + '</div></div>');
    }
    // Add setup items
    // for(i=0;i<featuredGameObj['setup'].length;i++){
    // 	$('#random-game .instructions .inside').eq(0).append('<div class="instruct"><div class="asterisk"></div><div class="text">'+featuredGameObj["setup"][i]+'</div></div>');
    // }
    // Add instructions

    for (i = 0; i < featuredGameObj['instructions'].length; i++) {
        $('#random-game .instructions .inside').append('<div class="instruct"><div class="text">' + featuredGameObj["instructions"][i] + '</div></div>');
    }
    // Add players
    $('#random-game .needs .inside').append('<div class="object"><div class="icon no-bg"><img src="../img/featured/players.png"/></div><div class="text">' + featuredGameObj["players"] + ' players</div></div>');
    // Add where to play
    $('#random-game .needs .inside').append("<div class='header-2'></div>");
    for (i = 0; i < featuredGameObj['where'].length; i++) {
        $('#random-game .needs .inside').append('<div class="object"><div class="icon no-bg"><img src="../img/where/' + featuredGameObj['where'][i] + '.png"/></div><div class="text">' + capFirst(featuredGameObj["where"][i]) + '</div></div>');
    }
}
function loadGameSlide(id, hideBackBtn) {
    loadPrint(id - 1);
    slideOut = true;
    var gameObj = games[id - 1];

    tracking.call('games/game' + formatID(id));
    $('#game-slide .needs .inside').html("");
    $('#game-slide .instructions .inside').html("");
    $('#game-slide .title').html(gameObj.title);
    $('#game-slide .big-desc').html(gameObj.desc);
    for (i = 0; i < gameObj['stuff'].length; i++) {
        if (gameObj['stuffTxt'][i] == 'none') {
            continue;
        }
        $('#game-slide .needs .inside').append('<div class="object"><div class="icon"><img src="../img/stuff/' + gameObj['stuffTxt'][i] + '.png"/></div><div class="text">' + deDash(gameObj["stuff"][i]) + '</div></div>');
    }
    // for(i=0;i<gameObj['setup'].length;i++){
    // 	$('#game-slide .instructions .inside').eq(0).append('<div class="instruct"><div class="asterisk"></div><div class="text">'+gameObj["setup"][i]+'</div></div>');
    // }
    for (i = 0; i < gameObj['instructions'].length; i++) {
        $('#game-slide .instructions .inside').eq(1).append('<div class="instruct"><div class="text">' + gameObj["instructions"][i] + '</div></div>');
    }
    var playerString = parseInt(gameObj["players"]) > 1 ? ' players</div></div>' : ' player</div></div>';
    $('#game-slide .needs .inside').append('<div class="object"><div class="icon no-bg"><img src="../img/featured/players.png"/></div><div class="text">' + gameObj["players"] + playerString);
    // Add where to play
    // $('#game-slide .needs .inside').append("<div class='header-2'></div>");
    // for(i=0; i<gameObj['where'].length; i++){
    // 	$('#game-slide .needs .inside').append('<div class="object"><div class="icon no-bg"><img src="../img/where/'+gameObj['where'][i]+'.png"/></div><div class="text">'+capFirst(gameObj["where"][i])+'</div></div>');
    // }
    TweenMax.set($('#game-slide'), {
        bottom: '-100%',
        display: 'block'
    });
    TweenMax.to($('#game-slide'), 1, {
        bottom: '-4%'
    });

    if (!hideBackBtn) {
        $('#game-slide .back-btn').fadeIn();
    }

    $('#game-slide .title').fitText(1.4);
    $('#game-slide .big-desc').fitText(2.4);
    $('#game-slide .instruct .text').fitText(2.227);
}
function loadTMNTSlide(id) {
    loadPrintTMNT(id - 1);
    //slideOut = true;
    var gameObj = gamesTMNT[id - 1];

    tracking.call('tmnt/game' + formatIDTMNT(id));
    $('#tmnt-page-game .needs .inside').html("");
    $('#tmnt-page-game .instructions .inside').html("");
    $('#tmnt-page-game .title').html(gameObj.title);
    $('#tmnt-page-game .big-desc').html(gameObj.desc);
    for (i = 0; i < gameObj['stuff'].length; i++) {
        if (gameObj['stuffTxt'][i] == 'none') {
            continue;
        }
        $('#tmnt-page-game .needs .inside').append('<div class="object"><div class="icon"><img src="../img/stuff/' + gameObj['stuffTxt'][i] + '.png"/></div><div class="text">' + deDash(gameObj["stuff"][i]) + '</div></div>');
    }
    for (i = 0; i < gameObj['instructions'].length; i++) {
        $('#tmnt-page-game .instructions .inside').eq(1).append('<div class="instruct"><div class="text">' + gameObj["instructions"][i] + '</div></div>');
    }
    var playerString = parseInt(gameObj["players"]) > 1 ? ' players</div></div>' : ' player</div></div>';
    $('#tmnt-page-game .needs .inside').append('<div class="object"><div class="icon no-bg"><img src="../img/featured/players.png"/></div><div class="text">' + gameObj["players"] + playerString);

    $('#tmnt-page-gallery').fadeOut();
    $('#tmnt-page-game').fadeIn();

    $('#tmnt-page-game .title').fitText(1.4);
    $('#tmnt-page-game .big-desc').fitText(2.4);
    $('#tmnt-page-game .instruct .text').fitText(2.227);
    // TweenMax.set($('#game-slide'),{bottom:'-100%'});
    // TweenMax.to($('#game-slide'),1,{bottom:'0%',display:'block'});

    $('#tmnt-page-game .padding-clear').scrollTo(0, 0);
}
function loadPrint(gameID) {
    loadPrintObj(games[gameID]);
}
function loadPrintTMNT(gameID) {
    loadPrintObj(gamesTMNT[gameID]);
}
function loadPrintObj(printObj) {
    $('#print').attr('data-game', printObj.gameID);
    $('#print .inside').html('');
    $('#print .title').html(printObj.title);
    $('#print .big-desc').html(printObj.desc);
    for (i = 0; i < printObj['stuff'].length; i++) {
        $('#print .needs .inside').append('<div class="object"><div class="icon"><img src="../img/stuff/' + printObj['stuffTxt'][i] + '.png"/></div><div class="text">' + deDash(printObj["stuff"][i]) + '</div></div>');
    }
    for (i = 0; i < printObj['instructions'].length; i++) {
        $('#print .instructions .inside').eq(1).append('<div class="instruct"><div class="text">' + printObj["instructions"][i] + '</div></div>');
    }
    var playerString = parseInt(printObj["players"]) > 1 ? ' players</div></div>' : ' player</div></div>';
    $('#print .needs .inside').append('<div class="object"><div class="icon no-bg"><img src="../img/featured/players.png"/></div><div class="text">' + printObj["players"] + playerString);
    // Add where to play
    $('#print .needs .inside').append('<div class="header-2"><img src="../img/featured/where-to-play.png" alt="WHERE TO PLAY" /></div>');
    for (i = 0; i < printObj['where'].length; i++) {
        $('#print .needs .inside').append('<div class="object"><div class="icon no-bg"><img src="../img/where/' + printObj['where'][i] + '.png"/></div><div class="text">' + capFirst(printObj["where"][i]) + '</div></div>');
        if (i < printObj['where'].length - 1) {
            $('#print .needs .inside').append('<div class="or-divider"><img src="../img/featured/divider.png" alt="" /></div>');
        }
    }
}
function formatID(id) {
    if (id < 10) {
        id = '00' + id;
        return id;
    } else if (i < 100) {
        id = '0' + id;
        return id;
    } else {
        return id;
    }
}
function formatIDTMNT(id) {
    if (gamesTMNT[id - 1].trackingID) {
        id = gamesTMNT[id - 1].trackingID;
    }
    if (id < 10) {
        id = '00' + id;
        return id;
    } else if (i < 100) {
        id = '0' + id;
        return id;
    } else {
        return id;
    }
}

// var scroll = $('.padding-clear')[0];
// new scrollFix(scroll);
function enablePlayBtn() {
    if (chosenStuff.length != 0 && chosenPlayers && chosenWhere) {
        $('.play-btn').addClass('active');
    }
}
function hideBottomMenu() {
    TweenMax.to($('#bottom'), 1, {
        bottom: '-22%'
    });
    TweenMax.to($('.game-gallery'), 1, {
        bottom: '-100%'
    });
    TweenMax.to($('#random-game'), 1, {
        bottom: '-100%'
    });
    TweenMax.to($('.star-player-gallery'), 1, {
        bottom: '-100%'
    });
    TweenMax.to($('.tmnt-gallery'), 1, {
        bottom: '-100%'
    });
}
function showBottomMenu() {
    TweenMax.to($('#bottom'), 0.5, {
        bottom: '0%',
        delay: 0.0
    });
}
function resetBottomMenu() {
    TweenMax.to($('.gallery-header'), 0.5, {
        right: '-100%'
    });
    TweenMax.to($('.game-gallery'), 0.53, {
        bottom: '-57%'
    });
    TweenMax.to($('#random-game'), 0.5, {
        bottom: '-64%'
    });
    TweenMax.to($('.star-player-gallery'), 0.53, {
        bottom: '-57%'
    });
    TweenMax.to($('.tmnt-gallery'), 0.53, {
        bottom: '-57%'
    });
    TweenMax.to($('#bottom'), 0.5, {
        bottom: '0%',
        delay: 0.0
    });
    //$('#game-quiz').fadeIn(300);
}
function resizeNewGames() {
    var gameW = $('#new-game-container').width();
}
function randomGame() {
    var randomNum = Math.ceil(Math.random() * games.length);
    TweenMax.to($('#back-btn'), 0.5, {
        left: '1%',
        delay: 0.8
    });
    //-40
    $('#back-btn').addClass('random');
    loadFeaturedGame(randomNum);
}
function deDash(text) {
    text = text.replace(/-/ig, " ");
    return text;
}
// Capitalizes first letter
function capFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function sortByABC() {
    galleryArray.sort(function(a, b) {
        var x = a.title.toLowerCase();
        var y = b.title.toLowerCase();
        return x < y ? -1 : x > y ? 1 : 0;
    });
    loadGallery();
}
function sortByMinPlayers() {
    galleryArray.sort(function(a, b) {
        var x = a.players;
        var y = b.players;
        return x - y;
    });
    loadGallery();
}
function sortByMaxPlayers() {
    galleryArray.sort(function(a, b) {
        var x = a.players;
        var y = b.players;
        return y - x;
    });
    loadGallery();
}
function sortByNewest() {
    galleryArray.sort(function(a, b) {
        var x = a.gameID;
        var y = b.gameID;
        return y - x;
    });
    loadGallery();
}
function resetSort() {
    galleryArray = games.slice(0);
    loadGallery();
}

// Tracking
var tracking = {
    prefix: "kraft/caprisun/",
    // Prepend to tracking call if it's from vanity URL
    sectionActive: '',
    // Section currently timing
    sectionTime: 0,
    // Time spent in section
    siteTime: 0,
    // Time spent in whole site
    enabled: true,

    // Sends tracking call to Nick's server
    call: function(label) {
        if (!this.enabled)
            return;

        label += (this.platform == "desktop") ? "" : "_" + this.platform;

        if (this.vanity) {
            label = this.prefix + label;
        }

        if (typeof pageNameAppend == "function") {
            pageNameAppend(label);
        }

        console.log(label);
    },

    // Starts timer
    timerStart: function(section) {
        this.call(section);
    },

    pause: function() {
        this.enabled = false;
    },

    unpause: function() {
        this.enabled = true;
    },

    // Stores desktop, tablet, or phone
    platform: (function() {
        var UA_RULES = [['iPhone;', 'phone'], ['iPod;', 'phone'], ['iPad;', 'tablet'], ['Android.*Mobile Safari', 'phone'], ['Android.*Safari', 'tablet'], ['iemobile', 'phone'], ['Windows Phone', 'phone'], ['.*', 'desktop'], ];

        var ua = navigator.userAgent;
        for (var i = 0; i < UA_RULES.length; i++) {
            var device = UA_RULES[i][1];
            var re = new RegExp(UA_RULES[i][0]);
            if (ua.match(re)) {
                return device;
            }
        }
    }
    )(),

    // True if site is hosted outside "ads.nick"
    vanity: (function() {
        if (window.location.href.indexOf("ads.nick") == -1) {
            return true;
        } else {
            return false;
        }
    }
    )()
};

// jQuery no-double-tap-zoom plugin

// Triple-licensed: Public Domain, MIT and WTFPL license - share and enjoy!

(function($) {
    var IS_IOS = /iphone|ipad/i.test(navigator.userAgent);
    $.fn.nodoubletapzoom = function() {
        if (IS_IOS)
            $(this).bind('touchstart', function preventZoom(e) {
                var t2 = e.timeStamp
                  , t1 = $(this).data('lastTouch') || t2
                  , dt = t2 - t1
                  , fingers = e.originalEvent.touches.length;
                $(this).data('lastTouch', t2);
                if (!dt || dt > 500 || fingers > 1)
                    return;
                // not double-tap

                e.preventDefault();
                // double tap - prevent the zoom
                // also synthesize click events we just swallowed up
                $(this).trigger('click').trigger('click');
            });
    }
    ;
}
)(jQuery);

$('*').nodoubletapzoom();
