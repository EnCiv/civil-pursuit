! function () {
  
  'use strict';

  var html5       =   require('syn/lib/html5');
  var config      =   require('syn/config.json');
  var Page        =   require('syn/lib/Page');

  module.exports = function (locals) {

    return html5.Element('footer.padding', {}, [

      html5.Element('p', {
        $text: function () {

          var y = new Date().getFullYear();

          return 'Copyright Ⓒ 2014 ' +
            (y > 2014 ? " - " + y : "") +
            ' by Synaccord.';
        }
      }),

      html5.Element('p', {}, [

        html5.Element('a', {
          href    :   Page('Terms Of Service'),
          $text   :   'Terms of Service and Privacy Policy'
        })

      ])

    ]);

  };

} ();
