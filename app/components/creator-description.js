! function () {
  
  'use strict';

  var selectors = require('./selectors.json');

  function ComponentCreatorDescripition (creator) {

    if ( typeof creator === 'string' ) {
      return creator + ' ' + selectors['Creator Description'];
    }

    else if ( typeof creator === 'object' ) {
      var selector = '';

      if ( typeof creator.creator === 'string' ) {
        selector = creator.creator;
      }

      selector += ' ' + selectors['Creator Description'];

      if ( creator.error ) {
        selector += selectors['Input Error'];
      }
    }

    return selectors["Creator Description"];
  }

  module.exports = ComponentCreatorDescripition;

} ();
