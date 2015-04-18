! function () {
  
  'use strict';

  var selectors = require('./selectors.json');

  function ComponentCreatorSubmit (creator) {

    if ( typeof creator === 'string' ) {
      return creator + ' ' + selectors['Creator Submit'];
    }

    return selectors["Creator Submit"];
  }

  module.exports = ComponentCreatorSubmit;

} ();
