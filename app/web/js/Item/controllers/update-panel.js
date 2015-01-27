! function () {

  'use strict';

  /** This controller is called upon getting panel items from Socket */
  /** It updates the Panel model with updated offset value */
  /** It also push item to Item model */

  function updatePanel(panelItems) {

    var panel   =   panelItems.panel;
    var items   =   panelItems.items;
    var div     =   this;
    var Panel   =   this.root.extension('Panel');
    var Queue   =   this.root.queue;

    var panelId = '#panel-' + panel.type;

    if ( panel.parent ) {
      panelId += '-' + panel.parent;
    }
    
    // // Push Model  [] "items" with each panel item

    // var candidates = [];

    // var shownItems = items

    //   .filter(function (item, index) {
    //     return ( index < (panel.size + panel.skip) - 1 );
    //   });

    // shownItems

    //   .forEach(function (item, i) {
    //     div.push('items', item);
    //   });

    // var i = 0;

    // function render () {
    //   var item = shownItems[i];

    //   div.controller('render')(item, function (error, view) {
    //     div.controller('place item in panel')(item, view,
    //       function (error, view) {
    //         i ++;

    //         if ( shownItems[i] ) {
    //           render();
    //         }
    //       });
    //   });
    // }

    // render();

    // // Show/Hide load-more

    // if ( items.length == synapp['navigator batch size'] ) {
    //   $(panelId).find('.load-more').show();
    // }
    // else {
    //   $(panelId).find('.load-more').hide();
    // }

    // Update offset (skip)

    panel.skip += (items.length - 1);

    // Update panels model

    Panel.model('panels', Panel.model('panels').map(function (pane) {
      var match;

      if ( pane.type === panel.type ) {
        match = true;
      }

      if ( panel.parent && pane.parent !== panel.parent ) {
        match = false;
      }

      if ( match ) {
        return panel;
      }

      return pane;
    }));

    div.watch.emit('panel updated', panel, items);
  }

  module.exports = updatePanel;

} ();
