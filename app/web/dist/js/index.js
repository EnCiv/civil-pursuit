(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/***


      >=>             >=>  >=>                                            
    >>                >=>  >=>                                >=>         
  >=>> >>    >=>      >=>  >=>    >=>     >=>      >=>             >===>  
    >=>    >=>  >=>   >=>  >=>  >=>  >=>   >=>  >  >=>        >=> >=>     
    >=>   >=>    >=>  >=>  >=> >=>    >=>  >=> >>  >=>        >=>   >==>  
    >=>    >=>  >=>   >=>  >=>  >=>  >=>   >=>>  >=>=>        >=>     >=> 
    >=>      >=>     >==> >==>    >=>     >==>    >==> >=>    >=> >=> >=> 
                                                           >==>      



                                                  .andAHHAbnn.
                                             .aAHHHAAUUAAHHHAn.
                                            dHP^~"        "~^THb.
                                      .   .AHF                YHA.   .
                                      |  .AHHb.              .dHHA.  |
                                      |  HHAUAAHAbn      adAHAAUAHA  |
                                      I  HF~"_____        ____ ]HHH  I
                                     HHI HAPK""~^YUHb  dAHHHHHHHHHH IHH
                                     HHI HHHD> .andHH  HHUUP^~YHHHH IHH
                                     YUI ]HHP     "~Y  P~"     THH[ IUP
                                      "  `HK                   ]HH'  "
                                          THAn.  .d.aAAn.b.  .dHHP
                                          ]HHHHAAUP" ~~ "YUAAHHHH[
                                          `HHP^~"  .annn.  "~^YHH'
                                           YHb    ~" "" "~    dHF
                                            "YAb..abdHHbndbndAP"
                                             THHAAb.  .adAHHF
                                              "UHHHHHHHHHHU"
                                                ]HHUUHHHHHH[
                                              .adHHb "HHHHHbn.
                                       ..andAAHHHHHHb.AHHHHHHHAAbnn..
                                  .ndAAHHHHHHUUHHHHHHHHHHUP^~"~^YUHHHAAbn.
                                    "~^YUHHP"   "~^YUHHUP"        "^YUP^"
                                         ""         "~~"

  



  @repository https://github.com/co2-git/followjs
  @author https://github.com/co2-git

***/

; ! function () {

  'use strict';

  function Follow (object) {
    this.object = object;

    this.follower();
  }

  require('util').inherits(Follow, require('events').EventEmitter);

  Follow.prototype.follower = function () {

    var self = this;

    for ( var prop in this.object ) {
      self[prop] = this.object[prop];
    }

    if ( Object.observe ) { 
      
      Object.observe(self.object, function (changes) {
        
        changes.forEach(function (change) {
          
          var event = change.type + ' ' + change.name;
          
          var message = {
            name: change.name,
            new: change.object[change.name],
            old: change.oldValue,
            event: change.type
          };

          console.info(new (function __Followed__ () {
            this.event = message.event;
            this.name = message.name;
            this.message = message;
          }) ());

          self.emit(event, message);
        
        });
      });
    }

    else {

    }
  }

  if ( module && module.exports ) {
    module.exports = Follow;
  }

  if ( this ) {
    this.Follow = Follow;
  }

  return Follow;

}();

},{"events":22,"util":26}],2:[function(require,module,exports){
/***


         @\_______/@
        @|XXXXXXXX |
       @ |X||    X |
      @  |X||    X |
     @   |XXXXXXXX |
    @    |X||    X |             V
   @     |X||   .X |
  @      |X||.  .X |                      V
 @      |%XXXXXXXX%||
@       |X||  . . X||
        |X||   .. X||                               @     @
        |X||  .   X||.                              ||====%
        |X|| .    X|| .                             ||    %
        |X||.     X||   .                           ||====%
       |XXXXXXXXXXXX||     .                        ||    %
       |XXXXXXXXXXXX||         .                 .  ||====% .
       |XX|        X||                .        .    ||    %  .
       |XX|        X||                   .          ||====%   .
       |XX|        X||              .          .    ||    %     .
       |XX|======= X||============================+ || .. %  ........
===== /            X||                              ||    %
                   X||           /)                 ||    %
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Nina Butorac

                                                                             
                                                                             

       $$$$$$$  $$    $$  $$$$$$$    $$$$$$    $$$$$$    $$$$$$ 
      $$        $$    $$  $$    $$        $$  $$    $$  $$    $$
       $$$$$$   $$    $$  $$    $$   $$$$$$$  $$    $$  $$    $$
            $$  $$    $$  $$    $$  $$    $$  $$    $$  $$    $$
      $$$$$$$    $$$$$$$  $$    $$   $$$$$$$  $$$$$$$   $$$$$$$ 
                      $$                      $$        $$      
                      $$                      $$        $$     
                 $$$$$$                       $$        $$                     

    ***/

;! function () {

  'use strict';

  window.app       =   require('./true-story/app')();

  // app.emitter('socket').on('connect', function () {
  //   console.error('connect');
  // });

  // var visual       =   require('./true-story/true-visual-story')(app);

  // app.watchDog('story get intro');
  // app.watchDog('story get topics');

}();

},{"./true-story/app":3}],3:[function(require,module,exports){
/***


         @\_______/@
        @|XXXXXXXX |
       @ |X||    X |
      @  |X||    X |
     @   |XXXXXXXX |
    @    |X||    X |             V
   @     |X||   .X |
  @      |X||.  .X |                      V
 @      |%XXXXXXXX%||
@       |X||  . . X||
        |X||   .. X||                               @     @
        |X||  .   X||.                              ||====%
        |X|| .    X|| .                             ||    %
        |X||.     X||   .                           ||====%
       |XXXXXXXXXXXX||     .                        ||    %
       |XXXXXXXXXXXX||         .                 .  ||====% .
       |XX|        X||                .        .    ||    %  .
       |XX|        X||                   .          ||====%   .
       |XX|        X||              .          .    ||    %     .
       |XX|======= X||============================+ || .. %  ........
===== /            X||                              ||    %
                   X||           /)                 ||    %
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Nina Butorac

                                                                             
                                                                             

       $$$$$$$  $$    $$  $$$$$$$    $$$$$$    $$$$$$    $$$$$$ 
      $$        $$    $$  $$    $$        $$  $$    $$  $$    $$
       $$$$$$   $$    $$  $$    $$   $$$$$$$  $$    $$  $$    $$
            $$  $$    $$  $$    $$  $$    $$  $$    $$  $$    $$
      $$$$$$$    $$$$$$$  $$    $$   $$$$$$$  $$$$$$$   $$$$$$$ 
                      $$                      $$        $$      
                      $$                      $$        $$     
                 $$$$$$                       $$        $$                     







              ────────────────────▄▄▄▄
              ────────────────▄▄█▀▀──▀▀█▄
              ─────────────▄█▀▀─────────▀▀█▄
              ────────────▄█▀──▄▄▄▄▄▄──────▀█
              ────────────█───█▌────▀▀█▄─────█
              ────────────█──▄█────────▀▀▀█──█
              ────────────█──█──▀▀▀──▀▀▀▄─▐──█
              ────────────█──▌────────────▐──█
              ────────────█──▌─▄▀▀▄───────▐──█
              ───────────█▀▌█──▄▄▄───▄▀▀▄─▐──█
              ───────────▌─▀───█▄█▌─▄▄▄────█─█
              ───────────▌──────▀▀──█▄█▌────█
              ───────────█───────────▀▀─────▐
              ────────────█──────▌──────────█
              ────────────██────█──────────█
              ─────────────█──▄──█▄█─▄────█
              ─────────────█──▌─▄▄▄▄▄─█──█
              ─────────────█─────▄▄──▄▀─█
              ─────────────█▄──────────█
              ─────────────█▀█▄▄──▄▄▄▄▄█▄▄▄▄▄
              ───────────▄██▄──▀▀▀█─────────█
              ──────────██▄─█▄────█─────────█
              ───▄▄▄▄███──█▄─█▄───█─────────██▄▄▄
              ▄█▀▀────█────█──█▄──█▓▓▓▓▓▓▓▓▓█───▀▀▄
              █──────█─────█───████▓▓▓▓▓▓▓▓▓█────▀█
              █──────█─────█───█████▓▓▓▓▓▓▓█──────█
              █─────█──────█───███▀▀▀▀█▓▓▓█───────█
              █────█───────█───█───▄▄▄▄████───────█
              █────█───────█──▄▀───────────█──▄───█
              █────█───────█─▄▀─────█████▀▀▀─▄█───█
              █────█───────█▄▀────────█─█────█────█
              █────█───────█▀───────███─█────█────█
              █─────█────▄█▀──────────█─█────█────█
              █─────█──▄██▀────────▄▀██─█▄───█────█
              █────▄███▀─█───────▄█─▄█───█▄──█────█
              █─▄██▀──█──█─────▄███─█─────█──█────█
              ██▀────▄█───█▄▄▄█████─▀▀▀▀█▀▀──█────█
              █──────█────▄▀──█████─────█────▀█───█
              ───────█──▄█▀───█████─────█─────█───█
              ──────▄███▀─────▀███▀─────█─────█───█
              ─────────────────────────────────────
              ▀█▀─█▀▄─█─█─█▀────▄▀▀─▀█▀─▄▀▄─█▀▄─█─█
              ─█──█▄▀─█─█─█▀────▀▀█──█──█─█─█▄▀─█▄█
              ─▀──▀─▀─▀▀▀─▀▀────▀▀───▀───▀──▀─▀─▄▄█
              ─────────────────────────────────────





***/

;! function () {

  'use strict';

  var trueStory = require('/home/francois/Dev/true-story.js');

  module.exports = function () {

    return trueStory()

      .on('error', function (error) {
        console.error(error.message);
      })

      .model(require('./model'))

      .emitter('socket',
        io.connect('http://' + window.location.hostname + ':' +
          window.location.port))

      .view(require('./view'))

      .template(require('./template'))

      .controller(require('./controller'))

      .tell(require('./stories'))

      .watchDog({
        'story get topics':   require('./watchdogs/story-get-topics'),
        'story get intro':    require('./watchdogs/story-get-intro')
      });
    };

}();
},{"./controller":4,"./model":11,"./stories":12,"./template":17,"./view":18,"./watchdogs/story-get-intro":19,"./watchdogs/story-get-topics":20,"/home/francois/Dev/true-story.js":27}],4:[function(require,module,exports){
/***


         @\_______/@
        @|XXXXXXXX |
       @ |X||    X |
      @  |X||    X |
     @   |XXXXXXXX |
    @    |X||    X |             V
   @     |X||   .X |
  @      |X||.  .X |                      V
 @      |%XXXXXXXX%||
@       |X||  . . X||
        |X||   .. X||                               @     @
        |X||  .   X||.                              ||====%
        |X|| .    X|| .                             ||    %
        |X||.     X||   .                           ||====%
       |XXXXXXXXXXXX||     .                        ||    %
       |XXXXXXXXXXXX||         .                 .  ||====% .
       |XX|        X||                .        .    ||    %  .
       |XX|        X||                   .          ||====%   .
       |XX|        X||              .          .    ||    %     .
       |XX|======= X||============================+ || .. %  ........
===== /            X||                              ||    %
                   X||           /)                 ||    %
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Nina Butorac

                                                                             
                            
                                                                             
 $$$$$$$  $$    $$  $$$$$$$    $$$$$$    $$$$$$    $$$$$$      $$   $$$$$$$  
$$        $$    $$  $$    $$        $$  $$    $$  $$    $$         $$        
 $$$$$$   $$    $$  $$    $$   $$$$$$$  $$    $$  $$    $$     $$   $$$$$$   
      $$  $$    $$  $$    $$  $$    $$  $$    $$  $$    $$     $$        $$  
$$$$$$$    $$$$$$$  $$    $$   $$$$$$$  $$$$$$$   $$$$$$$      $$  $$$$$$$   
                $$                      $$        $$           $$            
          $$    $$                      $$        $$     $$    $$            
           $$$$$$                       $$        $$      $$$$$$             

***/



/**

               .. ..oooo.....ooo...
            .odSS4PYYYSSOOXXXXXXXXXOodbgooo.
           /SSYod$$$$SSOIIPXXXXXXXXXYYP.oo.*b.
          ($$Yd$$$$SSSOII:XXXXXXXX:IIoSSS$$b.Y,
           \Yd$$$$SSSOII:XXXXXXXXXX:IIOOSSS$$$b\
            d$$$$SSSOOI:XP"YXXXXXXXX:IIOOSSSS$$$\
            Y$$$SSSOOII:XbdXXXXXP"YX:IIOOOSS$$$$)
            'Y$$$SSSOI:XXXXXXXXXbodX:IIOOSS$$$$$/
             "Y$$$SSSOI(PoTXXXXXTo)XXIIOOOSS$$$*'
               ""*Y$S(((PXXXXXXXY))dIIOSSS$$dP'
                  "*'()P;XXXXXXXXY)IIOSSS$P".oS,
                  (S'(P;XXXXXXXP;Y)XXYOP".oSSSSb
                 (S'(P;'XXXXXXX';Y).ooooSSSSSSSS)
                 (S'(P;'XXXXXXP';Y).oSSSSSSSSSSSP
                 (SS'Y);YXXXXX';(Y.oSSSSSSSSSSSSP
                  YSS'Y)'YXXX".(Y.oSSP.SSSSSSSSY
                   YSS'"" XXX""oooSSP.SSSSSSSSY
                   SSSSSS YXXX:SSSSP.SSSSSSSSY
                   SSSSSP  YXb:SSSP.S"SSSSSSP
                   S(OO)S   YXb:SY    )SSSSS
                   SSSSO    )YXb.I    ISSSSP
                   YSSSY    I."YXXb   Y(SS)I
                   )SSS(    dSSo.""*b  YSSSY
                   OooSb   dSSSSP      )SSS(
                           dSSSY       OooSS
                           OooSP


                                   __                          __         
                                  /  |                        /  |        
    _______   ______   _______   _$$ |_     ______    ______  $$ |        
   /       | /      \ /       \ / $$   |   /      \  /      \ $$ | ______ 
  /$$$$$$$/ /$$$$$$  |$$$$$$$  |$$$$$$/   /$$$$$$  |/$$$$$$  |$$ |/      |
  $$ |      $$ |  $$ |$$ |  $$ |  $$ | __ $$ |  $$/ $$ |  $$ |$$ |$$$$$$/ 
  $$ \_____ $$ \__$$ |$$ |  $$ |  $$ |/  |$$ |      $$ \__$$ |$$ |        
  $$       |$$    $$/ $$ |  $$ |  $$  $$/ $$ |      $$    $$/ $$ |        
   $$$$$$$/  $$$$$$/  $$/   $$/    $$$$/  $$/        $$$$$$/  $$/         
                                                                          
                                                                          
                       __                               
                      /  |                              
                      $$ |  ______    ______    _______ 
               ______ $$ | /      \  /      \  /       |
              /      |$$ |/$$$$$$  |/$$$$$$  |/$$$$$$$/ 
              $$$$$$/ $$ |$$    $$ |$$ |  $$/ $$      \ 
                      $$ |$$$$$$$$/ $$ |       $$$$$$  |
                      $$ |$$       |$$ |      /     $$/ 
                      $$/  $$$$$$$/ $$/       $$$$$$$/  
                                      
                                      
                                      


***/

; ! function () {

  'use strict';

  module.exports = {
    'bootstrap/responsive-image':   require('./controllers/bootstrap/responsive-image'),
    'scroll to point of attention': require('./controllers/scroll-to-point-of-attention'),
    'show': require('./controllers/show'),
    'youtube': require('./controllers/youtube'),
    'item media': require('./controllers/item-media')
  };

} ();

},{"./controllers/bootstrap/responsive-image":5,"./controllers/item-media":6,"./controllers/scroll-to-point-of-attention":7,"./controllers/show":8,"./controllers/youtube":10}],5:[function(require,module,exports){
! function () {

  'use strict';

  module.exports = function bootstrapResponsiveImage (options) {
    console.info('[*]', "\tbootstr\*", 'responsive image', options);

    var img = $('<img/>');

    img.addClass('img-responsive');

    if ( options.src ) {
      img.attr('src', options.src);
    }

    return img;

  };

} ();

},{}],6:[function(require,module,exports){
; ! function () {

  'use strict';

  function itemMedia (item) {

    var app = this;

    var media;

    // youtube video from references

    if ( item.references.length ) {
      media = app.controller('youtube')(item.references[0].url);

      if ( media ) {
        return media;
      }
    }

    // image

    if ( item.image ) {
      return app.controller('bootstrap/responsive-image')({
        src: item.image
      });
    }
  }

  module.exports = itemMedia;

} ();

},{}],7:[function(require,module,exports){
; ! function () {

  'use strict';

  function scrollToPointOfAttention (pointOfAttention, cb, speed) {
    var poa = (pointOfAttention.offset().top - 80);

    var current = $('body').scrollTop();

    if ( 
      (current === poa) || 
      (current > poa && (current - poa < 50)) ||
      (poa > current && (poa - current < 50)) ) {

      return cb();
    }

    $('body').animate({
      scrollTop: poa + 'px'
    }, speed || 500, 'swing', function () {
      cb();
    });
  }

  module.exports = scrollToPointOfAttention;

}();

},{}],8:[function(require,module,exports){
; ! function () {

  'use strict';

  function show (elem, options, cb) {
    // if ANY element at all is in the process of being shown, then do nothing because it has the priority and is a blocker

    if ( elem.hasClass('.is-showing') || elem.hasClass('.is-hiding') ) {
      return false;
    }

    // make sure margin-top is equal to height for smooth scrolling

    elem.css('margin-top', '-' + elem.height() + 'px');

    // animate is-section

    elem.find('.is-section:first').animate(
      
      {
        'margin-top': 0,
        // 'padding-top': 0,
      },

      500,

      function () {
        elem.removeClass('is-showing').addClass('is-shown');
        
        if ( elem.css('margin-top') !== 0 ) {
          elem.animate({'margin-top': 0}, 250);
        }
        
        if ( cb ) {
          cb();
        }
      });

    elem.animate({
       opacity: 1
      }, 500);
  }

  module.exports = show;

}();

},{}],9:[function(require,module,exports){
; ! function () {

  'use strict';

  function Truncate (item) {

    // ============

    this.item = item;

    this.description = this.item.find('.description:first');

    this.textWrapper = this.item.find('.item-text:first');

    this.reference = this.item.find('.reference:first');

    this.text = this.description.text();

    this.words = this.text.split(' ');

    this.height = parseInt(this.textWrapper.css('paddingBottom'));

    this.truncated = false;

    this.moreLabel = 'more';

    this.lessLabel = 'less';

    this.isIntro = ( this.item.attr('id') === 'intro' );

    if ( ! this.isIntro ) {
      this._id = this.item.attr('id').split('-')[1];
    }

    // ============

    this.tagify();

    if ( this.truncated ) {
      item.addClass('is-truncated');
      this.appendMoreButton();
    }
  }

  Truncate.prototype.tagify = function () {

    var self = this;

    this.description.empty();

    this.reference.hide();

    var i = 0;

    this.words.forEach(function (word, index) {

      var span = $('<span class="word"></span>');

      if ( self.truncated ) {
        span.addClass('truncated');
        span.hide();
      }

      span.text(word + ' ');

      self.description.append(span);

      if ( i === 5 ) {

        var diff = self.textWrapper.height() > self.height;

        if ( diff && ! self.truncated && (index !== (self.words.length - 1)) ) {

          self.truncated = true;
        }

        i = -1;
      }

      i ++;
    });
  };

  Truncate.prototype.appendMoreButton = function () {

    var self = this;

    // create more button

    this.more = $('<span class="truncator"><i>... </i>[<a href=""></a>]</span>');

    // more button's text

    this.more.find('a').text(self.moreLabel);

    // more button's on click behavior

    this.more.find('a').on('click', function () {

      var moreLink = $(this);

      // Exit if already an animation in progress

      if ( self.item.find('.is-showing').length ) {
        return false;
      }

      require('./scroll-to-point-of-attention')(self.item, function () {

        // Show more

        if ( moreLink.text() === self.moreLabel ) {
          
          // If is intro

          if ( self.isIntro ) {
            self.unTruncate();
            moreLink.closest('span').find('.reference').show();
            moreLink.text(self.lessLabel);
            moreLink.closest('span').find('i').hide();
          }
          
          else {
            // If there is already stuff shown, hide it first

            if ( self.item.find('.is-shown').length ) {
              
              // Trigger the toggle view to hide current shown items

              $rootScope.publish("toggle view",
                { view: "text", item: self._id });

              // Listen on hiding done

              $rootScope.subscribe('did hide view', function (options) {

                // Make sure it concerns our item

                if ( options.item === self._id )  {

                  // untruncate

                  setTimeout(function () {
                    self.unTruncate();
                  });
                }
              });
            }

            else {
              self.unTruncate();
              moreLink.closest('span').find('.reference').show();
              moreLink.text(self.lessLabel);
              moreLink.closest('span').find('i').hide();
            }
          }
        }

        // hide

        else {
          self.reTruncate();
          moreLink.closest('span').find('.reference').hide();
          moreLink.text(self.moreLabel);
          moreLink.closest('span').find('i').show();
        }
      });

      return false;
    });

    this.description.append(this.more);
  };

  Truncate.prototype.unTruncate = function () {

    console.log('showing more');
      
    var self = this;

    var interval = 0;

    var inc = 50;

    // var inc = Math.ceil(self.height / self.words.length);

    // show words 50 by 50

    for ( var i = 0; i < this.words.length ; i += inc ) {
      setTimeout(function () {
        var k = this.i + inc;
        for ( var j = this.i; j < k ; j ++ ) {
          self.item.find('.truncated:eq(' + j + ')').show();
        }
      }.bind({ i: i }), interval += (inc * 1.5));
    }

    // on done showing words, wrap up
  };

  Truncate.prototype.reTruncate = function () {

    console.log('showing less');
    
    var self = this;

    var interval = 0;

    var inc = Math.ceil(self.height / self.words.length);

    for ( var i = 0; i < this.words.length ; i += inc ) {
      setTimeout(function () {
        var k = this.i + inc;
        for ( var j = this.i; j < k ; j ++ ) {
          self.item.find('.truncated:eq(' + j + ')').hide();
        }
      }.bind({ i: i }), interval += (inc * 2));
    }
  };

  module.exports = Truncate;  

}();

},{"./scroll-to-point-of-attention":7}],10:[function(require,module,exports){
; ! function () {

  'use strict';

  var regexYouTube = /youtu\.?be.+v=([^&]+)/;

  function youTubePreview (url) {
    var youtube;

    if ( regexYouTube.test(url) ) {
      url.replace(regexYouTube, function (m, v) {
        youtube = v;
      });
      var container = $('<div></div>');
      container.addClass('video-container');
      var iframe = $('<iframe></iframe>');
      iframe.attr('src', 'http://www.youtube.com/embed/' + youtube);
      iframe.attr('frameborder', '0');
      iframe.attr('width', 560);
      iframe.attr('height', 315);
      container.append(iframe);

      return container;
    }
  }

  module.exports = youTubePreview;

}();

},{}],11:[function(require,module,exports){
/***


         @\_______/@
        @|XXXXXXXX |
       @ |X||    X |
      @  |X||    X |
     @   |XXXXXXXX |
    @    |X||    X |             V
   @     |X||   .X |
  @      |X||.  .X |                      V
 @      |%XXXXXXXX%||
@       |X||  . . X||
        |X||   .. X||                               @     @
        |X||  .   X||.                              ||====%
        |X|| .    X|| .                             ||    %
        |X||.     X||   .                           ||====%
       |XXXXXXXXXXXX||     .                        ||    %
       |XXXXXXXXXXXX||         .                 .  ||====% .
       |XX|        X||                .        .    ||    %  .
       |XX|        X||                   .          ||====%   .
       |XX|        X||              .          .    ||    %     .
       |XX|======= X||============================+ || .. %  ........
===== /            X||                              ||    %
                   X||           /)                 ||    %
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Nina Butorac

                                                                             
                                                                             
                                                                             
                                                                             
 $$$$$$$  $$    $$  $$$$$$$    $$$$$$    $$$$$$    $$$$$$      $$   $$$$$$$  
$$        $$    $$  $$    $$        $$  $$    $$  $$    $$         $$        
 $$$$$$   $$    $$  $$    $$   $$$$$$$  $$    $$  $$    $$     $$   $$$$$$   
      $$  $$    $$  $$    $$  $$    $$  $$    $$  $$    $$     $$        $$  
$$$$$$$    $$$$$$$  $$    $$   $$$$$$$  $$$$$$$   $$$$$$$      $$  $$$$$$$   
                $$                      $$        $$           $$            
          $$    $$                      $$        $$     $$    $$            
           $$$$$$                       $$        $$      $$$$$$             

***/



; ! function () {

  'use strict';

  module.exports = {
    "user":                       synapp.user,
    "panels":                     [],
    "templates":                  {},
    "intro":                      null,
    "items":                      [],
    "online_users":               0,
    "panel":                      {},
    "evaluations":                []
  };

} ();

},{}],12:[function(require,module,exports){
/***


         @\_______/@
        @|XXXXXXXX |
       @ |X||    X |
      @  |X||    X |
     @   |XXXXXXXX |
    @    |X||    X |             V
   @     |X||   .X |
  @      |X||.  .X |                      V
 @      |%XXXXXXXX%||
@       |X||  . . X||
        |X||   .. X||                               @     @
        |X||  .   X||.                              ||====%
        |X|| .    X|| .                             ||    %
        |X||.     X||   .                           ||====%
       |XXXXXXXXXXXX||     .                        ||    %
       |XXXXXXXXXXXX||         .                 .  ||====% .
       |XX|        X||                .        .    ||    %  .
       |XX|        X||                   .          ||====%   .
       |XX|        X||              .          .    ||    %     .
       |XX|======= X||============================+ || .. %  ........
===== /            X||                              ||    %
                   X||           /)                 ||    %
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Nina Butorac

                                                                             
                                                                             
 $$$$$$$  $$    $$  $$$$$$$    $$$$$$    $$$$$$    $$$$$$      $$   $$$$$$$  
$$        $$    $$  $$    $$        $$  $$    $$  $$    $$         $$        
 $$$$$$   $$    $$  $$    $$   $$$$$$$  $$    $$  $$    $$     $$   $$$$$$   
      $$  $$    $$  $$    $$  $$    $$  $$    $$  $$    $$     $$        $$  
$$$$$$$    $$$$$$$  $$    $$   $$$$$$$  $$$$$$$   $$$$$$$      $$  $$$$$$$   
                $$                      $$        $$           $$            
          $$    $$                      $$        $$     $$    $$            
           $$$$$$                       $$        $$      $$$$$$               


***/


! function () {

  'use strict';

  module.exports = function (when) {

    var app = this;

    // http://patorjk.com/software/taag/#p=display&f=Small&t=online

    /** SOCKET ERROR */

    this.emitter('socket')
      
      .on('error', function (error) {
        console.warn('socket error', socket);
      });


    /** Get intro */

    require('./stories/get-intro').apply(this);
      
    /** Get panel */

    require('./stories/get-panel').apply(this);

    /** Get items **/

    require('./stories/get-items').apply(this);

    /** Get evaluations */

    function getEvaluation () {
      var app = this;

      app.emitter('socket').on('got evaluation',
        function (evaluation) {
          evaluation.cursor = 1;
          evaluation.limit = 5;

          if ( evaluation.items.length < 6 ) {
            evaluation.limit = evaluation.items.length - 1;

            if ( ! evaluation.limit && evaluation.items.length === 1 ) {
              evaluation.limit = 1;
            }
          }

          app.model('evaluations').push(evaluation);
        });

      app.on('push evaluations', function (evaluation) {
        var itemID = '#item-' + evaluation.item;

        var item = $(itemID);

        item.find('.evaluator .cursor').text(evaluation.cursor); 
        item.find('.evaluator .limit').text(evaluation.limit);

        item.find('.evaluator .image:eq(0)').append(
          app.controller('item media')(evaluation.items[0]));

        item.find('.evaluator .image:eq(1)').append(
          app.controller('item media')(evaluation.items[1]));

        item.find('.evaluator .subject:eq(0)').text(
          evaluation.items[0].subject);

        item.find('.evaluator .subject:eq(1)').text(
          evaluation.items[1].subject);

        item.find('.evaluator .description:eq(0)').text(
          evaluation.items[0].description);

        item.find('.evaluator .description:eq(1)').text(
          evaluation.items[1].description);

        evaluation.criterias.forEach(function (criteria) {
          var template_name = 'evaluation-' + evaluation.item +
            '-' + criteria._id;

          var template = {
            name: template_name,
            template: item.find('.evaluator .criteria-slider:eq(0)'),
            controller: function (view, locals) {
              view.find('.criteria-name').text(criteria.name);
              view.find('input.slider').slider();
              view.find('input.slider').slider('setValue', 0);
              view.find('input.slider').slider('on', 'slideStop',
                function () {

                });
            }
          };

          app.render(template, {});

          app.on('rendered ' + template_name, function (view) {
            view.css('display', 'block');
            item.find('.evaluator .sliders').append(view);
          });
        });

      });
    }

    getEvaluation.apply(this);

    /** Online now **/

    require('./stories/get-online-users').apply(this);

    /** MODEL */

    /** when emitter socket triggers error  */
    /** then Function */

    // when()
    //   .emitter('socket')
    //   .triggers('error')
    //   .then(function (error) {
    //     console.warn('TOLD YOU SO');
    //   });

    /** when emitter "socket" on "connect" */
    /** then trigger "socket" on "get intro" */
    /** then push "panels" {Panel} */

    // when()
    //   .emitter('socket')
    //   .triggers('connect')
    //   .then(function () {
    //     console.log('//////////7')
    //   });

    // when()
    //   .model('panels')
    //   .triggers('push')
    //   .then
    //     .render('panel');

  };

}();

},{"./stories/get-intro":13,"./stories/get-items":14,"./stories/get-online-users":15,"./stories/get-panel":16}],13:[function(require,module,exports){
! function () {
  
  'use strict';

  function getIntro () {

    var app = this;

    app.emitter('socket')

      .on('connect', function () {

        if ( ! app.model('intro') ) {
          app.emitter('socket').emit('get intro');
        }

        app.follow
      
          .on('update intro', function (intro) {
            app.render('intro', intro.new);
          });
      
      })

      .on('got intro', function (intro) {
        app.model('intro', intro);
      });

  }

  module.exports = getIntro;

}();

},{}],14:[function(require,module,exports){
! function () {
  
  'use strict';

  function getItems () {

    var app = this;

    app.on('panel added', function (panel) {
      
      var panelId = '#panel-' + panel.type;

      if ( panel.parent ) {
        panelId += '-' + panel.parent;
      }

      app.emitter('socket')
        
        .emit('get items', panel)
        
        .on('got items', function (panelItems) {
          
          panelItems.items.forEach(function (item, index) {
            
            if ( index < (panel.size + panel.skip) - 1 ) {
              app.model('items').push(item);
            }
          
          });

          if ( panelItems.items.length >= (panel.size + panel.skip) ) {
            $(panelId).find('.load-more').show();
          }
          else {
            $(panelId).find('.load-more').hide();
          }

          panel.skip += (panelItems.items.length - 1);
        });

      app.on('push items', function (item) {
        app.render('item', item);

        app.on('rendered item', function (itemView) {
          $(panelId).find('.items').append(itemView);
        });
      });

    });

  }

  module.exports = getItems;

}();

},{}],15:[function(require,module,exports){
; ! function () {

  'use strict';

  function getOnlineUsers () {
    var app = this;

    app.emitter('socket').on('online users', function (users) {
      app.model('online_users', users);
    });

    app.follow.on('update online_users', function (users) {
      app.view('online now').text(users.new);
    });
  }

  module.exports = getOnlineUsers;

} ();
},{}],16:[function(require,module,exports){
! function () {
  
  'use strict';

  function getPanel () {

    var app = this;

    app.emitter('socket')

      .on('connect', function () {
        if ( ! app.model('panels').length ) {
          app.model('panels').push({
            type: 'Topic',
            size: synapp['navigator batch size'],
            skip: 0
          });
        }
      });

    app
      .on('push panels', function (panel) {
        app.render('panel', panel);

        app
          .once('rendered panel', function (panelView) {
            app.view('panels').append(panelView);
            app.emit('panel added', panel);
          });
      });

  }

  module.exports = getPanel;

}();

},{}],17:[function(require,module,exports){
! function () {

  'use strict';

  function reveal (elem, poa) {
    if ( ! elem.hasClass('is-toggable') ) {
      elem.addClass('is-toggable');
    }

    if ( elem.hasClass('is-showing') || elem.hasClass('is-hiding') ) {
      return false;
    }

    elem.removeClass('is-hidden').addClass('is-showing');

    app.controller('scroll to point of attention')(poa, function () {
      app.controller('show')(elem);
      // elem.css('display', 'block');
    });
  }

  module.exports = {
    
    "online users": {
      template:     '.online-users',
      
      controller:   function (view, online_users) {
        view.text(online_users);
      }
    },

    "panel": {
      url:          '/partial/panel',
      
      controller:   function (view, panel) {

        var app = this;

        var id = 'panel-' + panel.type;

        if ( panel.parent ) {
          id += '-' + panel.parent;
        }

        view.attr('id', id);

        view.find('.panel-title').text(panel.type);

        view.find('.load-more').on('click', function () {
          app.emitter('socket').emit('get items', panel);
          return false;
        });

        view.find('.toggle-creator').on('click', function () {
          reveal(view.find('.creator'), view);
        });

      }
    },

    "intro": {
      template: '#intro',
      controller: function (view, intro) {
        var app = this;

        // view.find('.panel-title').text('intro.subject');
        $('#intro').find('.panel-title').text(intro.subject);
        $('#intro').find('.item-title').text(intro.subject);
        $('#intro').find('.description').text(intro.description);

        $('#intro').find('.item-media').append(
          app.controller('bootstrap/responsive-image')({
            src: intro.image
          }));

        $('#intro').find('.item-references').hide();

        new (require('./controllers/truncate'))($('#intro'));

        $('#intro').find('.promoted').hide();

        $('#intro').find('.box-buttons').hide();
      }
    },

    "item": {
      url: '/partial/item',
      controller: function (view, item) {

        var app = this;

        view.attr('id', 'item-' + item._id);

        view.find('.item-title').text(item.subject);
        view.find('.description').text(item.description);

        // REFERENCES

        if ( item.references.length ) {
          view.find('.item-references').show();
          view.find('.item-references a')
            .attr('src', item.references[0].url)
            .text(item.references[0].title || item.references[0].url);
        }
        else {
          view.find('.item-references').hide();
        }

        // TRUNCATE

        new (require('./controllers/truncate'))(view);

        // ITEM MEDIA

        view.find('.item-media').append(
          app.controller('item media')(item));

        // ITEM STATS

        view.find('.promoted').text(item.promotions);
        
        if ( item.promotions ) {
          view.find('.promoted-percent').text(
            Math.floor(item.promotions * 100 / item.views) + '%');
        }
        else {
          view.find('.promoted-percent').text('0%');
        }

        // ITEM TOGGLE PROMOTE

        view.find('.toggle-promote').on('click', function () {

          var evaluator = view.find('.evaluator');

          if ( ! evaluator.hasClass('is-toggable') ) {
            evaluator.addClass('is-toggable');
          }

          if ( evaluator.hasClass('is-showing') || evaluator.hasClass('is-hiding') ) {
            return false;
          }

          evaluator.removeClass('is-hidden').addClass('is-showing');

          app.controller('scroll to point of attention')(view, function () {
            app.controller('show')(evaluator);

            var evaluationExists = app.model('evaluations').some(function (evaluation) {
              return evaluation.item === item._id;
            });

            if ( ! evaluationExists ) {
              app.emitter('socket').emit('get evaluation', item);
            }
          });

          return false;
        });

        // ITEM TOGGLE DETAILS

        view.find('.toggle-details').on('click', function () {

          var details = view.find('.details');

          if ( ! details.hasClass('is-toggable') ) {
            details.addClass('is-toggable');
          }

          if ( details.hasClass('is-showing') || details.hasClass('is-hiding') ) {
            return false;
          }

          details.removeClass('is-hidden').addClass('is-showing');

          app.controller('scroll to point of attention')(view, function () {
            app.controller('show')(details);
          });

        });
      }
    }
  
  };

}();

},{"./controllers/truncate":9}],18:[function(require,module,exports){
/***


         @\_______/@
        @|XXXXXXXX |
       @ |X||    X |
      @  |X||    X |
     @   |XXXXXXXX |
    @    |X||    X |             V
   @     |X||   .X |
  @      |X||.  .X |                      V
 @      |%XXXXXXXX%||
@       |X||  . . X||
        |X||   .. X||                               @     @
        |X||  .   X||.                              ||====%
        |X|| .    X|| .                             ||    %
        |X||.     X||   .                           ||====%
       |XXXXXXXXXXXX||     .                        ||    %
       |XXXXXXXXXXXX||         .                 .  ||====% .
       |XX|        X||                .        .    ||    %  .
       |XX|        X||                   .          ||====%   .
       |XX|        X||              .          .    ||    %     .
       |XX|======= X||============================+ || .. %  ........
===== /            X||                              ||    %
                   X||           /)                 ||    %
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Nina Butorac

                                                                             
                                                                             
                                                                             
                                                                             
 $$$$$$$  $$    $$  $$$$$$$    $$$$$$    $$$$$$    $$$$$$      $$   $$$$$$$  
$$        $$    $$  $$    $$        $$  $$    $$  $$    $$         $$        
 $$$$$$   $$    $$  $$    $$   $$$$$$$  $$    $$  $$    $$     $$   $$$$$$   
      $$  $$    $$  $$    $$  $$    $$  $$    $$  $$    $$     $$        $$  
$$$$$$$    $$$$$$$  $$    $$   $$$$$$$  $$$$$$$   $$$$$$$      $$  $$$$$$$   
                $$                      $$        $$           $$            
          $$    $$                      $$        $$     $$    $$            
           $$$$$$                       $$        $$      $$$$$$             

***/




/***


                          ,
                     ,   /^\     ___
                    /^\_/   `...'  /`
                 ,__\    ,'     ~ (
              ,___\ ,,    .,       \
               \___ \\\ .'.'   .-.  )
                 .'.-\\\`.`.  '.-. (
                / (==== ."".  ( o ) \
              ,/u  `~~~'|  /   `-'   )
             "")^u ^u^|~| `""".  ~_ /
               /^u ^u ^\~\     ".  \\
       _      /u^  u ^u  ~\      ". \\
      ( \     )^ ^U ^U ^U\~\      ". \\
     (_ (\   /^U ^ ^U ^U  ~|       ". `\
    (_  _ \  )U ^ U^ ^U ^|~|        ". `\.
   (_  = _(\ \^ U ^U ^ U^ ~|          ".`.;      Joan Stark
  (_ -(    _\_)U ^ ^ U^ ^|~|            ""
  (_    =   ( ^ U^ U^ ^ U ~|
  (_ -  ( ~  = ^ U ^U U ^|~/
   (_  =     (_^U^ ^ U^ U /
    (_-   ~_(/ \^ U^ ^U^,"
     (_ =  _/   |^ u^u."
      (_  (/    |u^ u.(
       (__/     )^u^ u/
               /u^ u^(
              |^ u^ u/
              |u^ u^(       ____
              |^u^ u(    .-'    `-,
               \^u ^ \  / ' .---.  \
         jgs    \^ u^u\ |  '  `  ;  |
                 \u^u^u:` . `-'  ;  |
                  `-.^ u`._   _.'^'./
                     "-.^.-```_=~._/


            __                                   
             /  |                                  
   __     __ $$/   ______   __   __   __   _______ 
  /  \   /  |/  | /      \ /  | /  | /  | /       |
  $$  \ /$$/ $$ |/$$$$$$  |$$ | $$ | $$ |/$$$$$$$/ 
   $$  /$$/  $$ |$$    $$ |$$ | $$ | $$ |$$      \ 
    $$ $$/   $$ |$$$$$$$$/ $$ \_$$ \_$$ | $$$$$$  |
     $$$/    $$ |$$       |$$   $$   $$/ /     $$/ 
      $/     $$/  $$$$$$$/  $$$$$/$$$$/  $$$$$$$/  
                                                 
                                             

**/

; ! function () {

  'use strict';

  module.exports = {
    "panels":       '.panels',
    "intro":        '#intro',
    "online now":   '.online-users'
  };

} ();

},{}],19:[function(require,module,exports){
/***


         @\_______/@
        @|XXXXXXXX |
       @ |X||    X |
      @  |X||    X |
     @   |XXXXXXXX |
    @    |X||    X |             V
   @     |X||   .X |
  @      |X||.  .X |                      V
 @      |%XXXXXXXX%||
@       |X||  . . X||
        |X||   .. X||                               @     @
        |X||  .   X||.                              ||====%
        |X|| .    X|| .                             ||    %
        |X||.     X||   .                           ||====%
       |XXXXXXXXXXXX||     .                        ||    %
       |XXXXXXXXXXXX||         .                 .  ||====% .
       |XX|        X||                .        .    ||    %  .
       |XX|        X||                   .          ||====%   .
       |XX|        X||              .          .    ||    %     .
       |XX|======= X||============================+ || .. %  ........
===== /            X||                              ||    %
                   X||           /)                 ||    %
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Nina Butorac

                                                                             
                                                                             
                                                                             
                                                                             
 $$$$$$$  $$    $$  $$$$$$$    $$$$$$    $$$$$$    $$$$$$      $$   $$$$$$$  
$$        $$    $$  $$    $$        $$  $$    $$  $$    $$         $$        
 $$$$$$   $$    $$  $$    $$   $$$$$$$  $$    $$  $$    $$     $$   $$$$$$   
      $$  $$    $$  $$    $$  $$    $$  $$    $$  $$    $$     $$        $$  
$$$$$$$    $$$$$$$  $$    $$   $$$$$$$  $$$$$$$   $$$$$$$      $$  $$$$$$$   
                $$                      $$        $$           $$            
          $$    $$                      $$        $$     $$    $$            
           $$$$$$                       $$        $$      $$$$$$             







                                        _.-.._         _._
                                     _,/^^,y./  ^^^^"""^^\= \
                                     \y###XX;/  /     \    ^\^\
                                       `\Y^   /   .-==||==-.)^^
                   ,.-=""""=-.__       /^ (  (   -/<0>++<0>(
                 .^      .: . . :^===(^ \ (  (  /```^^^^^^^)
                /      .: .,GGGGp,_ .(   \   /    /-(o'~'o))
              .^      : . gGG"""YGG}. \   )   / /  _/-====-\
             /       (. .gGP  __ ~~ . .\  \  (    (  _.---._)
            /        (. (GGb,,)GGp. . . \_-^-.__(_ /______./
           (          \ . `"!GGP^ . . . . ^=-._--_--^^^^^~)
           (        /^^^\_. . . . . . . . . . . . . . . . )
           )       /     /._. . . . . . . . . . . . . ._.=)
           \      /      |  ^"=.. . . . . . . ._++""\"^    \
            \    |       |       )^|^^~'---'~^^      \     )
            )   /        )      /   \                 \    \
            |`  |        \     /\    \                (    /
            |   |         (   (  \ . .\               |   (
            )   |         )   )   ^^^^^^              |   |
           /. . \         |  '|                       )   (
           ^^^^^^         )    \                      /. . \
                          / . . \                     ^^^^^^


                          

                                                            
                                                            
              $$$$$$$$                     $$               
                 $$                        $$               
                 $$   $$$$$$    $$$$$$$  $$$$$$    $$$$$$$  
                 $$  $$    $$  $$          $$     $$        
                 $$  $$$$$$$$   $$$$$$     $$      $$$$$$   
                 $$  $$              $$    $$  $$       $$  
                 $$   $$$$$$$  $$$$$$$      $$$$  $$$$$$$   
                                                            
                                                            


                                                                        
                                                                        
                    $$                          $$                      
                    $$                                                  
         $$$$$$$  $$$$$$     $$$$$$    $$$$$$   $$   $$$$$$    $$$$$$$  
        $$          $$      $$    $$  $$    $$  $$  $$    $$  $$        
         $$$$$$     $$      $$    $$  $$        $$  $$$$$$$$   $$$$$$   
              $$    $$  $$  $$    $$  $$        $$  $$              $$  
        $$$$$$$      $$$$    $$$$$$   $$        $$   $$$$$$$  $$$$$$$   
                                                                        
                                                                        
                                                                
                              
                                                
                                        $$      
                                        $$      
                   $$$$$$    $$$$$$   $$$$$$    
                  $$    $$  $$    $$    $$      
                  $$    $$  $$$$$$$$    $$      
                  $$    $$  $$          $$  $$  
                   $$$$$$$   $$$$$$$     $$$$   
                        $$                      
                  $$    $$                      
                   $$$$$$                       




                                            
                                                          
              $$              $$                          
                              $$                          
              $$  $$$$$$$   $$$$$$     $$$$$$    $$$$$$   
              $$  $$    $$    $$      $$    $$  $$    $$  
              $$  $$    $$    $$      $$        $$    $$  
              $$  $$    $$    $$  $$  $$        $$    $$  
              $$  $$    $$     $$$$   $$         $$$$$$   
                                                          
                                                          








                                            
***/

; ! function () {

  'use strict';

  module.exports = [
    {
      emitter: 'socket',
      event: 'connect',
      listener: 'on'
    },

    {
      emitter: 'socket',
      event: 'got intro',
      listener: 'on'
    },

    {
      model: 'intro',
      event: 'update',
      listener: 'on'
    },

    {
      event: 'template rendered',
      listener: 'on',
      run: function (dom) {

        return [

          dom.attr('id') === this.view('intro').attr('id'),

          ! dom.find('.iddle').length

        
        ].every(function (assertion) {
         
          return assertion;
        });
      }
    }
  ];

} ();

},{}],20:[function(require,module,exports){
/***


         @\_______/@
        @|XXXXXXXX |
       @ |X||    X |
      @  |X||    X |
     @   |XXXXXXXX |
    @    |X||    X |             V
   @     |X||   .X |
  @      |X||.  .X |                      V
 @      |%XXXXXXXX%||
@       |X||  . . X||
        |X||   .. X||                               @     @
        |X||  .   X||.                              ||====%
        |X|| .    X|| .                             ||    %
        |X||.     X||   .                           ||====%
       |XXXXXXXXXXXX||     .                        ||    %
       |XXXXXXXXXXXX||         .                 .  ||====% .
       |XX|        X||                .        .    ||    %  .
       |XX|        X||                   .          ||====%   .
       |XX|        X||              .          .    ||    %     .
       |XX|======= X||============================+ || .. %  ........
===== /            X||                              ||    %
                   X||           /)                 ||    %
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Nina Butorac

                                                                             
                                                                             
                                                                             
                                                                             
 $$$$$$$  $$    $$  $$$$$$$    $$$$$$    $$$$$$    $$$$$$      $$   $$$$$$$  
$$        $$    $$  $$    $$        $$  $$    $$  $$    $$         $$        
 $$$$$$   $$    $$  $$    $$   $$$$$$$  $$    $$  $$    $$     $$   $$$$$$   
      $$  $$    $$  $$    $$  $$    $$  $$    $$  $$    $$     $$        $$  
$$$$$$$    $$$$$$$  $$    $$   $$$$$$$  $$$$$$$   $$$$$$$      $$  $$$$$$$   
                $$                      $$        $$           $$            
          $$    $$                      $$        $$     $$    $$            
           $$$$$$                       $$        $$      $$$$$$             







                                        _.-.._         _._
                                     _,/^^,y./  ^^^^"""^^\= \
                                     \y###XX;/  /     \    ^\^\
                                       `\Y^   /   .-==||==-.)^^
                   ,.-=""""=-.__       /^ (  (   -/<0>++<0>(
                 .^      .: . . :^===(^ \ (  (  /```^^^^^^^)
                /      .: .,GGGGp,_ .(   \   /    /-(o'~'o))
              .^      : . gGG"""YGG}. \   )   / /  _/-====-\
             /       (. .gGP  __ ~~ . .\  \  (    (  _.---._)
            /        (. (GGb,,)GGp. . . \_-^-.__(_ /______./
           (          \ . `"!GGP^ . . . . ^=-._--_--^^^^^~)
           (        /^^^\_. . . . . . . . . . . . . . . . )
           )       /     /._. . . . . . . . . . . . . ._.=)
           \      /      |  ^"=.. . . . . . . ._++""\"^    \
            \    |       |       )^|^^~'---'~^^      \     )
            )   /        )      /   \                 \    \
            |`  |        \     /\    \                (    /
            |   |         (   (  \ . .\               |   (
            )   |         )   )   ^^^^^^              |   |
           /. . \         |  '|                       )   (
           ^^^^^^         )    \                      /. . \
                          / . . \                     ^^^^^^


                          

                                                            
                                                            
              $$$$$$$$                     $$               
                 $$                        $$               
                 $$   $$$$$$    $$$$$$$  $$$$$$    $$$$$$$  
                 $$  $$    $$  $$          $$     $$        
                 $$  $$$$$$$$   $$$$$$     $$      $$$$$$   
                 $$  $$              $$    $$  $$       $$  
                 $$   $$$$$$$  $$$$$$$      $$$$  $$$$$$$   
                                                            
                                                            


                                                                        
                                                                        
                    $$                          $$                      
                    $$                                                  
         $$$$$$$  $$$$$$     $$$$$$    $$$$$$   $$   $$$$$$    $$$$$$$  
        $$          $$      $$    $$  $$    $$  $$  $$    $$  $$        
         $$$$$$     $$      $$    $$  $$        $$  $$$$$$$$   $$$$$$   
              $$    $$  $$  $$    $$  $$        $$  $$              $$  
        $$$$$$$      $$$$    $$$$$$   $$        $$   $$$$$$$  $$$$$$$   
                                                                        
                                                                        
                                                                
                              
                                                
                                        $$      
                                        $$      
                   $$$$$$    $$$$$$   $$$$$$    
                  $$    $$  $$    $$    $$      
                  $$    $$  $$$$$$$$    $$      
                  $$    $$  $$          $$  $$  
                   $$$$$$$   $$$$$$$     $$$$   
                        $$                      
                  $$    $$                      
                   $$$$$$                       




                                                                
            $$                          $$                      
            $$                                                  
          $$$$$$     $$$$$$    $$$$$$   $$   $$$$$$$   $$$$$$$  
            $$      $$    $$  $$    $$  $$  $$        $$        
            $$      $$    $$  $$    $$  $$  $$         $$$$$$   
            $$  $$  $$    $$  $$    $$  $$  $$              $$  
             $$$$    $$$$$$   $$$$$$$   $$   $$$$$$$  $$$$$$$   
                              $$                                
                              $$                                
                              $$                                
                                                           

***/

; ! function () {

  'use strict';

  module.exports = [
    {
      emitter: 'socket',
      event: 'connect',
      listener: 'on'
    },

    {
      model: 'panels',
      event: 'push',
      listener: 'on'
    },

    {
      model: 'panel',
      event: 'update',
      listener: 'on'
    },

    {
      emitter: 'socket',
      event: 'got panel items',
      listener: 'on'
    },

    {
      model: 'items',
      event: 'concat',
      listener: 'on'
    }
  ];

} ();

},{}],21:[function(require,module,exports){
/*global define:false require:false */
module.exports = (function(){
	// Import Events
	var events = require('events');

	// Export Domain
	var domain = {};
	domain.createDomain = domain.create = function(){
		var d = new events.EventEmitter();

		function emitError(e) {
			d.emit('error', e)
		}

		d.add = function(emitter){
			emitter.on('error', emitError);
		}
		d.remove = function(emitter){
			emitter.removeListener('error', emitError);
		}
		d.run = function(fn){
			try {
				fn();
			}
			catch (err) {
				this.emit('error', err);
			}
			return this;
		};
		d.dispose = function(){
			this.removeAllListeners();
			return this;
		};
		return d;
	};
	return domain;
}).call(this);
},{"events":22}],22:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],23:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],24:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canMutationObserver = typeof window !== 'undefined'
    && window.MutationObserver;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    var queue = [];

    if (canMutationObserver) {
        var hiddenDiv = document.createElement("div");
        var observer = new MutationObserver(function () {
            var queueList = queue.slice();
            queue.length = 0;
            queueList.forEach(function (fn) {
                fn();
            });
        });

        observer.observe(hiddenDiv, { attributes: true });

        return function nextTick(fn) {
            if (!queue.length) {
                hiddenDiv.setAttribute('yes', 'no');
            }
            queue.push(fn);
        };
    }

    if (canPost) {
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],25:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],26:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":25,"_process":24,"inherits":23}],27:[function(require,module,exports){
/***

────────────────────▄▄▄▄
────────────────▄▄█▀▀──▀▀█▄
─────────────▄█▀▀─────────▀▀█▄
────────────▄█▀──▄▄▄▄▄▄──────▀█
────────────█───█▌────▀▀█▄─────█
────────────█──▄█────────▀▀▀█──█
────────────█──█──▀▀▀──▀▀▀▄─▐──█
────────────█──▌────────────▐──█
────────────█──▌─▄▀▀▄───────▐──█
───────────█▀▌█──▄▄▄───▄▀▀▄─▐──█
───────────▌─▀───█▄█▌─▄▄▄────█─█
───────────▌──────▀▀──█▄█▌────█
───────────█───────────▀▀─────▐
────────────█──────▌──────────█
────────────██────█──────────█
─────────────█──▄──█▄█─▄────█
─────────────█──▌─▄▄▄▄▄─█──█
─────────────█─────▄▄──▄▀─█
─────────────█▄──────────█
─────────────█▀█▄▄──▄▄▄▄▄█▄▄▄▄▄
───────────▄██▄──▀▀▀█─────────█
──────────██▄─█▄────█─────────█
───▄▄▄▄███──█▄─█▄───█─────────██▄▄▄
▄█▀▀────█────█──█▄──█▓▓▓▓▓▓▓▓▓█───▀▀▄
█──────█─────█───████▓▓▓▓▓▓▓▓▓█────▀█
█──────█─────█───█████▓▓▓▓▓▓▓█──────█
█─────█──────█───███▀▀▀▀█▓▓▓█───────█
█────█───────█───█───▄▄▄▄████───────█
█────█───────█──▄▀───────────█──▄───█
█────█───────█─▄▀─────█████▀▀▀─▄█───█
█────█───────█▄▀────────█─█────█────█
█────█───────█▀───────███─█────█────█
█─────█────▄█▀──────────█─█────█────█
█─────█──▄██▀────────▄▀██─█▄───█────█
█────▄███▀─█───────▄█─▄█───█▄──█────█
█─▄██▀──█──█─────▄███─█─────█──█────█
██▀────▄█───█▄▄▄█████─▀▀▀▀█▀▀──█────█
█──────█────▄▀──█████─────█────▀█───█
───────█──▄█▀───█████─────█─────█───█
──────▄███▀─────▀███▀─────█─────█───█
─────────────────────────────────────
▀█▀─█▀▄─█─█─█▀────▄▀▀─▀█▀─▄▀▄─█▀▄─█─█
─█──█▄▀─█─█─█▀────▀▀█──█──█─█─█▄▀─█▄█
─▀──▀─▀─▀▀▀─▀▀────▀▀───▀───▀──▀─▀─▄▄█
─────────────────────────────────────


***/

