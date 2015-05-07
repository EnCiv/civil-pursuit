! function () {
  
  'use strict';

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //  Synapp
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  var _Synapp_          =   require('syn/js/Synapp');

  window.app            =   new _Synapp_();

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //  Components
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  var _Sign             =   require('syn/js/components/Sign');
  var _Intro            =   require('syn/js/components/Intro');
  var _Panel            =   require('syn/js/components/Panel');

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //  Provider
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  var __Domain          =   require('syn/js/providers/Domain')

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //  On app ready
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  app.ready(function onceAppConnects_HomePage () {

    new __Domain(function (d) {

      /** Render intro */
      new _Intro().render();

      /** Render user-related components */
      new _Sign().render();

      var panel;

      window.app.socket.publish('get top-level type', function (type) {

        if ( ! panel ) {
          panel = new _Panel(type);

          panel

            .load()

            .then(function (template) {

              $('.panels').append(template);

              panel.render()

                .then(function () {

                  panel.fill();
              
                }, d.intercept);

            }, d.intercept);
        }  

      });
    });

  });

} ();
