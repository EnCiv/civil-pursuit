! function () {

  'use strict';

  var src = require(require('path').join(process.cwd(), 'src'));

  function signIn (req, res, next) {

    var domain = require('domain').create();
    
    domain.on('error', function (error) {
      next(error);
    });
    
    domain.run(function () {

      var User = src('models/User');

      User.identify(req.body.email, req.body.password, domain.bind(function (error, user) {
        if ( error ) {
          if ( /^User not found/.test(error.message) ) {
            res.statusCode = 404;
            res.json({ 'user not found': req.body.email });
          }
          else if ( /^Wrong password/.test(error.message) ) {
            res.statusCode = 401;
            res.json({ 'user not found': req.body.email });
          }
          else {
            throw error;
          }
        }
        else {
          req.user = user;
          next();
        }
      }));
    });
  }

  module.exports = signIn;

} ();
