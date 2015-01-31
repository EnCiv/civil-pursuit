! function () {

  'use strict';

  function hide (elem, cb) {

    // if ANY element at all is in the process of being shown, then do nothing because it has the priority and is a blocker

    if ( elem.hasClass('.is-showing') || elem.hasClass('.is-hiding') ) {
      return false;
    }

    console.log('%c hide', 'font-weight: bold',
      (elem.attr('id') ? '#' + elem.attr('id') + ' ' : ''), elem.attr('class'));

    elem.removeClass('is-shown').addClass('is-hiding');;

    elem.find('.is-section:first').animate(
      {
        'margin-top': '-' + elem.height() + 'px',
        // 'padding-top': elem.height() + 'px'
      },

      1000,

      function () {
        elem.removeClass('is-hiding').addClass('is-hidden');

        if ( cb ) cb();
      });

    elem.animate({
       opacity: 0
      }, 1000);
  }

  module.exports = hide;

} ();
