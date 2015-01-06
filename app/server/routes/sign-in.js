! function () {

  'use strict';

  function signIn (req, res, next) {
    var monson    =   require('monson')(process.env.MONGOHQ_URL, {
      base: require('path').join(process.cwd(), 'app/business')
    });

    var url = 'models/User.identify/' + req.body.email + '/' + req.body.password;

    monson.get(url)

      .on('error', function (error) {
        if ( /^User not found/.test(error.message) ) {
          res.statusCode = 401;
          res.json({ 'user not found': req.body.email });
        }
        else {
          throw error;
        }
      })

      .on('success', function (user) {
        res.cookie('synuser',
          {
            email: user.email,
            id: user._id
          },
          require('../../business/config.json').cookie);
        
        res.json({ in: true });
      });
  }

  module.exports = signIn;

} ();
