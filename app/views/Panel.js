! function () {
  
  'use strict';

  var html5     =   require('syn/lib/html5');
  var Creator   =   require('syn/views/Creator');

  module.exports = function PanelView (options) {

    options = options || {};

    var panelBody = html5.Element('.panel-body');

    if ( options.creator !== false ) {
      panelBody.add(Creator(options));
    }

    panelBody.add(html5.Element('.items'));

    return html5.Element('.panel.panel-default').add(
      html5.Element('.panel-heading').add(
          html5.Element('h4.fa.fa-plus.cursor-pointer.toggle-creator', {
            $condition    :   options.creator !== false
          }),

          html5.Element('h4.panel-title')
        ),

      panelBody
    );

  };

} ();
