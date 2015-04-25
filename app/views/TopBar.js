! function () {
  
  'use strict';

  var Html5 = require('syn/lib/html5');
  var elem = Html5.elem;

  var config = require('syn/config.json');

  module.exports = function (locals) {

    return [
      
      elem('.topbar', {}, [

        elem('.topbar-right.hide', {}, [

          elem('button.shy.online-now', {}, [

            elem('span', { $text: 'Online now: ' }),

            elem('span.online-users')

          ])

        ])

      ])
      
    ];

  };

} ();
