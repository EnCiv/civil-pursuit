! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function toggle (box, cb) {
    var item = this;

    if ( item.template.hasClass('is-opened') ) {
      return item.close(box, cb);
    }

    if ( item.template.hasClass('is-opening') ) {
      return cb(new Error('Is opening'));
    }

    if ( item.template.hasClass('is-closing') ) {
      return cb(new Error('Is closing'));
    }

    item.open(box, cb);
  }

  module.exports = toggle;

} ();
