! function () {

  'use strict';

  function updatePanelModel(panel, items) {

    var div     =   this;
    var Panel   =   this.root.extension('Panel');

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

    div.watch.emit('panel model updated', panel, items);
  }

  module.exports = updatePanelModel;

} ();
