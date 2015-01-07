! function () {

  'use strict';

  function reveal (elem, poa) {
    if ( ! elem.hasClass('is-toggable') ) {
      elem.addClass('is-toggable');
    }

    if ( elem.hasClass('is-showing') || elem.hasClass('is-hiding') ) {
      return false;
    }

    elem.removeClass('is-hidden').addClass('is-showing');

    app.controller('scroll to point of attention')(poa, function () {
      app.controller('show')(elem);
      // elem.css('display', 'block');
    });
  }

  module.exports = reveal;

} ();
