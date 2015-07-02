! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function incrementPromotion (id, cb) {
    this.findByIdAndUpdate(id, { $inc: { "promotions": 1 } }, cb);
  }

  module.exports = incrementPromotion;

} ();
