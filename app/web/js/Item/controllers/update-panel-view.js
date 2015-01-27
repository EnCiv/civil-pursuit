! function () {

  'use strict';

  function updatePanelView(panel, items) {

    var div     =   this;
    var Panel   =   this.root.extension('Panel');
    var Queue   =   this.root.queue;

    var panelId = '#panel-' + panel.type;

    if ( panel.parent ) {
      panelId += '-' + panel.parent;
    }

    var $panel  =   $(panelId);

    if ( ! $panel.length ) {
      throw new Error('Could not find panel ' + panelId);
    }

    // Show/Hide load-more

    if ( items.length == synapp['navigator batch size'] ) {
      $(panelId).find('.load-more').show();
    }
    else {
      $(panelId).find('.load-more').hide();
    }

    div.watch.emit('panel view updated');
  }

  module.exports = updatePanelView;

} ();
