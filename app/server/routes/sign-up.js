! function () {

  'use strict';

  function signUp (req, res, next) {

    var config = require('../../business/config.json');

    var monson = require('monson')(process.env.MONGOHQ_URL, {
      base: require('path').join(process.cwd(), 'app/business')
    });

    monson.post('models/User', {
      email: req.body.email,
      password: req.body.password
    })

      .on('error', function (error) {
        if ( /duplicate key/.test(error.message) ) {
          res.statusCode = 401;
          res.json({ error: 'username exists' });
        }
        else {
          next(error);
        }
      })

      .on('success', function (user) {
        res.cookie('synuser',
          { email: req.body.email, id: user._id },
          config.cookie);
        
        res.json(user);
      });
  }

  module.exports = signUp;

} ();
