; ! function () {

  'use strict';

  function show (elem, cb) {
    // if ANY element at all is in the process of being shown, then do nothing because it has the priority and is a blocker

    if ( elem.hasClass('.is-showing') || elem.hasClass('.is-hiding') ) {
      return false;
    }

    // make sure margin-top is equal to height for smooth scrolling

    elem.css('margin-top', '-' + elem.height() + 'px');

    // animate is-section

    elem.find('.is-section:first').animate(
      
      {
        'margin-top': 0,
        // 'padding-top': 0,
      },

      500,

      function () {
        elem.removeClass('is-showing').addClass('is-shown');
        
        if ( elem.css('margin-top') !== 0 ) {
          elem.animate({'margin-top': 0}, 250);
        }
        
        if ( cb ) {
          cb();
        }
      });

    elem.animate({
       opacity: 1
      }, 500);
  }

  module.exports = show;

}();
