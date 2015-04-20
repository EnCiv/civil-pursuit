! function () {
  
  'use strict';

  var selectors = require('./selectors.json');

  function ComponentItem (id) {

    if ( id ) {
      return '#' + selectors["Item ID Prefix"] + id;
    }

    return selectors.Item;
  }

  module.exports = ComponentItem;

} ();
