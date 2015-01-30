! function () {

  'use strict';

  function toggleCreator ($creator) {
    if ( $creator.hasClass('is-showing') || $creator.hasClass('is-hiding') ) {
      return;
    }
    else if ( $creator.hasClass('is-shown') ) {
      div.controller('hide')($creator);
    }
    else {
      div.controller('reveal')($creator, view);
    }
  }

  module.exports = toggleCreator;

} ();
