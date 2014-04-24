// ScrollMagic Controller
var controller;

// Progress Bar
var progress_bar;

// Can Animation
var can_animation;

// Market Animation
var market_animation;

// Page Indicator
var activeIndicatorId = null;

// Screenshot Animation
var screenshotPlaying = false;

function ProgressBar(num_objects, on_increment, on_complete) {
    this.num_objects = num_objects;
    this.num_loaded_objects = 0;
    this.progress = 0;
    this.on_increment = on_increment;
    this.on_complete = on_complete;
    this.increment = function() {
        this.num_loaded_objects++;
        this.progress = this.num_loaded_objects / this.num_objects;
        this.on_increment(this.progress);
        if (this.progress === 1)
            this.on_complete();
    }
}

function Animation(container, path, type, count, onLoad) {
    this.container = container;
    this.count = count;
    this.index = 0;
    this.previous_index = 0;

    var frame_index = 1;
    var progress = 0;
    while (frame_index <= count) {
        $(container).append('<img class="animation-frame">');
        var element = $(container + ' img:nth-child(' + frame_index + ')');
        var image_file = path + frame_index + type;

        if (frame_index > 1)
            element.css('visibility', 'hidden');
        element.load(onLoad).attr('src', image_file);

        frame_index++;
    }

    this.gotoFrame = function(i) {
        this.previous_index = this.index;
        this.index = i;
        if (this.index != this.previous_index) {
            $(container + ' img:nth-child(' + (this.previous_index + 1) + ')').css('visibility', 'hidden');
            $(container + ' img:nth-child(' + (this.index + 1) + ')').css('visibility', 'visible');
        }
    }
}

function addStepsScene() {
    var scene = new ScrollScene({triggerElement: "#pin", duration: 300})
                    .addTo(controller);
    var tween = new TimelineMax()
                    .add([TweenMax.fromTo("#can_shadow_a", 0.5, {alpha: 1}, {alpha: 0}),
                          new TimelineMax()
                            .add(TweenMax.fromTo('#step4', 1, {y: "0", opacity: 1}, {y: "100", opacity: 0}))
                            .add(TweenMax.fromTo('#step3', 1, {y: "0", opacity: 1}, {y: "100", opacity: 0}))
                            .add(TweenMax.fromTo('#step2', 1, {y: "0", opacity: 1}, {y: "100", opacity: 0}))
                            .add(TweenMax.fromTo('#step1', 1, {y: "0", opacity: 1}, {y: "100", opacity: 0}))]);
    scene.setTween(tween);
}

