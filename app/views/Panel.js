! function () {
  
  'use strict';

  var html5             =   require('syn/lib/html5');
  var Element           =   html5.Element;
  var CreatorView       =   require('syn/views/Creator');

  module.exports        =   function PanelView (options) {

    options = options   ||  {};

    var panel           =   Element('.panel.panel-default');

    if ( options.panel )    {
      var id            =   'panel-' + options.panel.type.toString();

      panel.options.id  =   id;
    }

    var panelHeading    =   Element('.panel-heading').add(
      Element('h4.fa.fa-plus.cursor-pointer.toggle-creator', {
        $condition      :   options.creator !== false
      }),

      Element('h4.panel-title')
    );

    var panelBody       =   Element('.panel-body');

    if ( options.creator !== false ) {
      panelBody.add(CreatorView(options));
    }

    panelBody.add(Element('.items'));

    return panel.add(
      panelHeading,
      panelBody
    );

  };

} ();
