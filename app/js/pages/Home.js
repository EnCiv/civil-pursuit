! function () {
  
  'use strict';

  var Synapp    =   require('syn/js/Synapp');
  // var Item      =   require('syn/js/components/Item');
  var Sign      =   require('syn/js/components/Sign');
  var Intro     =   require('syn/js/components/Intro');
  var Panel     =   require('syn/js/components/Panel');

  window.app    =   new Synapp();

  app.ready(function onceAppConnects_HomePage () {

    /** Render intro */
    new Intro().render();

    console.log('hello!');

    /** Render user-related components */
    new Sign().render();

    var panel;

    window.app.socket.publish('get top-level type', function (type) {

      console.info('Page Home', 'OK get top-level type', type);
      
      if ( ! panel ) {
        panel = new Panel(type);

        panel

          .load()

          .then(function (template) {

            $('.panels').append(template);

            panel.render()

              .then(function () {

                console.info('filling')
            
                panel.fill();
            
              });

          });
      }  

    });
  
  });

} ();
