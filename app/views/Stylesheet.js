! function () {
  
  'use strict';

  var Html5 = require('syn/lib/html5');
  var elem = Html5.elem;
  var config = require('syn/config.json');

  module.exports = function (locals) {

    return [
      
      elem.styleSheet('/css/normalize.css'),

      elem.styleSheet(function (locals) {
        if ( locals.settings.env === 'development' ) {
          return '/css/index.css';
        }
        else {
          return '/css/index.min.css';
        }
      }),

      elem.styleSheet(function (locals) {
        if ( locals.settings.env === 'development' ) {
          return '/bower_components/font-awesome/css/font-awesome.css';
        }
        else {
          return config['font awesome'].cdn;
        }
      }),

      elem.styleSheet('//fonts.googleapis.com/css?family=Oswald'),

      elem.styleSheet('/assets/vex-2.2.1/css/vex.css'),

      elem.styleSheet('/assets/vex-2.2.1/css/vex-theme-flat-attack.css'),

      elem.styleSheet(function (locals) {
        if ( locals.settings.env === 'development' ) {
          return '/bower_components/c3/c3.css';
        }
        else {
          return '/css/c3.min.css';
        }
      }),

      elem.styleSheet('/assets/toolkit/tooltip.css'),

      elem.styleSheet('/bower_components/goalProgress/goalProgress.css')
      
    ];

  };

} ();
