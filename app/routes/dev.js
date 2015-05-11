! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function DevRoute (req, res, next) {
    var app = this;

    req.page = 'dev';


    next();
  }

  module.exports = DevRoute;

} ();
