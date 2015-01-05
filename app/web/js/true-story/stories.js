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
      });
    }

    getEvaluation.apply(this);

    /** STORY GET TOPICS */

    // ! function getTopicsItems () {

    //   app
    //     .on('rendered panel', function (panel) {

    //       var panel_id      =   panel.attr('id');
    //       var panel_type    =   panel_id.split('-')[1];
    //       var panel_parent  =   panel_id.split('-')[2];

    //       var panel_obj     =   {
    //         type: panel_type
    //       };

    //       if ( panel_parent ) {
    //         panel_obj.parent = panel_parent;
    //       }

    //       app.emitter('socket')
    //         .on('got panel items', function (panelItems) {

    //           console.error('oh yeah')

    //           app.on('rendered item', function (itemView) {
    //             panel.find('.items').append(itemView);
    //           });

    //           panelItems.items.forEach(function (item, i) {
    //             // if ( i < panelItems.panel.limit - 1 ) {
    //               app.render('item', item);
    //             // }
    //           });
    //         });
        
    //       app.emitter('socket').emit('get panel items', panel_obj);
    //     });

    // }();

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
