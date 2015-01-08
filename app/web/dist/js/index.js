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

},{"events":31,"util":35}],2:[function(require,module,exports){
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

      // .watchDog({
      //   'story get topics':   require('./watchdogs/story-get-topics'),
      //   'story get intro':    require('./watchdogs/story-get-intro')
      // })
      ;
    };

}();
},{"./controller":4,"./model":14,"./stories":15,"./template":23,"./view":29,"/home/francois/Dev/true-story.js":37}],4:[function(require,module,exports){
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


                                   
                                  
    _______   ______   _______   _$$                          $$         
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
    'bootstrap/responsive-image':
      require('./controllers/bootstrap/responsive-image'),
    
    'scroll to point of attention':
      require('./controllers/scroll-to-point-of-attention'),
    
    'show':         require('./controllers/show'),
    
    'youtube':      require('./controllers/youtube'),
    
    'item media':   require('./controllers/item-media'),
    
    'reveal':       require('./controllers/reveal'),
    
    'upload':       require('./controllers/upload'),
    
    'truncate':     require('./controllers/truncate'),
    
    'hide':         require('./controllers/hide')
  };

} ();

},{"./controllers/bootstrap/responsive-image":5,"./controllers/hide":6,"./controllers/item-media":7,"./controllers/reveal":8,"./controllers/scroll-to-point-of-attention":9,"./controllers/show":10,"./controllers/truncate":11,"./controllers/upload":12,"./controllers/youtube":13}],5:[function(require,module,exports){
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
! function () {

  'use strict';

  function hide (elem, options, cb) {
    // if ANY element at all is in the process of being shown, then do nothing because it has the priority and is a blocker

    if ( elem.hasClass('.is-showing') || elem.hasClass('.is-hiding') ) {
      return false;
    }

    elem.removeClass('is-shown').addClass('is-hiding');;

    elem.find('.is-section:first').animate({
        'margin-top': '-' + elem.height() + 'px',
        // 'padding-top': elem.height() + 'px'
      }, 1000, function () {
        elem.removeClass('is-hiding').addClass('is-hidden');
        $rootScope.publish('did hide view', options);
        if ( cb ) cb();
      });

    elem.animate({
       opacity: 0
      }, 1000);
  }

  module.exports = hide;

} ();

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

  module.exports = reveal;

} ();

},{}],9:[function(require,module,exports){
; ! function () {

  'use strict';

  function scrollToPointOfAttention (pointOfAttention, cb, speed) {
    var poa = (pointOfAttention.offset().top - 80);

    var current = $('body').scrollTop();

    if ( 
      (current === poa) || 
      (current > poa && (current - poa < 50)) ||
      (poa > current && (poa - current < 50)) ) {

      return typeof cb === 'function' ? cb() : true;
    }

    $('body').animate({
      scrollTop: poa + 'px'
    }, speed || 500, 'swing', function () {
      if ( typeof cb === 'function' ) {
        cb();
      }
    });
  }

  module.exports = scrollToPointOfAttention;

}();

},{}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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

},{"./scroll-to-point-of-attention":9}],12:[function(require,module,exports){
! function () {

  'use strict';

  function handler (e) {
    hover(e);

    var files = e.target.files || e.originalEvent.dataTransfer.files;

    for (var i = 0, f; f = files[i]; i++) {
      parse(f);
      preview(f, e.target);
      upload(f);
    }
  }

  function hover (e) {
    e.stopPropagation();
    e.preventDefault();
    // e.target.className = (e.type == "dragover" ? "hover" : "");
  }

  function parse (file) {
    console.warn('file parsed', file);
  }

  function preview (file, target) {

    var dropbox;

    if ( $(target).hasClass('drop-box') ) {
      dropbox = $(target);
    }
    else {
      dropbox = $(target).closest('.drop-box');
    }

    var img = new Image();

    img.classList.add("img-responsive");
    
    img.addEventListener('load', function () {
      dropbox.append(img);
    }, false);
    
    img.src = (window.URL || window.webkitURL).createObjectURL(file);

    console.warn(img);
  }

  function upload (file) {
    return;
    if ( /^image\//.test(file.type) && file.size < 50000 ) {
      $.ajax({
        url: '/upload',
        type: 'POST',
        headers: {
          'X_FILENAME': file.name
        }
      });
    }
  }

  function init (dropbox) {
    if ( window.File ) {
      dropbox.find('input').on('change', handler);
      dropbox.on('dragover', hover);
      dropbox.on('dragleave', hover);
      dropbox.on('drop', handler);
    }
  }

  module.exports = init;

} ();

},{}],13:[function(require,module,exports){
; ! function () {

  'use strict';

  var regexYouTube = /youtu\.?be.+v=([^&]+)/;

  function youTubePreview (url, server) {
    var youtube;

    if ( regexYouTube.test(url) ) {
      url.replace(regexYouTube, function (m, v) {
        youtube = v;
      });

      var raw = '<div class="video-container">' +
          '<iframe src="http://www.youtube.com/embed/' + youtube + '" frameborder="0" width="300" height="175"></iframe>' +
        '</div>';

      if ( server ) {
        return raw;
      }

      else {
        return $(raw);
      }
    }
  }

  module.exports = youTubePreview;

}();

},{}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
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

    if ( synapp.user ) {
      $('.is-in').css('visibility', 'visible');
    }

    if ( $('#intro').length ) {
      /** Get intro */

      require('./stories/get-intro').apply(this);
        
      /** Get panel */

      require('./stories/get-panel').apply(this);

      /** Get items **/

      require('./stories/get-items').apply(this);

      /** Get evaluations */

      require('./stories/get-evaluation').apply(this);
    }

    /** Online now **/

    require('./stories/get-online-users').apply(this);

    /** sign in **/

    require('./stories/sign-in').apply(this);

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

},{"./stories/get-evaluation":17,"./stories/get-intro":18,"./stories/get-items":19,"./stories/get-online-users":20,"./stories/get-panel":21,"./stories/sign-in":22}],16:[function(require,module,exports){
! function () {

  'use strict';

  function createItem () {
    var app = this;

    $('.creator').find('.button-create').on('click',
      function () {
        var creator = $(this).closest('.creator');

        var panel = $(this).closest('.panel');

        var panelId = panel.attr('id').split('-');

        var subject = creator.find('[name="subject"]');
        var description = creator.find('[name="description"]');

        subject.removeClass('error');
        description.removeClass('error');

        if ( ! subject.val() ) {
          subject.addClass('error').focus();
        }

        else if ( ! description.val() ) {
          description.addClass('error').focus();
        }

        else {
          var item = {
            user: synapp.user,
            subject: subject.val(),
            description: description.val(),
            type: panelId[1]
          };

          if ( panelId[2] ) {
            item.parent = panelId[2];
          }

          app.emitter('socket').emit('create item', item);
        }
      });
  
    app.emitter('socket').on('created item', function (item) {
      item.is_new = true;
      app.model('items').push(item);
    });
  }

  module.exports = createItem;

} ();

},{}],17:[function(require,module,exports){
! function () {

  'use strict';

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
      app.render('evaluation', evaluation);
    });
  }

  module.exports = getEvaluation;

} ();

},{}],18:[function(require,module,exports){
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

},{}],19:[function(require,module,exports){
! function () {
  
  'use strict';

  function getItems () {

    var app = this;

    app.on('panel added', function (panel) {

      console.warn('SUB #4 panel added', panel);

      app.emitter('socket').emit('get items', panel);
    });

    app.emitter('socket')
      
      .on('got items', function (panelItems) {

        console.warn('SUB #5 got panel items from socket, pushing to model items');

        var panelId = '#panel-' + panelItems.panel.type;

        if ( panelItems.panel.parent ) {
          panelId += '-' + panelItems.panel.parent;
        }
        
        panelItems.items.forEach(function (item, index) {
          if ( index < (panelItems.panel.size + panelItems.panel.skip) - 1 ) {
            app.model('items').push(item);
          }          
        });

        if ( panelItems.items.length >= (panelItems.panel.size + panelItems.panel.skip) ) {
          $(panelId).find('.load-more').show();
        }
        else {
          $(panelId).find('.load-more').hide();
        }

        panelItems.panel.skip += (panelItems.items.length - 1);

        app.model('panels', app.model('panels').map(function (pane) {
          var match;

          if ( pane.type === panelItems.panel.type ) {
            match = true;
          }

          if ( panelItems.panel.parent && pane.parent !== panelItems.panel.parent ) {
            match = false;
          }

          if ( match ) {
            return panelItems.panel;
          }

          return pane;
        }));
      });

    app.on('push items', function (item) {

      console.warn('SUB #6 panel item pushed', item.subject);

      app.render('item', item, function (itemView) {

        var panelId = '#panel-' + this.item.type;

        if ( this.item.parent ) {
          panelId += '-' + this.item.parent;
        }
        
        if ( this.item.is_new ) {
          $(panelId).find('.items').prepend(itemView);
        }
        else {
          $(panelId).find('.items').append(itemView);
        }
      }.bind({ item: item }));
    });

  }

  module.exports = getItems;

}();

},{}],20:[function(require,module,exports){
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
},{}],21:[function(require,module,exports){
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
        console.warn('SUB #2 new panel', panel);

        app.render('panel', panel, function (panelView) {

          console.warn('SUB #3 panel rendered', panel);

          if ( ! panel.parent ) {
            app.view('panels').append(panelView);
          }

          else {
            $('#item-' + panel.parent + ' .children .is-section')
              .append(panelView);

            app.controller('reveal')($('#item-' + panel.parent + ' .children'),
              $('#item-' + panel.parent));
          }

          app.emit('panel added', panel);

          require('./create-item').apply(app);

          if ( synapp.user ) {
            $('.is-in').css('visibility', 'visible');
          }
        });
      });

  }

  module.exports = getPanel;

}();

},{"./create-item":16}],22:[function(require,module,exports){
! function () {

  'use strict';

  function signIn () {
    var app = this;

    app.view('sign').on('submit', function () {

      app.view('sign').find('.sign-error')
        .text('')
        .hide();

      var email = app.view('sign').find('[name="email"]');
      var password = app.view('sign').find('[name="password"]');

      email.removeClass('error');
      password.removeClass('error');

      if ( ! email.val() ) {
        email.addClass('error');
        email.focus();
      }

      else if ( ! password.val() ) {
        password.addClass('error');
        password.focus();
      }

      else {
        $.ajax({
          url: '/sign/in',
          type: 'POST',
          data: {
            email: email.val(),
            password: password.val()
          }
        })
          .error(function (error) {

          })
          .success(function (data) {
            $('.is-in').css('visibility', 'visible');

            app.view('sign').find('section').hide(2000);

            app.view('sign').find('.sign-success')
              .show(function () {
                setTimeout(function () {
                  app.view('sign').hide(2500);
                }, 5000);
              })
              .text('Welcome back!');
          });
      }

      return false;
    });
  }

  module.exports = signIn;

} ();

},{}],23:[function(require,module,exports){
! function () {

  'use strict';

  module.exports = {
    
    "online users":   require('./templates/online-users'),

    "sign":           {},

    "panel":          require('./templates/panel'),

    "intro":          require('./templates/intro'),

    "item":           require('./templates/item'),

    "evaluation":     require('./templates/evaluation')
  
  };

}();

},{"./templates/evaluation":24,"./templates/intro":25,"./templates/item":26,"./templates/online-users":27,"./templates/panel":28}],24:[function(require,module,exports){
! function () {

  'use strict';

  module.exports = {
    template: '.evaluator',
    controller: function (view, evaluation) {
      var app = this;

      var itemID = '#item-' + evaluation.item;

      var item = $(itemID);

      item.find('.evaluator .cursor').text(evaluation.cursor); 
      item.find('.evaluator .limit').text(evaluation.limit);

      if ( evaluation.cursor < evaluation.limit ) {
        item.find('.evaluator .finish').text('Neither');
      }
      else {
        item.find('.evaluator .finish').text('Finish');
      }

      item.find('.evaluator .finish').on('click', function () {
        console.warn('cursor', evaluation.cursor);

        evaluation.cursor += 2;

        $(this).off('click');

        if ( evaluation.cursor <= evaluation.limit ) {
          app.render('evaluation', evaluation, function () {
            app.controller('scroll to point of attention')(item.find('.evaluator'));
          });
        }
        else {
          var evaluations = app.model('evaluations');

          evaluations = evaluations.filter(function ($evaluation) {
            return $evaluation.item !== evaluation.item;
          });

          app.model('evaluations', evaluations);

          app.controller('hide')(item.find('.evaluator'));
        }
      });

      for ( var i = 0; i < 2; i ++ ) {

        item.find('.evaluator .image:eq(' + i +')').append(
          app.controller('item media')(evaluation.items[i]));

        item.find('.evaluator .subject:eq(' + i +')').text(
          evaluation.items[i].subject);

        item.find('.evaluator .description:eq(' + i +')').text(
          evaluation.items[i].description);

        item.find('.evaluator .sliders:eq(' + i + ') .criteria-slider')
          .not('.template-model').remove();

        evaluation.criterias.forEach(function (criteria) {
          var template_name = 'evaluation-' + evaluation.item +
            '-' + i + '-' + criteria._id;

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

          app.render(template, {}, function (view) {
            view.removeClass('template-model');
            
            item.find('.evaluator .sliders:eq(' + this.index + ')')
              .append(view);
          
          }.bind({ index: i }));
        });
      }
    }
  };

} ();

},{}],25:[function(require,module,exports){
! function () {

  'use strict';

  module.exports = {
    template: '#intro',
    controller: function (view, intro) {
      var app = this;

      // view.find('.panel-title').text('intro.subject');
      $('#intro').find('.panel-title').text(intro.subject);
      $('#intro').find('.item-title').text(intro.subject);
      $('#intro').find('.description').text(intro.description);

      $('#intro').find('.item-media').empty().append(
        app.controller('bootstrap/responsive-image')({
          src: intro.image
        }));

      $('#intro').find('.item-references').hide();

      new (app.controller('truncate'))($('#intro'));

      $('#intro').find('.promoted').hide();

      $('#intro').find('.box-buttons').hide();

      $('#intro').find('.toggle-arrow').hide();
    }
  };

} ();

},{}],26:[function(require,module,exports){
! function () {

  'use strict';

  module.exports = {
    url: '/partial/item',
    controller: function (view, item) {

      var app = this;

      view.attr('id', 'item-' + item._id);

      view.find('.item-title a')
        .attr('href', '/item/' + item._id + '/' + require('string')(item.subject).slugify())
        .text(item.subject);
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

      new (app.controller('truncate'))(view);

      // ITEM MEDIA

      view.find('.item-media').empty().append(
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

        details.find('.progress-bar')
          .css('width', Math.floor(item.promotions * 100 / item.views) + '%')
          .text(Math.floor(item.promotions * 100 / item.views) + '%');

        // mail a friend

        var link = window.location.protocol + '//' + window.location.hostname +
          '/item/' + item._id + '/' + require('string')(item.subject).slugify();

        details.find('.invite-people-body').attr('placeholder',
          details.find('.invite-people-body').attr('placeholder') +
          link);

        details.find('.invite-people').attr('href',
          'mailto:?subject=' + item.subject + '&body=' +
          (details.find('.invite-people-body').val() ||
          details.find('.invite-people-body').attr('placeholder')) +
          "%0A%0A" + ' Synaccord - ' + link);

      });

      // ITEM TOGGLE SUB PANEL

      view.find('.toggle-arrow i.fa').on('click', function () {
        console.warn('SUB #1 clicked');
        app.model('panels').push({
          type: 'Problem',
          parent: item._id,
          size: synapp['navigator batch size'],
          skip: 0
        });
      });

      // IS IN

      if ( synapp.user ) {
        view.find('.is-in').css('visibility', 'visible');
      }
    }
  };

} ();

},{"string":36}],27:[function(require,module,exports){
! function () {

  'use strict';

  module.exports = {
    template: '.online-users',
    
    controller: function (view, online_users) {
      view.text(online_users);
    }
  };

} ();

},{}],28:[function(require,module,exports){
! function () {

  'use strict';

  module.exports = {
    url: '/partial/panel',
    
    controller: function (view, panel) {

      var app = this;

      var id = 'panel-' + panel.type;

      if ( panel.parent ) {
        id += '-' + panel.parent;
      }

      view.attr('id', id);

      view.find('.panel-title').text(panel.type);

      view.find('.load-more').on('click', function () {
        var _panel = app.model('panels').filter(function (pan) {
          if ( pan.type !== panel.type ) {
            return false;
          }
          if ( panel.parent && panel.parent !== pan.parent ) {
            return false;
          }
          return true;
        });

        if ( _panel.length ) {
          app.emitter('socket').emit('get items', _panel[0]);
        }

        return false;
      });

      view.find('.toggle-creator').on('click', function () {
        app.controller('reveal')(view.find('.creator'), view);
      });

      // enable file upload

      app.controller('upload')(view.find('.creator:eq(0) .drop-box'));

    }
  };

} ();

},{}],29:[function(require,module,exports){
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
    "panels":       '.panels',
    "intro":        '#intro',
    "online now":   '.online-users',
    "sign":         '#signer',
    "creator":      '.creator'
  };

} ();

},{}],30:[function(require,module,exports){
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
},{"events":31}],31:[function(require,module,exports){
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

},{}],32:[function(require,module,exports){
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

},{}],33:[function(require,module,exports){
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

},{}],34:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],35:[function(require,module,exports){
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
},{"./support/isBuffer":34,"_process":33,"inherits":32}],36:[function(require,module,exports){
/*
string.js - Copyright (C) 2012-2014, JP Richardson <jprichardson@gmail.com>
*/

!(function() {
  "use strict";

  var VERSION = '2.2.0';

  var ENTITIES = {};

  // from http://semplicewebsites.com/removing-accents-javascript
  var latin_map={"Á":"A","Ă":"A","Ắ":"A","Ặ":"A","Ằ":"A","Ẳ":"A","Ẵ":"A","Ǎ":"A","Â":"A","Ấ":"A","Ậ":"A","Ầ":"A","Ẩ":"A","Ẫ":"A","Ä":"A","Ǟ":"A","Ȧ":"A","Ǡ":"A","Ạ":"A","Ȁ":"A","À":"A","Ả":"A","Ȃ":"A","Ā":"A","Ą":"A","Å":"A","Ǻ":"A","Ḁ":"A","Ⱥ":"A","Ã":"A","Ꜳ":"AA","Æ":"AE","Ǽ":"AE","Ǣ":"AE","Ꜵ":"AO","Ꜷ":"AU","Ꜹ":"AV","Ꜻ":"AV","Ꜽ":"AY","Ḃ":"B","Ḅ":"B","Ɓ":"B","Ḇ":"B","Ƀ":"B","Ƃ":"B","Ć":"C","Č":"C","Ç":"C","Ḉ":"C","Ĉ":"C","Ċ":"C","Ƈ":"C","Ȼ":"C","Ď":"D","Ḑ":"D","Ḓ":"D","Ḋ":"D","Ḍ":"D","Ɗ":"D","Ḏ":"D","ǲ":"D","ǅ":"D","Đ":"D","Ƌ":"D","Ǳ":"DZ","Ǆ":"DZ","É":"E","Ĕ":"E","Ě":"E","Ȩ":"E","Ḝ":"E","Ê":"E","Ế":"E","Ệ":"E","Ề":"E","Ể":"E","Ễ":"E","Ḙ":"E","Ë":"E","Ė":"E","Ẹ":"E","Ȅ":"E","È":"E","Ẻ":"E","Ȇ":"E","Ē":"E","Ḗ":"E","Ḕ":"E","Ę":"E","Ɇ":"E","Ẽ":"E","Ḛ":"E","Ꝫ":"ET","Ḟ":"F","Ƒ":"F","Ǵ":"G","Ğ":"G","Ǧ":"G","Ģ":"G","Ĝ":"G","Ġ":"G","Ɠ":"G","Ḡ":"G","Ǥ":"G","Ḫ":"H","Ȟ":"H","Ḩ":"H","Ĥ":"H","Ⱨ":"H","Ḧ":"H","Ḣ":"H","Ḥ":"H","Ħ":"H","Í":"I","Ĭ":"I","Ǐ":"I","Î":"I","Ï":"I","Ḯ":"I","İ":"I","Ị":"I","Ȉ":"I","Ì":"I","Ỉ":"I","Ȋ":"I","Ī":"I","Į":"I","Ɨ":"I","Ĩ":"I","Ḭ":"I","Ꝺ":"D","Ꝼ":"F","Ᵹ":"G","Ꞃ":"R","Ꞅ":"S","Ꞇ":"T","Ꝭ":"IS","Ĵ":"J","Ɉ":"J","Ḱ":"K","Ǩ":"K","Ķ":"K","Ⱪ":"K","Ꝃ":"K","Ḳ":"K","Ƙ":"K","Ḵ":"K","Ꝁ":"K","Ꝅ":"K","Ĺ":"L","Ƚ":"L","Ľ":"L","Ļ":"L","Ḽ":"L","Ḷ":"L","Ḹ":"L","Ⱡ":"L","Ꝉ":"L","Ḻ":"L","Ŀ":"L","Ɫ":"L","ǈ":"L","Ł":"L","Ǉ":"LJ","Ḿ":"M","Ṁ":"M","Ṃ":"M","Ɱ":"M","Ń":"N","Ň":"N","Ņ":"N","Ṋ":"N","Ṅ":"N","Ṇ":"N","Ǹ":"N","Ɲ":"N","Ṉ":"N","Ƞ":"N","ǋ":"N","Ñ":"N","Ǌ":"NJ","Ó":"O","Ŏ":"O","Ǒ":"O","Ô":"O","Ố":"O","Ộ":"O","Ồ":"O","Ổ":"O","Ỗ":"O","Ö":"O","Ȫ":"O","Ȯ":"O","Ȱ":"O","Ọ":"O","Ő":"O","Ȍ":"O","Ò":"O","Ỏ":"O","Ơ":"O","Ớ":"O","Ợ":"O","Ờ":"O","Ở":"O","Ỡ":"O","Ȏ":"O","Ꝋ":"O","Ꝍ":"O","Ō":"O","Ṓ":"O","Ṑ":"O","Ɵ":"O","Ǫ":"O","Ǭ":"O","Ø":"O","Ǿ":"O","Õ":"O","Ṍ":"O","Ṏ":"O","Ȭ":"O","Ƣ":"OI","Ꝏ":"OO","Ɛ":"E","Ɔ":"O","Ȣ":"OU","Ṕ":"P","Ṗ":"P","Ꝓ":"P","Ƥ":"P","Ꝕ":"P","Ᵽ":"P","Ꝑ":"P","Ꝙ":"Q","Ꝗ":"Q","Ŕ":"R","Ř":"R","Ŗ":"R","Ṙ":"R","Ṛ":"R","Ṝ":"R","Ȑ":"R","Ȓ":"R","Ṟ":"R","Ɍ":"R","Ɽ":"R","Ꜿ":"C","Ǝ":"E","Ś":"S","Ṥ":"S","Š":"S","Ṧ":"S","Ş":"S","Ŝ":"S","Ș":"S","Ṡ":"S","Ṣ":"S","Ṩ":"S","ẞ":"SS","Ť":"T","Ţ":"T","Ṱ":"T","Ț":"T","Ⱦ":"T","Ṫ":"T","Ṭ":"T","Ƭ":"T","Ṯ":"T","Ʈ":"T","Ŧ":"T","Ɐ":"A","Ꞁ":"L","Ɯ":"M","Ʌ":"V","Ꜩ":"TZ","Ú":"U","Ŭ":"U","Ǔ":"U","Û":"U","Ṷ":"U","Ü":"U","Ǘ":"U","Ǚ":"U","Ǜ":"U","Ǖ":"U","Ṳ":"U","Ụ":"U","Ű":"U","Ȕ":"U","Ù":"U","Ủ":"U","Ư":"U","Ứ":"U","Ự":"U","Ừ":"U","Ử":"U","Ữ":"U","Ȗ":"U","Ū":"U","Ṻ":"U","Ų":"U","Ů":"U","Ũ":"U","Ṹ":"U","Ṵ":"U","Ꝟ":"V","Ṿ":"V","Ʋ":"V","Ṽ":"V","Ꝡ":"VY","Ẃ":"W","Ŵ":"W","Ẅ":"W","Ẇ":"W","Ẉ":"W","Ẁ":"W","Ⱳ":"W","Ẍ":"X","Ẋ":"X","Ý":"Y","Ŷ":"Y","Ÿ":"Y","Ẏ":"Y","Ỵ":"Y","Ỳ":"Y","Ƴ":"Y","Ỷ":"Y","Ỿ":"Y","Ȳ":"Y","Ɏ":"Y","Ỹ":"Y","Ź":"Z","Ž":"Z","Ẑ":"Z","Ⱬ":"Z","Ż":"Z","Ẓ":"Z","Ȥ":"Z","Ẕ":"Z","Ƶ":"Z","Ĳ":"IJ","Œ":"OE","ᴀ":"A","ᴁ":"AE","ʙ":"B","ᴃ":"B","ᴄ":"C","ᴅ":"D","ᴇ":"E","ꜰ":"F","ɢ":"G","ʛ":"G","ʜ":"H","ɪ":"I","ʁ":"R","ᴊ":"J","ᴋ":"K","ʟ":"L","ᴌ":"L","ᴍ":"M","ɴ":"N","ᴏ":"O","ɶ":"OE","ᴐ":"O","ᴕ":"OU","ᴘ":"P","ʀ":"R","ᴎ":"N","ᴙ":"R","ꜱ":"S","ᴛ":"T","ⱻ":"E","ᴚ":"R","ᴜ":"U","ᴠ":"V","ᴡ":"W","ʏ":"Y","ᴢ":"Z","á":"a","ă":"a","ắ":"a","ặ":"a","ằ":"a","ẳ":"a","ẵ":"a","ǎ":"a","â":"a","ấ":"a","ậ":"a","ầ":"a","ẩ":"a","ẫ":"a","ä":"a","ǟ":"a","ȧ":"a","ǡ":"a","ạ":"a","ȁ":"a","à":"a","ả":"a","ȃ":"a","ā":"a","ą":"a","ᶏ":"a","ẚ":"a","å":"a","ǻ":"a","ḁ":"a","ⱥ":"a","ã":"a","ꜳ":"aa","æ":"ae","ǽ":"ae","ǣ":"ae","ꜵ":"ao","ꜷ":"au","ꜹ":"av","ꜻ":"av","ꜽ":"ay","ḃ":"b","ḅ":"b","ɓ":"b","ḇ":"b","ᵬ":"b","ᶀ":"b","ƀ":"b","ƃ":"b","ɵ":"o","ć":"c","č":"c","ç":"c","ḉ":"c","ĉ":"c","ɕ":"c","ċ":"c","ƈ":"c","ȼ":"c","ď":"d","ḑ":"d","ḓ":"d","ȡ":"d","ḋ":"d","ḍ":"d","ɗ":"d","ᶑ":"d","ḏ":"d","ᵭ":"d","ᶁ":"d","đ":"d","ɖ":"d","ƌ":"d","ı":"i","ȷ":"j","ɟ":"j","ʄ":"j","ǳ":"dz","ǆ":"dz","é":"e","ĕ":"e","ě":"e","ȩ":"e","ḝ":"e","ê":"e","ế":"e","ệ":"e","ề":"e","ể":"e","ễ":"e","ḙ":"e","ë":"e","ė":"e","ẹ":"e","ȅ":"e","è":"e","ẻ":"e","ȇ":"e","ē":"e","ḗ":"e","ḕ":"e","ⱸ":"e","ę":"e","ᶒ":"e","ɇ":"e","ẽ":"e","ḛ":"e","ꝫ":"et","ḟ":"f","ƒ":"f","ᵮ":"f","ᶂ":"f","ǵ":"g","ğ":"g","ǧ":"g","ģ":"g","ĝ":"g","ġ":"g","ɠ":"g","ḡ":"g","ᶃ":"g","ǥ":"g","ḫ":"h","ȟ":"h","ḩ":"h","ĥ":"h","ⱨ":"h","ḧ":"h","ḣ":"h","ḥ":"h","ɦ":"h","ẖ":"h","ħ":"h","ƕ":"hv","í":"i","ĭ":"i","ǐ":"i","î":"i","ï":"i","ḯ":"i","ị":"i","ȉ":"i","ì":"i","ỉ":"i","ȋ":"i","ī":"i","į":"i","ᶖ":"i","ɨ":"i","ĩ":"i","ḭ":"i","ꝺ":"d","ꝼ":"f","ᵹ":"g","ꞃ":"r","ꞅ":"s","ꞇ":"t","ꝭ":"is","ǰ":"j","ĵ":"j","ʝ":"j","ɉ":"j","ḱ":"k","ǩ":"k","ķ":"k","ⱪ":"k","ꝃ":"k","ḳ":"k","ƙ":"k","ḵ":"k","ᶄ":"k","ꝁ":"k","ꝅ":"k","ĺ":"l","ƚ":"l","ɬ":"l","ľ":"l","ļ":"l","ḽ":"l","ȴ":"l","ḷ":"l","ḹ":"l","ⱡ":"l","ꝉ":"l","ḻ":"l","ŀ":"l","ɫ":"l","ᶅ":"l","ɭ":"l","ł":"l","ǉ":"lj","ſ":"s","ẜ":"s","ẛ":"s","ẝ":"s","ḿ":"m","ṁ":"m","ṃ":"m","ɱ":"m","ᵯ":"m","ᶆ":"m","ń":"n","ň":"n","ņ":"n","ṋ":"n","ȵ":"n","ṅ":"n","ṇ":"n","ǹ":"n","ɲ":"n","ṉ":"n","ƞ":"n","ᵰ":"n","ᶇ":"n","ɳ":"n","ñ":"n","ǌ":"nj","ó":"o","ŏ":"o","ǒ":"o","ô":"o","ố":"o","ộ":"o","ồ":"o","ổ":"o","ỗ":"o","ö":"o","ȫ":"o","ȯ":"o","ȱ":"o","ọ":"o","ő":"o","ȍ":"o","ò":"o","ỏ":"o","ơ":"o","ớ":"o","ợ":"o","ờ":"o","ở":"o","ỡ":"o","ȏ":"o","ꝋ":"o","ꝍ":"o","ⱺ":"o","ō":"o","ṓ":"o","ṑ":"o","ǫ":"o","ǭ":"o","ø":"o","ǿ":"o","õ":"o","ṍ":"o","ṏ":"o","ȭ":"o","ƣ":"oi","ꝏ":"oo","ɛ":"e","ᶓ":"e","ɔ":"o","ᶗ":"o","ȣ":"ou","ṕ":"p","ṗ":"p","ꝓ":"p","ƥ":"p","ᵱ":"p","ᶈ":"p","ꝕ":"p","ᵽ":"p","ꝑ":"p","ꝙ":"q","ʠ":"q","ɋ":"q","ꝗ":"q","ŕ":"r","ř":"r","ŗ":"r","ṙ":"r","ṛ":"r","ṝ":"r","ȑ":"r","ɾ":"r","ᵳ":"r","ȓ":"r","ṟ":"r","ɼ":"r","ᵲ":"r","ᶉ":"r","ɍ":"r","ɽ":"r","ↄ":"c","ꜿ":"c","ɘ":"e","ɿ":"r","ś":"s","ṥ":"s","š":"s","ṧ":"s","ş":"s","ŝ":"s","ș":"s","ṡ":"s","ṣ":"s","ṩ":"s","ʂ":"s","ᵴ":"s","ᶊ":"s","ȿ":"s","ɡ":"g","ß":"ss","ᴑ":"o","ᴓ":"o","ᴝ":"u","ť":"t","ţ":"t","ṱ":"t","ț":"t","ȶ":"t","ẗ":"t","ⱦ":"t","ṫ":"t","ṭ":"t","ƭ":"t","ṯ":"t","ᵵ":"t","ƫ":"t","ʈ":"t","ŧ":"t","ᵺ":"th","ɐ":"a","ᴂ":"ae","ǝ":"e","ᵷ":"g","ɥ":"h","ʮ":"h","ʯ":"h","ᴉ":"i","ʞ":"k","ꞁ":"l","ɯ":"m","ɰ":"m","ᴔ":"oe","ɹ":"r","ɻ":"r","ɺ":"r","ⱹ":"r","ʇ":"t","ʌ":"v","ʍ":"w","ʎ":"y","ꜩ":"tz","ú":"u","ŭ":"u","ǔ":"u","û":"u","ṷ":"u","ü":"u","ǘ":"u","ǚ":"u","ǜ":"u","ǖ":"u","ṳ":"u","ụ":"u","ű":"u","ȕ":"u","ù":"u","ủ":"u","ư":"u","ứ":"u","ự":"u","ừ":"u","ử":"u","ữ":"u","ȗ":"u","ū":"u","ṻ":"u","ų":"u","ᶙ":"u","ů":"u","ũ":"u","ṹ":"u","ṵ":"u","ᵫ":"ue","ꝸ":"um","ⱴ":"v","ꝟ":"v","ṿ":"v","ʋ":"v","ᶌ":"v","ⱱ":"v","ṽ":"v","ꝡ":"vy","ẃ":"w","ŵ":"w","ẅ":"w","ẇ":"w","ẉ":"w","ẁ":"w","ⱳ":"w","ẘ":"w","ẍ":"x","ẋ":"x","ᶍ":"x","ý":"y","ŷ":"y","ÿ":"y","ẏ":"y","ỵ":"y","ỳ":"y","ƴ":"y","ỷ":"y","ỿ":"y","ȳ":"y","ẙ":"y","ɏ":"y","ỹ":"y","ź":"z","ž":"z","ẑ":"z","ʑ":"z","ⱬ":"z","ż":"z","ẓ":"z","ȥ":"z","ẕ":"z","ᵶ":"z","ᶎ":"z","ʐ":"z","ƶ":"z","ɀ":"z","ﬀ":"ff","ﬃ":"ffi","ﬄ":"ffl","ﬁ":"fi","ﬂ":"fl","ĳ":"ij","œ":"oe","ﬆ":"st","ₐ":"a","ₑ":"e","ᵢ":"i","ⱼ":"j","ₒ":"o","ᵣ":"r","ᵤ":"u","ᵥ":"v","ₓ":"x"};

//******************************************************************************
// Added an initialize function which is essentially the code from the S
// constructor.  Now, the S constructor calls this and a new method named
// setValue calls it as well.  The setValue function allows constructors for
// modules that extend string.js to set the initial value of an object without
// knowing the internal workings of string.js.
//
// Also, all methods which return a new S object now call:
//
//      return new this.constructor(s);
//
// instead of:
//
//      return new S(s);
//
// This allows extended objects to keep their proper instanceOf and constructor.
//******************************************************************************

  function initialize (object, s) {
    if (s !== null && s !== undefined) {
      if (typeof s === 'string')
        object.s = s;
      else
        object.s = s.toString();
    } else {
      object.s = s; //null or undefined
    }

    object.orig = s; //original object, currently only used by toCSV() and toBoolean()

    if (s !== null && s !== undefined) {
      if (object.__defineGetter__) {
        object.__defineGetter__('length', function() {
          return object.s.length;
        })
      } else {
        object.length = s.length;
      }
    } else {
      object.length = -1;
    }
  }

  function S(s) {
  	initialize(this, s);
  }

  var __nsp = String.prototype;
  var __sp = S.prototype = {

    between: function(left, right) {
      var s = this.s;
      var startPos = s.indexOf(left);
      var endPos = s.indexOf(right, startPos + left.length);
      if (endPos == -1 && right != null) 
        return new this.constructor('')
      else if (endPos == -1 && right == null)
        return new this.constructor(s.substring(startPos + left.length))
      else 
        return new this.constructor(s.slice(startPos + left.length, endPos));
    },

    //# modified slightly from https://github.com/epeli/underscore.string
    camelize: function() {
      var s = this.trim().s.replace(/(\-|_|\s)+(.)?/g, function(mathc, sep, c) {
        return (c ? c.toUpperCase() : '');
      });
      return new this.constructor(s);
    },

    capitalize: function() {
      return new this.constructor(this.s.substr(0, 1).toUpperCase() + this.s.substring(1).toLowerCase());
    },

    charAt: function(index) {
      return this.s.charAt(index);
    },

    chompLeft: function(prefix) {
      var s = this.s;
      if (s.indexOf(prefix) === 0) {
         s = s.slice(prefix.length);
         return new this.constructor(s);
      } else {
        return this;
      }
    },

    chompRight: function(suffix) {
      if (this.endsWith(suffix)) {
        var s = this.s;
        s = s.slice(0, s.length - suffix.length);
        return new this.constructor(s);
      } else {
        return this;
      }
    },

    //#thanks Google
    collapseWhitespace: function() {
      var s = this.s.replace(/[\s\xa0]+/g, ' ').replace(/^\s+|\s+$/g, '');
      return new this.constructor(s);
    },

    contains: function(ss) {
      return this.s.indexOf(ss) >= 0;
    },

    count: function(ss) {
      var count = 0
        , pos = this.s.indexOf(ss)

      while (pos >= 0) {
        count += 1
        pos = this.s.indexOf(ss, pos + 1)
      }

      return count
    },

    //#modified from https://github.com/epeli/underscore.string
    dasherize: function() {
      var s = this.trim().s.replace(/[_\s]+/g, '-').replace(/([A-Z])/g, '-$1').replace(/-+/g, '-').toLowerCase();
      return new this.constructor(s);
    },

    latinise: function() {
      var s = this.replace(/[^A-Za-z0-9\[\] ]/g, function(x) { return latin_map[x] || x; });
      return new this.constructor(s);
    },

    decodeHtmlEntities: function() { //https://github.com/substack/node-ent/blob/master/index.js
      var s = this.s;
      s = s.replace(/&#(\d+);?/g, function (_, code) {
        return String.fromCharCode(code);
      })
      .replace(/&#[xX]([A-Fa-f0-9]+);?/g, function (_, hex) {
        return String.fromCharCode(parseInt(hex, 16));
      })
      .replace(/&([^;\W]+;?)/g, function (m, e) {
        var ee = e.replace(/;$/, '');
        var target = ENTITIES[e] || (e.match(/;$/) && ENTITIES[ee]);
            
        if (typeof target === 'number') {
          return String.fromCharCode(target);
        }
        else if (typeof target === 'string') {
          return target;
        }
        else {
          return m;
        }
      })

      return new this.constructor(s);
    },

    endsWith: function() {
      var suffixes = Array.prototype.slice.call(arguments, 0);
      for (var i = 0; i < suffixes.length; ++i) {
        var l  = this.s.length - suffixes[i].length;
        if (l >= 0 && this.s.indexOf(suffixes[i], l) === l) return true;
      }
      return false;
    },

    escapeHTML: function() { //from underscore.string
      return new this.constructor(this.s.replace(/[&<>"']/g, function(m){ return '&' + reversedEscapeChars[m] + ';'; }));
    },

    ensureLeft: function(prefix) {
      var s = this.s;
      if (s.indexOf(prefix) === 0) {
        return this;
      } else {
        return new this.constructor(prefix + s);
      }
    },

    ensureRight: function(suffix) {
      var s = this.s;
      if (this.endsWith(suffix))  {
        return this;
      } else {
        return new this.constructor(s + suffix);
      }
    },

    humanize: function() { //modified from underscore.string
      if (this.s === null || this.s === undefined)
        return new this.constructor('')
      var s = this.underscore().replace(/_id$/,'').replace(/_/g, ' ').trim().capitalize()
      return new this.constructor(s)
    },

    isAlpha: function() {
      return !/[^a-z\xDF-\xFF]|^$/.test(this.s.toLowerCase());
    },

    isAlphaNumeric: function() {
      return !/[^0-9a-z\xDF-\xFF]/.test(this.s.toLowerCase());
    },

    isEmpty: function() {
      return this.s === null || this.s === undefined ? true : /^[\s\xa0]*$/.test(this.s);
    },

    isLower: function() {
      return this.isAlpha() && this.s.toLowerCase() === this.s;
    },

    isNumeric: function() {
      return !/[^0-9]/.test(this.s);
    },

    isUpper: function() {
      return this.isAlpha() && this.s.toUpperCase() === this.s;
    },

    left: function(N) {
      if (N >= 0) {
        var s = this.s.substr(0, N);
        return new this.constructor(s);
      } else {
        return this.right(-N);
      }
    },
    
    lines: function() { //convert windows newlines to unix newlines then convert to an Array of lines
      return this.replaceAll('\r\n', '\n').s.split('\n');
    },

    pad: function(len, ch) { //https://github.com/component/pad
      if (ch == null) ch = ' ';
      if (this.s.length >= len) return new this.constructor(this.s);
      len = len - this.s.length;
      var left = Array(Math.ceil(len / 2) + 1).join(ch);
      var right = Array(Math.floor(len / 2) + 1).join(ch);
      return new this.constructor(left + this.s + right);
    },

    padLeft: function(len, ch) { //https://github.com/component/pad
      if (ch == null) ch = ' ';
      if (this.s.length >= len) return new this.constructor(this.s);
      return new this.constructor(Array(len - this.s.length + 1).join(ch) + this.s);
    },

    padRight: function(len, ch) { //https://github.com/component/pad
      if (ch == null) ch = ' ';
      if (this.s.length >= len) return new this.constructor(this.s);
      return new this.constructor(this.s + Array(len - this.s.length + 1).join(ch));
    },

    parseCSV: function(delimiter, qualifier, escape, lineDelimiter) { //try to parse no matter what
      delimiter = delimiter || ',';
      escape = escape || '\\'
      if (typeof qualifier == 'undefined')
        qualifier = '"';

      var i = 0, fieldBuffer = [], fields = [], len = this.s.length, inField = false, inUnqualifiedString = false, self = this;
      var ca = function(i){return self.s.charAt(i)};
      if (typeof lineDelimiter !== 'undefined') var rows = [];

      if (!qualifier)
        inField = true;

      while (i < len) {
        var current = ca(i);
        switch (current) {
          case escape:
            //fix for issues #32 and #35
            if (inField && ((escape !== qualifier) || ca(i+1) === qualifier)) {
              i += 1;
              fieldBuffer.push(ca(i));
              break;
            }
            if (escape !== qualifier) break;
          case qualifier:
            inField = !inField;
            break;
          case delimiter:
            if(inUnqualifiedString) {
              inField=false;
              inUnqualifiedString=false;
            }
            if (inField && qualifier)
              fieldBuffer.push(current);
            else {
              fields.push(fieldBuffer.join(''))
              fieldBuffer.length = 0;
            }
            break;
          case lineDelimiter:
            if(inUnqualifiedString) {
              inField=false;
              inUnqualifiedString=false;
              fields.push(fieldBuffer.join(''))
              rows.push(fields);
              fields = [];
              fieldBuffer.length = 0;
            }
            else if (inField) {
              fieldBuffer.push(current);
            } else {
              if (rows) {
                fields.push(fieldBuffer.join(''))
                rows.push(fields);
                fields = [];
                fieldBuffer.length = 0;
              }
            }
            break;
          case ' ':
            if (inField)
              fieldBuffer.push(current);
            break;
          default:
            if (inField)
              fieldBuffer.push(current);
            else if(current!==qualifier) {
              fieldBuffer.push(current);
              inField=true;
              inUnqualifiedString=true;
            }
            break;
        }
        i += 1;
      }

      fields.push(fieldBuffer.join(''));
      if (rows) {
        rows.push(fields);
        return rows;
      }
      return fields;
    },

    replaceAll: function(ss, r) {
      //var s = this.s.replace(new RegExp(ss, 'g'), r);
      var s = this.s.split(ss).join(r)
      return new this.constructor(s);
    },

    strip: function() {
      var ss = this.s;
      for(var i= 0, n=arguments.length; i<n; i++) {
        ss = ss.split(arguments[i]).join('');
      }
      return new this.constructor(ss);
    },

    right: function(N) {
      if (N >= 0) {
        var s = this.s.substr(this.s.length - N, N);
        return new this.constructor(s);
      } else {
        return this.left(-N);
      }
    },

    setValue: function (s) {
	  initialize(this, s);
	  return this;
    },

    slugify: function() {
      var sl = (new S(new S(this.s).latinise().s.replace(/[^\w\s-]/g, '').toLowerCase())).dasherize().s;
      if (sl.charAt(0) === '-')
        sl = sl.substr(1);
      return new this.constructor(sl);
    },

    startsWith: function() {
      var prefixes = Array.prototype.slice.call(arguments, 0);
      for (var i = 0; i < prefixes.length; ++i) {
        if (this.s.lastIndexOf(prefixes[i], 0) === 0) return true;
      }
      return false;
    },

    stripPunctuation: function() {
      //return new this.constructor(this.s.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g,""));
      return new this.constructor(this.s.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " "));
    },

    stripTags: function() { //from sugar.js
      var s = this.s, args = arguments.length > 0 ? arguments : [''];
      multiArgs(args, function(tag) {
        s = s.replace(RegExp('<\/?' + tag + '[^<>]*>', 'gi'), '');
      });
      return new this.constructor(s);
    },

    template: function(values, opening, closing) {
      var s = this.s
      var opening = opening || Export.TMPL_OPEN
      var closing = closing || Export.TMPL_CLOSE

      var open = opening.replace(/[-[\]()*\s]/g, "\\$&").replace(/\$/g, '\\$')
      var close = closing.replace(/[-[\]()*\s]/g, "\\$&").replace(/\$/g, '\\$')
      var r = new RegExp(open + '(.+?)' + close, 'g')
        //, r = /\{\{(.+?)\}\}/g
      var matches = s.match(r) || [];

      matches.forEach(function(match) {
        var key = match.substring(opening.length, match.length - closing.length).trim();//chop {{ and }}
        var value = typeof values[key] == 'undefined' ? '' : values[key];
        s = s.replace(match, value);
      });
      return new this.constructor(s);
    },

    times: function(n) {
      return new this.constructor(new Array(n + 1).join(this.s));
    },

    toBoolean: function() {
      if (typeof this.orig === 'string') {
        var s = this.s.toLowerCase();
        return s === 'true' || s === 'yes' || s === 'on' || s === '1';
      } else
        return this.orig === true || this.orig === 1;
    },

    toFloat: function(precision) {
      var num = parseFloat(this.s)
      if (precision)
        return parseFloat(num.toFixed(precision))
      else
        return num
    },

    toInt: function() { //thanks Google
      // If the string starts with '0x' or '-0x', parse as hex.
      return /^\s*-?0x/i.test(this.s) ? parseInt(this.s, 16) : parseInt(this.s, 10)
    },

    trim: function() {
      var s;
      if (typeof __nsp.trim === 'undefined') 
        s = this.s.replace(/(^\s*|\s*$)/g, '')
      else 
        s = this.s.trim()
      return new this.constructor(s);
    },

    trimLeft: function() {
      var s;
      if (__nsp.trimLeft)
        s = this.s.trimLeft();
      else
        s = this.s.replace(/(^\s*)/g, '');
      return new this.constructor(s);
    },

    trimRight: function() {
      var s;
      if (__nsp.trimRight)
        s = this.s.trimRight();
      else
        s = this.s.replace(/\s+$/, '');
      return new this.constructor(s);
    },

    truncate: function(length, pruneStr) { //from underscore.string, author: github.com/rwz
      var str = this.s;

      length = ~~length;
      pruneStr = pruneStr || '...';

      if (str.length <= length) return new this.constructor(str);

      var tmpl = function(c){ return c.toUpperCase() !== c.toLowerCase() ? 'A' : ' '; },
        template = str.slice(0, length+1).replace(/.(?=\W*\w*$)/g, tmpl); // 'Hello, world' -> 'HellAA AAAAA'

      if (template.slice(template.length-2).match(/\w\w/))
        template = template.replace(/\s*\S+$/, '');
      else
        template = new S(template.slice(0, template.length-1)).trimRight().s;

      return (template+pruneStr).length > str.length ? new S(str) : new S(str.slice(0, template.length)+pruneStr);
    },

    toCSV: function() {
      var delim = ',', qualifier = '"', escape = '\\', encloseNumbers = true, keys = false;
      var dataArray = [];

      function hasVal(it) {
        return it !== null && it !== '';
      }

      if (typeof arguments[0] === 'object') {
        delim = arguments[0].delimiter || delim;
        delim = arguments[0].separator || delim;
        qualifier = arguments[0].qualifier || qualifier;
        encloseNumbers = !!arguments[0].encloseNumbers;
        escape = arguments[0].escape || escape;
        keys = !!arguments[0].keys;
      } else if (typeof arguments[0] === 'string') {
        delim = arguments[0];
      }

      if (typeof arguments[1] === 'string')
        qualifier = arguments[1];

      if (arguments[1] === null)
        qualifier = null;

       if (this.orig instanceof Array)
        dataArray  = this.orig;
      else { //object
        for (var key in this.orig)
          if (this.orig.hasOwnProperty(key))
            if (keys)
              dataArray.push(key);
            else
              dataArray.push(this.orig[key]);
      }

      var rep = escape + qualifier;
      var buildString = [];
      for (var i = 0; i < dataArray.length; ++i) {
        var shouldQualify = hasVal(qualifier)
        if (typeof dataArray[i] == 'number')
          shouldQualify &= encloseNumbers;
        
        if (shouldQualify)
          buildString.push(qualifier);
        
        if (dataArray[i] !== null && dataArray[i] !== undefined) {
          var d = new S(dataArray[i]).replaceAll(qualifier, rep).s;
          buildString.push(d);
        } else 
          buildString.push('')

        if (shouldQualify)
          buildString.push(qualifier);
        
        if (delim)
          buildString.push(delim);
      }

      //chop last delim
      //console.log(buildString.length)
      buildString.length = buildString.length - 1;
      return new this.constructor(buildString.join(''));
    },

    toString: function() {
      return this.s;
    },

    //#modified from https://github.com/epeli/underscore.string
    underscore: function() {
      var s = this.trim().s.replace(/([a-z\d])([A-Z]+)/g, '$1_$2').replace(/[-\s]+/g, '_').toLowerCase();
      if ((new S(this.s.charAt(0))).isUpper()) {
        s = '_' + s;
      }
      return new this.constructor(s);
    },

    unescapeHTML: function() { //from underscore.string
      return new this.constructor(this.s.replace(/\&([^;]+);/g, function(entity, entityCode){
        var match;

        if (entityCode in escapeChars) {
          return escapeChars[entityCode];
        } else if (match = entityCode.match(/^#x([\da-fA-F]+)$/)) {
          return String.fromCharCode(parseInt(match[1], 16));
        } else if (match = entityCode.match(/^#(\d+)$/)) {
          return String.fromCharCode(~~match[1]);
        } else {
          return entity;
        }
      }));
    },

    valueOf: function() {
      return this.s.valueOf();
    },

    //#Added a New Function called wrapHTML.
    wrapHTML: function (tagName, tagAttrs) {
      var s = this.s, el = (tagName == null) ? 'span' : tagName, elAttr = '', wrapped = '';
      if(typeof tagAttrs == 'object') for(var prop in tagAttrs) elAttr += ' ' + prop + '="' +(new this.constructor(tagAttrs[prop])).escapeHTML() + '"';
      s = wrapped.concat('<', el, elAttr, '>', this, '</', el, '>');
      return new this.constructor(s);
    }
  }

  var methodsAdded = [];
  function extendPrototype() {
    for (var name in __sp) {
      (function(name){
        var func = __sp[name];
        if (!__nsp.hasOwnProperty(name)) {
          methodsAdded.push(name);
          __nsp[name] = function() {
            String.prototype.s = this;
            return func.apply(this, arguments);
          }
        }
      })(name);
    }
  }

  function restorePrototype() {
    for (var i = 0; i < methodsAdded.length; ++i)
      delete String.prototype[methodsAdded[i]];
    methodsAdded.length = 0;
  }


/*************************************
/* Attach Native JavaScript String Properties
/*************************************/

  var nativeProperties = getNativeStringProperties();
  for (var name in nativeProperties) {
    (function(name) {
      var stringProp = __nsp[name];
      if (typeof stringProp == 'function') {
        //console.log(stringProp)
        if (!__sp[name]) {
          if (nativeProperties[name] === 'string') {
            __sp[name] = function() {
              //console.log(name)
              return new this.constructor(stringProp.apply(this, arguments));
            }
          } else {
            __sp[name] = stringProp;
          }
        }
      }
    })(name);
  }


/*************************************
/* Function Aliases
/*************************************/

  __sp.repeat = __sp.times;
  __sp.include = __sp.contains;
  __sp.toInteger = __sp.toInt;
  __sp.toBool = __sp.toBoolean;
  __sp.decodeHTMLEntities = __sp.decodeHtmlEntities //ensure consistent casing scheme of 'HTML'


//******************************************************************************
// Set the constructor.  Without this, string.js objects are instances of
// Object instead of S.
//******************************************************************************

  __sp.constructor = S;


/*************************************
/* Private Functions
/*************************************/

  function getNativeStringProperties() {
    var names = getNativeStringPropertyNames();
    var retObj = {};

    for (var i = 0; i < names.length; ++i) {
      var name = names[i];
      var func = __nsp[name];
      try {
        var type = typeof func.apply('teststring', []);
        retObj[name] = type;
      } catch (e) {}
    }
    return retObj;
  }

  function getNativeStringPropertyNames() {
    var results = [];
    if (Object.getOwnPropertyNames) {
      results = Object.getOwnPropertyNames(__nsp);
      results.splice(results.indexOf('valueOf'), 1);
      results.splice(results.indexOf('toString'), 1);
      return results;
    } else { //meant for legacy cruft, this could probably be made more efficient
      var stringNames = {};
      var objectNames = [];
      for (var name in String.prototype)
        stringNames[name] = name;

      for (var name in Object.prototype)
        delete stringNames[name];

      //stringNames['toString'] = 'toString'; //this was deleted with the rest of the object names
      for (var name in stringNames) {
        results.push(name);
      }
      return results;
    }
  }

  function Export(str) {
    return new S(str);
  };

  //attach exports to StringJSWrapper
  Export.extendPrototype = extendPrototype;
  Export.restorePrototype = restorePrototype;
  Export.VERSION = VERSION;
  Export.TMPL_OPEN = '{{';
  Export.TMPL_CLOSE = '}}';
  Export.ENTITIES = ENTITIES;



/*************************************
/* Exports
/*************************************/

  if (typeof module !== 'undefined'  && typeof module.exports !== 'undefined') {
    module.exports = Export;

  } else {

    if(typeof define === "function" && define.amd) {
      define([], function() {
        return Export;
      });
    } else {
      window.S = Export;
    }
  }


/*************************************
/* 3rd Party Private Functions
/*************************************/

  //from sugar.js
  function multiArgs(args, fn) {
    var result = [], i;
    for(i = 0; i < args.length; i++) {
      result.push(args[i]);
      if(fn) fn.call(args, args[i], i);
    }
    return result;
  }

  //from underscore.string
  var escapeChars = {
    lt: '<',
    gt: '>',
    quot: '"',
    apos: "'",
    amp: '&'
  };

  //from underscore.string
  var reversedEscapeChars = {};
  for(var key in escapeChars){ reversedEscapeChars[escapeChars[key]] = key; }

  ENTITIES = {
    "amp" : "&",
    "gt" : ">",
    "lt" : "<",
    "quot" : "\"",
    "apos" : "'",
    "AElig" : 198,
    "Aacute" : 193,
    "Acirc" : 194,
    "Agrave" : 192,
    "Aring" : 197,
    "Atilde" : 195,
    "Auml" : 196,
    "Ccedil" : 199,
    "ETH" : 208,
    "Eacute" : 201,
    "Ecirc" : 202,
    "Egrave" : 200,
    "Euml" : 203,
    "Iacute" : 205,
    "Icirc" : 206,
    "Igrave" : 204,
    "Iuml" : 207,
    "Ntilde" : 209,
    "Oacute" : 211,
    "Ocirc" : 212,
    "Ograve" : 210,
    "Oslash" : 216,
    "Otilde" : 213,
    "Ouml" : 214,
    "THORN" : 222,
    "Uacute" : 218,
    "Ucirc" : 219,
    "Ugrave" : 217,
    "Uuml" : 220,
    "Yacute" : 221,
    "aacute" : 225,
    "acirc" : 226,
    "aelig" : 230,
    "agrave" : 224,
    "aring" : 229,
    "atilde" : 227,
    "auml" : 228,
    "ccedil" : 231,
    "eacute" : 233,
    "ecirc" : 234,
    "egrave" : 232,
    "eth" : 240,
    "euml" : 235,
    "iacute" : 237,
    "icirc" : 238,
    "igrave" : 236,
    "iuml" : 239,
    "ntilde" : 241,
    "oacute" : 243,
    "ocirc" : 244,
    "ograve" : 242,
    "oslash" : 248,
    "otilde" : 245,
    "ouml" : 246,
    "szlig" : 223,
    "thorn" : 254,
    "uacute" : 250,
    "ucirc" : 251,
    "ugrave" : 249,
    "uuml" : 252,
    "yacute" : 253,
    "yuml" : 255,
    "copy" : 169,
    "reg" : 174,
    "nbsp" : 160,
    "iexcl" : 161,
    "cent" : 162,
    "pound" : 163,
    "curren" : 164,
    "yen" : 165,
    "brvbar" : 166,
    "sect" : 167,
    "uml" : 168,
    "ordf" : 170,
    "laquo" : 171,
    "not" : 172,
    "shy" : 173,
    "macr" : 175,
    "deg" : 176,
    "plusmn" : 177,
    "sup1" : 185,
    "sup2" : 178,
    "sup3" : 179,
    "acute" : 180,
    "micro" : 181,
    "para" : 182,
    "middot" : 183,
    "cedil" : 184,
    "ordm" : 186,
    "raquo" : 187,
    "frac14" : 188,
    "frac12" : 189,
    "frac34" : 190,
    "iquest" : 191,
    "times" : 215,
    "divide" : 247,
    "OElig;" : 338,
    "oelig;" : 339,
    "Scaron;" : 352,
    "scaron;" : 353,
    "Yuml;" : 376,
    "fnof;" : 402,
    "circ;" : 710,
    "tilde;" : 732,
    "Alpha;" : 913,
    "Beta;" : 914,
    "Gamma;" : 915,
    "Delta;" : 916,
    "Epsilon;" : 917,
    "Zeta;" : 918,
    "Eta;" : 919,
    "Theta;" : 920,
    "Iota;" : 921,
    "Kappa;" : 922,
    "Lambda;" : 923,
    "Mu;" : 924,
    "Nu;" : 925,
    "Xi;" : 926,
    "Omicron;" : 927,
    "Pi;" : 928,
    "Rho;" : 929,
    "Sigma;" : 931,
    "Tau;" : 932,
    "Upsilon;" : 933,
    "Phi;" : 934,
    "Chi;" : 935,
    "Psi;" : 936,
    "Omega;" : 937,
    "alpha;" : 945,
    "beta;" : 946,
    "gamma;" : 947,
    "delta;" : 948,
    "epsilon;" : 949,
    "zeta;" : 950,
    "eta;" : 951,
    "theta;" : 952,
    "iota;" : 953,
    "kappa;" : 954,
    "lambda;" : 955,
    "mu;" : 956,
    "nu;" : 957,
    "xi;" : 958,
    "omicron;" : 959,
    "pi;" : 960,
    "rho;" : 961,
    "sigmaf;" : 962,
    "sigma;" : 963,
    "tau;" : 964,
    "upsilon;" : 965,
    "phi;" : 966,
    "chi;" : 967,
    "psi;" : 968,
    "omega;" : 969,
    "thetasym;" : 977,
    "upsih;" : 978,
    "piv;" : 982,
    "ensp;" : 8194,
    "emsp;" : 8195,
    "thinsp;" : 8201,
    "zwnj;" : 8204,
    "zwj;" : 8205,
    "lrm;" : 8206,
    "rlm;" : 8207,
    "ndash;" : 8211,
    "mdash;" : 8212,
    "lsquo;" : 8216,
    "rsquo;" : 8217,
    "sbquo;" : 8218,
    "ldquo;" : 8220,
    "rdquo;" : 8221,
    "bdquo;" : 8222,
    "dagger;" : 8224,
    "Dagger;" : 8225,
    "bull;" : 8226,
    "hellip;" : 8230,
    "permil;" : 8240,
    "prime;" : 8242,
    "Prime;" : 8243,
    "lsaquo;" : 8249,
    "rsaquo;" : 8250,
    "oline;" : 8254,
    "frasl;" : 8260,
    "euro;" : 8364,
    "image;" : 8465,
    "weierp;" : 8472,
    "real;" : 8476,
    "trade;" : 8482,
    "alefsym;" : 8501,
    "larr;" : 8592,
    "uarr;" : 8593,
    "rarr;" : 8594,
    "darr;" : 8595,
    "harr;" : 8596,
    "crarr;" : 8629,
    "lArr;" : 8656,
    "uArr;" : 8657,
    "rArr;" : 8658,
    "dArr;" : 8659,
    "hArr;" : 8660,
    "forall;" : 8704,
    "part;" : 8706,
    "exist;" : 8707,
    "empty;" : 8709,
    "nabla;" : 8711,
    "isin;" : 8712,
    "notin;" : 8713,
    "ni;" : 8715,
    "prod;" : 8719,
    "sum;" : 8721,
    "minus;" : 8722,
    "lowast;" : 8727,
    "radic;" : 8730,
    "prop;" : 8733,
    "infin;" : 8734,
    "ang;" : 8736,
    "and;" : 8743,
    "or;" : 8744,
    "cap;" : 8745,
    "cup;" : 8746,
    "int;" : 8747,
    "there4;" : 8756,
    "sim;" : 8764,
    "cong;" : 8773,
    "asymp;" : 8776,
    "ne;" : 8800,
    "equiv;" : 8801,
    "le;" : 8804,
    "ge;" : 8805,
    "sub;" : 8834,
    "sup;" : 8835,
    "nsub;" : 8836,
    "sube;" : 8838,
    "supe;" : 8839,
    "oplus;" : 8853,
    "otimes;" : 8855,
    "perp;" : 8869,
    "sdot;" : 8901,
    "lceil;" : 8968,
    "rceil;" : 8969,
    "lfloor;" : 8970,
    "rfloor;" : 8971,
    "lang;" : 9001,
    "rang;" : 9002,
    "loz;" : 9674,
    "spades;" : 9824,
    "clubs;" : 9827,
    "hearts;" : 9829,
    "diams;" : 9830
  }


}).call(this);

},{}],37:[function(require,module,exports){
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
},{"./lib/TrueStory.js":38}],38:[function(require,module,exports){
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
},{"./TrueStory/model":39,"./TrueStory/parse-dot-notation":40,"./TrueStory/render":41,"./When":42,"/home/francois/Dev/follow.js/lib/Follow":1,"_process":33,"domain":30,"events":31,"util":35}],39:[function(require,module,exports){
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

},{}],40:[function(require,module,exports){
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

},{}],41:[function(require,module,exports){
(function (process){
; ! function () {

  'use strict';

  function trueStory_Render (template_name, locals, cb) {

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

            app.render(template_name, locals, cb);

          });
      }

      /** Convert HTML String into jQuery */

      var elem = $(HTMLString);

      /** If template has a controller */

      if ( template_config.controller ) {
        template_config.controller.apply(app, [elem, locals]);
      }

      /** Emit render OK */

      // app.emit('rendered ' + template_name, elem);

      if ( typeof cb === 'function' ) {
        cb(elem);
      }
    });
  };

  module.exports = trueStory_Render;

}();

}).call(this,require('_process'))
},{"_process":33}],42:[function(require,module,exports){
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
},{"./TrueStory":38,"_process":33}]},{},[2]);
