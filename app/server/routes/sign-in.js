! function () {

  'use strict';

  function signIn (req, res, next) {

    // require('mongoose').connect(process.env.MONGOHQ_URL);

    var domain = require('domain').create();
    
    domain.on('error', function (error) {
      next(error);
    });
    
    domain.run(function () {

      var User = require('../../business/models/User');

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
          res.cookie('synuser',
            {
              email: user.email,
              id: user._id,
              prefs: user.preferences
            },
            require('../../business/config.json').cookie);
          
          res.json({
            in: true,
            user: user._id
          });
        }
      }));
    });
  }

  module.exports = signIn;

} ();
