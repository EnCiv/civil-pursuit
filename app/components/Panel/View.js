! function () {
  
  'use strict';

  var html5             =   require('syn/lib/html5');
  var Element           =   html5.Element;
  var CreatorView       =   require('syn/components/Creator/View');

  module.exports        =   function PanelView (locals) {

    locals = locals     ||  {};

    var panel           =   Element('.panel.panel-default');

    if ( locals.panel )    {
      var id            =   'panel-' + locals.panel.type.toString();

      panel.options.id   =   id;
    }

    var panelHeading    =   Element('.panel-heading').add(
      Element('h4.fa.fa-plus.cursor-pointer.toggle-creator', {
        $condition      :   locals.creator !== false
      }),

      Element('h4.panel-title')
    );

    var panelBody       =   Element('.panel-body');

    if ( locals.creator !== false ) {
      panelBody.add(CreatorView(locals));
    }

    panelBody.add(Element('.items'));

    return panel.add(
      panelHeading,
      panelBody
    );

  };

} ();
