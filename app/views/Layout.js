! function () {
  
  'use strict';

  var Html5           =   require('syn/lib/html5');
  var elem            =   Html5.elem;

  var config          =   require('syn/config.json');

  var Intro           =   require('syn/views/Intro');
  var TopLevelPanel   =   require('syn/views/TopLevelPanel');
  var TopBar          =   require('syn/views/TopBar');
  var Stylesheet      =   require('syn/views/Stylesheet');
  var Script          =   require('syn/views/Script');
  var Footer          =   require('syn/views/Footer');
  var Login           =   require('syn/views/Login');

  var html5           =   new Html5(elem.title(config.title));

  html5.add(

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
    })

  );

  html5.add.apply(html5, Stylesheet());

  html5.add(

    elem(
      '#screens',
      
      {},
      
      [
        elem('#screen-phone'),

        elem('#screen-tablet')
      ]
    ),

    elem(
      'section',
      
      { role: 'header' },
      
      TopBar
    ),

    elem(
      'section#main',

      { role: 'main' },

      function (locals) {

        return [].concat(

          Intro(locals),

          TopLevelPanel(locals)

        );
    }),

    elem(
      'section#footer',

      { role: 'footer' },

      Footer),

    elem(
      'script#login',

      {
        type        :   'text/html',
        
        $condition  :   function (locals) {
          return ! locals.user;
        },

        $text         :   Login().reduce(function (text, elem) {
          text += Html5.toHTML(elem);
          return text;
        }, '')
      }
    )

  );

  html5.add.apply(html5, Script());

  module.exports = html5;

} ();
