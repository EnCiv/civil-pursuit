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
