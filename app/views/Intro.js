! function () {
  
  'use strict';

  var Html5 = require('syn/lib/html5');
  var elem = Html5.elem;
  var Panel = require('syn/views/Panel');
  var Item = require('syn/views/Item');

  module.exports = function (locals) {

    return [
      
      elem('#intro', {}, function (locals) {

        var panelOptions = { creator: false };

        var panel = Panel(panelOptions);

        function findPanelBody (el) {

          if ( Html5.is(el, '.panel-body') ) {

            if ( typeof el.children === 'function' ) {
              el.children = el.children();
            }

            el.children = el.children.concat(

              Item()

            );
          }

          if ( Array.isArray(el.children) ) {
            el.children.forEach(findPanelBody);
          }
        }

        panel.forEach(findPanelBody);

        return panel;
      })

    ];

  };

} ();
