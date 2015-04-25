! function () {
  
  'use strict';

  var Html5 = require('syn/lib/html5');
  var elem = Html5.elem;
  var config = require('syn/config.json');

  module.exports = function (locals) {

    return [

      /////////////////////////////////////////////////////////////////////////
      //  INJECT SCRIPT
      /////////////////////////////////////////////////////////////////////////
      
      elem('script', {
        $text   :   function (locals) {
          var synapp = {
            env     :   locals.settings.env
          };

          return 'window.synapp = ' + JSON.stringify(synapp);
        }
      }),

      /////////////////////////////////////////////////////////////////////////
      //  SOCKET.IO
      /////////////////////////////////////////////////////////////////////////

      elem.importScript('/socket.io/socket.io.js'),

      /////////////////////////////////////////////////////////////////////////
      //  JQUERY.JS
      /////////////////////////////////////////////////////////////////////////

      elem.importScript(function (locals) {
        if ( locals.settings.env === 'development' ) {
          return '/bower_components/jquery/dist/jquery.js';
        }

        else {
          return config.jquery.cdn;
        }
      }),

      /////////////////////////////////////////////////////////////////////////
      //  APP.JS
      /////////////////////////////////////////////////////////////////////////

      elem.importScript(function (locals) {

        var ext = '.js';

        var production = locals.settings.env === 'production';

        if ( production ) {
          ext = '.min.js';
        }

        var page = 'index';

        return '/js/' + page + ext;

      }),

      /////////////////////////////////////////////////////////////////////////
      //  VEX.JS
      /////////////////////////////////////////////////////////////////////////

      elem.importScript('/assets/vex-2.2.1/js/vex.combined.min.js')
      
    ];

  };

} ();
