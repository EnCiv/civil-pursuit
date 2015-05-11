! function Page_Home_Controller () {
  
  'use strict';

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //  Synapp
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  var _Synapp_          =   require('syn/app');

  window.app            =   new _Synapp_();

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //  Components
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  var _Sign             =   require('syn/components/Sign/Controller');
  var _Intro            =   require('syn/components/Intro/Controller');
  var _Panel            =   require('syn/components/Panel/Controller');

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //  Provider
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  var domainRun          =   require('syn/lib/util/domain-run')

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //  On app ready
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  app.ready(function onceAppConnects_HomePage () {

    domainRun(function (d) {

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
