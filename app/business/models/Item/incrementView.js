! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function incrementView (id, cb) {
    this.findByIdAndUpdate(id, { $inc: { "views": 1 } }, cb);
  }

  module.exports = incrementView;

} ();
