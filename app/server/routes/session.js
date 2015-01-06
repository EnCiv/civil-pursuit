! function () {

  'use strict';

  function sessionMiddleware (req, res, next) {

    next();
  }

  module.exports = sessionMiddleware;

} ();
