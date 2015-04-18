! function () {
  
  'use strict';

  var selectors = require('./selectors.json');

  function ComponentPanelCreatorToggle (panel) {

    if ( typeof panel === 'string' ) {
      return panel + ' ' + selectors['Panel Creator Toggle'];
    }

    return selectors["Panel Creator Toggle"];
  }

  module.exports = ComponentPanelCreatorToggle;

} ();
