! function () {

  'use strict';

  function findCreator (view) {
    return view.find('.creator:first');
  }

  module.exports = findCreator;

} ();
