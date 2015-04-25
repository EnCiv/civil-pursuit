! function () {
  
  'use strict';

  var Html5 = require('syn/lib/html5');
  var elem = Html5.elem;

  module.exports = function (locals) {

    locals = locals || {};

    var itemOptions = {
      id    :   locals.id
    };

    return [
      
      elem('.item', itemOptions, [

        elem('.item-media-wrapper', {}, [

          elem('.item-media')

        ]),

        elem('.item-buttons'),

        elem('.item-text', {}, [

          elem('.item-truncatable', {}, [

            elem('h4.item-subject.header', {}, [

              elem('a', { href: '#' })

            ]),

            elem('.item-description.pre-text')

          ])

        ]),

        elem('.clear')

      ])
      
    ];

  };

} ();
