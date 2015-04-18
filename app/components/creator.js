! function () {
  
  'use strict';

  var selectors = require('./selectors.json');

  function ComponentCreator (panel) {

    if ( typeof panel === 'string' ) {
      return panel + ' ' + selectors['Creator'];
    }

    return selectors["Creator"];
  }

  module.exports = ComponentCreator;

} ();
