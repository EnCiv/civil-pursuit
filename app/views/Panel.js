! function () {
  
  'use strict';

  var Html5 = require('syn/lib/html5');
  var elem = Html5.elem;
  var Creator = require('syn/views/Creator');

  module.exports = function (locals) {

    return [

      elem('.panel.panel-default', {}, [

        elem('.panel-heading', {}, [

          elem('h4.fa.fa-plus.cursor-pointer.toggle-creator', {
            $condition    :   locals.creator !== false
          }),

          elem('h4.panel-title')

        ]),

        elem('.panel-body', {}, function () {
          
          var children = [];

          if ( locals.creator !== false ) {
            children = Creator();
          }

          children.push(elem('.items'));

          return children;

        })

      ])

    ];
  };

} ();
