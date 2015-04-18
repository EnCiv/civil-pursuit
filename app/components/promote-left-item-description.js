! function () {
  
  'use strict';

  var selectors = require('./selectors.json');

  function ComponentPromoteLeftItemDescription (options) {

    options = options || {};

    var selector = selectors['Promote Left Item Description'];

    if ( options.split ) {
      selector = '.split-hide-up ' + selector;
    }

    else {
      selector = '.split-hide-down ' + selector;
    }

    return selector;
  }

  module.exports = ComponentPromoteLeftItemDescription;

} ();