! function () {
	
  'use strict';

  module.exports = require('./lib/TrueStory.js').exports;

} ();
},{"./lib/TrueStory.js":28}],28:[function(require,module,exports){
(function (process){
/***

────────────────────▄▄▄▄
────────────────▄▄█▀▀──▀▀█▄
─────────────▄█▀▀─────────▀▀█▄
────────────▄█▀──▄▄▄▄▄▄──────▀█
────────────█───█▌────▀▀█▄─────█
────────────█──▄█────────▀▀▀█──█
────────────█──█──▀▀▀──▀▀▀▄─▐──█
────────────█──▌────────────▐──█
────────────█──▌─▄▀▀▄───────▐──█
───────────█▀▌█──▄▄▄───▄▀▀▄─▐──█
───────────▌─▀───█▄█▌─▄▄▄────█─█
───────────▌──────▀▀──█▄█▌────█
───────────█───────────▀▀─────▐
────────────█──────▌──────────█
────────────██────█──────────█
─────────────█──▄──█▄█─▄────█
─────────────█──▌─▄▄▄▄▄─█──█
─────────────█─────▄▄──▄▀─█
─────────────█▄──────────█
─────────────█▀█▄▄──▄▄▄▄▄█▄▄▄▄▄
───────────▄██▄──▀▀▀█─────────█
──────────██▄─█▄────█─────────█
───▄▄▄▄███──█▄─█▄───█─────────██▄▄▄
▄█▀▀────█────█──█▄──█▓▓▓▓▓▓▓▓▓█───▀▀▄
█──────█─────█───████▓▓▓▓▓▓▓▓▓█────▀█
█──────█─────█───█████▓▓▓▓▓▓▓█──────█
█─────█──────█───███▀▀▀▀█▓▓▓█───────█
█────█───────█───█───▄▄▄▄████───────█
█────█───────█──▄▀───────────█──▄───█
█────█───────█─▄▀─────█████▀▀▀─▄█───█
█────█───────█▄▀────────█─█────█────█
█────█───────█▀───────███─█────█────█
█─────█────▄█▀──────────█─█────█────█
█─────█──▄██▀────────▄▀██─█▄───█────█
█────▄███▀─█───────▄█─▄█───█▄──█────█
█─▄██▀──█──█─────▄███─█─────█──█────█
██▀────▄█───█▄▄▄█████─▀▀▀▀█▀▀──█────█
█──────█────▄▀──█████─────█────▀█───█
───────█──▄█▀───█████─────█─────█───█
──────▄███▀─────▀███▀─────█─────█───█
─────────────────────────────────────
▀█▀─█▀▄─█─█─█▀────▄▀▀─▀█▀─▄▀▄─█▀▄─█─█
─█──█▄▀─█─█─█▀────▀▀█──█──█─█─█▄▀─█▄█
─▀──▀─▀─▀▀▀─▀▀────▀▀───▀───▀──▀─▀─▄▄█
─────────────────────────────────────

  ______   __                              
 /      \ /  |                             
/eeeeee  |ee |  ______    _______  _______ 
ee |  ee/ ee | /      \  /       |/       |
ee |      ee | eeeeee  |/eeeeeee//eeeeeee/ 
ee |   __ ee | /    ee |ee      \ee      \ 
ee \__/  |ee |/eeeeeee | eeeeee  |eeeeee  |
ee    ee/ ee |ee    ee |/     ee//     ee/ 
 eeeeee/  ee/  eeeeeee/ eeeeeee/ eeeeeee/  
                                           
                                           


***/

; ! function () {

	'use strict';

  var Follow = require('/home/francois/Dev/follow.js/lib/Follow');

	function TrueStory () {

    /** Models - Hash table */

    this.models 			=   {};

    /** Controllers - Hash table */
    
    this.controllers 	=   {};

    /** Emitters - Hash table */
    
    this.emitters     =   {};

    /** Views - Hash table */
    
    this.views 				=   {};

    /** Views - Hash Table { String: Object } */

    this.templates    =   {};

    /** Watch dogs - Hash table */

    this.watchDogs    =   {};
    
    this.watched      =   [];

    this.stories      =   [];
    
    this.follow       =   new Follow(this.models);

    this.domain       =   require('domain').create();

    var app           =   this;

    this.domain.on('error', function (error) {
      console.warn('An Error Occured! True story!', error, error.stack);
      app.emit('error', error);
    });

    this.controller('true-story/render-view', function (options) {
      var template;

      if ( options.template.url ) {
        if ( options.template.url in app.templates ) {
          template = app.templates[options.template.url];
        }
        else {
          return $.ajax(options.template.url)
            .done(function (data, status, response) {
              if ( status === 'success' ) {
                app.templates[options.template.url] = data;
                app.controller('true-story/render-view')(options);
              }
            });
        }
      }

      else {
        template = options.template;
      }

      var rendered = options.engine(template, options.locals || {});

      var dom = $(rendered);

      if ( options.append ) {
        options.container.append(dom);
      }

      if ( options.ready ) {
        options.ready.apply(app, [dom]);
      }

      this.emit('template rendered', dom);

    });
  }

  require('util').inherits(TrueStory, require('events').EventEmitter);

  /***********************************************
    .                                               
    .                                               
    .                             ee            ee  
    .                             ee            ee  
    eeeeee eeee    eeeeee    eeeeeee   eeeeee   ee  
    ee   ee   ee  ee    ee  ee    ee  ee    ee  ee  
    ee   ee   ee  ee    ee  ee    ee  eeeeeeee  ee  
    ee   ee   ee  ee    ee  ee    ee  ee        ee  
    ee   ee   ee   eeeeee    eeeeeee   eeeeeee  ee  
                                                  
                                                
  ***********************************************/

  TrueStory.prototype.model = require('./TrueStory/model');

  /***********************************************
    .                                                             
    .                                                             
    .                               ee                          ee  
    .                               ee                          ee  
     eeeeeee   eeeeee   eeeeeee   eeeeee     eeeeee    eeeeee   ee  
    ee        ee    ee  ee    ee    ee      ee    ee  ee    ee  ee  
    ee        ee    ee  ee    ee    ee      ee        ee    ee  ee  
    ee        ee    ee  ee    ee    ee  ee  ee        ee    ee  ee  
     eeeeeee   eeeeee   ee    ee     eeee   ee         eeeeee   ee  
                                                                    
                                                                    
                            
                            
    ee                      
    ee                      
    ee   eeeeee    eeeeee   
    ee  ee    ee  ee    ee  
    ee  eeeeeeee  ee        
    ee  ee        ee        
    ee   eeeeeee  ee        
                          
                        
  ***********************************************/

  TrueStory.prototype.controller = function (name, controller) {
    var app = this;

    if ( typeof name === 'object' ) {
      for ( var i in name ) {
        this.controller(i, name[i]);
      }

      return this;
    }

    if ( typeof name === 'string' ) {
      if ( '1' in arguments ) {
        this.controllers[name] = controller.bind(this);

        return this;
      }

      return this.controllers[name];
    }
  };

  /***********************************************
                                         
                                         
             ee                          
                                         
  ee     ee  ee   eeeeee   ee   ee   ee  
   ee   ee   ee  ee    ee  ee   ee   ee  
    ee ee    ee  eeeeeeee  ee   ee   ee  
     eee     ee  ee        ee   ee   ee  
      e      ee   eeeeeee   eeeee eeee   
                                         
                                         
  ***********************************************/

  TrueStory.prototype.view = function (name, view) {
    if ( typeof name === 'object' ) {
      for ( var i in name ) {
        this.view(i, name[i]);
      }

      return this;
    }

    if ( typeof name === 'string' ) {
      if ( '1' in arguments ) {
        this.views[name] = view;

        return this;
      }

      return $(this.views[name]);
    }
  };

  TrueStory.prototype.template = function (name, template) {
    if ( typeof name === 'object' ) {
      for ( var i in name ) {
        this.template(i, name[i]);
      }

      return this;
    }

    if ( typeof name === 'string' ) {
      if ( '1' in arguments ) {
        this.templates[name] = template;

        return this;
      }

      return this.templates[name];
    }
  };

  TrueStory.prototype.render = require('./TrueStory/render');

  /***********************************************
                       





                                                                    
                          $$    $$      $$                          
                                $$      $$                          
   $$$$$$   $$$$$$ $$$$   $$  $$$$$$  $$$$$$     $$$$$$    $$$$$$   
  $$    $$  $$   $$   $$  $$    $$      $$      $$    $$  $$    $$  
  $$$$$$$$  $$   $$   $$  $$    $$      $$      $$$$$$$$  $$        
  $$        $$   $$   $$  $$    $$  $$  $$  $$  $$        $$        
   $$$$$$$  $$   $$   $$  $$     $$$$    $$$$    $$$$$$$  $$        
                                                                    
                       






  ***********************************************/                                                         


  TrueStory.prototype.emitter = function (name, emitter) {
    var app = this;


    if ( typeof name === 'object' ) {
      for ( var i in name ) {
        this.emitter(i, name[i]);
      }

      return this;
    }

    if ( typeof name === 'string' ) {
      if ( '1' in arguments ) {
        this.emitters[name] = emitter;

        return this;
      }

      return this.emitters[name];
    }
  };

  /***********************************************






                                          
                                          
    . ee                            ee      
    . ee                            ee      
    eeeeee     eeeeee    eeeeeee  eeeeee    
    . ee      ee    ee  ee          ee      
    . ee      eeeeeeee   eeeeee     ee      
    . ee  ee  ee              ee    ee  ee  
    .  eeee    eeeeeee  eeeeeee      eeee   
                                          





                                          

  ***********************************************/

  TrueStory.prototype.test = function (name, test) {
    var app = this;

    if ( typeof name === 'object' ) {
      for ( var i in name ) {
        this.test(i, name[i]);
      }

      return this;
    }

    if ( typeof name === 'string' ) {
      if ( '1' in arguments ) {
        this.tests[name] = test.bind(this);

        return this;
      }

      return this.tests[name];
    }
  };


  /***********************************************

                          




                                
                                
   eeeeee   ee    ee  eeeeeee   
  ee    ee  ee    ee  ee    ee  
  ee        ee    ee  ee    ee  
  ee        ee    ee  ee    ee  
  ee         eeeeee   ee    ee  
                                
                              





  ***********************************************/

  TrueStory.prototype.run = function (fn) {
    if ( typeof fn === 'function' ) {
      process.nextTick(function () {
        fn.apply(this);
      }.bind(this));
    }

    return this;
  };

  /***********************************************

                                
                 







                                
    .eeeeee   ee    ee  eeeeeee   
    ee    ee  ee    ee  ee    ee  
    ee        ee    ee  ee    ee  
    ee        ee    ee  ee    ee  
    ee         eeeeee   ee    ee  
                                  
                                                   
                                                     
    . $$                            $$               
    . $$                            $$               
    $$$$$$     $$$$$$    $$$$$$$  $$$$$$    $$$$$$$  
    . $$      $$    $$  $$          $$     $$        
    . $$      $$$$$$$$   $$$$$$     $$      $$$$$$   
    . $$  $$  $$              $$    $$  $$       $$  
    .  $$$$    $$$$$$$  $$$$$$$      $$$$  $$$$$$$   
                                                     
                   






  ***********************************************/

  TrueStory.prototype.runTests = function (tests) {
    if ( ! tests ) {
      console.info(new (
        function TrueStory_Running_all_tests () {}) ());

      for ( var test in this.tests ) {
        console.info(new (
          function TrueStory_Running_test () {
            this.test = test;
          }) ());

        this.test(test)();
      }

      return this;
    }

    for ( var i in arguments ) {
      if ( typeof arguments[i] === 'string' ) {
        console.info("True story!", new (
          function TrueStory_Running_test (test) {
            this.test = test;
          }) (arguments[i]) );

        this.test(arguments[i])();
      }
    }

    return this;
  };

  /***

                                                        
                                                        
                                $$                $$        
                                $$                $$        
      $$   $$   $$   $$$$$$   $$$$$$     $$$$$$$  $$$$$$$   
      $$   $$   $$        $$    $$      $$        $$    $$  
      $$   $$   $$   $$$$$$$    $$      $$        $$    $$  
      $$   $$   $$  $$    $$    $$  $$  $$        $$    $$  
       $$$$$ $$$$    $$$$$$$     $$$$    $$$$$$$  $$    $$  
                                                            
                                                            
                                                            
                                                            
                                                            
            $$                                              
            $$                                              
       $$$$$$$   $$$$$$    $$$$$$                           
      $$    $$  $$    $$  $$    $$                          
      $$    $$  $$    $$  $$    $$                          
      $$    $$  $$    $$  $$    $$                          
       $$$$$$$   $$$$$$    $$$$$$$                          
                                $$                          
                          $$    $$                          
                           $$$$$$    

  
  ***/

  TrueStory.prototype.watchDog = function (name, stories) {
    var app = this;

    if ( typeof name === 'object' ) {
      for ( var i in name ) {
        this.watchDog(i, name[i]);
      }

      return this;
    }

    if ( typeof name === 'string' ) {

      /** 
       *
       * SETTER
       *
       */

      var watched = {
        watchDog:   name,
        stories:    stories,
        results:    []
      };


      if ( '1' in arguments ) {
        this.watchDogs[name] = stories;

        return this;
      }

      /** 
       *
       * GETTER
       *
       */

      // if ( ! name in this.watchDogs ) {

      // }

      return ! function () {

        var stories = app.watchDogs[name];

        var watch_dog = new (function TrueStory_WatchDog () {
          this.name         = name;
          this.stories      = stories;
          this.watched      = [];
          this.doneWatching = false;
        })();

        new Follow(watch_dog)
          .on('update watched', function () {
            if ( watch_dog.watched.length === stories.length ) {
              watch_dog.doneWatching = true;
            }
          });

        // Running each watch dog stories

        stories.forEach(function (story) {

          var role = 'emitter';

          if ( 'model' in story ) {
            role = 'model';
          }

          if ( role === 'emitter' && ! story.emitter ) {
            story.emitter = null;
          }

          // Pass stories to app

          app.tell(function (when) {

            when()
              
              [role](story[role])
              
              .triggers(story.event)
              
              .then(function (event) {

                var yes = true;

                if ( this.run ) {
                  yes = this.run.apply(app, [event]);
                  
                  watched.results.push({
                    story:  story,
                    ok:     yes
                  });
                }

                if ( yes ) {
                  
                  console.info(new (function TrueStory_WatchDog_OK() {
                    this.name     =  name;
                    this.story    =  JSON.stringify(story);
                    this.pos      =  (watch_dog.watched.length + 1) + '/' +
                      stories.length
                  })());

                  console.info("\t  -");


                  watch_dog.watched = watch_dog.watched.concat(story);
                }
              
              }.bind(story));
            });

          });

          setTimeout(function () {
            if ( ! watch_dog.doneWatching ) {

              var missing = watch_dog.stories.length - watch_dog.watched.length;

              var error = new Error('Watch dog timed out -- ' + missing + ' test(s) could not be watched');
              error.name = 'TrueStory_WatchDog_Error';
              throw error;
            }
            else {

              app.watched.push(watched);

              console.info("True story!", new (function TrueStory_WatchDog_Done () {
                this.name     =   name;
                this.watched  =   watch_dog.watched;
                this.stories  =   watch_dog.stories;
              })());

            }
          }, 2000);

      } (); 
    }
  };

  /***********************************************

                   






                              
    ee                ee  ee  
    ee                ee  ee  
  eeeeee     eeeeee   ee  ee  
    ee      ee    ee  ee  ee  
    ee      eeeeeeee  ee  ee  
    ee  ee  ee        ee  ee  
     eeee    eeeeeee  ee  ee  
                






                            

  ***********************************************/

  TrueStory.prototype.tell = function (story) {

    var app = this;

    if ( typeof story === 'function' ) {
      this.domain.run(function () {
        story.apply(app, [function () {
          return new (require('./When'))(app);
        }]);
      });
    }

    return this;
  };


  TrueStory.prototype.context = function (name, context) {
    var app = this;

    if ( typeof name === 'object' ) {
      for ( var i in name ) {
        this.context(i, name[i]);
      }

      return this;
    }

    if ( typeof name === 'string' ) {
      if ( '1' in arguments ) {
        this.contexts[name] = context;

        return this;
      }

      return this.contexts[name];
    }
  };


  /***********************************************

                                                        
                                                        
                            ee                ee        
                            ee                ee        
  ee   ee   ee   eeeeee   eeeeee     eeeeeee  eeeeeee   
  ee   ee   ee        ee    ee      ee        ee    ee  
  ee   ee   ee   eeeeeee    ee      ee        ee    ee  
  ee   ee   ee  ee    ee    ee  ee  ee        ee    ee  
   eeeee eeee    eeeeeee     eeee    eeeeeee  ee    ee  
                                                        
                                                        

  ***********************************************/

  TrueStory.prototype.watch = function (object) {
    return new Follow(object);
  };

  /***********************************************

                                                                       
                                                                       
                                                      ee               
                                                      ee               
   eeeeee   ee    ee   eeeeee    eeeeee    eeeeee   eeeeee    eeeeeee  
  ee    ee   ee  ee   ee    ee  ee    ee  ee    ee    ee     ee        
  eeeeeeee    eeee    ee    ee  ee    ee  ee          ee      eeeeee   
  ee         ee  ee   ee    ee  ee    ee  ee          ee  ee       ee  
   eeeeeee  ee    ee  eeeeeee    eeeeee   ee           eeee  eeeeeee   
                      ee                                               
                      ee                                               
                      ee                                               

  ***********************************************/

  TrueStory.exports = function () {
    return new TrueStory();
  }

  /***********************************************

                                                  
                                                    
                                                    
                                                    
   eeeeee    eeeeee    eeeeee    eeeeeee   eeeeee   
  ee    ee        ee  ee    ee  ee        ee    ee  
  ee    ee   eeeeeee  ee         eeeeee   eeeeeeee  
  ee    ee  ee    ee  ee              ee  ee        
  eeeeeee    eeeeeee  ee        eeeeeee    eeeeeee  
  ee                                                
  ee                                                
  ee                                                


                                
                                
        ee              ee      
        ee              ee      
   eeeeeee   eeeeee   eeeeee    
  ee    ee  ee    ee    ee      
  ee    ee  ee    ee    ee      
  ee    ee  ee    ee    ee  ee  
   eeeeeee   eeeeee      eeee   
                                
                                

                                                                            
                                                                            
                        ee                  ee      ee                      
                        ee                  ee                              
  eeeeeee    eeeeee   eeeeee     eeeeee   eeeeee    ee   eeeeee   eeeeeee   
  ee    ee  ee    ee    ee            ee    ee      ee  ee    ee  ee    ee  
  ee    ee  ee    ee    ee       eeeeeee    ee      ee  ee    ee  ee    ee  
  ee    ee  ee    ee    ee  ee  ee    ee    ee  ee  ee  ee    ee  ee    ee  
  ee    ee   eeeeee      eeee    eeeeeee     eeee   ee   eeeeee   ee    ee  
                                                                            
                                              
                                            

  ***/

  TrueStory.exports.parseDotNotation = require('./TrueStory/parse-dot-notation');

  module.exports = TrueStory;
} ();
}).call(this,require('_process'))
},{"./TrueStory/model":29,"./TrueStory/parse-dot-notation":30,"./TrueStory/render":31,"./When":32,"/home/francois/Dev/follow.js/lib/Follow":1,"_process":24,"domain":21,"events":22,"util":26}],29:[function(require,module,exports){
/***

────────────────────▄▄▄▄
────────────────▄▄█▀▀──▀▀█▄
─────────────▄█▀▀─────────▀▀█▄
────────────▄█▀──▄▄▄▄▄▄──────▀█
────────────█───█▌────▀▀█▄─────█
────────────█──▄█────────▀▀▀█──█
────────────█──█──▀▀▀──▀▀▀▄─▐──█
────────────█──▌────────────▐──█
────────────█──▌─▄▀▀▄───────▐──█
───────────█▀▌█──▄▄▄───▄▀▀▄─▐──█
───────────▌─▀───█▄█▌─▄▄▄────█─█
───────────▌──────▀▀──█▄█▌────█
───────────█───────────▀▀─────▐
────────────█──────▌──────────█
────────────██────█──────────█
─────────────█──▄──█▄█─▄────█
─────────────█──▌─▄▄▄▄▄─█──█
─────────────█─────▄▄──▄▀─█
─────────────█▄──────────█
─────────────█▀█▄▄──▄▄▄▄▄█▄▄▄▄▄
───────────▄██▄──▀▀▀█─────────█
──────────██▄─█▄────█─────────█
───▄▄▄▄███──█▄─█▄───█─────────██▄▄▄
▄█▀▀────█────█──█▄──█▓▓▓▓▓▓▓▓▓█───▀▀▄
█──────█─────█───████▓▓▓▓▓▓▓▓▓█────▀█
█──────█─────█───█████▓▓▓▓▓▓▓█──────█
█─────█──────█───███▀▀▀▀█▓▓▓█───────█
█────█───────█───█───▄▄▄▄████───────█
█────█───────█──▄▀───────────█──▄───█
█────█───────█─▄▀─────█████▀▀▀─▄█───█
█────█───────█▄▀────────█─█────█────█
█────█───────█▀───────███─█────█────█
█─────█────▄█▀──────────█─█────█────█
█─────█──▄██▀────────▄▀██─█▄───█────█
█────▄███▀─█───────▄█─▄█───█▄──█────█
█─▄██▀──█──█─────▄███─█─────█──█────█
██▀────▄█───█▄▄▄█████─▀▀▀▀█▀▀──█────█
█──────█────▄▀──█████─────█────▀█───█
───────█──▄█▀───█████─────█─────█───█
──────▄███▀─────▀███▀─────█─────█───█
─────────────────────────────────────
▀█▀─█▀▄─█─█─█▀────▄▀▀─▀█▀─▄▀▄─█▀▄─█─█
─█──█▄▀─█─█─█▀────▀▀█──█──█─█─█▄▀─█▄█
─▀──▀─▀─▀▀▀─▀▀────▀▀───▀───▀──▀─▀─▄▄█
─────────────────────────────────────

                    
                                                
                                                
                              $$            $$  
                              $$            $$  
$$$$$$ $$$$    $$$$$$    $$$$$$$   $$$$$$   $$  
$$   $$   $$  $$    $$  $$    $$  $$    $$  $$  
$$   $$   $$  $$    $$  $$    $$  $$$$$$$$  $$  
$$   $$   $$  $$    $$  $$    $$  $$        $$  
$$   $$   $$   $$$$$$    $$$$$$$   $$$$$$$  $$  
                                                
                                                 
                                           
                                           


***/

! function () {
  
  'use strict';

  function index(obj,is, value) {
      if (typeof is == 'string')
          return index(obj,is.split('.'), value);
      else if (is.length==1 && value!==undefined)
          return obj[is[0]] = value;
      else if (is.length==0)
          return obj;
      else
          return index(obj[is[0]],is.slice(1), value);
  }

  module.exports = function (name, model, noFollow) {
    var app = this;

    if ( ! name ) {
      return this;
    }

    /***

                                            
                                                                
                                                                
        $$$$$$                                                  
      $$$    $$$                                                
     $$        $$   $$$$$$$    $$$$$$   $$$$$$ $$$$    $$$$$$   
    $$   $$$$$  $$  $$    $$        $$  $$   $$   $$  $$    $$  
    $$  $$  $$  $$  $$    $$   $$$$$$$  $$   $$   $$  $$$$$$$$  
    $$  $$  $$  $$  $$    $$  $$    $$  $$   $$   $$  $$        
    $$   $$$$$$$$   $$    $$   $$$$$$$  $$   $$   $$   $$$$$$$  
     $$                                                         
      $$$    $$$                                                
        $$$$$$                                                   
                                                
                                            
                                            
    $$                                      
                                            
    $$   $$$$$$$         $$$$$$   $$$$$$$   
    $$  $$                    $$  $$    $$  
    $$   $$$$$$          $$$$$$$  $$    $$  
    $$        $$        $$    $$  $$    $$  
    $$  $$$$$$$          $$$$$$$  $$    $$  
                                            
                                            
                                                             
                                                             
              $$                                     $$      
              $$                                     $$      
     $$$$$$   $$$$$$$      $$   $$$$$$    $$$$$$$  $$$$$$    
    $$    $$  $$    $$         $$    $$  $$          $$      
    $$    $$  $$    $$     $$  $$$$$$$$  $$          $$      
    $$    $$  $$    $$     $$  $$        $$          $$  $$  
     $$$$$$   $$$$$$$      $$   $$$$$$$   $$$$$$$     $$$$   
                           $$                                
                     $$    $$                                
                      $$$$$$                                 

    ***/

    if ( typeof name === 'object' ) {
      for ( var i in name ) {
        app.model(i, name[i]);
      }

      return app;
    }

    /***

                                            
                                                                
                                                                
        $$$$$$                                                  
      $$$    $$$                                                
     $$        $$   $$$$$$$    $$$$$$   $$$$$$ $$$$    $$$$$$   
    $$   $$$$$  $$  $$    $$        $$  $$   $$   $$  $$    $$  
    $$  $$  $$  $$  $$    $$   $$$$$$$  $$   $$   $$  $$$$$$$$  
    $$  $$  $$  $$  $$    $$  $$    $$  $$   $$   $$  $$        
    $$   $$$$$$$$   $$    $$   $$$$$$$  $$   $$   $$   $$$$$$$  
     $$                                                         
      $$$    $$$                                                
        $$$$$$                                                   
                                                
                                  
                                  
    $$                            
                                  
    $$   $$$$$$$         $$$$$$   
    $$  $$                    $$  
    $$   $$$$$$          $$$$$$$  
    $$        $$        $$    $$  
    $$  $$$$$$$          $$$$$$$  
                              
                                  
                                                          
                                                          
                $$                $$                      
                $$                                        
     $$$$$$$  $$$$$$     $$$$$$   $$  $$$$$$$    $$$$$$   
    $$          $$      $$    $$  $$  $$    $$  $$    $$  
     $$$$$$     $$      $$        $$  $$    $$  $$    $$  
          $$    $$  $$  $$        $$  $$    $$  $$    $$  
    $$$$$$$      $$$$   $$        $$  $$    $$   $$$$$$$  
                                                      $$  
                                                $$    $$  
                                                 $$$$$$                                 

    ***/

    if ( typeof name === 'string' ) {

      /**

                                                                    
                                                                       
      $$                           $$     $$
       $$                          $$     $$                          
        $$   $$$$$$$   $$$$$$   $$$$$$  $$$$$$    $$$$$$    $$$$$$   
         $$  $$        $$    $$    $$     $$      $$    $$  $$  $$  
        $$    $$$$$$   $$$$$$$$    $$     $$      $$$$$$$$  $$        
       $$          $$  $$          $$  $$ $$  $$  $$        $$        
      $$     $$$$$$$    $$$$$$$     $$$$   $$$$    $$$$$$$   $$        
                                                                       
                                                                 

      **/


      if ( '1' in arguments ) {
        index(app.models, name, model);

        return app;
      }


      /***

                                                                       
                                                                       
      $$                           $$      $$                          
       $$                          $$      $$                          
        $$    $$$$$$    $$$$$$   $$$$$$  $$$$$$     $$$$$$    $$$$$$   
         $$  $$    $$  $$    $$    $$      $$      $$    $$  $$    $$  
        $$   $$    $$  $$$$$$$$    $$      $$      $$$$$$$$  $$        
       $$    $$    $$  $$          $$  $$  $$  $$  $$        $$        
      $$      $$$$$$$   $$$$$$$     $$$$    $$$$    $$$$$$$  $$        
                   $$                                                  
             $$    $$                                                  
              $$$$$$                                                   

      ***/

      var $model;

      /**

                                            
                                              
        .     $$              $$                    
        .     $$              $$                    
        .$$$$$$$   $$$$$$   $$$$$$                  
        $$    $$  $$    $$    $$                    
        $$    $$  $$    $$    $$                    
        $$    $$  $$    $$    $$  $$                
         $$$$$$$   $$$$$$      $$$$                 
                                                    
                                                    
        $$$$$$$    $$$$$$   $$$$$$ $$$$    $$$$$$   
        $$    $$        $$  $$   $$   $$  $$    $$  
        $$    $$   $$$$$$$  $$   $$   $$  $$$$$$$$  
        $$    $$  $$    $$  $$   $$   $$  $$        
        $$    $$   $$$$$$$  $$   $$   $$   $$$$$$$  
                                                  

      ***/



      if ( /\./.test(name) ) {
        $model = index(app.models, name);
      }

      else {
        $model = app.models[name];
      }


      if ( ( typeof $model !== 'undefined' && $model !== null ) &&
        ! $model.__follow ) {

        /***

                                                 
           $$$$$$                                          
          $$    $$                                         
          $$    $$   $$$$$$    $$$$$$   $$$$$$   $$    $$  
          $$$$$$$$  $$    $$  $$    $$       $$  $$    $$  
          $$    $$  $$        $$        $$$$$$$  $$    $$  
          $$    $$  $$        $$       $$    $$  $$    $$  
          $$    $$  $$        $$        $$$$$$$   $$$$$$$  
                                                       $$  
                                                 $$    $$  
                                                  $$$$$$           

        ***/

        if ( Array.isArray($model) ) {
          
          Object.defineProperty($model, '__follow', {
            value: true,
            enumerable: false
          });

          /***

                                        $$        
                                        $$        
           $$$$$$   $$    $$   $$$$$$$  $$$$$$$   
          $$    $$  $$    $$  $$        $$    $$  
          $$    $$  $$    $$   $$$$$$   $$    $$  
          $$    $$  $$    $$        $$  $$    $$  
          $$$$$$$    $$$$$$   $$$$$$$   $$    $$  
          $$                                      
          $$                                      
          $$                                      

          ***/

          $model.push = function push () {


            // Do the concatening

            for ( var i in arguments ) {
              $model = Array.prototype.concat.apply($model, [arguments[i]]);

              index(app.models, name, $model);

              // Emit it

              app.emit('push ' + name, arguments[i]);
            }

          };

          /***
                                                              $$      
                                                              $$      
           $$$$$$$   $$$$$$   $$$$$$$    $$$$$$$   $$$$$$   $$$$$$    
          $$        $$    $$  $$    $$  $$              $$    $$      
          $$        $$    $$  $$    $$  $$         $$$$$$$    $$      
          $$        $$    $$  $$    $$  $$        $$    $$    $$  $$  
           $$$$$$$   $$$$$$   $$    $$   $$$$$$$   $$$$$$$     $$$$   
                                                                      
                                                                      
          ***/

          $model.concat = function concat () {

            var more = [];

            // Do the concatening

            for ( var i in arguments ) {
              $model = Array.prototype.concat.apply(
                $model,
                [arguments[i]]);

              more = more.concat(arguments[i]);
            }

            console.info('[❱❱]', "\twatchAr\t", name, more);

            // Emit it

            var concatenated = [];

            app.emit('concat ' + name, more);
          }.bind(app);

        }
      }

      return $model;
    }
  };

}();

},{}],30:[function(require,module,exports){
/***

────────────────────▄▄▄▄
────────────────▄▄█▀▀──▀▀█▄
─────────────▄█▀▀─────────▀▀█▄
────────────▄█▀──▄▄▄▄▄▄──────▀█
────────────█───█▌────▀▀█▄─────█
────────────█──▄█────────▀▀▀█──█
────────────█──█──▀▀▀──▀▀▀▄─▐──█
────────────█──▌────────────▐──█
────────────█──▌─▄▀▀▄───────▐──█
───────────█▀▌█──▄▄▄───▄▀▀▄─▐──█
───────────▌─▀───█▄█▌─▄▄▄────█─█
───────────▌──────▀▀──█▄█▌────█
───────────█───────────▀▀─────▐
────────────█──────▌──────────█
────────────██────█──────────█
─────────────█──▄──█▄█─▄────█
─────────────█──▌─▄▄▄▄▄─█──█
─────────────█─────▄▄──▄▀─█
─────────────█▄──────────█
─────────────█▀█▄▄──▄▄▄▄▄█▄▄▄▄▄
───────────▄██▄──▀▀▀█─────────█
──────────██▄─█▄────█─────────█
───▄▄▄▄███──█▄─█▄───█─────────██▄▄▄
▄█▀▀────█────█──█▄──█▓▓▓▓▓▓▓▓▓█───▀▀▄
█──────█─────█───████▓▓▓▓▓▓▓▓▓█────▀█
█──────█─────█───█████▓▓▓▓▓▓▓█──────█
█─────█──────█───███▀▀▀▀█▓▓▓█───────█
█────█───────█───█───▄▄▄▄████───────█
█────█───────█──▄▀───────────█──▄───█
█────█───────█─▄▀─────█████▀▀▀─▄█───█
█────█───────█▄▀────────█─█────█────█
█────█───────█▀───────███─█────█────█
█─────█────▄█▀──────────█─█────█────█
█─────█──▄██▀────────▄▀██─█▄───█────█
█────▄███▀─█───────▄█─▄█───█▄──█────█
█─▄██▀──█──█─────▄███─█─────█──█────█
██▀────▄█───█▄▄▄█████─▀▀▀▀█▀▀──█────█
█──────█────▄▀──█████─────█────▀█───█
───────█──▄█▀───█████─────█─────█───█
──────▄███▀─────▀███▀─────█─────█───█
─────────────────────────────────────
▀█▀─█▀▄─█─█─█▀────▄▀▀─▀█▀─▄▀▄─█▀▄─█─█
─█──█▄▀─█─█─█▀────▀▀█──█──█─█─█▄▀─█▄█
─▀──▀─▀─▀▀▀─▀▀────▀▀───▀───▀──▀─▀─▄▄█
─────────────────────────────────────

                                                  
                                                  
  ______    ______    ______    _______   ______  
 /      \  /      \  /      \  /       | /      \ 
/$$$$$$  | $$$$$$  |/$$$$$$  |/$$$$$$$/ /$$$$$$  |
$$ |  $$ | /    $$ |$$ |  $$/ $$      \ $$    $$ |
$$ |__$$ |/$$$$$$$ |$$ |       $$$$$$  |$$$$$$$$/ 
$$    $$/ $$    $$ |$$ |      /     $$/ $$       |
$$$$$$$/   $$$$$$$/ $$/       $$$$$$$/   $$$$$$$/ 
$$ |                                              
$$ |                                              
$$/                                               
       __              __                         
      /  |            /  |                        
  ____$$ |  ______   _$$ |_                       
 /    $$ | /      \ / $$   |                      
/$$$$$$$ |/$$$$$$  |$$$$$$/                       
$$ |  $$ |$$ |  $$ |  $$ | __                     
$$ \__$$ |$$ \__$$ |  $$ |/  |                    
$$    $$ |$$    $$/   $$  $$/                     
 $$$$$$$/  $$$$$$/     $$$$/                      
                                                  
                                                  
                                                  
                       __                         
                      /  |                        
 _______    ______   _$$ |_     ______            
/       \  /      \ / $$   |   /      \           
$$$$$$$  |/$$$$$$  |$$$$$$/    $$$$$$  |          
$$ |  $$ |$$ |  $$ |  $$ | __  /    $$ |          
$$ |  $$ |$$ \__$$ |  $$ |/  |/$$$$$$$ |          
$$ |  $$ |$$    $$/   $$  $$/ $$    $$ |          
$$/   $$/  $$$$$$/     $$$$/   $$$$$$$/           
                                                  
                                                  
                                                  
           __      __                             
          /  |    /  |                            
         _$$ |_   $$/   ______   _______          
 ______ / $$   |  /  | /      \ /       \         
/      |$$$$$$/   $$ |/$$$$$$  |$$$$$$$  |        
$$$$$$/   $$ | __ $$ |$$ |  $$ |$$ |  $$ |        
          $$ |/  |$$ |$$ \__$$ |$$ |  $$ |        
          $$  $$/ $$ |$$    $$/ $$ |  $$ |        
           $$$$/  $$/  $$$$$$/  $$/   $$/         
                                                  
                                                  
***/
; ! function () {
  
  'use strict';

  module.exports = function parseDotNotation (obj, notation) {

    if ( ! /\./.test(notation) ) {
      return obj[notation];
    }

    var dots = notation.split(/\./);

    var noCopy = obj[dots[0]];

    if ( dots[1] ) {
      return parseDotNotation(noCopy, dots.filter(function (dot, index) {
        return index;
      }).join('.'));
    }

    return noCopy;
  }

} ();

},{}],31:[function(require,module,exports){
(function (process){
; ! function () {

  'use strict';

  function trueStory_Render (template_name, locals) {

    /** @type TrueStory */
    
    var app = this;

    /** @type Object */

    var template_config;

    if ( typeof template_name === 'string' ) {
      template_config = app.template(template_name);
    }
    else {
      template_config = template_name;
      template_name = template_config.name || 'anonymous';
    }

    /** Error if template_name does not exists */

    if ( ! template_config ) {
      return app.emit('error', new Error('Could not render unexisting template: ' + template_name));
    }

    /** Log */

    console.info(new (function TrueStory_Render_Template () {
      this.template     =     template_name;
      this.locals       =     locals;
      this.config       =     template_config;
    })());

    /** Using nextTick @because */

    process.nextTick(function () {

      /** String */

      var HTMLString;

      /** If view already as a HTML string defined in its template property */

      if ( template_config.template && template_config.template.length ) {
        HTMLString = $(template_config.template)[0].outerHTML;
      }

      /** If template URL defined */

      else if ( template_config.url ) {

        /** Log about AJAX getting the template by url */

        console.info(new (function TrueStory_Render_Template_Fetch_URL () {
          this.name       =     template_name;
          this.config     =     template_config;
        })());

        /** AJAX call to get template by URL */

        return $.ajax({
          url: template_config.url
        })

          /** On AJAX done */

          .done(function (data) {

            /** Log about it */

            console.info(new (function TrueStory_Render_Template_Fetched_URL () {
              this.template   =     template_name;
              this.config     =     template_config;
              this.data       =     data;
            })());

            /** Save HTML string as template property */

            template_config.template    =     data;



            /** Relaunch render */

            app.render(template_name, locals);

          });
      }

      /** Convert HTML String into jQuery */

      var elem = $(HTMLString);

      /** If template has a controller */

      if ( template_config.controller ) {
        template_config.controller.apply(app, [elem, locals]);
      }

      /** Emit render OK */

      app.emit('rendered ' + template_name, elem);
    });
  };

  module.exports = trueStory_Render;

}();

}).call(this,require('_process'))
},{"_process":24}],32:[function(require,module,exports){
(function (process){
/***

────────────────────▄▄▄▄
────────────────▄▄█▀▀──▀▀█▄
─────────────▄█▀▀─────────▀▀█▄
────────────▄█▀──▄▄▄▄▄▄──────▀█
────────────█───█▌────▀▀█▄─────█
────────────█──▄█────────▀▀▀█──█
────────────█──█──▀▀▀──▀▀▀▄─▐──█
────────────█──▌────────────▐──█
────────────█──▌─▄▀▀▄───────▐──█
───────────█▀▌█──▄▄▄───▄▀▀▄─▐──█
───────────▌─▀───█▄█▌─▄▄▄────█─█
───────────▌──────▀▀──█▄█▌────█
───────────█───────────▀▀─────▐
────────────█──────▌──────────█
────────────██────█──────────█
─────────────█──▄──█▄█─▄────█
─────────────█──▌─▄▄▄▄▄─█──█
─────────────█─────▄▄──▄▀─█
─────────────█▄──────────█
─────────────█▀█▄▄──▄▄▄▄▄█▄▄▄▄▄
───────────▄██▄──▀▀▀█─────────█
──────────██▄─█▄────█─────────█
───▄▄▄▄███──█▄─█▄───█─────────██▄▄▄
▄█▀▀────█────█──█▄──█▓▓▓▓▓▓▓▓▓█───▀▀▄
█──────█─────█───████▓▓▓▓▓▓▓▓▓█────▀█
█──────█─────█───█████▓▓▓▓▓▓▓█──────█
█─────█──────█───███▀▀▀▀█▓▓▓█───────█
█────█───────█───█───▄▄▄▄████───────█
█────█───────█──▄▀───────────█──▄───█
█────█───────█─▄▀─────█████▀▀▀─▄█───█
█────█───────█▄▀────────█─█────█────█
█────█───────█▀───────███─█────█────█
█─────█────▄█▀──────────█─█────█────█
█─────█──▄██▀────────▄▀██─█▄───█────█
█────▄███▀─█───────▄█─▄█───█▄──█────█
█─▄██▀──█──█─────▄███─█─────█──█────█
██▀────▄█───█▄▄▄█████─▀▀▀▀█▀▀──█────█
█──────█────▄▀──█████─────█────▀█───█
───────█──▄█▀───█████─────█─────█───█
──────▄███▀─────▀███▀─────█─────█───█
─────────────────────────────────────
▀█▀─█▀▄─█─█─█▀────▄▀▀─▀█▀─▄▀▄─█▀▄─█─█
─█──█▄▀─█─█─█▀────▀▀█──█──█─█─█▄▀─█▄█
─▀──▀─▀─▀▀▀─▀▀────▀▀───▀───▀──▀─▀─▄▄█
─────────────────────────────────────

   __       __  __                           
  /  |  _  /  |/  |                          
  $$ | / \ $$ |$$ |____    ______   _______  
  $$ |/$  \$$ |$$      \  /      \ /       \ 
  $$ /$$$  $$ |$$$$$$$  |/$$$$$$  |$$$$$$$  |
  $$ $$/$$ $$ |$$ |  $$ |$$    $$ |$$ |  $$ |
  $$$$/  $$$$ |$$ |  $$ |$$$$$$$$/ $$ |  $$ |
  $$$/    $$$ |$$ |  $$ |$$       |$$ |  $$ |
  $$/      $$/ $$/   $$/  $$$$$$$/ $$/   $$/ 
                                           


***/

; ! function () {

	'use strict';

  var thens = {
    render: function (template, locals) {
      var when = this;

      this.and_then.push(function (x) {
        when.app.render(template, x);
      });

      return when.then;
    },

    controller: function (controller, args) {
      var when = this;

      console.warn('controller');

      this.and_then.push(function (x) {
        when.app.controller(controller);
      });

      return when.then;
    },

    push: function (model, item) {


      var when = this;

      this.and_then.push(function (x) {
        when.app.model(model).push(item);
      });

      return when.then;
    },

    model: function (model) {
      
      var when = this;

      this.and_then.push(function (x) {
        console.error('then model', model);
        when.app.model(model, x);
      });

      return when.then;
    },

    trigger: function (emitter, event, message) {

      var when = this;

      this.and_then.push(function (x) {
        console.log()
        console.warn('triggering', event)
        console.log()
        when.app.emitter(emitter).emit(event, message || x);
      });

      return when.then;
    }
  };

  /** @class
   *  @arg {TrueStory} app
   **/

  function TrueStory_When (app) {
    this.who = {};

    /** @type TrueStory */
    this.app = app;

    this.and_then = [];

    for ( var then in thens ) {
      this.then[then] = thens[then].bind(this);
    }

    var when = this;

    process.nextTick(function () {

      /** If stack (means not called by then()) */

      if ( when.and_then.length ) {

        /** pass stack to then() */

        when.then(function () {
          console.warn('boooom');

          when.and_then.forEach(function (and_then) {
            and_then.call(when, arguments);
          });
        });
      }
    });
  }

  /***

                                                  
                                                  
                                $$            $$  
                                $$            $$  
  $$$$$$ $$$$    $$$$$$    $$$$$$$   $$$$$$   $$  
  $$   $$   $$  $$    $$  $$    $$  $$    $$  $$  
  $$   $$   $$  $$    $$  $$    $$  $$$$$$$$  $$  
  $$   $$   $$  $$    $$  $$    $$  $$        $$  
  $$   $$   $$   $$$$$$    $$$$$$$   $$$$$$$  $$  
                                                  
                                                
  ***/

  /** @method
   *  @arg {Function} model
   *  @return TrueStory_When
   */

  TrueStory_When.prototype.model = function (model) {
    
    this.who.model = model;

    return this;
  };

  /***

                                                                  
                                                                    
                          $$    $$      $$                          
                                $$      $$                          
   $$$$$$   $$$$$$ $$$$   $$  $$$$$$  $$$$$$     $$$$$$    $$$$$$   
  $$    $$  $$   $$   $$  $$    $$      $$      $$    $$  $$    $$  
  $$$$$$$$  $$   $$   $$  $$    $$      $$      $$$$$$$$  $$        
  $$        $$   $$   $$  $$    $$  $$  $$  $$  $$        $$        
   $$$$$$$  $$   $$   $$  $$     $$$$    $$$$    $$$$$$$  $$        
                                                                    
                                                                  
  ***/

  /** @method
   *  @arg {Function} emitter
   *  @return TrueStory_When
   */

  TrueStory_When.prototype.emitter = function (emitter) {
    
    this.who.emitter = emitter;

    return this;
  };

  /***

                                                                            
                                                                            
    $$                $$                                                    
    $$                                                                      
  $$$$$$     $$$$$$   $$   $$$$$$    $$$$$$    $$$$$$    $$$$$$    $$$$$$$  
    $$      $$    $$  $$  $$    $$  $$    $$  $$    $$  $$    $$  $$        
    $$      $$        $$  $$    $$  $$    $$  $$$$$$$$  $$         $$$$$$   
    $$  $$  $$        $$  $$    $$  $$    $$  $$        $$              $$  
     $$$$   $$        $$   $$$$$$$   $$$$$$$   $$$$$$$  $$        $$$$$$$   
                                $$        $$                                
                          $$    $$  $$    $$                                
                           $$$$$$    $$$$$$                                 

  ***/

  /** @method
   *  @arg {String} event
   *  @return TrueStory_When
   */

  TrueStory_When.prototype.triggers = function (event) {
    this.listener = 'on';
    this.event = event;

    return this;
  };

  /***

                                            
                                          
    $$      $$                            
    $$      $$                            
  $$$$$$    $$$$$$$    $$$$$$   $$$$$$$   
    $$      $$    $$  $$    $$  $$    $$  
    $$      $$    $$  $$$$$$$$  $$    $$  
    $$  $$  $$    $$  $$        $$    $$  
     $$$$   $$    $$   $$$$$$$  $$    $$  
                                          
                                        
  ***/

  /** @method
   *  @arg {Function} fn
   *  @return void
   */

  TrueStory_When.prototype.then = function (fn) {
    var when = this;

    if ( this.app instanceof require('./TrueStory') ) {
      this.app.stories.push(when);
    }

    console.info(when);

    if ( when.who.model ) {

      if ( when.listener ) {

        /***

                                                    
                                                    
          .             $$                            
          .             $$                            
          $$   $$   $$  $$$$$$$    $$$$$$   $$$$$$$   
          $$   $$   $$  $$    $$  $$    $$  $$    $$  
          $$   $$   $$  $$    $$  $$$$$$$$  $$    $$  
          $$   $$   $$  $$    $$  $$        $$    $$  
          .$$$$$ $$$$   $$    $$   $$$$$$$  $$    $$  
          .                                           
          .                                               
          .                                               
          .                             $$            $$  
          .                             $$            $$  
          $$$$$$ $$$$    $$$$$$    $$$$$$$   $$$$$$   $$  
          $$   $$   $$  $$    $$  $$    $$  $$    $$  $$  
          $$   $$   $$  $$    $$  $$    $$  $$$$$$$$  $$  
          $$   $$   $$  $$    $$  $$    $$  $$        $$  
          $$   $$   $$   $$$$$$    $$$$$$$   $$$$$$$  $$    
          .
          .
          .                   
          .                   
          .$$$$$$   $$$$$$$   
          $$    $$  $$    $$  
          $$    $$  $$    $$  
          $$    $$  $$    $$  
          .$$$$$$   $$    $$  
                            
                            
                            
        ***/

        switch ( when.event ) {

          case 'all':
            return ! function () {
              
              var app = this;
              
              this.follow[when.listener]('add ' + when.who.model,
                function (obj) {
                  app.domain.run(function () {
                    fn.apply(app, [obj]);
                  });
                });
              
              this.follow[when.listener]('update ' + when.who.model,
                function (obj) {
                  // console.log('event update');
                  app.domain.run(function () {
                    fn.apply(app, [obj]);
                  });
                });
            
            }.apply(this.app);

          case 'add':
          case 'update':

            return ! function () {
              var app = this;
              
              this.follow[when.listener](when.event + ' ' + when.who.model,
                function (obj) {
                  app.domain.run(function () {
                    fn.apply(app, [obj]);
                  });
                });
            }.apply(this.app);

          case 'push':
          case 'concat':
            return ! function () {
              this[when.listener](when.event + ' ' + when.who.model, fn.bind(this));
            }.apply(this.app);

          /**

                                                   
                                                                        
                                        $$                              
                                        $$                              
         $$$$$$$  $$    $$   $$$$$$$  $$$$$$     $$$$$$   $$$$$$ $$$$   
        $$        $$    $$  $$          $$      $$    $$  $$   $$   $$  
        $$        $$    $$   $$$$$$     $$      $$    $$  $$   $$   $$  
        $$        $$    $$        $$    $$  $$  $$    $$  $$   $$   $$  
         $$$$$$$   $$$$$$   $$$$$$$      $$$$    $$$$$$   $$   $$   $$  
                     

                                                                
          **/


          default:
            console.error('CUSTOM', when)
            return ! function () {
              this.model(when.who.model)[when.listener](when.event, fn.bind(this));
            }.apply(this.app);
        }
      }

      else if ( 'is' in when ) {
        return ! function () {
          function onAny (event) {
            if ( event.new === when.is ) {
              fn.apply(this);
            }
          }

          this.follow[when.listener]('add ' + when.who.model, onAny.bind(this));
          this.follow[when.listener]('update ' + when.who.model, onAny.bind(this));
        }.apply(this.app);
      }
    }

    else if ( 'emitter' in when.who ) {
      /***

                                                                        
                                                                        
                    $$                                                  
                    $$                                                  
      $$   $$   $$  $$$$$$$    $$$$$$   $$$$$$$                         
      $$   $$   $$  $$    $$  $$    $$  $$    $$                        
      $$   $$   $$  $$    $$  $$$$$$$$  $$    $$                        
      $$   $$   $$  $$    $$  $$        $$    $$                        
       $$$$$ $$$$   $$    $$   $$$$$$$  $$    $$                        
                                                                        

                                                                        
                              $$    $$      $$                          
                                    $$      $$                          
       $$$$$$   $$$$$$ $$$$   $$  $$$$$$  $$$$$$     $$$$$$    $$$$$$   
      $$    $$  $$   $$   $$  $$    $$      $$      $$    $$  $$    $$  
      $$$$$$$$  $$   $$   $$  $$    $$      $$      $$$$$$$$  $$        
      $$        $$   $$   $$  $$    $$  $$  $$  $$  $$        $$        
       $$$$$$$  $$   $$   $$  $$     $$$$    $$$$    $$$$$$$  $$        
                                                                        
                                                                        
                                                                        
                                                                        
                                                                        
       $$$$$$   $$$$$$$                                                 
      $$    $$  $$    $$                                                
      $$    $$  $$    $$                                                
      $$    $$  $$    $$                                                
       $$$$$$   $$    $$                                                
                                                                        
                                                                  
      ***/

      return ! function () {
        var app = this;

        var emitter = when.who.emitter;

        if ( ! emitter ) {
          emitter = this;
        }

        else {
          emitter = this.emitters[emitter];
        }
        
        emitter[when.listener](when.event, function () {
          console.error({ listener: when.listener, event: when.event, args: arguments});
          // fn.apply(app);
          app.emitter('socket').emit('get intro');
        });
      }.apply(this.app);
    }

    else if ( when.who.view ) {
      if ( when.on ) {

      }
    }
  };


  function then_render () {

  }

  module.exports = TrueStory_When;
} ();
}).call(this,require('_process'))
},{"./TrueStory":28,"_process":24}]},{},[2]);
