! function () {
  
  'use strict';

  var selectors = require('./selectors.json');

  function ComponentNewItem () {
    return selectors["New Item"];
  }

  module.exports = ComponentNewItem;

} ();
