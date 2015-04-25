! function () {
  
  'use strict';

  var Html5 = require('syn/lib/html5');
  var elem = Html5.elem;

  module.exports = function (locals) {

    locals = locals || {};

    var itemOptions = {
      id    :   locals.id
    };

    var ItemWrapper = elem('.item-media-wrapper', {}, [

      elem('.item-media')

    ]);

    var ItemButtons = elem('.item-buttons', {

        $condition    :   function () {
          return locals.buttons !== false;
        }

      }, [

      elem('button.item-toggle-promote.shy', {}, [

        elem('span.promoted', { $text: '0' }),

        elem('i.fa.fa-bullhorn')

      ]),

      elem('div'),

      elem('button.item-toggle-details.shy', {}, [

        elem('span.promoted-percent', { $text: '0%' }),

        elem('i.fa.fa-signal')

      ])

    ]);

    var ItemText = elem('.item-text', {}, [

      elem('.item-truncatable', {}, [

        elem('h4.item-subject.header', {}, [

          elem('a', { href: '#' })

        ]),

        elem('.item-description.pre-text')

      ])

    ]);

    return [
      
      elem('.item', itemOptions, [

        ItemWrapper,

        ItemButtons,

        ItemText,

        elem('.clear')

      ])
      
    ];

  };

} ();
