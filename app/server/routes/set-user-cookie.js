! function () {
  
  'use strict';

  var src = require(require('path').join(process.cwd(), 'src'));

  var config = src('config');

  function setCookieUser (req, res, next) {
    res.cookie('synuser',
      { email: req.user.email, id: req.user._id },
      config.cookie);

    next();
  }

  module.exports = setCookieUser;

} ();
