! function () {
  
  'use strict';

  var html5     =   require('syn/lib/html5');
  var config    =   require('syn/config.json');

  module.exports = function StyleSheets (locals) {

    return html5.Elements(
      
      // RESET

      html5.Element.styleSheet(function (locals) {
        if ( locals.settings.env === 'production' ) {
          return '/css/normalize.min.css';
        }
        else {
          return '/css/normalize.css';
        }
      }),

      // APP

      html5.Element.styleSheet(function (locals) {
        if ( locals.settings.env === 'production' ) {
          return '/css/index.min.css';
        }
        else {
          return '/css/index.css';
        }
      }),

      // FONT

      // html5.Element.styleSheet('//fonts.googleapis.com/css?family=Oswald'),

      // FONT AWESOME

      html5.Element.styleSheet(function (locals) {
        if ( locals.settings.env === 'production' ) {
          return config['font awesome'].cdn;
        }
        else {
          return '/bower_components/font-awesome/css/font-awesome.css';
        }
      }),

      // VEX MODALS

      html5.Element.styleSheet('/assets/vex-2.2.1/css/vex.css'),

      html5.Element.styleSheet('/assets/vex-2.2.1/css/vex-theme-flat-attack.css'),

      // C3

      html5.Element.styleSheet(function (locals) {
        if ( locals.settings.env === 'production' ) {
          return '/css/c3.min.css';
        }
        else {
          return '/bower_components/c3/c3.css';
        }
      }),

      // TOOLKIT

      html5.Element.styleSheet(function (locals) {
        if ( locals.settings.env === 'production' ) {
          return '/css/tooltip.min.css';
        }
        else {
          return '/assets/toolkit/tooltip.css';
        }
      }),

      // GOAL PROGRESS

      html5.Element.styleSheet(function (locals) {
        if ( locals.settings.env === 'production' ) {
          return '/css/goalProgress.min.css';
        }
        else {
          return '/bower_components/goalProgress/goalProgress.css';
        }
      })
      
    );

  };

} ();
