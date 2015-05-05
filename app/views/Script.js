! function () {
  
  'use strict';

  var html5       = require('syn/lib/html5');
  var config      = require('syn/config.json');

  module.exports = function (locals) {

    return html5.Elements(

      /////////////////////////////////////////////////////////////////////////
      //  INJECT SCRIPT
      /////////////////////////////////////////////////////////////////////////
      
      html5.Element('script', {
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

      html5.Element.importScript('/socket.io/socket.io.js'),

      /////////////////////////////////////////////////////////////////////////
      //  JQUERY.JS
      /////////////////////////////////////////////////////////////////////////

      html5.Element.importScript(function (locals) {
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

      html5.Element.importScript(function (exports) {

        var ext = '.js';

        var production = exports.settings.env === 'production';

        if ( production ) {
          ext = '.min.js';
        }

        var page = exports.page || 'index';

        return '/js/' + page + ext;

      }),

      /////////////////////////////////////////////////////////////////////////
      //  VEX.JS
      /////////////////////////////////////////////////////////////////////////

      html5.Element.importScript('/assets/vex-2.2.1/js/vex.combined.min.js')
      
    );

  };

} ();
