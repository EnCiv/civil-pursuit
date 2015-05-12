! function () {
  
  'use strict';

  module.exports = function (locals) {
    var html5           =   require('syn/lib/html5');
    var Element         =   html5.Element;

    var config          =   require('syn/config.json');

    var TopBar          =   require('syn/components/TopBar/View');
    var Stylesheet      =   require('syn/components/Styles/View');
    var Script          =   require('syn/components/Scripts/View');
    var Footer          =   require('syn/components/Footer/View');
    var Login           =   require('syn/components/Login/View');
    var Join            =   require('syn/components/Join/View');

    var document        =   new html5.Document(
      Element.title(config.title)
    );

    document.add(

      Element('meta',      {
        $selfClosing    :     true,
        'http-equiv'    :     'X-UA-Compatible',
        content         :     'IE=edge'
      }),

      Element('meta',      {
        $selfClosing    :     true,
        name            :     'viewport',
        content         :     'width=device-width, initial-scale=1.0'
      }),

      Element('meta',      {
        $selfClosing    :     true,
        name            :     'description',
        content         :     'description'
      }),

      Element('script',    {
        $condition      :     function (locals) {
          return locals.settings.env === 'production';
        },
        $text           :     "(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){ (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o), m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m) })(window,document,'script','//www.google-analytics.com/analytics.js','ga');ga('create', '" + config['google analytics'].key + "', 'auto'); ga('send', 'pageview');"
      })

    );

    document.add(Stylesheet());

    document.add(

      Element(
        '#screens', {},
        [
          Element('#screen-phone'),
          Element('#screen-tablet')
        ]
      ),

      Element('section', { role: 'header' }, TopBar),

      Element('section#main', { role: 'main' }),

      Element('section#footer', { role: 'footer' }, Footer),

      Element('script#login', {
          type        :   'text/html',
          
          $condition  :   function (locals) {
            return ! locals.user;
          },

          $text         :   Login().toHTML()
        }
      ),

      Element('script#join', {
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
