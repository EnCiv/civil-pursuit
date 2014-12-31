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

    var app = this;

    // http://patorjk.com/software/taag/#p=display&f=Small&t=online

    /** EMITTER:SOCKET */

    this.emitter('socket')
      
      .on('error', function (error) {
        console.warn('socket error', socket);
      })

      .on('connect', function () {
        app.emitter('socket').emit('get intro');
        app.model('panels').push({ type: 'Topic' });
      })

      .on('got intro', function (intro) {
        app.model('intro', intro);
      })

      .on('got panel items', function (panelItems) {
        app.render('panel', panelItems);

        app.on('rendered panel', function (panelView) {
          app.view('panels').append(panelView);

          panelItems.items.forEach(function (item) {
            app.render('item', item);
          });

          app.on('rendered item', function (view) {
            panelView.find('.items').append(view);
          });
        });
      });

    /** MODEL */

    app.follow
      
      .on('update intro', function (intro) {
        app.render('intro', intro.new);
      });

    app

      .on('push panels', function (panel) {
        app.emitter('socket').emit('get panel items', panel);
      });

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

    /** when emitter "socket" on "got intro" */

    // when()
    //   .emitter('socket')
    //   .triggers('got intro')
    //   .then
    //     .model('intro');

    // when()
    //   .emitter('socket')
    //   .triggers('online users')
    //   .then
    //     .model('online users');

    // when()
    //   .model('online users')
    //   .triggers('all')
    //   .then
    //     .render('online users');

    // when()
    //   .model('intro')
    //   .triggers('update')
    //   .then
    //     .render('intro');

    // when()
    //   .model('panels')
    //   .triggers('push')
    //   .then
    //     .render('panel');

  };

}();
