module.exports = function (cb) {
  var domain = require('domain').create();

  if ( typeof cb !== 'function' ) {
    throw error;
  }

  domain.on('error', function (error) {
    cb(error);
  });

  domain.run(function () {
    var User = require('../models/User.model');

    User.find({}, domain.intercept(function (users) {
      cb(null, users);
    }));
  });
};
