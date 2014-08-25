module.exports = function (cb) {
  var domain = require('domain').create();

  if ( typeof cb !== 'function' ) {
    throw error;
  }

  domain.on('error', function (error) {
    cb(error);
  });

  domain.run(function () {
    var mongoose = require('mongoose');

    if ( require('./mongoose').conn ) {
      return cb(null, require('./mongoose').conn);
    }

    var conn = mongoose.connect('mongodb://localhost:4567');

    conn.connection.on('error', cb);

    cb(null, conn);
  });
};