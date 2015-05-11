! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function close (cb) {

    var item = this;

    setTimeout(function () {

      if ( item.template.hasClass('is-closed') ) {

        if ( typeof cb === 'function' ) {
          cb();
        }

        return;

      }

      if ( item.template.hasClass('is-closing') ) {

        if ( typeof cb === 'function' ) {
          cb();
        }

        return;

      }

      if ( item.template.hasClass('is-opening') ) {

        return;

      }

      item.template.removeClass('is-opened').addClass('is-closing');

    });

    return this;
  }

  module.exports = close;

} ();
    