! function () {
  
  'use strict';

  var selectors = require('./selectors.json');

  function ComponentCreatorSubject (creator) {

    if ( typeof creator === 'string' ) {
      return creator + ' ' + selectors['Creator Subject'];
    }

    else if ( typeof creator === 'object' ) {
      var selector = '';

      if ( typeof creator.creator === 'string' ) {
        selector = creator.creator;
      }

      selector += ' ' + selectors['Creator Subject'];

      if ( creator.error ) {
        selector += selectors['Input Error'];
      }
    }

    return selectors["Creator Subject"];
  }

  module.exports = ComponentCreatorSubject;

} ();
