! function () {
  
  'use strict';

  var Html5 = require('syn/lib/html5');
  var elem = Html5.elem;

  var config = require('syn/config.json');

  var Page = require('syn/lib/Page');

  module.exports = function (locals) {

    return [
      
      elem('footer.padding', {}, [

        elem('p', {
          $text: function () {

            var y = new Date().getFullYear();

            return 'Copyright Ⓒ 2014 ' +
              (y > 2014 ? " - " + y : "") +
              ' by Synaccord.';
          }
        }),

        elem('p', {}, [

          elem('a', {
            href: Page('Terms Of Service'),
            $text: 'Terms of Service and Privacy Policy'
          })

        ])

      ])
      
    ];

  };

} ();
