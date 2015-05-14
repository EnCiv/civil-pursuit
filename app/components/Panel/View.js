! function () {
  
  'use strict';

  var html5             =   require('syn/lib/html5');
  var Element           =   html5.Element;
  var CreatorView       =   require('syn/components/Creator/View');

  module.exports        =   function PanelView (locals) {

    locals = locals     ||  {};

    var panel           =   Element('.panel');

    if ( locals.panel )    {
      var id            =   'panel-' + locals.panel.type.toString();

      panel.options.id   =   id;
    }

    var panelHeading    =   Element('.panel-heading').add(
      Element('h4.fa.fa-plus.toggle-creator', {
        $condition      :   locals.creator !== false
      }),

      Element('h4.panel-title')
    );

    var panelBody       =   Element('.panel-body');

    if ( locals.creator !== false ) {
      panelBody.add(CreatorView(locals));
    }

    var items = Element('.items');

    panelBody.add(items);

    var LoadingItems = Element('.loading-items.hide').add(
      Element('i.fa.fa-circle-o-notch.fa-spin'),
      Element('span').text('Loading items...')
    );

    panelBody.add(LoadingItems);

    panelBody.add(
      Element('.padding.hide.pre').add(
        Element('.load-more.hide').add(
          Element('a', { href: '#' }).text('View more')
        ),

        Element('.create-new').add(
          Element('a', { href: '#' }).text('Click the + to be the first to add something here')
        )
      )
    );

    return panel.add(
      panelHeading,
      panelBody
    );

  };

} ();
