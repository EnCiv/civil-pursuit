! function () {

  'use strict';

  function makePanel (type, parent) {

    var div     =   this;
    var id      =   'panel-' + type;

    if ( parent ) {
      id += '-' + parent;
    }

    return luigi('tpl-panel')
      .controller(function ($subPanel) {

        $subPanel.attr('id', id);
      });

  }

  module.exports = makePanel;

} ();
