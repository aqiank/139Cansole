// Progress Bar
var progressBar;

// Can Animation
var animationA;

// Market Animation
var animationB;

// Screenshot
var currentScreenshot = null;

function ProgressBar(objectCount, onIncrement, onComplete) {
    this.objectCount = objectCount;
    this.loadedObjectCount = 0;
    this.progress = 0;
    this.onIncrement = onIncrement;
    this.onComplete = onComplete;
    this.increment = function() {
        this.loadedObjectCount++;
        this.progress = this.loadedObjectCount / this.objectCount;
        this.onIncrement(this.progress);
        if (this.progress === 1)
            this.onComplete();
    }
}

function Animation(container, path, type, count, onLoad) {
    this.container = container;
    this.count = count;
    this.index = 0;
    this.previousIndex = 0;
    this.timeline = [];

    var frameIndex = 1;
    var progress = 0;
    while (frameIndex <= count) {
        $(container).append('<img>');
        var element = $(container + ' img:nth-child(' + frameIndex + ')');
        var imageFile = path + frameIndex + type;
        if (frameIndex > 1)
            element.addClass('transparent');
        element.load(onLoad).attr('src', imageFile);

        frameIndex++;
    }

    this.gotoFrame = function(i) {
        this.previousIndex = this.index;
        this.index = Math.floor(i);
        if (this.index != this.previousIndex) {
            $(container + ' img:nth-child(' + (this.previousIndex + 1) + ')').toggleClass('transparent');
            $(container + ' img:nth-child(' + (this.index + 1) + ')').toggleClass('transparent');
        }
    };
}

function initSkrollrStuff() {
    if ($('header').css('display') != 'none') {
        skrollr.init();
    }
}

function initOtherStuff() {
    // Loading Screen
    progressBar = new ProgressBar(
            127,
            function(progress) {
                $('#progress p').html("" + Math.round(progress * 100) + "%");
                TweenMax.to('#loading-can-switch', 1, {rotation: '' + (180 * progress), transformOrigin: 'center 75%'});
            },
            function() {
                $('#loading-screen').fadeOut(1000);
            }
    );

    // Animation A
    animationA = new Animation(
            '#animation-a',
            'images/animations/',
            '.png',
            117,
            function() {
                progressBar.increment();
            }
    );

    // Animation B
    animationB = new Animation(
            '#animation-b',
            'images/transitions/market/',
            '.png',
            10,
            function() {
                progressBar.increment();
            }
    );
    
    $('#screen-label-1')
        .hover(function() {
            TweenMax.to('#screen-2', 0.4, {backgroundPosition: '0px 0px'});
            $('#screen-2').addClass('layer1');
        }, function() {
            TweenMax.to('#screen-2', 0.4, {backgroundPosition: '-300px 0px'});
            $('#screen-2').removeClass('layer1');
        });
        
        
    $('#screen-label-2')
        .hover(function() {
            TweenMax.to('#screen-3', 0.4, {backgroundPosition: '0px 0px'});
            $('#screen-3').addClass('layer1');
        }, function() {
            TweenMax.to('#screen-3', 0.4, {backgroundPosition: '-300px 0px'});
            $('#screen-3').removeClass('layer1');
        });
        
        
    $('#screen-label-3')
        .hover(function() {
            TweenMax.to('#screen-4', 0.4, {backgroundPosition: '0px 0px'});
            $('#screen-4').addClass('layer1');
        }, function() {
            TweenMax.to('#screen-4', 0.4, {backgroundPosition: '-300px 0px'});
            $('#screen-4').removeClass('layer1');
        });
    
    var clamp = function(v, a, b) {
        if (v < a) {
            v = a;
        } else if (v > b) {
            v = b;
        }
        return v;
    }
    
    var map = function(v, minA, maxA, minB, maxB) {
        v = clamp(v, minA, maxA);
        return ((v - minA) / (maxA - minA)) * (maxB - minB) + minB;
    };
    
    $(window).scroll(function() {
        var pos = $(window).scrollTop();
        
        // Can Animation
        if (pos < 1240) {
            animationA.gotoFrame(map(pos, 0, 620, 0, 15));
        } else if (pos < 2480) {
            animationA.gotoFrame(map(pos, 1240, 1860, 15, 40));
        } else if (pos < 3620) {
            animationA.gotoFrame(map(pos, 2480, 3000, 40, 102));
        } else if (pos < 4860) {
            animationA.gotoFrame(map(pos, 3620, 4240, 103, 116));
        }
        
        var pos2 = clamp(pos, 3620, 3930);
        animationB.gotoFrame(map(pos2, 3620, 3930, 0, 9));
        
        // Header
        if (pos > 0) {
            TweenMax.to('#main-header', 0.4, {backgroundColor: 'rgba(255, 255, 255, 1)'});
            TweenMax.to('#main-header a', 0.4, {color: 'rgb(0, 0, 0)'});
            TweenMax.to('#logo_dark', 0.4, {opacity: '1'});
            TweenMax.to('#logo', 0.4, {opacity: '0'});
        } else {
            $('#main-header').finish();
            TweenMax.to('#main-header', 0.4, {backgroundColor: 'rgba(0, 0, 0, 0)'});
            TweenMax.to('#main-header a', 0.4, {color: 'rgb(255, 255, 255)'});
            TweenMax.to('#logo_dark', 0.4, {opacity: '0'});
            TweenMax.to('#logo', 0.4, {opacity: '1'});
        }
        
        if (pos >= 4240) {
            $('#screens').css('display', 'block');
        } else {
            $('#screens').css('display', 'none');
            if (pos < 3620) {
                $('body').css('background', '#f3f3f3');
            } else {
                $('body').css('background', '#222');
            }
        }
    });
}

function initMediaQueryStuff() {
    $(window).resize(function() {
        if ($('header').css('display') == "none") {
            var s = skrollr.get();
            if (s != undefined) {
                s.destroy();
                console.log('skrollr destroyed');
            }
        } else {
            var s = skrollr.get();
            if (s == undefined) {
                s = skrollr.init();
                console.log('skrollr initialized');
            }
        }
    });
}

$(document).ready(function() {
    initSkrollrStuff();
    initOtherStuff();
    initMediaQueryStuff();
});
