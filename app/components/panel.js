! function () {
  
  'use strict';

  var selectors = require('./selectors.json');

  function ComponentPanel (panel) {

    if ( panel && typeof panel === 'object' ) {
      var id = '#panel';

      if ( panel.type ) {
        id += '-' + panel.type;
      }

      return id;
    }

    return selectors["Panel"];
  }

  module.exports = ComponentPanel;

} ();
