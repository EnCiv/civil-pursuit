! function () {

  'use strict';

  function _reveal (elem, poa, cb) {


    var app = this;

    elem.removeClass('is-hidden').addClass('is-showing');

    if ( poa ) {
       console.log('revealing with POA')

      app.controller('scroll to point of attention')(poa, function () {
        app.controller('show')(elem, cb);
      });
    }

    else {
      console.log('revealing without POA')
      app.controller('show')(elem, cb);
    }
  }

  function reveal (elem, poa, cb) {

    var app = this;

    if ( ! elem.hasClass('is-toggable') ) {
      elem.addClass('is-toggable');
    }

    console.log('%c reveal', 'font-weight: bold',
      (elem.attr('id') ? '#' + elem.attr('id') + ' ' : ''), elem.attr('class'));

    // Eventual element to hide first

    var hider;

    // Find elem's panel

    var $panel = elem.closest('.panel');

    // Find elem's item if any

    var $item = elem.closest('.item');

    // Don't animate if something else is animating

    // if ( $item.find('.is-showing').length || $item.find('.is-hiding').length ) {
    //   console.log('revealing', 'other animations in progress in item');
    //   return cb(new Error('arrrgh so'));
    // }

    // // Hide Creators if any

    // if ( ! elem.hasClass('.creator') &&
    //   $panel.find('>.panel-body >.creator.is-shown').length ) {
    //   hider = $panel.find('>.panel-body >.creator.is-shown');
    // }

    // // Hide other shown elements that share same item's level

    // if ( $item.length && $item.find('.is-shown').not('.children').length ) {
    //   hider = $item.find('.is-shown').not('.children');
    // }

    // If hiders

    if (  hider ) {
      // app.controller('hide')(hider, function () {
      //   _reveal.apply(app, [elem, poa, cb]);
      // });
    }

    else {
      _reveal.apply(app, [elem, poa, cb]);
    }
  }

  module.exports = reveal;

} ();
