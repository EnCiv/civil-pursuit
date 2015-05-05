! function () {
  
  'use strict';

  module.exports = function (locals) {
    var html5           =   require('syn/lib/html5');

    var config          =   require('syn/config.json');

    var TopBar          =   require('syn/views/TopBar');
    var Stylesheet      =   require('syn/views/Stylesheet');
    var Script          =   require('syn/views/Script');
    var Footer          =   require('syn/views/Footer');
    var Login           =   require('syn/views/Login');
    var Join            =   require('syn/views/Join');

    var document        =   new html5.Document(
      html5.Element.title(config.title)
    );

    document.add(

      html5.Element('meta',      {
        $selfClosing    :     true,
        'http-equiv'    :     'X-UA-Compatible',
        content         :     'IE=edge'
      }),

      html5.Element('meta',      {
        $selfClosing    :     true,
        name            :     'viewport',
        content         :     'width=device-width, initial-scale=1.0'
      }),

      html5.Element('meta',      {
        $selfClosing    :     true,
        name            :     'description',
        content         :     'description'
      }),

      html5.Element('script',    {
        $condition      :     function (locals) {
          return locals.settings.env === 'production';
        },
        $text           :     "(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){ (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o), m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m) })(window,document,'script','//www.google-analytics.com/analytics.js','ga');ga('create', '" + config['google analytics'].key + "', 'auto'); ga('send', 'pageview');"
      })

    );

    document.add(Stylesheet());

    document.add(

      html5.Element(
        '#screens', {},
        [
          html5.Element('#screen-phone'),
          html5.Element('#screen-tablet')
        ]
      ),

      html5.Element('section', { role: 'header' }, TopBar),

      html5.Element('section#main', { role: 'main' }),

      html5.Element('section#footer', { role: 'footer' }, Footer),

      html5.Element(
        'script#login',

        {
          type        :   'text/html',
          
          $condition  :   function (locals) {
            return ! locals.user;
          },

          $text         :   Login().toHTML()
        }
      ),

      html5.Element(
        'script#join',

        {
          type        :   'text/html',
          
          $condition  :   function (locals) {
            return ! locals.user;
          },

          $text         :   Join(locals).toHTML()
        }
      )

    );

    document.add(Script(locals));

    return document;
  };

} ();
