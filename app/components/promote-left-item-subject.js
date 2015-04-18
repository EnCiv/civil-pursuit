! function () {
  
  'use strict';

  var selectors = require('./selectors.json');

  function ComponentPromoteLeftItemSubject (options) {

    options = options || {};

    var selector = selectors['Promote Left Item Subject'];

    if ( options.split ) {
      selector = '.split-hide-up ' + selector;
    }

    else {
      selector = '.split-hide-down ' + selector;
    }

    return selector;
  }

  module.exports = ComponentPromoteLeftItemSubject;

} ();