$(document).ready(function() {
    progress_bar = new ProgressBar(127,
                                   function(progress) {
                                       $('#progress p').html("" + Math.round(progress * 100) + "%");
                                       TweenMax.to('#loading-can-switch', 5, {rotation: "" + (180 * progress), transformOrigin: "center 75%"});
                                   },
                                   function() {
                                       $('#loading-screen').fadeOut(1000);
                                   });

    can_animation = new Animation('#animation-frames',
                                  'images/animations/',
                                  '.png',
                                  117,
                                  function() {
                                      progress_bar.increment();
                                  });

    market_animation = new Animation('#market-animation-frames',
                                     'images/transitions/market/',
                                     '.png',
                                     10,
                                     function() {
                                         progress_bar.increment();
                                     });

    controller = new ScrollMagic({
        globalSceneOptions: {
            triggerHook: "onLeave"
        }
    });

    /*******************
     * Page Indicators *
     *******************/
    $('.page-indicator').mouseenter(function() {
        var indicatorId = '#' + $(this).attr('id');
        console.log(indicatorId);
        if (indicatorId != activeIndicatorId)
            TweenMax.to(indicatorId, 0.5, {opacity: 0.8});

        TweenMax.to(indicatorId + " p", 0.5, {opacity: 1});
    });

    $('.page-indicator').mouseleave(function() {
        var indicatorId = '#' + $(this).attr('id');
        if (indicatorId != activeIndicatorId)
            TweenMax.to($(indicatorId), 0.5, {opacity: 0.2});
        
        TweenMax.to(indicatorId + " p", 0.5, {opacity: 0});
    });

    $(window).scroll(function() {
        var pos = $(window).scrollTop();
        if (pos > 0)
            TweenMax.to('#navbar_bg', 0.5, {y: 100});
        else
            TweenMax.to('#navbar_bg', 0.5, {y: 0});

        /* reset can animation frame */
        if (pos === 0)
            can_animation.gotoFrame(0);
    });

    /********
     * Home *
     ********/
    new TimelineMax()
        .add([TweenMax.fromTo("#home_content", 1, {alpha: 0}, {alpha: 1}),
              new TimelineMax()
                  .add(TweenMax.from('#step1', 0.5, {y: "100", opacity: 0}))
                  .add(TweenMax.from('#step2', 0.5, {y: "100", opacity: 0}))
                  .add(TweenMax.from('#step3', 0.5, {y: "100", opacity: 0}))
                  .add(TweenMax.from('#step4', 0.5, {y: "100", opacity: 0, onComplete: addStepsScene}))]);

    new ScrollScene({triggerElement: "#pin", duration: 620})
                    .addTo(controller)
                    .on("progress", function(e) {
                        can_animation.gotoFrame(Math.floor(e.progress * 15));
                    })
                    .on("enter", function(e) {
                        TweenMax.to('#home-indicator', 0.5, {opacity: 1});
                        activeIndicatorId = '#home-indicator';
                    })
                    .on("leave", function(e) {
                        if (controller.scrollPos() >= 100)
                            TweenMax.to('#home-indicator', 0.5, {opacity: 0.2});
                    });

    /*********
     * About *
     *********/
    scene = new ScrollScene({triggerElement: "#pin", duration: 300, offset: 620})
                    .setPin("#all")
                    .addTo(controller)
                    .on("enter", function(e) {
                        TweenMax.to('#about-indicator', 0.5, {opacity: 1});
                        activeIndicatorId = '#about-indicator';
                    })
                    .on("leave", function(e) {
                        TweenMax.to('#about-indicator', 0.5, {opacity: 0.2});
                    });
    scene = new ScrollScene({triggerElement: "#pin", duration: 1100, offset: 450})
                    .addTo(controller);
    tween = new TimelineMax()
            .add(TweenMax.fromTo("#can_shadow_b", 0.25, {alpha: 0}, {alpha: 1}))
            .add(TweenMax.to("#can_shadow_b", 0.5, {alpha: 1}))
            .add(TweenMax.to("#can_shadow_b", 0.1, {alpha: 0}));
    scene.setTween(tween);

    scene = new ScrollScene({triggerElement: "#pin", duration: 1400, offset: 290})
                    .addTo(controller);
    tween = new TimelineMax()
            .add(TweenMax.fromTo("#about_content", 0.25, {x: -100, alpha: 0}, {x: 0, alpha: 1}))
            .add(TweenMax.to("#about_content", 0.5, {x: 0, alpha: 1}))
            .add(TweenMax.to("#about_content", 0.1, {x: -100, alpha: 0}));
    scene.setTween(tween);
    
    /***********************
     * Transition: Product *
     ***********************/
    scene = new ScrollScene({triggerElement: "#pin", duration: 500, offset: 150, triggerHook: "onEnter"})
                    .addTo(controller);
    tween = TweenMax.fromTo("#transition_product_a", 1, {y: -200, opacity: 0}, {ease: Quad.easeIn, y: 0, opacity: 1});
    scene.setTween(tween);

    scene = new ScrollScene({triggerElement: "#pin", duration: 5000, offset: 900, triggerHook: "onEnter"})
                    .addTo(controller);
    tween = TweenMax.fromTo("#transition-product-text", 1, {y: 100}, {y: -900});
    scene.setTween(tween);

    scene = new ScrollScene({triggerElement: "#pin", duration: 200, offset: 1350, triggerHook: "onEnter"})
                    .addTo(controller);
    tween = TweenMax.to("#transition_product_b", 1, {opacity: 0});
    scene.setTween(tween);

    /***********
     * Product *
     ***********/
    scene = new ScrollScene({triggerElement: "#pin", duration: 1100, offset: 2150})
                    .addTo(controller);
    tween = new TimelineMax()
                    .add(TweenMax.to("#can_shadow_c", 1, {opacity: 1}))
                    .add(TweenMax.to("#can_shadow_c", 2, {opacity: 1}))
                    .add(TweenMax.to("#can_shadow_c", 1, {opacity: 0}));
    scene.setTween(tween);
    
    scene = new ScrollScene({triggerElement: "#pin", duration: 1400, offset: 2150})
                    .addTo(controller);
    tween = new TimelineMax()
                    .add(TweenMax.to("#teensy", 1, {opacity: 1}))
                    .add(TweenMax.to("#bluetooth", 1, {opacity: 1}))
                    .add(TweenMax.to("#sdcard", 1, {opacity: 1}))
                    .add(TweenMax.to("#lipo", 1, {opacity: 1}))
                    .add(TweenMax.to("#charger", 1, {opacity: 1}))
                    .add(TweenMax.to("#charger", 8, {opacity: 1}))
                    .add(TweenMax.to("#teensy", 1, {opacity: 0}))
                    .add(TweenMax.to("#bluetooth", 1, {opacity: 0}))
                    .add(TweenMax.to("#sdcard", 1, {opacity: 0}))
                    .add(TweenMax.to("#lipo", 1, {opacity: 0}))
                    .add(TweenMax.to("#charger", 1, {opacity: 0}));
    scene.setTween(tween);

    new ScrollScene({triggerElement: "#pin", duration: 620, offset: 2200})
                    .setPin("#all")
                    .addTo(controller)
                    .on("enter", function(e) {
                        TweenMax.to('#product-indicator', 0.5, {opacity: 1});
                        activeIndicatorId = '#product-indicator';
                    })
                    .on("leave", function(e) {
                        TweenMax.to('#product-indicator', 0.5, {opacity: 0.2});
                    });

    scene = new ScrollScene({triggerElement: "#pin", duration: 1600, offset: 1900})
                    .addTo(controller);
    tween = new TimelineMax()
                    .add(TweenMax.fromTo('#product_content', 0.25, {x: -100, opacity: 0}, {x: 0, opacity: 1}))
                    .add(TweenMax.to('#product_content', 0.5, {x: 0, opacity: 1}))
                    .add(TweenMax.to('#product_content', 0.1, {x: -100, opacity: 0}));
    scene.setTween(tween);

    new ScrollScene({triggerElement: "#pin", duration: 620, offset: 1600})
                    .addTo(controller)
                    .on("progress", function(e) {
                        can_animation.gotoFrame(15 + Math.floor(e.progress * 25));
                    });

    /**********************
     * Transition: App    *
     **********************/
    scene = new ScrollScene({triggerElement: "#pin", duration: 1500, offset: 2820, triggerHook: "onEnter"})
                    .addTo(controller);
    tween = TweenMax.to("#transition_app", 1, {backgroundPosition: "-2800px 0px"});
    scene.setTween(tween);

    /*******
     * App *
     *******/
    new ScrollScene({triggerElement: "#pin", duration: 620, offset: 4000})
                    .setPin("#all")
                    .addTo(controller)
                    .on("enter", function(e) {
                        TweenMax.to('#app-indicator', 0.5, {opacity: 1});
                        activeIndicatorId = '#app-indicator';
                    })
                    .on("leave", function(e) {
                        TweenMax.to('#app-indicator', 0.5, {opacity: 0.2});
                    });
    scene = new ScrollScene({triggerElement: "#pin", duration: 620, offset: 3600})
                    .addTo(controller)
                    .on("progress", function(e) {
                        can_animation.gotoFrame(40 + Math.floor(e.progress * 62));
                    });
   
    scene = new ScrollScene({triggerElement: "#pin", duration: 1300, offset: 4050})
                    .addTo(controller);
    tween = new TimelineMax()
                    .add(TweenMax.fromTo('#app_content', 1, {x: -100, opacity: 0}, {x: 0, opacity: 1}))
                    .add(TweenMax.to("#app_content", 3, {alpha: 1}))
                    .add(TweenMax.to("#app_content", 1, {alpha: 0}));
    scene.setTween(tween);

    scene = new ScrollScene({triggerElement: "#pin", duration: 1000, offset: 4200, triggerHook: "onEnter"})
                    .addTo(controller);
    tween = new TimelineMax()
                    .add(TweenMax.to("#can_shadow_d", 1, {opacity: 1}))
                    .add(TweenMax.to("#can_shadow_d", 2, {opacity: 1}))
                    .add(TweenMax.to("#can_shadow_d", 1, {opacity: 0}));
    scene.setTween(tween);
    
    /**********************
     * Transition: Market *
     **********************/
    scene = new ScrollScene({triggerElement: "#pin", duration: 500, offset: 3700, triggerHook: "onEnter"})
                    .addTo(controller);
    tween = TweenMax.fromTo("#transition_market_a", 1, {opacity: 0}, {opacity: 1});
    scene.setTween(tween);
    
    scene = new ScrollScene({triggerElement: "#pin", duration: 250, offset: 4900, triggerHook: "onEnter"})
                    .addTo(controller);
    tween = TweenMax.to("#transition_market_b", 1, {opacity: 0});
    scene.setTween(tween);

    scene = new ScrollScene({triggerElement: "#pin", duration: 250, offset: 4900, triggerHook: "onEnter"})
                    .addTo(controller)
                    .on("progress", function(e) {
                        market_previous_frame_index = market_frame_index;
                        market_frame_index = Math.floor(e.progress * 9);
                        if (market_frame_index != market_previous_frame_index) {
                            $('#market-animation-frames img:nth-child(' +  + market_frame_index).css('visibility', 'visible');
                            $('#market-animation-frame-' + market_previous_frame_index).css('visibility', 'hidden');
                        }
                    });
     
    /**********
     * Market *
     **********/
    new ScrollScene({triggerElement: "#pin", duration: 2480, offset: 6000})
                    .setPin("#all")
                    .addTo(controller)
                    .on("enter", function(e) {
                        TweenMax.to('#market-indicator', 0.5, {opacity: 1});
                        activeIndicatorId = '#market-indicator';
                    })
                    .on("leave", function(e) {
                        TweenMax.to('#market-indicator', 0.5, {opacity: 0.2});
                    });
    
    scene = new ScrollScene({triggerElement: "#pin", duration: 1000, offset: 5900, triggerHook: "onEnter"})
                    .addTo(controller);
    tween = new TimelineMax()
                    .add(TweenMax.fromTo("#can_shadow_e", 1, {opacity: 0}, {opacity: 1}))
                    .add(TweenMax.to("#can_shadow_e", 2, {opacity: 1}))
    scene.setTween(tween);
    

    new ScrollScene({triggerElement: "#pin", duration: 620, offset: 5300, triggerHook: "onEnter"})
                    .addTo(controller)
                    .on("progress", function(e) {
                        can_animation.gotoFrame(103 + Math.floor(e.progress * 13));

                        /* Handle Screenshots */
                        if (screenshotPlaying === false && e.progress === 1) {
                            $('#screenshots').css('visibility', 'visible');
                            screenshotPlaying = true;
                        } else if (screenshotPlaying === true && e.progress < 1) {
                            $('#screenshots').css('visibility', 'hidden');
                            screenshotPlaying = false;
                        }
                    });

    scene = new ScrollScene({triggerElement: "#pin", duration: 1500, offset: 6500, triggerHook: "onEnter"})
                    .addTo(controller)
                    .on('enter', function(e) {
                        TweenMax.to('#screen1', 0.5, {x: -296});
                        TweenMax.to('#text1', 0.5, {x: 100, opacity: 1});
                    })
                    .on('leave', function(e) {
                        if ($(window).scrollTop() > 6910)
                            return;
                        TweenMax.to('#screen1', 0.5, {x: 0});
                        TweenMax.to('#text1', 0.5, {x: 0, opacity: 0});
                    });
    scene = new ScrollScene({triggerElement: "#pin", duration: 500, offset: 7000, triggerHook: "onEnter"})
                    .addTo(controller)
                    .on('enter', function(e) {
                        TweenMax.to('#screen1', 0.5, {x: -296});
                        TweenMax.to('#text1', 0.5, {x: 100, opacity: 1});
                        TweenMax.to('#screen2', 0.5, {x: -296});
                        TweenMax.to('#text2', 0.5, {x: 100, opacity: 1});
                    })
                    .on('leave', function(e) {
                        if ($(window).scrollTop() > 7260)
                            return;
                        TweenMax.to('#screen2', 0.5, {x: 0});
                        TweenMax.to('#text2', 0.5, {x: 0, opacity: 0});
                    });
    scene = new ScrollScene({triggerElement: "#pin", duration: 500, offset: 7500, triggerHook: "onEnter"})
                    .addTo(controller)
                    .on('enter', function(e) {
                        TweenMax.to('#screen1', 0.5, {x: -296});
                        TweenMax.to('#text1', 0.5, {x: 100, opacity: 1});
                        TweenMax.to('#screen2', 0.5, {x: -296});
                        TweenMax.to('#text2', 0.5, {x: 100, opacity: 1});
                        TweenMax.to('#screen3', 0.5, {x: -296});
                        TweenMax.to('#text3', 0.5, {x: 100, opacity: 1});
                    })
                    .on('leave', function(e) {
                        if ($(window).scrollTop() > 7610)
                            return;
                        TweenMax.to('#screen3', 0.5, {x: 0});
                        TweenMax.to('#text3', 0.5, {x: 0, opacity: 0});
                    });

    /* ScrollToPlugin stuff */
    $(document).on("click", "a[href^=#]", function (e) {
                var id = $(this).attr("href"), $elem = $(id);
                if ($elem.length > 0) {
                    e.preventDefault();
                    TweenMax.to(window, 1, {scrollTo: {y: $elem.offset().top}});
                    if (window.history && window.history.pushState) {
                        // if supported by the browser we can even update the URL.
                        history.pushState("", document.title, id);
                    }
                }
            });
});
