! function () {
  
  'use strict';

  var Html5 = require('syn/lib/html5');

  var config = require('syn/config.json');

  var Intro = require('syn/views/Intro');

  var TopLevelPanel = require('syn/views/TopLevelPanel');

  var elem = Html5.elem;

  module.exports = new Html5(

    elem('title',     {
      $text           :     config.title
    }),

    elem('meta',      {
      $selfClosing    :     true,
      'http-equiv'    :     'X-UA-Compatible',
      content         :     'IE=edge'
    }),

    elem('meta',      {
      $selfClosing    :     true,
      name            :     'viewport',
      content         :     'width=device-width, initial-scale=1.0'
    }),

    elem('meta',      {
      $selfClosing    :     true,
      name            :     'description',
      content         :     'description'
    }),

    elem('script',    {
      $condition      :     function (locals) {
        return locals.settings.env === 'production';
      },
      $text           :     "(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){ (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o), m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m) })(window,document,'script','//www.google-analytics.com/analytics.js','ga');ga('create', '" + config['google analytics'].key + "', 'auto'); ga('send', 'pageview');"
    }),

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

    elem.styleSheet('/bower_components/goalProgress/goalProgress.css'),

    elem('#screens', {}, [

        elem('#screen-phone'),

        elem('#screen-tablet')
      ]
    ),

    elem('section', { role: 'header' }, [

      elem('.topbar', {}, [

        elem('.topbar-right.hide')

      ])

    ]),

    elem('section#main', { role: 'main' }, function (locals) {

      var children = [].concat(

        Intro(locals),

        TopLevelPanel(locals)

      );

      return children;

    }),

    elem('section', { role: 'footer' }),

    elem('script', {
      $text   :   function (locals) {
        var synapp = {
          env     :   locals.settings.env
        };

        return 'window.synapp = ' + JSON.stringify(synapp);
      }
    }),

    elem.importScript('/socket.io/socket.io.js'),

    elem.importScript(function (locals) {
      if ( locals.settings.env === 'development' ) {
        return '/bower_components/jquery/dist/jquery.js';
      }

      else {
        return config.jquery.cdn;
      }
    }),

    elem.importScript(function (locals) {

      var ext = '.js';

      var production = locals.settings.env === 'production';

      if ( production ) {
        ext = '.min.js';
      }

      var page = 'index';

      return '/js/' + page + ext;

    })

  );

} ();
