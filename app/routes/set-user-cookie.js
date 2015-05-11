! function () {
  
  'use strict';

  

  var config = require('syn/config.json');

  function setCookieUser (req, res, next) {
    res.cookie('synuser',
      { email: req.user.email, id: req.user._id },
      config.cookie);

    next();
  }

  module.exports = setCookieUser;

} ();
