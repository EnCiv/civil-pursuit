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

          var symbol = '';

          if ( change.type === 'add' ) {
            symbol = '➕';
          }

          else if ( change.type === 'update' ) {
            symbol = '❍';
          }

          console.info('[' + symbol + ']', "\tfollow \t", {
            event: event,
            message: message
          });

          self.emit(event, message, 'bonjour');
        
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

},{"events":26,"util":30}],2:[function(require,module,exports){
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









                    .+~                :xx++::
                   :`. -          .!!X!~"?!`~!~!. :-:.
                  <             .!!!H":.~ ::+!~~!!!~ `%X.
                  '             ~~!M!!>!!X?!!!!!!!!!!...!~.
                              <!:!MM!~:XM!!!!!!.:!..~ !.  `<
                  <: `   :~ .:<~!!M!XXHM!!!X!XXHtMMHHHX!  ~ ~
                ~~~~<' ~!!!:!!!!!XM!!M!!!XHMMMRMSXXX!!!!!!:  <`
                  `<  <::!!!!!X!X?M!!M!!XMMMMXXMMMM??!!!!!?!:~<
               : '~~~<!!!XMMH!!XMXMXHHXXXXM!!!!MMMMSXXXX!!!!!!!~
            :    ::`~!!!MMMMXXXtMMMMMMMMMMMHX!!!!!!HMMMMMX!!!!!: ~
               '~:~!!!!!MMMMMMMMMMMMMMMMMMMMMMXXX!!!M??MMMM!!X!!i:
               <~<!!!!!XMMMMMMMMMMMM8M8MMMMM8MMMMMXX!!!!!!!!X!?t?!:
               ~:~~!!!!?MMMMMM@M@RMRRR$@@MMRMRMMMMMMXSX!!!XMMMX<?X!
             :XX <!!XHMMMM88MM88BR$M$$$$8@8RN88MMMMMMMMHXX?MMMMMX!!!
           .:X! <XMSM8M@@$$$$$$$$$$$$$$$$$$$B8R$8MMMMMMMMMMMMMMMMX!X
          :!?! !?XMMMMM8$$$$8$$$$$$$$$$$$$$BBR$$MMM@MMMMMMMMMMMMMM!!X
        ~<!!~ <!!XMMMB$$$$$$$$$$$$$$$$$$$$$$$$MMR$8MR$MMMMMMMMMMMMM!?!:
        :~~~ !:X!XMM8$$$$$$$$$$$$$$$$$$$$$$$RR$$MMMMR8NMMMMMMMMMMMMM<!`-
    ~:<!:~`~':!:HMM8N$$$$$$$$$$$$$$$$$$$$$$$$$8MRMM8R$MRMMMMMMMMRMMMX!
  !X!``~~   :~XM?SMM$B$$$$$$$$$$$$$$$$$$$$$$BR$$MMM$@R$M$MMMMMM$MMMMX?L
 X~.      : `!!!MM#$RR$$$$$$$$$$$$$$$$$R$$$$$R$M$MMRRRM8MMMMMMM$$MMMM!?:
 ! ~ <~  !! !!~`` :!!MR$$$$$$$$$$RMM!?!??RR?#R8$M$MMMRM$RMMMM8MM$MMM!M!:>
: ' >!~ '!!  !   .!XMM8$$$$$@$$$R888HMM!!XXHWX$8$RM$MR5$8MMMMR$$@MMM!!!< ~
!  ' !  ~!! :!:XXHXMMMR$$$$$$$$$$$$$$$$8$$$$8$$$MMR$M$$$MMMMMM$$$MMM!!!!
 ~<!!!  !!! !!HMMMMMMMM$$$$$$$$$$$$$$$$$$$$$$$$$$MMM$M$$MM8MMMR$$MMXX!!!!/:`
  ~!!!  !!! !XMMMMMMMMMMR$$$$$$$$$$$$R$RRR$$$$$$$MMMM$RM$MM8MM$$$M8MMMX!!!!:
  !~ ~  !!~ XMMM%!!!XMMX?M$$$$$$$$B$MMSXXXH?MR$$8MMMM$$@$8$M$B$$$$B$MMMX!!!!
  ~!    !! 'XMM?~~!!!MMMX!M$$$$$$MRMMM?!%MMMH!R$MMMMMM$$$MM$8$$$$$$MR@M!!!!!
  <>    !!  !Mf x@#"~!t?M~!$$$$$RMMM?Xb@!~`??MS$M@MMM@RMRMMM$$$$$$RMMMMM!!!!
  !    '!~ <!!:!?M   !@!M<XM$$R5M$8MMM$! -XXXMMRMBMMM$RMMM@$R$BR$MMMMX??!X!!
  !    '!  !!X!!!?::xH!HM:MM$RM8M$RHMMMX...XMMMMM$RMMRRMMMMMMM8MMMMMMMMX!!X!
  !     ~  !!?:::!!!MXMR~!MMMRMM8MMMMMS!!M?XXMMMMM$$M$M$RMMMM8$RMMMMMMMM%X!!
  ~     ~  !~~X!!XHMMM?~ XM$MMMMRMMMMMM@MMMMMMMMMM$8@MMMMMMMMRMMMMM?!MMM%HX!
           !!!!XSMMXXMM .MMMMMMMM$$$BB8MMM@MMMMMMMR$RMMMMMMMMMMMMMMMXX!?H!XX
           XHXMMMMMMMM!.XMMMMMMMMMR$$$8M$$$$$M@88MMMMMMMMMMMMMMM!XMMMXX!!!XM
      ~   <!MMMMMMMMRM:XMMMMMMMMMM8R$$$$$$$$$$$$$$$NMMMMMMMM?!MM!M8MXX!!/t!M
      '   ~HMMMMMMMMM~!MM8@8MMM!MM$$8$$$$$$$$$$$$$$8MMMMMMM!!XMMMM$8MR!MX!MM
          'MMMMMMMMMM'MM$$$$$MMXMXM$$$$$$$$$$$$$$$$RMMMMMMM!!MMM$$$$MMMMM<!M
          'MMMMMMMMM!'MM$$$$$RMMMMMM$$$$$$$$$$$$$$$MMM!MMMX!!MM$$$$$M$$M$M!M
           !MMMMMM$M! !MR$$$RMM8$8MXM8$$$$$$$$$$$$NMMM!MMM!!!?MRR$$RXM$$MR!M
           !M?XMM$$M.< !MMMMMMSUSRMXM$8R$$$$$$$$$$#$MM!MMM!X!t8$M$MMMHMRMMX$
    ,-,   '!!!MM$RMSMX:.?!XMHRR$RM88$$$8M$$$$$R$$$$8MM!MMXMH!M$$RMMMMRNMMX!$
   -'`    '!!!MMMMMMMMMM8$RMM8MBMRRMR8RMMM$$$$8$8$$$MMXMMMMM!MR$MM!M?MMMMMM$
          'XX!MMMMMMM@RMM$MM@$$BM$$$M8MMMMR$$$$@$$$$MM!MMMMXX$MRM!XH!!??XMMM
          `!!!M?MHMMM$RMMMR@$$$$MR@MMMM8MMMM$$$$$$$WMM!MMMM!M$RMM!!.MM!%M?~!
           !!!!!!MMMMBMM$$RRMMMR8MMMMMRMMMMM8$$$$$$$MM?MMMM!f#RM~    `~!!!~!
           ~!!HX!!~!?MM?MMM??MM?MMMMMMMMMRMMMM$$$$$MMM!MMMM!!
           '!!!MX!:`~~`~~!~~!!!!XM!!!?!?MMMM8$$$$$MMMMXMMM!!
            !!~M@MX.. <!!X!!!!XHMHX!!``!XMMMB$MM$$B$M!MMM!!
            !!!?MRMM!:!XHMHMMMMMMMM!  X!SMMX$$MM$$$RMXMMM~
             !M!MMMM>!XMMMMMMMMXMM!!:!MM$MMMBRM$$$$8MMMM~
             `?H!M$R>'MMMM?MMM!MM6!X!XM$$$MM$MM$$$$MX$f
              `MXM$8X MMMMMMM!!MM!!!!XM$$$MM$MM$$$RX@"
               ~M?$MM !MMMMXM!!MM!!!XMMM$$$8$XM$$RM!`
                !XMMM !MMMMXX!XM!!!HMMMM$$$$RH$$M!~
                'M?MM `?MMXMM!XM!XMMMMM$$$$$RM$$#
                 `>MMk ~MMHM!XM!XMMM$$$$$$BRM$M"
                  ~`?M. !M?MXM!X$$@M$$$$$$RMM#
                    `!M  !!MM!X8$$$RM$$$$MM#`
                      !% `~~~X8$$$$8M$$RR#`
                       !!x:xH$$$$$$$R$R*`
                        ~!?MMMMRRRM@M#`       -Sushil-
                         `~???MMM?M"`
                             ``~~ 
 


    ***/

;! function () {

  'use strict';

  var app = require('./true-story/app')();

  app.runTests('story get intro');
  
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

  var trueStory = require('/home/francois/Dev/true-story.js/lib/TrueStory');

  module.exports = function () {

    return trueStory()

      .on('error', function (error) {
        console.error(error.message);
      })

      /***
        .                             $$            $$            
        .                             $$            $$            
        $$$$$$ $$$$    $$$$$$    $$$$$$$   $$$$$$   $$   $$$$$$$  
        $$   $$   $$  $$    $$  $$    $$  $$    $$  $$  $$        
        $$   $$   $$  $$    $$  $$    $$  $$$$$$$$  $$   $$$$$$   
        $$   $$   $$  $$    $$  $$    $$  $$        $$        $$  
        $$   $$   $$   $$$$$$    $$$$$$$   $$$$$$$  $$  $$$$$$$   

      ***/

      .model(require('./model'))

      /**
        .                       $$    $$      $$                                    
        .                             $$      $$                                    
         $$$$$$   $$$$$$ $$$$   $$  $$$$$$  $$$$$$     $$$$$$    $$$$$$    $$$$$$$  
        $$    $$  $$   $$   $$  $$    $$      $$      $$    $$  $$    $$  $$        
        $$$$$$$$  $$   $$   $$  $$    $$      $$      $$$$$$$$  $$         $$$$$$   
        $$        $$   $$   $$  $$    $$  $$  $$  $$  $$        $$              $$  
         $$$$$$$  $$   $$   $$  $$     $$$$    $$$$    $$$$$$$  $$        $$$$$$$   

      **/

      .emitter('socket',
        io.connect('http://' + window.location.hostname + ':' +
          window.location.port))

      /***
        .          $$                                    
        .                                                         
        $$     $$  $$   $$$$$$   $$   $$   $$   $$$$$$$  
        .$$   $$   $$  $$    $$  $$   $$   $$  $$        
        . $$ $$    $$  $$$$$$$$  $$   $$   $$   $$$$$$   
        .  $$$     $$  $$        $$   $$   $$        $$  
        .   $      $$   $$$$$$$   $$$$$ $$$$   $$$$$$$   

      **/

      .view(require('./view'))

      /**
        .                               $$                          $$          
        .                               $$                          $$          
         $$$$$$$   $$$$$$   $$$$$$$   $$$$$$     $$$$$$    $$$$$$   $$          
        $$        $$    $$  $$    $$    $$      $$    $$  $$    $$  $$  $$$$$$  
        $$        $$    $$  $$    $$    $$      $$        $$    $$  $$          
        $$        $$    $$  $$    $$    $$  $$  $$        $$    $$  $$          
         $$$$$$$   $$$$$$   $$    $$     $$$$   $$         $$$$$$   $$          
                                                                               
                            $$                                
                            $$                                
                            $$   $$$$$$    $$$$$$    $$$$$$$  
                    $$$$$$  $$  $$    $$  $$    $$  $$        
                            $$  $$$$$$$$  $$         $$$$$$   
                            $$  $$        $$              $$  
                            $$   $$$$$$$  $$        $$$$$$$   
                                            
      ***/

      .controller(require('./controller'))

      /***
        .           $$                          $$                      
        .           $$                                                  
        .$$$$$$$  $$$$$$     $$$$$$    $$$$$$   $$   $$$$$$    $$$$$$$  
        $$          $$      $$    $$  $$    $$  $$  $$    $$  $$        
        .$$$$$$     $$      $$    $$  $$        $$  $$$$$$$$   $$$$$$   
        .     $$    $$  $$  $$    $$  $$        $$  $$              $$  
        $$$$$$$      $$$$    $$$$$$   $$        $$   $$$$$$$  $$$$$$$   

      ***/

      .tell(require('./stories'))

      /**
                                                         
          $$                            $$               
          $$                            $$               
        $$$$$$     $$$$$$    $$$$$$$  $$$$$$    $$$$$$$  
          $$      $$    $$  $$          $$     $$        
          $$      $$$$$$$$   $$$$$$     $$      $$$$$$   
          $$  $$  $$              $$    $$  $$       $$  
           $$$$    $$$$$$$  $$$$$$$      $$$$  $$$$$$$   
                                                         
        ***/

      .test(require('./test'));
    };

}();
},{"./controller":4,"./model":11,"./stories":12,"./test":13,"./view":17,"/home/francois/Dev/true-story.js/lib/TrueStory":31}],4:[function(require,module,exports){
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
    'bootstrap/responsive-image': require('./controllers/bootstrap/responsive-image'),
    'get intro':                  require('./controllers/get-intro'),
    'bind item':                  require('./controllers/bind-item'),
    'bind panel':                 require('./controllers/bind-panel'),
    'find panel':                 require('./controllers/find-panel'),
    'get panel items':            require('./controllers/get-panel-items')
  };

} ();

},{"./controllers/bind-item":5,"./controllers/bind-panel":6,"./controllers/bootstrap/responsive-image":7,"./controllers/find-panel":8,"./controllers/get-intro":9,"./controllers/get-panel-items":10}],5:[function(require,module,exports){
; ! function () {

  'use strict';

  module.exports = function bindItem (item, view) {
    console.info('[⇆]', 'bind item', { item: item, view: view });

    var app = this;

    view.find('.item-title').text(item.subject);
    view.find('.description').text(item.description);

    if ( ! item.references.length ) {
      view.find('.item-references').hide();
    }

    if ( item.image ) {

      var image = $('<img/>')

      image.addClass('img-responsive');
      image.attr('src', item.image);

      view.find('.item-media').append(image);
    }

  };

} ();

},{}],6:[function(require,module,exports){
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




**/

; ! function () {

  'use strict';

  module.exports = function bindPanel (panel, view) {
    var id = 'panel-' + panel.type;

    if ( panel.parent ) {
      id += '-' + panel.parent;
    }

    view.attr('id', id);
    
    view.find('.panel-title').text(panel.type);
  };

} ();

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
; ! function () {

  'use strict';

  module.exports = function findPanel (panel) {

    var app = this;

    var query = { type: panel.type };

    if ( panel.parent ) {
      query.parent = panel.parent;
    }

    console.info('[⟳]', "\tfind   \t", 'panels', query, app.model('panels'));

    var found = app.model('panels')
      .filter(function (panel) {
        for ( var i in query ) {
          if ( panel[i] !== query[i] ) {
            return false;
          }
        }
        return true;
      })
      [0];

    console.info('[✔]', "\tfound   \t", 'panel', found || []);

    return found;
  };

} ();

},{}],9:[function(require,module,exports){
; ! function () {

  'use strict';

  module.exports = function getIntro () {

    console.info('[➲]', "\tsocket \t", 'get intro');

    var app = this;

    this.emitter('socket').emit('get intro');

    this.emitter('socket').on('got intro', function (intro) {
      console.info('[✔]', "\tsocket \t", 'got intro', intro);

      app.model('intro', intro);
    });

  };

} ();

},{}],10:[function(require,module,exports){
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
                          $$ |  ______    ______  
                   ______ $$ | /      \  /      \ 
                  /      |$$ |/$$$$$$  |/$$$$$$  |
                  $$$$$$/ $$ |$$    $$ |$$ |  $$/ 
                          $$ |$$$$$$$$/ $$ |      
                          $$ |$$       |$$ |      
                          $$/  $$$$$$$/ $$/       
                                      
                                      
                                      


                                          
                                                    
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

                                                       
                                                            
                                                        $$  
                                                        $$  
                 $$$$$$    $$$$$$   $$$$$$$    $$$$$$   $$  
                $$    $$        $$  $$    $$  $$    $$  $$  
                $$    $$   $$$$$$$  $$    $$  $$$$$$$$  $$  
                $$    $$  $$    $$  $$    $$  $$        $$  
                $$$$$$$    $$$$$$$  $$    $$   $$$$$$$  $$  
                $$                                          
                $$                                          
                $$                                          

                                                          
                                                                
                $$    $$                                        
                      $$                                        
                $$  $$$$$$     $$$$$$   $$$$$$ $$$$    $$$$$$$  
                $$    $$      $$    $$  $$   $$   $$  $$        
                $$    $$      $$$$$$$$  $$   $$   $$   $$$$$$   
                $$    $$  $$  $$        $$   $$   $$        $$  
                $$     $$$$    $$$$$$$  $$   $$   $$  $$$$$$$   
                                                                
                                                                


***/

; ! function () {

  'use strict';

  module.exports = function getPanelItems (panel) {

    console.info('[➲]', "\tsocket \t", 'get panel items', panel);

    var app = this;

    app.emitter('socket').emit('get panel items', panel, {
      limit: synapp["navigator batch size"] });
  };

} ();

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




/***

                           ,-.             __
                         ,'   `---.___.---'  `.
                       ,'   ,-                 `-._
                     ,'    /                       \
                  ,\/     /                        \\
              )`._)>)     |                         \\
              `>,'    _   \                  /       |\
                )      \   |   |            |        |\\
       .   ,   /        \  |    `.          |        | ))
       \`. \`-'          )-|      `.        |        /((
        \ `-`   a`     _/ ;\ _     )`-.___.--\      /  `'
         `._         ,'    \`j`.__/        \  `.    \
           / ,    ,'       _)\   /`        _) ( \   /
           \__   /        /nn_) (         /nn__\_) (
             `--'     hjw   /nn__\             /nn__\


                                     __            __           
                                    /  |          /  |          
       _____  ____    ______    ____$$ |  ______  $$ |  _______ 
      /     \/    \  /      \  /    $$ | /      \ $$ | /       |
      $$$$$$ $$$$  |/$$$$$$  |/$$$$$$$ |/$$$$$$  |$$ |/$$$$$$$/ 
      $$ | $$ | $$ |$$ |  $$ |$$ |  $$ |$$    $$ |$$ |$$      \ 
      $$ | $$ | $$ |$$ \__$$ |$$ \__$$ |$$$$$$$$/ $$ | $$$$$$  |
      $$ | $$ | $$ |$$    $$/ $$    $$ |$$       |$$ |/     $$/ 
      $$/  $$/  $$/  $$$$$$/   $$$$$$$/  $$$$$$$/ $$/ $$$$$$$/  
                                                                
                                

***/

; ! function () {

  'use strict';

  module.exports = {
    "user":                       synapp.user,
    "panels":                     [],
    "templates":                  {},
    "intro":                      null,
    "items":                      [],
    "online users":               0,
    "panel":                      {}
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






/***


                                     __
                         .--.      .'  `.
                       .' . :\    /   :  L
                       F     :\  /   . : |        .-._
                      /     :  \/        J      .' ___\
                     J     :   /      : : L    /--'   ``.
                     F      : J           |  .<'.o.  `-'>
                    /        J             L \_>.   .--w)
                   J        /              \_/|   . `-__|
                   F                        / `    -' /|)
                  |   :                    J   '        |
                 .'   ':                   |    .    :  \
                /                          J      :     |L
               F                              |     \   ||
              F .                             |   :      |
             F  |                             ; .   :  : F
            /   |                                     : J
           J    J             )                ;        F
           |     L           /      .:'                J
        .-'F:     L        ./       :: :       .       F
        `-'F:     .\    `:.J         :::.             J
          J       ::\    `:|        |::::\            |
          J        |:`.    J        :`:::\            F
           L   :':/ \ `-`.  \       : `:::|        .-'
           |     /   L    >--\         :::|`.    .-'
           J    J    |    |   L     .  :::: :`, /
            L   F    J    )   |        >::   : /
            |  J      L   F   \     .-.:'   . /
            ): |     J   /     `-   | |   .--'
            /  |     |: J        L  J J   )
            L  |     |: |        L   F|   /
            \: J     \:  L       \  /  L |
             L |      \  |        F|   | )
             J F       \ J       J |   |J
              L|        \ \      | |   | L
              J L        \ \     F \   F |
               L\         \ \   J   | J   L
              /__\_________)_`._)_  |_/   \_____
                                  ""   `"""

               __                          __                     
              /  |                        /  |                    
    _______  _$$ |_     ______    ______  $$/   ______    _______ 
   /       |/ $$   |   /      \  /      \ /  | /      \  /       |
  /$$$$$$$/ $$$$$$/   /$$$$$$  |/$$$$$$  |$$ |/$$$$$$  |/$$$$$$$/ 
  $$      \   $$ | __ $$ |  $$ |$$ |  $$/ $$ |$$    $$ |$$      \ 
   $$$$$$  |  $$ |/  |$$ \__$$ |$$ |      $$ |$$$$$$$$/  $$$$$$  |
  /     $$/   $$  $$/ $$    $$/ $$ |      $$ |$$       |/     $$/ 
  $$$$$$$/     $$$$/   $$$$$$/  $$/       $$/  $$$$$$$/ $$$$$$$/  
                                                                  
           







***/

! function () {

  'use strict';

  module.exports = function (when) {
    // http://patorjk.com/software/taag/#p=display&f=Small&t=online

    /***



                                                    
                                                    
                                  $$            $$  
                                  $$            $$  
    $$$$$$ $$$$    $$$$$$    $$$$$$$   $$$$$$   $$  
    $$   $$   $$  $$    $$  $$    $$  $$    $$  $$  
    $$   $$   $$  $$    $$  $$    $$  $$$$$$$$  $$  
    $$   $$   $$  $$    $$  $$    $$  $$        $$  
    $$   $$   $$   $$$$$$    $$$$$$$   $$$$$$$  $$  
                                                    
                                                    
                                                    
    $$$$$$  $$$$$$  $$$$$$  $$$$$$  $$$$$$  $$$$$$  
                                                
                                                
                                                
                                                
                                                
                                                   
                                
                                
                                
                                
                       
    ***/


    /***
                                                                
                                  $$                    $$      
                                  $$                    $$      
     $$$$$$$   $$$$$$    $$$$$$$  $$    $$   $$$$$$   $$$$$$    
    $$        $$    $$  $$        $$   $$<  $$    $$    $$      
     $$$$$$   $$    $$  $$        $$$$$$    $$$$$$$$    $$      
          $$  $$    $$  $$        $$   $$   $$          $$  $$  
    $$$$$$$    $$$$$$    $$$$$$$  $$    $$   $$$$$$$     $$$$   
                                                                
                                                            
    ***/





      /***

                                                            
           $$$$$$    $$$$$$    $$$$$$    $$$$$$    $$$$$$   
          $$    $$  $$    $$  $$    $$  $$    $$  $$    $$  
          $$$$$$$$  $$        $$        $$    $$  $$        
          $$        $$        $$        $$    $$  $$        
           $$$$$$$  $$        $$         $$$$$$   $$        



      ***/


    when()
      .emitter('socket')
      .triggers('error')
      .then(function (error) {
        console.warn('TOLD YOU SO');
      });



      /***
                                                                    $$      
                                                                    $$      
       $$$$$$$   $$$$$$   $$$$$$$   $$$$$$$    $$$$$$    $$$$$$$  $$$$$$    
      $$        $$    $$  $$    $$  $$    $$  $$    $$  $$          $$      
      $$        $$    $$  $$    $$  $$    $$  $$$$$$$$  $$          $$      
      $$        $$    $$  $$    $$  $$    $$  $$        $$          $$  $$  
       $$$$$$$   $$$$$$   $$    $$  $$    $$   $$$$$$$   $$$$$$$     $$$$   
            
      ***/

    when()
      .emitter('socket')
      .triggers('connect')
      .then(require('./when/emitter/socket/on/connect'));

          /***                         
                              $$  $$                      
                              $$                          
           $$$$$$   $$$$$$$   $$  $$  $$$$$$$    $$$$$$   
          $$    $$  $$    $$  $$  $$  $$    $$  $$    $$  
          $$    $$  $$    $$  $$  $$  $$    $$  $$$$$$$$  
          $$    $$  $$    $$  $$  $$  $$    $$  $$        
           $$$$$$   $$    $$  $$  $$  $$    $$   $$$$$$$  
                                                            
          $$    $$   $$$$$$$   $$$$$$    $$$$$$    $$$$$$$  
          $$    $$  $$        $$    $$  $$    $$  $$        
          $$    $$   $$$$$$   $$$$$$$$  $$         $$$$$$   
          $$    $$        $$  $$        $$              $$  
           $$$$$$   $$$$$$$    $$$$$$$  $$        $$$$$$$   
                                                  
          ***/

    when()
      .emitter('socket')
      .triggers('online users')
      .then(require('./when/emitter/socket/on/online users'));

    /***
                                                
                                                
    $$              $$                          
                    $$                          
    $$  $$$$$$$   $$$$$$     $$$$$$    $$$$$$   
    $$  $$    $$    $$      $$    $$  $$    $$  
    $$  $$    $$    $$      $$        $$    $$  
    $$  $$    $$    $$  $$  $$        $$    $$  
    $$  $$    $$     $$$$   $$         $$$$$$   
                                                

    ***/

    when()
      .model('intro')
      .triggers('update')
      .then(require('./when/model/intro/on/update'));

    /***
                                                          
                                            $$            
                                            $$            
     $$$$$$    $$$$$$   $$$$$$$    $$$$$$   $$   $$$$$$$  
    $$    $$        $$  $$    $$  $$    $$  $$  $$        
    $$    $$   $$$$$$$  $$    $$  $$$$$$$$  $$   $$$$$$   
    $$    $$  $$    $$  $$    $$  $$        $$        $$  
    $$$$$$$    $$$$$$$  $$    $$   $$$$$$$  $$  $$$$$$$   
    $$                                                    
    $$                                                    
    $$                                                                          
    
    ***/

     when()
      .model('panels')
      .triggers('push')
      .then(require('./when/model/panels/on/push'));

    /**

                                      
                                      
      $$                              
      $$                              
    $$$$$$     $$$$$$   $$$$$$ $$$$   
      $$      $$    $$  $$   $$   $$  
      $$      $$$$$$$$  $$   $$   $$  
      $$  $$  $$        $$   $$   $$  
       $$$$    $$$$$$$  $$   $$   $$  
                                                        
                        $$              $$                
                        $$              $$                
               $$$$$$   $$   $$$$$$   $$$$$$     $$$$$$   
      $$$$$$  $$    $$  $$        $$    $$      $$    $$  
              $$    $$  $$   $$$$$$$    $$      $$$$$$$$  
              $$    $$  $$  $$    $$    $$  $$  $$        
              $$$$$$$   $$   $$$$$$$     $$$$    $$$$$$$  
              $$                                          
              $$                                          
              $$                                                                               
                                                          
                                            $$            
                                            $$            
     $$$$$$    $$$$$$   $$$$$$$    $$$$$$   $$   $$$$$$$  
    $$    $$        $$  $$    $$  $$    $$  $$  $$        
    $$    $$   $$$$$$$  $$    $$  $$$$$$$$  $$   $$$$$$   
    $$    $$  $$    $$  $$    $$  $$        $$        $$  
    $$$$$$$    $$$$$$$  $$    $$   $$$$$$$  $$  $$$$$$$   
    $$                                                    
    $$                                                    
    $$    

                                        $$            
                                        $$            
     $$$$$$    $$$$$$   $$$$$$$    $$$$$$$   $$$$$$   
    $$    $$  $$    $$  $$    $$  $$    $$  $$    $$  
    $$        $$$$$$$$  $$    $$  $$    $$  $$$$$$$$  
    $$        $$        $$    $$  $$    $$  $$        
    $$         $$$$$$$  $$    $$   $$$$$$$   $$$$$$$  

                                        $$  
                                        $$  
               $$$$$$    $$$$$$    $$$$$$$  
      $$$$$$  $$    $$  $$    $$  $$    $$  
              $$        $$$$$$$$  $$    $$  
              $$        $$        $$    $$  
              $$         $$$$$$$   $$$$$$$  
                                          
    **/
    
    when()
      .model('template panel rendered')
      .triggers('update')
      .then(require('./when/model/template panel rendered/on/update'));

    /***
                          
    $$    $$                                        
          $$                                        
    $$  $$$$$$     $$$$$$   $$$$$$ $$$$    $$$$$$$  
    $$    $$      $$    $$  $$   $$   $$  $$        
    $$    $$      $$$$$$$$  $$   $$   $$   $$$$$$   
    $$    $$  $$  $$        $$   $$   $$        $$  
    $$     $$$$    $$$$$$$  $$   $$   $$  $$$$$$$   
                       
    ***/

    when()
      .model('items')
      .triggers('concat')
      .then(require('./when/model/items/on/concat'));

    /***                         
                        $$  $$                      
                        $$                          
     $$$$$$   $$$$$$$   $$  $$  $$$$$$$    $$$$$$   
    $$    $$  $$    $$  $$  $$  $$    $$  $$    $$  
    $$    $$  $$    $$  $$  $$  $$    $$  $$$$$$$$  
    $$    $$  $$    $$  $$  $$  $$    $$  $$        
     $$$$$$   $$    $$  $$  $$  $$    $$   $$$$$$$  
                                                      
    $$    $$   $$$$$$$   $$$$$$    $$$$$$    $$$$$$$  
    $$    $$  $$        $$    $$  $$    $$  $$        
    $$    $$   $$$$$$   $$$$$$$$  $$         $$$$$$   
    $$    $$        $$  $$        $$              $$  
     $$$$$$   $$$$$$$    $$$$$$$  $$        $$$$$$$   
                                            
    ***/

    when()
      .model('online users')
      .triggers('all')
      .then(require('./when/model/online users/on/all'));

  };

}();

},{"./when/emitter/socket/on/connect":18,"./when/emitter/socket/on/online users":19,"./when/model/intro/on/update":20,"./when/model/items/on/concat":21,"./when/model/online users/on/all":22,"./when/model/panels/on/push":23,"./when/model/template panel rendered/on/update":24}],13:[function(require,module,exports){
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
                                                            
                                                            
                                                                               

***/

; ! function () {

  'use strict';

  var tests = {};

  var stories = require('./tests/stories');

  for ( var story in stories ) {
    tests['story ' + story] = stories[story];
  }

  module.exports = tests;

} ();

},{"./tests/stories":14}],14:[function(require,module,exports){
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
                                                                        
                                                                        
                                                                

                                                           

***/

; ! function () {

  'use strict';

  module.exports = {
    "get topics":                 require('./stories/get-topics'),
    "get intro":                  require('./stories/get-intro')
  };

} ();

},{"./stories/get-intro":15,"./stories/get-topics":16}],15:[function(require,module,exports){
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

  module.exports = function () {
    var app = this;


    var series = [
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
      }
    ];

    var got = [];




    app.model('test', {
      got: [],
      done: false
    });

    // var tests = app.model('__tests.stories');

    // app.controller('true-story/merge')(app.model('__tests.stories'), {
    //     'story': 
    //   });

    // console.info(app.model('test').name);

    app.tell(function (when) {
      when()
        .model('test.got')
        .triggers('push')
        .then(function (pushed) {
          if ( app.model('test.got').length === series.length ) {
            app.model('test.done', true);
          }
        });

      series.forEach(function (story) {

        var role = ('model' in story && 'model') ||
          ('emitter' in story && 'emitter');

        when()
          [role](story[role])
          .triggers(story.event)
          .then(function () {
            app.model('test.got').push(story);
            console.warn('SPIDERMAN', app.model('test'))
          });
      });
    });

    setTimeout(function () {
      if ( ! app.model('test.done') ) {
        throw new Error('Test failed', 'get intro');
      }
      else {
        console.info(' :) :) :) :) :) TRUE STORY TEST OK', 'get intro');
      }
    }, 2000);
  };

} ();

},{}],16:[function(require,module,exports){
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

  module.exports = function () {

    return console.warn('test story', this)

    var app = this;


    var series = [
      {
        emitter: 'socket',
        event: 'connect',
        listener: 'on'
      },

      {
        model: 'panels',
        event: 'push',
        listener: 'on'
      }
    ];


    app.model('test', {
      name: 'Render Topic panel with items',
      got: [],
      done: false
    });

    app.tell(function (when) {

      when
        .model('test.got')
        .triggers('push')
        .then(function (pushed) {
          console.warn(series.length, app.model('test.got').length);
        });

      series.forEach(function (story) {

        var role = ('model' in story && 'model') ||
          ('emitter' in story && 'emitter');

        console.warn('story !!!!!', 'when.' + role + '(' + story[role] + ').triggers(' + story.event + ')');

        when
          [role](story[role])
          .triggers(story.event)
          .then(function () {
            // app.model('test.got').push(story);
          });
      });
    });

    setTimeout(function () {
      console.log('!')
      console.log('!.')
      console.log('!..', app)
    }, 2000);
  };

} ();

},{}],17:[function(require,module,exports){
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
    "panel":        '.panel',
    "intro":        '#intro',
    "online users": '.online-users'
  };

} ();

},{}],18:[function(require,module,exports){
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


                                     __
                         .--.      .'  `.
                       .' . :\    /   :  L
                       F     :\  /   . : |        .-._
                      /     :  \/        J      .' ___\
                     J     :   /      : : L    /--'   ``.
                     F      : J           |  .<'.o.  `-'>
                    /        J             L \_>.   .--w)
                   J        /              \_/|   . `-__|
                   F                        / `    -' /|)
                  |   :                    J   '        |
                 .'   ':                   |    .    :  \
                /                          J      :     |L
               F                              |     \   ||
              F .                             |   :      |
             F  |                             ; .   :  : F
            /   |                                     : J
           J    J             )                ;        F
           |     L           /      .:'                J
        .-'F:     L        ./       :: :       .       F
        `-'F:     .\    `:.J         :::.             J
          J       ::\    `:|        |::::\            |
          J        |:`.    J        :`:::\            F
           L   :':/ \ `-`.  \       : `:::|        .-'
           |     /   L    >--\         :::|`.    .-'
           J    J    |    |   L     .  :::: :`, /
            L   F    J    )   |        >::   : /
            |  J      L   F   \     .-.:'   . /
            ): |     J   /     `-   | |   .--'
            /  |     |: J        L  J J   )
            L  |     |: |        L   F|   /
            \: J     \:  L       \  /  L |
             L |      \  |        F|   | )
             J F       \ J       J |   |J
              L|        \ \      | |   | L
              J L        \ \     F \   F |
               L\         \ \   J   | J   L
              /__\_________)_`._)_  |_/   \_____
                                  ""   `"""

               __                          __                     
              /  |                        /  |                    
    _______  _$$ |_     ______    ______  $$/   ______    _______ 
   /       |/ $$   |   /      \  /      \ /  | /      \  /       |
  /$$$$$$$/ $$$$$$/   /$$$$$$  |/$$$$$$  |$$ |/$$$$$$  |/$$$$$$$/ 
  $$      \   $$ | __ $$ |  $$ |$$ |  $$/ $$ |$$    $$ |$$      \ 
   $$$$$$  |  $$ |/  |$$ \__$$ |$$ |      $$ |$$$$$$$$/  $$$$$$  |
  /     $$/   $$  $$/ $$    $$/ $$ |      $$ |$$       |/     $$/ 
  $$$$$$$/     $$$$/   $$$$$$/  $$/       $$/  $$$$$$$/ $$$$$$$/  
                                                                  
           


















                                                        
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
                                                                      
                                    

                                                                  


                                                                     
                                       $$                    $$      
                                       $$                    $$      
           $$$$$$$   $$$$$$    $$$$$$$  $$    $$   $$$$$$   $$$$$$    
          $$        $$    $$  $$        $$   $$<  $$    $$    $$      
          $$$$$$   $$    $$  $$        $$$$$$    $$$$$$$$    $$      
                $$  $$    $$  $$        $$   $$   $$          $$  $$  
          $$$$$$$    $$$$$$    $$$$$$$  $$    $$   $$$$$$$     $$$$  


       
                                 


                                            
                         $$$$$$   $$$$$$$   
                        $$    $$  $$    $$  
                        $$    $$  $$    $$  
                        $$    $$  $$    $$  
                         $$$$$$   $$    $$  
          
                                 


                                                                    $$      
                                                                    $$      
       $$$$$$$   $$$$$$   $$$$$$$   $$$$$$$    $$$$$$    $$$$$$$  $$$$$$    
      $$        $$    $$  $$    $$  $$    $$  $$    $$  $$          $$      
      $$        $$    $$  $$    $$  $$    $$  $$$$$$$$  $$          $$      
      $$        $$    $$  $$    $$  $$    $$  $$        $$          $$  $$  
       $$$$$$$   $$$$$$   $$    $$  $$    $$   $$$$$$$   $$$$$$$     $$$$   
                                                                      
                                                                      








***/

! function () {

  'use strict';

  module.exports = function onModelSocketConnect (conn) {
    console.info('[✔]', "\tsocket \t", 'connected to web socket server');

    /** If no intro loaded, load it */
    if ( ! this.model('intro') ) {
      this.controller('get intro')();
    }

    // this.model('panels').push({ type: 'Topic' });
  };

} ();

},{}],19:[function(require,module,exports){
! function () {

  'use strict';

  module.exports = function (online_users) {
    this.model('online users', online_users);
  };

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




                                     __
                         .--.      .'  `.
                       .' . :\    /   :  L
                       F     :\  /   . : |        .-._
                      /     :  \/        J      .' ___\
                     J     :   /      : : L    /--'   ``.
                     F      : J           |  .<'.o.  `-'>
                    /        J             L \_>.   .--w)
                   J        /              \_/|   . `-__|
                   F                        / `    -' /|)
                  |   :                    J   '        |
                 .'   ':                   |    .    :  \
                /                          J      :     |L
               F                              |     \   ||
              F .                             |   :      |
             F  |                             ; .   :  : F
            /   |                                     : J
           J    J             )                ;        F
           |     L           /      .:'                J
        .-'F:     L        ./       :: :       .       F
        `-'F:     .\    `:.J         :::.             J
          J       ::\    `:|        |::::\            |
          J        |:`.    J        :`:::\            F
           L   :':/ \ `-`.  \       : `:::|        .-'
           |     /   L    >--\         :::|`.    .-'
           J    J    |    |   L     .  :::: :`, /
            L   F    J    )   |        >::   : /
            |  J      L   F   \     .-.:'   . /
            ): |     J   /     `-   | |   .--'
            /  |     |: J        L  J J   )
            L  |     |: |        L   F|   /
            \: J     \:  L       \  /  L |
             L |      \  |        F|   | )
             J F       \ J       J |   |J
              L|        \ \      | |   | L
              J L        \ \     F \   F |
               L\         \ \   J   | J   L
              /__\_________)_`._)_  |_/   \_____
                                  ""   `"""

                                                                  
                                                                  
              $$                          $$                      
              $$                                                  
   $$$$$$$  $$$$$$     $$$$$$    $$$$$$   $$   $$$$$$    $$$$$$$  
  $$          $$      $$    $$  $$    $$  $$  $$    $$  $$        
   $$$$$$     $$      $$    $$  $$        $$  $$$$$$$$   $$$$$$   
        $$    $$  $$  $$    $$  $$        $$  $$              $$  
  $$$$$$$      $$$$    $$$$$$   $$        $$   $$$$$$$  $$$$$$$   
                                                                  
           












                                            
                                                        
                          $$                            
                          $$                            
            $$   $$   $$  $$$$$$$    $$$$$$   $$$$$$$   
            $$   $$   $$  $$    $$  $$    $$  $$    $$  
            $$   $$   $$  $$    $$  $$$$$$$$  $$    $$  
            $$   $$   $$  $$    $$  $$        $$    $$  
             $$$$$ $$$$   $$    $$   $$$$$$$  $$    $$  
                                                        
                                                                  
                                                          
                                                          
                                        $$            $$  
                                        $$            $$  
          $$$$$$ $$$$    $$$$$$    $$$$$$$   $$$$$$   $$  
          $$   $$   $$  $$    $$  $$    $$  $$    $$  $$  
          $$   $$   $$  $$    $$  $$    $$  $$$$$$$$  $$  
          $$   $$   $$  $$    $$  $$    $$  $$        $$  
          $$   $$   $$   $$$$$$    $$$$$$$   $$$$$$$  $$  
                                                          
                                                          
                                            
                                                        
            $$              $$                          
                            $$                          
            $$  $$$$$$$   $$$$$$     $$$$$$    $$$$$$   
            $$  $$    $$    $$      $$    $$  $$    $$  
            $$  $$    $$    $$      $$        $$    $$  
            $$  $$    $$    $$  $$  $$        $$    $$  
            $$  $$    $$     $$$$   $$         $$$$$$   
                                                        
                    
                    
                                        
                                        
                     $$$$$$   $$$$$$$   
                    $$    $$  $$    $$  
                    $$    $$  $$    $$  
                    $$    $$  $$    $$  
                     $$$$$$   $$    $$  
                    
                                                            
                                                                    
                                  $$              $$                
                                  $$              $$                
        $$    $$   $$$$$$    $$$$$$$   $$$$$$   $$$$$$     $$$$$$   
        $$    $$  $$    $$  $$    $$        $$    $$      $$    $$  
        $$    $$  $$    $$  $$    $$   $$$$$$$    $$      $$$$$$$$  
        $$    $$  $$    $$  $$    $$  $$    $$    $$  $$  $$        
         $$$$$$   $$$$$$$    $$$$$$$   $$$$$$$     $$$$    $$$$$$$  
                  $$                                                
                  $$                                                
                  $$                                                








***/

! function () {

  'use strict';

  module.exports = function onUpdateModelIntro (intro) {
    var app = this;

    this.view('intro').find('.panel-title').text(intro.new.subject);

    this.view('intro').find('.item-title').text(intro.new.subject);

    this.view('intro').find('.description').text(intro.new.description);

    this.view('intro').find('.item-media').append(
      this.controller('bootstrap/responsive-image')({
        src: intro.new.image
      }));

    this.view('intro').find('.item-references').hide();
    
  };

} ();

},{}],21:[function(require,module,exports){
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




                                     __
                         .--.      .'  `.
                       .' . :\    /   :  L
                       F     :\  /   . : |        .-._
                      /     :  \/        J      .' ___\
                     J     :   /      : : L    /--'   ``.
                     F      : J           |  .<'.o.  `-'>
                    /        J             L \_>.   .--w)
                   J        /              \_/|   . `-__|
                   F                        / `    -' /|)
                  |   :                    J   '        |
                 .'   ':                   |    .    :  \
                /                          J      :     |L
               F                              |     \   ||
              F .                             |   :      |
             F  |                             ; .   :  : F
            /   |                                     : J
           J    J             )                ;        F
           |     L           /      .:'                J
        .-'F:     L        ./       :: :       .       F
        `-'F:     .\    `:.J         :::.             J
          J       ::\    `:|        |::::\            |
          J        |:`.    J        :`:::\            F
           L   :':/ \ `-`.  \       : `:::|        .-'
           |     /   L    >--\         :::|`.    .-'
           J    J    |    |   L     .  :::: :`, /
            L   F    J    )   |        >::   : /
            |  J      L   F   \     .-.:'   . /
            ): |     J   /     `-   | |   .--'
            /  |     |: J        L  J J   )
            L  |     |: |        L   F|   /
            \: J     \:  L       \  /  L |
             L |      \  |        F|   | )
             J F       \ J       J |   |J
              L|        \ \      | |   | L
              J L        \ \     F \   F |
               L\         \ \   J   | J   L
              /__\_________)_`._)_  |_/   \_____
                                  ""   `"""

                                                                  
                                                                  
              $$                          $$                      
              $$                                                  
   $$$$$$$  $$$$$$     $$$$$$    $$$$$$   $$   $$$$$$    $$$$$$$  
  $$          $$      $$    $$  $$    $$  $$  $$    $$  $$        
   $$$$$$     $$      $$    $$  $$        $$  $$$$$$$$   $$$$$$   
        $$    $$  $$  $$    $$  $$        $$  $$              $$  
  $$$$$$$      $$$$    $$$$$$   $$        $$   $$$$$$$  $$$$$$$   
                                                                  
           












                                            
                                                        
                          $$                            
                          $$                            
            $$   $$   $$  $$$$$$$    $$$$$$   $$$$$$$   
            $$   $$   $$  $$    $$  $$    $$  $$    $$  
            $$   $$   $$  $$    $$  $$$$$$$$  $$    $$  
            $$   $$   $$  $$    $$  $$        $$    $$  
             $$$$$ $$$$   $$    $$   $$$$$$$  $$    $$  
                                                        
                                                                  
                                                          
                                                          
                                        $$            $$  
                                        $$            $$  
          $$$$$$ $$$$    $$$$$$    $$$$$$$   $$$$$$   $$  
          $$   $$   $$  $$    $$  $$    $$  $$    $$  $$  
          $$   $$   $$  $$    $$  $$    $$  $$$$$$$$  $$  
          $$   $$   $$  $$    $$  $$    $$  $$        $$  
          $$   $$   $$   $$$$$$    $$$$$$$   $$$$$$$  $$  
                                                          
                                                          
                                                      
                                                          
                                                          
          $$    $$                                        
                $$                                        
          $$  $$$$$$     $$$$$$   $$$$$$ $$$$    $$$$$$$  
          $$    $$      $$    $$  $$   $$   $$  $$        
          $$    $$      $$$$$$$$  $$   $$   $$   $$$$$$   
          $$    $$  $$  $$        $$   $$   $$        $$  
          $$     $$$$    $$$$$$$  $$   $$   $$  $$$$$$$   
                                           
                              


                                        
                     $$$$$$   $$$$$$$   
                    $$    $$  $$    $$  
                    $$    $$  $$    $$  
                    $$    $$  $$    $$  
                     $$$$$$   $$    $$  
                                                            
                                                                
                                                        $$      
                                                        $$      
     $$$$$$$   $$$$$$   $$$$$$$    $$$$$$$   $$$$$$   $$$$$$    
    $$        $$    $$  $$    $$  $$              $$    $$      
    $$        $$    $$  $$    $$  $$         $$$$$$$    $$      
    $$        $$    $$  $$    $$  $$        $$    $$    $$  $$  
     $$$$$$$   $$$$$$   $$    $$   $$$$$$$   $$$$$$$     $$$$   
                                                                
                                                                
                                                                







***/! function () {

  'use strict';

  module.exports = function (items) {
    var app = this;

    console.log('arrrrrrrrrg', items, this.model('panels'))

    this.model('panels').forEach(function (panel) {
      items.forEach(function (item) {

        var match = false;

        if ( panel.parent ) {
          if ( panel.parent === item.parent ) {
            match = true;
          }
        }
        else {
          if ( panel.type === item.type ) {
            match = true;
          }
        }

        if ( match ) {
          var id = '#panel-' + panel.type;

          if ( panel.parent ) {
            id += '-' + panel.parent;
          }

          var panelView = $(id);

          if ( ! panelView.length ) {
            console.warn('Panel not found')
          }
        }

      });
    });
  };

} ();

},{}],22:[function(require,module,exports){
! function () {

  'use strict';

  module.exports = function onOnlineUsers (online_users) {
    this.view('online users').text(online_users.new);
  };

} ();

},{}],23:[function(require,module,exports){
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


                                     __
                         .--.      .'  `.
                       .' . :\    /   :  L
                       F     :\  /   . : |        .-._
                      /     :  \/        J      .' ___\
                     J     :   /      : : L    /--'   ``.
                     F      : J           |  .<'.o.  `-'>
                    /        J             L \_>.   .--w)
                   J        /              \_/|   . `-__|
                   F                        / `    -' /|)
                  |   :                    J   '        |
                 .'   ':                   |    .    :  \
                /                          J      :     |L
               F                              |     \   ||
              F .                             |   :      |
             F  |                             ; .   :  : F
            /   |                                     : J
           J    J             )                ;        F
           |     L           /      .:'                J
        .-'F:     L        ./       :: :       .       F
        `-'F:     .\    `:.J         :::.             J
          J       ::\    `:|        |::::\            |
          J        |:`.    J        :`:::\            F
           L   :':/ \ `-`.  \       : `:::|        .-'
           |     /   L    >--\         :::|`.    .-'
           J    J    |    |   L     .  :::: :`, /
            L   F    J    )   |        >::   : /
            |  J      L   F   \     .-.:'   . /
            ): |     J   /     `-   | |   .--'
            /  |     |: J        L  J J   )
            L  |     |: |        L   F|   /
            \: J     \:  L       \  /  L |
             L |      \  |        F|   | )
             J F       \ J       J |   |J
              L|        \ \      | |   | L
              J L        \ \     F \   F |
               L\         \ \   J   | J   L
              /__\_________)_`._)_  |_/   \_____
                                  ""   `"""

               __                          __                     
              /  |                        /  |                    
    _______  _$$ |_     ______    ______  $$/   ______    _______ 
   /       |/ $$   |   /      \  /      \ /  | /      \  /       |
  /$$$$$$$/ $$$$$$/   /$$$$$$  |/$$$$$$  |$$ |/$$$$$$  |/$$$$$$$/ 
  $$      \   $$ | __ $$ |  $$ |$$ |  $$/ $$ |$$    $$ |$$      \ 
   $$$$$$  |  $$ |/  |$$ \__$$ |$$ |      $$ |$$$$$$$$/  $$$$$$  |
  /     $$/   $$  $$/ $$    $$/ $$ |      $$ |$$       |/     $$/ 
  $$$$$$$/     $$$$/   $$$$$$/  $$/       $$/  $$$$$$$/ $$$$$$$/  
                                                                  
           


















                                                        
                          $$                            
                          $$                            
            $$   $$   $$  $$$$$$$    $$$$$$   $$$$$$$   
            $$   $$   $$  $$    $$  $$    $$  $$    $$  
            $$   $$   $$  $$    $$  $$$$$$$$  $$    $$  
            $$   $$   $$  $$    $$  $$        $$    $$  
             $$$$$ $$$$   $$    $$   $$$$$$$  $$    $$  
                                                        
                                                                  
                                                          
                                                          
                                        $$            $$  
                                        $$            $$  
          $$$$$$ $$$$    $$$$$$    $$$$$$$   $$$$$$   $$  
          $$   $$   $$  $$    $$  $$    $$  $$    $$  $$  
          $$   $$   $$  $$    $$  $$    $$  $$$$$$$$  $$  
          $$   $$   $$  $$    $$  $$    $$  $$        $$  
          $$   $$   $$   $$$$$$    $$$$$$$   $$$$$$$  $$  
                                            
                                                                               
                                                                
                                                                
                                                  $$            
                                                  $$            
           $$$$$$    $$$$$$   $$$$$$$    $$$$$$   $$   $$$$$$$  
          $$    $$        $$  $$    $$  $$    $$  $$  $$        
          $$    $$   $$$$$$$  $$    $$  $$$$$$$$  $$   $$$$$$   
          $$    $$  $$    $$  $$    $$  $$        $$        $$  
          $$$$$$$    $$$$$$$  $$    $$   $$$$$$$  $$  $$$$$$$   
          $$                                                    
          $$                                                    
          $$                                                    


                                          
                       $$$$$$   $$$$$$$   
                      $$    $$  $$    $$  
                      $$    $$  $$    $$  
                      $$    $$  $$    $$  
                       $$$$$$   $$    $$  
        
                                                                            
                                          
                                                        
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
! function () {

  'use strict';

  module.exports = function onPushModelPanels (panel) {

    var app = this;

    this.controller('true-story/render-view')({
      container:  this.view('panels'),
      template:   {
        url: '/partial/panel'
      },
      engine:     function (view, locals) {
        view = $(view);

        app.controller('bind panel')(locals.panel, view);

        return view;
      },
      locals:     { panel: panel },
      append:     true,
      ready:      function (view) {
        app.model('panel', {
          panel: panel,
          view: view
        });
      }
    });
  };

} ();

},{}],24:[function(require,module,exports){
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




                                     __
                         .--.      .'  `.
                       .' . :\    /   :  L
                       F     :\  /   . : |        .-._
                      /     :  \/        J      .' ___\
                     J     :   /      : : L    /--'   ``.
                     F      : J           |  .<'.o.  `-'>
                    /        J             L \_>.   .--w)
                   J        /              \_/|   . `-__|
                   F                        / `    -' /|)
                  |   :                    J   '        |
                 .'   ':                   |    .    :  \
                /                          J      :     |L
               F                              |     \   ||
              F .                             |   :      |
             F  |                             ; .   :  : F
            /   |                                     : J
           J    J             )                ;        F
           |     L           /      .:'                J
        .-'F:     L        ./       :: :       .       F
        `-'F:     .\    `:.J         :::.             J
          J       ::\    `:|        |::::\            |
          J        |:`.    J        :`:::\            F
           L   :':/ \ `-`.  \       : `:::|        .-'
           |     /   L    >--\         :::|`.    .-'
           J    J    |    |   L     .  :::: :`, /
            L   F    J    )   |        >::   : /
            |  J      L   F   \     .-.:'   . /
            ): |     J   /     `-   | |   .--'
            /  |     |: J        L  J J   )
            L  |     |: |        L   F|   /
            \: J     \:  L       \  /  L |
             L |      \  |        F|   | )
             J F       \ J       J |   |J
              L|        \ \      | |   | L
              J L        \ \     F \   F |
               L\         \ \   J   | J   L
              /__\_________)_`._)_  |_/   \_____
                                  ""   `"""

                                                                  
                                                                  
              $$                          $$                      
              $$                                                  
   $$$$$$$  $$$$$$     $$$$$$    $$$$$$   $$   $$$$$$    $$$$$$$  
  $$          $$      $$    $$  $$    $$  $$  $$    $$  $$        
   $$$$$$     $$      $$    $$  $$        $$  $$$$$$$$   $$$$$$   
        $$    $$  $$  $$    $$  $$        $$  $$              $$  
  $$$$$$$      $$$$    $$$$$$   $$        $$   $$$$$$$  $$$$$$$   
                                                                  
           












                                            
                                                        
                          $$                            
                          $$                            
            $$   $$   $$  $$$$$$$    $$$$$$   $$$$$$$   
            $$   $$   $$  $$    $$  $$    $$  $$    $$  
            $$   $$   $$  $$    $$  $$$$$$$$  $$    $$  
            $$   $$   $$  $$    $$  $$        $$    $$  
             $$$$$ $$$$   $$    $$   $$$$$$$  $$    $$  
                                                        
                                                                  
                                                          
                                                          
                                        $$            $$  
                                        $$            $$  
          $$$$$$ $$$$    $$$$$$    $$$$$$$   $$$$$$   $$  
          $$   $$   $$  $$    $$  $$    $$  $$    $$  $$  
          $$   $$   $$  $$    $$  $$    $$  $$$$$$$$  $$  
          $$   $$   $$  $$    $$  $$    $$  $$        $$  
          $$   $$   $$   $$$$$$    $$$$$$$   $$$$$$$  $$  
                                                          
                                                            

                                    
                                    
                            $$  $$  
                            $$  $$  
                            $$  $$  
                                    
                                  

                                                          
                  $$                              
                  $$                              
                $$$$$$     $$$$$$   $$$$$$ $$$$   
                  $$      $$    $$  $$   $$   $$  
                  $$      $$$$$$$$  $$   $$   $$  
                  $$  $$  $$        $$   $$   $$  
                   $$$$    $$$$$$$  $$   $$   $$  
                          


                          $$              $$                
                          $$              $$                
                 $$$$$$   $$   $$$$$$   $$$$$$     $$$$$$   
        $$$$$$  $$    $$  $$        $$    $$      $$    $$  
                $$    $$  $$   $$$$$$$    $$      $$$$$$$$  
                $$    $$  $$  $$    $$    $$  $$  $$        
                $$$$$$$   $$   $$$$$$$     $$$$    $$$$$$$  
                $$                                          
                $$                                          
                $$                                                                               
                                                          
                                                  $$            
                                                  $$            
           $$$$$$    $$$$$$   $$$$$$$    $$$$$$   $$   $$$$$$$  
          $$    $$        $$  $$    $$  $$    $$  $$  $$        
          $$    $$   $$$$$$$  $$    $$  $$$$$$$$  $$   $$$$$$   
          $$    $$  $$    $$  $$    $$  $$        $$        $$  
          $$$$$$$    $$$$$$$  $$    $$   $$$$$$$  $$  $$$$$$$   
          $$                                                    
          $$                                                    
          $$    

                                                $$            
                                                $$            
             $$$$$$    $$$$$$   $$$$$$$    $$$$$$$   $$$$$$   
            $$    $$  $$    $$  $$    $$  $$    $$  $$    $$  
            $$        $$$$$$$$  $$    $$  $$    $$  $$$$$$$$  
            $$        $$        $$    $$  $$    $$  $$        
            $$         $$$$$$$  $$    $$   $$$$$$$   $$$$$$$  



                                                $$  
                                                $$  
                       $$$$$$    $$$$$$    $$$$$$$  
              $$$$$$  $$    $$  $$    $$  $$    $$  
                      $$        $$$$$$$$  $$    $$  
                      $$        $$        $$    $$  
                      $$         $$$$$$$   $$$$$$$  
                    




                            $$  $$  
                            $$  $$  
                            $$  $$  



                                            
                                          
                       $$$$$$   $$$$$$$   
                      $$    $$  $$    $$  
                      $$    $$  $$    $$  
                      $$    $$  $$    $$  
                       $$$$$$   $$    $$  

                    
                                    

                                                                    
                                  $$              $$                
                                  $$              $$                
        $$    $$   $$$$$$    $$$$$$$   $$$$$$   $$$$$$     $$$$$$   
        $$    $$  $$    $$  $$    $$        $$    $$      $$    $$  
        $$    $$  $$    $$  $$    $$   $$$$$$$    $$      $$$$$$$$  
        $$    $$  $$    $$  $$    $$  $$    $$    $$  $$  $$        
         $$$$$$   $$$$$$$    $$$$$$$   $$$$$$$     $$$$    $$$$$$$  
                  $$                                                
                  $$                                                
                  $$                                                








***/

! function () {

  'use strict';

  module.exports = function (panelView) {
    this.controller('get panel items')(panelView.new.panel);
  };

}();

},{}],25:[function(require,module,exports){
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
},{"events":26}],26:[function(require,module,exports){
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

},{}],27:[function(require,module,exports){
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

},{}],28:[function(require,module,exports){
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

},{}],29:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],30:[function(require,module,exports){
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
},{"./support/isBuffer":29,"_process":28,"inherits":27}],31:[function(require,module,exports){
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
    this.models 			= {};
    this.indexes      = {};
    this.controllers 	= {};
    this.emitters     = {};
    this.views 				= {};
    this.follow       = new Follow(this.models);
    this.templates    = {};
    this.tests        = {};

    this.domain       = require('domain').create();

    var app = this;

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
                                                    
                                                  
                                ee            ee  
                                ee            ee  
  eeeeee eeee    eeeeee    eeeeeee   eeeeee   ee  
  ee   ee   ee  ee    ee  ee    ee  ee    ee  ee  
  ee   ee   ee  ee    ee  ee    ee  eeeeeeee  ee  
  ee   ee   ee  ee    ee  ee    ee  ee        ee  
  ee   ee   ee   eeeeee    eeeeeee   eeeeeee  ee  
                                                  
                                                
  ***********************************************/

  TrueStory.prototype.model = require('./TrueStory/model');

  /***********************************************
                                                                  
                                                                  
                                  ee                          ee  
                                  ee                          ee  
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
      console.warn('** TRUE STORY ** Running all tests!')
      for ( var test in this.tests ) {
        console.warn('** TRUE STORY ** Running test', test);
        this.test(test)();
      }

      return this;
    }

    for ( var i in arguments ) {
      if ( typeof arguments[i] === 'string' ) {
        console.warn('***** TRUE STORY ***** Running test', arguments[i], this.tests);
        this.test(arguments[i])();
      }
    }

    return this;
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

  module.exports = TrueStory.exports;
} ();
}).call(this,require('_process'))
},{"./TrueStory/model":32,"./TrueStory/parse-dot-notation":33,"./When":34,"/home/francois/Dev/follow.js/lib/Follow":1,"_process":28,"domain":25,"events":26,"util":30}],32:[function(require,module,exports){
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

        if ( ! app.indexes[name] ) {
          
        }

        $model = index(app.models, name);

        // $model = app.indexes[name];
        
        // console.warn('AL CAPONE %%%%%%%%%%%%%%%%%%%%%%%%%', 
        //   name.split('.').reduce(index, app.models));


        // var $model = [app.models]
        //   .concat(name.split(/\./))
        //   .reduce(function(prev, curr) {
        //       return prev[curr];
        //   });

        // $model = name.split('.').reduce(index, app.models);

        console.warn('AY AY AY AY MODEL', $model)

        // var $model = this.models;

        // name.split(/\./).forEach(function (n) {
        //   if ( $model ) {
        //     $model = $model[n];
        //   }
        // });
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
            enumerable: 'false'
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

},{}],33:[function(require,module,exports){
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

},{}],34:[function(require,module,exports){
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

  /** @class
   *  @arg {TrueStory} app
   **/

  function When (app) {
    this.who = {};

    /** @type TrueStory */
    this.app = app;
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
   *  @return When
   */

  When.prototype.model = function (model) {
    
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
   *  @return When
   */

  When.prototype.emitter = function (emitter) {
    
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
   *  @return When
   */

  When.prototype.triggers = function (event) {
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

  When.prototype.then = function (fn) {
    var when = this;

    console.warn('***** TRUE STORY ******', when);

    if ( when.who.model ) {

      if ( when.listener ) {

        /***

                                                    
                                                    
                      $$                            
                      $$                            
        $$   $$   $$  $$$$$$$    $$$$$$   $$$$$$$   
        $$   $$   $$  $$    $$  $$    $$  $$    $$  
        $$   $$   $$  $$    $$  $$$$$$$$  $$    $$  
        $$   $$   $$  $$    $$  $$        $$    $$  
         $$$$$ $$$$   $$    $$   $$$$$$$  $$    $$  
                                                    
                                                        
                                                        
                                      $$            $$  
                                      $$            $$  
        $$$$$$ $$$$    $$$$$$    $$$$$$$   $$$$$$   $$  
        $$   $$   $$  $$    $$  $$    $$  $$    $$  $$  
        $$   $$   $$  $$    $$  $$    $$  $$$$$$$$  $$  
        $$   $$   $$  $$    $$  $$    $$  $$        $$  
        $$   $$   $$   $$$$$$    $$$$$$$   $$$$$$$  $$    


                            
                            
         $$$$$$   $$$$$$$   
        $$    $$  $$    $$  
        $$    $$  $$    $$  
        $$    $$  $$    $$  
         $$$$$$   $$    $$  
                            
                            
                            
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

    else if ( when.who.emitter ) {
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
        this.emitter(when.who.emitter)[when.listener](when.event, fn.bind(this));
      }.apply(this.app);
    }

    else if ( when.who.view ) {
      if ( when.on ) {

      }
    }
  };

  module.exports = When;
} ();
},{}]},{},[2]);
