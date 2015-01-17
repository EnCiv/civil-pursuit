! function () {

  'use strict';

  function _reveal (elem, poa, cb) {
    var app = this;

    elem.removeClass('is-hidden').addClass('is-showing');

    app.controller('scroll to point of attention')(poa, function () {
      app.controller('show')(elem, cb);
    });
  }

  function reveal (elem, poa, cb) {
    var app = this;

    if ( ! elem.hasClass('is-toggable') ) {
      elem.addClass('is-toggable');
    }

    if ( elem.hasClass('is-showing') || elem.hasClass('is-hiding') ) {
      return false;
    }

    // Eventual element to hide first

    var hider;

    // Find elem's panel

    var $panel = elem.closest('.panel');

    // Hide Creators if any

    if ( ! elem.hasClass('.creator') &&
      $panel.find('>.panel-body >.creator.is-shown').length ) {
      hider = $panel.find('>.panel-body >.creator.is-shown');
    }

    // If hiders

    if (  hider ) {
      app.controller('hide')(hider, function () {
        _reveal.apply(app, [elem, poa, cb]);
      });
    }

    else {
      _reveal.apply(app, [elem, poa, cb]);
    }
  }

  module.exports = reveal;

} ();
